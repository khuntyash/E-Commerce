import { motion } from "framer-motion";
import { Handshake, Lightbulb, Rocket, Target } from "lucide-react";

export default function Testimonials() {
  const companyHighlights = [
    {
      title: "Our Mission",
      icon: <Target className="w-5 h-5" />,
      accentClass: "bg-blue-100 text-blue-700",
      content:
        "Make online selling simpler for Indian businesses by reducing operational complexity and enabling consistent customer experiences.",
    },
    {
      title: "Our Vision",
      icon: <Rocket className="w-5 h-5" />,
      accentClass: "bg-purple-100 text-purple-700",
      content:
        "Build a reliable e-commerce ecosystem where sellers of every size can grow confidently in a fast-changing digital market.",
    },
    {
      title: "What We Build",
      icon: <Lightbulb className="w-5 h-5" />,
      accentClass: "bg-emerald-100 text-emerald-700",
      content:
        "We create end-to-end commerce capabilities across storefronts, operations, and customer journeys to support sustainable business growth.",
    },
    {
      title: "Why Choose Us",
      icon: <Handshake className="w-5 h-5" />,
      accentClass: "bg-rose-100 text-rose-700",
      content:
        "We combine market understanding, execution discipline, and a seller-first approach to deliver practical outcomes, not just ideas.",
    },
  ];

  return (
    <motion.section
      id="about"
      className="py-24 bg-brand-gray scroll-mt-24"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for India's Growing Online Sellers
          </h2>
          <p className="text-muted-foreground text-lg">
            We help brands launch, operate, and scale e-commerce with practical
            solutions focused on trust, speed, and long-term growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyHighlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-2xl hover:-translate-y-1 hover:shadow-md transition-all duration-300 h-full min-h-[220px] flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${item.accentClass}`}
                >
                  {item.icon}
                </div>
                <h4 className="font-semibold text-base">{item.title}</h4>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-muted-foreground mt-12 max-w-3xl mx-auto">
          We are a focused e-commerce team that understands the realities of
          selling in India. Our approach is straightforward: solve real
          business problems, build with clarity, and support our partners with
          dependable execution as they grow.
        </p>
      </div>
    </motion.section>
  );
}
