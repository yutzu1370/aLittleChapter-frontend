import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    // 使用環境變數或常數
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
    
    // 發送請求到後端 API
    const response = await fetch(`${apiUrl}/api/users/log-in`, {
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
      const errorMessage = data.message || "登入請求失敗";
      
      // 根據狀態碼返回特定的錯誤訊息
      if (response.status === 401) {
        return NextResponse.json(
          { status: false, message: "帳號或密碼錯誤" },
          { status: 401 }
        );
      } else if (response.status === 403) {
        return NextResponse.json(
          { status: false, message: "帳戶未驗證，請檢查您的電子信箱進行驗證" },
          { status: 403 }
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
    console.error("登入失敗:", error);
    return NextResponse.json(
      { status: false, message: "登入請求失敗，請稍後再試" },
      { status: 500 }
    );
  }
} 