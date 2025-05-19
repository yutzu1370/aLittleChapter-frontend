"use client"

import { ArrowUp } from "lucide-react"

export default function FloatingButtons() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div className="fixed bottom-[115px] right-6 z-50">
      <button
        onClick={scrollToTop}
        className="w-20 h-20 bg-white border-4 border-[#82C6BD] rounded-full shadow-[0px_5px_15px_rgba(0,0,0,0.35)] flex items-center justify-center"
      >
        <ArrowUp className="w-12 h-12 text-[#3e8e87]" />
      </button>
    </div>
  )
}
