'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import apiClient from '@/lib/apiClient';
import { GoogleCredentialResponse, GoogleAuthResponse } from './types';

interface AuthWithGoogleButtonProps {
  onAuthSuccess?: (user: any) => void;
  buttonText?: string;
  isSignup?: boolean;
}

export default function AuthWithGoogleButton({ 
  onAuthSuccess, 
  buttonText = "使用 Google 帳號登入",
  isSignup = false 
}: AuthWithGoogleButtonProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // 確保只初始化一次
    if (isInitialized.current) return;

    const loadGoogleScript = () => {
      // 檢查是否已經載入
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        initializeGoogle();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      script.onerror = () => {
       
      };
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      if (window.google?.accounts?.id && !isInitialized.current) {
        try {
         
          
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // 渲染按鈕
          if (googleButtonRef.current) {
            window.google.accounts.id.renderButton(
              googleButtonRef.current,
              {
                theme: 'outline',
                size: 'large',
                width: 384,  // 增加寬度以匹配上方按鈕
                shape: 'pill',
                text: isSignup ? 'signup_with' : 'signin_with',
                logo_alignment: 'left'
              }
            );
          }

          isInitialized.current = true;
        
        } catch (error) {
         
        }
      }
    };

    loadGoogleScript();

    // 清理函數
    return () => {
      // 不需要特別清理，因為 Google 腳本是全域的
    };
  }, [isSignup]);

  const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
    const idToken = response.credential;
    try {
     
      
      // 呼叫後端 Google 登入/註冊 API
      const result: GoogleAuthResponse = await apiClient.post('/api/users/google-sign-in', { idToken });

     

      if (result.status && result.data?.token) {
       
        
        // 儲存 token 到 localStorage
        localStorage.setItem('token', result.data.token);
        
        // 更新 auth store
        const authStorage = {
          state: {
            token: result.data.token,
            user: result.data.user,
            isAuthenticated: true
          },
          version: 0
        };
        localStorage.setItem('auth-storage', JSON.stringify(authStorage));
        
        // 呼叫成功回調
        if (onAuthSuccess) {
          onAuthSuccess(result.data.user);
        }
        
        // 重新載入頁面以更新狀態
        window.location.reload();
      } else {
          
        alert(result.message || 'Google 登入失敗，請稍後再試');
      }
    } catch (error) {
      
      alert('Google 登入失敗，請稍後再試');
    }
  };

  return (
    <div className="w-full flex justify-center">
      {/* Google 按鈕容器 */}
      <div 
        ref={googleButtonRef}
        className="flex justify-center"
        style={{ minHeight: '50px', minWidth: '384px' }}
      />
    </div>
  );
}
