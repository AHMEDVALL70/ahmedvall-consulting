/* Booking modal — automatic email via FormSubmit */
const BOOKING_EMAIL = 'ahmedvalljemaldine@gmail.com';
let modal = null;
let lastFocus = null;

function openBookingModal(serviceIndex) {
    if (!modal || typeof translations === 'undefined') return;

    lastFocus = document.activeElement;
    const selectedService = translations[currentLang].services[serviceIndex].title;
    document.getElementById('serviceName').value = selectedService;
    document.getElementById('successAlert').classList.remove('show');
    document.getElementById('errorAlert').classList.remove('show');
    document.getElementById('bookingForm').reset();
    document.getElementById('serviceName').value = selectedService;
    clearErrors();

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (typeof refreshCountryPicker === 'function') {
        const wrap = document.getElementById('countryPicker');
        if (wrap) wrap.classList.remove('open');
    }

    const firstInput = document.getElementById('fullName');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
}

function closeBookingModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}

function clearErrors() {
    document.querySelectorAll('.form-group').forEach((group) => group.classList.remove('error'));
}

function showFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const group = field.closest('.form-group');
    if (group) group.classList.add('error');
}

function handleFormSubmit(event) {
    event.preventDefault();
    clearErrors();

    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const countryCode = document.getElementById('countryCode').value;
    const phone = document.getElementById('phone').value.trim().replace(/\s+/g, '');
    const message = document.getElementById('bookingMessage').value.trim();
    const service = document.getElementById('serviceName').value;

    let isValid = true;

    if (name.length < 3) {
        showFieldError('fullName');
        isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('email');
        isValid = false;
    }

    if (!/^\d{5,12}$/.test(phone)) {
        showFieldError('phone');
        isValid = false;
    }

    if (message.length < 5) {
        showFieldError('bookingMessage');
        isValid = false;
    }

    if (!isValid) return;

    submitViaEmail({
        service,
        name,
        email,
        phone: countryCode + phone,
        message
    });
}

async function submitViaEmail(data) {
    const submitBtn = document.getElementById('btn-submit');
    const originalText = submitBtn ? submitBtn.textContent : '';
    const t = translations[currentLang];
    const isAr = currentLang === 'ar';
    const subject = isAr
        ? `طلب حجز جلسة — ${data.service}`
        : `Consultation Booking — ${data.service}`;

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '...';
    }

    document.getElementById('successAlert').classList.remove('show');
    document.getElementById('errorAlert').classList.remove('show');

    try {
        const response = await fetch(`https://formsubmit.co/ajax/${BOOKING_EMAIL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                _replyto: data.email,
                phone: data.phone,
                service: data.service,
                message: data.message,
                _subject: subject,
                _template: 'table',
                _captcha: 'false'
            })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || 'Submit failed');
        }

        // First-time FormSubmit often only sends an activation email
        const successEl = document.getElementById('successMsg');
        if (successEl) {
            successEl.textContent = t.successMsgActivate;
        }
        document.getElementById('successAlert').classList.add('show');
        document.getElementById('bookingForm').reset();
        document.getElementById('serviceName').value = data.service;

        setTimeout(() => closeBookingModal(), 5000);
    } catch (err) {
        console.error('Email send error:', err);
        const errorEl = document.getElementById('errorMsg');
        if (errorEl) errorEl.textContent = t.errorMsg;
        document.getElementById('errorAlert').classList.add('show');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText || t.btnSubmit;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    modal = document.getElementById('bookingModal');
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) bookingForm.addEventListener('submit', handleFormSubmit);

    const closeBtn = document.querySelector('#bookingModal .close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeBookingModal);

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeBookingModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeBookingModal();
        }
    });

    document.querySelectorAll('[data-book]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.getAttribute('data-book'));
            openBookingModal(idx);
        });
    });
});
