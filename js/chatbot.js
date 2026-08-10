/* ============ CHAT WIDGET (shared across all pages) ============ */
/* يعتمد على وجود translations وcurrentLang (من js/theme.js) ويجب تحميله بعدهما */

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.chat-widget-btn');
    const closeBtn = document.querySelector('#chatWidget .close-chat');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.querySelector('.chat-footer button');

    if (toggleBtn) toggleBtn.addEventListener('click', toggleChat);
    if (closeBtn) closeBtn.addEventListener('click', toggleChat);
    if (sendBtn) sendBtn.addEventListener('click', sendChatMessage);
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const chatWidget = document.getElementById('chatWidget');
        if (chatWidget && chatWidget.classList.contains('active')) toggleChat();
    });
});

function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    const toggleBtn = document.querySelector('.chat-widget-btn');
    if (!chatWidget) return;
    const isOpen = chatWidget.classList.toggle('active');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', String(isOpen));
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const t = translations[currentLang];
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.textContent = text;
    chatBody.appendChild(userMsg);
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg bot';
        botMsg.textContent = getChatReply(text, t);
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 500);
}

function getChatReply(userText, t) {
    const lowerText = userText.toLowerCase();
    const matched = (t.chatReplies || []).find(entry =>
        entry.keywords.some(kw => lowerText.includes(kw.toLowerCase()))
    );
    return matched ? matched.reply : t.chatReply;
}
