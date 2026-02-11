'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, Zap, Star, Award, ChevronRight, Clock, Brain, AlertCircle } from 'lucide-react';
import { getAnalytics, EVENTS } from '@/app/utils/analytics';

// ============================================================
// SCORING SYSTEM v2 — Asymétrique + Courbe dégressive + Cap 91%
// ============================================================
// Philosophie :
//   - La meilleure réponse (option 1) vaut 10 pts → rare, difficile à accumuler
//   - Les options intermédiaires valent 4-5 pts → écart massif avec le top
//   - Les options "problème" valent 1-2 pts → creusent vite le déficit
//   - Score brut passé dans une courbe x^1.4 qui écrase les moyens vers le bas
//   - Plafond dur à 91% même si score brut = max
//
// Exemples de résultats :
//   Tout au max (10×5=50)       → 91% (cap)
//   Profil "bon" (8+8+10+8+8)   → ~74%
//   Profil mixte (5+4+4+4+4)    → ~28%
//   Profil moyen (4+4+4+4+4)    → ~24%
//   Profil bas (2+1+2+1+2)      → ~5%
//   Tout au min (1+1+1+1+1)     → ~2%
// ============================================================

const questions = [
  {
    "question": "When you wake up, how connected do you feel to your inner vitality and youthful energy?",
    "options": [
      { 
        "text": "Deeply connected and energized", 
        "description": "You wake with natural vitality flowing through you",
        "value": 10
      },
      { 
        "text": "Searching for that spark", 
        "description": "You sense the energy is there, just harder to access",
        "value": 5
      },
      { 
        "text": "Feeling disconnected from my true energy", 
        "description": "Your body feels older than your spirit knows you are",
        "value": 2
      },
      { 
        "text": "My energy varies unpredictably", 
        "description": "Some mornings feel youthful, others feel aged",
        "value": 3
      }
    ]
  },
  {
    "question": "Does your spirit feel younger than your body allows you to be?",
    "options": [
      { 
        "text": "Rarely - I feel aligned", 
        "description": "Your inner age and outer experience are in harmony",
        "value": 10
      },
      { 
        "text": "Sometimes - I notice the gap", 
        "description": "This disconnect appears occasionally",
        "value": 4
      },
      { 
        "text": "Often - It's frustrating", 
        "description": "You feel trapped in a body that doesn't match your spirit's vitality",
        "value": 2
      },
      { 
        "text": "Always - This defines my experience", 
        "description": "The gap between your true self and physical reality is constant",
        "value": 1
      }
    ]
  },
  {
    "question": "How often does your mind feel sharp, clear, and ageless?",
    "options": [
      { 
        "text": "Most days - Clarity is my baseline", 
        "description": "Your mental vitality remains youthful and vibrant",
        "value": 10
      },
      { 
        "text": "Some days - It comes and goes", 
        "description": "Mental clarity fluctuates",
        "value": 4
      },
      { 
        "text": "Rarely - Brain fog is common", 
        "description": "Mental aging is showing up more than you'd like",
        "value": 1
      },
      { 
        "text": "Unpredictably - Focus shifts constantly", 
        "description": "Your cognitive energy feels unstable and aged",
        "value": 2
      }
    ]
  },
  {
    "question": "Compared to 5-10 years ago, does your body feel like it's aging faster than it should?",
    "options": [
      { 
        "text": "No - I feel the same or better", 
        "description": "You're maintaining or reversing your biological age",
        "value": 10
      },
      { 
        "text": "Slightly - Small changes I've noticed", 
        "description": "Subtle shifts are appearing",
        "value": 4
      },
      { 
        "text": "Yes - The difference is clear", 
        "description": "Your body is aging faster than you'd like",
        "value": 2
      },
      { 
        "text": "Dramatically - I feel much older", 
        "description": "Accelerated aging patterns are significantly impacting you",
        "value": 1
      }
    ]
  },
  {
    "question": "Do you sense there's a deeper pattern affecting your aging that conventional approaches miss?",
    "options": [
      { 
        "text": "Yes - I've always known this", 
        "description": "You're spiritually aware that aging goes beyond the physical",
        "value": 10
      },
      { 
        "text": "I suspect it - But I can't prove it", 
        "description": "Your intuition is guiding you to something deeper",
        "value": 4
      },
      { 
        "text": "Maybe - I'm curious to learn more", 
        "description": "You're open to discovering patterns you haven't considered",
        "value": 2
      },
      { 
        "text": "I'm not sure - This is new to me", 
        "description": "You're about to discover something that could change everything",
        "value": 1
      }
    ]
  }
];

