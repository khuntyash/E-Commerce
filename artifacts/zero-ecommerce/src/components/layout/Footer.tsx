import { motion } from "framer-motion";
import brandLeaf from "@/assets/brand-leaf.png";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-border pt-10 md:pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-start gap-8 md:gap-24 mb-8 md:mb-10">
          <div className="w-full md:max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={brandLeaf}
                alt="Zero leaf logo"
                className="h-11 w-11 shrink-0 rounded-md object-cover"
              />
              <span className="font-extrabold text-xl tracking-tight text-foreground">Zero E-Commerce Solutions</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mb-0">
              The complete operating system for e-commerce sellers.
            </p>
          </div>
          
          <div className="w-full md:w-auto md:shrink-0">
            <h4 className="font-semibold mb-4 text-sm">Products</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Smart Label Cropper</a></li>
              <li><a href="#" className="hover:text-foreground">P&L Analytics</a></li>
              <li><a href="#" className="hover:text-foreground">Inventory Management</a></li>
              <li><a href="#" className="hover:text-foreground">Suspicious Order Detection</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Zero E-Commerce Solutions. All rights reserved.</p>
          <p>Made in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
