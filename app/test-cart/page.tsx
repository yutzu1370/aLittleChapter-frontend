"use client"

import { useCartStore, useCartHydration } from "@/lib/store/useCartStore"
import { Product } from "@/lib/types/product"

export default function TestCartPage() {
  const { items, addItem, clearCart } = useCartStore()
  const isHydrated = useCartHydration()

  const testProducts: Product[] = [
    {
      id: "1",
      name: "測試商品 1",
      description: "這是測試商品 1",
      price: 100,
      originalPrice: 150,
      image: "/images/books/placeholder.jpg",
      stockQuantity: 10,
      authorName: "作者 1",
      publisherName: "出版社 1"
    },
    {
      id: "2", 
      name: "測試商品 2",
      description: "這是測試商品 2",
      price: 200,
      originalPrice: 250,
      image: "/images/books/placeholder.jpg",
      stockQuantity: 5,
      authorName: "作者 2",
      publisherName: "出版社 2"
    },
    {
      id: "3",
      name: "測試商品 3", 
      description: "這是測試商品 3",
      price: 300,
      originalPrice: 350,
      image: "/images/books/placeholder.jpg",
      stockQuantity: 8,
      authorName: "作者 3",
      publisherName: "出版社 3"
    }
  ]

  const handleAddProduct = (product: Product) => {
    addItem(product, 1)
    console.log('添加商品後的購物車狀態:', useCartStore.getState().items)
  }

  const handleClearCart = () => {
    clearCart()
    console.log('清空購物車後的狀態:', useCartStore.getState().items)
  }

  const checkLocalStorage = () => {
    const cartData = localStorage.getItem('cart-storage')
    console.log('localStorage 中的購物車資料:', cartData)
    if (cartData) {
      console.log('解析後的資料:', JSON.parse(cartData))
    }
  }

  if (!isHydrated) {
    return <div className="p-8">載入中...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">購物車測試頁面</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">測試商品</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-gray-600">價格: NT${product.price}</p>
              <button
                onClick={() => handleAddProduct(product)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                加入購物車
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">購物車內容 ({items.length} 項商品)</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">購物車是空的</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.productId} className="border rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.name}</span>
                  <span>數量: {item.quantity}</span>
                  <span>NT${item.discountPrice}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-x-4">
        <button
          onClick={handleClearCart}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          清空購物車
        </button>
        <button
          onClick={checkLocalStorage}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          檢查 localStorage
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">測試說明：</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>點擊「加入購物車」按鈕添加不同商品</li>
          <li>觀察購物車內容是否正確顯示多個商品</li>
          <li>點擊「檢查 localStorage」查看瀏覽器控制台</li>
          <li>重新整理頁面，確認商品是否持久保存</li>
          <li>開啟開發者工具 &gt; Application &gt; Local Storage &gt; cart-storage</li>
        </ol>
      </div>
    </div>
  )
} 