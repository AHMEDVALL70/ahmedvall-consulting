/* ============ BOOKING MODAL + CONTACT FORM ============ */
/* يعتمد على وجود translations وcurrentLang (من js/theme.js). آمن للتحميل في أي صفحة:
   كل دالة تتحقق من وجود عناصرها قبل العمل، فلا تكسر الصفحات اللي مفيهاش مودال حجز أو فورم تواصل. */

const CONTACT_EMAIL = 'ahmedvalljemaldine@gmail.com';

/* ============ BOOKING MODAL (services.html) ============ */
function openBookingModal(idx) {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    const t = translations[currentLang];
    document.getElementById('serviceName').value = t.services[idx].title;
    document.getElementById('successAlert').classList.remove('show');
    document.getElementById('errorAlert').classList.remove('show');
    document.getElementById('bookingForm').reset();
    document.getElementById('serviceName').value = t.services[idx].title;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const t = translations[currentLang];
    const service = document.getElementById('serviceName').value;
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const countryCode = document.getElementById('countryCode').value;
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('bookingMessage').value.trim();

    const errorAlertEl = document.getElementById('errorAlert');
    const errorMsgEl = document.getElementById('errorMsg');

    if (name.length < 3 || !email.includes('@')) {
        errorMsgEl.textContent = t.formRequiredAlert;
        errorAlertEl.classList.add('show');
        document.getElementById('successAlert').classList.remove('show');
        return;
    }

    const submitBtn = document.getElementById('btn-submit');
    submitBtn.disabled = true;
    document.getElementById('successAlert').classList.remove('show');
    errorAlertEl.classList.remove('show');

    try {
        const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                name, email, _replyto: email,
                phone: countryCode + phone,
                service, message,
                _subject: `طلب حجز جلسة — ${service}`,
                _template: 'table',
                _captcha: 'false'
            })
        });
        if (!response.ok) throw new Error('Submit failed');

        document.getElementById('successAlert').classList.add('show');
        document.getElementById('bookingForm').reset();
        document.getElementById('serviceName').value = service;
        setTimeout(() => closeBookingModal(), 3000);
    } catch (err) {
        console.error('Booking submit error:', err);
        errorMsgEl.textContent = t.errorMsg;
        errorAlertEl.classList.add('show');
    } finally {
        submitBtn.disabled = false;
    }
}

/* ============ CONTACT PAGE FORM (contact.html) ============ */
async function handleContactFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    const subject = document.getElementById('c-subject').value;
    const message = document.getElementById('c-message').value.trim();
    const t = translations[currentLang];

    const contactErrorAlertEl = document.getElementById('contactErrorAlert');
    const contactErrorMsgEl = document.getElementById('contactErrorMsg');

    if (!name || !email || !message) {
        contactErrorMsgEl.textContent = t.formRequiredAlert;
        contactErrorAlertEl.classList.add('show');
        document.getElementById('contactSuccessAlert').classList.remove('show');
        return;
    }

    const submitBtn = document.getElementById('btn-c-submit');
    submitBtn.disabled = true;
    document.getElementById('contactSuccessAlert').classList.remove('show');
    contactErrorAlertEl.classList.remove('show');

    try {
        const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                name, email, _replyto: email,
                phone: phone || 'غير مدخل',
                subject, message,
                _subject: `اتصال من ${name} — ${subject}`,
                _template: 'table',
                _captcha: 'false'
            })
        });
        if (!response.ok) throw new Error('Submit failed');

        document.getElementById('contactSuccessAlert').classList.add('show');
        document.getElementById('contactForm').reset();
        setTimeout(() => document.getElementById('contactSuccessAlert').classList.remove('show'), 6000);
    } catch (err) {
        console.error('Contact submit error:', err);
        contactErrorMsgEl.textContent = t.contactErrorMsg;
        contactErrorAlertEl.classList.add('show');
    } finally {
        submitBtn.disabled = false;
    }
}

/* ============ WIRING (guarded — safe on any page) ============ */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('bookingModal');
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) bookingForm.addEventListener('submit', handleFormSubmit);

    const closeBtn = document.querySelector('#bookingModal .close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeBookingModal);

    if (modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeBookingModal(); });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeBookingModal();
        }
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) contactForm.addEventListener('submit', handleContactFormSubmit);
});
