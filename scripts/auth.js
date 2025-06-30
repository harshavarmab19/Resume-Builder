// Authentication Manager
const authManager = {
    // Initialize authentication functionality
    init: function() {
        this.setupFormSwitch();
        this.setupPasswordToggle();
        this.setupFormValidation();
        this.setupSocialLogin();
    },

    // Setup form switching between login and register
    setupFormSwitch: function() {
        const showRegisterBtn = document.getElementById('showRegister');
        const showLoginBtn = document.getElementById('showLogin');
        const loginForm = document.querySelector('.login-form');
        const registerForm = document.querySelector('.register-form');

        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            registerForm.classList.add('slide-up');
            setTimeout(() => registerForm.classList.remove('slide-up'), 300);
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
            loginForm.classList.add('slide-up');
            setTimeout(() => loginForm.classList.remove('slide-up'), 300);
        });
    },

    // Setup password visibility toggle
    setupPasswordToggle: function() {
        const toggleButtons = document.querySelectorAll('.toggle-password');

        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                button.querySelector('i').classList.toggle('fa-eye');
                button.querySelector('i').classList.toggle('fa-eye-slash');
            });
        });
    },

    // Setup form validation
    setupFormValidation: function() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        // Login form validation
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateLoginForm()) {
                this.handleLogin();
            }
        });

        // Register form validation
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateRegisterForm()) {
                this.handleRegister();
            }
        });
    },

    // Validate login form
    validateLoginForm: function() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        let isValid = true;

        // Email validation
        if (!this.isValidEmail(email)) {
            this.showError('loginEmail', 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (password.length < 6) {
            this.showError('loginPassword', 'Password must be at least 6 characters long');
            isValid = false;
        }

        return isValid;
    },

    // Validate register form
    validateRegisterForm: function() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        let isValid = true;

        // Name validation
        if (name.length < 2) {
            this.showError('registerName', 'Name must be at least 2 characters long');
            isValid = false;
        }

        // Email validation
        if (!this.isValidEmail(email)) {
            this.showError('registerEmail', 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (password.length < 6) {
            this.showError('registerPassword', 'Password must be at least 6 characters long');
            isValid = false;
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            this.showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }

        return isValid;
    },

    // Show error message
    showError: function(inputId, message) {
        const input = document.getElementById(inputId);
        const formGroup = input.closest('.form-group');
        
        // Remove existing error message if any
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error class to input
        input.classList.add('error');

        // Create and add error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        formGroup.appendChild(errorMessage);

        // Remove error on input
        input.addEventListener('input', () => {
            input.classList.remove('error');
            errorMessage.remove();
        }, { once: true });
    },

    // Validate email format
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Handle login
    handleLogin: function() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const remember = document.querySelector('input[name="remember"]').checked;

        // Here you would typically make an API call to your backend
        // For now, we'll simulate a successful login
        storage.save('user', {
            email: email,
            name: email.split('@')[0], // Simulated name
            isLoggedIn: true
        });

        if (remember) {
            storage.save('rememberedEmail', email);
        }

        // Redirect to create page
        window.location.href = 'create.html';
    },

    // Handle registration
    handleRegister: function() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        // Here you would typically make an API call to your backend
        // For now, we'll simulate a successful registration
        storage.save('user', {
            name: name,
            email: email,
            isLoggedIn: true
        });

        // Redirect to create page
        window.location.href = 'create.html';
    },

    // Setup social login
    setupSocialLogin: function() {
        const googleButtons = document.querySelectorAll('.btn-social.google');
        const facebookButtons = document.querySelectorAll('.btn-social.facebook');

        googleButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Implement Google login
                console.log('Google login clicked');
            });
        });

        facebookButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Implement Facebook login
                console.log('Facebook login clicked');
            });
        });
    }
};

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    authManager.init();

    // Check for remembered email
    const rememberedEmail = storage.load('rememberedEmail');
    if (rememberedEmail) {
        const loginEmail = document.getElementById('loginEmail');
        if (loginEmail) {
            loginEmail.value = rememberedEmail;
            document.querySelector('input[name="remember"]').checked = true;
        }
    }
}); 