"use client"

import { useState } from "react"
import { X, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  productTitle: string
  productId: number
  onSubmit: (rating: number, comment: string) => void
}

export function ReviewModal({ 
  isOpen, 
  onClose, 
  productTitle, 
  productId, 
  onSubmit 
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("請選擇評分")
      return
    }

    if (comment.trim().length === 0) {
      alert("請輸入評價內容")
      return
    }

    if (comment.trim().length > 300) {
      alert("評價內容不能超過300字")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(rating, comment.trim())
      // 重置表單
      setRating(0)
      setHoveredRating(0)
      setComment("")
      onClose()
    } catch (error) {
      console.error("提交評價失敗:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0)
      setHoveredRating(0)
      setComment("")
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景遮罩 */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* Modal 內容 */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
          >
            {/* 標題欄 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 font-noto-sans-tc">
                撰寫評價
              </h2>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 內容 */}
            <div className="p-6 space-y-6">
              {/* 商品名稱 */}
              <div className="text-center">
                <p className="text-sm text-gray-600 font-noto-sans-tc mb-1">評價商品</p>
                <p className="font-semibold text-gray-800 font-noto-sans-tc line-clamp-2">
                  {productTitle}
                </p>
              </div>

              {/* 評分 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 font-noto-sans-tc">
                  請評分
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      className="p-1"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors duration-200 ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-gray-600 font-noto-sans-tc">
                    您給了 {rating} 顆星
                  </p>
                )}
              </div>

              {/* 評價內容 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 font-noto-sans-tc">
                  請輸入評價內容（最多300字）
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="分享您對這本書的想法..."
                  disabled={isSubmitting}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-noto-sans-tc text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                  maxLength={300}
                />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="font-noto-sans-tc">
                    {comment.length}/300 字
                  </span>
                  {comment.length > 280 && (
                    <span className="text-orange-500 font-noto-sans-tc">
                      還可輸入 {300 - comment.length} 字
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 按鈕區 */}
            <div className="p-6 border-t border-gray-200">
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0 || comment.trim().length === 0}
                className="w-full h-12 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed font-noto-sans-tc"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? "送出中..." : "送出"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 