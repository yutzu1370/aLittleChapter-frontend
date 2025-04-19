import Header from "@/components/header"
import Footer from "@/components/footer"

export default function MemberPage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-amber-800 mb-8 text-center">會員專區</h1>
        <div className="bg-white p-8 rounded-xl shadow-md">
          <p className="text-center text-lg">這裡是會員專區頁面內容區塊</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
