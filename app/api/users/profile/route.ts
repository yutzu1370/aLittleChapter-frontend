import { NextRequest, NextResponse } from "next/server"

// 模擬使用者資料（實際應用中會從資料庫獲取）
let userData = {
  name: "蔡咪咪",
  gender: "女",
  birthdate: "2000-03-06",
  phone: "0963123123",
  email: "tzu111@gmail.com",
  address: {
    city: "台南市",
    district: "東區",
    detail: "東區路100號",
  },
  avatar: "",
}

export async function GET() {
  try {
    // 模擬從資料庫獲取使用者資料
    // 實際應用中，需要獲取當前登入的使用者ID，然後從資料庫獲取該使用者的資料
    return NextResponse.json(userData, { status: 200 })
  } catch (error) {
    console.error("獲取使用者資料失敗:", error)
    return NextResponse.json(
      { error: "獲取使用者資料失敗" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()

    // 驗證請求資料（簡單驗證）
    if (!data.name || !data.gender || !data.email) {
      return NextResponse.json(
        { error: "必填欄位不可為空" },
        { status: 400 }
      )
    }

    // 模擬資料更新
    // 實際應用中，需要獲取當前登入的使用者ID，然後更新資料庫中該使用者的資料
    userData = {
      ...userData,
      ...data,
      // 確保可能被覆蓋的巢狀物件屬性被正確處理
      address: {
        ...userData.address,
        ...data.address,
      },
    }

    // 轉換日期格式以便儲存
    if (data.birthdate && data.birthdate instanceof Date) {
      userData.birthdate = data.birthdate.toISOString().split("T")[0]
    }

    return NextResponse.json(userData, { status: 200 })
  } catch (error) {
    console.error("更新使用者資料失敗:", error)
    return NextResponse.json(
      { error: "更新使用者資料失敗" },
      { status: 500 }
    )
  }
} 