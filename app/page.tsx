import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import EditorialBanner from "@/components/EditorialBanner";
import Bestsellers from "@/components/Bestsellers";
import LookbookStrip from "@/components/LookbookStrip";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <EditorialBanner />
        <Bestsellers />
        <LookbookStrip />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
