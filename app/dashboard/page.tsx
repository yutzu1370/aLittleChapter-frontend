"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  // 確保只在客戶端渲染
  useEffect(() => {
    setIsClient(true);
    
    // 驗證使用者是否已登入
    if (!isAuthenticated) {
      toast.error("請先登入", {
        description: "您需要登入才能訪問此頁面"
      });
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // 處理登出
  const handleLogout = () => {
    // 清除 localStorage 與 Zustand 狀態
    logout();
    
    // 顯示成功訊息
    toast.success("已成功登出", {
      description: "期待您的再次訪問"
    });
    
    // 重定向到首頁
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  // 計算 token 剩餘有效期（假設 token 格式包含時間戳）
  const getTokenExpiry = () => {
    if (!user?.token) return null;
    
    // 嘗試從 token 中提取時間戳 (假設 token 格式為 token_timestamp_random)
    try {
      const parts = user.token.split('_');
      if (parts.length > 1) {
        const timestamp = parseInt(parts[1]);
        if (!isNaN(timestamp)) {
          // 假設 token 有效期為 7 天
          const expiryDate = new Date(timestamp + 7 * 24 * 60 * 60 * 1000);
          const now = new Date();
          
          // 計算剩餘天數
          const diffTime = expiryDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return diffDays > 0 ? `${diffDays} 天` : '已過期';
        }
      }
    } catch (error) {
      console.error('計算 token 有效期錯誤', error);
    }
    
    return '未知';
  };

  if (!isClient || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">會員儀表板</h1>
            <Button variant="outline" onClick={handleLogout}>
              登出
            </Button>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-medium mb-4">會員資訊</h2>
            <div className="grid gap-4">
              <div>
                <span className="text-gray-500">會員 ID：</span>
                <span className="font-medium">{user?.id}</span>
              </div>
              <div>
                <span className="text-gray-500">電子信箱：</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div>
                <span className="text-gray-500">姓名：</span>
                <span className="font-medium">{user?.name || "尚未設定"}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Token 資訊</h2>
            <div className="bg-slate-100 p-3 rounded overflow-auto">
              <code className="text-xs break-all">{user?.token}</code>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">有效期限：</span> 7 天
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">剩餘時間：</span> {getTokenExpiry()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                當 Token 過期時，您需要重新登入以獲取新的授權
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 