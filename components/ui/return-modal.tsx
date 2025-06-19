"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ReturnModalProps {
  isOpen: boolean
  onClose: () => void
  orderNumber: string
  onSubmit: (returnReason: string) => Promise<void>
}

export function ReturnModal({ isOpen, onClose, orderNumber, onSubmit }: ReturnModalProps) {
  const [returnReason, setReturnReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!returnReason.trim()) {
      toast.warning("請填寫退貨原因")
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(returnReason.trim())
      setReturnReason("")
      onClose()
    } catch (error) {
      // 錯誤處理由父組件負責，這裡可以添加額外的錯誤提示
      console.error('退貨申請提交失敗:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setReturnReason("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-w-[90%] mx-auto bg-white rounded-[24px] border-2 border-[#f8d0b0] shadow-lg animate-scale-up">
        <DialogHeader>
          <DialogTitle className="font-noto-sans-tc text-[#2F726D] text-xl font-semibold text-center">
            申請退貨
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 px-2">
          <div className="bg-white/80 rounded-[16px] p-4 border border-[#f8d0b0]/50">
            <Label className="text-sm font-medium text-[#2F726D] font-noto-sans-tc">
              訂單編號：<span className="text-[#E8652B] font-semibold">{orderNumber}</span>
            </Label>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="returnReason" className="text-sm font-medium text-[#2F726D] font-noto-sans-tc">
              退貨原因 <span className="text-[#E8652B]">*</span>
            </Label>
            <Textarea
              id="returnReason"
              placeholder="請詳細說明您的退貨原因..."
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[120px] font-noto-sans-tc bg-white/90 border-2 border-[#f8d0b0]/60 rounded-[16px] focus:border-[#E8652B] focus:ring-[#E8652B]/20 placeholder:text-gray-400 resize-none"
              maxLength={500}
            />
            <div className="text-xs text-[#2F726D]/70 text-right font-noto-sans-tc">
              {returnReason.length}/100
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8 px-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="font-noto-sans-tc rounded-[20px] border-2 border-[#2F726D]/30 text-[#2F726D] hover:bg-[#2F726D]/10 hover:border-[#2F726D] transition-all duration-300 px-8 py-2 min-w-[100px]"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!returnReason.trim() || isSubmitting}
            className="bg-[#E8652B] hover:bg-[#D5531F] text-white font-noto-sans-tc rounded-[20px] px-8 py-2 min-w-[100px] shadow-[0_4px_0_rgba(116,40,26,1)] hover:shadow-[0_2px_0_rgba(116,40,26,1)] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_0_rgba(116,40,26,1)]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                提交中...
              </span>
            ) : (
              "送出申請"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 