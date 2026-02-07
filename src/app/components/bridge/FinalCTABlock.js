'use client';

import { motion } from 'framer-motion';

export default function FinalCTABlock({ onCTAClick }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-100px' }}
      className="w-full max-w-2xl mx-auto px-6 py-16 md:py-24 text-center"
    >
      <motion.button
        onClick={onCTAClick}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        viewport={{ once: true, margin: '-100px' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-8 py-4 md:py-4.5 bg-[#4A5568] text-white font-semibold text-base md:text-lg rounded-lg shadow-md hover:shadow-lg hover:bg-[#3a4553] transition-all duration-200 mb-3"
      >
        👉 See How This Works
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-xs md:text-sm text-[#6B6B6B]"
      >
        No sign-up required • Informational content
      </motion.p>
    </motion.section>
  );
}
