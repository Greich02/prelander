'use client';

import BridgeHero from '../components/bridge/BridgeHero';
import ContextSection from '../components/bridge/ContextSection';
import CuriositySection from '../components/bridge/CuriositySection';
import FinalCTABlock from '../components/bridge/FinalCTABlock';
import ExitPopup from '../components/ExitPopup';

export default function BridgePage() {
  const handleCTA = () => {
    // Redirect to VSL/offer page
    window.location.href = 'https://www.example.com/vsl';
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
