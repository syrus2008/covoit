
fetch("/festivals")
  .then(res => res.json())
  .then(festivals => {
    const track = document.getElementById("carousel-track");
    track.innerHTML = festivals.map(f => `
      <div class="carousel-card">
        <img src="/static/img/${f.image}" alt="${f.nom}">
        <h2>${f.nom}</h2>
        <a href="/festival/${f.id}">Voir les trajets</a>
      </div>
    `).join('');
  });

function scrollCarousel(direction) {
  const track = document.getElementById("carousel-track");
  const width = track.querySelector(".carousel-card").offsetWidth;
  track.scrollBy({ left: width * direction, behavior: 'smooth' });
}
