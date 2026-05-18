import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-semibold text-xl tracking-tight text-foreground">Zero</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              The complete operating system for e-commerce sellers.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Products</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Smart Label Cropper</a></li>
              <li><a href="#" className="hover:text-foreground">P&L Analytics</a></li>
              <li><a href="#" className="hover:text-foreground">Inventory Management</a></li>
              <li><a href="#" className="hover:text-foreground">Suspicious Customer Detection</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About Us</a></li>
              <li><a href="#" className="hover:text-foreground">Careers</a></li>
              <li><a href="#" className="hover:text-foreground">Blog</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground">Security</a></li>
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
