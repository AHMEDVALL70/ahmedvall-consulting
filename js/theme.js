/* Theme & language */
let currentLang = localStorage.getItem('site_lang') || 'ar';
let currentTheme = localStorage.getItem('site_theme') || 'light';

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    applyLanguage(currentLang);
    attachThemeLangListeners();
});

function attachThemeLangListeners() {
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

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
}

function updateLangButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
        const active = btn.getAttribute('data-lang') === lang;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
    });
}

function applyTheme(theme) {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    const t = translations[currentLang];
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateElement('theme-text', t.themeToggleDark);
        const icon = themeBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-sun';
    } else {
        document.documentElement.removeAttribute('data-theme');
        updateElement('theme-text', t.themeToggle);
        const icon = themeBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-moon';
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
        const open = document.getElementById('nav-drawer')?.classList.contains('open');
        menuBtn.setAttribute('aria-label', open ? t.menuClose : t.menuOpen);
    }

    updateElement('hero-badge', t.heroBadge);
    updateElement('hero-title', t.heroTitle);
    updateElement('hero-subtitle', t.heroSubtitle);
    updateElement('btn-explore-services', t.btnExploreServices);
    updateElement('btn-direct-contact', t.btnDirectContact);

    const arrowIcon = document.getElementById('hero-arrow-icon');
    if (arrowIcon) arrowIcon.className = `fa-solid ${t.heroArrowIcon}`;

    updateElement('feat-h1', t.featH1);
    updateElement('feat-p1', t.featP1);
    updateElement('feat-h2', t.featH2);
    updateElement('feat-p2', t.featP2);
    updateElement('feat-h3', t.featH3);
    updateElement('feat-p3', t.featP3);

    updateElement('services-title', t.servicesTitle);
    updateElement('projects-title', t.projectsTitle);
    updateElement('testimonials-title', t.testimonialsTitle);
    updateElement('contact-title', t.contactTitle);
    updateElement('contact-subtitle', t.contactSubtitle);
    updateElement('copyright-txt', t.copyrightTxt);

    updateElement('proj1-tag', t.proj1Tag);
    updateElement('proj1-title', t.proj1Title);
    updateElement('proj1-desc', t.proj1Desc);
    updateElement('proj1-link', t.proj1Link);
    updateElement('proj2-tag', t.proj2Tag);
    updateElement('proj2-title', t.proj2Title);
    updateElement('proj2-desc', t.proj2Desc);
    updateElement('proj2-link', t.proj2Link);
    updateElement('proj3-tag', t.proj3Tag);
    updateElement('proj3-title', t.proj3Title);
    updateElement('proj3-desc', t.proj3Desc);
    updateElement('proj3-link', t.proj3Link);

    const srvTitles = document.querySelectorAll('.srv-title');
    const srvDescs = document.querySelectorAll('.srv-desc');
    t.services.forEach((srv, idx) => {
        if (srvTitles[idx]) srvTitles[idx].textContent = srv.title;
        if (srvDescs[idx]) srvDescs[idx].textContent = srv.desc;
    });

    document.querySelectorAll('.book-btn .btn-text').forEach((btn) => {
        btn.textContent = t.bookBtn;
    });
    document.querySelectorAll('.arrow-icon').forEach((icon) => {
        icon.className = `fa-solid ${t.arrowIcon} arrow-icon`;
    });

    t.testimonials.forEach((item, idx) => {
        const i = idx + 1;
        updateElement(`test-text${i}`, item.text);
        updateElement(`test-auth${i}`, item.author);
        updateElement(`test-role${i}`, item.role);
    });

    updateElement('about-heading', t.aboutHeading);
    updateElement('about-p', t.aboutP);
    document.querySelectorAll('#about-list .item-txt').forEach((el, idx) => {
        if (t.aboutList[idx]) el.textContent = t.aboutList[idx];
    });

    updateElement('btn-github-txt', t.btnGithub);
    updateElement('btn-cv-txt', t.btnCv);

    const btnCv = document.getElementById('btn-cv');
    if (btnCv && t.cvFile) btnCv.href = t.cvFile;

    updateElement('stat-proj', t.statProj);
    updateElement('stat-exp', t.statExp);

    updateElement('modal-title', t.modalTitle);
    updateElement('lbl-srv', t.lblSrv);
    updateElement('lbl-name', t.lblName);
    updateElement('lbl-email', t.lblEmail);
    updateElement('lbl-phone', t.lblPhone);
    updateElement('lbl-message', t.lblMessage);
    updateElement('err-name', t.errName);
    updateElement('err-email', t.errEmail);
    updateElement('err-phone', t.errPhone);
    updateElement('err-msg', t.errMsg);
    updateElement('btn-submit', t.btnSubmit);
    updateElement('successMsg', t.successMsg);
    updateElement('errorMsg', t.errorMsg);

    const fullName = document.getElementById('fullName');
    if (fullName) fullName.placeholder = t.namePlaceholder;
    const message = document.getElementById('bookingMessage');
    if (message) message.placeholder = t.msgPlaceholder;

    updateElement('chat-btn-label', t.chatBtn);
    updateElement('chat-header-txt', t.chatHeader);
    updateElement('chat-welcome', t.chatWelcome);

    const chatInput = document.getElementById('chatInput');
    if (chatInput) chatInput.placeholder = t.chatPlaceholder;

    const countrySearch = document.getElementById('countrySearch');
    if (countrySearch) countrySearch.placeholder = t.countrySearchPlaceholder;
    if (typeof refreshCountryPicker === 'function') refreshCountryPicker();

    const chips = document.getElementById('chatChips');
    if (chips) {
        chips.innerHTML = '';
        t.chips.forEach((chip) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chip-btn';
            btn.textContent = chip;
            btn.addEventListener('click', () => sendChip(chip));
            chips.appendChild(btn);
        });
    }
}
