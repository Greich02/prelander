'use client';

import { motion } from 'framer-motion';

export default function BridgeHero({ onCTAClick }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto px-6 py-16 md:py-24"
    >
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif font-bold text-[#1F1F1F] mb-6 leading-tight"
        >
          Why More People Are Looking at Vitality From a Different Angle
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="text-base md:text-lg text-[#6B6B6B] leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Some experts are exploring how internal balance and subtle biological patterns may influence energy, aging, and day-to-day vitality. This perspective connects factors many people usually see as separate.
        </motion.p>

        {/* Bullet Points */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="space-y-4 mb-10 text-left max-w-md mx-auto"
        >
          <div className="flex items-start gap-4">
            <span className="text-[#4A5568] font-bold mt-1">✓</span>
            <p className="text-base text-[#6B6B6B]">Looks beyond surface habits</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-[#4A5568] font-bold mt-1">✓</span>
            <p className="text-base text-[#6B6B6B]">Focuses on internal balance patterns</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-[#4A5568] font-bold mt-1">✓</span>
            <p className="text-base text-[#6B6B6B]">Explained in a simple visual format</p>
          </div>
        </motion.div>

        {/* Primary CTA Button */}
        <motion.button
          onClick={onCTAClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-4 md:py-4.5 bg-[#4A5568] text-white font-semibold text-base md:text-lg rounded-lg shadow-md hover:shadow-lg hover:bg-[#3a4553] transition-all duration-200 mb-3"
        >
          👉 Watch the Short Explanation
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
          className="text-xs md:text-sm text-[#6B6B6B]"
        >
          Educational overview • Takes 2–3 minutes
        </motion.p>
      </div>
    </motion.section>
  );
}
