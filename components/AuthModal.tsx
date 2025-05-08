"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { API_BASE_URL } from "@/lib/constants"
import { useAuthStore } from "@/lib/store/useAuthStore"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 登入表單驗證
const loginSchema = z.object({
  email: z.string().email("請輸入有效的電子信箱"),
  password: z.string().min(6, "密碼至少需要6個字元"),
  rememberMe: z.boolean().optional()
})

type LoginFormValues = z.infer<typeof loginSchema>

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

type SignupFormValues = z.infer<typeof signupSchema>

// 忘記密碼表單驗證   
const forgotPasswordSchema = z.object({
  email: z.string().email("請輸入有效的電子信箱")
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

// 驗證碼驗證
const verificationCodeSchema = z.object({
  code: z.string().length(6, "驗證碼必須為6位數字")
})

type VerificationCodeFormValues = z.infer<typeof verificationCodeSchema>

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

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetPasswordStep, setResetPasswordStep] = useState<number>(1)
  const [verificationEmail, setVerificationEmail] = useState<string>("")
  const router = useRouter()
  const { login: storeLogin } = useAuthStore()

  // 當彈窗打開時，重置狀態
  useEffect(() => {
    if (open) {
      console.log("Auth modal is open:", open)
      setActiveTab("login")
    }
  }, [open])

  // 登入表單
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  })

  // 註冊表單
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  // 忘記密碼表單
  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  })

  // 驗證碼表單
  const verificationCodeForm = useForm<VerificationCodeFormValues>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: ""
    }
  })

  // 重設密碼表單
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  // 登入提交處理
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      loginForm.setValue("email", data.email.trim())
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/users/log-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const responseData = await response.json()
      
      // 不使用 throw Error，而是直接處理錯誤響應
      if (!response.ok) {
        // 顯示錯誤訊息
        toast.error("登入失敗", {
          description: responseData.message || "登入失敗",
          duration: 3000
        })
        return; // 提早返回，不執行後續代碼
      }

      console.log('登入成功，後端返回數據:', responseData);

      // 確保格式化並保存登入資訊到 store
      try {
        // 根據後端實際回傳的資料格式提取資訊
        if (responseData.status && responseData.data) {
          const userData = {
            id: responseData.data.user.id,
            email: responseData.data.user.email,
            name: responseData.data.user.name || '',
            token: responseData.data.token
          };

          console.log('準備儲存到 store 的資料:', userData);
          storeLogin(userData);
          console.log('儲存到 useAuthStore 完成');

          // 直接確認 localStorage 是否有對應資料
          if (typeof window !== 'undefined') {
            console.log('localStorage 中的 auth-storage:', localStorage.getItem('auth-storage'));
          }
        } else {
          console.error('後端回傳的資料格式不符合預期:', responseData);
        }
      } catch (storeError) {
        console.error('儲存使用者資訊到 store 時發生錯誤:', storeError);
      }

      // 登入成功
      toast.success("登入成功", {
        description: "歡迎回來！",
        duration: 3000
      })
      
      onOpenChange(false)
      router.push("/")
    } catch (error) {
      console.error("登入請求過程發生錯誤", error)
      // 只處理網路錯誤等非預期錯誤
      toast.error("登入失敗", {
        description: "網路連接問題，請稍後再試",
        duration: 2000
      })
    }
  }

  // 註冊提交處理
  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      signupForm.setValue("email", data.email.trim())
      
      // 移除確認密碼欄位，只發送必要數據
      const { confirmPassword, ...signupData } = data
      
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/users/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signupData)
      })

      const responseData = await response.json()
      
      // 不使用 throw Error，而是直接處理錯誤響應
      if (!response.ok) {
        // 顯示錯誤訊息
        toast.error("註冊失敗", {
          description: responseData.message || "註冊失敗",
          duration: 2000
        })
        return; // 提早返回，不執行後續代碼
      }

      console.log('註冊成功，後端返回數據:', responseData);

      // 註冊成功後，不自動登入使用者，而是要求他們登入
      // 移除原本的 store 儲存邏輯
      console.log('註冊成功，引導使用者返回首頁進行登入');

      // 註冊成功
      toast.success("註冊成功", {
        description: "已發送驗證信至您的信箱，請於 24 小時內完成驗證後登入",
        duration: 3000
      })
      
      // 關閉對話框並導向首頁
      onOpenChange(false)
      router.push("/")
    } catch (error) {
      console.error("註冊請求過程發生錯誤", error)
      // 只處理網路錯誤等非預期錯誤
      toast.error("註冊失敗", {
        description: "網路連接問題，請稍後再試",
        duration: 2000
      })
    }
  }

  // 忘記密碼提交處理
  const onForgotPasswordSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setVerificationEmail(data.email)
      // 向後端發送請求
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: data.email
        })
      })
      
      const responseData = await response.json()
      
      // 檢查回應狀態
      if (responseData.status === false) {
        // 顯示後端回傳的錯誤訊息
        toast.error("請求失敗", {
          description: responseData.message || "發送驗證碼失敗，請稍後再試",
          duration: 3000
        })
        return
      }
      
      // 請求成功
      toast.success("驗證碼已發送", {
        description: responseData.message || "請查看您的信箱並輸入驗證碼",
        duration: 3000
      })
      
      // 進入第二步：輸入驗證碼
      setResetPasswordStep(2)
    } catch (error) {
      console.error("忘記密碼請求失敗", error)
      toast.error("請求失敗", {
        description: "網路連接問題，請稍後再試",
        duration: 2000
      })
    }
  }

  // 驗證碼提交處理
  const onVerificationCodeSubmit = async (data: VerificationCodeFormValues) => {
    try {
      // 向後端發送請求驗證碼
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/users/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: verificationEmail,
          code: data.code
        })
      })
      
      const responseData = await response.json()
      
      // 檢查回應狀態
      if (responseData.status === false) {
        // 顯示後端回傳的錯誤訊息
        toast.error("驗證失敗", {
          description: responseData.message || "驗證碼不正確或已過期",
          duration: 3000
        })
        return
      }
      
      // 驗證成功
      toast.success("驗證成功", {
        description: responseData.message || "請設定新密碼",
        duration: 2000
      })
      
      // 進入第三步：設定新密碼
      setResetPasswordStep(3)
    } catch (error) {
      console.error("驗證碼驗證失敗", error)
      toast.error("驗證失敗", {
        description: "網路連接問題，請稍後再試",
        duration: 2000
      })
    }
  }

  // 重設密碼提交處理
  const onResetPasswordSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const { confirmPassword, ...resetData } = data
      
      // 向後端發送請求重設密碼
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: verificationEmail,
          code: verificationCodeForm.getValues().code,
          newPassword: resetData.password
        })
      })
      
      const responseData = await response.json()
      
      // 檢查回應狀態
      if (responseData.status === false) {
        // 顯示後端回傳的錯誤訊息
        toast.error("密碼重設失敗", {
          description: responseData.message || "密碼重設失敗，請稍後再試",
          duration: 3000
        })
        return
      }
      
      // 密碼重設成功
      toast.success(responseData.message, {
        duration: 3000
      });
      
      // 密碼重設成功後，返回登入頁面
      setActiveTab("login")
      setResetPasswordStep(1)
    } catch (error) {
      console.error("密碼重設失敗", error)
      toast.error("密碼重設失敗", {
        description: "網路連接問題，請稍後再試",
        duration: 2000
      })
    }
  }
  
  // 重設流程完成後返回登入頁
  const handleBackToLogin = () => {
    setActiveTab("login")
    setResetPasswordStep(1)
  }

  // 切換密碼顯示狀態
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // 切換確認密碼顯示狀態
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // 取得當前頁面標題
  const getModalTitle = () => {
    if (activeTab === "login") return "會員登入"
    if (activeTab === "signup") return "Email註冊"
    if (activeTab === "forgotPassword") {
      if (resetPasswordStep === 1) return "忘記密碼"
      if (resetPasswordStep === 2) return "信箱驗證"
      if (resetPasswordStep === 3) return "設定新密碼"
      return "更改成功"
    }
    return "忘記密碼"
  }

  // Google 第三方註冊/登入處理
  const handleGoogleAuth = async () => {
    try {
      // 模擬 Google 登入/註冊流程
      // 實際實現需要整合 Google OAuth
      console.log("Google 第三方登入/註冊流程")
      
      // 當 Google OAuth 流程成功後，需要保存使用者資訊到 store
      // 假設後端回傳類似格式：
      // {
      //   status: true,
      //   message: "Google 登入成功",
      //   data: {
      //     user: {
      //       id: "google_user_id",
      //       name: "Google 使用者",
      //       email: "google_user@gmail.com",
      //       role: "customer"
      //     },
      //     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...",
      //     expiresIn: 86400
      //   }
      // }
      // 
      // 處理範例：
      // if (response.status && response.data) {
      //   storeLogin({
      //     id: response.data.user.id,
      //     email: response.data.user.email,
      //     name: response.data.user.name || '',
      //     token: response.data.token
      //   });
      // }
    } catch (error) {
      console.error("Google 登入/註冊失敗", error)
    }
  }

  // 新增處理返回上一步的函數
  const handlePreviousStep = () => {
    setResetPasswordStep(prev => Math.max(1, prev - 1))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] max-h-[90vh] w-[85vw] p-3 pb-4 gap-2 bg-white shadow-lg border-[1px] border-[#F8D0B0] rounded-[22px] overflow-y-auto flex flex-col">
        <DialogTitle className="sr-only">{getModalTitle()}</DialogTitle>
        
        <div className="flex flex-col items-center sticky top-0 bg-white pt-2 pb-1 z-10 mb-2">
          <div className="mb-1">
            <Image 
              src="/images/logo.png" 
              alt="Little Chapter Logo" 
              width={90} 
              height={38} 
              className="object-contain" 
              priority
            />
          </div>
          <h2 className="text-lg font-bold text-center">
            {getModalTitle()}
          </h2>
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="overflow-y-auto pr-3 pl-3 flex-1 min-h-[230px]"
        >
          {activeTab === "login" && (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-2">
                <div className="space-y-1">
                  <label className="block text-sm font-medium">帳號</label>
                  <div className="relative">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <input 
                          {...field}
                          type="email" 
                          placeholder="請輸入Email" 
                          className="w-full px-3 py-2 border-2 border-[#F8D0B0] rounded-full focus:outline-none focus:border-[#E8652B]"
                        />
                      )}
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium">密碼</label>
                  <div className="relative">
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <>
                          <input 
                            {...field}
                            type={showPassword ? "text" : "password"} 
                            placeholder="請輸入密碼" 
                            className="w-full px-3 py-2 border-2 border-[#F8D0B0] rounded-full pr-10 focus:outline-none focus:border-[#E8652B]"
                          />
                          <button 
                            type="button" 
                            onClick={togglePasswordVisibility} 
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </>
                      )}
                    />
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                  <p className="text-2xs text-gray-500">※8至16碼英數混和，英文需區分大小寫</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span>尚未加入？→</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("signup")}
                      className="text-[#E8652B] hover:underline font-medium"
                    >
                      馬上註冊
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <FormField
                    control={loginForm.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <Checkbox 
                        id="rememberMe" 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#E8652B] data-[state=checked]:text-white border-2 border-[#F8D0B0]"
                      />
                    )}
                  />
                  <label htmlFor="rememberMe" className="text-sm">
                    記住我
                  </label>
                  <div className="flex-1 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveTab("forgotPassword")}
                      className="text-[#E8652B] text-sm hover:underline font-medium"
                    >
                      忘記密碼
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-[98%] mx-auto h-11 text-base font-bold rounded-full bg-[#E8652B] text-white shadow-[4px_6px_0px_#74281A] flex items-center justify-center"
                  disabled={loginForm.formState.isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loginForm.formState.isSubmitting ? "登入中..." : "登入"}
                </motion.button>

                <div className="relative flex items-center mt-4">
                  <span className="flex-grow border-t-2 border-[#F8D0B0]"></span>
                  <span className="px-3 text-gray-500 text-sm">或</span>
                  <span className="flex-grow border-t-2 border-[#F8D0B0]"></span>
                </div>

                <motion.button
                  type="button"
                  className="w-[98%] mx-auto h-11 text-base font-bold rounded-full border-2 border-[#F8D0B0] bg-white text-gray-700 flex items-center justify-center gap-3"
                  onClick={handleGoogleAuth}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Image src="/images/icon/google.svg" alt="Google" width={20} height={20} />
                  <span>使用 Google 帳號登入</span>
                </motion.button>
              </form>
            </Form>
          )}

          {activeTab === "signup" && (
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-2">
                <div className="space-y-1">
                  <label className="block text-sm font-medium">帳號</label>
                  <div className="relative">
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <input 
                          {...field}
                          type="email" 
                          placeholder="請輸入有效email" 
                          className="w-full px-3 py-2 border-2 border-[#F8D0B0] rounded-full focus:outline-none focus:border-[#E8652B]"
                        />
                      )}
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                  <p className="text-2xs text-gray-500">※建議免使用Yahoo或PChome提供的免費信箱</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium">密碼</label>
                  <div className="relative">
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <>
                          <input 
                            {...field}
                            type={showPassword ? "text" : "password"} 
                            placeholder="請設定密碼" 
                            className="w-full px-3 py-2 border-2 border-[#F8D0B0] rounded-full pr-10 focus:outline-none focus:border-[#E8652B]"
                          />
                          <button 
                            type="button" 
                            onClick={togglePasswordVisibility} 
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </>
                      )}
                    />
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                  <p className="text-2xs text-gray-500">※8至16碼英數混和，英文需區分大小寫</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium">確認密碼</label>
                  <div className="relative">
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <>
                          <input 
                            {...field}
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="再次輸入密碼" 
                            className="w-full px-3 py-2 border-2 border-[#F8D0B0] rounded-full pr-10 focus:outline-none focus:border-[#E8652B]"
                          />
                          <button 
                            type="button" 
                            onClick={toggleConfirmPasswordVisibility} 
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </>
                      )}
                    />
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span>已有帳號？→</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="text-[#E8652B] hover:underline font-medium"
                    >
                      前往登入
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-[98%] mx-auto h-10 text-base font-bold rounded-full bg-[#E8652B] text-white shadow-[4px_6px_0px_#74281A] flex items-center justify-center"
                  disabled={signupForm.formState.isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {signupForm.formState.isSubmitting ? "註冊中..." : "註冊"}
                </motion.button>
                
                <div className="relative flex items-center mt-4">
                  <span className="flex-grow border-t-2 border-[#F8D0B0]"></span>
                  <span className="px-3 text-gray-500 text-sm">或</span>
                  <span className="flex-grow border-t-2 border-[#F8D0B0]"></span>
                </div>

                <motion.button
                  type="button"
                  className="w-[98%] mx-auto h-10 text-base font-bold rounded-full border-2 border-[#F8D0B0] bg-white text-gray-700 flex items-center justify-center gap-3"
                  onClick={handleGoogleAuth}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Image src="/images/icon/google.svg" alt="Google" width={20} height={20} />
                  <span>使用 Google 帳號註冊</span>
                </motion.button>
              </form>
            </Form>
          )}

          {activeTab === "forgotPassword" && (
            <div className="space-y-4">
              {resetPasswordStep === 1 && (
                <Form {...forgotPasswordForm}>
                  <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">
                      請輸入您註冊時使用的電子信箱，我們將寄送驗證碼給您。
                    </p>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium">Email</label>
                      <FormField
                        control={forgotPasswordForm.control}
                        name="email"
                        render={({ field }) => (
                          <input 
                            {...field}
                            type="email" 
                            placeholder="請輸入已註冊Email" 
                            className="w-full px-3 py-2 border-2 border-[#F8D0B0] rounded-full focus:outline-none focus:border-[#E8652B]"
                          />
                        )}
                      />
                      {forgotPasswordForm.formState.errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {forgotPasswordForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-center mt-4 mb-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${Number(resetPasswordStep) === 1 ? "bg-gray-400 text-white" : "bg-white border-2 border-[#F8D0B0] text-gray-400"}`}>
                          1
                        </div>
                        <div className="w-6 h-1 bg-[#F8D0B0]"></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${Number(resetPasswordStep) === 2 ? "bg-gray-400 text-white" : "bg-white border-2 border-[#F8D0B0] text-gray-400"}`}>
                          2
                        </div>
                        <div className="w-6 h-1 bg-[#F8D0B0]"></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${Number(resetPasswordStep) === 3 ? "bg-gray-400 text-white" : "bg-white border-2 border-[#F8D0B0] text-gray-400"}`}>
                          3
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-2 p-2">
                      <motion.button
                        type="button"
                        className="flex-1 py-2 border-2 border-[#F8D0B0] rounded-full text-gray-700 hover:bg-orange-50 transition-colors shadow-[2px_4px_0px_#74281A]"
                        onClick={() => setActiveTab("login")}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        返回登入
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="flex-1 bg-[#E8652B] text-white py-2 rounded-full font-medium shadow-[2px_4px_0px_#74281A]"
                        disabled={forgotPasswordForm.formState.isSubmitting}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        {forgotPasswordForm.formState.isSubmitting ? "處理中..." : "送出"}
                      </motion.button>
                    </div>
                  </form>
                </Form>
              )}

              {resetPasswordStep === 2 && (
                <Form {...verificationCodeForm}>
                  <form onSubmit={verificationCodeForm.handleSubmit(onVerificationCodeSubmit)} className="space-y-2">
                    <div className="space-y-1">
                      <div className="text-center mb-4">
                        <p className="text-green-600 font-medium text-lg">信箱驗證碼通過驗證</p>
                      </div>
                      
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-medium">設定新密碼</h3>
                      </div>
                      
                      <label className="block text-sm font-medium">信箱驗證碼</label>
                      <FormField
                        control={verificationCodeForm.control}
                        name="code"
                        render={({ field }) => (
                          <input 
                            {...field}
                            type="text" 
                            placeholder="共6位數字" 
                            className="w-full px-3 py-2 border-2 border-[#F8D0B0] rounded-full focus:outline-none focus:border-[#E8652B]"
                            maxLength={6}
                          />
                        )}
                      />
                      {verificationCodeForm.formState.errors.code && (
                        <p className="text-red-500 text-xs mt-1">
                          {verificationCodeForm.formState.errors.code.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-center mt-4 mb-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-[#F8D0B0] text-gray-400`}>
                          1
                        </div>
                        <div className="w-6 h-1 bg-[#F8D0B0]"></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${Number(resetPasswordStep) === 2 ? "bg-gray-400 text-white" : "bg-white border-2 border-[#F8D0B0] text-gray-400"}`}>
                          2
                        </div>
                        <div className="w-6 h-1 bg-[#F8D0B0]"></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-[#F8D0B0] text-gray-400`}>
                          3
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-2 p-2">
                      <motion.button
                        type="button"
                        className="flex-1 py-2 border-2 border-[#F8D0B0] rounded-full text-gray-700 hover:bg-orange-50 transition-colors shadow-[2px_4px_0px_#74281A]"
                        onClick={handlePreviousStep}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        返回上一步
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="flex-1 bg-[#E8652B] text-white py-2 rounded-full font-medium shadow-[2px_4px_0px_#74281A]"
                        disabled={verificationCodeForm.formState.isSubmitting}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        {verificationCodeForm.formState.isSubmitting ? "驗證中..." : "送出"}
                      </motion.button>
                    </div>
                    <div className="h-10"></div>
                  </form>
                </Form>
              )}

              {resetPasswordStep === 3 && (
                <Form {...resetPasswordForm}>
                  <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-2">
                    <div className="text-center mb-1">
                      <p className="text-green-600 font-medium">信箱驗證碼通過驗證</p>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium">設定新密碼</label>
                      <div className="relative">
                        <FormField
                          control={resetPasswordForm.control}
                          name="password"
                          render={({ field }) => (
                            <>
                              <input 
                                {...field}
                                type={showPassword ? "text" : "password"} 
                                placeholder="請輸入新密碼" 
                                className="w-full px-3 py-2 border-2 border-[#F8D0B0] rounded-full pr-10 focus:outline-none focus:border-[#E8652B]"
                              />
                              <button 
                                type="button" 
                                onClick={togglePasswordVisibility} 
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Eye className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </>
                          )}
                        />
                      </div>
                      {resetPasswordForm.formState.errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {resetPasswordForm.formState.errors.password.message}
                        </p>
                      )}
                      <p className="text-2xs text-gray-500">※8至16碼英數混和，英文需區分大小寫</p>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium">再次輸入新密碼</label>
                      <div className="relative">
                        <FormField
                          control={resetPasswordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <>
                              <input 
                                {...field}
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="請輸入新密碼" 
                                className="w-full px-3 py-2 border-2 border-[#F8D0B0] rounded-full pr-10 focus:outline-none focus:border-[#E8652B]"
                              />
                              <button 
                                type="button" 
                                onClick={toggleConfirmPasswordVisibility} 
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Eye className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </>
                          )}
                        />
                      </div>
                      {resetPasswordForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {resetPasswordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-center mt-4 mb-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-[#F8D0B0] text-gray-400`}>
                          1
                        </div>
                        <div className="w-6 h-1 bg-[#F8D0B0]"></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-[#F8D0B0] text-gray-400`}>
                          2
                        </div>
                        <div className="w-6 h-1 bg-[#F8D0B0]"></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${Number(resetPasswordStep) === 3 ? "bg-gray-400 text-white" : "bg-white border-2 border-[#F8D0B0] text-gray-400"}`}>
                          3
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-2 p-2">
                      <motion.button
                        type="button"
                        className="flex-1 py-2 border-2 border-[#F8D0B0] rounded-full text-gray-700 hover:bg-orange-50 transition-colors shadow-[2px_4px_0px_#74281A]"
                        onClick={handlePreviousStep}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        返回上一步
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="flex-1 bg-[#E8652B] text-white py-2 rounded-full font-medium shadow-[2px_4px_0px_#74281A]"
                        disabled={resetPasswordForm.formState.isSubmitting}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        {resetPasswordForm.formState.isSubmitting ? "處理中..." : "送出"}
                      </motion.button>
                    </div>
                  </form>
                </Form>
              )}

              {resetPasswordStep === 4 && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center mb-2">
                    <h2 className="text-green-600 text-2xl font-bold">設定新密碼成功！</h2>
                  </div>
                  
                  <div className="flex items-center justify-center mt-4 mb-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-[#F8D0B0] text-gray-400`}>
                        1
                      </div>
                      <div className="w-6 h-1 bg-[#F8D0B0]"></div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-[#F8D0B0] text-gray-400`}>
                        2
                      </div>
                      <div className="w-6 h-1 bg-[#F8D0B0]"></div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-[#F8D0B0] text-gray-400`}>
                        3
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    className="w-full bg-[#E8652B] text-white py-2 mt-4 rounded-full font-bold shadow-[4px_6px_0px_#74281A]"
                    onClick={handleBackToLogin}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    立即登入
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 