let currentLang = localStorage.getItem('site_lang') || 'ar';
let currentTheme = localStorage.getItem('site_theme') || 'light';

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    applyLanguage(currentLang);
    attachThemeLangListeners();
});

function attachThemeLangListeners() {
    // Theme toggle
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
        btn.addEventListener('click', toggleTheme);
    });

    // Language buttons
    document.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang) setLanguage(lang);
        });
    });
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('site_theme', currentTheme);
    applyTheme(currentTheme);
}

function setLanguage(lang) {
    if (lang !== 'ar' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem('site_lang', currentLang);
    applyLanguage(currentLang);
    
    // Re-run chat greeting if chat is open
    const chatBody = document.getElementById('chatBody');
    if(chatBody && chatBody.querySelector('.chat-msg.bot') === null && typeof displayBotMessage === 'function') {
         displayBotMessage(translations[currentLang].chatWelcome);
    }
}

function updateLangButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
        const active = btn.getAttribute('data-lang') === lang;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
    });
}

function applyTheme(theme) {
    const themeBtns = document.querySelectorAll('[data-theme-toggle]');
    if (!themeBtns.length) return;

    const t = translations[currentLang] || translations['en'];
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateElement('theme-text', t.themeToggleDark);
        themeBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-sun';
        });
    } else {
        document.documentElement.removeAttribute('data-theme');
        updateElement('theme-text', t.themeToggle);
        themeBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-moon';
        });
    }
}

function updateElement(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.title = t.docTitle;

    updateElement('logo-text', t.logoText);
    updateElement('nav-services', t.navServices);
    updateElement('nav-projects', t.navProjects);
    updateElement('nav-testimonials', t.navTestimonials);
    updateElement('nav-about', t.navAbout);
    updateElement('nav-contact', t.navContact);
    updateElement('skip-link', t.skipLink);

    updateElement('theme-text', currentTheme === 'dark' ? t.themeToggleDark : t.themeToggle);
    updateLangButtons(lang);

    const menuBtn = document.getElementById('menu-toggle');
    if (menuBtn) {
        const open = document.getElementById('navLinks')?.classList.contains('open');
        menuBtn.setAttribute('aria-label', open ? t.menuClose : t.menuOpen);
    }

    updateElement('hero-badge', t.heroBadge);
    updateElement('hero-title', t.heroTitle);
    updateElement('hero-subtitle', t.heroSubtitle);
    updateElement('btn-explore-services', t.btnExploreServices);
    updateElement('btn-direct-contact', t.btnDirectContact);

    const arrowIcon = document.getElementById('hero-arrow-icon');
    if (arrowIcon) arrowIcon.className = `fa-solid ${t.heroArrowIcon}`;

    updateElement('services-title', t.servicesTitle);
    updateElement('projects-title', t.projectsTitle);
    updateElement('testimonials-title', t.testimonialsTitle);
    updateElement('contact-title', t.contactTitle);
    updateElement('contact-subtitle', t.contactSubtitle);
    updateElement('copyright-txt', t.copyrightTxt);

    // Update Services (requires ID on the headers, handled in HTML generation)
    const srvTitles = document.querySelectorAll('.srv-title');
    const srvDescs = document.querySelectorAll('.srv-desc');
    if(srvTitles.length) {
        t.services.forEach((srv, idx) => {
            if (srvTitles[idx]) srvTitles[idx].textContent = srv.title;
            if (srvDescs[idx]) srvDescs[idx].textContent = srv.desc;
        });
    }

    // Update Testimonials
    t.testimonials.forEach((item, idx) => {
        const i = idx + 1;
        updateElement(`test-text${i}`, item.text);
        updateElement(`test-auth${i}`, item.author);
        updateElement(`test-role${i}`, item.role);
    });

    // About Page
    updateElement('about-heading', t.aboutHeading);
    updateElement('about-p', t.aboutP);
    document.querySelectorAll('#about-list .item-txt').forEach((el, idx) => {
        if (t.aboutList[idx]) el.textContent = t.aboutList[idx];
    });

    updateElement('btn-github-txt', t.btnGithub);
    updateElement('btn-cv-txt', t.btnCv);

    const btnCv = document.getElementById('btn-cv');
    if (btnCv && t.cvFile) btnCv.href = t.cvFile;

    // Contact Modal
    updateElement('modal-title', t.modalTitle);
    updateElement('lbl-srv', t.lblSrv);
    updateElement('lbl-name', t.lblName);
    updateElement('lbl-email', t.lblEmail);
    updateElement('lbl-phone', t.lblPhone);
    updateElement('lbl-message', t.lblMessage);
    updateElement('btn-submit', t.btnSubmit);
    updateElement('successMsg', t.successMsg);
    updateElement('errorMsg', t.errorMsg);

    const fullName = document.getElementById('fullName');
    if (fullName) fullName.placeholder = t.namePlaceholder;
    const message = document.getElementById('bookingMessage');
    if (message) message.placeholder = t.msgPlaceholder;

    // Chat
    updateElement('chat-header-txt', t.chatHeader);
    
    const chatInput = document.getElementById('chatInput');
    if (chatInput) chatInput.placeholder = t.chatPlaceholder;

    const chipsContainer = document.getElementById('chatChips');
    if (chipsContainer) {
        chipsContainer.innerHTML = '';
        t.chips.forEach((chip) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chip-btn';
            btn.textContent = chip;
            btn.addEventListener('click', () => sendChip(chip));
            chipsContainer.appendChild(btn);
        });
    }

    // Update chat welcome message
    const chatBody = document.getElementById('chatBody');
    if (chatBody) {
        const welcomeMsg = chatBody.querySelector('.chat-msg.bot');
        if(welcomeMsg) welcomeMsg.textContent = t.chatWelcome;
    }
}