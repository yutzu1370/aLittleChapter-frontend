import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    // 使用環境變數或常數
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
    
    // 發送請求到後端 API
    const response = await fetch(`${apiUrl}/api/users/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // 獲取回應內容
    const data = await response.json();

    // 處理特定錯誤狀態碼，提供更具體的錯誤訊息
    if (!response.ok) {
      // 如果後端返回了具體的錯誤訊息，就使用它
      const errorMessage = data.message || "註冊請求失敗";
      
      // 特別處理"電子信箱已被註冊"的情況
      if (response.status === 409 || 
          errorMessage.includes("email") || 
          errorMessage.includes("郵箱") || 
          errorMessage.includes("信箱") || 
          errorMessage.includes("已註冊") || 
          errorMessage.includes("already exists") || 
          errorMessage.includes("already registered")) {
        return NextResponse.json(
          { status: false, message: "此電子信箱已被註冊" },
          { status: 409 }
        );
      }
      
      // 根據狀態碼返回特定的錯誤訊息
      if (response.status === 400) {
        return NextResponse.json(
          { status: false, message: "無效的註冊資料，請檢查您的輸入" },
          { status: 400 }
        );
      }
      
      // 返回後端原始錯誤訊息
      return NextResponse.json(
        { status: false, message: errorMessage },
        { status: response.status }
      );
    }

    // 回傳成功的回應內容
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("註冊失敗:", error);
    return NextResponse.json(
      { status: false, message: "註冊請求失敗，請稍後再試" },
      { status: 500 }
    );
  }
} 