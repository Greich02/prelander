'use client';

import { motion } from 'framer-motion';

export default function DividerImage() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full h-64 bg-gradient-to-b from-[#F8F6F2] via-[#E8E4DC] to-[#F8F6F2] my-12"
    >
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-white opacity-20" />
      </div>
    </motion.section>
  );
}
