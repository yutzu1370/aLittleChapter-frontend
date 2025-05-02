import Header from "@/components/header"
import Footer from "@/components/footer"
import ProfileClient from "./profile-client"

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-orange-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <h1 className="text-3xl font-bold text-amber-800 mb-6 text-center">個人資料</h1>
        <ProfileClient />
      </div>
      <div className="mt-36">
        <Footer />
      </div>
    </main>
  )
} 