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