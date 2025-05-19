import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getProductById, getRelatedProducts, reviews } from "@/lib/data/products";
import ProductImages from "@/components/products/detail/ProductImages";
import ProductInfo from "@/components/products/detail/ProductInfo";
import ProductAbout from "@/components/products/detail/ProductAbout";
import RelatedProducts from "@/components/products/detail/RelatedProducts";
import ProductReviews from "@/components/products/detail/ProductReviews";
import FloatingButtons from "@/components/interaction/FloatingButtons";
import ClientChat from "@/components/interaction/chat/ClientChat";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // 獲取商品資料（實際中應該使用 API）
  const product = getProductById(params.id);
  const relatedProducts = getRelatedProducts(params.id);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* 主要內容區域 - 增加頂部 padding 避免被導航列遮擋 */}
      <section className="w-full py-12 pt-56 md:pt-40 px-4 sm:px-6 lg:px-8 xl:px-0 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 商品圖片區 - 使用組件 */}
          <ProductImages images={product.images} productName={product.name} />

          {/* 商品資訊區 - 使用組件 */}
          <ProductInfo product={product} />
        </div>
      </section>

      {/* 內容簡介區塊 */}
      <ProductAbout aboutContent={product.aboutContent} />

      {/* 探索更多故事區塊 */}
      <RelatedProducts products={relatedProducts} />

      {/* 會員評價區塊 */}
      <ProductReviews reviews={reviews} />



      {/* 浮動回到頂部按鈕 */}
      <FloatingButtons />
      
      {/* 聊天機器人 */}
      <ClientChat />

      <Footer />
    </main>
  );
}
