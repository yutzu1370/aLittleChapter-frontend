"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { API_BASE_URL } from "@/lib/constants"
import { useAuthStore } from "@/lib/store/useAuthStore"

// 引入重構後的子組件
import { LoginForm } from "@/components/auth/LoginForm"
import { SignupForm } from "@/components/auth/SignupForm"
import { ForgotPasswordFlow } from "@/components/auth/ForgotPasswordFlow"
import { useAuthForms } from "@/hooks/use-auth-forms"
import { 
  LoginFormData, 
  SignupFormData, 
  ForgotPasswordFormData,
  VerificationCodeFormData,
  ResetPasswordFormData,
  UserData
} from "@/components/auth/types"
import {
  loginApi,
  signupApi,
  forgotPasswordApi,
  verifyCodeApi,
  resetPasswordApi
} from "@/lib/api/auth"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>("login")
  const [resetPasswordStep, setResetPasswordStep] = useState<number>(1)
  const [verificationEmail, setVerificationEmail] = useState<string>("")
  const router = useRouter()
  const { login: storeLogin } = useAuthStore()
  const { 
    loginForm, 
    signupForm, 
    forgotPasswordForm, 
    verificationCodeForm, 
    resetPasswordForm 
  } = useAuthForms()

  // 當彈窗打開時，重置狀態
  useEffect(() => {
    if (open) {
      console.log("Auth modal is open:", open)
      setActiveTab("login")
    }
  }, [open])

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
    return "會員登入"
  }

  // Google 第三方註冊/登入處理
  const handleGoogleAuth = async () => {
    try {
      console.log("Google 第三方登入/註冊流程")
    } catch (error) {
      console.error("Google 登入/註冊失敗", error)
    }
  }

  // 登入提交處理
  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      loginForm.setValue("email", data.email.trim())
      const responseData = await loginApi(data)
      
      if (!responseData || responseData.status === false) {
        toast.error("登入失敗", {
          description: responseData?.message || "登入失敗",
          duration: 3000
        })
        return;
      }

      console.log('登入成功，後端返回數據:', responseData);

      try {
        if (responseData.status && responseData.data) {
          const userData: UserData = {
            id: responseData.data.user.id,
            email: responseData.data.user.email,
            name: responseData.data.user.name || '',
            token: responseData.data.token
          };

          console.log('準備儲存到 store 的資料:', userData);
          storeLogin(userData);
          console.log('儲存到 useAuthStore 完成');

          if (typeof window !== 'undefined') {
            console.log('localStorage 中的 auth-storage:', localStorage.getItem('auth-storage'));
          }
        } else {
          console.error('後端回傳的資料格式不符合預期:', responseData);
        }
      } catch (storeError) {
        console.error('儲存使用者資訊到 store 時發生錯誤:', storeError);
      }

      toast.success("登入成功", {
        description: "歡迎回來！",
        duration: 3000
      })
      
      onOpenChange(false)
      router.push("/")
    } catch (error) {
      console.error("登入請求過程發生錯誤", error)
      toast.error("登入失敗", {
        description: "網路連接問題，請稍後再試",
        duration: 2000
      })
    }
  }

  // 註冊提交處理
  const onSignupSubmit = async (data: SignupFormData) => {
    try {
      signupForm.setValue("email", data.email.trim())
      const responseData = await signupApi(data)
      
      if (!responseData || responseData.status === false) {
        toast.error("註冊失敗", {
          description: responseData?.message || "註冊失敗",
          duration: 2000
        })
        return;
      }

      console.log('註冊成功，後端返回數據:', responseData);
      console.log('註冊成功，引導使用者返回首頁進行登入');

      toast.success("註冊成功", {
        description: "已發送驗證信至您的信箱，請於 24 小時內完成驗證後登入",
        duration: 3000
      })
      
      onOpenChange(false)
      router.push("/")
    } catch (error) {
      console.error("註冊請求過程發生錯誤", error)
      toast.error("註冊失敗", {
        description: "網路連接問題，請稍後再試",
        duration: 2000
      })
    }
  }

  // 忘記密碼提交處理
  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setVerificationEmail(data.email)
      const responseData = await forgotPasswordApi(data)
      
      if (!responseData || responseData.status === false) {
        toast.error("請求失敗", {
          description: responseData?.message || "發送驗證碼失敗，請稍後再試",
          duration: 3000
        })
        return
      }
      
      toast.success("驗證碼已發送", {
        description: responseData.message || "請查看您的信箱並輸入驗證碼",
        duration: 3000
      })
      
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
  const onVerificationCodeSubmit = async (data: VerificationCodeFormData) => {
    try {
      const responseData = await verifyCodeApi(verificationEmail, data)
      
      if (!responseData || responseData.status === false) {
        toast.error("驗證失敗", {
          description: responseData?.message || "驗證碼不正確或已過期",
          duration: 3000
        })
        return
      }
      
      toast.success("驗證成功", {
        description: responseData.message || "請設定新密碼",
        duration: 2000
      })
      
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
  const onResetPasswordSubmit = async (data: ResetPasswordFormData) => {
    try {
      const responseData = await resetPasswordApi(
        verificationEmail,
        verificationCodeForm.getValues().code,
        data
      )
      
      if (!responseData || responseData.status === false) {
        toast.error("密碼重設失敗", {
          description: responseData?.message || "密碼重設失敗，請稍後再試",
          duration: 3000
        })
        return
      }
      
      toast.success(responseData.message, {
        duration: 3000
      });
      
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
            <LoginForm 
              form={loginForm}
              onSubmit={onLoginSubmit}
              onSwitchToSignup={() => setActiveTab("signup")}
              onForgotPassword={() => setActiveTab("forgotPassword")}
              onGoogleAuth={handleGoogleAuth}
            />
          )}

          {activeTab === "signup" && (
            <SignupForm 
              form={signupForm}
              onSubmit={onSignupSubmit}
              onSwitchToLogin={() => setActiveTab("login")}
              onGoogleAuth={handleGoogleAuth}
            />
          )}

          {activeTab === "forgotPassword" && (
            <ForgotPasswordFlow
              step={resetPasswordStep}
              forgotPasswordForm={forgotPasswordForm}
              verificationCodeForm={verificationCodeForm}
              resetPasswordForm={resetPasswordForm}
              onForgotPasswordSubmit={onForgotPasswordSubmit}
              onVerificationCodeSubmit={onVerificationCodeSubmit}
              onResetPasswordSubmit={onResetPasswordSubmit}
              onBackToLogin={handleBackToLogin}
              onPreviousStep={handlePreviousStep}
            />
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 