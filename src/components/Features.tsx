"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    title: "Lightning Fast",
    description:
      "Optimized for speed with Next.js server components and edge caching.",
  },
  {
    icon: <Shield className="w-8 h-8 text-green-400" />,
    title: "Secure by Default",
    description:
      "Enterprise-grade security features built right into the framework.",
  },
  {
    icon: <Globe className="w-8 h-8 text-blue-400" />,
    title: "Global Scale",
    description:
      "Deploy instantly to the edge and reach users worldwide with low latency.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Why Choose Us?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We provide the best tools to help you build your next big idea.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
