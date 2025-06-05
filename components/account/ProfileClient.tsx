"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import ProfileButton from "@/components/ui/ProfileButton"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CalendarIcon, PencilIcon, SaveIcon, XIcon, LogOut } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/store/useAuthStore"
import axios from "axios"
import { getUserProfile, updateUserProfile, uploadAvatar, UpdateProfileData } from "@/lib/api/profile"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

// 添加一個緩存鍵
const CITY_DATA_CACHE_KEY = "little-chapter-city-data";
const USER_PROFILE_CACHE_KEY = "little-chapter-user-profile";

// 添加全局樣式覆蓋瀏覽器自動填充樣式
const globalStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: inherit !important;
    transition: background-color 5000s ease-in-out 0s;
  }
  
  /* 確保所有容器適應內容高度 */
  .content-fit {
    min-height: fit-content;
    height: auto !important;
  }
`;

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
    .length(10, { message: "電話號碼必須為10位數字" })
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
  const updateUser = useAuthStore((state) => state.updateUser)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState("")
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
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
  const name = watch("name")
  const gender = watch("gender")
  const birthdate = watch("birthdate")
  const phone = watch("phone")
  const email = watch("email")
  const addressCity = watch("address.city")
  const addressDistrict = watch("address.district")
  const addressDetail = watch("address.detail")
  const avatar = watch("avatar")
  
  // 最佳化：使用useMemo減少不必要的狀態更新
  const userProfileData = useMemo(() => ({
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
  }), [name, gender, birthdate, phone, email, addressCity, addressDistrict, addressDetail, avatar]);
  
  useEffect(() => {
    setUserProfile(userProfileData);
  }, [userProfileData]);

  // 解析地址函數 - 移至組件外部以減少重新創建
  const parseAddress = useCallback((address: string, cityDataObj: CityData | null) => {
    if (!address || !cityDataObj || !cityDataObj.children) {
      return { city: "", district: "", detail: address };
    }
    
    // 遍歷所有城市
    for (const cityObj of cityDataObj.children) {
      // 檢查地址是否以該城市開頭
      const cityName = cityObj.name;
      
      if (address.indexOf(cityName) === 0) {
        // 找到城市，繼續檢查區域
        const addressWithoutCity = address.substring(cityName.length);
        
        // 確保城市有區域資料
        if (cityObj.children && cityObj.children.length > 0) {
          // 遍歷該城市的所有區域
          for (const districtObj of cityObj.children) {
            const districtName = districtObj.name;
            
            // 檢查剩餘地址是否以該區域開頭
            if (addressWithoutCity.indexOf(districtName) === 0) {
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
    return { city: "", district: "", detail: address };
  }, []);

  // 獲取城市和區域資料 - 優化使用本地存儲緩存
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        // 嘗試從本地存儲獲取城市資料
        const cachedData = localStorage.getItem(CITY_DATA_CACHE_KEY);
        if (cachedData) {
          const data: CityData = JSON.parse(cachedData);
          processCityData(data);
          return;
        }
        
        // 如果沒有緩存，才從網路獲取
        const response = await axios.get('/data/city.json')
        const data: CityData = response.data
        
        // 處理和緩存城市資料
        processCityData(data);
        localStorage.setItem(CITY_DATA_CACHE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('獲取城市資料失敗:', error)
        toast.error('無法載入城市資料')
      }
    }
    
    // 處理城市資料的函數
    const processCityData = (data: CityData) => {
      setCityData(data);
      
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

  // 獲取用戶資料 - 優化使用本地存儲預載
  useEffect(() => {
    if (!cityData) return

    const fetchUserProfile = async () => {
      try {
        setIsInitialLoading(true)
        
        // 嘗試從本地存儲獲取用戶資料進行預載
        const cachedProfile = localStorage.getItem(USER_PROFILE_CACHE_KEY);
        let hasPreloadedData = false;
        
        if (cachedProfile) {
          try {
            const cachedData = JSON.parse(cachedProfile);
            if (cachedData && cachedData.user) {
              loadUserDataToForm(cachedData.user);
              hasPreloadedData = true;
            }
          } catch (e) {
            console.error("預載用戶資料失敗:", e);
            // 繼續從 API 加載
          }
        }
        
        // 無論是否已預載資料，都從 API 獲取最新資料
        const response = await getUserProfile();
        
        if (!response || !response.status) {
          toast.error("獲取資料失敗", {
            description: response?.message || "無法獲取用戶資料",
          });
          return;
        }
        
        const data = response.data;
        
        // 儲存到本地緩存
        if (data) {
          localStorage.setItem(USER_PROFILE_CACHE_KEY, JSON.stringify(data));
        }
        
        if (data && data.user) {
          loadUserDataToForm(data.user);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "獲取資料失敗"
        console.error("獲取用戶資料失敗:", error)
        toast.error(errorMessage)
      } finally {
        setIsInitialLoading(false)
      }
    }
    
    // 從用戶資料載入到表單的函數
    const loadUserDataToForm = (userData: any) => {
      // 從地址字串中分解城市、區域和詳細地址
      let city = "";
      let district = "";
      let detail = userData.address || "";
      
      // 執行解析
      if (detail) {
        const parsedAddress = parseAddress(detail, cityData);
        city = parsedAddress.city;
        district = parsedAddress.district;
        detail = parsedAddress.detail;
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
      
      // 如果有城市，設定選中的城市
      if (city) {
        setSelectedCity(city)
      }
    }

    fetchUserProfile()
  }, [cityData, reset, parseAddress])

  // 優化頭像上傳 - 預先載入頭像
  useEffect(() => {
    // 預載用戶頭像
    if (userProfile.avatar) {
      const img = new Image();
      img.src = userProfile.avatar;
    }
  }, [userProfile.avatar]);

  // 處理頭像上傳
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      // 確保清理任何之前的預覽 URL
      if (userProfile.avatar && userProfile.avatar.startsWith('blob:')) {
        URL.revokeObjectURL(userProfile.avatar);
      }
      
      // 建立預覽 URL
      const fileUrl = URL.createObjectURL(file)
      
      // 直接設定頭像預覽並準備上傳
      setValue("avatar", fileUrl)
      
      // 自動處理上傳
      handleAvatarUpload(file, fileUrl)
    }
  }

  const handleAvatarUpload = async (file: File, fileUrl: string) => {
    try {
      // 顯示上傳中的提示
      toast.loading("正在上傳頭像...");
      
      const response = await uploadAvatar(file);
      
      // 清除上傳中的提示
      toast.dismiss();
      
      if (!response || !response.status) {
        // 檢查是否為 Google Cloud 認證錯誤
        const errorMessage = response?.message || "";
        if (errorMessage.includes("Could not load the default credentials") || 
            errorMessage.includes("Google Cloud")) {
          toast.error("系統暫時無法處理頭像上傳", {
            description: "伺服器配置問題，請稍後再試或聯繫客服",
          });
        } else {
          toast.error("上傳頭像失敗", {
            description: response?.message || "上傳頭像失敗，請稍後再試",
          });
        }
        // 清理預覽 URL
        URL.revokeObjectURL(fileUrl);
        setValue("avatar", userProfile.avatar || "/images/user_icon/user.png");
        return;
      }
      
      // 成功上傳，使用後端回傳的頭像URL
      const newAvatarUrl = response.data?.avatar;
      if (newAvatarUrl) {
        // 預先加載新頭像圖片，確保在設置前已加載
        const img = new Image();
        img.onload = () => {
          // 圖片載入完成後再更新 UI
          setValue("avatar", newAvatarUrl);
          setUserProfile(prev => ({
            ...prev,
            avatar: newAvatarUrl
          }));
          
          // 更新本地用戶資料緩存
          const cachedProfile = localStorage.getItem(USER_PROFILE_CACHE_KEY);
          if (cachedProfile) {
            try {
              const profileData = JSON.parse(cachedProfile);
              if (profileData && profileData.user) {
                profileData.user.avatar = newAvatarUrl;
                localStorage.setItem(USER_PROFILE_CACHE_KEY, JSON.stringify(profileData));
              }
            } catch (e) {
              console.error("更新緩存頭像失敗:", e);
            }
          }
          
          // 更新 AuthStore 中的用戶頭像
          updateUser({ avatar: newAvatarUrl });
          
          toast.success("頭像已更新");
        };
        
        img.onerror = () => {
          // 如果新頭像加載失敗，恢復原頭像
          toast.error("頭像圖片載入失敗");
          setValue("avatar", userProfile.avatar || "/images/user_icon/user.png");
        };
        
        // 開始加載圖片
        img.src = newAvatarUrl;
      } else {
        toast.success("頭像已更新");
      }
      
      // 清理舊的預覽 URL 物件
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error("上傳頭像失敗:", error)
      
      // 檢查錯誤訊息是否包含 Google Cloud 相關內容
      const errorMessage = error instanceof Error ? error.message : "";
      if (errorMessage.includes("Could not load the default credentials") || 
          errorMessage.includes("Google Cloud")) {
        toast.error("系統暫時無法處理頭像上傳", {
          description: "伺服器配置問題，請稍後再試或聯繫客服",
        });
      } else {
        toast.error("上傳頭像失敗，請稍後再試");
      }
      
      // 清理預覽 URL 並恢復原始頭像
      URL.revokeObjectURL(fileUrl);
      setValue("avatar", userProfile.avatar || "/images/user_icon/user.png");
    }
  }

  // 提交處理 - 更新後同時更新本地緩存
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true)
      
      // 轉換資料格式以符合後端 API 需求
      const formattedData: UpdateProfileData = {
        name: values.name,
        gender: values.gender === "女" ? "female" : "male",
        phone: values.phone,
        birthDate: values.birthdate ? format(values.birthdate, "yyyy-MM-dd") : "",
        address: `${values.address.city}${values.address.district}${values.address.detail}`,
        avatar: values.avatar || "",
      };
      
      // 使用新的 API 模組更新用戶資料
      const response = await updateUserProfile(formattedData);
      
      if (!response || !response.status) {
        toast.error("更新資料失敗", {
          description: response?.message || "無法更新用戶資料",
        });
        return;
      }
      
      const data = response.data;
      
      // 更新本地用戶資料緩存
      const cachedProfile = localStorage.getItem(USER_PROFILE_CACHE_KEY);
      if (cachedProfile) {
        try {
          const profileData = JSON.parse(cachedProfile);
          if (profileData && profileData.user) {
            // 更新緩存中的用戶資料
            profileData.user.name = data.name || values.name;
            profileData.user.gender = values.gender === "女" ? "female" : "male";
            profileData.user.birthDate = values.birthdate ? format(values.birthdate, "yyyy-MM-dd") : "";
            profileData.user.phone = data.phone || values.phone;
            profileData.user.address = `${values.address.city}${values.address.district}${values.address.detail}`;
            profileData.user.avatar = data.avatar || values.avatar;
            
            localStorage.setItem(USER_PROFILE_CACHE_KEY, JSON.stringify(profileData));
          }
        } catch (e) {
          console.error("更新緩存用戶資料失敗:", e);
        }
      }
      
      // 更新 AuthStore 中的用戶資料
      updateUser({
        name: data.name || values.name,
        avatar: data.avatar || values.avatar
      });
      
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

  // 處理登出 - 清除緩存
  const handleLogout = () => {
    // 清除用戶資料緩存
    localStorage.removeItem(USER_PROFILE_CACHE_KEY);
    
    logout();
    
    toast.success("已成功登出", {
      description: "期待您的再次訪問"
    });
    
    setShowLogoutConfirm(false);
    
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  // 打開登出確認對話框
  const openLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center py-16 font-noto-sans-tc">
        <div className="animate-pulse text-lg text-gray-500">載入中...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-12 font-noto-sans-tc content-fit w-full">
      {/* 全局樣式 */}
      <style jsx global>{globalStyles}</style>
      
      {/* 登出確認對話框 */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="max-w-[400px] w-[50%] p-6 bg-white rounded-3xl border-none">
          <DialogTitle className="sr-only">確定要登出嗎？</DialogTitle>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">確定要登出嗎？</h2>
            <p className="text-gray-500 text-center mb-6">你可以隨時再回來和我們一起翻閱下一章節 👋</p>
            
            <div className="flex gap-4 w-full">
              <ProfileButton 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1"
                variant="tertiary"
              >
                取消
              </ProfileButton>
              <ProfileButton 
                onClick={handleLogout}
                className="flex-1"
                variant="secondary"
              >
                登出
              </ProfileButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 左側：使用者資訊卡 */}
      <div className="w-full md:w-64 content-fit flex-shrink-0">
        <div className="flex flex-col items-center content-fit">
          <Avatar className="w-32 h-32 mb-3">
            <AvatarImage 
              src={userProfile.avatar || "/images/user_icon/user.png"} 
              className="transition-opacity duration-300"
              style={{
                opacity: 1,
                objectFit: "cover"
              }}
              onLoadingStatusChange={(status) => {
                // 處理圖片載入狀態
                if (status === "error") {
                  console.error("頭像圖片載入失敗");
                }
              }}
            />
            <AvatarFallback className="bg-blue-500 font-noto-sans-tc">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-medium font-noto-sans-tc">{userProfile.name}</h3>
          <p className="text-sm text-gray-500 mb-5 font-noto-sans-tc">{userProfile.email}</p>
          
          {/* 按鈕群組 */}
          <div className="space-y-3 w-full">
            <ProfileButton 
              className="w-full"
              variant="primary"
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
            </ProfileButton>
            
            <ProfileButton 
              className="w-full"
              variant="primary"
              onClick={() => router.push("/account/change-password")}
            >
              修改密碼
            </ProfileButton>
            
            <ProfileButton 
              className="w-full"
              variant="primary"
              leftIcon={<LogOut className="w-4 h-4" />}
              onClick={openLogoutConfirm}
            >
              登出
            </ProfileButton>
          </div>
        </div>
      </div>

      {/* 右側：表單區域 */}
      <div className="flex-1 content-fit w-full">
        <div className="flex justify-end mb-4">
          {!isEditing && (
            <ProfileButton
              type="button"
              variant="primary"
              leftIcon={<PencilIcon className="w-4 h-4" />}
              onClick={() => setIsEditing(true)}
            >
              編輯資料
            </ProfileButton>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 content-fit">
          {/* 姓名欄位 */}
          <div className="grid grid-cols-12 items-center gap-4">
            <Label htmlFor="name" className="col-span-2 font-noto-sans-tc text-base">姓名</Label>
            <div className="col-span-10">
              <input
                {...register("name")}
                id="name"
                className={`w-full px-4 py-3 rounded-full border border-[#E5E5E5] font-noto-sans-tc focus:border-[#D94A1D] focus:outline-none ${
                  !isEditing ? "bg-white text-gray-500" : ""
                }`}
                disabled={!isEditing}
                autoComplete="off"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 ml-2 font-noto-sans-tc">{errors.name.message}</p>
              )}
            </div>
          </div>
          
          {/* 性別欄位 */}
          <div className="grid grid-cols-12 items-center gap-4">
            <Label className="col-span-2 font-noto-sans-tc text-base">性別</Label>
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
                    className={
                      !isEditing 
                        ? "border-gray-300 text-gray-400" 
                        : gender === "男" 
                          ? "border-[#D94A1D] text-[#D94A1D]" 
                          : ""
                    } 
                    disabled={!isEditing}
                  />
                  <Label 
                    htmlFor="male" 
                    className={`font-noto-sans-tc ${!isEditing ? "text-gray-400" : ""}`}
                  >
                    男
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="女" 
                    id="female" 
                    className={
                      !isEditing 
                        ? "border-gray-300 text-gray-400" 
                        : gender === "女" 
                          ? "border-[#D94A1D] text-[#D94A1D]" 
                          : ""
                    }
                    disabled={!isEditing}
                  />
                  <Label 
                    htmlFor="female" 
                    className={`font-noto-sans-tc ${!isEditing ? "text-gray-400" : ""}`}
                  >
                    女
                  </Label>
                </div>
              </RadioGroup>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1 ml-2 font-noto-sans-tc">{errors.gender.message}</p>
              )}
            </div>
          </div>
          
          {/* 生日欄位 */}
          <div className="grid grid-cols-12 items-center gap-4">
            <Label className="col-span-2 font-noto-sans-tc text-base">生日</Label>
            <div className="col-span-10 ">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between rounded-full border-[#E5E5E5] px-4 py-3 h-auto text-left font-normal font-noto-sans-tc focus:border-[#D94A1D] focus:outline-none ${
                      !isEditing ? 'bg-white text-gray-500 pointer-events-none' : ''
                    }`}
                    disabled={!isEditing}
                  >
                    {birthdate ? format(birthdate, "yyyy/MM/dd") : "選擇生日"}
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-0" align="start">
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
              {errors.birthdate && (
                <p className="text-red-500 text-sm mt-1 ml-2 font-noto-sans-tc">{errors.birthdate.message}</p>
              )}
            </div>
          </div>
          
          {/* 電話欄位 */}
          <div className="grid grid-cols-12 items-center gap-4">
            <Label htmlFor="phone" className="col-span-2 font-noto-sans-tc text-base">電話</Label>
            <div className="col-span-10">
              <input
                {...register("phone")}
                id="phone"
                className={`w-full px-4 py-3 rounded-full border border-[#E5E5E5] font-noto-sans-tc focus:border-[#D94A1D] focus:outline-none ${
                  !isEditing ? "bg-white text-gray-500" : ""
                }`}
                disabled={!isEditing}
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 ml-2 font-noto-sans-tc">{errors.phone.message}</p>
              )}
            </div>
          </div>
          
          {/* 地址欄位 */}
          <div className="grid grid-cols-12 items-center gap-4">
            <Label className="col-span-2 font-noto-sans-tc text-base">地址</Label>
            <div className="col-span-10 flex flex-row gap-3 items-start">
              {/* 城市選擇 */}
              <div className="w-[22%]">
                <select
                  {...register("address.city")}
                  className={`w-full px-4 py-3 rounded-full border border-[#E5E5E5] appearance-none  bg-no-repeat bg-right-center  pr-8 font-noto-sans-tc focus:border-[#D94A1D] focus:outline-none ${
                    !isEditing ? "bg-white text-gray-500" : ""
                  }`}
                  disabled={!isEditing}
                >
                  <option value="">請選擇城市</option>
                  {cities.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
                {errors.address?.city && (
                  <p className="text-red-500 text-sm mt-1 ml-2 font-noto-sans-tc">{errors.address.city.message}</p>
                )}
              </div>
              
              {/* 區域選擇 */}
              <div className="w-[22%]">
                <select
                  {...register("address.district")}
                  className={`w-full px-4 py-3 rounded-full border border-[#E5E5E5] appearance-none  bg-no-repeat bg-right-center bg-[length:20px_20px] pr-8 font-noto-sans-tc focus:border-[#D94A1D] focus:outline-none ${
                    !isEditing ? "bg-white text-gray-500" : ""
                  }`}
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
                {errors.address?.district && (
                  <p className="text-red-500 text-sm mt-1 ml-2 font-noto-sans-tc">{errors.address.district.message}</p>
                )}
              </div>
              
              {/* 詳細地址 */}
              <div className="flex-1">
                <input
                  {...register("address.detail")}
                  className={`w-full px-4 py-3 rounded-full border border-[#E5E5E5] font-noto-sans-tc focus:border-[#D94A1D] focus:outline-none ${
                    !isEditing ? "bg-white text-gray-500" : ""
                  }`}
                  placeholder="詳細地址"
                  disabled={!isEditing}
                  autoComplete="off"
                />
                {errors.address?.detail && (
                  <p className="text-red-500 text-sm mt-1 ml-2 font-noto-sans-tc">{errors.address.detail.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Email欄位 */}
          <div className="grid grid-cols-12 items-center gap-4">
            <Label htmlFor="email" className="col-span-2 font-noto-sans-tc text-base">E-mail</Label>
            <div className="col-span-10">
              <input
                {...register("email")}
                id="email"
                className="w-full px-4 py-3 rounded-full border border-[#E5E5E5] bg-white text-gray-500 font-noto-sans-tc"
                disabled
                autoComplete="off"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 ml-2 font-noto-sans-tc">{errors.email.message}</p>
              )}
            </div>
          </div>
          
          {/* 按鈕區域 */}
          <div className="flex justify-end mt-8 space-x-4">
            {isEditing ? (
              <>
                <ProfileButton 
                  type="button" 
                  variant="primary"
                  leftIcon={<XIcon className="w-4 h-4" />}
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  取消
                </ProfileButton>
                <ProfileButton 
                  type="submit" 
                  variant="secondary"
                  leftIcon={isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <SaveIcon className="w-4 h-4" />
                  )}
                  disabled={isLoading}
                >
                  儲存變更
                </ProfileButton>
              </>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  )
} 