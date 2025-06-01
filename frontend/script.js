async function loadFestivals() {
    const response = await fetch('/api/festivals', { headers: { 'ngrok-skip-browser-warning': 'true' } });
    const festivals = await response.json();
    const container = document.getElementById('festivals');
    festivals.forEach(festival => {
        const div = document.createElement('div');
        div.classList.add('festival');
        div.innerHTML = `
            <img src="/images/${festival.image}" alt="affiche ${festival.nom}" width="200"/><br>
            <h2>${festival.nom}</h2>
            <p>${festival.date} - ${festival.lieu}</p>
            <a href="/static/festival.html?id=${festival.id}">Voir/Proposer un trajet</a>
        `;
        container.appendChild(div);
    });
}

async function loadTrajets(festival_id) {
    const response = await fetch(`/api/trajets/${festival_id}`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
    const trajets = await response.json();
    const container = document.getElementById('trajets');
    container.innerHTML = '';
    trajets.forEach((trajet, index) => {
        const div = document.createElement('div');
        const completedClass = trajet.complet ? "style='text-decoration:line-through;color:gray'" : "";
        div.innerHTML = `
            <div ${completedClass}>
                <p>Départ: ${trajet.depart} à ${trajet.heure} - Places: ${trajet.places} - Contact: ${trajet.contact}</p>
                <input type="password" id="secret-${index}" placeholder="Mot-clé secret">
                <button onclick="markComplet(${festival_id}, ${index})">Complet</button>
                <button onclick="deleteTrajet(${festival_id}, ${index})">Supprimer</button>
            </div>
        `;
        container.appendChild(div);
    });
}

async function addTrajet(festival_id) {
    const depart = document.getElementById('depart').value;
    const heure = document.getElementById('heure').value;
    const places = document.getElementById('places').value;
    const contact = document.getElementById('contact').value;
    const secret = document.getElementById('secret').value;

    const trajet = {
        festival_id: festival_id,
        depart: depart,
        heure: heure,
        places: parseInt(places),
        contact: contact,
        secret: secret,
        complet: false
    };

    await fetch('/api/trajets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify(trajet)
    });

    loadTrajets(festival_id);
}

async function markComplet(festival_id, index) {
    const secret = document.getElementById(`secret-${index}`).value;
    await fetch(`/api/trajets/${festival_id}/complet`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ index, secret })
    });
    loadTrajets(festival_id);
}

async function deleteTrajet(festival_id, index) {
    const secret = document.getElementById(`secret-${index}`).value;
    await fetch(`/api/trajets/${festival_id}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ index, secret })
    });
    loadTrajets(festival_id);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('festivals')) {
        loadFestivals();
    }

    const festivalId = new URLSearchParams(window.location.search).get('id');
    if (festivalId) {
        loadTrajets(festivalId);
        document.getElementById('trajet-form').addEventListener('submit', (e) => {
            e.preventDefault();
            addTrajet(parseInt(festivalId));
        });
    }
});
