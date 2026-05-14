import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rajesh K.",
      role: "Meesho Seller, Tier 1",
      initials: "RK",
      color: "bg-blue-100 text-blue-700",
      content: "Zero's label cropper alone saves me 3 hours every day. The fraud detection caught 47 suspicious buyers in my first week. My returns dropped 38%."
    },
    {
      name: "Priya S.",
      role: "Flipkart Gold Seller",
      initials: "PS",
      color: "bg-purple-100 text-purple-700",
      content: "The P&L analytics showed me I was losing money on 20% of my products. I fixed it in a week. Revenue up 34% in 30 days."
    },
    {
      name: "Mohammed A.",
      role: "Amazon + Meesho",
      initials: "MA",
      color: "bg-emerald-100 text-emerald-700",
      content: "Managing two platforms was chaos. Zero unified everything. I've never felt more in control of my business."
    },
    {
      name: "Anita V.",
      role: "Shopify + Meesho",
      initials: "AV",
      color: "bg-rose-100 text-rose-700",
      content: "The AI insights predicted my bestsellers before the season started. I pre-ordered stock at the right time. Best decision I made."
    }
  ];

  return (
    <motion.section 
      className="py-24 bg-brand-gray"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Trusted by India's Top Sellers</h2>
        
        <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="break-inside-avoid glass p-6 rounded-2xl hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed italic">"{t.content}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
