"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 輪播內容資料
interface SlideContent {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  features: Array<{
    icon: string;
    text: string;
  }>;
  buttonText: string;
}

const slideContents: SlideContent[] = [
  {
    id: 0,
    title: "親子共讀時光，從這開始",
    subtitle: "一本書，就是你們的故事起點",
    description: "陪孩子一起閱讀，是最簡單也最深刻的陪伴方式。不只是念故事，更是在一頁頁中認識世界、學會傾聽與表達情感。那些共讀的片刻，會成為孩子最安心的依靠，也是你們最珍貴的回憶。從探索世界到認識自己，這些書將成為你們成長路上的好朋友。",
    features: [
      { icon: "/images/icon/title-icon-1.svg", text: "提升語言表達力" },
      { icon: "/images/icon/title-icon-2.svg", text: "練習情緒理解與同理心" },
      { icon: "/images/icon/title-icon-3.svg", text: "創造溫馨親子時光" }
    ],
    buttonText: "探索選書"
  },
  {
    id: 1,
    title: "一起挑一本，今晚的親子時光從這開始",
    subtitle: "🌟 讓每個夜晚都充滿故事的溫度",
    description: "每天睡前的 10 分鐘，是屬於你和孩子的專屬時光。一本合適的繪本，讓你們的夜晚充滿故事的溫度。",
    features: [
      { icon: "/images/icon/title-icon-1.svg", text: "依照年齡選書，選出適齡繪本" },
      { icon: "/images/icon/title-icon-2.svg", text: "精選高評價書單，家長安心選購" },
      { icon: "/images/icon/title-icon-3.svg", text: "搭配主題分類，快速找到想要的故事" }
    ],
    buttonText: "挑選今晚的故事"
  },
  {
    id: 2,
    title: "讓閱讀從「剛剛好」開始",
    subtitle: "🧸 根據年齡選書，為每個成長階段找到最適合的繪本",
    description: "不同階段的孩子，有不同的理解與探索需求。從翻頁、語彙到情緒，我們幫你配對剛剛好的繪本。",
    features: [
      { icon: "/images/icon/title-icon-1.svg", text: "分齡推薦，不怕選錯書" },
      { icon: "/images/icon/title-icon-2.svg", text: "專業編輯精選，品質有保障" },
      { icon: "/images/icon/title-icon-3.svg", text: "成長階段導覽，選書更輕鬆" }
    ],
    buttonText: "找適齡好書"
  },
  {
    id: 3,
    title: "家有小寶，選書不是難題",
    subtitle: "✨ 省時又安心的選書體驗",
    description: "忙碌的生活裡，為孩子挑一本書有時好難。這裡幫你快速找到適合寶貝的優質繪本，省時又安心。",
    features: [
      { icon: "/images/icon/title-icon-1.svg", text: "系統化分類，快速找到適合的書" },
      { icon: "/images/icon/title-icon-2.svg", text: "圖文導覽一目了然" },
      { icon: "/images/icon/title-icon-3.svg", text: "收藏功能，記下每一本心動選擇" },
      { icon: "/images/icon/title-icon-1.svg", text: "每本書都標示適讀年齡" }
    ],
    buttonText: "輕鬆選好書"
  },
  {
    id: 4,
    title: "從繪本裡學情緒、認世界",
    subtitle: "📚 故事是孩子最自然的老師",
    description: "故事是孩子最自然的老師。一頁頁的圖像與文字，幫助孩子認識情緒、理解世界。",
    features: [
      { icon: "/images/icon/title-icon-1.svg", text: "專區推薦情緒發展繪本" },
      { icon: "/images/icon/title-icon-2.svg", text: "每頁細節引導孩子發問與思考" },
      { icon: "/images/icon/title-icon-3.svg", text: "親子共讀增進溝通品質" }
    ],
    buttonText: "探索情緒繪本"
  }
];

export default function ProductBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? 4 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev === 4 ? 0 : prev + 1));
  };

  const currentContent = slideContents[currentSlide];

  return (
    <div className="pt-2 sm:pt-12 md:pt-20">
      <section className="w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8" ref={carouselRef}>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-stretch">
            {/* 左側圖片 */}
            <div className="w-full md:w-1/2 rounded-3xl overflow-hidden p-2 flex items-center justify-center h-full order-2 md:order-1">
              <Image 
                src="/images/other/banner.png" 
                alt="親子共讀插畫" 
                width={500} 
                height={500}
                className="w-full h-auto object-contain"
              />
            </div>
            
            {/* 右側內容 */}
            <div className="w-full md:w-1/2 bg-white rounded-3xl pt-4 sm:pt-7 px-4 sm:px-7 pb-3 mt-2 flex flex-col justify-between border-[#F8D0B0] border-4 sm:border-[6px] h-full order-1 md:order-2">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col gap-3 sm:gap-6">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-jf-openhuninn text-emerald-800">{currentContent.title}</h1>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-jf-openhuninn text-gray-900">{currentContent.subtitle}</h2>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-900 leading-relaxed">
                    {currentContent.description}
                  </p>
                </div>
                
                <div className="flex flex-col gap-1 sm:gap-2">
                  {currentContent.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Image src={feature.icon} alt={feature.text} width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="text-sm sm:text-base lg:text-lg text-gray-900">{feature.text}</span>
                    </div>
                  ))}
                </div>
                
                {/* <button className="flex items-center justify-center gap-2 bg-orange-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-[3px_4px_0px_0px_rgba(116,40,26,1)] sm:shadow-[4px_6px_0px_0px_rgba(116,40,26,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(116,40,26,1)] sm:hover:shadow-[4px_4px_0px_0px_rgba(116,40,26,1)] transition-all w-fit mx-auto sm:mx-0">
                  <span className="font-semibold text-sm sm:text-base">{currentContent.buttonText}</span>
                  <Image src="/images/icon/arrow-circle-right.svg" alt="探索" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
                </button> */}
              </div>
              
              {/* 輪播控制區 */}
              <div className="flex justify-between items-center w-full mt-6 sm:mt-9">
                <button 
                  onClick={handlePrevSlide}
                  aria-label="上一頁"
                  className="bg-white border-2 border-[#E8652B] rounded-full shadow-[3px_4px_0px_#74281A] sm:shadow-[4px_6px_0px_#74281A] w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center hover:bg-[#FEF5EE] transition"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#E8652B]" />
                </button>
                
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1 sm:gap-2 w-40 sm:w-60 lg:w-80">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <div 
                        key={index}
                        className={`h-1 rounded-full ${index === currentSlide ? 'bg-[#f3ae7e]' : 'bg-gray-200'} flex-1 cursor-pointer`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={handleNextSlide}
                  aria-label="下一頁"
                  className="bg-white border-2 border-[#E8652B] rounded-full shadow-[3px_4px_0px_#74281A] sm:shadow-[4px_6px_0px_#74281A] w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center hover:bg-[#FEF5EE] transition"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#E8652B]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 