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
      <DialogContent className="sm:max-w-md bg-white rounded-xl">
        <DialogHeader>
          <DialogTitle className="font-noto-sans-tc ">申請退貨</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 font-noto-sans-tc">
              訂單編號：{orderNumber}
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="returnReason" className="text-sm font-medium text-gray-700 font-noto-sans-tc">
              退貨原因 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="returnReason"
              placeholder="請詳細說明您的退貨原因..."
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[100px] font-noto-sans-tc"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right font-noto-sans-tc">
              {returnReason.length}/500
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 ">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="font-noto-sans-tc rounded-xl border-2 border-gray-300 hover:bg-gray-300"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!returnReason.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 font-noto-sans-tc rounded-xl"
          >
            {isSubmitting ? "提交中..." : "送出申請"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 