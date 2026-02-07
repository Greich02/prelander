'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Results from '../components/Results';
import ExitPopup from '../components/ExitPopup';

export default function ResultsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2] flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl mx-auto px-6 py-16 md:py-20"
        >
          <Results isVisible={true} />
        </motion.div>
      </div>
      <ExitPopup />
    </main>
  );
}
