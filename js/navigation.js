/* Navigation, hash routing, mobile menu */
const VALID_PAGES = ['home', 'services', 'projects', 'testimonials', 'about', 'contact'];

function switchPage(pageId, pushHash = true) {
    if (!VALID_PAGES.includes(pageId)) pageId = 'home';

    document.querySelectorAll('.page-view').forEach((page) => page.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach((link) => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });

    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) targetPage.classList.add('active');

    const targetNav = document.getElementById(`nav-${pageId}`);
    if (targetNav) {
        targetNav.classList.add('active');
        targetNav.setAttribute('aria-current', 'page');
    }

    if (pushHash) {
        const hash = pageId === 'home' ? '#home' : `#${pageId}`;
        if (location.hash !== hash) {
            history.pushState(null, '', hash);
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMobileMenu();

    const chatBox = document.getElementById('chatWidget');
    if (chatBox && chatBox.classList.contains('active') && typeof toggleChat === 'function') {
        if (typeof chatOpen !== 'undefined' && chatOpen) toggleChat();
    }
}

function getPageFromHash() {
    const hash = (location.hash || '#home').replace('#', '') || 'home';
    return VALID_PAGES.includes(hash) ? hash : 'home';
}

function closeMobileMenu() {
    const drawer = document.getElementById('nav-drawer');
    const btn = document.getElementById('menu-toggle');
    if (drawer) drawer.classList.remove('open');
    if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        const t = typeof translations !== 'undefined' ? translations[currentLang] : null;
        if (t) btn.setAttribute('aria-label', t.menuOpen);
    }
    document.body.classList.remove('menu-open');
}

function toggleMobileMenu() {
    const drawer = document.getElementById('nav-drawer');
    const btn = document.getElementById('menu-toggle');
    if (!drawer || !btn) return;

    const open = !drawer.classList.contains('open');
    drawer.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);

    const t = translations[currentLang];
    btn.setAttribute('aria-label', open ? t.menuClose : t.menuOpen);
}

document.addEventListener('DOMContentLoaded', () => {
    switchPage(getPageFromHash(), false);

    window.addEventListener('hashchange', () => {
        switchPage(getPageFromHash(), false);
    });

    const menuBtn = document.getElementById('menu-toggle');
    if (menuBtn) menuBtn.addEventListener('click', toggleMobileMenu);

    const overlay = document.getElementById('nav-overlay');
    if (overlay) overlay.addEventListener('click', closeMobileMenu);

    document.querySelectorAll('[data-page]').forEach((el) => {
        el.addEventListener('click', (e) => {
            const page = el.getAttribute('data-page');
            if (!page) return;
            if (el.tagName === 'A') e.preventDefault();
            switchPage(page);
        });

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const page = el.getAttribute('data-page');
                if (!page) return;
                e.preventDefault();
                switchPage(page);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });
});
