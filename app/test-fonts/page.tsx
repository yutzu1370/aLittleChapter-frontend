import React from 'react'

const TestFontsPage = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">字體測試頁面</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Noto Sans TC (預設) */}
        <div className="p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Noto Sans TC (預設)</h2>
          <p className="mb-3">這是使用 Noto Sans TC 的文字範例。</p>
          <p className="mb-3">這是繁體中文字體示例。</p>
          <p className="mb-3">這是數字範例: <span className="font-noto-sans-tc">12345</span></p>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-amber-500 text-white rounded-lg">按鈕範例</button>
            <button className="px-4 py-2 border border-amber-500 text-amber-500 rounded-lg">次要按鈕</button>
          </div>
        </div>
        
        {/* JF Open Huninn */}
        <div className="p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 font-jf-openhuninn">JF Open Huninn</h2>
          <p className="mb-3 font-jf-openhuninn">這是使用 JF Open Huninn 的文字範例。</p>
          <p className="mb-3 font-jf-openhuninn">這是繁體中文字體示例。</p>
          <p className="mb-3 font-jf-openhuninn">這是數字範例: <span className="font-noto-sans-tc">12345</span></p>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-amber-500 text-white rounded-lg font-jf-openhuninn">按鈕範例</button>
            <button className="px-4 py-2 border border-amber-500 text-amber-500 rounded-lg font-jf-openhuninn">次要按鈕</button>
          </div>
        </div>
        
        {/* Coiny (選擇性使用) */}
        <div className="p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 font-coiny">Coiny 字體</h2>
          <p className="mb-3">默認數字樣式: <span>12345</span></p>
          <p className="mb-3">價格範例: <span className="price">$199.99</span></p>
          <p className="mb-3">選擇使用 Coiny: <span className="font-coiny">這是 Coiny 字體示例 12345</span></p>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-amber-500 text-white rounded-lg font-coiny">Coiny 按鈕</button>
            <button className="px-4 py-2 border border-amber-500 text-amber-500 rounded-lg font-coiny">Coiny 按鈕</button>
          </div>
        </div>
      </div>
      
      {/* 混合使用範例 */}
      <div className="mt-12 p-6 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">混合使用示例</h2>
        
        <div className="mb-6">
          <p className="mb-2">
            這是預設的 <span className="font-noto-sans-tc">Noto Sans TC</span> 字體。
            我可以切換為 <span className="font-jf-openhuninn">JF Open Huninn</span> 字體，
            或者選擇使用 <span className="font-coiny">Coiny</span> 字體。
          </p>
          
          <p className="mb-2">
            通過 text-* 類：
            <span className="text-noto">Noto Sans TC 範例 12345</span> |
            <span className="text-jf">JF Open Huninn 範例 12345</span> |
            <span className="text-coiny">Coiny 範例 12345</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-amber-100 rounded-lg">
            <h3 className="font-noto-sans-tc text-lg font-bold mb-2">商品標題</h3>
            <p className="text-gray-700">商品描述使用 Noto Sans TC</p>
            <p className="text-xl text-amber-600 mt-2">$199.99</p>
          </div>
          
          <div className="p-4 bg-orange-100 rounded-lg">
            <h3 className="font-jf-openhuninn text-lg font-bold mb-2">活動標題</h3>
            <p className="font-jf-openhuninn text-gray-700">活動描述使用 JF Open Huninn</p>
            <p className="text-xl text-orange-600 mt-2">$299.99</p>
          </div>
          
          <div className="p-4 bg-amber-200 rounded-lg">
            <h3 className="font-coiny text-lg font-bold mb-2">特別樣式</h3>
            <p className="text-gray-700">描述文字</p>
            <p className="text-xl font-coiny text-amber-800 mt-2">$99.99 (特殊Coiny樣式)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestFontsPage 