'use client';

import { motion } from 'framer-motion';

export default function CuriositySection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-100px' }}
      className="w-full max-w-2xl mx-auto px-6 py-16 md:py-20"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-3xl md:text-4xl font-serif font-bold text-[#1F1F1F] mb-6 text-center"
      >
        What Makes This Perspective Different?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-base md:text-lg text-[#6B6B6B] leading-relaxed max-w-xl mx-auto text-center"
      >
        Instead of looking at energy and vitality as isolated topics, this approach connects multiple small factors people usually see as separate. It shows how these factors influence each other — and how understanding these connections can shift how you think about your own well-being.
      </motion.p>

      {/* Open Loop */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-base md:text-lg text-[#1F1F1F] leading-relaxed max-w-xl mx-auto text-center mt-8 font-medium"
      >
        For many viewers, this is the moment things start to make more sense.
      </motion.p>
    </motion.section>
  );
}
