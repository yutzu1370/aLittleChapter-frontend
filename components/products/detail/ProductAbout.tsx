"use client";

import Image from "next/image";

interface ProductAboutProps {
  aboutContent: string;
}

export default function ProductAbout({ aboutContent }: ProductAboutProps) {
  

  return (
    <section className="bg-[#F3FAF8] py-8 sm:py-12 lg:py-16 rounded-t-[32px] sm:rounded-t-[48px] lg:rounded-t-[64px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 lg:mb-16">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 overflow-hidden flex-shrink-0">
            <Image 
              src="/images/icon/icon_book.png" 
              alt="內容簡介" 
              width={48} 
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-800 font-jf-openhuninn tracking-wider">內容簡介</h2>
        </div>

        <div className="bg-white rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 sm:p-8 lg:p-16 border-4 sm:border-8 lg:border-[12px] border-[#B1DED6]">
          {aboutContent ? (
            <div 
              className="text-gray-800 leading-relaxed text-sm sm:text-base lg:text-lg"
              dangerouslySetInnerHTML={{ __html: aboutContent }}
            />
          ) : (
            <div className="text-gray-500 text-center py-6 sm:py-8">
              <p className="text-sm sm:text-base">暫無內容簡介</p>
              <p className="text-xs sm:text-sm mt-2">Debug: aboutContent = "{aboutContent}"</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 