"use client"

import React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface PrimaryButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: string
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ isLoading = false, loadingText, children, className, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "bg-yellow-500 hover:bg-yellow-600 text-white shadow-[3px_4px_0px_#74281A] transition-all",
          "active:shadow-[1px_1px_0px_#74281A] active:translate-x-[2px] active:translate-y-[3px]",
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Button>
    )
  }
)
PrimaryButton.displayName = "PrimaryButton"

export { PrimaryButton } 