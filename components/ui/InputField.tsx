"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, containerClassName, labelClassName, errorClassName, className, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label className={cn("text-sm font-medium", labelClassName)}>
            {label}
          </label>
        )}
        <Input 
          ref={ref}
          className={cn(
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className={cn("text-xs text-red-500", errorClassName)}>
            {error}
          </p>
        )}
      </div>
    )
  }
)
InputField.displayName = "InputField"

export { InputField } 