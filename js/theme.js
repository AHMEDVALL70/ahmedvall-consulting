/* ============ THEME & LANGUAGE (shared across all pages) ============ */
/* يعتمد هذا الملف على وجود كائن translations من js/translations.js، ويجب تحميله بعده */

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

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.addEventListener('click', toggleLanguage);

    const menuBtn = document.getElementById('menuToggle');
    if (menuBtn) menuBtn.addEventListener('click', toggleMobileMenu);
}

/* ============ THEME ============ */
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('site_theme', currentTheme);
    applyTheme(currentTheme);
}

function applyTheme(theme) {
    const themeBtn = document.getElementById('theme-toggle');
    const t = translations[currentLang];
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        setText('theme-text', t.themeTextDark);
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-sun';
        }
    } else {
        document.documentElement.removeAttribute('data-theme');
        setText('theme-text', t.themeText);
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-moon';
        }
    }
}

/* ============ LANGUAGE ============ */
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('site_lang', currentLang);
    applyLanguage(currentLang);
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function applyLanguage(lang) {
    const t = translations[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = t.pageTitle;

    setText('logo-text', t.logoText);
    setText('nav-services', t.navServices);
    setText('nav-projects', t.navProjects);
    setText('nav-testimonials', t.navTestimonials);
    setText('nav-about', t.navAbout);
    setText('nav-contact', t.navContact);

    setText('hero-badge', t.heroBadge);
    setText('hero-title', t.heroTitle);
    setText('hero-subtitle', t.heroSubtitle);
    setText('btn-explore-services', t.btnExploreServices);
    setText('btn-direct-contact', t.btnDirectContact);
    setText('feat-h1', t.featH1); setText('feat-p1', t.featP1);
    setText('feat-h2', t.featH2); setText('feat-p2', t.featP2);
    setText('feat-h3', t.featH3); setText('feat-p3', t.featP3);

    setText('services-title', t.servicesTitle);
    setText('services-subtitle', t.servicesSubtitle);
    renderServices(t);

    setText('projects-title', t.projectsTitle);
    renderProjects(t);

    setText('testimonials-title', t.testimonialsTitle);
    renderTestimonials(t);

    setText('contact-title', t.contactTitle);
    setText('contact-subtitle', t.contactSubtitle);
    setText('contact-location', t.contactLocation);
    setText('contact-form-title', t.contactFormTitle);
    setText('lbl-c-name', t.lblCName);
    setText('lbl-c-email', t.lblCEmail);
    setText('lbl-c-phone', t.lblCPhone);
    setText('lbl-c-subject', t.lblCSubject);
    setText('lbl-c-message', t.lblCMessage);
    setText('opt-general', t.optGeneral);
    setText('opt-consulting', t.optConsulting);
    setText('opt-project', t.optProject);
    setText('opt-other', t.optOther);
    setText('btn-c-submit-txt', t.btnCSubmit);
    setText('contactSuccessMsg', t.contactSuccessMsg);
    setText('contactErrorMsg', t.contactErrorMsg);

    setText('about-heading', t.aboutHeading);
    setText('about-p', t.aboutP);
    setText('about-p2', t.aboutP2);
    renderAboutList(t);
    setText('stat-proj', t.statProj);
    setText('stat-exp', t.statExp);
    setText('stat-lead', t.statLead);
    setText('btn-github', t.btnGithub);
    setText('btn-cv', t.btnCv);

    setText('copyright-txt', t.copyrightTxt);

    setText('modal-title', t.modalTitle);
    setText('lbl-srv', t.lblSrv);
    setText('lbl-name', t.lblName);
    setText('lbl-email', t.lblEmail);
    setText('lbl-phone', t.lblPhone);
    setText('lbl-message', t.lblMessage);
    setText('btn-submit-txt', t.btnSubmit);
    setText('successMsg', t.successMsg);
    setText('errorMsg', t.errorMsg);

    setText('chat-btn-label', t.chatBtnLabel);
    setText('chat-header-txt', t.chatHeaderTxt);

    const chatWelcomeEl = document.querySelector('#chatBody .chat-msg.bot span');
    if (chatWelcomeEl && document.querySelectorAll('#chatBody .chat-msg').length === 1) {
        chatWelcomeEl.textContent = t.chatWelcome;
    }

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        const span = langToggle.querySelector('span');
        if (span) span.textContent = lang === 'ar' ? 'English' : 'عربي';
    }

    updateActiveNavLink();
}

/* يحدد رابط الناف بار النشط بناءً على اسم الصفحة الحالية في الرابط (لا يحتاج جافاسكريبت SPA) */
function updateActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const pageMap = {
        'index.html': 'nav-home',
        '': 'nav-home',
        'services.html': 'nav-services',
        'projects.html': 'nav-projects',
        'testimonials.html': 'nav-testimonials',
        'about.html': 'nav-about',
        'contact.html': 'nav-contact'
    };
    const activeId = pageMap[path];

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });

    if (activeId) {
        const activeLink = document.getElementById(activeId);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    }
}

/* ============ DYNAMIC CONTENT RENDERING (guarded: only runs if the container exists on the current page) ============ */
function renderServices(t) {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    grid.innerHTML = t.services.map((s, idx) => `
        <div class="service-card">
            <div>
                <i class="fa-solid ${s.icon} srv-icon"></i>
                <h3 class="srv-title">${s.title}</h3>
                <p class="srv-desc">${s.desc}</p>
            </div>
            <button class="book-btn" onclick="openBookingModal(${idx})">
                <span>${t.bookBtnText}</span>
                <i class="fa-solid fa-arrow-left"></i>
            </button>
        </div>
    `).join('');
}

function renderProjects(t) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = t.projects.map((p) => `
        <div class="project-card">
            <div>
                <span class="project-tag">${p.tag}</span>
                <h3 class="project-title">${p.title}</h3>
                <p class="project-desc">${p.desc}</p>
                <div class="project-techs">
                    ${p.techs.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
            </div>
            <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="project-link">
                <span>${p.linkText}</span>
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
        </div>
    `).join('');
}

function renderTestimonials(t) {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    grid.innerHTML = t.testimonials.map((item) => `
        <div class="testimonial-card">
            <div class="testimonial-stars">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
            </div>
            <p>${item.text}</p>
            <div class="author-info">
                <h4>${item.author}</h4>
                <span>${item.role}</span>
            </div>
        </div>
    `).join('');
}

function renderAboutList(t) {
    const list = document.getElementById('aboutList');
    if (!list) return;
    list.innerHTML = t.aboutItems.map(item => `<li><i class="fa-solid fa-check"></i> <span>${item}</span></li>`).join('');
}

/* ============ MOBILE MENU ============ */
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.getElementById('menuToggle');
    if (!navLinks || !menuBtn) return;
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
}

function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.getElementById('menuToggle');
    if (!navLinks || !menuBtn) return;
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'فتح القائمة');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => closeMobileMenu());
});
