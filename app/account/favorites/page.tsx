"use client"

import FavoritesClient from "@/components/account/FavoritesClient"

export default function FavoritesPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-amber-800 mb-6">我的收藏</h2>
      <FavoritesClient />
    </div>
  )
}