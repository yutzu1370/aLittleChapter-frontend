"use client";

import Image from "next/image";

interface ProductAboutProps {
  aboutContent: string;
}

export default function ProductAbout({ aboutContent }: ProductAboutProps) {
  

  return (
    <section className="bg-[#F3FAF8] py-16 rounded-t-[64px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="w-12 h-12 overflow-hidden">
            <Image 
              src="/images/icon/icon_book.png" 
              alt="內容簡介" 
              width={48} 
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 font-jf-openhuninn tracking-wider">內容簡介</h2>
        </div>

        <div className="bg-white rounded-[48px] p-8 md:p-16 border-[12px] border-[#B1DED6]">
          {aboutContent ? (
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: aboutContent }}
            />
          ) : (
            <div className="text-gray-500 text-center py-8">
              <p>暫無內容簡介</p>
              <p className="text-sm mt-2">Debug: aboutContent = "{aboutContent}"</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 