// Use the browser's validation messages instead of a series of alerts.
const contactForm = document.querySelector('#contact-form');

if (contactForm) {
    const nameInput = contactForm.querySelector('#name');
    const messageInput = contactForm.querySelector('#message');
    const phoneInput = contactForm.querySelector('#phone');

    function validateText(input) {
        input.setCustomValidity(input.value.trim() ? '' : 'Please fill out this field.');
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const digits = phone.replace(/\D/g, '');
        const validCharacters = /^\+?[\d\s().-]+$/.test(phone);
        const validLength = digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
        const isValid = !phone || (validCharacters && validLength);
        phoneInput.setCustomValidity(isValid ? '' : 'Enter a 10-digit US phone number, optionally starting with +1.');
    }

    [nameInput, messageInput].forEach((input) => {
        input.addEventListener('input', () => validateText(input));
    });
    phoneInput.addEventListener('input', validatePhone);

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        validateText(nameInput);
        validateText(messageInput);
        validatePhone();

        if (contactForm.reportValidity()) {
            // Demo only: nothing is saved or emailed.
            window.location.assign('message.html');
        }
    });
}
