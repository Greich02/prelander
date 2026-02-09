'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Clock, Sparkles, Zap, Brain, CheckCircle, AlertCircle } from 'lucide-react';
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

  // ═══════════════════════════════════════════════════════════
  // 📊 TRACKING GOOGLE ANALYTICS AVANCÉ
  // ═══════════════════════════════════════════════════════════
  const trackEvent = (eventName, properties = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      // Envoi à Google Analytics avec tous les paramètres
      window.gtag('event', eventName, {
        ...properties,
        'engagement_time_msec': 100, // Optionnel: pour mesurer l'engagement
      });
    }
    console.log('📊 Analytics Event:', eventName, properties);
  };

  // ═══════════════════════════════════════════════════════════
  // ✅ NOUVEAU TRIGGER : RESULTS PAGE (5 secondes)
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (typeof window !== 'undefined' && userContext === 'completed') {
      // Vérifier si on est sur la page results
      const isResultsPage = window.location.pathname === '/results';
      
      if (isResultsPage && !hasShownRef.current) {
        // Afficher le popup 5 secondes après arrivée sur results
        const resultsTimer = setTimeout(() => {
          if (!hasShownRef.current) {
            setShowPopup(true);
            hasShownRef.current = true;
            localStorage.setItem('exitPopupLastShown', Date.now().toString());
            popupShownTimeRef.current = Date.now();
            
            // 📊 Tracking: Popup affiché sur results page
            trackEvent('exit_popup_triggered', {
              trigger_type: 'results_page_5s',
              time_on_page: 5,
              user_context: 'completed',
              page: 'results'
            });
            
            console.log('🎯 Popup affichée après 5 secondes sur Results page');
          }
        }, 5000); // 5 secondes
        
        return () => clearTimeout(resultsTimer);
      }
    }
  }, [userContext]);

  // ═══════════════════════════════════════════════════════════
  // TRIGGERS OPTIMISÉS
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    // ✅ FIX #1 : Vérifier localStorage au lieu de sessionStorage
    // Permet 1 affichage par JOUR au lieu de 1 par SESSION
    const lastShown = localStorage.getItem('exitPopupLastShown');
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (lastShown && (now - parseInt(lastShown)) < oneDayMs) {
      hasShownRef.current = true;
      console.log('⏸️ Exit popup: Already shown in last 24h');
      return;
    }

    // Tracker temps sur page
    const startTime = Date.now();
    const timeTracker = setInterval(() => {
      timeOnPageRef.current = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);

    // Helper pour afficher popup
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

    // ═══════════════════════════════════════════════════════════
    // ✅ FIX #2 : EXIT INTENT plus permissif
    // ═══════════════════════════════════════════════════════════
    const handleMouseLeave = (e) => {
      // Conditions SIMPLIFIÉES :
      // 1. Souris sort par le haut (< 50px au lieu de < 10px)
      // 2. Au moins 5 secondes sur page (au lieu de 10)
      if (
        e.clientY < 50 &&  // ✅ Zone plus large
        timeOnPageRef.current >= 5 && // ✅ Temps réduit
        !hasShownRef.current
      ) {
        triggerPopup('mouse_leave');
      }
    };

    // ═══════════════════════════════════════════════════════════
    // ✅ FIX #3 : INACTIVITÉ corrigée (30 secondes au lieu de 45)
    // ═══════════════════════════════════════════════════════════
    let inactivityTimer;
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      
      // ✅ Afficher après 30 secondes d'INACTIVITÉ (pas 30s + 30s)
      inactivityTimer = setTimeout(() => {
        if (!hasShownRef.current && timeOnPageRef.current >= 10) {
          triggerPopup('inactivity');
        }
      }, 30000); // 30 secondes d'inactivité
    };

    // ═══════════════════════════════════════════════════════════
    // ✅ FIX #4 : SCROLL BACK simplifié
    // ═══════════════════════════════════════════════════════════
    let lastScrollY = 0;
    let maxScrollDepth = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      const scrollDepth = scrollHeight > 0 ? (currentScrollY / scrollHeight) * 100 : 0;
      
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
      
      // ✅ Conditions SIMPLIFIÉES :
      // Si scrollé au moins 40% (au lieu de 60%)
      // ET remonte vers le haut (200px au lieu de 100px)
      if (
        maxScrollDepth >= 40 && // ✅ Seuil réduit
        currentScrollY < 200 &&  // ✅ Zone plus permissive
        lastScrollY - currentScrollY > 300 && // ✅ Détecte remontée rapide
        timeOnPageRef.current >= 15 && // ✅ Temps réduit
        !hasShownRef.current
      ) {
        triggerPopup('scroll_back');
      }
      
      lastScrollY = currentScrollY;
      resetInactivityTimer();
    };

    // ═══════════════════════════════════════════════════════════
    // ✅ NOUVEAU : TRIGGER TEMPS ABSOLU (Backup garantie)
    // ═══════════════════════════════════════════════════════════
    // Si aucun autre trigger après 60 secondes, afficher quand même
    const absoluteTimer = setTimeout(() => {
      if (!hasShownRef.current && timeOnPageRef.current >= 60) {
        triggerPopup('time_absolute');
      }
    }, 60000); // 60 secondes

    // Event listeners
    const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
    
    if (isDesktop) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }
    
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keydown', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
    document.addEventListener('touchstart', resetInactivityTimer); // ✅ Ajout mobile
    window.addEventListener('scroll', handleScroll);
    
    resetInactivityTimer();

    // Cleanup
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

  // ... (Reste du code identique : getPopupContent, handleSubmit, handleClose, JSX)
  
  // Contenu dynamique basé sur contexte utilisateur
  const getPopupContent = () => {
    switch (userContext) {
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

      // Track to analytics
      analytics?.track(EVENTS.EXIT_POPUP_EMAIL_SUBMITTED, {
        email: email,
        userContext: userContext
      });

      // Get user info for email & Google Sheets
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

      // ═════════════════════════════════════════════════════════
      // 1️⃣ ENVOYER EMAIL AVEC PIÈCE JOINTE + SAUVEGARDER LES DONNÉES
      // ═════════════════════════════════════════════════════════
      sendEmailWithAttachment(email, {
        userPattern,
        vitalityScore,
        context: userContext
      })
        .then(result => {
          if (result.success) {
            console.log('✅ Email envoyé avec succès et données sauvegardées');
            
            // 📊 Track: Email envoyé avec succès
            trackEvent('exit_popup_email_sent_success', {
              email: email.split('@')[0].substring(0, 3) + '***', // Anonymise l'email
              user_pattern: userPattern,
              vitality_score: vitalityScore,
              user_context: userContext,
              popup_duration_sec: Math.round((Date.now() - popupShownTimeRef.current) / 1000)
            });
          } else {
            console.warn('⚠️ Erreur lors de l\'envoi de l\'email:', result.message);
            
            // 📊 Track: Erreur lors de l'envoi
            trackEvent('exit_popup_email_sent_error', {
              error_message: result.message,
              user_context: userContext
            });
          }
        })
        .catch(err => {
          console.error('Erreur:', err);
          
          // 📊 Track: Exception lors de l'envoi
          trackEvent('exit_popup_email_exception', {
            error: err.message,
            user_context: userContext
          });
        });

      // ═════════════════════════════════════════════════════════
      // 2️⃣ SAUVEGARDER AUSSI DANS GOOGLE SHEETS (optionnel, backup)
      // ═════════════════════════════════════════════════════════
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
    // 📊 Track: Popup fermée sans envoi
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
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>

          {!submitted ? (
            <div className="p-8 md:p-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${popupContent.iconBg} flex items-center justify-center mx-auto mb-6`}
              >
                {popupContent.icon}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 flex justify-center"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-100 rounded-full border border-rose-300">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-semibold text-rose-800">
                    {popupContent.urgency}
                  </span>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight text-center"
              >
                {popupContent.headline}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg font-semibold text-gray-700 mb-4 text-center"
              >
                {popupContent.subheadline}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base text-gray-600 mb-6 leading-relaxed text-center"
              >
                {popupContent.description}
              </motion.p>

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

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-4"
              >
                {popupContent.showEmailForm ? (
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
                  <motion.button
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-6 py-4 bg-gradient-to-r ${popupContent.ctaColor} text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    {popupContent.cta}
                  </motion.button>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full px-6 py-2.5 text-gray-600 font-medium hover:text-gray-800 transition text-sm"
                >
                  No thanks, I'll miss out
                </button>
              </motion.div>

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