export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface VerificationCodeFormData {
  code: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface UserData {
  id: string;
  email: string;
  name?: string;
  token: string;
}

// 新增的共用表單元件相關類型
export interface FormFieldProps {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  error?: string;
  showToggle?: boolean;
  maxLength?: number;
  hint?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type AuthTab = 'login' | 'signup' | 'forgotPassword';
export type ResetPasswordStepType = 1 | 2 | 3 | 4; 