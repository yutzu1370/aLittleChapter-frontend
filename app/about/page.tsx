"use client"

import Image from "next/image"
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  const characters = [
    {
      id: 1,
      name: "兔兔姐姐",
      nickname: "溫柔",
      image: "/images/about/Rabbit-1.png",
      noteImage: "/images/about/note.png",
    },
    {
      id: 2,
      name: "小熊哥哥",
      nickname: "可靠",
      image: "/images/about/Animal=Bear02.png",
      noteImage: "/images/about/note-1.png",
    },
    {
      id: 3,
      name: "狐狸哥哥",
      nickname: "聰明",
      image: "/images/about/Animal=Fox03.png",
      noteImage: "/images/about/note-fox.png",
    },
    {
      id: 4,
      name: "小老鼠妹妹",
      nickname: "細心",
      image: "/images/about/Animal=Mouse02.png",
      noteImage: "/images/about/note-2.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header placeholder */}
      <Header />
      <main className="container mx-auto px-4 pt-32 pb-12 ">
        {/* Hero Section */}
        <div className="text-center mb-16 ">
    
          <div className="text-2xl md:text-3xl text-orange-600 font-medium mb-8 leading-relaxed ">
            讓每一本繪本，陪伴每個家庭的成長旅程。
          </div>
          <div className="max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed ">
            親子繪本交易平台是一個屬於家長與孩子的溫暖社群。我們相信，每一本繪本都是一段成長的陪伴，也是珍貴的回憶與交流。透過交換、分享，讓故事在每個家庭之間流動，讓愛與閱讀不斷延續。
          </div>
        </div>

        {/* Characters Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-orange-800 mb-12">認識我們的夥伴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {characters.map((character) => (
              <div key={character.id} className="flip-card h-80">
                <div className="flip-card-inner">
                  {/* Front of card */}
                  <div className="flip-card-front">
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col items-center justify-center border-4 border-orange-200">
                      <div className="relative w-32 h-32 mb-4">
                        <Image
                          src={character.image || "/placeholder.svg"}
                          alt={character.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-orange-800 mb-2">{character.name}</h3>
                      <div className="bg-orange-100 px-4 py-2 rounded-full">
                        <span className="text-orange-700 font-medium">{character.nickname}</span>
                      </div>
                    </div>
                  </div>

                  {/* Back of card - Using note images directly */}
                  <div className="flip-card-back">
                    <div className="h-full w-full relative">
                      <Image
                        src={character.noteImage || "/placeholder.svg"}
                        alt={`${character.name}的介紹`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <style jsx>{`
        .flip-card {
          background-color: transparent;
          perspective: 1000px;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}
