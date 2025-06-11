import AuthModel from '../model/AuthModel';

class AuthPresenter {
  constructor() {
    this.model = new AuthModel();
    this.view = null;
    this.state = {
      // Login state
      loginForm: {
        email: '',
        password: ''
      },
      // Register state
      registerForm: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      // UI state
      loading: false,
      error: null,
      success: null,
      showPassword: false,
      showConfirmPassword: false,
      // Validation state
      validation: {
        email: { isValid: true, message: '' },
        password: { isValid: true, message: '' },
        confirmPassword: { isValid: true, message: '' },
        name: { isValid: true, message: '' }
      }
    };
  }

  // Set view reference
  setView(view) {
    this.view = view;
  }

  // Update state and notify view
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    if (this.view) {
      this.view.setState(this.state);
    }
  }

  // Initialize auth
  initialize() {
    this.model.initializeAuth();
    
    // Check if user is already authenticated
    if (this.model.isAuthenticated()) {
      const user = this.model.getCurrentUser();
      this.updateState({ 
        user,
        isAuthenticated: true 
      });
    }
  }

  // Handle login form input change
  handleLoginInputChange(field, value) {
    const newLoginForm = {
      ...this.state.loginForm,
      [field]: value
    };

    // Clear previous errors
    const newValidation = {
      ...this.state.validation,
      [field]: { isValid: true, message: '' }
    };

    this.updateState({
      loginForm: newLoginForm,
      validation: newValidation,
      error: null
    });
  }

  // Handle register form input change
  handleRegisterInputChange(field, value) {
    const newRegisterForm = {
      ...this.state.registerForm,
      [field]: value
    };

    // Clear previous errors
    const newValidation = {
      ...this.state.validation,
      [field]: { isValid: true, message: '' }
    };

    this.updateState({
      registerForm: newRegisterForm,
      validation: newValidation,
      error: null
    });
  }

  // Validate login form
  validateLoginForm() {
    const { email, password } = this.state.loginForm;
    const validation = { ...this.state.validation };
    let isValid = true;

    // Validate email
    if (!email.trim()) {
      validation.email = { isValid: false, message: 'Email is required' };
      isValid = false;
    } else if (!this.model.validateEmail(email)) {
      validation.email = { isValid: false, message: 'Please enter a valid email' };
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      validation.password = { isValid: false, message: 'Password is required' };
      isValid = false;
    }

    this.updateState({ validation });
    return isValid;
  }

  // Validate register form
  validateRegisterForm() {
    const { name, email, password, confirmPassword } = this.state.registerForm;
    const validation = { ...this.state.validation };
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      validation.name = { isValid: false, message: 'Name is required' };
      isValid = false;
    } else if (name.trim().length < 2) {
      validation.name = { isValid: false, message: 'Name must be at least 2 characters' };
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      validation.email = { isValid: false, message: 'Email is required' };
      isValid = false;
    } else if (!this.model.validateEmail(email)) {
      validation.email = { isValid: false, message: 'Please enter a valid email' };
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      validation.password = { isValid: false, message: 'Password is required' };
      isValid = false;
    } else {
      const passwordValidation = this.model.validatePassword(password);
      if (!passwordValidation.isValid) {
        validation.password = { 
          isValid: false, 
          message: 'Password must be at least 8 characters with uppercase, lowercase, and numbers' 
        };
        isValid = false;
      }
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      validation.confirmPassword = { isValid: false, message: 'Please confirm your password' };
      isValid = false;
    } else if (password !== confirmPassword) {
      validation.confirmPassword = { isValid: false, message: 'Passwords do not match' };
      isValid = false;
    }

    this.updateState({ validation });
    return isValid;
  }

  // Handle login
  async handleLogin() {
    try {
      if (!this.validateLoginForm()) {
        return;
      }

      this.updateState({ loading: true, error: null });

      const { email, password } = this.state.loginForm;
      const { token, user } = await this.model.login(email, password);

      this.updateState({
        loading: false,
        success: 'Login successful! Redirecting...',
        user,
        isAuthenticated: true
      });

      // Redirect after successful login - FIX: Change /home to / (root)
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      this.updateState({
        loading: false,
        error: error.message || 'Login failed. Please try again.'
      });
    }
  }

  // Handle register
  async handleRegister() {
    try {
      if (!this.validateRegisterForm()) {
        return;
      }

      this.updateState({ loading: true, error: null });

      const { name, email, password } = this.state.registerForm;
      const { token, user } = await this.model.register({
        name,
        email,
        password
      });

      this.updateState({
        loading: false,
        success: 'Registration successful! Redirecting...',
        user,
        isAuthenticated: true
      });

      // Redirect after successful registration - FIX: Change /home to / (root)
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);

    } catch (error) {
      console.error('Registration error:', error);
      this.updateState({
        loading: false,
        error: error.message || 'Registration failed. Please try again.'
      });
    }
  }

  // Handle logout
  async handleLogout() {
    try {
      this.updateState({ loading: true });
      
      await this.model.logout();
      
      this.updateState({
        loading: false,
        user: null,
        isAuthenticated: false,
        loginForm: { email: '', password: '' },
        registerForm: { name: '', email: '', password: '', confirmPassword: '' }
      });

      // Redirect to login page
      window.location.href = '/login';

    } catch (error) {
      console.error('Logout error:', error);
      this.updateState({
        loading: false,
        error: 'Logout failed. Please try again.'
      });
    }
  }

  // Toggle password visibility
  togglePasswordVisibility(field = 'password') {
    if (field === 'confirmPassword') {
      this.updateState({ showConfirmPassword: !this.state.showConfirmPassword });
    } else {
      this.updateState({ showPassword: !this.state.showPassword });
    }
  }

  // Clear error
  clearError() {
    this.updateState({ error: null });
  }

  // Clear success
  clearSuccess() {
    this.updateState({ success: null });
  }

  // Get current state
  getState() {
    return this.state;
  }

  // Check authentication status
  isAuthenticated() {
    return this.model.isAuthenticated();
  }

  // Get current user
  getCurrentUser() {
    return this.model.getCurrentUser();
  }

  // Cleanup
  cleanup() {
    this.model.clearCache();
    this.view = null;
  }
}

export default AuthPresenter;
