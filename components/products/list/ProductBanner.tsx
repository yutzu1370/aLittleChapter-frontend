"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ProductBannerProps {
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

export default function ProductBanner({
  currentSlide,
  setCurrentSlide,
  onPrevSlide,
  onNextSlide
}: ProductBannerProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  return (
    <section className="w-full pt-24 md:pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center" ref={carouselRef}>
        <div className="w-full lg:w-[1488px] h-[732px] relative rounded-3xl flex overflow-hidden">
          {/* 背景圖片 */}
          <div className="w-full h-full border-[8px] border-[#F8D0B0] rounded-[48px] bg-cover bg-center"
               style={{ backgroundImage: "url('/images/home/banner-reading.jpg')" }}>
          </div>
          
          {/* 文字內容區塊 */}
          <div className="absolute top-0 right-0 bottom-0 bg-white border-[8px] border-[#F8D0B0] rounded-[48px] w-full md:w-1/2 p-12 flex flex-col justify-between">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-6">
                <h1 className="text-3xl sm:text-4xl font-jf-openhuninn text-emerald-800">親子共讀時光，從這裡開始</h1>
                <h2 className="text-xl sm:text-2xl font-jf-openhuninn text-gray-900">一本書，就是你們的故事起點</h2>
                <p className="text-base sm:text-lg text-gray-900">
                  陪孩子一起閱讀，是最簡單也最深刻的陪伴方式。<br/>
                  不只是念故事，更是在一頁頁中認識世界、學會傾聽與表達情感。<br/>
                  那些共讀的片刻，會成為孩子最安心的依靠，也是你們最珍貴的回憶。<br/>
                  從探索世界到認識自己，這些書將成為你們成長路上的好朋友。
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Image src="/images/icon/title-icon-1.svg" alt="語言表達" width={24} height={24} />
                  <span className="text-base sm:text-lg text-gray-900">提升語言表達力</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/images/icon/title-icon-2.svg" alt="情緒理解" width={24} height={24} />
                  <span className="text-base sm:text-lg text-gray-900">練習情緒理解與同理心</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/images/icon/title-icon-3.svg" alt="親子時光" width={24} height={24} />
                  <span className="text-base sm:text-lg text-gray-900">創造溫馨親子時光</span>
                </div>
              </div>
              
              <button className="flex items-center justify-center gap-2 bg-orange-600 text-white py-3 px-6 rounded-full shadow-[4px_6px_0px_0px_rgba(116,40,26,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(116,40,26,1)] transition-all w-fit">
                <span className="font-semibold">探索選書</span>
                <Image src="/images/icon/arrow-circle-right.svg" alt="探索" width={24} height={24} />
              </button>
            </div>
            
            {/* 輪播控制區 */}
            <div className="flex justify-between items-center w-full">
              <button 
                onClick={onPrevSlide}
                className="w-10 h-10 rounded-full border-2 border-orange-600 flex items-center justify-center hover:bg-orange-50 transition-colors"
              >
                <Image src="/images/icon/arrow-back.svg" alt="上一頁" width={24} height={24} />
              </button>
              
              <div className="flex space-x-2">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-orange-600/50' : 'bg-gray-300'}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
              
              <button 
                onClick={onNextSlide}
                className="w-10 h-10 rounded-full border-2 border-orange-600 flex items-center justify-center hover:bg-orange-50 transition-colors"
              >
                <Image src="/images/icon/arrow-forward.svg" alt="下一頁" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 