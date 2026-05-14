import { motion } from "framer-motion";

export default function Stats() {
  return (
    <motion.section 
      className="py-24 bg-brand-gray w-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">The numbers speak for themselves</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { value: "50,000+", label: "Sellers Empowered" },
            { value: "12M+", label: "Orders Processed" },
            { value: "99.9%", label: "Automation Accuracy" },
            { value: "6", label: "Marketplace Platforms" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-2xl flex flex-col items-center justify-center text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        <div className="w-full overflow-hidden whitespace-nowrap">
          <div className="flex gap-8 animate-marquee items-center opacity-60">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-8">
                {["Amazon", "Flipkart", "Meesho", "Shopify", "Myntra", "Ajio", "Snapdeal", "Glowroad"].map((platform) => (
                  <div key={platform} className="px-6 py-3 rounded-full border border-border bg-white text-sm font-bold text-muted-foreground whitespace-nowrap">
                    {platform}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
