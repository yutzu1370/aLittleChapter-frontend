"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus } from "lucide-react"

export default function FAQ() {
  const faqs = [
    {
      id: 1,
      question: "如何選擇適合孩子的書籍？",
      answer: "我們會在商品頁標示建議年齡與閱讀引導，歡迎依孩子的興趣和閱讀習慣選擇。",
    },
    {
      id: 2,
      question: "訂單處理需要多長時間？",
      answer: "一般情況下，我們會在1-2個工作日內處理您的訂單。如果是工作日下午3點前下單，通常可以當天發貨。",
    },
    {
      id: 3,
      question: "可以退換貨嗎？",
      answer:
        "是的，我們提供15天內的退換貨服務。如果收到的商品有質量問題或與描述不符，請保持商品的完好狀態並聯繫我們的客服團隊。",
    },
    {
      id: 4,
      question: "如何追蹤我的訂單？",
      answer:
        "登錄您的帳戶後，可以在「我的訂單」頁面查看訂單狀態和物流信息。我們也會通過電子郵件發送訂單更新和物流追蹤號碼。",
    },
    {
      id: 5,
      question: "會員有什麼優惠？",
      answer:
        "會員可以享受積分獎勵、生日禮遇、新書優先購買權以及定期的專屬折扣活動。註冊成為會員完全免費，並且可以獲得首次購物優惠。",
    },
    {
      id: 6,
      question: "如何成為會員？",
      answer: "您可以在網站右上角點擊「會員登入」，然後選擇「註冊新帳號」，填寫相關資料後即可成為會員。",
    },
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex justify-center items-center mb-12 sm:mb-14 lg:mb-16">
          <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 mr-3 sm:mr-4">
            <Image
              src="/images/home/title_icon_faq.png"
              alt="Icon"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2F726D] tracking-widest">常見問題</h2>
        </div>

        {/* FAQ Container */}
        <div className="bg-[#F3FAF8] rounded-[24px] sm:rounded-[36px] lg:rounded-[48px] p-6 sm:p-10 lg:p-16">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-gray-200 last:border-b-0 py-2 sm:py-2">
                <button 
                  className="w-full flex justify-between items-start py-2 sm:py-2 text-left focus:outline-none focus:ring-2 focus:ring-[#2F726D] focus:ring-opacity-50 rounded-lg"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span
                    className={`text-lg sm:text-xl lg:text-2xl font-['jf-openhuninn-2.0'] pr-4 ${
                      openFaq === faq.id ? "text-[#295C58]" : "text-gray-900"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0 mt-1">
                    {openFaq === faq.id ? (
                      <Minus className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${openFaq === faq.id ? "text-[#295C58]" : "text-gray-900"}`} />
                    ) : (
                      <Plus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-900" />
                    )}
                  </div>
                </button>

                {openFaq === faq.id && (
                  <div className="py-2 sm:py-3 lg:py-2 text-base sm:text-lg lg:text-lg text-gray-900 leading-relaxed pr-8 sm:pr-10 lg:pr-12">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
