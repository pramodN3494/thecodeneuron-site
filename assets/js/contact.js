const form = document.getElementById('contact-form');
const toast = document.getElementById('contact-toast');
const submitButton = document.getElementById('contact-submit');

if (form instanceof HTMLFormElement && toast instanceof HTMLElement && submitButton instanceof HTMLButtonElement) {
    const contactForm = form;
    const contactToast = toast;
    const contactSubmitButton = submitButton;
    const defaultSubmitText = contactSubmitButton.textContent || 'Send Message';
    let isSubmitting = false;
    /** @type {number | null} */
    let toastTimerId = null;

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        trimTextFields(contactForm);

        const validationMessage = validateForm(contactForm);
        if (validationMessage) {
            showToast(validationMessage);
            return;
        }

        isSubmitting = true;
        contactSubmitButton.disabled = true;
        contactSubmitButton.textContent = 'Sending...';
        contactSubmitButton.setAttribute('aria-busy', 'true');
        contactForm.setAttribute('aria-busy', 'true');

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                showToast(`Unable to send your message right now. Please try again. (${response.status})`);
                return;
            }

            const result = await parseJsonResponse(response);
            if (!result || typeof result.success !== 'boolean') {
                showToast('We received an unexpected response. Please try again or contact me directly.');
                return;
            }

            if (!result.success) {
                showToast(result.message || 'Unable to send your message right now. Please try again.');
                return;
            }

            contactForm.reset();
            showToast(
                'Thank you for reaching out! Contact form integration will be available soon. For now, feel free to connect with me on LinkedIn or send me an email.'
            );
        } catch (error) {
            console.error(error);
            showToast('A network error occurred. Please try again in a moment or connect with me on LinkedIn.');
        } finally {
            isSubmitting = false;
            contactSubmitButton.disabled = false;
            contactSubmitButton.textContent = defaultSubmitText;
            contactSubmitButton.removeAttribute('aria-busy');
            contactForm.removeAttribute('aria-busy');
        }
    });

    /**
     * @param {HTMLFormElement} targetForm
     */
    function trimTextFields(targetForm) {
        targetForm.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach((field) => {
            if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
                field.value = field.value.trim();
            }
        });
    }

    /**
     * @param {HTMLFormElement} targetForm
     */
    function validateForm(targetForm) {
        const nameField = targetForm.elements.namedItem('name');
        const emailField = targetForm.elements.namedItem('email');
        const subjectField = targetForm.elements.namedItem('subject');
        const messageField = targetForm.elements.namedItem('message');

        const nameValue = getFieldValue(nameField);
        const emailValue = getFieldValue(emailField);
        const subjectValue = getFieldValue(subjectField);
        const messageValue = getFieldValue(messageField);

        if (!nameValue) {
            return 'Please enter your name before sending the message.';
        }

        if (!emailValue) {
            return 'Please enter your email address before sending the message.';
        }

        if (!isValidEmail(emailValue)) {
            return 'Please enter a valid email address.';
        }

        if (!subjectValue) {
            return 'Please add a subject before sending the message.';
        }

        if (!messageValue) {
            return 'Please add a message before sending the form.';
        }

        return '';
    }

    /**
     * @param {Element | RadioNodeList | null} field
     */
    function getFieldValue(field) {
        if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
            return '';
        }

        return field.value.trim();
    }

    /**
     * @param {string} email
     */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * @param {Response} response
     */
    async function parseJsonResponse(response) {
        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    /**
     * @param {string} message
     */
    function showToast(message) {
        if (toastTimerId) {
            window.clearTimeout(toastTimerId);
        }

        contactToast.textContent = message;
        contactToast.classList.add('is-visible');

        toastTimerId = window.setTimeout(() => {
            contactToast.classList.remove('is-visible');
            toastTimerId = null;
        }, 6500);
    }
}