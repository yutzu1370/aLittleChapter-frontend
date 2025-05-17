"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InputField } from "@/components/ui/InputField"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CalendarIcon, PencilIcon, SaveIcon, XIcon, Upload, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/store/useAuthStore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// 從 localStorage 獲取 token 的通用函數
const getTokenFromLocalStorage = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    const authStorage = localStorage.getItem('auth-storage')
    if (!authStorage) return null
    const authData = JSON.parse(authStorage)
    return authData.state?.token || null
  } catch (error) {
    console.error('從 localStorage 獲取 token 失敗:', error)
    return null
  }
}

// 使用 axios 發送 API 請求的通用函數
const callApi = async <T,>(path: string, method: string = 'GET', data?: any): Promise<T> => {
  // 從 localStorage 獲取 token
  const token = getTokenFromLocalStorage()
  
  // 獲取 API 基礎 URL
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://little-chapter-backend.onrender.com"
  
  // 構建完整的 API 路徑
  const apiPath = `${apiUrl}/api/users/${path.replace(/^\//, '')}`
  
  console.log(`[Profile Client] 發送請求到: ${apiPath}`)
  
  try {
    // 設定 axios 請求配置
    const config = {
      method,
      url: apiPath,
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      data: data ? data : undefined
    }
    
    // 發送請求
    const response = await axios(config)
    
    // 獲取回應內容
    const responseData = response.data
    
    // 檢查回應狀態
    if (responseData.status === false) {
      // 直接使用後端返回的錯誤訊息
      const errorMessage = responseData.message || `API 請求失敗`
      console.error(`[Profile Client] API 錯誤: ${errorMessage}`)
      throw new Error(errorMessage)
    }
    
    console.log(`[Profile Client] API 回應成功:`, responseData)
    
    // 假設 API 回應格式為 { status: boolean, data: T, message?: string }
    return responseData.data || responseData
  } catch (error) {
    // 處理 axios 錯誤
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || "API 請求失敗"
      console.error(`[Profile Client] API 調用錯誤:`, errorMessage)
      throw new Error(errorMessage)
    } else {
      console.error(`[Profile Client] API 調用錯誤:`, error)
      throw error
    }
  }
}

// 城市資料結構
interface CityData {
  name: string;
  children: {
    name: string;
    children?: {
      name: string;
    }[];
  }[];
}

