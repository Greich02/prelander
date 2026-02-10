'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Results from '../components/Results';
import ExitPopup from '../components/ExitPopup';

export default function ResultsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // ═════════════════════════════════════════════════════════
    // 📱 X (Twitter) PIXEL TRACKING - VERSION JAVASCRIPT
    // ═════════════════════════════════════════════════════════
    
    const trackPageView = () => {
      if (typeof window !== 'undefined' && window.twq) {
        try {
          // Track PageView standard
          window.twq('track', 'PageView');
          console.log('✅ X PageView tracked on Results page');
          
          // Track custom event (optionnel - si configuré dans X Ads)
          // Décommenter seulement si tw-r1bmm-r4i67 existe dans votre Events Manager
          /*
          window.twq('event', 'tw-r1bmm-r4i67', {
            content_name: 'Quiz Results',
            content_type: 'page_view'
          });
          console.log('✅ X custom event tracked: tw-r1bmm-r4i67');
          */
          
        } catch (error) {
          console.error('❌ X tracking error:', error);
        }
      } else {
        console.warn('⚠️ X Pixel not loaded - check layout.jsx installation');
      }
    };

    // Délai pour assurer que pixel est chargé
    const timer = setTimeout(trackPageView, 1000);
    
    return () => clearTimeout(timer);
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