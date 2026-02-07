'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, Zap, Star, Award, ChevronRight, Clock, Brain, AlertCircle } from 'lucide-react';

const questions = [
  {
    "question": "When you wake up, how connected do you feel to your inner vitality and youthful energy?",
    "options": [
      { 
        "text": "Deeply connected and energized", 
        "description": "You wake with natural vitality flowing through you",
        "value": 4
      },
      { 
        "text": "Searching for that spark", 
        "description": "You sense the energy is there, just harder to access",
        "value": 3
      },
      { 
        "text": "Feeling disconnected from my true energy", 
        "description": "Your body feels older than your spirit knows you are",
        "value": 2
      },
      { 
        "text": "My energy varies unpredictably", 
        "description": "Some mornings feel youthful, others feel aged",
        "value": 1
      }
    ]
  },
  {
    "question": "Does your spirit feel younger than your body allows you to be?",
    "options": [
      { 
        "text": "Rarely - I feel aligned", 
        "description": "Your inner age and outer experience are in harmony",
        "value": 4
      },
      { 
        "text": "Sometimes - I notice the gap", 
        "description": "This disconnect appears occasionally",
        "value": 3
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
        "value": 4
      },
      { 
        "text": "Some days - It comes and goes", 
        "description": "Mental clarity fluctuates",
        "value": 3
      },
      { 
        "text": "Rarely - Brain fog is common", 
        "description": "Mental aging is showing up more than you'd like",
        "value": 2
      },
      { 
        "text": "Unpredictably - Focus shifts constantly", 
        "description": "Your cognitive energy feels unstable and aged",
        "value": 1
      }
    ]
  },
  {
    "question": "Compared to 5-10 years ago, does your body feel like it's aging faster than it should?",
    "options": [
      { 
        "text": "No - I feel the same or better", 
        "description": "You're maintaining or reversing your biological age",
        "value": 4
      },
      { 
        "text": "Slightly - Small changes I've noticed", 
        "description": "Subtle shifts are appearing",
        "value": 3
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
        "value": 4
      },
      { 
        "text": "I suspect it - But I can't prove it", 
        "description": "Your intuition is guiding you to something deeper",
        "value": 3
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

// NOUVEAUX MESSAGES DE PROGRESSION BASÉS SUR DÉCOUVERTE
const PROGRESS_MESSAGES = [
  { threshold: 0, message: "🔍 Analyzing your morning energy patterns..." },
  { threshold: 20, message: "🧠 Mapping your spirit-body connection..." },
  { threshold: 40, message: "💡 Evaluating cognitive aging markers..." },
  { threshold: 60, message: "⚡ Measuring biological age acceleration..." },
  { threshold: 80, message: "🔬 Detecting pineal calcification signs..." },
  { threshold: 95, message: "🎯 Calculating your personalized reversal protocol..." }
];

// NOUVEAUX MESSAGES PERSONNALISÉS PAR VALEUR DE RÉPONSE
const getEncouragementMessage = (value, questionIndex) => {
  const messages = {
    4: [
      "💪 Excellent! Your strong vitality foundation gives you an advantage",
      "🌟 Impressive! Your spiritual alignment is above average",
      "✨ Wonderful! You're maintaining youthful energy patterns",
      "🔥 Great! Your pineal health shows positive signs",
      "⚡ Outstanding! You have strong spiritual-biological connection"
    ],
    3: [
      "👍 Good awareness! You're noticing the subtle shifts",
      "🎯 Honest insight! This is a common pattern we can optimize",
      "💡 Smart observation! You're on the path to understanding",
      "🌿 Valuable awareness! This reveals key optimization areas",
      "📊 Clear pattern emerging! Your honesty accelerates healing"
    ],
    2: [
      "🔍 Important revelation! You've identified a key blockage",
      "⚠️ Critical awareness! This pattern affects 47% of seekers",
      "💫 Brave honesty! Acknowledging this is the first step to reversal",
      "🔓 Key insight! You've pinpointed a major energy disruption",
      "🎯 Crucial data! This explains many of your symptoms"
    ],
    1: [
      "🚨 Breakthrough insight! This severe pattern is HIGHLY reversible",
      "💥 Major discovery! You've identified critical calcification signs",
      "🔴 Urgent pattern detected! Good news: solutions exist",
      "⚡ Critical awareness! Your body is calling for immediate support",
      "🎯 Severe blockage identified! Perfect timing for intervention"
    ]
  };
  
  return messages[value]?.[questionIndex] || messages[value]?.[0] || "Great insight!";
};

// NOUVEAUX MICRO-INSIGHTS ÉDUCATIFS SUR LA PINÉALE
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
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime <= 1 ? 0 : prevTime - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // NOUVEAU : Social proof dynamique
  useEffect(() => {
    const interval = setInterval(() => {
      setRecentCompletions(prev => prev + Math.floor(Math.random() * 3));
    }, 45000); // Augmente toutes les 45 secondes
    return () => clearInterval(interval);
  }, []);

  // NOUVEAU : Auto-skip intro si venant du Hero
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
    
    // Calculer le nouveau score
    const newScore = Object.keys(newAnswers).reduce((sum, key) => {
      const qIndex = parseInt(key);
      const selectedOption = questions[qIndex].options.find(opt => opt.text === newAnswers[key]);
      return sum + (selectedOption?.value || 0);
    }, 0);
    setTotalScore(newScore);
    
    // NOUVEAU : Message d'encouragement personnalisé
    const encouragementMsg = getEncouragementMessage(option.value, questionIndex);
    setCurrentEncouragementMsg(encouragementMsg);
    setShowEncouragement(true);
    setTimeout(() => setShowEncouragement(false), 2000);
    
    // OPTIMISÉ : Auto-avancement instantané (0ms au lieu de 300ms)
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
        const results = {
          answers,
          totalScore,
          completedAt: new Date().toISOString(),
          timeSpent: Math.round((Date.now() - new Date(localStorage.getItem('quizStartedAt')).getTime()) / 1000)
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

  // Calculer le score actuel en pourcentage
  const currentScorePercentage = currentStep >= 0 && Object.keys(answers).length > 0
    ? Math.round((totalScore / ((currentStep + 1) * 4)) * 100)
    : 0;

  // Page d'intro du quiz (gardée pour accès direct, mais skippée depuis Hero)
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
      {/* NOUVEAU : URGENCE SUR DERNIÈRE QUESTION */}
      {currentStep === questions.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl border-2 border-rose-300 shadow-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className="w-5 h-5 text-rose-600" />
            </motion.div>
            <p className="text-sm font-semibold text-rose-800">
              ⏰ Your personalized analysis expires in <span className="text-lg font-bold">{formatTime(timeLeft)}</span>
            </p>
          </div>
        </motion.div>
      )}

      {/* PROGRESS BADGE OPTIMISÉ */}
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
            {/* NOUVEAU : Score Preview en Temps Réel */}
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

        {/* PROGRESS BAR */}
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

        {/* ENCOURAGEMENT MESSAGE PERSONNALISÉ */}
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
            {/* QUESTION HEADER */}
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

              {/* NOUVEAU : MICRO-INSIGHT ÉDUCATIF SUR LA PINÉALE */}
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

            {/* ANSWER OPTIONS */}
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

        {/* NAVIGATION BUTTONS OPTIMISÉS */}
        <div className="flex flex-col sm:flex-row gap-3 mt-10 pt-6 border-t border-purple-200/50">
          {/* OPTIMISÉ : Bouton Previous moins visible */}
          <motion.button
            onClick={handlePrevious}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={currentStep === 0}
            className="order-2 sm:order-1 px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            ← Previous
          </motion.button>
          
          {/* CTA OPTIMISÉ : Plus spécifique */}
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
            className="order-1 sm:order-2 flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all group"
            disabled={!answers[currentStep]}
          >
            <span className="flex items-center justify-center gap-2">
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
              <span className="block text-xs font-normal text-purple-100 mt-1">
                (Instant analysis • Personalized protocol)
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* SOCIAL PROOF DYNAMIQUE OPTIMISÉ */}
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
          94% report discovering patterns they didn't know existed
        </p>
      </div>
    </motion.section>
  );
}