"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// 預加載圖片
const heroBackground = "/images/hero_0.png"
const heroLandscape = "/images/hero_1.png"
const leftClouds = "/images/left-clouds.png"
const rightClouds = "/images/right-clouds.png"
const titleImage = "/images/title.png"
const subtitleImage = "/images/subtitle.png"
const animalsImage = "/images/animals.png"

export default function Hero() {
  return (
    <div className="relative h-[calc(100vh-3rem)] min-h-[550px] overflow-hidden pt-16">
      {/* 背景圖片：固定不動 */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={heroBackground}
          alt="背景"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* 森林與山丘：slide-up+fade-in，由底部往上滑入,淡入 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full animate-slide-up"
      >
        <Image
          src={heroLandscape}
          alt="森林與山丘"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* 左雲朵：slide-left+fade-in，由左邊滑入,淡入 */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="absolute top-[15%] left-[5%] w-1/4 h-1/4 animate-slide-left delay-300"
      >
        <Image
          src={leftClouds}
          alt="左雲朵"
          fill
          sizes="25vw"
          className="object-contain"
        />
      </motion.div>

      {/* 右雲朵：slide-right+fade-in，由右邊滑入,淡入 */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="absolute top-[10%] right-[5%] w-1/3 h-1/3 animate-slide-right delay-300"
      >
        <Image
          src={rightClouds}
          alt="右雲朵"
          fill
          sizes="33vw"
          className="object-contain"
        />
      </motion.div>

      {/* 標題文字：slide-down+scale，由上方滑入＋由小變大 */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        className="absolute top-[10%] left-0 right-0 mx-auto w-[70%] sm:w-[60%] md:w-[50%] lg:w-[40%] aspect-[3/1] animate-slide-down delay-500"
      >
        <Image
          src={titleImage}
          alt="Little Chapter"
          fill
          priority
          sizes="(max-width: 640px) 70vw, (max-width: 768px) 60vw, (max-width: 1024px) 50vw, 40vw"
          className="object-contain"
        />
      </motion.div>

      {/* 副標：fade-in，淡入 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute top-[28%] left-0 right-0 mx-auto w-[60%] sm:w-[50%] md:w-[40%] lg:w-[30%] aspect-[3/1] animate-fade-in delay-800"
      >
        <Image
          src={subtitleImage}
          alt="專為兒童打造的優質閱讀體驗"
          fill
          sizes="(max-width: 640px) 60vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 30vw"
          className="object-contain"
        />
      </motion.div>

      {/* 小動物群：slide-up+scale，由底部往上滑入,由小變大 */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        className="absolute bottom-[15%] left-0 right-0 mx-auto w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] aspect-[3/1] animate-slide-up animate-scale-up delay-1000"
      >
        <Image
          src={animalsImage}
          alt="可愛動物"
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
          className="object-contain"
        />
      </motion.div>

      {/* 年齡選項容器 */}
      <div className="absolute bottom-[7%] left-0 right-0 flex flex-wrap justify-center gap-3 px-4">
        {/* 年齡類別按鈕 */}
        {[
          { id: 1, name: "0-3歲", href: "/age/0-3" },
          { id: 2, name: "3-5歲", href: "/age/3-5" },
          { id: 3, name: "5-7歲", href: "/age/5-7" },
          { id: 4, name: "7-11歲", href: "/age/7-11" },
          { id: 5, name: "11-13歲", href: "/age/11-13" },
        ].map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
              mass: 1,
              delay: 1.2 + index * 0.1,
            }}
            className="overflow-hidden animate-spring-up"
            style={{ animationDelay: `${1.2 + index * 0.1}s` }}
          >
            <Link
              href={category.href}
              className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full border-2 border-amber-300 hover:bg-amber-200 hover:scale-105 active:scale-95 transition-all duration-200 font-medium text-sm sm:text-base block"
            >
              {category.name}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
