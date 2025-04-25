import Header from "@/components/header"
import Hero from "@/components/hero"
import AnnouncementBanner from "@/components/announcement-banner"
import PopularBooks from "@/components/popular-books"
import FeaturedBook from "@/components/featured-book"
import NewArrivals from "@/components/new-arrivals"
import BookReviews from "@/components/book-reviews"
import Features from "@/components/features"
import Faq from "@/components/faq"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-orange-50">
        <Hero />
        <AnnouncementBanner />
        <PopularBooks />
        <FeaturedBook />
        <NewArrivals />
        <BookReviews />
        <Features />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
