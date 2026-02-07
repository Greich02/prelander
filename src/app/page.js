'use client';

import Hero from './components/Hero';
import Reassurance from './components/Reassurance';
import QuizStepper from './components/QuizStepper';
import ExitPopup from './components/ExitPopup';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <main className="w-full flex flex-col items-center">
        {/* Hero Section - Compact */}
        <Hero />

        {/* Reassurance Strip - No extra padding 
        <Reassurance /> */}

        {/* Quiz Section - No gap, immediately visible 
        <QuizStepper /> */}
      </main>
      <ExitPopup />
    </div>
  );
}
