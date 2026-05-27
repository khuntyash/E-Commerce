import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Products from "@/components/sections/Products";
import ProductShowcase from "@/components/sections/ProductShowcase";
import WhyZero from "@/components/sections/WhyZero";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-background">
      <LoadingScreen />
      <Navbar />
      <main className="w-full">
        <Hero />
        <Stats />
        <Products />
        <ProductShowcase />
        <WhyZero />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