// 表單驗證 Schema
const profileSchema = z.object({
  name: z.string().min(1, { message: "姓名不可為空" }),
  gender: z.enum(["男", "女"], { 
    required_error: "請選擇性別" 
  }),
  birthdate: z.date({
    required_error: "請選擇生日",
  }),
  phone: z.string()
    .min(8, { message: "電話號碼至少需要8位數" })
    .regex(/^\d+$/, { message: "電話號碼必須為數字" }),
  email: z
    .string()
    .min(1, { message: "電子郵件不可為空" })
    .email({ message: "電子郵件格式不正確" }),
  address: z.object({
    city: z.string().min(1, { message: "請選擇城市" }),
    district: z.string().min(1, { message: "請選擇區域" }),
    detail: z.string().min(1, { message: "地址不可為空" }),
  }),
  avatar: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

// 顯示在左側的使用者資料介面
interface DisplayProfile {
  name: string;
  gender: string;
  birthdate: string;
  phone: string;
  email: string;
  address: {
    city: string;
    district: string;
    detail: string;
  };
  avatar?: string;
}

export default function ProfileClient() {
  const router = useRouter()
  const { logout } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState("")
  const [userProfile, setUserProfile] = useState<DisplayProfile>({
    name: "",
    gender: "",
    birthdate: "",
    phone: "",
    email: "",
    address: {
      city: "",
      district: "",
      detail: "",
    },
  })
  const [cities, setCities] = useState<{ value: string; label: string }[]>([])
  const [districts, setDistricts] = useState<Record<string, { value: string; label: string }[]>>({})
  const [cityData, setCityData] = useState<CityData | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  // 初始化表單
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      gender: "男",
      phone: "",
      email: "",
      address: {
        city: "",
        district: "",
        detail: "",
      },
    },
  })

  // 即時監聽表單值的變化，更新左側顯示
  // 使用 watch 的特定欄位而不是整個表單
  const name = watch("name")
  const gender = watch("gender")
  const birthdate = watch("birthdate")
  const phone = watch("phone")
  const email = watch("email")
  const addressCity = watch("address.city")
  const addressDistrict = watch("address.district")
  const addressDetail = watch("address.detail")
  const avatar = watch("avatar")
  
  useEffect(() => {
    // 將表單值轉換為顯示值
    setUserProfile({
      name: name || "",
      gender: gender || "",
      birthdate: birthdate ? format(birthdate, "yyyy-MM-dd") : "",
      phone: phone || "",
      email: email || "",
      address: {
        city: addressCity || "",
        district: addressDistrict || "",
        detail: addressDetail || "",
      },
      avatar: avatar || "",
    })
  }, [name, gender, birthdate, phone, email, addressCity, addressDistrict, addressDetail, avatar])

  // 獲取城市和區域資料
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        // 使用 axios 獲取城市資料
        const response = await axios.get('/data/city.json')
        const data: CityData = response.data
        setCityData(data)
        console.log("[城市資料] 載入完成", data.children.length, "個城市")
        
        // 構建城市選項
        const cityOptions = data.children.map(city => ({
          value: city.name,
          label: city.name
        }))
        setCities(cityOptions)
        
        // 構建區域選項
        const districtMap: Record<string, { value: string; label: string }[]> = {}
        data.children.forEach(city => {
          if (city.children) {
            districtMap[city.name] = city.children.map(district => ({
              value: district.name,
              label: district.name
            }))
          }
        })
        setDistricts(districtMap)
      } catch (error) {
        console.error('獲取城市資料失敗:', error)
        toast.error('無法載入城市資料')
      }
    }
    
    fetchCityData()
  }, [])

  // 監聽城市變化
  useEffect(() => {
    if (addressCity && addressCity !== selectedCity) {
      setSelectedCity(addressCity)
      setValue("address.district", "")
    }
  }, [addressCity, selectedCity, setValue])

  // 獲取用戶資料，但要等cityData載入後才執行
  useEffect(() => {
    // 如果cityData尚未載入，不執行
    if (!cityData) {
      console.log("[使用者資料] 等待城市資料載入完成...")
      return
    }

    console.log("[使用者資料] 城市資料已載入，開始獲取使用者資料")
    
    const fetchUserProfile = async () => {
      try {
        setIsInitialLoading(true)
        
        // API 請求獲取用戶資料
        const data = await callApi<any>("profile", "GET")
        console.log("[使用者資料] API回應:", data)
        
        // 設置表單值，根據新的API回應結構調整
        if (data && data.user) {
          const userData = data.user;
          
          // 從地址字串中分解城市、區域和詳細地址
          let city = "";
          let district = "";
          let detail = userData.address || "";
          
          // 創建一個函數來解析地址
          const parseAddress = (address: string) => {
            console.log("[地址解析] 開始解析地址:", address);
            console.log("[地址解析] cityData 是否存在:", !!cityData);
            
            if (!address || !cityData || !cityData.children) {
              console.log("[地址解析] 資料不完整，返回空結果");
              return { city: "", district: "", detail: address };
            }
            
            // 遍歷所有城市
            for (const cityObj of cityData.children) {
              // 檢查地址是否以該城市開頭
              const cityName = cityObj.name;
              
              if (address.indexOf(cityName) === 0) {
                console.log("[地址解析] 找到城市:", cityName);
                // 找到城市，繼續檢查區域
                const addressWithoutCity = address.substring(cityName.length);
                
                // 確保城市有區域資料
                if (cityObj.children && cityObj.children.length > 0) {
                  // 遍歷該城市的所有區域
                  for (const districtObj of cityObj.children) {
                    const districtName = districtObj.name;
                    
                    // 檢查剩餘地址是否以該區域開頭
                    if (addressWithoutCity.indexOf(districtName) === 0) {
                      console.log("[地址解析] 找到區域:", districtName);
                      // 找到區域，剩餘部分為詳細地址
                      const detailAddress = addressWithoutCity.substring(districtName.length);
                      
                      return {
                        city: cityName,
                        district: districtName,
                        detail: detailAddress
                      };
                    }
                  }
                }
                
                // 如果找到城市但沒找到區域，則剩餘全部為詳細地址
                return {
                  city: cityName,
                  district: "",
                  detail: addressWithoutCity
                };
              }
            }
            
            // 如果沒找到任何匹配，返回原始地址作為詳細地址
            console.log("[地址解析] 沒有找到任何匹配的城市");
            return { city: "", district: "", detail: address };
          };
          
          // 執行解析
          if (detail) {
            console.log("[地址解析] 解析前的地址:", detail);
            
            const parsedAddress = parseAddress(detail);
            city = parsedAddress.city;
            district = parsedAddress.district;
            detail = parsedAddress.detail;
            
            console.log("[地址解析] 解析後結果:", { city, district, detail });
          }
          
          // 更新表單
          reset({
            name: userData.name || "",
            gender: userData.gender === "female" ? "女" : "男",
            birthdate: userData.birthDate ? new Date(userData.birthDate) : undefined,
            phone: userData.phone || "",
            email: userData.email || "",
            address: {
              city: city,
              district: district,
              detail: detail,
            },
            avatar: userData.avatar || "",
          })
          
          // 更新顯示資料
          setUserProfile({
            name: userData.name || "",
            gender: userData.gender === "female" ? "女" : "男",
            birthdate: userData.birthDate || "",
            phone: userData.phone || "",
            email: userData.email || "",
            address: {
              city: city,
              district: district,
              detail: detail,
            },
            avatar: userData.avatar || "",
          })
          
          if (city) {
            setSelectedCity(city)
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "獲取資料失敗"
        console.error("獲取用戶資料失敗:", error)
        toast.error(errorMessage)
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchUserProfile()
  }, [cityData, reset]) // 當cityData變更時重新執行

  // 處理頭像上傳
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      // 建立預覽 URL
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
      
      // 直接設定頭像預覽並準備上傳
      setValue("avatar", fileUrl)
      
      // 自動處理上傳
      handleAvatarUpload(file, fileUrl)
    }
  }

  const handleAvatarUpload = async (file: File, fileUrl: string) => {
    try {
      // 建立表單資料
      const formData = new FormData()
      formData.append("avatar", file)

      // 使用 axios 上傳頭像 (實際應用中應該有後端 API)
      // const response = await axios.post("/api/upload-avatar", formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })
      
      // 測試用，直接使用預覽URL
      toast.success("頭像已更新")
      
      // 清理舊的預覽 URL 物件（如果有的話）
      if (avatar && avatar !== fileUrl && avatar.startsWith("blob:")) {
        URL.revokeObjectURL(avatar)
      }
    } catch (error) {
      console.error("上傳頭像失敗:", error)
      toast.error("上傳頭像失敗，請稍後再試")
    }
  }

  // 提交處理
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true)
      
      // 轉換資料格式以符合後端 API 需求
      const formattedData = {
        name: values.name,
        gender: values.gender === "女" ? "female" : "male",
        phone: values.phone,
        birthDate: values.birthdate ? format(values.birthdate, "yyyy-MM-dd") : "",
        address: `${values.address.city}${values.address.district}${values.address.detail}`
      };
      
      console.log("[提交資料] 轉換後的資料:", formattedData);
      
      // API 請求更新用戶資料
      const data = await callApi<any>("profile", "PUT", formattedData);
      
      // 更新左側顯示資料
      setUserProfile({
        name: data.name || values.name || "",
        gender: data.gender === "female" ? "女" : "男",
        birthdate: values.birthdate ? format(values.birthdate, "yyyy-MM-dd") : "",
        phone: data.phone || values.phone || "",
        email: data.email || values.email || "",
        address: {
          city: values.address.city || "",
          district: values.address.district || "",
          detail: values.address.detail || "",
        },
        avatar: data.avatar || values.avatar || "",
      })
      
      toast.success("個人資料已成功更新")
      setIsEditing(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "更新資料失敗"
      console.error("更新用戶資料失敗:", error)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // 取消編輯
  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

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

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-pulse text-lg text-gray-500">載入中...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-12">
      {/* 左側：使用者資訊卡 */}
      <div className="w-full md:w-64">
        <div className="flex flex-col items-center">
          <Avatar className="w-32 h-32 mb-3">
            <AvatarImage src={userProfile.avatar || ""} />
            <AvatarFallback className="bg-blue-500">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-medium">{userProfile.name}</h3>
          <p className="text-sm text-gray-500 mb-5">{userProfile.email}</p>
          
          {/* 按鈕群組 */}
          <div className="space-y-3 w-full">
            <Button 
              variant="outline"
              className="w-full bg-white border-[#E8652B] text-[#E8652B] hover:bg-[#FCE9D8] rounded-full font-medium shadow-[4px_4px_0px_#902d1c] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              更換大頭貼
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </Button>
            
            <Button 
              variant="outline"
              className="w-full bg-white border-[#E8652B] text-[#E8652B] hover:bg-[#FCE9D8] rounded-full font-medium shadow-[4px_4px_0px_#902d1c] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
              onClick={() => router.push("/account/change-password")}
            >
              修改密碼
            </Button>
            
            <Button 
              variant="outline"
              className="w-full bg-white border-[#E8652B] text-[#E8652B] hover:bg-[#FCE9D8] rounded-full font-medium shadow-[4px_4px_0px_#902d1c] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all flex items-center"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              登出
            </Button>
          </div>
        </div>
      </div>

      {/* 右側：表單區域 */}
      <div className="flex-1">
        <div className="flex justify-end mb-4">
          {!isEditing && (
            <Button
              type="button"
              className="px-6 py-3 bg-[#E8652B] hover:bg-[#D94A1D] text-white rounded-full flex items-center gap-2"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="w-4 h-4" />
              編輯資料
            </Button>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* 姓名欄位 */}
          <div className="grid grid-cols-12 items-center gap-4">
            <Label htmlFor="name" className="col-span-2">姓名</Label>
            <div className="col-span-10">
              <input
                {...register("name")}
                id="name"
                className="w-full px-4 py-3 rounded-full border border-[#E5E5E5]"
                disabled={!isEditing}
              />
            </div>
          </div>
          
          {/* 性別欄位 */}
          <div className="grid grid-cols-12 items-center gap-4">
            <Label className="col-span-2">性別</Label>
            <div className="col-span-10">
              <RadioGroup 
                value={gender} 
                onValueChange={(value) => isEditing && setValue("gender", value as "男" | "女")}
                className="flex space-x-12"
                disabled={!isEditing}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="男" 
                    id="male" 
                    className={gender === "男" ? "border-[#D94A1D] text-[#D94A1D]" : ""} 
                    disabled={!isEditing}
                  />
                  <Label htmlFor="male" className={!isEditing ? "opacity-70" : ""}>男</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="女" 
                    id="female" 
                    className={gender === "女" ? "border-[#D94A1D] text-[#D94A1D]" : ""}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="female" className={!isEditing ? "opacity-70" : ""}>女</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          {/* 生日欄位 */}
          <div className="grid grid-cols-12 items-center gap-4">
            <Label className="col-span-2">生日</Label>
            <div className="col-span-10">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between rounded-full border-[#E5E5E5] px-4 py-3 h-auto text-left font-normal ${!isEditing ? 'opacity-70 pointer-events-none' : ''}`}
                    disabled={!isEditing}
                  >
                    {birthdate ? format(birthdate, "yyyy/MM/dd") : "選擇生日"}
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={birthdate}
                    onSelect={(date) => setValue("birthdate", date!)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    locale={zhTW}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* 電話欄位 */}
          <div className="grid grid-cols-12 items-center gap-4">
            <Label htmlFor="phone" className="col-span-2">電話</Label>
            <div className="col-span-10">
              <input
                {...register("phone")}
                id="phone"
                className="w-full px-4 py-3 rounded-full border border-[#E5E5E5]"
                disabled={!isEditing}
              />
            </div>
          </div>
          
          {/* 地址欄位 */}
          <div className="grid grid-cols-12 items-center gap-4">
            <Label className="col-span-2">地址</Label>
            <div className="col-span-10 grid grid-cols-12 gap-3">
              {/* 城市選擇 */}
              <div className="col-span-4">
                <select
                  {...register("address.city")}
                  className="w-full px-4 py-3 rounded-full border border-[#E5E5E5] appearance-none bg-[url('/images/icon/arrow-down.svg')] bg-no-repeat bg-right-center bg-[length:20px_20px] pr-8"
                  disabled={!isEditing}
                >
                  <option value="">請選擇城市</option>
                  {cities.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 區域選擇 */}
              <div className="col-span-4">
                <select
                  {...register("address.district")}
                  className="w-full px-4 py-3 rounded-full border border-[#E5E5E5] appearance-none bg-[url('/images/icon/arrow-down.svg')] bg-no-repeat bg-right-center bg-[length:20px_20px] pr-8"
                  disabled={!isEditing || !selectedCity}
                >
                  <option value="">請選擇區域</option>
                  {selectedCity && districts[selectedCity] && 
                    districts[selectedCity].map((district) => (
                      <option key={district.value} value={district.value}>
                        {district.label}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              {/* 詳細地址 */}
              <div className="col-span-12">
                <input
                  {...register("address.detail")}
                  className="w-full px-4 py-3 rounded-full border border-[#E5E5E5]"
                  placeholder="詳細地址"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
          
          {/* Email欄位 */}
          <div className="grid grid-cols-12 items-center gap-4">
            <Label htmlFor="email" className="col-span-2">E-mail</Label>
            <div className="col-span-10">
              <input
                {...register("email")}
                id="email"
                className="w-full px-4 py-3 rounded-full border border-[#E5E5E5] bg-gray-50"
                disabled
              />
            </div>
          </div>
          
          {/* 按鈕區域 */}
          <div className="flex justify-end mt-8 space-x-4">
            {isEditing ? (
              <>
                <Button 
                  type="button" 
                  variant="outline"
                  className="px-6 py-3 border-[#E8652B] text-[#E8652B] rounded-full flex items-center gap-2"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <XIcon className="w-4 h-4" />
                  取消
                </Button>
                <Button 
                  type="submit" 
                  className="px-6 py-3 bg-[#E8652B] hover:bg-[#D94A1D] text-white rounded-full flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <SaveIcon className="w-4 h-4" />
                  )}
                  儲存變更
                </Button>
              </>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  )
} 