document.querySelectorAll('.js-current-year').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
});

const contactForm = document.getElementById('contact-form');
const contactToast = document.getElementById('contact-toast');
const contactSubmitButton = document.getElementById('contact-submit');

if (
    contactForm instanceof HTMLFormElement &&
    contactToast instanceof HTMLElement &&
    contactSubmitButton instanceof HTMLButtonElement
) {
    const defaultSubmitText = contactSubmitButton.textContent;
    const sendingDelayMs = 700;
    const successVisibleMs = 4200;

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        contactSubmitButton.disabled = true;
        contactSubmitButton.textContent = 'Sending...';
        contactForm.setAttribute('aria-busy', 'true');

        window.setTimeout(() => {
            contactSubmitButton.textContent = '✓ Sent';
            contactToast.classList.add('is-visible');
            contactForm.reset();

            window.setTimeout(() => {
                contactSubmitButton.textContent = defaultSubmitText;
                contactSubmitButton.disabled = false;
                contactForm.removeAttribute('aria-busy');
                contactToast.classList.remove('is-visible');
            }, successVisibleMs);
        }, sendingDelayMs);
    });
}
