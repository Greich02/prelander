'use client';

import { motion } from 'framer-motion';

export default function ContextSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-100px' }}
      className="w-full max-w-2xl mx-auto px-6 py-16 md:py-20"
    >
      <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-100">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-base md:text-lg text-[#6B6B6B] leading-relaxed"
        >
          Many people try to improve their energy with surface-level approaches — better sleep, more exercise, adjusted diet. These matter. But some perspectives suggest that deeper internal factors may also play a significant role in how we feel day to day.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-base md:text-lg text-[#6B6B6B] leading-relaxed mt-6"
        >
          This approach is exploratory and educational — not prescriptive. We're not making claims or promises. Instead, we're inviting people to explore a broader perspective on vitality and how different factors interconnect.
        </motion.p>
      </div>
    </motion.section>
  );
}
