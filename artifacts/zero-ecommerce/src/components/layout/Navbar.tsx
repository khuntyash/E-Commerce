import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Zap } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn("fixed top-0 left-0 w-full z-50 transition-all duration-300", scrolled ? "bg-white/80 backdrop-blur-md border-b border-border shadow-sm py-3" : "bg-transparent py-5")}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-50">
          <Zap className="text-brand-blue w-6 h-6 fill-brand-blue" />
          <span className="font-semibold text-xl tracking-tight text-foreground">Zero</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Products</Link>
          <Link href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solutions</Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="button-signin">Sign In</button>
          <MagneticButton className="bg-foreground text-background rounded-full text-sm hover:bg-foreground/90" data-testid="button-start-free">
            Start Free
          </MagneticButton>
        </div>

        <button className="md:hidden z-50 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="button-mobile-menu">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-border shadow-lg py-4 px-6 flex flex-col gap-4 md:hidden"
          >
            <Link href="#products" className="text-lg font-medium text-foreground py-2 border-b border-border/50" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link href="#solutions" className="text-lg font-medium text-foreground py-2 border-b border-border/50" onClick={() => setMobileMenuOpen(false)}>Solutions</Link>
            <Link href="#pricing" className="text-lg font-medium text-foreground py-2 border-b border-border/50" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <div className="flex flex-col gap-3 mt-4">
              <button className="w-full py-3 text-center rounded-lg border border-border font-medium">Sign In</button>
              <button className="w-full py-3 text-center rounded-lg bg-foreground text-background font-medium">Start Free</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
