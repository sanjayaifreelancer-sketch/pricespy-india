import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import CategoryGrid from '@/components/home/CategoryGrid'
import TodayDeals from '@/components/home/TodayDeals'
import TopProducts from '@/components/home/TopProducts'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-28 md:pb-16">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-tablet space-y-12 md:space-y-16">
          <HeroSection />
          <CategoryGrid />
          <TodayDeals />
          <TopProducts />
        </div>
        <Footer />
      </main>
      <BottomNav />
    </>
  )
}
