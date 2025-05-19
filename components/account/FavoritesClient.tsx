"use client"

import { Heart } from "lucide-react"

export default function FavoritesClient() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="mb-6 bg-amber-50 p-4 rounded-full">
          <Heart className="h-12 w-12 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">我的收藏</h2>
        <p className="text-gray-600 max-w-md">
          目前尚未收藏任何書籍
        </p>
      </div>
    </section>
  )
}
