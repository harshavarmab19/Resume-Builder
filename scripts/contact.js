// Contact Form Handler
const contactForm = {
    init() {
        this.form = document.getElementById('contactForm');
        this.setupFormValidation();
        this.setupAnimations();
    },

    setupFormValidation() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.handleSubmit();
            }
        });

        // Add input event listeners for real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateField(input);
            });
        });
    },

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    },

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error class and message
        input.classList.remove('error');
        this.removeErrorMessage(input);

        // Validate based on field type
        switch (input.type) {
            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!this.isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'text':
                if (!value) {
                    errorMessage = `${input.name.charAt(0).toUpperCase() + input.name.slice(1)} is required`;
                    isValid = false;
                }
                break;

            case 'textarea':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters long';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            input.classList.add('error');
            this.showErrorMessage(input, errorMessage);
        }

        return isValid;
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    showErrorMessage(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    },

    removeErrorMessage(input) {
        const errorDiv = input.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    },

    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Show loading state
            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate API call (replace with actual API endpoint)
            await this.simulateApiCall(data);

            // Show success message
            this.showSuccessMessage();
            this.form.reset();

            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        } catch (error) {
            // Show error message
            this.showErrorMessage(this.form, 'Failed to send message. Please try again later.');
            
            // Reset button state
            const submitButton = this.form.querySelector('button[type="submit"]');
            submitButton.textContent = 'Send Message';
            submitButton.disabled = false;
        }
    },

    simulateApiCall(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 1500);
        });
    },

    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Thank you for your message! We will get back to you soon.';
        this.form.insertAdjacentElement('beforebegin', successDiv);

        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    },

    setupAnimations() {
        // Add animation classes to elements
        const elements = document.querySelectorAll('.contact-info, .contact-form, .faq-item');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.animation = `slideUp 0.5s ease forwards ${index * 0.1}s`;
        });
    }
 };

 // Initialize contact form when DOM is loaded
 document.addEventListener('DOMContentLoaded', () => {
    contactForm.init();
}); 