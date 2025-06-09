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
  avatar?: string;
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

// Google 登入相關類型
export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface GoogleAuthResponse {
  status: boolean;
  message?: string;
  data?: {
    token: string;
    user: GoogleUser;
  };
}

// 擴展 Window 介面以支援 Google API
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              width?: number;
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
} 