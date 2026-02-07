'use client';

import { useState, useEffect } from 'react';
import BridgeHero from '../components/bridge/BridgeHero';
import ContextSection from '../components/bridge/ContextSection';
import CuriositySection from '../components/bridge/CuriositySection';
import FinalCTABlock from '../components/bridge/FinalCTABlock';
import ExitPopup from '../components/ExitPopup';
import { getAnalytics, EVENTS } from '@/app/utils/analytics';

export default function BridgePage() {
  const [bridgeStartTime] = useState(Date.now());
  const analytics = getAnalytics();

  // Track bridge page view
  useEffect(() => {
    analytics.track(EVENTS.BRIDGE_VIEW, {
      referrer: 'results_page',
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleCTA = () => {
    const timeOnBridge = Date.now() - bridgeStartTime;
    
    // Track bridge CTA click
    analytics.track(EVENTS.BRIDGE_CTA_CLICK, {
      timeOnBridge: timeOnBridge,
      scrollDepth: getScrollDepth(),
      timestamp: new Date().toISOString()
    });
    
    // Redirect to VSL/offer page
    window.location.href = 'https://www.example.com/vsl';
  };

  const getScrollDepth = () => {
    if (typeof window === 'undefined') return 0;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    return Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
  };

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <BridgeHero onCTAClick={handleCTA} />
      <ContextSection />
      <CuriositySection />
      <FinalCTABlock onCTAClick={handleCTA} />
      <ExitPopup />
    </main>
  );
}
