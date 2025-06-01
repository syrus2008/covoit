// Chat JS (à placer à la fin du script.js existant)
const chatContainer = document.getElementById('chat-container');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatUsername = document.getElementById('chat-username');
const chatForm = document.getElementById('chat-form');

function loadChat() {
    fetch('/chat')
        .then(res => res.json())
        .then(data => {
            chatMessages.innerHTML = '';
            data.forEach(msg => {
                const p = document.createElement('p');
                p.textContent = `[${msg.username}] ${msg.message}`;
                chatMessages.appendChild(p);
            });
        });
}

chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = chatInput.value;
    const username = chatUsername.value || "Anonyme";
    fetch('/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, message})
    }).then(() => {
        chatInput.value = '';
        loadChat();
    });
});

setInterval(loadChat, 5000);
window.addEventListener('DOMContentLoaded', loadChat);