// Score brut : min = 5 (1×5), max = 50 (10×5)
const MAX_RAW_SCORE = 50;
const MIN_RAW_SCORE = 5;
const SCORE_CAP = 91; // Plafond absolu

/**
 * Convertit le score brut en pourcentage affiché.
 * 1. Normalise entre 0 et 1
 * 2. Applique une courbe dégressive (exposant 1.4) → les scores moyens sont écrasés
 * 3. Plafonne à 91%
 */
const calculateScorePercentage = (rawScore) => {
  const normalized = Math.max(0, (rawScore - MIN_RAW_SCORE) / (MAX_RAW_SCORE - MIN_RAW_SCORE));
  const curved = Math.pow(normalized, 1.4);
  return Math.min(Math.round(curved * 100), SCORE_CAP);
};

/**
 * Score en temps réel (partiel) — même courbe, même cap
 * Basé uniquement sur les questions répondues jusqu'ici
 */
const calculatePartialScorePercentage = (rawScore, questionsAnswered) => {
  if (questionsAnswered === 0) return 0;
  const partialMax = questionsAnswered * 10;
  const partialMin = questionsAnswered * 1;
  const normalized = Math.max(0, (rawScore - partialMin) / (partialMax - partialMin));
  const curved = Math.pow(normalized, 1.4);
  return Math.min(Math.round(curved * 100), SCORE_CAP);
};

// Tier system pour les messages d'encouragement
const getAnswerTier = (value) => {
  if (value >= 10) return 'excellent';
  if (value >= 4) return 'moderate';
  if (value >= 2) return 'concerning';
  return 'critical';
};

// MESSAGES DE PROGRESSION
const PROGRESS_MESSAGES = [
  { threshold: 0, message: "🔍 Analyzing your morning energy patterns..." },
  { threshold: 20, message: "🧠 Mapping your spirit-body connection..." },
  { threshold: 40, message: "💡 Evaluating cognitive aging markers..." },
  { threshold: 60, message: "⚡ Measuring biological age acceleration..." },
  { threshold: 80, message: "🔬 Detecting pineal calcification signs..." },
  { threshold: 95, message: "🎯 Calculating your personalized reversal protocol..." }
];

// MESSAGES PERSONNALISÉS PAR TIER
const getEncouragementMessage = (value, questionIndex) => {
  const tier = getAnswerTier(value);
  const messages = {
    excellent: [
      "💪 Excellent! Your strong vitality foundation gives you an advantage",
      "🌟 Impressive! Your spiritual alignment is above average",
      "✨ Wonderful! You're maintaining youthful energy patterns",
      "🔥 Great! Your pineal health shows positive signs",
      "⚡ Outstanding! You have strong spiritual-biological connection"
    ],
    moderate: [
      "👍 Good awareness! You're noticing the subtle shifts",
      "🎯 Honest insight! This is a common pattern we can optimize",
      "💡 Smart observation! You're on the path to understanding",
      "🌿 Valuable awareness! This reveals key optimization areas",
      "📊 Clear pattern emerging! Your honesty accelerates healing"
    ],
    concerning: [
      "🔍 Important revelation! You've identified a key blockage",
      "⚠️ Critical awareness! This pattern affects 47% of seekers",
      "💫 Brave honesty! Acknowledging this is the first step to reversal",
      "🔓 Key insight! You've pinpointed a major energy disruption",
      "🎯 Crucial data! This explains many of your symptoms"
    ],
    critical: [
      "🚨 Breakthrough insight! This severe pattern is HIGHLY reversible",
      "💥 Major discovery! You've identified critical calcification signs",
      "🔴 Urgent pattern detected! Good news: solutions exist",
      "⚡ Critical awareness! Your body is calling for immediate support",
      "🎯 Severe blockage identified! Perfect timing for intervention"
    ]
  };
  
  return messages[tier]?.[questionIndex] || messages[tier]?.[0] || "Great insight!";
};

