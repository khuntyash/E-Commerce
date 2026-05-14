import { motion } from "framer-motion";

export default function Products() {
  return (
    <motion.section 
      className="py-24 bg-brand-gray w-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      id="products"
    >
      <div className="container mx-auto px-6 text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Sell Smarter</h2>
        <p className="text-muted-foreground text-lg mb-16">One platform. Every tool.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <div className="col-span-1 md:col-span-2 bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2">Smart Label Cropper</h3>
            <p className="text-muted-foreground mb-6">Automatically crop, resize, and format shipping labels for any printer.</p>
            <div className="h-40 bg-brand-gray rounded-xl border border-border flex items-center justify-center text-muted-foreground text-sm font-mono">Label Cropper UI</div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2">P&L Analytics</h3>
            <p className="text-muted-foreground mb-6">Real-time profit tracking per product.</p>
            <div className="h-32 bg-brand-gray rounded-xl border border-border"></div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2">Fraud Detection</h3>
            <p className="text-muted-foreground mb-6">AI-powered suspicious buyer alerts.</p>
            <div className="h-32 bg-brand-gray rounded-xl border border-border"></div>
          </div>
          
          <div className="col-span-1 md:col-span-2 bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2">Multi-Platform Sync</h3>
            <p className="text-muted-foreground mb-6">Manage Amazon, Shopify, Meesho from one dashboard.</p>
            <div className="h-32 bg-brand-gray rounded-xl border border-border"></div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
