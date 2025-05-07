import { NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/constants"

// 統一處理 API 回應
const handleApiResponse = (response: Response, data: any, fallbackErrorMessage: string) => {
  // 記錄回應內容以便調試
  console.log(`[Profile API] 回應資料:`, JSON.stringify(data, null, 2))
  
  // 處理錯誤回應
  if (!response.ok) {
    // 直接使用後端返回的錯誤訊息
    const errorMessage = data.message || fallbackErrorMessage
    console.log(`[Profile API] 錯誤回應: ${errorMessage}`)
    
    // 返回後端原始錯誤訊息
    return NextResponse.json(
      { status: false, message: errorMessage },
      { status: response.status }
    )
  }

  console.log(`[Profile API] 成功回應`)
  // 回傳成功的回應內容
  return NextResponse.json(data, { status: response.status })
}

export async function GET(req: NextRequest) {
  try {
    console.log("[Profile API] GET 請求開始處理")
    
    // 使用環境變數或常數
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL
    
    // 從請求頭獲取 Authorization token
    const authHeader = req.headers.get("Authorization")
    
    if (!authHeader) {
      console.log("[Profile API] 未提供授權資訊")
      return NextResponse.json(
        { status: false, message: "未提供授權資訊" },
        { status: 401 }
      )
    }
    
    console.log("[Profile API] 正在請求後端 API...")
    
    // 發送請求到後端 API
    const requestUrl = `${apiUrl}/api/users/profile`
    console.log(`[Profile API] 發送請求到: ${requestUrl}`)
    
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
    })
    
    console.log(`[Profile API] 後端 API 回應狀態: ${response.status}`)

    // 獲取回應內容
    const data = await response.json()
    
    console.log("[Profile API] 後端 API 回應完成")
    
    return handleApiResponse(response, data, "獲取使用者資料失敗")
  } catch (error) {
    console.error("[Profile API] 發生錯誤:", error)
    return NextResponse.json(
      { status: false, message: "獲取使用者資料失敗，請稍後再試" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    console.log("[Profile API] PUT 請求開始處理")
    
    const userData = await req.json()
    console.log("[Profile API] 收到使用者資料:", JSON.stringify(userData, null, 2))

    // 使用環境變數或常數
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL
    
    // 從請求頭獲取 Authorization token
    const authHeader = req.headers.get("Authorization")
    
    if (!authHeader) {
      console.log("[Profile API] 未提供授權資訊")
      return NextResponse.json(
        { status: false, message: "未提供授權資訊" },
        { status: 401 }
      )
    }
    
    console.log("[Profile API] 正在請求後端 API...")
    
    // 發送請求到後端 API
    const requestUrl = `${apiUrl}/api/users/profile`
    console.log(`[Profile API] 發送請求到: ${requestUrl}`)
    
    const response = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(userData),
    })
    
    console.log(`[Profile API] 後端 API 回應狀態: ${response.status}`)

    // 獲取回應內容
    const data = await response.json()
    
    console.log("[Profile API] 後端 API 回應完成")
    
    return handleApiResponse(response, data, "更新使用者資料失敗")
  } catch (error) {
    console.error("[Profile API] 發生錯誤:", error)
    return NextResponse.json(
      { status: false, message: "更新使用者資料失敗，請稍後再試" },
      { status: 500 }
    )
  }
} 