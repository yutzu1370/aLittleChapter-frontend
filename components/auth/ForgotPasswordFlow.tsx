"use client"

import { useState } from "react"
import { Form, FormField } from "@/components/ui/form"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { UseFormReturn } from "react-hook-form"
import { 
  ForgotPasswordFormData, 
  VerificationCodeFormData, 
  ResetPasswordFormData 
} from "@/components/auth/types"

interface ForgotPasswordFlowProps {
  step: number
  forgotPasswordForm: UseFormReturn<ForgotPasswordFormData>
  verificationCodeForm: UseFormReturn<VerificationCodeFormData>
  resetPasswordForm: UseFormReturn<ResetPasswordFormData>
  onForgotPasswordSubmit: (data: ForgotPasswordFormData) => void
  onVerificationCodeSubmit: (data: VerificationCodeFormData) => void
  onResetPasswordSubmit: (data: ResetPasswordFormData) => void
  onBackToLogin: () => void
  onPreviousStep: () => void
}

export function ForgotPasswordFlow({
  step,
  forgotPasswordForm,
  verificationCodeForm,
  resetPasswordForm,
  onForgotPasswordSubmit,
  onVerificationCodeSubmit,
  onResetPasswordSubmit,
  onBackToLogin,
  onPreviousStep
}: ForgotPasswordFlowProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 切換密碼顯示狀態
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // 切換確認密碼顯示狀態
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="space-y-4">
      {step === 1 && (
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

            <ProgressSteps currentStep={step} />

            <div className="flex gap-3 mt-2 p-2">
              <motion.button
                type="button"
                className="flex-1 py-2 border-2 border-[#F8D0B0] rounded-full text-gray-700 hover:bg-orange-50 transition-colors shadow-[2px_4px_0px_#74281A]"
                onClick={onBackToLogin}
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

      {step === 2 && (
        <Form {...verificationCodeForm}>
          <form onSubmit={verificationCodeForm.handleSubmit(onVerificationCodeSubmit)} className="space-y-2">
            <div className="space-y-1">
              <div className="text-center mb-4">
                <p className="text-green-600 font-medium text-lg">請輸入您收到的驗證碼</p>
              </div>
              
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium">信箱驗證</h3>
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

            <ProgressSteps currentStep={step} />

            <div className="flex gap-3 mt-2 p-2">
              <motion.button
                type="button"
                className="flex-1 py-2 border-2 border-[#F8D0B0] rounded-full text-gray-700 hover:bg-orange-50 transition-colors shadow-[2px_4px_0px_#74281A]"
                onClick={onPreviousStep}
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

      {step === 3 && (
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

            <ProgressSteps currentStep={step} />

            <div className="flex gap-3 mt-2 p-2">
              <motion.button
                type="button"
                className="flex-1 py-2 border-2 border-[#F8D0B0] rounded-full text-gray-700 hover:bg-orange-50 transition-colors shadow-[2px_4px_0px_#74281A]"
                onClick={onPreviousStep}
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

      {step === 4 && (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center mb-2">
            <h2 className="text-green-600 text-2xl font-bold">設定新密碼成功！</h2>
          </div>
          
          <ProgressSteps currentStep={step} />

          <motion.button
            type="button"
            className="w-full bg-[#E8652B] text-white py-2 mt-4 rounded-full font-bold shadow-[4px_6px_0px_#74281A]"
            onClick={onBackToLogin}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
          >
            立即登入
          </motion.button>
        </div>
      )}
    </div>
  )
}

// 進度指示器子組件
function ProgressSteps({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mt-4 mb-2">
      <div className="flex items-center justify-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 1 ? "bg-gray-400 text-white" : "bg-white border-2 border-[#F8D0B0] text-gray-400"}`}>
          1
        </div>
        <div className="w-6 h-1 bg-[#F8D0B0]"></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 2 ? "bg-gray-400 text-white" : "bg-white border-2 border-[#F8D0B0] text-gray-400"}`}>
          2
        </div>
        <div className="w-6 h-1 bg-[#F8D0B0]"></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 3 ? "bg-gray-400 text-white" : "bg-white border-2 border-[#F8D0B0] text-gray-400"}`}>
          3
        </div>
      </div>
    </div>
  )
} 