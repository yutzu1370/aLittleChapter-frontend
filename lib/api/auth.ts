import { LoginFormData, SignupFormData, ForgotPasswordFormData, VerificationCodeFormData, ResetPasswordFormData } from "@/components/auth/types";
import { API_BASE_URL } from "@/lib/constants";
import apiClient, { ApiResponse } from "@/lib/apiClient";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;

export async function loginApi(data: LoginFormData): Promise<ApiResponse> {
  return apiClient.post('/api/users/log-in', data);
}

export async function signupApi(data: SignupFormData): Promise<ApiResponse> {
  const { confirmPassword, ...signupData } = data;
  return apiClient.post('/api/users/sign-up', signupData);
}

export async function forgotPasswordApi(data: ForgotPasswordFormData): Promise<ApiResponse> {
  return apiClient.post('/api/users/forgot-password', { email: data.email });
}

export async function verifyCodeApi(email: string, data: VerificationCodeFormData): Promise<ApiResponse> {
  return apiClient.post('/api/users/verify-code', { email, code: data.code });
}

export async function resetPasswordApi(email: string, code: string, data: ResetPasswordFormData): Promise<ApiResponse> {
  const { confirmPassword, ...resetData } = data;
  return apiClient.post('/api/users/reset-password', { email, code, newPassword: resetData.password });
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export async function changePasswordApi(data: ChangePasswordData): Promise<ApiResponse> {
  return apiClient.put('/api/users/password', data);
} 