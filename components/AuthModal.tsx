"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InputField } from "@/components/ui/InputField"
import { PrimaryButton } from "@/components/ui/PrimaryButton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"

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

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

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

  // 登入提交處理
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      loginForm.setValue("email", data.email.trim())
      
      const response = await fetch("/api/users/log-in", {
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
      
      const response = await fetch("/api/users/sign-up", {
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

      // 註冊成功
      toast.success("註冊成功", {
        description: "已發送驗證信至您的信箱，請於 24 小時內完成驗證",
        duration: 2000
      })
      
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
      forgotPasswordForm.setValue("email", data.email.trim())
      
      // 模擬 API 請求
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // 重設密碼成功訊息
      toast.success("重設密碼請求已發送", {
        description: "請檢查您的電子信箱以完成重設密碼",
        duration: 2000
      })
      
      forgotPasswordForm.reset()
      setActiveTab("login")
    } catch (error) {
      console.error("重設密碼請求失敗", error)
      if (error instanceof Error) {
        // 只使用 toast 顯示錯誤訊息
        toast.error("重設密碼請求失敗", {
          description: error.message,
          duration: 2000
        })
      }
    }
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
    return "忘記密碼"
  }

  // Google 第三方註冊/登入處理
  const handleGoogleAuth = async () => {
    try {
      // 模擬 Google 登入/註冊流程
      // 實際實現需要整合 Google OAuth
      console.log("Google 第三方登入/註冊流程")
    } catch (error) {
      console.error("Google 登入/註冊失敗", error)
    }
  }

  // 添加一些淡入淡出的轉場效果和滑動效果
  useEffect(() => {
    // 當 Modal 打開時，重置為登入頁面
    if (open) {
      setActiveTab("login");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-gray-200/80" />
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
          className="overflow-y-auto pr-3 pl-3 flex-1"
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
                  className="w-[98%] mx-auto h-12 text-base font-bold rounded-full bg-[#E8652B] text-white shadow-[4px_6px_0px_#74281A] flex items-center justify-center"
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
                  className="w-[98%] mx-auto h-12 text-base font-bold rounded-full border-2 border-[#F8D0B0] bg-white text-gray-700 flex items-center justify-center gap-3"
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
                  className="w-[98%] mx-auto h-12 text-base font-bold rounded-full bg-[#E8652B] text-white shadow-[4px_6px_0px_#74281A] flex items-center justify-center"
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
                  className="w-[98%] mx-auto h-12 text-base font-bold rounded-full border-2 border-[#F8D0B0] bg-white text-gray-700 flex items-center justify-center gap-3"
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
            <Form {...forgotPasswordForm}>
              <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-2">
                <p className="text-sm text-gray-600 mb-2">
                  請輸入您註冊時使用的電子信箱，我們將寄送重設密碼的連結給您。
                </p>

                <FormField
                  control={forgotPasswordForm.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium">電子信箱</label>
                          <input 
                            {...field}
                            type="email" 
                            placeholder="請輸入您註冊的Email" 
                            className="w-full px-3 py-2 border-2 border-[#F8D0B0] rounded-full focus:outline-none focus:border-[#E8652B]"
                          />
                          {fieldState.error?.message && (
                            <p className="text-red-500 text-xs mt-1">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

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
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 