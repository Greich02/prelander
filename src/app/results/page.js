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
    // 📱 X (Twitter) Conversion Tracking
    // ═════════════════════════════════════════════════════════
    if (typeof window !== 'undefined') {
      // Charger le script de tracking X
      if (!window.twq) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://static.ads-twitter.com/uwt.js';
        document.head.appendChild(script);
        
        // Initialiser après chargement du script
        window.twq = function() {
          (window.twq?.queue || []).push(arguments);
        };
        window.twq.version = '1.1';
        window.twq.queue = [];
      }

      // Configuration X tracking
      if (window.twq) {
        window.twq('config', 'r1bmm');
      }

      // Track que l'utilisateur a vue la page results
      if (window.twq) {
        window.twq('track', 'PageView');
        console.log('📱 X (Twitter) tracking initialized');
      }

      // ═══════════════════════════════════════════════════════
      // 🔥 X (Twitter) Conversion Event
      // ═══════════════════════════════════════════════════════
      // Fire conversion event when user reaches results page
      setTimeout(() => {
        if (window.twq) {
          window.twq('event', 'tw-r1bmm-r4i67', {
            value: null,
            currency: null,
            contents: [
              {
                content_type: null,
                content_id: null,
                content_name: null,
                content_price: null,
                num_items: null,
                content_group_id: null
              }
            ],
            conversion_id: null,
            email_address: null,
            phone_number: null
          });
          console.log('🔥 X conversion event fired: tw-r1bmm-r4i67');
        }
      }, 500); // Délai pour assurer que le script est chargé
    }
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
