import Header from "@/components/layout/Header"
import Hero from "@/components/home/HeroSection"
import AnnouncementBanner from "@/components/home/AnnouncementBanner"
import PopularBooks from "@/components/home/PopularBooks"
import NewArrivals from "@/components/home/NewArrivals"
import RecommendedSets from "@/components/home/RecommendedSets"
import BookReviews from "@/components/home/BookReviews"
import WebsiteFeatures from "@/components/home/WebsiteFeatures"
import FAQ from "@/components/home/faq"
import Footer from "@/components/layout/Footer"

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-orange-50">
        <Hero />
        <AnnouncementBanner />
        <PopularBooks />
        <NewArrivals />
        <RecommendedSets />
        <BookReviews />
        <WebsiteFeatures />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
