import Image from "next/image"
import Link from "next/link"

export default function WebsiteFeatures() {
  const features = [
    {
      id: 1,
      title: "線上訂購",
      description: "便捷的線上購書體驗",
      icon: "/images/home/feature_01.png",
      href: "/ordering",
    },
    {
      id: 2,
      title: "安全交易",
      description: "安全可靠的支付系統",
      icon: "/images/home/feature_02.png",
      href: "/security",
    },
    {
      id: 3,
      title: "可靠配送",
      description: "快速準時的配送服務",
      icon: "/images/home/feature_03.png",
      href: "/delivery",
    },
    {
      id: 4,
      title: "售後服務",
      description: "專業的客戶服務團隊",
      icon: "/images/home/feature_04.png",
      href: "/support",
    },
  ]

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex justify-center items-center mb-8 sm:mb-12 lg:mb-16">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mr-3 sm:mr-4">
            <Image
              src="/images/home/section5-logo.png"
              alt="Icon"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2F726D] tracking-widest">小篇章特色</h2>
        </div>

        {/* Features Container */}
        <div className="bg-[#FEF5EE] rounded-3xl sm:rounded-[48px] py-8 px-4 sm:py-12 sm:px-8 lg:py-16 lg:px-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature) => (
              <Link key={feature.id} href={feature.href} className="flex flex-col items-center group">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-60 lg:h-60 mb-3 sm:mb-4 lg:mb-2">
                  <div className="w-full h-full bg-white border-4 sm:border-6 lg:border-8 border-[#F8D0B0] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                    <Image
                      src={feature.icon || "/placeholder.svg"}
                      alt={feature.title}
                      width={200}
                      height={200}
                      className="w-[75%] h-[75%] sm:w-[80%] sm:h-[80%] object-cover"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-['jf-openhuninn-2.0'] mb-1 group-hover:text-[#E8652B] transition-colors duration-300">{feature.title}</h3>
                  <p className="text-sm sm:text-lg lg:text-xl text-gray-700">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
