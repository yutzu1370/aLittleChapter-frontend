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
import { login } from "@/lib/services/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";

// 登入表單驗證模式
const loginSchema = z.object({
  email: z.string().min(1, "信箱不能為空"),
  password: z.string().min(1, "密碼不能為空"),
  rememberMe: z.boolean().optional().default(false)
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login: storeLogin } = useAuthStore();

  // 初始化表單
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  // 表單提交處理
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // 提示：可以使用 admin/password 測試登入
      // 呼叫登入 API
      const user = await login({
        email: data.email.trim(),
        password: data.password,
        rememberMe: data.rememberMe
      });

      // 更新全域狀態
      storeLogin(user);

      // 顯示成功訊息
      toast.success("登入成功", {
        description: "歡迎回來！即將為您導向會員中心" 
      });

      // 延遲 2 秒後重定向
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      let errorMessage = "登入失敗，請稍後再試";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // 顯示錯誤訊息
      toast.error("登入失敗", {
        description: errorMessage
      });
      
      // 保留用戶填寫的信箱，但清空密碼欄位（安全考量）
      form.setValue("password", "");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">會員登入</h1>
          <p className="mt-2 text-sm text-gray-600">
            登入您的帳號以開始使用服務
          </p>
          <p className="mt-1 text-xs text-gray-500">
            測試帳號：admin / 密碼：password
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                  </FormControl>
                  <FormLabel className="font-normal text-sm cursor-pointer">記住我</FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "登入中..." : "登入"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <Link href="/register" className="text-primary hover:underline">
            還沒有帳號？立即註冊
          </Link>
        </div>
      </div>
    </div>
  );
} 