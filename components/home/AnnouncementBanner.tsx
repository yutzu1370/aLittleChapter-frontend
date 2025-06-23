export default function AnnouncementBanner() {
  return (
    <div className="w-full bg-[#2F726D] py-1.5 sm:py-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="overflow-hidden">
          <div className="whitespace-nowrap animate-marquee">
            <span className="text-white inline-block text-xs sm:text-sm lg:text-base">【出貨延遲】遇公司全體員工出國旅遊7/10~7/15，故出貨將順延，敬請見諒。</span>
          </div>
        </div>
      </div>
    </div>
  )
}
