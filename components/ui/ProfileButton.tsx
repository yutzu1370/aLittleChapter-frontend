import React from "react"
import { cn } from "@/lib/utils"

interface ProfileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  leftIcon?: React.ReactNode
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
}

const ProfileButton = React.forwardRef<HTMLButtonElement, ProfileButtonProps>(
  ({ className, children, leftIcon, variant = "primary", size = "md", disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      primary: "bg-white border-2 border-[#D94A1D] text-[#D94A1D] hover:bg-[#D94A1D] hover:text-white shadow-[0_4px_8px_rgba(217,74,29,0.3)] hover:shadow-[0_6px_12px_rgba(217,74,29,0.4)]",
      secondary: "bg-[#D94A1D] border-2 border-[#D94A1D] text-white hover:bg-[#B8391A] hover:border-[#B8391A] shadow-[0_4px_8px_rgba(217,74,29,0.3)] hover:shadow-[0_6px_12px_rgba(217,74,29,0.4)]"
    }
    
    const sizes = {
      sm: "px-4 py-2 text-sm rounded-full",
      md: "px-6 py-3 text-base rounded-full",
      lg: "px-8 py-4 text-lg rounded-full"
    }
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          "font-noto-sans-tc",
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
      </button>
    )
  }
)

ProfileButton.displayName = "ProfileButton"

export default ProfileButton 