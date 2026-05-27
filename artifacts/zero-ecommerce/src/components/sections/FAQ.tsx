import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <motion.section 
      className="py-24 bg-brand-gray"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full bg-white rounded-2xl p-4 border border-border shadow-sm">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does Suspicious Buyer Detection work?</AccordionTrigger>
            <AccordionContent>
              Our AI analyzes 20+ buyer signals including return history, address patterns, and behavioral data to flag high-risk buyers before you ship. You can block, review, or allow flagged orders.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Which marketplace platforms do you support?</AccordionTrigger>
            <AccordionContent>
              We support Amazon, Flipkart, Meesho, Shopify, Myntra, and Ajio — with more platforms being added regularly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How quickly can we get started?</AccordionTrigger>
            <AccordionContent>
              Most teams start in a few days. We begin with your primary marketplaces and workflows, then expand setup module by module based on your operations.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Is my seller data secure?</AccordionTrigger>
            <AccordionContent>
              Absolutely. We use bank-grade AES-256 encryption, are SOC 2 compliant, and never share or sell your data. Your marketplace credentials are encrypted and never stored in plain text.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.section>
  );
}
