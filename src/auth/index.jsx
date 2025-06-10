// Auth MVP Architecture Entry Point
export { default as LoginView } from './view/LoginView';
export { default as RegisterView } from './view/RegisterView';
export { default as AuthModel } from './model/AuthModel';
export { default as AuthPresenter } from './presenter/AuthPresenter';

// Legacy exports for backward compatibility
export { default as LoginForm } from './LoginForm';
export { default as RegisterForm } from './RegisterForm';
