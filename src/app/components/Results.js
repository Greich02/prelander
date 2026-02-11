'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Clock, TrendingUp, Star, CheckCircle, Award, Target, Zap, Heart, Brain, Shield, AlertCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { getAnalytics, EVENTS } from '@/app/utils/analytics';

export default function Results({ isVisible, onCTAClick }) {
  const [currentCount, setCurrentCount] = useState(12847);
  const [userName, setUserName] = useState('');
  const [vitalityScore, setVitalityScore] = useState(null);
  const [userInsights, setUserInsights] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [resultsStartTime] = useState(Date.now());
  const [userPattern, setUserPattern] = useState('Unknown');
  const sectionRef = useRef(null);
  const analytics = getAnalytics();
  
  const TIMER_STORAGE_KEY = 'pineal_timer_data';
  const SPOTS_STORAGE_KEY = 'pineal_spots_left';

  // ============================================================
  // SCORING SYSTEM v4 — NOUVELLE PONDÉRATION 18/14/10/4
  // ============================================================
  const MAX_RAW_SCORE = 90; // 5 questions × 18 points max
  const MIN_RAW_SCORE = 20;  // 5 questions × 4 points min
  const SCORE_CAP = 85;

  const calculateScorePercentage = (rawScore) => {
    const normalized = Math.max(0, (rawScore - MIN_RAW_SCORE) / (MAX_RAW_SCORE - MIN_RAW_SCORE));
    const curved = Math.pow(normalized, 1.2);
    return Math.min(Math.round(curved * 100), SCORE_CAP);
  };

  // QUESTIONS AVEC NOUVELLES VALEURS (18/14/10/4)
  const questions = [
    {
      "options": [
        { "text": "Deeply connected and energized", "value": 18 },
        { "text": "Searching for that spark", "value": 14 },
        { "text": "Feeling disconnected from my true energy", "value": 10 },
        { "text": "My energy varies unpredictably", "value": 4 }
      ]
    },
    {
      "options": [
        { "text": "Rarely - I feel aligned", "value": 18 },
        { "text": "Sometimes - I notice the gap", "value": 14 },
        { "text": "Often - It's frustrating", "value": 10 },
        { "text": "Always - This defines my experience", "value": 4 }
      ]
    },
    {
      "options": [
        { "text": "Most days - Clarity is my baseline", "value": 18 },
        { "text": "Some days - It comes and goes", "value": 14 },
        { "text": "Rarely - Brain fog is common", "value": 10 },
        { "text": "Unpredictably - Focus shifts constantly", "value": 4 }
      ]
    },
    {
      "options": [
        { "text": "No - I feel the same or better", "value": 18 },
        { "text": "Slightly - Small changes I've noticed", "value": 14 },
        { "text": "Yes - The difference is clear", "value": 10 },
        { "text": "Dramatically - I feel much older", "value": 4 }
      ]
    },
    {
      "options": [
        { "text": "Yes - I've always known this", "value": 18 },
        { "text": "I suspect it - But I can't prove it", "value": 14 },
        { "text": "Maybe - I'm curious to learn more", "value": 10 },
        { "text": "I'm not sure - This is new to me", "value": 4 }
      ]
    }
  ];

  // Timer sync
  useEffect(() => {
    const updateTimerFromStorage = () => {
      if (typeof window === 'undefined') return;
      
      const savedData = localStorage.getItem(TIMER_STORAGE_KEY);
      if (savedData) {
        try {
          const timerData = JSON.parse(savedData);
          const now = Math.floor(Date.now() / 1000);
          const remaining = timerData.deadline - now;
          setTimeLeft(remaining > 0 ? remaining : 0);
        } catch {
          setTimeLeft(0);
        }
      } else {
        setTimeLeft(15 * 60);
      }
    };

    updateTimerFromStorage();
    const handleStorageChange = (e) => {
      if (e.key === TIMER_STORAGE_KEY) updateTimerFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    const timer = setInterval(updateTimerFromStorage, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(timer);
    };
  }, []);

  const formatTime = (seconds) => {
    if (seconds === null || seconds < 0) return "01:46:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  // ============================================================
  // 🔥 CHARGEMENT DU SCORE — NOUVELLE PONDÉRATION 18/14/10/4
  // ============================================================
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🔍 === DÉBUT CHARGEMENT SCORE RESULTS ===');
      
      const results = JSON.parse(localStorage.getItem('quizResults') || '{}');
      console.log('📦 quizResults brut:', results);
      
      // ✅ PRIORITÉ ABSOLUE : Score de QuizStepper
      if (results.scorePercentage !== undefined && results.scorePercentage !== null) {
        setVitalityScore(results.scorePercentage);
        setUserPattern(results.userPattern || 'Unknown');
        
        console.log('✅ ===== SCORE CHARGÉ DEPUIS QUIZSTEPPER =====');
        console.log('✅ Score affiché:', results.scorePercentage + '%');
        console.log('✅ Pattern:', results.userPattern);
        console.log('✅ Score brut:', results.totalScore, '/', MAX_RAW_SCORE);
        console.log('✅ ============================================');
      } 
      // ⚠️ FALLBACK : Recalcul si QuizStepper n'a pas sauvegardé
      else {
        console.warn('⚠️ PAS DE SCORE DANS QUIZSTEPPER - RECALCUL FALLBACK');
        
        const answers = results.answers || {};
        let totalRawScore = 0;
        let questionsAnswered = 0;
        
        console.log('📝 Réponses stockées:', answers);
        
        Object.keys(answers).forEach(qIndex => {
          const question = questions[parseInt(qIndex)];
          if (question) {
            const selectedOption = question.options.find(opt => opt.text === answers[qIndex]);
            if (selectedOption?.value) {
              totalRawScore += selectedOption.value;
              questionsAnswered++;
              console.log(`Q${qIndex}: "${answers[qIndex]}" = ${selectedOption.value} pts`);
            }
          }
        });
        
        console.log('📊 Total brut:', totalRawScore, '/', MAX_RAW_SCORE);
        console.log('📊 Questions répondues:', questionsAnswered, '/5');
        
        // Appliquer la courbe v4
        const scorePercentage = calculateScorePercentage(totalRawScore);
        setVitalityScore(scorePercentage);
        
        // Déterminer le pattern
        let pattern = 'Unknown';
        if (scorePercentage <= 25) {
          pattern = 'The Disconnected Seeker';
        } else if (scorePercentage <= 45) {
          pattern = 'The Fluctuating Spirit';
        } else if (scorePercentage <= 65) {
          pattern = 'The Awakening Guardian';
        } else {
          pattern = 'The Aligned Luminary';
        }
        setUserPattern(pattern);
        
        console.log('⚠️ ===== SCORE RECALCULÉ (FALLBACK) =====');
        console.log('⚠️ Score affiché:', scorePercentage + '%');
        console.log('⚠️ Pattern:', pattern);
        console.log('⚠️ Score brut:', totalRawScore, '/', MAX_RAW_SCORE);
        console.log('⚠️ ======================================');
      }
      
      // Générer insights
      if (vitalityScore !== null) {
        generatePersonalizedInsights(vitalityScore);
      }
      
      // Nom utilisateur
      const names = ['Spiritual Seeker', 'Energy Explorer', 'Vitality Seeker', 'Awakening Soul'];
      setUserName(names[Math.floor(Math.random() * names.length)]);
      
      console.log('🔍 === FIN CHARGEMENT SCORE RESULTS ===');
    }
  }, [timeLeft]);

  const generatePersonalizedInsights = (score) => {
    let insights = [];
    
    if (score <= 25) {
      insights = [
        "Your pineal gland shows signs of significant calcification (60-70% blocked), creating the disconnection you're experiencing",
        "The gap between your youthful spirit and aging body points directly to disrupted pineal function",
        "Conventional approaches have failed because they don't address pineal decalcification",
        "With proper pineal support, people with your score typically see 40% energy improvement within 14 days"
      ];
    } else if (score <= 45) {
      insights = [
        "Your pineal gland is moderately calcified (30-50%), causing the energy fluctuations you notice",
        "The 'brain fog' you experience is a classic sign of partial pineal blockage",
        "Your body is showing early-stage spiritual aging that's completely reversible",
        "People with your pattern respond exceptionally well to pineal decalcification (87% success rate)"
      ];
    } else if (score <= 65) {
      insights = [
        "Your pineal gland has mild calcification but specific blockages are limiting your full potential",
        "You're experiencing what researchers call 'subclinical pineal dysfunction'",
        "Small optimizations to your pineal health could unlock significant vitality gains",
        "You're in the top 10% of spiritual wellness seekers - perfect foundation for breakthrough"
      ];
    } else {
      insights = [
        "Your pineal gland is functioning at an exceptionally high level",
        "You're maintaining optimal spiritual-biological alignment",
        "Fine-tuning your pineal health could unlock the remaining 15% to reach peak vitality",
        "You're in the top 2% - maintenance and protection are your focus areas"
      ];
    }
    
    setUserInsights(insights);
  };

  const getSpotsLeft = () => {
    if (typeof window === 'undefined') return 47;
    const savedSpots = localStorage.getItem(SPOTS_STORAGE_KEY);
    return savedSpots ? parseInt(savedSpots, 10) : 47;
  };

  const spotsLeft = getSpotsLeft();

  const trackCTAClick = (ctaPosition) => {
    const timeOnResults = Date.now() - resultsStartTime;
    
    analytics.track(EVENTS.RESULTS_CTA_CLICK, {
      ctaPosition: ctaPosition,
      vitalityScore: vitalityScore,
      userPattern: userPattern,
      timeOnResults: timeOnResults,
      scrollDepth: getScrollDepth(),
      timerRemaining: timeLeft,
      spotsRemaining: spotsLeft
    });
    
    console.log('CTA clicked:', ctaPosition, 'Timer remaining:', timeLeft);
  };

  const getScrollDepth = () => {
    if (typeof window === 'undefined') return 0;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    return Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
  };

  const handlePrimaryClick = (ctaPosition = 'final') => {
    trackCTAClick(ctaPosition);
    window.location.href = 'https://271c9oc3e00z2u40fe5zz7a8yu.hop.clickbank.net/?&traffic_source=twitter&traffic_type=paid';
  };

  const handleSecondaryClick = () => {
    if (confirm("Are you sure? This personalized pineal analysis took advanced algorithms to generate and expires in " + formatTime(timeLeft) + ". You may not get this exact insight again.")) {
      console.log('User declined offer');
    }
  };

  if (!isVisible) return null;

  const getTimerCycles = () => {
    if (typeof window === 'undefined') return 0;
    const savedData = localStorage.getItem(TIMER_STORAGE_KEY);
    if (!savedData) return 0;
    try {
      const data = JSON.parse(savedData);
      return data.cycles || 0;
    } catch {
      return 0;
    }
  };

  const timerCycles = getTimerCycles();

  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      location: "California",
      age: 52,
      avatar: "SM",
      color: "bg-gradient-to-br from-purple-400 to-indigo-600",
      text: "I had the EXACT same score (42/100). After decalcifying my pineal gland with Genesis Revival, I retook this assessment 3 months later - 78/100. My spirit and body finally match again.",
      role: "Vitality Seeker Pattern",
      rating: 5,
      beforeScore: 42,
      afterScore: 78
    },
    {
      id: 2,
      name: "Michael R.",
      location: "Colorado",
      age: 58,
      avatar: "MR",
      color: "bg-gradient-to-br from-emerald-400 to-teal-600",
      text: "When I learned my 'aging faster than I should' was pineal calcification, everything clicked. The natural decalcification formula gave me back vitality I thought was gone forever.",
      role: "Vitality Seeker Pattern",
      rating: 5,
      beforeScore: 38,
      afterScore: 82
    }
  ];

  const getScoreCategory = (score) => {
    if (score <= 25) return { 
      label: "High Revival Potential", 
      color: "from-rose-400 to-pink-600", 
      icon: <Zap className="w-5 h-5" />,
      pattern: "The Disconnected Seeker"
    };
    if (score <= 45) return { 
      label: "Moderate Pineal Blockage", 
      color: "from-amber-400 to-orange-500", 
      icon: <Target className="w-5 h-5" />,
      pattern: "The Fluctuating Spirit"
    };
    if (score <= 65) return { 
      label: "Strong Foundation", 
      color: "from-emerald-400 to-teal-600", 
      icon: <Sparkles className="w-5 h-5" />,
      pattern: "The Awakening Guardian"
    };
    return { 
      label: "Exceptional Vitality", 
      color: "from-blue-400 to-indigo-600", 
      icon: <Award className="w-5 h-5" />,
      pattern: "The Aligned Luminary"
    };
  };

  const scoreCategory = vitalityScore !== null ? getScoreCategory(vitalityScore) : null;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-10 md:py-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-white to-amber-50/30 rounded-2xl p-6 md:p-10 shadow-2xl shadow-amber-900/5 border border-amber-200 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-purple-200/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full translate-y-12 -translate-x-12"></div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 relative z-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border-2 border-rose-300 shadow-lg relative">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Clock className="w-6 h-6 text-rose-600" />
              </motion.div>
              <div className="text-left">
                <div className="text-xs font-semibold text-rose-800 uppercase tracking-wide">
                  Your Personalized Analysis Reserved For:
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-rose-700 tabular-nums">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-sm text-rose-600 font-medium">
                    {timeLeft !== null && timeLeft >= 3600 ? 'hours' : 'minutes'}
                  </span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-50/50 rounded-full border border-amber-300">
              <Users className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                {spotsLeft} personalized spots left
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-8 relative z-10"
          >
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3.5xl font-serif font-bold text-gray-900 mb-3 leading-tight">
              {userName}, Your Spiritual Anti-Aging Pattern:{" "}
              <span className="text-amber-700">{scoreCategory?.pattern || "Loading..."}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Based on your unique energy responses, we've identified why you're aging faster than you should—and how to reverse it
            </p>
          </motion.div>

          {/* 🔥 SCORE DE VITALITÉ — NOUVELLE PONDÉRATION 18/14/10/4 */}
          {vitalityScore !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-10 relative z-10"
            >
              <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-8 border-2 border-amber-200/50 shadow-lg">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    Your Spiritual Vitality Score
                  </h3>
                  <p className="text-gray-600">Indicates level of pineal gland calcification</p>
                </div>
                
                <div className="flex justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="84" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                      <motion.circle
                        cx="96" cy="96" r="84"
                        stroke="url(#score-gradient)"
                        strokeWidth="12" fill="none" strokeLinecap="round"
                        initial={{ strokeDasharray: "0 528" }}
                        animate={{ strokeDasharray: `${(vitalityScore / 100) * 528} 528` }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex items-center justify-center gap-1"
                      >
                        <span className="text-5xl font-bold bg-gradient-to-br from-amber-600 to-pink-600 bg-clip-text text-transparent">
                          {vitalityScore}
                        </span>
                        <span className="text-5xl font-bold bg-gradient-to-br from-amber-600 to-pink-600 bg-clip-text text-transparent">
                          %
                        </span>
                      </motion.div>
                      
                      {scoreCategory && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 1 }}
                          className={`mt-2 px-4 py-1 rounded-full bg-gradient-to-r ${scoreCategory.color} text-white text-sm font-semibold flex items-center gap-2`}
                        >
                          {scoreCategory.icon}
                          {scoreCategory.label}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 🔥 MESSAGES ADAPTÉS AUX NOUVEAUX SEUILS AVEC INTERPRÉTATIONS RÉALISTES */}
                <div className="text-center max-w-full w-full mx-auto">
                  <p className="text-gray-700 mb-4">
                    <span className="font-semibold text-gray-900">What this means:</span>{" "}
                    Your score of {vitalityScore}% indicates{" "}
                    {vitalityScore <= 25 ? "significant pineal calcification (60-70% blocked). Your 'disconnected seeker' pattern is common among those with high spiritual awareness but blocked biological receptors. The gap between your inner youth and outer aging is a direct result of this calcification." :
                    vitalityScore <= 45 ? "moderate pineal blockage (30-50%). Your 'fluctuating spirit' pattern explains why your energy comes in waves. You have good days and bad days because your pineal gland is partially blocked—sometimes signals get through, sometimes they don't." :
                    vitalityScore <= 65 ? "mild calcification with specific blockages limiting your full potential. Your 'awakening guardian' pattern shows you've maintained decent pineal health, but targeted blockages are preventing the breakthrough vitality you're capable of." :
                    "exceptional pineal function with minimal calcification. Your 'aligned luminary' pattern puts you in the top 8% of the population. You're not here to fix major issues—you're here to unlock the final 15% to reach peak spiritual-biological alignment."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          {/* SECTION RÉVÉLATION PINÉALE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-10 relative z-10"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                🔬 What Your Results <span className="text-purple-700">Really</span> Mean
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Based on your {scoreCategory?.pattern} pattern (Score: {vitalityScore}/100), your symptoms point to a specific biological-spiritual issue
              </p>
            </div>

            {/* RÉVÉLATION PRINCIPALE */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50/30 to-pink-50/20 rounded-2xl p-8 border-2 border-purple-200 mb-8">
              <div className="text-center mb-6">
                <h4 className="text-3xl font-bold text-gray-900 mb-4">
                  YOUR PINEAL GLAND IS LIKELY <span className="text-purple-700">CALCIFIED</span>
                </h4>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6"></div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8 flex justify-center"
              >
                <div className="bg-white/80 rounded-2xl p-6 border-2 border-purple-300 w-full max-w-md">
                  <img 
                    src="/pineal.png" 
                    alt="Pineal gland - healthy vs calcified comparison"
                    className="w-full h-full mx-auto rounded-xl"
                  />
                  <p className="text-xs text-center text-gray-600 mt-3 italic my-2">
                    Scientific illustration: Pineal gland before and after calcification
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-6"
              >
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border-2 border-rose-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-rose-600 animate-pulse" />
                      <div>
                        <div className="text-sm font-semibold text-rose-800">Same Timer as Quiz</div>
                        <div className="text-xs text-rose-700">Expires in: {formatTime(timeLeft)}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-rose-700 tabular-nums">
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/60 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <span className="text-2xl">🕉️</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Ancient Wisdom</div>
                      <div className="text-sm text-gray-600">Spiritual Traditions</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    For thousands of years, spiritual traditions called this tiny organ in your brain the <span className="font-semibold italic">"third eye"</span> and <span className="font-semibold italic">"seat of the soul"</span>—your connection to vitality, clarity, and timeless energy.
                  </p>
                </div>

                <div className="bg-white/60 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                      <span className="text-2xl">🔬</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Modern Science</div>
                      <div className="text-sm text-gray-600">Recent Research</div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Modern science now confirms: The <span className="font-semibold">pineal gland</span> regulates <span className="font-semibold">cellular aging, energy production, mental clarity,</span> and spiritual connection at the biological level.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl p-6 border-l-4 border-rose-500 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-bold text-gray-900 mb-2 text-lg">Here's the Problem:</h5>
                    <p className="text-gray-800 leading-relaxed mb-3">
                      By age 40, up to <span className="font-bold text-rose-700">73% of people have CALCIFIED pineal glands</span>—literally hardened with calcium deposits and environmental toxins (fluoride, heavy metals, synthetic chemicals).
                    </p>
                    <p className="text-gray-800 leading-relaxed">
                      When your pineal gland is blocked, you experience <span className="font-semibold">EXACTLY</span> what you described in your assessment:
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4 border border-gray-200">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <p className="text-gray-700">Waking up <span className="font-semibold">disconnected from youthful energy</span></p>
                </div>
                <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4 border border-gray-200">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Spirit feeling younger</span> than body allows</p>
                </div>
                <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4 border border-gray-200">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Accelerated physical aging</span> (faster than it should)</p>
                </div>
                <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4 border border-gray-200">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <p className="text-gray-700"><span className="font-semibold">Brain fog and mental decline</span></p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-6 border-l-4 border-emerald-500">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-bold text-gray-900 mb-2 text-lg">The Good News:</h5>
                    <p className="text-gray-800 leading-relaxed">
                      This isn't <span className="font-semibold">"just getting older."</span> This is <span className="font-bold text-emerald-700">pineal calcification</span>—and recent science discovered it's <span className="font-bold text-emerald-700 uppercase">REVERSIBLE</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-10"
            >
              <button
                onClick={() => handlePrimaryClick('after_revelation')}
                className="w-full max-w-lg mx-auto block px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
              >
                <span className="flex items-center justify-center gap-2">
                  🔬 See the Solution That Reverses This
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <div className="flex items-center justify-center gap-3 mt-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-rose-500" />
                  Timer: {formatTime(timeLeft)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-amber-500" />
                  {spotsLeft} spots left
                </span>
              </div>
            </motion.div>

            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-8 border-2 border-blue-200 mb-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                  💡 The 9-Compound Breakthrough
                </h4>
                <p className="text-gray-600">Researchers discovered how to reverse pineal calcification naturally</p>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 mb-6">
                <p className="leading-relaxed mb-4">
                  Researchers at the Institute of Cellular Aging discovered that <span className="font-semibold text-gray-900">9 specific natural compounds</span>, when combined in precise ratios, can:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 border border-blue-200 text-center">
                  <div className="text-3xl mb-3">🧹</div>
                  <h5 className="font-bold text-gray-900 mb-2">DECALCIFY</h5>
                  <p className="text-sm text-gray-600">Remove toxic calcium buildup</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-blue-200 text-center">
                  <div className="text-3xl mb-3">🛡️</div>
                  <h5 className="font-bold text-gray-900 mb-2">PROTECT</h5>
                  <p className="text-sm text-gray-600">Prevent future calcification</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-blue-200 text-center">
                  <div className="text-3xl mb-3">⚡</div>
                  <h5 className="font-bold text-gray-900 mb-2">RESTORE</h5>
                  <p className="text-sm text-gray-600">Rebuild youthful function</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50/30 rounded-xl p-6 border border-amber-200">
                <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  People with your exact {scoreCategory?.pattern} pattern who decalcified their pineal glands reported:
                </h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700"><span className="font-semibold">40% increase</span> in morning energy within 14 days</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Mental clarity returning to <span className="font-semibold">"youthful" baseline</span></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Feeling of <span className="font-semibold">spirit-body reconnection</span></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">Physical aging markers <span className="font-semibold">slowing or reversing</span></p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-10"
            >
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 rounded-xl p-5 border-2 border-emerald-200">
                <div className="text-center mb-4">
                  <p className="text-gray-800 font-semibold mb-2">
                    Want these exact results? Get the same 9-compound formula:
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-500" />
                      {formatTime(timeLeft)} remaining
                    </span>
                    •
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-amber-500" />
                      {spotsLeft} reserved spots
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handlePrimaryClick('after_compounds')}
                  className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    ⚡ Get These 9 Compounds Now
                    <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </span>
                </button>
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    365-Day Guarantee
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    Same Day Shipping
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* WHAT THIS MEANS FOR YOU */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-10 relative z-10"
          >
            <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-xl p-6 border border-amber-200 mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-600" />
                What This Means For You Specifically
              </h4>
              <div className="space-y-4">
                {userInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 1 + (index * 0.1) }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-gray-700">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Reste du JSX identique - témoignages, Genesis Revival, objections, CTA final, etc. */}
          {/* Pour économiser des tokens, je coupe ici mais dans le fichier final, tout le JSX reste */}
          
          {/* SOCIAL PROOF - TÉMOIGNAGES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mb-10 relative z-10"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                People With Your Pattern Say
              </h3>
              <p className="text-gray-600">Real results from {scoreCategory?.pattern} types</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-5 shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-bold text-gray-900">{testimonial.name}, {testimonial.age}</h4>
                          <p className="text-sm text-gray-600">{testimonial.location}</p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-amber-700 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 italic mb-4 text-sm leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">Before Genesis Revival:</span>
                        <span className="font-bold text-rose-700">{testimonial.beforeScore}/100</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-rose-400 to-red-500 rounded-full" style={{ width: `${testimonial.beforeScore}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">After 90 Days:</span>
                        <span className="font-bold text-emerald-700">{testimonial.afterScore}/100</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: `${testimonial.afterScore}%` }}></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Improvement:</span>
                        <span className="font-bold text-emerald-700">+{testimonial.afterScore - testimonial.beforeScore} points ({Math.round(((testimonial.afterScore - testimonial.beforeScore) / testimonial.beforeScore) * 100)}%)</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50/30 rounded-xl p-5 border border-amber-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{currentCount.toLocaleString()}+</div>
                  <div className="text-sm text-gray-700">Pineal glands decalcified</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                  <div className="text-sm text-gray-700">Average satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">94%</div>
                  <div className="text-sm text-gray-700">Report feeling "reconnected"</div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-xl p-6 border border-amber-300 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-amber-600" />
                  <p className="text-base font-semibold text-gray-800">
                    Join 12,847+ people who reversed their pineal calcification
                  </p>
                </div>
                <div className="mb-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-3 border border-rose-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Your timer:</span>
                    <span className="font-bold text-rose-700">{formatTime(timeLeft)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handlePrimaryClick('after_testimonials')}
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    🌟 Start My Decalcification Journey
                    <Star className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                </button>
                <p className="text-xs text-gray-600 mt-3">
                  Same {scoreCategory?.pattern} pattern as you • 94% success rate • {spotsLeft} spots at this price
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* LA SOLUTION : GENESIS REVIVAL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mb-10 relative z-10"
          >
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50/30 rounded-2xl p-8 border-2 border-purple-200">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-4"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                  className="mb-6 flex justify-center"
                >
                  <img 
                    src="/product.avifs"
                    alt="Genesis Revival - Pineal Decalcification Supplement"
                    className="w-64 h-auto drop-shadow-2xl"
                  />
                </motion.div>

                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  🌟 Introducing: <span className="text-purple-700">GENESIS REVIVAL</span>
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  The only scientifically-formulated pineal support supplement containing all 9 compounds in the exact ratios proven to decalcify and restore youthful pineal function
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/80 rounded-xl p-6 border border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    What You're Getting:
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700"><span className="font-semibold">Pineal Decalcification Complex</span> (removes toxic buildup)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700"><span className="font-semibold">Protective Antioxidant Blend</span> (prevents future damage)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700"><span className="font-semibold">Cellular Regeneration Support</span> (restores function)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">100% Natural, Non-GMO, Third-Party Tested</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 rounded-xl p-6 border border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    How It Works:
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">1</div>
                      <p className="text-gray-700">Take <span className="font-semibold">2 capsules daily</span> (preferably morning)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">2</div>
                      <p className="text-gray-700">Notice <span className="font-semibold">energy shifts within 7-14 days</span></p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">3</div>
                      <p className="text-gray-700">Experience <span className="font-semibold">full reconnection over 90 days</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-6 border-l-4 border-emerald-500 mb-6">
                <h4 className="font-bold text-gray-900 mb-3">This Isn't Like Other Supplements:</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>❌ This isn't meditation you have to master</p>
                  <p>❌ This isn't a restrictive diet you have to follow perfectly</p>
                  <p>❌ This isn't exercise you have to force yourself to do</p>
                  <p className="pt-2 text-emerald-800 font-semibold">✅ This is 2 capsules per day that work at the ROOT CAUSE—your pineal gland</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* OBJECTION HANDLING */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mb-10 relative z-10"
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-xl p-6 border border-blue-200">
              <h4 className="font-bold text-gray-900 mb-6 text-center text-lg">Common Questions from {scoreCategory?.pattern} Types:</h4>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-5 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">?</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-2">"Will this actually work for MY specific pattern?"</h5>
                      <p className="text-gray-700 text-sm">
                        ✅ Yes. Genesis Revival is formulated for all vitality patterns. Your {scoreCategory?.pattern} type responds especially well (94% satisfaction rate among your pattern).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">?</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-2">"How is this different from other supplements?"</h5>
                      <p className="text-gray-700 text-sm">
                        ✅ Most supplements don't target the pineal gland at all. Genesis Revival contains the ONLY combination of 9 compounds scientifically proven to decalcify it.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">?</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-2">"How long until I feel changes?"</h5>
                      <p className="text-gray-700 text-sm">
                        ✅ Most {scoreCategory?.pattern} types notice energy shifts within 7-14 days. Full spiritual-biological reconnection unfolds over 90 days as calcification reverses.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border border-emerald-100 border-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-2">"What if it doesn't work for me?"</h5>
                      <p className="text-gray-700 text-sm">
                        ✅ Genesis Revival comes with an ironclad <span className="font-bold text-emerald-700">365-DAY money-back guarantee</span>. If you don't feel the reconnection, return it for a full refund. No questions asked. You literally have a full year to decide.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* URGENCE FINALE + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="mb-8 relative z-10"
          >
            <div className="bg-gradient-to-r from-rose-100 via-pink-100 to-orange-100 rounded-xl p-6 border-2 border-rose-300 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Clock className="w-6 h-6 text-rose-600 animate-pulse" />
                  <h4 className="text-xl font-bold text-gray-900">
                    ⏰ Your Personalized Supply is Reserved
                  </h4>
                </div>
                <p className="text-gray-700 mb-4">
                  Based on your {scoreCategory?.pattern} assessment (Score: {vitalityScore}/100), we've reserved a 90-day supply of Genesis Revival specifically for people with your pattern.
                </p>
                <div className="inline-block bg-white rounded-lg px-6 py-3 border-2 border-rose-400 shadow-lg">
                  <div className="text-sm text-gray-600 mb-1">This reservation expires in:</div>
                  <div className="text-3xl font-bold text-rose-600 tabular-nums">{formatTime(timeLeft)}</div>
                  {timerCycles > 0 && (
                    <div className="text-xs text-rose-600 mt-1">
                      ⚠️ Timer reduced by {timerCycles * 15} minutes total
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-4 italic">
                  After expiration, your spot may be given to someone else on the waitlist
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 rounded-xl p-6 border border-amber-200 mb-6">
              <h4 className="font-bold text-gray-900 mb-4 text-center">Here's What Happens Next:</h4>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">1</div>
                  <p className="text-sm text-gray-700">Click below to claim your reserved supply</p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">2</div>
                  <p className="text-sm text-gray-700">Start your 2 capsules daily (takes 10 seconds)</p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">3</div>
                  <p className="text-sm text-gray-700">Notice energy reconnection within 7-14 days</p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">4</div>
                  <p className="text-sm text-gray-700">Experience full vitality restoration over 90 days</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA FINAL */}
          <div className="space-y-4 relative z-10">
            <motion.button
              onClick={() => handlePrimaryClick('final')}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -5px rgba(120, 40, 200, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-8 py-6 bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-3">
                🔥 ACCESS MY PERSONALIZED GENESIS REVIVAL SUPPLY
                <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.button>

            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="flex flex-col items-center gap-1">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-700 font-medium">365-Day Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-gray-700 font-medium">Ships Same Day</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Heart className="w-5 h-5 text-rose-500" />
                <span className="text-gray-700 font-medium">12,847+ Happy Users</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.9 }}
              className="text-center pt-4"
            >
              <div className="mb-3 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
                <div className="flex items-center justify-center gap-2 text-sm text-rose-700">
                  <Clock className="w-4 h-4" />
                  <span>Your timer: <span className="font-bold">{formatTime(timeLeft)}</span> • <span className="font-bold">{spotsLeft}</span> spots left at this price</span>
                </div>
              </div>
              <button
                onClick={handleSecondaryClick}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200 hover:border-gray-300"
              >
                No thanks, I'll try to decalcify my pineal gland myself
              </button>
              <p className="text-xs text-gray-400 mt-3 px-4">
                ⚠️ Warning: DIY pineal decalcification can take 18-24 months. Genesis Revival accelerates this to 90 days.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </>
  );
}