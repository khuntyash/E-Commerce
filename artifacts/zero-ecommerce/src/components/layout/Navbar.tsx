import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, type MouseEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToSection } from "@/lib/scroll";
import brandLeaf from "@/assets/brand-leaf.png";

const NAV_SECTIONS = [
  { id: "products", label: "Products" },
  { id: "solutions", label: "Solutions" },
  { id: "about", label: "About" },
] as const;

const navLinkClass =
  "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2";

function NavAnchor({
  sectionId,
  children,
  className,
  onNavigate,
}: {
  sectionId: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToSection(sectionId);
    onNavigate?.();
  };

  return (
    <a href={`#${sectionId}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

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

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const timer = window.setTimeout(() => scrollToSection(hash), 400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-5",
      )}
    >
      <motion.div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 min-w-0 shrink z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 rounded-md">
          <img
            src={brandLeaf}
            alt="Zero leaf logo"
            className="h-11 w-11 shrink-0 rounded-md object-cover"
          />
          <span className="font-extrabold text-sm lg:text-xl tracking-tight text-foreground whitespace-nowrap truncate max-w-[10rem] lg:max-w-none">
            Zero E-Commerce Solutions
          </span>
        </Link>

        <div className="hidden md:flex items-center md:gap-4 lg:gap-8">
          {NAV_SECTIONS.map(({ id, label }) => (
            <NavAnchor key={id} sectionId={id} className={navLinkClass}>
              {label}
            </NavAnchor>
          ))}
        </div>

        <button
          type="button"
          className="md:hidden z-50 p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-border shadow-lg py-4 px-6 flex flex-col gap-4 md:hidden"
          >
            {NAV_SECTIONS.map(({ id, label }) => (
              <NavAnchor
                key={id}
                sectionId={id}
                className="text-lg font-medium text-foreground py-2 border-b border-border/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 rounded-md"
                onNavigate={() => setMobileMenuOpen(false)}
              >
                {label}
              </NavAnchor>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
