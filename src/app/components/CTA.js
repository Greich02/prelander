'use client';

import { motion } from 'framer-motion';

export default function CTA() {
  const handleExplore = () => {
    // This would typically link to external resource or next step
    console.log('CTA clicked: Explore This Perspective');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full max-w-2xl mx-auto px-6 py-24 md:py-32 text-center"
    >
      <motion.button
        onClick={handleExplore}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-12 py-4 bg-[#4A5568] text-white font-medium text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
      >
        Explore This Perspective
      </motion.button>
      <p className="text-sm text-[#6B6B6B] mt-4">
        Informational resource • No commitment required
      </p>
    </motion.section>
  );
}
