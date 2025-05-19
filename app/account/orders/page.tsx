"use client"

import OrdersClient from "@/components/account/OrdersClient"

export default function OrdersPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-amber-800 mb-6">我的訂單</h2>
      <OrdersClient />
    </div>
  )
}
