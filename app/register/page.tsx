"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


// 註冊表單驗證模式
const registerSchema = z.object({
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
}).refine((data) => data.password === data.confirmPassword, {
  message: "確認密碼與密碼不符",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 初始化表單
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  // 表單提交處理
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // 移除確認密碼欄位，只發送必要數據
      const { confirmPassword, ...signupData } = data;
      
      // 改為直接使用本地 API 代理
      const response = await fetch("/api/users/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: data.email.trim(),
          password: data.password,
        })
      });
      
      const responseData = await response.json();
      
      // 不使用 throw Error，而是直接處理錯誤響應
      if (!response.ok) {
        // 顯示錯誤訊息
        toast.error("註冊失敗", {
          description: responseData.message || "註冊失敗",
          duration: 2000
        });
        
        // 保留使用者填寫的信箱，但清空密碼欄位（安全考量）
        form.setValue("password", "");
        form.setValue("confirmPassword", "");
        
        setIsLoading(false);
        return; // 提早返回，不執行後續代碼
      }

      // 顯示成功訊息
      toast.success("註冊成功", {
        description: "已發送驗證信至您的信箱，請於 24 小時內完成驗證",
        duration: 2000
      });

      // 延遲 2 秒後重定向到首頁
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("註冊請求過程發生錯誤", error);
      
      // 處理網路錯誤等非預期錯誤
      toast.error("註冊失敗", {
        description: "網路連接問題，請稍後再試",
        duration: 2000
      });
      
      // 保留使用者填寫的信箱，但清空密碼欄位（安全考量）
      form.setValue("password", "");
      form.setValue("confirmPassword", "");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">會員註冊</h1>
          <p className="mt-2 text-sm text-gray-600">
            建立您的帳號以開始使用服務
          </p>
          <p className="mt-1 text-xs text-gray-500">
            註冊成功後，請前往信箱查收驗證信
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>電子信箱</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="請輸入電子信箱"
                      {...field}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密碼</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="請輸入密碼"
                        {...field}
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500">密碼需包含英文大小寫及數字，8-16個字元</p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>確認密碼</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="請再次輸入密碼"
                        {...field}
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "註冊中..." : "註冊"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <Link href="/login" className="text-primary hover:underline">
            已有帳號？立即登入
          </Link>
        </div>
      </div>
    </div>
  );
} 