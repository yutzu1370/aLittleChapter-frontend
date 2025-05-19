"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  LoginFormData, 
  SignupFormData, 
  ForgotPasswordFormData, 
  VerificationCodeFormData, 
  ResetPasswordFormData 
} from "@/components/auth/types"

// 登入表單驗證
const loginSchema = z.object({
  email: z.string().email("請輸入有效的電子信箱"),
  password: z.string().min(6, "密碼至少需要6個字元"),
  rememberMe: z.boolean().optional()
})

// 註冊表單驗證
const signupSchema = z.object({
  email: z.string().email("請輸入有效的電子信箱"),
  password: z
    .string()
    .min(8, "密碼至少需要8個字元")
    .max(16, "密碼不能超過16個字元")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "密碼需包含英文大小寫及數字"
    ),
  confirmPassword: z.string()
})
.refine((data) => data.password === data.confirmPassword, {
  message: "確認密碼與密碼不符",
  path: ["confirmPassword"],
})

// 忘記密碼表單驗證   
const forgotPasswordSchema = z.object({
  email: z.string().email("請輸入有效的電子信箱")
})

// 驗證碼驗證
const verificationCodeSchema = z.object({
  code: z.string().length(6, "驗證碼必須為6位數字")
})

// 重設密碼表單驗證
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "密碼至少需要8個字元")
    .max(16, "密碼不能超過16個字元")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "密碼需包含英文大小寫及數字"
    ),
  confirmPassword: z.string()
})
.refine((data) => data.password === data.confirmPassword, {
  message: "確認密碼與密碼不符",
  path: ["confirmPassword"],
})

export function useAuthForms() {
  // 登入表單
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  })

  // 註冊表單
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  // 忘記密碼表單
  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  })

  // 驗證碼表單
  const verificationCodeForm = useForm<VerificationCodeFormData>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: ""
    }
  })

  // 重設密碼表單
  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  return {
    loginForm,
    signupForm,
    forgotPasswordForm,
    verificationCodeForm,
    resetPasswordForm,
    schemas: {
      loginSchema,
      signupSchema,
      forgotPasswordSchema,
      verificationCodeSchema,
      resetPasswordSchema
    }
  }
} 