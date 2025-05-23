"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card" 
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { KeyRound, Eye, EyeOff, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { changePasswordApi } from "@/lib/api/auth"

// 密碼更新表單驗證
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "請輸入當前密碼" }),
  newPassword: z
    .string()
    .min(8, { message: "密碼長度至少為 8 個字元" })
    .max(16, { message: "密碼長度不能超過 16 個字元" })
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/, 
      { message: "密碼必須包含英文及數字" }
    ),
  confirmPassword: z.string().min(1, { message: "請再次輸入新密碼" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "兩次輸入的密碼不一致",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "新密碼不能與當前密碼相同",
  path: ["newPassword"],
});

type PasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordClient() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  })

  const onSubmit = async (values: PasswordFormValues) => {
    setIsSubmitting(true)
    try {
      // 串接後端 API
      const response = await changePasswordApi({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      })
      if (response && response.status) {
        toast.success("密碼已成功更新", {
          description: "您的登入密碼已被變更，下次請使用新密碼登入"
        })
        reset()
      } else {
        toast.error("密碼更新失敗", {
          description: response?.message || "請確認您的當前密碼是否正確"
        })
      }
    } catch (error) {
      toast.error("密碼更新失敗", {
        description: "請確認您的當前密碼是否正確"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="animate-spring-up rounded-2xl border-[#E8652B]">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-[#E8652B]">修改您的密碼</CardTitle>
          <CardDescription>請輸入您的當前密碼及新密碼</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* 當前密碼 */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                當前密碼
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  className={cn(
                    "w-full px-4 py-3 rounded-full border border-[#E5E5E5] focus:border-[#E8652B] focus:ring-2 focus:ring-[#FCE9D8] focus:outline-none transition-colors",
                    errors.currentPassword && "border-red-500"
                  )}
                  {...register("currentPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCurrentPassword(prev => !prev)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <div className="text-red-500 text-xs flex items-center mt-1 ml-2">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.currentPassword.message}
                </div>
              )}
            </div>
            
            {/* 新密碼 */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">
                新密碼
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  className={cn(
                    "w-full px-4 py-3 rounded-full border border-[#E5E5E5] focus:border-[#E8652B] focus:ring-2 focus:ring-[#FCE9D8] focus:outline-none transition-colors",
                    errors.newPassword && "border-red-500"
                  )}
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(prev => !prev)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <div className="text-red-500 text-xs flex items-center mt-1 ml-2">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.newPassword.message}
                </div>
              )}
            </div>
            
            {/* 確認新密碼 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                確認新密碼
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={cn(
                    "w-full px-4 py-3 rounded-full border border-[#E5E5E5] focus:border-[#E8652B] focus:ring-2 focus:ring-[#FCE9D8] focus:outline-none transition-colors",
                    errors.confirmPassword && "border-red-500"
                  )}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="text-red-500 text-xs flex items-center mt-1 ml-2">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
            
            <div className="bg-[#fef5ee] p-3 rounded-md text-xs text-amber-800 space-y-1 mt-2">
              <p className="font-medium">密碼要求：</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>長度為 8-16 個字元</li>
                <li>必須包含英文及數字</li>
                <li>英文字母區分大小寫</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-3 pt-4 pb-4">
            <Button 
              variant="outline"
              type="button"
              disabled={isSubmitting}
              onClick={() => reset()}
              className="px-6 py-3 border-[#E8652B] text-[#E8652B] rounded-full hover:bg-[#FCE9D8] shadow-[4px_4px_0px_#902d1c] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#E8652B] hover:bg-[#D94A1D] text-white rounded-full gap-2 shadow-[4px_4px_0px_#902d1c] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  處理中...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  更新密碼
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
