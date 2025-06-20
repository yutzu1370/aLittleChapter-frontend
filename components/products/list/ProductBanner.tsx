"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? 4 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev === 4 ? 0 : prev + 1));
  };

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
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-jf-openhuninn text-emerald-800">親子共讀時光，從這裡開始</h1>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-jf-openhuninn text-gray-900">一本書，就是你們的故事起點</h2>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-900 leading-relaxed">
                    陪孩子一起閱讀，是最簡單也最深刻的陪伴方式。<br className="hidden sm:block"/>
                    不只是念故事，更是在一頁頁中認識世界、學會傾聽與表達情感。<br className="hidden sm:block"/>
                    那些共讀的片刻，會成為孩子最安心的依靠，也是你們最珍貴的回憶。<br className="hidden sm:block"/>
                    從探索世界到認識自己，這些書將成為你們成長路上的好朋友。
                  </p>
                </div>
                
                <div className="flex flex-col gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <Image src="/images/icon/title-icon-1.svg" alt="語言表達" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base lg:text-lg text-gray-900">提升語言表達力</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/images/icon/title-icon-2.svg" alt="情緒理解" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base lg:text-lg text-gray-900">練習情緒理解與同理心</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/images/icon/title-icon-3.svg" alt="語言表達" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-base lg:text-lg text-gray-900">創造溫馨親子時光</span>
                  </div>
                </div>
                
                <button className="flex items-center justify-center gap-2 bg-orange-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-[3px_4px_0px_0px_rgba(116,40,26,1)] sm:shadow-[4px_6px_0px_0px_rgba(116,40,26,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(116,40,26,1)] sm:hover:shadow-[4px_4px_0px_0px_rgba(116,40,26,1)] transition-all w-fit mx-auto sm:mx-0">
                  <span className="font-semibold text-sm sm:text-base">探索選書</span>
                  <Image src="/images/icon/arrow-circle-right.svg" alt="探索" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
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