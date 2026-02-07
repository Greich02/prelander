'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Clock, Sparkles, Zap, Brain, CheckCircle, AlertCircle } from 'lucide-react';

export default function ExitPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userContext, setUserContext] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes
  
  const mouseYRef = useRef(0);
  const hasShownRef = useRef(false);
  const timeOnPageRef = useRef(0);
  const popupShownTimeRef = useRef(null);

  // Timer countdown pour l'urgence
  useEffect(() => {
    if (!showPopup || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [showPopup, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Déterminer le contexte utilisateur
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const quizResults = localStorage.getItem('quizResults');
      const quizStarted = localStorage.getItem('quizStartedAt');
      
      if (quizResults) {
        setUserContext('completed'); // A complété le quiz
      } else if (quizStarted) {
        setUserContext('abandoned'); // A commencé mais pas fini
      } else {
        setUserContext('browsing'); // Juste browse
      }
    }
  }, []);

  // Tracking helper
  const trackEvent = (eventName, properties = {}) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, properties);
    }
    
    // Console pour debug
    console.log('📊 Event:', eventName, properties);
  };

  // TRIGGERS INTELLIGENTS
  useEffect(() => {
    // Vérifier si déjà montré
    const popupShown = sessionStorage.getItem('exitPopupShown');
    if (popupShown) {
      hasShownRef.current = true;
      return;
    }

    // Tracker le temps sur la page
    const startTime = Date.now();
    const timeTracker = setInterval(() => {
      timeOnPageRef.current = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);

    // ═══════════════════════════════════════════════════════════
    // TRIGGER #1 : EXIT INTENT (Mouse Leave) - Desktop uniquement
    // ═══════════════════════════════════════════════════════════
    const handleMouseLeave = (e) => {
      // Conditions pour afficher :
      // 1. Souris sort par le haut (intention de fermer/changer onglet)
      // 2. Au moins 10 secondes sur la page
      // 3. Pas déjà affiché
      if (
        e.clientY < 10 && 
        mouseYRef.current > 10 && 
        timeOnPageRef.current > 10 &&
        !hasShownRef.current
      ) {
        setShowPopup(true);
        hasShownRef.current = true;
        sessionStorage.setItem('exitPopupShown', 'true');
        popupShownTimeRef.current = Date.now();
        
        trackEvent('exit_popup_triggered', {
          trigger_type: 'mouse_leave',
          time_on_page: timeOnPageRef.current,
          user_context: userContext
        });
      }
      mouseYRef.current = e.clientY;
    };

    // ═══════════════════════════════════════════════════════════
    // TRIGGER #2 : INACTIVITÉ PROLONGÉE (45 secondes)
    // ═══════════════════════════════════════════════════════════
    let inactivityTimer;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!hasShownRef.current && timeOnPageRef.current > 45) {
          setShowPopup(true);
          hasShownRef.current = true;
          sessionStorage.setItem('exitPopupShown', 'true');
          popupShownTimeRef.current = Date.now();
          
          trackEvent('exit_popup_triggered', {
            trigger_type: 'inactivity',
            time_on_page: timeOnPageRef.current,
            user_context: userContext
          });
        }
      }, 45000); // 45 secondes d'inactivité
    };

    // ═══════════════════════════════════════════════════════════
    // TRIGGER #3 : SCROLL BOUNCE (Scroll profond puis remontée)
    // ═══════════════════════════════════════════════════════════
    let lastScrollY = 0;
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDepth = (currentScrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
      
      // Si l'utilisateur a scrollé au moins 60%, puis remonte rapidement en haut
      if (
        maxScrollDepth > 60 && 
        currentScrollY < 100 && 
        lastScrollY > 500 &&
        timeOnPageRef.current > 20 &&
        !hasShownRef.current
      ) {
        setShowPopup(true);
        hasShownRef.current = true;
        sessionStorage.setItem('exitPopupShown', 'true');
        popupShownTimeRef.current = Date.now();
        
        trackEvent('exit_popup_triggered', {
          trigger_type: 'scroll_bounce',
          time_on_page: timeOnPageRef.current,
          max_scroll_depth: Math.round(maxScrollDepth),
          user_context: userContext
        });
      }
      
      lastScrollY = currentScrollY;
      resetInactivityTimer();
    };

    // Event listeners
    const isDesktop = window.innerWidth > 768;
    
    // Mouse leave uniquement sur desktop
    if (isDesktop) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }
    
    // Inactivité et scroll sur tous les devices
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keydown', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
    window.addEventListener('scroll', handleScroll);
    
    resetInactivityTimer();

    return () => {
      clearInterval(timeTracker);
      clearTimeout(inactivityTimer);
      if (isDesktop) {
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
      document.removeEventListener('mousemove', resetInactivityTimer);
      document.removeEventListener('keydown', resetInactivityTimer);
      document.addEventListener('click', resetInactivityTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [userContext]);

  // Contenu dynamique basé sur contexte utilisateur
  const getPopupContent = () => {
    switch (userContext) {
      // ═══════════════════════════════════════════════════════════
      // CAS 1 : A COMPLÉTÉ LE QUIZ
      // ═══════════════════════════════════════════════════════════
      case 'completed':
        return {
          icon: <Gift className="w-8 h-8 text-purple-600" />,
          iconBg: 'from-purple-100 to-purple-200',
          headline: 'Wait! Claim Your Bonus',
          subheadline: 'Get the "9 Foods That Decalcify Your Pineal Gland" Guide',
          description: 'Based on your pineal health score, these specific foods can accelerate your decalcification by 40%. Sent instantly to your inbox.',
          cta: '🔬 Send Me the Pineal Foods Guide',
          ctaColor: 'from-purple-600 to-pink-600',
          urgency: `Available for the next ${formatTime(timeLeft)} only`,
          showEmailForm: true,
          benefits: [
            '9 scientifically-proven decalcifying foods',
            'Dosage recommendations for your pattern',
            'Foods to AVOID (blocking pineal health)',
            'Weekly meal planning template'
          ]
        };
      
      // ═══════════════════════════════════════════════════════════
      // CAS 2 : A COMMENCÉ MAIS ABANDONNÉ LE QUIZ
      // ═══════════════════════════════════════════════════════════
      case 'abandoned':
        return {
          icon: <AlertCircle className="w-8 h-8 text-amber-600" />,
          iconBg: 'from-amber-100 to-orange-200',
          headline: 'Your Pineal Analysis Is Almost Ready!',
          subheadline: 'Complete Your Assessment to See Your Calcification Level',
          description: 'You\'re just 2 questions away from discovering your exact pineal health score and personalized decalcification protocol. Your progress expires soon.',
          cta: '⚡ Complete My Assessment Now',
          ctaColor: 'from-amber-600 to-orange-600',
          urgency: `Your progress expires in ${formatTime(timeLeft)}`,
          showEmailForm: false,
          action: 'resume-quiz',
          benefits: [
            'See your exact pineal calcification level',
            'Get your personalized reversal protocol',
            'Understand why conventional methods failed',
            'Takes only 30 more seconds'
          ]
        };
      
      // ═══════════════════════════════════════════════════════════
      // CAS 3 : JUSTE EN TRAIN DE BROWSER (pas commencé le quiz)
      // ═══════════════════════════════════════════════════════════
      case 'browsing':
      default:
        return {
          icon: <Brain className="w-8 h-8 text-blue-600" />,
          iconBg: 'from-blue-100 to-indigo-200',
          headline: 'Before You Go...',
          subheadline: 'Discover Your Pineal Health Score (Free 58-Second Test)',
          description: 'See if your pineal gland is calcified and aging you faster than it should. 12,847 people discovered critical patterns today that doctors missed.',
          cta: '🧠 Take Free Pineal Assessment',
          ctaColor: 'from-blue-600 to-indigo-600',
          urgency: 'Only 47 personalized spots remaining today',
          showEmailForm: false,
          action: 'start-quiz',
          benefits: [
            '58 seconds • 5 questions only',
            'Reveals your exact calcification level',
            'Personalized decalcification protocol',
            'No credit card • No spam'
          ]
        };
    }
  };

  const popupContent = getPopupContent();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // CAS : Redirection vers quiz (abandoned ou browsing)
    if (popupContent.action === 'resume-quiz') {
      trackEvent('exit_popup_action', {
        action: 'resume_quiz',
        user_context: userContext,
        time_visible: popupShownTimeRef.current ? Math.round((Date.now() - popupShownTimeRef.current) / 1000) : 0
      });
      
      window.location.href = '/#quiz-section';
      setShowPopup(false);
      return;
    }
    
    if (popupContent.action === 'start-quiz') {
      trackEvent('exit_popup_action', {
        action: 'start_quiz',
        user_context: userContext,
        time_visible: popupShownTimeRef.current ? Math.round((Date.now() - popupShownTimeRef.current) / 1000) : 0
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('skipQuizIntro', 'true');
        localStorage.setItem('quizStartedAt', new Date().toISOString());
      }
      window.location.href = '/#quiz-section';
      setShowPopup(false);
      return;
    }

    // CAS : Collecte email (completed uniquement)
    if (email.trim()) {
      trackEvent('exit_popup_email_submitted', {
        user_context: userContext,
        time_visible: popupShownTimeRef.current ? Math.round((Date.now() - popupShownTimeRef.current) / 1000) : 0
      });

      // ═══════════════════════════════════════════════════════════
      // INTÉGRATION EMAIL - Zapier Webhook
      // ═══════════════════════════════════════════════════════════
      fetch('VOTRE_ZAPIER_WEBHOOK_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          source: 'exit_popup',
          user_context: userContext,
          lead_magnet: 'pineal_foods_guide',
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.error('Webhook error:', err));

      setSubmitted(true);
      
      // Masquer après 3 secondes
      setTimeout(() => {
        setShowPopup(false);
        setSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  const handleClose = () => {
    trackEvent('exit_popup_dismissed', {
      user_context: userContext,
      time_visible: popupShownTimeRef.current ? Math.round((Date.now() - popupShownTimeRef.current) / 1000) : 0
    });
    
    setShowPopup(false);
  };

  if (!showPopup || !popupContent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>

          {!submitted ? (
            <div className="p-8 md:p-10">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${popupContent.iconBg} flex items-center justify-center mx-auto mb-6`}
              >
                {popupContent.icon}
              </motion.div>

              {/* Urgence Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-100 rounded-full border border-rose-300 mx-auto">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-semibold text-rose-800">
                    {popupContent.urgency}
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight text-center"
              >
                {popupContent.headline}
              </motion.h2>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg font-semibold text-gray-700 mb-4 text-center"
              >
                {popupContent.subheadline}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base text-gray-600 mb-6 leading-relaxed text-center"
              >
                {popupContent.description}
              </motion.p>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6 bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200"
              >
                <div className="space-y-3">
                  {popupContent.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + (index * 0.1) }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{benefit}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Form ou CTA direct */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-4"
              >
                {popupContent.showEmailForm ? (
                  // EMAIL FORM (uniquement pour 'completed')
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-base"
                    />

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-6 py-4 bg-gradient-to-r ${popupContent.ctaColor} text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      {popupContent.cta}
                    </motion.button>
                  </form>
                ) : (
                  // CTA DIRECT (pour 'abandoned' et 'browsing')
                  <motion.button
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-6 py-4 bg-gradient-to-r ${popupContent.ctaColor} text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    {popupContent.cta}
                  </motion.button>
                )}

                {/* Secondary CTA */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full px-6 py-2.5 text-gray-600 font-medium hover:text-gray-800 transition text-sm"
                >
                  No thanks, I'll miss out
                </button>
              </motion.div>

              {/* Trust Signal */}
              {popupContent.showEmailForm && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  No spam • Instant delivery • Unsubscribe anytime
                </motion.p>
              )}
            </div>
          ) : (
            // SUCCESS STATE
            <div className="p-8 md:p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-gray-900 mb-3"
              >
                Perfect! 🎉
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-700 mb-2"
              >
                Check your inbox in the next 2 minutes!
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base text-gray-600"
              >
                Your <span className="font-semibold">9 Pineal Foods Guide</span> is on its way.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
              >
                <p className="text-sm text-blue-800 font-medium">
                  💡 Pro Tip: Add us to your contacts to ensure delivery!
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}