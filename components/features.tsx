import Image from "next/image"
import Link from "next/link"

export default function Features() {
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex justify-center items-center mb-16">
          <div className="w-12 h-12 mr-4">
            <Image
              src="/images/home/section5-logo.png"
              alt="Icon"
              width={48}
              height={48}
            />
          </div>
          <h2 className="text-4xl font-normal text-[#2F726D] tracking-widest font-['jf-openhuninn-2.0']">小篇章特色</h2>
        </div>

        {/* Features Container */}
        <div className="bg-[#FEF5EE] rounded-[48px] py-16 px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link key={feature.id} href={feature.href} className="flex flex-col items-center">
                <div className="relative w-60 h-60 mb-2">
                  <div className="w-full h-full bg-white border-8 border-[#F8D0B0] rounded-full flex items-center justify-center">
                    <Image
                      src={feature.icon || "/placeholder.svg"}
                      alt={feature.title}
                      width={200}
                      height={200}
                      className="w-[80%] h-[80%] object-cover "
                    />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-3xl font-['jf-openhuninn-2.0'] mb-1">{feature.title}</h3>
                  <p className="text-xl text-gray-700">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
