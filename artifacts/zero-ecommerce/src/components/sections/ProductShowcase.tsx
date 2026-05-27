import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Zap, Package, ShieldAlert, LineChart as ChartIcon, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Profit & Loss Analytics",
    desc: "Real-time visibility into your margins. See exactly which products make money and which ones are bleeding cash across all marketplaces.",
    icon: <ChartIcon className="w-6 h-6" />
  },
  {
    title: "Smart Inventory",
    desc: "Never stockout of a bestseller again. Our AI predicts sales velocity and alerts you when it's exactly the right time to reorder.",
    icon: <Package className="w-6 h-6" />
  },
  {
    title: "Smart Label Cropper",
    desc: "Use a dedicated label tool to auto-crop and format shipping labels for different printer sizes in seconds.",
    icon: <Scissors className="w-6 h-6" />
  },
  {
    title: "Suspicious Order Detection",
    desc: "Stop bad orders before you ship. We cross-reference millions of data points to flag orders with suspicious return histories.",
    icon: <ShieldAlert className="w-6 h-6" />
  },
  {
    title: "Marketplace Sync",
    desc: "Connect Amazon, Meesho, Flipkart, and Shopify in a separate sync tool to keep orders, stock, and catalog data aligned.",
    icon: <Zap className="w-6 h-6" />
  }
];

const mockData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

export default function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // Derive active index from scroll progress
  useMotionValueEvent(scrollYProgress, "change", (pos) => {
    const panels = features.length;
    const rawIndex = Math.floor(pos * panels);
    const index = Math.min(Math.max(rawIndex, 0), panels - 1);
    setActiveIndex((prev) => (prev === index ? prev : index));
  });

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-white w-full">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden w-full">
        <div className="container mx-auto px-6 h-full flex flex-col md:flex-row items-center py-20 gap-12 w-full">
          
          <div className="w-full md:w-1/2 flex flex-col justify-center max-w-xl pr-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-12">Specialized Tools<br/>for Sellers</h2>
            
            <div className="relative h-64 w-full">
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  className={cn("absolute inset-0 flex flex-col gap-4", activeIndex === i ? "pointer-events-auto" : "pointer-events-none")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: activeIndex === i ? 1 : 0, 
                    y: activeIndex === i ? 0 : activeIndex > i ? -20 : 20 
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 h-[60vh] md:h-[70vh] relative flex items-center justify-center bg-gray-50 rounded-3xl border border-border shadow-inner p-8 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeIndex === 0 && (
                <motion.div 
                  key="panel-0"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col"
                >
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg">Revenue Trends</h4>
                    <p className="text-sm text-gray-500">Last 7 days</p>
                  </div>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockData}>
                        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
              {activeIndex === 1 && (
                <motion.div 
                  key="panel-1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4"
                >
                  <h4 className="font-semibold text-lg mb-2">Inventory Alerts</h4>
                  {[
                    { n: "Premium Yoga Mat", s: "12 left", c: "bg-red-500", w: "20%" },
                    { n: "Resistance Band", s: "45 left", c: "bg-yellow-500", w: "45%" },
                    { n: "Foam Roller Set", s: "120 left", c: "bg-green-500", w: "80%" },
                  ].map((it, i) => (
                    <div key={i} className="flex flex-col gap-2 p-3 border border-gray-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{it.n}</span>
                        <span className="text-gray-500">{it.s}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${it.c}`} style={{ width: it.w }} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
              {activeIndex === 2 && (
                <motion.div 
                  key="panel-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center gap-6"
                >
                  <div className="p-4 border border-blue-100 bg-blue-50 rounded-xl flex items-center justify-between">
                     <span className="font-medium">New Order (Meesho)</span>
                     <Zap className="text-blue-500 w-5 h-5" />
                  </div>
                  <div className="w-0.5 h-8 bg-gray-200 mx-auto" />
                  <div className="p-4 border border-purple-100 bg-purple-50 rounded-xl flex items-center justify-between">
                     <span className="font-medium">Auto-Crop Label</span>
                     <Scissors className="text-purple-500 w-5 h-5" />
                  </div>
                  <div className="w-0.5 h-8 bg-gray-200 mx-auto" />
                  <div className="p-4 border border-green-100 bg-green-50 rounded-xl flex items-center justify-between">
                     <span className="font-medium">Ready to Print</span>
                     <Check className="text-green-500 w-5 h-5" />
                  </div>
                </motion.div>
              )}
              {activeIndex === 3 && (
                <motion.div 
                  key="panel-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4"
                >
                  <h4 className="font-semibold text-lg text-red-600 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" /> High Risk Buyers
                  </h4>
                  {[
                    { id: "ORD-9921", risk: "98%", reason: "3 recent returns" },
                    { id: "ORD-9934", risk: "85%", reason: "Address mismatch" },
                    { id: "ORD-9956", risk: "72%", reason: "New account" },
                  ].map((it, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-red-100 bg-red-50/30 rounded-xl">
                      <div>
                        <div className="font-medium text-sm">{it.id}</div>
                        <div className="text-xs text-gray-500">{it.reason}</div>
                      </div>
                      <div className="text-red-600 font-bold bg-red-100 px-2 py-1 rounded text-sm">
                        {it.risk} Risk
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
              {activeIndex === 4 && (
                <motion.div 
                  key="panel-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col"
                >
                   <h4 className="font-semibold text-lg mb-6">Marketplace Sync Snapshot</h4>
                   <div className="flex flex-col gap-3 flex-1 overflow-hidden">
                     {[
                       { p: "Amazon", id: "#AMZ-124", status: "Synced", t: "Just now" },
                       { p: "Meesho", id: "#MEE-892", status: "Synced", t: "2m ago" },
                       { p: "Shopify", id: "#SHP-001", status: "Pending", t: "15m ago" },
                       { p: "Flipkart", id: "#FLK-554", status: "Synced", t: "1h ago" },
                     ].map((it, i) => (
                       <div key={i} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                             {it.p[0]}
                           </div>
                           <div>
                             <div className="text-sm font-medium">{it.id}</div>
                             <div className="text-xs text-gray-400">{it.t}</div>
                           </div>
                         </div>
                         <div className="font-semibold text-sm">{it.status}</div>
                       </div>
                     ))}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  )
}
