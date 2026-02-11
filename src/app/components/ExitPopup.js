'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Clock, Sparkles, Zap, Brain, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { submitEmailToGoogleSheets } from '@/app/utils/googleSheets';
import { sendEmailWithAttachment } from '@/app/utils/sendEmail';
import { getAnalytics, EVENTS } from '@/app/utils/analytics';

export default function ExitPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userContext, setUserContext] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  
  const hasShownRef = useRef(false);
  const timeOnPageRef = useRef(0);
  const popupShownTimeRef = useRef(null);

  // Timer countdown
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

  // Déterminer contexte utilisateur
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const quizResults = localStorage.getItem('quizResults');
      const quizStarted = localStorage.getItem('quizStartedAt');
      
      if (quizResults) {
        setUserContext('completed');
      } else if (quizStarted) {
        setUserContext('abandoned');
      } else {
        setUserContext('browsing');
      }
    }
  }, []);

  const trackEvent = (eventName, properties = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...properties,
        'engagement_time_msec': 100,
      });
    }
    console.log('📊 Analytics Event:', eventName, properties);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && userContext === 'completed') {
      const isResultsPage = window.location.pathname === '/results';
      
      if (isResultsPage) {
        const resultsTimer = setTimeout(() => {
          setShowPopup(true);
          popupShownTimeRef.current = Date.now();
          
          trackEvent('exit_popup_triggered', {
            trigger_type: 'results_page_5s',
            time_on_page: 5,
            user_context: 'completed',
            page: 'results'
          });
          
          console.log('🎯 Popup affichée après 5 secondes sur Results page');
        }, 5000);
        
        return () => {
          clearTimeout(resultsTimer);
        };
      }
    }
  }, [userContext]);

  useEffect(() => {
    const lastShown = localStorage.getItem('exitPopupLastShown');
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (lastShown && (now - parseInt(lastShown)) < oneDayMs) {
      hasShownRef.current = true;
      console.log('⏸️ Exit popup: Already shown in last 24h');
      return;
    }

    const startTime = Date.now();
    const timeTracker = setInterval(() => {
      timeOnPageRef.current = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);

    const triggerPopup = (triggerType) => {
      if (hasShownRef.current) return;
      
      setShowPopup(true);
      hasShownRef.current = true;
      localStorage.setItem('exitPopupLastShown', Date.now().toString());
      popupShownTimeRef.current = Date.now();
      
      trackEvent('exit_popup_triggered', {
        trigger_type: triggerType,
        time_on_page: timeOnPageRef.current,
        user_context: userContext
      });
      
      console.log('🎯 Exit popup triggered:', triggerType);
    };

    const handleMouseLeave = (e) => {
      if (
        e.clientY < 50 &&
        timeOnPageRef.current >= 5 &&
        !hasShownRef.current
      ) {
        triggerPopup('mouse_leave');
      }
    };

    let inactivityTimer;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      
      inactivityTimer = setTimeout(() => {
        if (!hasShownRef.current && timeOnPageRef.current >= 10) {
          triggerPopup('inactivity');
        }
      }, 30000);
    };

    let lastScrollY = 0;
    let maxScrollDepth = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      const scrollDepth = scrollHeight > 0 ? (currentScrollY / scrollHeight) * 100 : 0;
      
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
      
      if (
        maxScrollDepth >= 40 &&
        currentScrollY < 200 &&
        lastScrollY - currentScrollY > 300 &&
        timeOnPageRef.current >= 15 &&
        !hasShownRef.current
      ) {
        triggerPopup('scroll_back');
      }
      
      lastScrollY = currentScrollY;
      resetInactivityTimer();
    };

    const absoluteTimer = setTimeout(() => {
      if (!hasShownRef.current && timeOnPageRef.current >= 60) {
        triggerPopup('time_absolute');
      }
    }, 60000);

    const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
    
    if (isDesktop) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }
    
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keydown', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
    document.addEventListener('touchstart', resetInactivityTimer);
    window.addEventListener('scroll', handleScroll);
    
    resetInactivityTimer();

    return () => {
      clearInterval(timeTracker);
      clearTimeout(inactivityTimer);
      clearTimeout(absoluteTimer);
      
      if (isDesktop) {
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
      document.removeEventListener('mousemove', resetInactivityTimer);
      document.removeEventListener('keydown', resetInactivityTimer);
      document.removeEventListener('click', resetInactivityTimer);
      document.removeEventListener('touchstart', resetInactivityTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [userContext]);
  
  const getPopupContent = () => {
    switch (userContext) {
      case 'completed':
        return {
          icon: <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />,
          iconBg: 'from-purple-100 to-purple-200',
          headline: 'Wait! Claim Your Bonus',
          subheadline: 'Get the "9 Foods That Decalcify Your Pineal Gland" Guide',
          description: 'Based on your pineal health score, these specific foods can accelerate your decalcification by 40%. Sent instantly to your inbox.',
          cta: 'Send Me the Guide',
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
      
      case 'abandoned':
        return {
          icon: <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />,
          iconBg: 'from-amber-100 to-orange-200',
          headline: 'Your Pineal Analysis Is Almost Ready!',
          subheadline: 'Complete Your Assessment to See Your Calcification Level',
          description: 'You\'re just 2 questions away from discovering your exact pineal health score and personalized decalcification protocol. Your progress expires soon.',
          cta: 'Complete My Assessment Now',
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
      
      case 'browsing':
      default:
        return {
          icon: <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />,
          iconBg: 'from-blue-100 to-indigo-200',
          headline: 'Before You Go...',
          subheadline: 'Discover Your Pineal Health Score (Free 58-Second Test)',
          description: 'See if your pineal gland is calcified and aging you faster than it should. 12,847 people discovered critical patterns today that doctors missed.',
          cta: 'Take Free Pineal Assessment',
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

    if (email.trim()) {
      const analytics = getAnalytics();
      
      trackEvent('exit_popup_email_submitted', {
        user_context: userContext,
        time_visible: popupShownTimeRef.current ? Math.round((Date.now() - popupShownTimeRef.current) / 1000) : 0
      });

      analytics?.track(EVENTS.EXIT_POPUP_EMAIL_SUBMITTED, {
        email: email,
        userContext: userContext
      });

      let userPattern = 'Unknown';
      let vitalityScore = 0;
      
      if (typeof window !== 'undefined') {
        const quizResults = localStorage.getItem('quizResults');
        if (quizResults) {
          try {
            const results = JSON.parse(quizResults);
            vitalityScore = results.totalScore || 0;
            userPattern = localStorage.getItem('analytics_user_pattern') || 'Unknown';
          } catch (e) {
            console.error('Error parsing quiz results:', e);
          }
        }
      }

      sendEmailWithAttachment(email, {
        userPattern,
        vitalityScore,
        context: userContext
      })
        .then(result => {
          if (result.success) {
            console.log('✅ Email envoyé avec succès et données sauvegardées');
            
            trackEvent('exit_popup_email_sent_success', {
              email: email.split('@')[0].substring(0, 3) + '***',
              user_pattern: userPattern,
              vitality_score: vitalityScore,
              user_context: userContext,
              popup_duration_sec: Math.round((Date.now() - popupShownTimeRef.current) / 1000)
            });
          } else {
            console.warn('⚠️ Erreur lors de l\'envoi de l\'email:', result.message);
            
            trackEvent('exit_popup_email_sent_error', {
              error_message: result.message,
              user_context: userContext
            });
          }
        })
        .catch(err => {
          console.error('Erreur:', err);
          
          trackEvent('exit_popup_email_exception', {
            error: err.message,
            user_context: userContext
          });
        });

      submitEmailToGoogleSheets(email, userPattern, vitalityScore)
        .then(result => {
          if (result.success) {
            console.log('✅ Email sauvegardé aussi dans Google Sheets');
          } else {
            console.warn('⚠️ Erreur Google Sheets (pas critique):', result.message);
          }
        })
        .catch(err => console.warn('Google Sheets non disponible:', err));

      setSubmitted(true);
      
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
      time_visible_sec: popupShownTimeRef.current ? Math.round((Date.now() - popupShownTimeRef.current) / 1000) : 0,
      popup_trigger: 'close_button'
    });
    
    console.log('❌ Popup fermée sans soumission');
    setShowPopup(false);
  };

  if (!showPopup || !popupContent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative"
        >
          {/* ✅ Bouton fermer amélioré */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-600 transition-colors z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 bg-white/80 backdrop-blur-sm shadow-sm"
            aria-label="Close"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>

          {!submitted ? (
            <div className="p-5 sm:p-8 md:p-10 max-h-[90vh] overflow-y-auto">
              {/* ✅ Icône agrandie avec animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${popupContent.iconBg} flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg`}
              >
                {popupContent.icon}
              </motion.div>

              {/* ✅ Badge urgence amélioré */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 sm:mb-5 flex justify-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-full border-2 border-rose-200 shadow-sm">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 animate-pulse" />
                  <span className="text-sm sm:text-base font-bold text-rose-800">
                    {popupContent.urgency}
                  </span>
                </div>
              </motion.div>

              {/* ✅ Titre amélioré */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight text-center"
              >
                {popupContent.headline}
              </motion.h2>

              {/* ✅ Sous-titre amélioré */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-5 text-center"
              >
                {popupContent.subheadline}
              </motion.p>

              {/* ✅ Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base sm:text-lg text-gray-600 mb-5 sm:mb-6 leading-relaxed text-center px-2"
              >
                {popupContent.description}
              </motion.p>

              {/* ✅ Liste des bénéfices améliorée */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-5 sm:mb-7 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-200 shadow-sm"
              >
                <div className="space-y-3 sm:space-y-3.5">
                  {popupContent.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + (index * 0.1), type: 'spring' }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed">{benefit}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ✅ FORMULAIRE EMAIL AGRANDI (mobile-first) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-3 sm:space-y-4"
              >
                {popupContent.showEmailForm ? (
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    {/* ✅ CHAMP EMAIL AGRANDI POUR MOBILE */}
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-5 sm:py-6 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-lg sm:text-xl font-medium placeholder:text-gray-400 placeholder:font-normal shadow-sm hover:border-gray-400"
                        style={{ fontSize: '16px' }} // ✅ Évite le zoom sur iOS
                      />
                    </div>

                    {/* ✅ BOUTON CTA AGRANDI */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-6 py-5 sm:py-6 bg-gradient-to-r ${popupContent.ctaColor} text-white font-bold text-lg sm:text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
                    >
                      <span className="relative z-10">{popupContent.cta}</span>
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                    </motion.button>
                  </form>
                ) : (
                  <motion.button
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-6 py-5 sm:py-6 bg-gradient-to-r ${popupContent.ctaColor} text-white font-bold text-lg sm:text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300`}
                  >
                    {popupContent.cta}
                  </motion.button>
                )}

                {/* ✅ Bouton "Non merci" amélioré */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full px-4 sm:px-6 py-3 text-gray-500 font-medium hover:text-gray-700 transition text-sm sm:text-base underline decoration-dotted underline-offset-4"
                >
                  No thanks, I'll miss out
                </button>
              </motion.div>

              {/* ✅ Garantie de sécurité */}
              {popupContent.showEmailForm && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="text-xs sm:text-sm text-gray-500 text-center mt-4 sm:mt-5 flex items-center justify-center gap-2 flex-wrap"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>No spam • Instant delivery • Unsubscribe anytime</span>
                </motion.p>
              )}
            </div>
          ) : (
            // ✅ ÉTAT DE SUCCÈS AMÉLIORÉ
            <div className="p-6 sm:p-10 md:p-12 text-center max-h-[90vh] overflow-y-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-emerald-100 via-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-emerald-600" strokeWidth={2.5} />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4"
              >
                Perfect! 🎉
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-gray-700 mb-2 sm:mb-3 font-semibold"
              >
                Check your inbox in the next 2 minutes!
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm sm:text-base md:text-lg text-gray-600"
              >
                Your <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">9 Pineal Foods Guide</span> is on its way.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 sm:mt-8 p-5 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200"
              >
                <p className="text-sm sm:text-base text-blue-900 font-semibold">
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