import { motion } from "framer-motion";

export default function WhyZero() {
  return (
    <motion.section 
      className="py-24 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      id="solutions"
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-16">Built for Sellers Who Mean Business</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "Save 10+ Hours Weekly", desc: "Eliminate manual data entry, label printing, and report generation" },
             { title: "Full Workflow Automation", desc: "From order received to label printed — zero manual steps" },
             { title: "Maximize Profit Margins", desc: "Real-time P&L visibility across every product and channel" },
             { title: "Slash Return Fraud", desc: "AI detects suspicious buyers before they cost you money" },
             { title: "Never Stockout Again", desc: "Smart reorder alerts based on sales velocity" },
             { title: "Scale Without Limits", desc: "Infrastructure that grows with you from 100 to 1M orders" },
           ].map((item, i) => (
             <div key={i} className="text-left p-6 border border-border rounded-2xl hover:shadow-md transition-shadow">
               <h3 className="font-bold text-lg mb-2">{item.title}</h3>
               <p className="text-muted-foreground text-sm">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </motion.section>
  );
}