// MICRO-INSIGHTS ÉDUCATIFS SUR LA PINÉALE
const QUESTION_INSIGHTS = [
  {
    question: 0,
    insight: "💡 Morning energy is directly linked to pineal gland function",
    detail: "When calcified, your pineal can't regulate energy properly"
  },
  {
    question: 1,
    insight: "💡 This 'spirit-body gap' is a classic sign of pineal calcification",
    detail: "73% of people over 40 experience this disconnect"
  },
  {
    question: 2,
    insight: "💡 Mental fog? Your pineal gland regulates cognitive aging",
    detail: "Decalcifying it can restore mental clarity within 14 days"
  },
  {
    question: 3,
    insight: "💡 Accelerated aging often points to pineal disruption",
    detail: "Your pineal controls cellular aging at the biological level"
  },
  {
    question: 4,
    insight: "💡 Your intuition is right - there IS a deeper pattern",
    detail: "It's your pineal health, and it's measurable & reversible"
  }
];

export default function QuizStepper({ autoStart = false, onBackClick = null }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [hasStarted, setHasStarted] = useState(autoStart);
  const [totalScore, setTotalScore] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [currentEncouragementMsg, setCurrentEncouragementMsg] = useState('');
  const [recentCompletions, setRecentCompletions] = useState(12847);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStartTime] = useState(Date.now());
  const analytics = getAnalytics();

  const TIMER_STORAGE_KEY = 'pineal_timer_data';
  const SPOTS_STORAGE_KEY = 'pineal_spots_left';

  // Synchroniser avec le timer de la Hero
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
      if (e.key === TIMER_STORAGE_KEY) {
        updateTimerFromStorage();
      }
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

  // Social proof dynamique
  useEffect(() => {
    const interval = setInterval(() => {
      setRecentCompletions(prev => prev + Math.floor(Math.random() * 3));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Auto-skip intro si venant du Hero
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const skipIntro = localStorage.getItem('skipQuizIntro');
      if (skipIntro === 'true') {
        setHasStarted(true);
        localStorage.removeItem('skipQuizIntro');
      }
    }
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    analytics.track(EVENTS.QUIZ_START, {
      autoStart: autoStart,
      timestamp: new Date().toISOString()
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('quizStartedAt', new Date().toISOString());
    }
  };

  const handleSelectAnswer = (questionIndex, option) => {
    const newAnswers = {
      ...answers,
      [questionIndex]: option.text
    };
    setAnswers(newAnswers);
    
    analytics.track(EVENTS.QUIZ_QUESTION_ANSWERED, {
      questionIndex: questionIndex,
      selectedAnswer: option.text,
      selectedValue: option.value,
      timeSpentOnQuestion: Date.now() - quizStartTime
    });
    
    // Calculer le nouveau score brut
    const newRawScore = Object.keys(newAnswers).reduce((sum, key) => {
      const qIndex = parseInt(key);
      const selectedOption = questions[qIndex].options.find(opt => opt.text === newAnswers[key]);
      return sum + (selectedOption?.value || 0);
    }, 0);
    setTotalScore(newRawScore);
    
    // Message d'encouragement personnalisé par tier
    const encouragementMsg = getEncouragementMessage(option.value, questionIndex);
    setCurrentEncouragementMsg(encouragementMsg);
    setShowEncouragement(true);
    setTimeout(() => setShowEncouragement(false), 2000);
    
    // Auto-avancement
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        handleNext();
      }
    }, 0);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dernière question → Résultats
      if (typeof window !== 'undefined') {
        const quizDuration = Date.now() - quizStartTime;
        // Score avec courbe dégressive + cap 91%
        const scorePercentage = calculateScorePercentage(totalScore);
        
        // Patterns ajustés pour la nouvelle distribution
        // La majorité des utilisateurs tomberont entre 15-55%
        let userPattern = 'Unknown';
        if (scorePercentage <= 25) {
          userPattern = 'The Disconnected Seeker';      // Score très bas → besoin urgent
        } else if (scorePercentage <= 50) {
          userPattern = 'The Fluctuating Spirit';        // Score moyen → besoin clair
        } else if (scorePercentage <= 75) {
          userPattern = 'The Awakening Guardian';        // Score bon → optimisation
        } else {
          userPattern = 'The Aligned Luminary';          // Score excellent → maintenance (rare)
        }
        
        analytics.setUserInfo(scorePercentage, userPattern);
        analytics.track(EVENTS.QUIZ_COMPLETED, {
          totalScore: totalScore,
          rawScoreMax: MAX_RAW_SCORE,
          scorePercentage: scorePercentage,
          userPattern: userPattern,
          quizDuration: quizDuration,
          questionsAnswered: Object.keys(answers).length,
          timerRemaining: timeLeft
        });
        
        localStorage.setItem('analytics_user_pattern', userPattern);
        localStorage.setItem('analytics_score_percentage', scorePercentage.toString());
        
        const results = {
          answers,
          totalScore,
          rawScoreMax: MAX_RAW_SCORE,
          scorePercentage,
          userPattern,
          completedAt: new Date().toISOString(),
          timeSpent: Math.round(quizDuration / 1000),
          timerRemainingAtCompletion: timeLeft
        };
        localStorage.setItem('quizResults', JSON.stringify(results));
        window.location.href = '/results';
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBack = () => {
    if (hasStarted && currentStep > 0) {
      const questionsAnswered = Object.keys(answers).length;
      analytics.track(EVENTS.QUIZ_ABANDONED, {
        questionsAnswered: questionsAnswered,
        questionsRemaining: questions.length - questionsAnswered,
        timeSpent: Date.now() - quizStartTime,
        abandonedAt: `question_${currentStep}`,
        timerRemaining: timeLeft
      });
    }
    
    if (onBackClick) {
      onBackClick();
    } else {
      setHasStarted(false);
      setCurrentStep(0);
      setAnswers({});
    }
  };

  const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;
  
  const currentProgressMessage = PROGRESS_MESSAGES
    .filter(msg => progress >= msg.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0]?.message || PROGRESS_MESSAGES[0].message;

  // Score temps réel avec la même courbe dégressive + cap
  const questionsAnsweredCount = Object.keys(answers).length;
  const currentScorePercentage = questionsAnsweredCount > 0
    ? calculatePartialScorePercentage(totalScore, questionsAnsweredCount)
    : 0;

  const getSpotsLeft = () => {
    if (typeof window === 'undefined') return 47;
    const savedSpots = localStorage.getItem(SPOTS_STORAGE_KEY);
    return savedSpots ? parseInt(savedSpots, 10) : 47;
  };

  const spotsLeft = getSpotsLeft();

  // Page d'intro du quiz
  if (!hasStarted) {
    return (
      <motion.section
        id="quiz-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-10 md:py-16"
      >
        <div className="bg-gradient-to-br from-white to-amber-50/30 rounded-2xl p-8 md:p-12 shadow-xl border border-amber-200 text-center">
          {timeLeft !== null && timeLeft > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-rose-50 to-rose-100/50 rounded-xl border-2 border-rose-300 shadow-lg mx-auto mb-6"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Clock className="w-6 h-6 text-rose-600" />
              </motion.div>
              <div className="text-left">
                <div className="text-xs font-semibold text-rose-800 uppercase tracking-wide">
                  Same Timer as Homepage:
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-rose-700 tabular-nums">{formatTime(timeLeft)}</span>
                  <span className="text-sm text-rose-600 font-medium">remaining</span>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-purple-300 flex items-center justify-center">
              <Brain className="w-10 h-10 text-purple-700" />
            </div>
            <h2 className="text-2xl md:text-3xl font-cormorant font-bold text-gray-900 mb-3">
              Discover Your <span className="text-purple-700">Pineal Health Pattern</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
              Take this 58-second assessment to reveal your pineal calcification level and receive your personalized decalcification protocol.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-8 max-w-sm mx-auto">
              <div className="text-center p-3 bg-white/50 rounded-lg border border-purple-100">
                <div className="text-lg font-bold text-purple-700">5</div>
                <div className="text-xs text-gray-600">Questions</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg border border-purple-100">
                <div className="text-lg font-bold text-purple-700">58s</div>
                <div className="text-xs text-gray-600">Duration</div>
              </div>
            </div>
          </div>
          
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(120, 40, 200, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full max-w-md mx-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <span className="flex items-center justify-center gap-3">
              🔬 Start Pineal Assessment
              <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
          
          <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            {recentCompletions.toLocaleString()} people completed this today
          </p>

          {onBackClick && (
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 px-6 py-2.5 text-gray-600 font-medium hover:text-gray-800 transition"
            >
              ← Back
            </motion.button>
          )}
        </div>
      </motion.section>
    );
  }

  const currentQuestion = questions[currentStep];
  const currentInsight = QUESTION_INSIGHTS[currentStep];

  return (
    <motion.section
      id="quiz-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-10 md:py-16"
    >
      {timeLeft !== null && timeLeft > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl border-2 shadow-lg ${
            currentStep === questions.length - 1 
              ? 'bg-gradient-to-r from-rose-100 to-pink-100 border-rose-300'
              : 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Clock className="w-5 h-5 text-rose-600" />
              </motion.div>
              <div>
                <div className="text-sm font-semibold text-rose-800">
                  Your Personalized Analysis Expires In:
                </div>
                <div className="text-xs text-rose-700">
                  Same timer as homepage • {spotsLeft} spots left
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-rose-700 tabular-nums">
              {formatTime(timeLeft)}
            </div>
          </div>
        </motion.div>
      )}

      {/* PROGRESS BADGE */}
      <div className="mb-8 p-5 bg-gradient-to-r from-white via-purple-50/50 to-white rounded-2xl border-2 border-purple-200/50 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-1">
              Pineal Health Assessment
            </p>
            <p className="text-lg font-bold text-gray-900">
              {currentProgressMessage}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {currentScorePercentage > 0 && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 px-3 py-1.5 rounded-full border border-purple-300">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-800">
                  Score: {currentScorePercentage}/100
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-amber-100 px-3 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                {currentStep + 1} of {questions.length}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="w-full h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="h-full bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
            >
              <motion.div
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {showEncouragement && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-800">
                  {currentEncouragementMsg}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-gradient-to-br from-white to-purple-50/20 rounded-2xl p-6 md:p-8 shadow-xl border border-purple-200/70 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{currentStep + 1}</span>
                </div>
                <span className="text-sm font-semibold text-purple-700">
                  Pineal Pattern Discovery
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-cormorant font-bold text-gray-900 mb-4 leading-tight tracking-wide">
                {currentQuestion.question}
              </h2>

              {currentInsight && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50/30 rounded-xl border border-blue-200"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        {currentInsight.insight}
                      </p>
                      <p className="text-xs text-blue-700">
                        {currentInsight.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentStep] === option.text;
                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelectAnswer(currentStep, option)}
                    whileHover={{ scale: 1.01, x: 3 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full p-5 md:p-6 rounded-xl border-2 transition-all duration-300 text-left cursor-pointer group ${
                      isSelected
                        ? 'border-purple-500 bg-gradient-to-r from-purple-50/80 to-purple-100/30 shadow-lg shadow-purple-200/50'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/30 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5 ${
                        isSelected
                          ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-purple-600'
                          : 'border-gray-300 group-hover:border-purple-400'
                      }`}>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-white text-xs font-bold"
                          >
                            ✓
                          </motion.span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-semibold text-base md:text-lg text-gray-900 mb-1">
                          {option.text}
                        </p>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row gap-3 mt-10 pt-6 border-t border-purple-200/50">
          <motion.button
            onClick={handlePrevious}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={currentStep === 0}
            className="order-2 sm:order-1 px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            ← Previous
          </motion.button>
          
          <motion.button
            onClick={handleNext}
            whileHover={{ 
              scale: answers[currentStep] ? 1.05 : 1,
              boxShadow: answers[currentStep] ? "0 15px 35px -5px rgba(120, 40, 200, 0.4)" : "none",
              y: answers[currentStep] ? -2 : 0
            }}
            whileTap={{ scale: 0.95 }}
            animate={currentStep === questions.length - 1 && answers[currentStep] ? { y: [0, -4, 0] } : {}}
            transition={{
              y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
              default: { type: 'spring', stiffness: 400, damping: 17 }
            }}
            className="order-1 sm:order-2 flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all group relative overflow-hidden"
            disabled={!answers[currentStep]}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex flex-col items-center justify-center gap-1">
              <span className="flex items-center gap-2">
                {currentStep === questions.length - 1 ? (
                  <>
                    🎯 See My Pineal Health Score
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    Next Question
                    <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              {currentStep === questions.length - 1 && (
                <>
                  <span className="block text-xs font-normal text-purple-100">
                    (Instant analysis • Personalized protocol)
                  </span>
                  {timeLeft !== null && timeLeft < 300 && (
                    <span className="block text-xs font-semibold text-rose-200 mt-1">
                      ⚠️ Timer expires in {formatTime(timeLeft)} • {spotsLeft} spots left
                    </span>
                  )}
                </>
              )}
            </span>
          </motion.button>
        </div>
      </div>

      {/* SOCIAL PROOF */}
      <div className="text-center p-4 bg-gradient-to-r from-white to-purple-50/30 rounded-xl border border-purple-200">
        <p className="text-sm text-gray-700 flex items-center justify-center gap-2">
          <span className="font-semibold text-purple-700">{recentCompletions.toLocaleString()} people</span> 
          completed this assessment
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block w-2 h-2 bg-emerald-500 rounded-full"
          ></motion.span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          94% report discovering patterns they didn&apos;t know existed • {spotsLeft} personalized spots remaining
        </p>
      </div>
    </motion.section>
  );
}
