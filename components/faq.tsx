"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus } from "lucide-react"

export default function Faq() {
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

  const [openFaq, setOpenFaq] = useState<number | null>(4)

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  return (
    <section className="py-16 bg-white" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex justify-center items-center mb-16">
          <div className="w-12 h-12 mr-4">
            <Image
              src="/images/home/title_icon_faq.png"
              alt="Icon"
              width={48}
              height={48}
            />
          </div>
          <h2 className="text-4xl font-normal text-[#2F726D] tracking-widest font-['jf-openhuninn-2.0']">常見問題</h2>
        </div>

        {/* FAQ Container */}
        <div className="bg-[#F3FAF8] rounded-[48px] p-16">
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-gray-200 last:border-b-0 py-2">
                <button className="w-full flex justify-between items-center py-2" onClick={() => toggleFaq(faq.id)}>
                  <span
                    className={`text-2xl font-['jf-openhuninn-2.0'] text-left ${openFaq === faq.id ? "text-[#295C58]" : "text-gray-900"}`}
                  >
                    {faq.question}
                  </span>
                  {openFaq === faq.id ? (
                    <Minus className={`w-8 h-8 ${openFaq === faq.id ? "text-[#295C58]" : "text-gray-900"}`} />
                  ) : (
                    <Plus className="w-8 h-8 text-gray-900" />
                  )}
                </button>

                {openFaq === faq.id && <div className="py-2 text-lg text-gray-900">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
