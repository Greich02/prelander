'use client';

import { motion } from 'framer-motion';

export default function Reassurance() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      className="w-full max-w-md mx-auto px-6 pb-12 md:pb-16"
    >
      <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <span className="text-xl text-[#4A5568] font-bold pt-0.5 flex-shrink-0">✔</span>
            <p className="text-[#1F1F1F] font-medium text-sm md:text-base">Takes about 60 seconds</p>
          </div>
          
          <div className="flex items-start gap-2.5">
            <span className="text-xl text-[#4A5568] font-bold pt-0.5 flex-shrink-0">✔</span>
            <p className="text-[#1F1F1F] font-medium text-sm md:text-base">No email required</p>
          </div>
          
          <div className="flex items-start gap-2.5">
            <span className="text-xl text-[#4A5568] font-bold pt-0.5 flex-shrink-0">✔</span>
            <p className="text-[#1F1F1F] font-medium text-sm md:text-base">Instant insights</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
