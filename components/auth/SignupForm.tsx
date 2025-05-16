"use client"

import { useState } from "react"
import Image from "next/image"
import { Form, FormField } from "@/components/ui/form"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { SignupFormData } from "@/components/auth/types"
import { UseFormReturn } from "react-hook-form"

interface SignupFormProps {
  form: UseFormReturn<SignupFormData>
  onSubmit: (data: SignupFormData) => void
  onSwitchToLogin: () => void
  onGoogleAuth: () => void
}

export function SignupForm({
  form,
  onSubmit,
  onSwitchToLogin,
  onGoogleAuth
}: SignupFormProps) {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium">帳號</label>
          <div className="relative">
            <FormField
              control={form.control}
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
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
          <p className="text-2xs text-gray-500">※建議免使用Yahoo或PChome提供的免費信箱</p>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">密碼</label>
          <div className="relative">
            <FormField
              control={form.control}
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
          {form.formState.errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
          <p className="text-2xs text-gray-500">※8至16碼英數混和，英文需區分大小寫</p>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">確認密碼</label>
          <div className="relative">
            <FormField
              control={form.control}
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
          {form.formState.errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span>已有帳號？→</span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#E8652B] hover:underline font-medium"
            >
              前往登入
            </button>
          </div>
        </div>

        <motion.button
          type="submit"
          className="w-[98%] mx-auto h-10 text-base font-bold rounded-full bg-[#E8652B] text-white shadow-[4px_6px_0px_#74281A] flex items-center justify-center"
          disabled={form.formState.isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {form.formState.isSubmitting ? "註冊中..." : "註冊"}
        </motion.button>
        
        <div className="relative flex items-center mt-4">
          <span className="flex-grow border-t-2 border-[#F8D0B0]"></span>
          <span className="px-3 text-gray-500 text-sm">或</span>
          <span className="flex-grow border-t-2 border-[#F8D0B0]"></span>
        </div>

        <motion.button
          type="button"
          className="w-[98%] mx-auto h-10 text-base font-bold rounded-full border-2 border-[#F8D0B0] bg-white text-gray-700 flex items-center justify-center gap-3"
          onClick={onGoogleAuth}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Image src="/images/icon/google.svg" alt="Google" width={20} height={20} />
          <span>使用 Google 帳號註冊</span>
        </motion.button>
      </form>
    </Form>
  )
}
