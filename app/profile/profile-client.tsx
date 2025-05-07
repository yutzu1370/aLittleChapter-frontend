"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InputField } from "@/components/ui/InputField"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CalendarIcon, PencilIcon, SaveIcon, XIcon, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { toast } from "sonner"
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

// 發送 API 請求的通用函數
const callApi = async <T,>(path: string, method: string = 'GET', data?: any): Promise<T> => {
  // 從 localStorage 獲取 token
  const token = getTokenFromLocalStorage()
  
  // 獲取 API 基礎 URL
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://little-chapter-backend.onrender.com"
  
  // 組建請求選項
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    },
  }
  
  // 如果有資料，加入請求主體
  if (data) {
    options.body = JSON.stringify(data)
  }
  
  // 構建完整的 API 路徑
  const apiPath = `${apiUrl}/api/users/${path.replace(/^\//, '')}`
  
  console.log(`[Profile Client] 發送請求到: ${apiPath}`)
  
  try {
    // 發送請求
    const response = await fetch(apiPath, options)
    
    // 獲取回應內容
    const responseData = await response.json()
    
    // 檢查回應狀態
    if (!response.ok || responseData.status === false) {
      // 直接使用後端返回的錯誤訊息
      const errorMessage = responseData.message || `API 請求失敗: ${response.status}`
      console.error(`[Profile Client] API 錯誤: ${errorMessage}`)
      throw new Error(errorMessage)
    }
    
    console.log(`[Profile Client] API 回應成功:`, responseData)
    
    // 假設 API 回應格式為 { status: boolean, data: T, message?: string }
    return responseData.data || responseData
  } catch (error) {
    console.error(`[Profile Client] API 調用錯誤:`, error)
    throw error
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
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
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
        const response = await fetch('/data/city.json')
        if (!response.ok) {
          throw new Error('無法獲取城市資料')
        }
        const data: CityData = await response.json()
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
    }
  }

  const handleAvatarUpload = async () => {
    if (!selectedFile) return

    try {
      // 建立表單資料
      const formData = new FormData()
      formData.append("avatar", selectedFile)

      // 模擬上傳處理 (實際應用中應該有後端 API)
      // const response = await fetch("/api/upload-avatar", {
      //   method: "POST",
      //   body: formData,
      // })
      
      // 測試用，直接使用預覽URL
      setValue("avatar", previewUrl)
      setIsAvatarDialogOpen(false)
      toast.success("頭像已更新")
      
      // 清理預覽 URL 物件
      URL.revokeObjectURL(previewUrl)
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

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-pulse text-lg text-gray-500">載入中...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
      {/* 左側：使用者資訊卡 */}
      <Card className="p-6 bg-white rounded-xl shadow-md md:col-span-1 h-full flex flex-col">
        <h2 className="text-lg font-semibold text-amber-800 mb-4 border-b pb-2">使用者資訊</h2>
        
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-32 h-32 border-2 border-amber-200 mb-4">
            <AvatarImage src={userProfile.avatar || ""} />
            <AvatarFallback className="bg-amber-100 text-amber-800 text-xl">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="space-y-4">
          <div className="border-b pb-6">
            <span className="text-sm text-gray-500">姓名：</span>
            <span className="font-medium">{userProfile.name}</span>
          </div>
          
          <div className="border-b pb-6">
            <span className="text-sm text-gray-500">性別：</span>
            <span className="font-medium">{userProfile.gender}</span>
          </div>
          
          <div className="border-b pb-6">
            <span className="text-sm text-gray-500">生日：</span>
            <span className="font-medium">{userProfile.birthdate}</span>
          </div>
          
          <div className="border-b pb-6">
            <span className="text-sm text-gray-500">電話：</span>
            <span className="font-medium">{userProfile.phone}</span>
          </div>
          
          <div className="border-b pb-6">
            <span className="text-sm text-gray-500">信箱：</span>
            <span className="font-medium">{userProfile.email}</span>
          </div>
          
          <div>
            <span className="text-sm text-gray-500">地址：</span>
            <span className="font-medium block mt-1">
              {userProfile.address.city} {userProfile.address.district} {userProfile.address.detail}
            </span>
          </div>
        </div>
      </Card>

      {/* 右側：編輯表單 */}
      <Card className="p-6 bg-white rounded-xl shadow-md md:col-span-2 h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-amber-800">個人資料</h2>
          {!isEditing && (
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 bg-gray-200 hover:bg-gray-300"
              onClick={() => setIsEditing(true)}
            >
              編輯
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 頭像部分 */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-amber-200">
                <AvatarImage src={avatar || ""} />
                <AvatarFallback className="bg-amber-100 text-amber-800 text-lg">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                  <DialogTrigger asChild>
                    <button 
                      type="button"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-md"
                      aria-label="上傳頭像"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>重新上傳頭貼</DialogTitle>
                      <DialogDescription>
                        選擇一張新的頭像照片
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex flex-col items-center justify-center gap-4">
                        {previewUrl ? (
                          <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-amber-200">
                            <img 
                              src={previewUrl} 
                              alt="頭像預覽" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="w-40 h-40 border-2 border-amber-200">
                            <AvatarImage src={avatar || ""} />
                            <AvatarFallback className="bg-amber-100 text-amber-800 text-4xl">
                              {name ? name.charAt(0).toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <label className="cursor-pointer">
                          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>{previewUrl ? "重新選擇" : "選擇照片"}</span>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-6">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsAvatarDialogOpen(false);
                            setPreviewUrl("");
                            setSelectedFile(null);
                          }}
                        >
                          取消
                        </Button>
                        <Button 
                          type="button" 
                          onClick={handleAvatarUpload}
                          disabled={!selectedFile}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          確認上傳
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            {isEditing && (
              <span className="text-xs text-gray-500 mt-2">點擊頭像右下角按鈕可更新頭貼</span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-baseline">
            {/* 姓名 */}
            <InputField
              label="姓名"
              {...register("name")}
              error={errors.name?.message}
              disabled={!isEditing}
              className={cn(
                isEditing ? "!border-gray-200" : "!border-gray-200 bg-gray-50"
              )}
            />

            {/* 性別 */}
            <div className="space-y-2">
              <Label>性別</Label>
              <RadioGroup 
                value={gender} 
                onValueChange={(value) => setValue("gender", value as "男" | "女")}
                disabled={!isEditing}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="男" id="male" className="focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-500" />
                  <Label htmlFor="male" className="cursor-pointer">男</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="女" id="female" className="focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-500" />
                  <Label htmlFor="female" className="cursor-pointer">女</Label>
                </div>
              </RadioGroup>
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>

            {/* 生日 */}
            <div className="space-y-2">
              <Label>生日</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !birthdate && "text-muted-foreground",
                      "!border-gray-200",
                      !isEditing && "bg-gray-50",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                    )}
                    disabled={!isEditing}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthdate ? (
                      format(birthdate, "yyyy-MM-dd")
                    ) : (
                      <span>選擇生日</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-100" align="start">
                  <Calendar
                    mode="single"
                    selected={birthdate}
                    onSelect={(date) => setValue("birthdate", date!)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    locale={zhTW}
                    className="bg-gray-100"
                  />
                </PopoverContent>
              </Popover>
              {errors.birthdate && (
                <p className="text-xs text-red-500">{errors.birthdate.message}</p>
              )}
            </div>

            {/* 電話 */}
            <InputField
              label="電話"
              {...register("phone")}
              error={errors.phone?.message}
              disabled={!isEditing}
              className={cn(
                isEditing ? "!border-gray-200" : "!border-gray-200 bg-gray-50"
              )}
            />

            {/* 信箱 */}
            <InputField
              label="信箱"
              {...register("email")}
              error={errors.email?.message}
              disabled={true}
              className={cn(
                "!border-gray-200 bg-gray-50"
              )}
            />

            {/* 地址 - 城市 */}
            <div className="space-y-2">
              <Label>城市</Label>
              <select
                {...register("address.city")}
                disabled={!isEditing}
                className={cn(
                  "w-full px-3 py-2 border rounded-md focus:outline-none",
                  "border-gray-200",
                  !isEditing && "bg-gray-50"
                )}
              >
                <option value="">請選擇城市</option>
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
              {errors.address?.city && (
                <p className="text-xs text-red-500">{errors.address.city.message}</p>
              )}
            </div>

            {/* 地址 - 區域 */}
            <div className="space-y-2">
              <Label>區域</Label>
              <select
                {...register("address.district")}
                disabled={!isEditing || !selectedCity}
                className={cn(
                  "w-full px-3 py-2 border rounded-md focus:outline-none",
                  "border-gray-200",
                  (!isEditing || !selectedCity) && "bg-gray-50"
                )}
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
              {errors.address?.district && (
                <p className="text-xs text-red-500">{errors.address.district.message}</p>
              )}
            </div>

            {/* 地址 - 詳細地址 */}
            <div className="md:col-span-2">
              <InputField
                label="詳細地址"
                {...register("address.detail")}
                error={errors.address?.detail?.message}
                disabled={!isEditing}
                className={cn(
                  isEditing ? "!border-gray-200" : "!border-gray-200 bg-gray-50"
                )}
              />
            </div>
          </div>

          {/* 編輯模式下的按鈕 */}
          {isEditing && (
            <div className="flex justify-end gap-4 sticky bottom-0 pt-4 pb-2 bg-white">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isLoading}
                className="border-gray-300 text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                取消
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    儲存中...
                  </>
                ) : (
                  <>
                    儲存
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  )
} 