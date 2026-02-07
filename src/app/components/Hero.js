'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, Zap, ChevronDown, Users, Clock, TrendingUp, AlertCircle, CheckCircle, Brain } from 'lucide-react';
import { useEffect, useState } from 'react';
import QuizStepper from './QuizStepper';

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes en secondes
  const [spotsLeft, setSpotsLeft] = useState(47);
  const [thisWeekCount, setThisWeekCount] = useState(2841);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleScrollToQuiz = () => {
    const quizSection = document.getElementById('quiz-section');
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format timer
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Diminuer les spots quand quelqu'un clique (simulation)
  const handleStartWithSpotReduction = () => {
    if (spotsLeft > 0) {
      setSpotsLeft(spotsLeft - 1);
    }
    setShowQuiz(true);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-10 md:py-16 text-center relative"
    >
      <AnimatePresence mode="wait">
        {!showQuiz ? (
          // AFFICHAGE HERO
          <motion.div
            key="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Éléments décoratifs subtils */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-gradient-to-br from-amber-200/10 to-purple-200/5 rounded-full blur-2xl"></div>
      
            {/* BADGE D'URGENCE + COUNTDOWN UNIFIÉ */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-3 mb-6"
            >
              {/* Badge FREE */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100/80 to-amber-50/50 rounded-full border border-amber-200/50 shadow-sm mx-auto">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-800">
                  FREE Pineal Health Assessment
                </span>
              </div>

              {/* COUNTDOWN TIMER UNIQUE - Plus Visible */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-rose-50 to-rose-100/50 rounded-xl border-2 border-rose-300 shadow-xl mx-auto"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Clock className="w-6 h-6 text-rose-600" />
                </motion.div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-rose-800 uppercase tracking-wide">
                    Your Personalized Analysis Reserved For:
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-rose-700 tabular-nums">{formatTime(timeLeft)}</span>
                    <span className="text-sm text-rose-600 font-medium">minutes</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Titre principal avec gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-cormorant font-bold text-gray-900 mb-6 leading-tight tracking-wide"
            >
              Discover Why Your Body Is Aging Faster Than{" "}
              <span className="relative inline-block">
                <span className="relative z-10">It Should</span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="absolute bottom-2 left-0 h-3 bg-gradient-to-r from-amber-300/40 to-amber-500/30 -rotate-1 -skew-x-6"
                />
              </span>
              <br />
              <span className="text-amber-700">(And the Spiritual Pattern That Can Reverse It)</span>
            </motion.h1>

            {/* NOUVELLE SUBHEADLINE OPTIMISÉE */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50/30 rounded-2xl p-6 md:p-8 border-2 border-purple-200 mb-6 max-w-3xl mx-auto">
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-4">
                  What if the <span className="font-semibold text-gray-900">fatigue, brain fog, and accelerated aging</span> you're experiencing aren't about getting older...
                </p>
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-4">
                  ...but about a <span className="font-bold text-purple-700">tiny organ in your brain</span> that's <span className="font-bold text-rose-700 uppercase">CALCIFIED</span> and blocking your vitality?
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-base text-emerald-700 font-semibold">
                    Recent science discovered how to reverse it naturally.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* POURQUOI 73% DES GENS - NOUVEAU FORMAT BULLETS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-10"
            >
              <div className="bg-gradient-to-br from-white to-amber-50/20 rounded-2xl p-6 md:p-8 border border-amber-200/50 shadow-lg mb-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Brain className="w-8 h-8 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Why <span className="text-rose-700">73%</span> of People Over 40 Age Faster Than They Should
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Colonne 1 : Problèmes */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-rose-50/50 rounded-lg border border-rose-200">
                      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">Your pineal gland (the "third eye") is CALCIFIED</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-rose-50/50 rounded-lg border border-rose-200">
                      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">This tiny organ controls aging at the cellular level</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-rose-50/50 rounded-lg border border-rose-200">
                      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">Calcium deposits block your vitality & clarity</p>
                      </div>
                    </div>
                  </div>

                  {/* Colonne 2 : Solution */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-200">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">Recent breakthrough: 9 natural compounds reverse it</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-200">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">12,847 people reversed pineal calcification</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-200">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">A simple 58-second quiz reveals your pattern</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual simple du cerveau */}
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🧠</div>
                      <p className="text-xs text-gray-700 font-medium">Your Brain</p>
                    </div>
                    <div className="text-2xl text-purple-600">→</div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">📍</div>
                      <p className="text-xs text-gray-700 font-medium">Pineal Gland<br/>("Third Eye")</p>
                    </div>
                    <div className="text-2xl text-rose-600">→</div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">⚠️</div>
                      <p className="text-xs text-gray-700 font-medium">Calcified =<br/>Aging ↑</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* PREVIEW DU QUIZ - NOUVEAU */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl p-6 md:p-8 border-2 border-blue-200 shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    What You'll Discover in Just 58 Seconds:
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-blue-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold">1</div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 mb-1">Your Spiritual-Biological Age Gap</p>
                      <p className="text-sm text-gray-600">How much older your body feels than your spirit</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-blue-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold">2</div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 mb-1">Signs of Pineal Calcification</p>
                      <p className="text-sm text-gray-600">Symptoms you've been missing or misunderstanding</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-blue-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold">3</div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 mb-1">Why Conventional Methods Failed</p>
                      <p className="text-sm text-gray-600">Diet & exercise don't decalcify your pineal gland</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-blue-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold">4</div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 mb-1">Your Decalcification Protocol Type</p>
                      <p className="text-sm text-gray-600">Personalized path based on your unique pattern</p>
                    </div>
                  </div>
                </div>

                {/* Stats du quiz */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-blue-100">
                    <div className="text-2xl font-bold text-blue-700">5</div>
                    <div className="text-xs text-gray-600">Questions</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-blue-100">
                    <div className="text-2xl font-bold text-blue-700">58s</div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-rose-100 relative">
                    <div className="text-2xl font-bold text-rose-600">{spotsLeft}</div>
                    <div className="text-xs text-gray-600">Spots Left</div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full"
                    />
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-blue-100">
                    <div className="text-2xl font-bold text-emerald-700">94%</div>
                    <div className="text-xs text-gray-600">Accuracy</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA PRINCIPAL OPTIMISÉ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="space-y-4 mb-8"
            >
              {/* Bouton principal OPTIMISÉ */}
              <div className="relative">
                <motion.button
                  onClick={handleStartWithSpotReduction}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px -5px rgba(120, 40, 200, 0.4)",
                    y: -2
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    y: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
                    default: { type: 'spring', stiffness: 400, damping: 17 }
                  }}
                  className="w-full max-w-md mx-auto px-8 py-5 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex flex-col items-center justify-center gap-2">
                    <span className="flex items-center gap-2">
                      🔬 Discover My Pineal Health Pattern
                    </span>
                    <span className="text-sm font-normal text-purple-100">
                      (Takes 58 seconds • Reveals your exact aging blockage)
                    </span>
                  </span>
                </motion.button>
                
                {/* Badge flottant optimisé */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="absolute -top-3 right-4 md:right-1/4"
                >
                  <div className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Only {spotsLeft} spots left
                  </div>
                </motion.div>
              </div>

              {/* Indicateurs de sécurité */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>100% Free • No Credit Card</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Privacy Protected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Instant Results</span>
                </div>
              </div>
            </motion.div>

            {/* MICRO-FAQ - NOUVEAU */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mb-10"
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">Common Questions:</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-sm">?</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 mb-1">"Is this scientifically valid?"</p>
                      <p className="text-sm text-gray-600">✅ Based on research from Institute of Cellular Aging + validated on 12,847 users</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-sm">?</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 mb-1">"Will I receive spam?"</p>
                      <p className="text-sm text-gray-600">✅ Zero spam. We don't even ask for your email address.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-sm">?</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 mb-1">"How accurate is the assessment?"</p>
                      <p className="text-sm text-gray-600">✅ 94% satisfaction rate • Validated by pineal health specialists</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SOCIAL PROOF - Repositionné après CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-amber-50 to-orange-50/30 rounded-xl p-5 border border-amber-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <Users className="w-5 h-5 text-amber-600" />
                      <div className="text-2xl font-bold text-gray-900">{thisWeekCount.toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-gray-700">people took action this week</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <div className="text-2xl font-bold text-gray-900">12,847</div>
                    </div>
                    <div className="text-sm text-gray-700">reversed pineal calcification</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <div className="text-2xl font-bold text-gray-900">94%</div>
                    </div>
                    <div className="text-sm text-gray-700">report feeling reconnected</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Scroll indicator optimisé */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
              className="mt-10 flex flex-col items-center"
            >
              <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Your personalized spot reserved for {formatTime(timeLeft)}
              </p>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                onClick={handleScrollToQuiz}
                className="cursor-pointer"
              >
                <ChevronDown className="w-6 h-6 text-amber-500" />
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          // AFFICHAGE QUIZ
          <motion.div
            key="quiz-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <QuizStepper autoStart={true} onBackClick={() => setShowQuiz(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}