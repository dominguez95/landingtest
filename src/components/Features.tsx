"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
    title: "Lightning Fast",
    description:
      "Optimized for speed with Next.js server components and edge caching.",
  },
  {
    icon: <Shield className="w-8 h-8 text-emerald-500" />,
    title: "Secure by Default",
    description:
      "Enterprise-grade security features built right into the framework.",
  },
  {
    icon: <Globe className="w-8 h-8 text-blue-500" />,
    title: "Global Scale",
    description:
      "Deploy instantly to the edge and reach users worldwide with low latency.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full opacity-10 blur-xl" />
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-10 blur-xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
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
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
              className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-purple-100 hover:border-purple-200 hover:bg-white/80 transition-all duration-300 shadow-md hover:shadow-xl group"
            >
              <motion.div
                className="mb-4 p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300"
                whileHover={{
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5 },
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-purple-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
