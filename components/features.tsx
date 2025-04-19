import Image from "next/image"
import Link from "next/link"

export default function Features() {
  const features = [
    {
      id: 1,
      title: "線上訂購",
      description: "便捷的線上購書體驗",
      icon: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=200&h=200&auto=format&fit=crop",
      href: "/ordering",
    },
    {
      id: 2,
      title: "安全交易",
      description: "安全可靠的支付系統",
      icon: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=200&h=200&auto=format&fit=crop",
      href: "/security",
    },
    {
      id: 3,
      title: "可靠配送",
      description: "快速準時的配送服務",
      icon: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=200&h=200&auto=format&fit=crop",
      href: "/delivery",
    },
    {
      id: 4,
      title: "售後服務",
      description: "專業的客戶服務團隊",
      icon: "https://images.unsplash.com/photo-1560438718-eb61ede255eb?q=80&w=200&h=200&auto=format&fit=crop",
      href: "/support",
    },
  ]

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex justify-center items-center mb-16">
          <div className="w-12 h-12 mr-4">
            <Image
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=48&h=48&auto=format&fit=crop"
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
                      className="w-[80%] h-[80%] object-cover rounded-full"
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
