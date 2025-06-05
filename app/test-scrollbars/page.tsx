import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import CustomScrollbar from '@/components/ui/CustomScrollbar'
import Link from 'next/link'

const scrollbarTypes = [
  {
    title: '默認全域樣式',
    description: '目前網站全域設定的滾動條樣式',
    className: '',
    customClass: false
  },
  {
    title: '極簡細長風格',
    description: '簡潔的細長滾動條',
    className: 'scrollbar-simple',
    customClass: true
  },
  {
    title: '霧面浮雕風',
    description: '具有立體感的霧面效果',
    className: 'scrollbar-neumorph',
    customClass: true
  },
  {
    title: '透明玻璃感',
    description: '半透明的現代感設計',
    className: 'scrollbar-glass',
    customClass: true
  },
  {
    title: '品牌配色漸層',
    description: '使用品牌色彩的漸層效果',
    className: 'scrollbar-brand',
    customClass: true
  },
  {
    title: '圓形滾輪風格',
    description: '圓潤可愛的滾動條設計',
    className: 'scrollbar-round',
    customClass: true
  },
  {
    title: '橘色柔和風格',
    description: '橘色系柔和舒適的風格',
    className: 'demo-scrollbar',
    customClass: true
  },
  {
    title: '隱藏滾動條',
    description: '隱藏滾動條但保留滾動功能',
    className: 'scrollbar-none',
    customClass: true
  },
  {
    title: 'CustomScrollbar 組件（簡單風格）',
    description: '使用 CustomScrollbar 組件',
    component: true,
    style: 'simple'
  },
  {
    title: 'CustomScrollbar 組件（品牌風格）',
    description: '使用 CustomScrollbar 組件',
    component: true,
    style: 'brand'
  },
  {
    title: 'CustomScrollbar 組件（橘色柔和風格）',
    description: '使用 CustomScrollbar 組件',
    component: true,
    style: 'demo'
  }
]

const ScrollbarTestPage = () => {
  // 生成示例內容
  const generateContent = (count: number) => {
    return Array(count).fill(0).map((_, index) => (
      <div 
        key={index} 
        className={`p-3 ${index % 2 === 0 ? 'bg-amber-50' : 'bg-white'} border-b`}
      >
        <p className="font-medium">內容項目 #{index + 1}</p>
        <p className="text-sm text-gray-500">
          這是測試滾動內容的示例文字。這段文字的目的是為了讓滾動區域有足夠的內容可以滾動。
        </p>
        {index % 3 === 0 && (
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs">標籤</span>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">示例</span>
            <span className="text-sm text-gray-400">#{100 + index}</span>
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">滾動條樣式測試頁面</h1>
          <p className="text-gray-500">查看和比較不同的滾動條樣式</p>
        </div>
        <Link 
          href="/" 
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          返回首頁
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scrollbarTypes.map((type, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold mb-1">{type.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{type.description}</p>
              
              {type.component ? (
                <CustomScrollbar 
                  style={type.style as any} 
                  height="200px" 
                  className="border rounded-md"
                >
                  {generateContent(15)}
                </CustomScrollbar>
              ) : (
                <div 
                  className={`h-[200px] overflow-y-auto border rounded-md ${type.customClass ? type.className : ''}`}
                >
                  {generateContent(15)}
                </div>
              )}
              
              {type.customClass && (
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  className="{type.className}"
                </p>
              )}
              
              {type.component && (
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  {`<CustomScrollbar style="${type.style}">`}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">如何使用滾動條樣式</h2>
        
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-bold text-amber-800">特別說明</h3>
            <p className="text-amber-700">
              所有滾動條樣式已經設定為隱藏上下箭頭按鈕，創造更簡潔的視覺效果。
              這是通過 CSS 中的 <code className="bg-amber-100 px-1 rounded">::-webkit-scrollbar-button {'{'} display: none; {'}'}</code> 實現的。
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold">1. 直接在元素上使用樣式類</h3>
            <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-x-auto">
              {`<div className="scrollbar-simple overflow-y-auto max-h-[300px]">
  內容...
</div>

<!-- 或使用橘色柔和風格 -->
<div className="demo-scrollbar">
  內容...
</div>`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-bold">2. 使用 CustomScrollbar 組件</h3>
            <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-x-auto">
              {`import CustomScrollbar from "@/components/ui/CustomScrollbar";

<CustomScrollbar style="brand" maxHeight="400px">
  內容...
</CustomScrollbar>`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-bold">3. 變更全域滾動條樣式</h3>
            <p className="text-gray-600">
              如需變更全域滾動條樣式，請修改 <code className="bg-gray-100 px-1 rounded">app/globals.css</code> 檔案中的以下部分：
            </p>
            <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-x-auto mt-2">
              {`/* 全域滾動條樣式 */
html {
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

html::-webkit-scrollbar {
  width: 6px;
}

html::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

html::-webkit-scrollbar-track {
  background: transparent;
}

/* 全域可滾動元素的滾動條樣式 */
* {
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

*::-webkit-scrollbar {
  width: 6px;
}

*::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* 大型滾動區域展示 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">大型滾動區域展示</h2>
        <p className="text-gray-500 mb-6">以下展示不同滾動條樣式在大區域中的表現</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold mb-2">默認樣式 (極簡細長風格)</h3>
              <div className="h-[500px] overflow-y-auto border rounded-md">
                {generateContent(30)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold mb-2">品牌配色漸層</h3>
              <div className="h-[500px] overflow-y-auto border rounded-md scrollbar-brand">
                {generateContent(30)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold mb-2">橘色柔和風格</h3>
              <div className="demo-scrollbar" style={{ height: '500px', maxHeight: '500px' }}>
                {generateContent(30)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="h-[100px]"></div>
    </div>
  )
}

export default ScrollbarTestPage 