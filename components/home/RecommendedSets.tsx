import Image from "next/image"
import Link from "next/link"

export default function RecommendedSets() {
  const collections = [
    {
      id: 1,
      title: "魔法學院入學指南(共3冊)",
      description:
        "這是一本以魔法學校為背景的奇幻小說，描述了一群少年如何在學院中學習魔法，並面對各種挑戰。他們必須通過各種考驗，才能成為真正的魔法師。這本書充滿刺激的情節與創意的魔法設定，適合喜歡哈利波特風格的讀者。",
      image: "/images/home/sec03_book.png",
      animalImage: "/images/home/sec03_Bear.png",
      animalPosition: "right",
    },
    {
      id: 2,
      title: "追夢少年(共2冊)",
      description:
        "故事講述了一個普通的男孩如何通過不斷努力，最終實現了成為畫家的夢想。他經歷了許多挫折，但從未放棄，最終贏得了屬於自己的成功。這本書能夠激勵孩子勇敢追夢，並讓他們理解努力與堅持的重要性，是一本非常正能量的書籍。",
      image: "/images/home/sec03_book2.png",
      animalImage: "/images/home/sec03_Rabbit.png",
      animalPosition: "left",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center mb-16">
          <div className="w-12 h-12 mr-4 relative">
            <Image
              src="/images/icon/icon_gift.png"
              alt="Icon"
              width={48}
              height={48}
            />
          </div>
          <h2 className="text-4xl font-normal text-[#2F726D] tracking-widest font-['jf-openhuninn-2.0']">套裝推薦</h2>
        </div>

        <div className="space-y-6">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className="bg-white rounded-[48px] border-[6px] border-[#F8D0B0] p-3 relative mb-6"
            >
              <div className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                {/* Book Image */}
                <div className="w-[606px] h-[404px] relative flex-shrink-0">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Text Content */}
                <div className="w-[606px] flex flex-col justify-center px-6">
                  <h3 className="text-3xl font-['jf-openhuninn-2.0'] text-[#2F726D] mb-4">{collection.title}</h3>
                  <p className="text-xl text-gray-900 mb-6">{collection.description}</p>
                  <div className="flex space-x-3">
                    <Link
                      href={`/collections/${collection.id}`}
                      className="px-6 py-3 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[4px_6px_0px_#74281A]"
                    >
                      立即購買
                    </Link>
                    <Link
                      href={`/collections/${collection.id}/details`}
                      className="px-6 py-3 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[4px_6px_0px_#74281A]"
                    >
                      了解更多
                    </Link>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              {/* Animal Character */}
              <div
                className={`absolute w-[200px] h-[200px] ${
                  collection.animalPosition === "right"
                    ? "right-[-100px] bottom-[-20px]"
                    : "left-[-100px] bottom-[-12px]"
                }`}
              >
                <Image
                  src={collection.animalImage || "/placeholder.svg"}
                  alt="Character"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Decorative Bow */}
             

              {/* Decorative Ribbon */}
              <div
                className={`absolute w-[240px] h-[240px] ${
                  index % 2 === 0 ? "left-[0px] top-[0px]" : "right-[0px] top-[0px]"
                }`}
              >
                <Image
                  src= {index % 2 === 0 ? "/images/left_top_ribbon.png" : "/images/right_top_rabbit.png"}
                  alt="Decorative ribbon"
                  fill
                  className="object-contain"
                />
              </div>
              

              

          
              
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
