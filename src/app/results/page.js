'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Results from '../components/Results';
import ExitPopup from '../components/ExitPopup';

export default function ResultsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // GOOGLE ANALYTICS - RESULTS VIEW EVENT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'results_view', {
        vitalityScore: 50,
        userPattern: 'The Fluctuating Spirit',
        timestamp: new Date().toISOString(),
        timerRemaining: 6255
      });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // REDDIT PIXEL - PAGEVISIT (RESULTS PAGE)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function waitForRedditAndTrack(attempt = 0) {
      if (typeof window !== 'undefined' && window.rdt) {
        try {
          // Track ViewContent event (user viewed results)
          window.rdt('track', 'ViewContent', {
            content_type: 'results_page',
            content_name: 'Quiz Results',
            value: 79.00,
            currency: 'USD'
          });
          console.log('✅ Reddit ViewContent tracked on Results page');
        } catch (error) {
          console.error('❌ Reddit tracking error:', error);
        }
      } else if (attempt < 10) {
        // Retry up to 10 times (5 seconds total)
        setTimeout(() => waitForRedditAndTrack(attempt + 1), 500);
      } else {
        console.warn('⚠️ Reddit Pixel not loaded after 5s - check layout.jsx');
      }
    }

    waitForRedditAndTrack();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // X PIXEL - PAGEVIEW + CUSTOM EVENT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function waitForTwqAndTrack(attempt = 0) {
      if (typeof window !== 'undefined' && window.twq && window.twq.version) {
        try {
          window.twq('track', 'PageView');
          
          // Custom event with value
          window.twq('event', 'tw-r1bmm-r4i67', {
            value: 5.00,
            currency: 'USD'
          });
        } catch (error) {
          console.error('❌ X tracking error:', error);
        }
      } else if (attempt < 10) {
        setTimeout(() => waitForTwqAndTrack(attempt + 1), 500);
      } else {
        console.warn('⚠️ X Pixel not loaded after 5s - check layout.jsx');
      }
    }

    waitForTwqAndTrack();
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