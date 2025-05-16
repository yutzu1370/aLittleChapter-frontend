import { LoginFormData, SignupFormData, ForgotPasswordFormData, VerificationCodeFormData, ResetPasswordFormData } from "@/components/auth/types";
import { API_BASE_URL } from "@/lib/constants";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;

export async function loginApi(data: LoginFormData) {
  const response = await fetch(`${apiUrl}/api/users/log-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function signupApi(data: SignupFormData) {
  const { confirmPassword, ...signupData } = data;
  const response = await fetch(`${apiUrl}/api/users/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupData)
  });
  return response.json();
}

export async function forgotPasswordApi(data: ForgotPasswordFormData) {
  const response = await fetch(`${apiUrl}/api/users/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: data.email })
  });
  return response.json();
}

export async function verifyCodeApi(email: string, data: VerificationCodeFormData) {
  const response = await fetch(`${apiUrl}/api/users/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code: data.code })
  });
  return response.json();
}

export async function resetPasswordApi(email: string, code: string, data: ResetPasswordFormData) {
  const { confirmPassword, ...resetData } = data;
  const response = await fetch(`${apiUrl}/api/users/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword: resetData.password })
  });
  return response.json();
} 