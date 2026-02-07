# 📋 CHECKLIST: AJOUTER TRACKING À CHAQUE PAGE

## Vue d'ensemble

Voici la liste des tracking à ajouter à chaque composant pour avoir une vue complète du funnel.

---

## ✅ Hero.js - À FAIRE

```javascript
// Import
import { getAnalytics, EVENTS } from '@/app/utils/analytics';

// Dans le composant:
export default function Hero() {
  const analytics = getAnalytics();
  const [heroStartTime] = useState(Date.now());

  // Track hero view
  useEffect(() => {
    analytics.track(EVENTS.HERO_VIEW, {
      device: window.innerWidth < 768 ? 'mobile' : 'desktop',
      source: new URLSearchParams(window.location.search).get('utm_source')
    });
  }, []);

  // Track CTA click
  const handleStartWithSpotReduction = () => {
    const timeOnHero = Date.now() - heroStartTime;
    analytics.track(EVENTS.HERO_CTA_CLICK, {
      timeOnHero,
      spotsLeft,
      timerRemaining: timeLeft
    });
    
    // Existing code...
    if (spotsLeft > 0) {
      setSpotsLeft(spotsLeft - 1);
    }
    setShowQuiz(true);
  };

  // Track timer expiry
  useEffect(() => {
    if (timeLeft === 0 && timeLeft !== initialTimeLeft) {
      analytics.track(EVENTS.TIMER_EXPIRY, {
        timeOnPage: Date.now() - heroStartTime
      });
    }
  }, [timeLeft]);
}
```

---

## ✅ QuizStepper.js - À FAIRE

```javascript
// Import
import { getAnalytics, EVENTS } from '@/app/utils/analytics';

export default function QuizStepper({ autoStart = false, onBackClick = null }) {
  const [quizStartTime] = useState(Date.now());
  const analytics = getAnalytics();

  // Track quiz start
  useEffect(() => {
    if (hasStarted) {
      analytics.track(EVENTS.QUIZ_START, {
        autoStart: autoStart,
        timeToStart: hasStarted ? (Date.now() - quizStartTime) : 0
      });
    }
  }, [hasStarted]);

  // Track each question answered
  const handleSelectOption = (option) => {
    const answers = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
    const currentQuestionIndex = currentStep;
    
    analytics.track(EVENTS.QUIZ_QUESTION_ANSWERED, {
      questionIndex: currentQuestionIndex,
      selectedAnswer: option.text,
      selectedValue: option.value,
      timeSpentOnQuestion: Date.now() - questionStartTime
    });

    // Existing code...
    setAnswers({ ...answers, [currentQuestionIndex]: option.text });
    setTotalScore(totalScore + option.value);
  };

  // Track quiz completion
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const quizDuration = Date.now() - quizStartTime;
      
      // Déterminer le pattern
      const scorePercentage = Math.round((totalScore / (questions.length * 4)) * 100);
      let userPattern = 'Unknown';
      if (scorePercentage <= 40) {
        userPattern = 'The Disconnected Seeker';
      } else if (scorePercentage <= 70) {
        userPattern = 'The Fluctuating Spirit';
      } else {
        userPattern = 'The Awakening Guardian';
      }

      // Track completion
      analytics.setUserInfo(scorePercentage, userPattern);
      analytics.track(EVENTS.QUIZ_COMPLETED, {
        totalScore: totalScore,
        scorePercentage: scorePercentage,
        userPattern: userPattern,
        quizDuration: quizDuration,
        questionsAnswered: Object.keys(answers).length
      });

      // Existing code...
      const results = {
        answers,
        totalScore,
        completedAt: new Date().toISOString(),
        timeSpent: quizDuration
      };
      localStorage.setItem('quizResults', JSON.stringify(results));
      window.location.href = '/results';
    }
  };

  // Track quiz abandonment (if user goes back)
  const handleBack = () => {
    if (hasStarted && currentStep > 0) {
      const questionsAnswered = Object.keys(answers).length;
      analytics.track(EVENTS.QUIZ_ABANDONED, {
        questionsAnswered: questionsAnswered,
        questionsRemaining: questions.length - questionsAnswered,
        timeSpent: Date.now() - quizStartTime,
        abandonedAt: `question_${currentStep}`
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
}
```

---

## ✅ Results.js - À FAIRE

```javascript
// Import
import { getAnalytics, EVENTS } from '@/app/utils/analytics';

export default function Results({ isVisible, onCTAClick }) {
  const [resultsStartTime] = useState(Date.now());
  const analytics = getAnalytics();

  // Track results view
  useEffect(() => {
    analytics.track(EVENTS.RESULTS_VIEW, {
      vitalityScore: vitalityScore,
      userPattern: scoreCategory?.pattern,
      timeToResults: resultsStartTime ? (Date.now() - resultsStartTime) : 0
    });
  }, [vitalityScore, scoreCategory]);

  // Track CTA clicks
  const handlePrimaryClick = (ctaPosition = 'final') => {
    const timeOnResults = Date.now() - resultsStartTime;
    
    analytics.track(EVENTS.RESULTS_CTA_CLICK, {
      ctaPosition: ctaPosition,
      vitalityScore: vitalityScore,
      userPattern: scoreCategory?.pattern,
      timeOnResults: timeOnResults,
      scrollDepth: getScrollDepth() // voir fonction ci-dessous
    });

    // Existing code...
    window.location.href = 'https://your-offer-url.com';
  };

  // Helper: Calculer scroll depth
  const getScrollDepth = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    return Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
  };

  // Cleanup: Track time on page si user ferme
  useEffect(() => {
    return () => {
      const timeOnPage = Date.now() - resultsStartTime;
      analytics.track(EVENTS.RESULTS_VIEW, {
        exit: true,
        timeOnResults: timeOnPage,
        scrollDepth: getScrollDepth()
      });
    };
  }, []);
}
```

---

## ✅ Bridge Components - À FAIRE

```javascript
// Bridge/page.js
import { getAnalytics, EVENTS } from '@/app/utils/analytics';

export default function BridgePage() {
  const [bridgeStartTime] = useState(Date.now());
  const analytics = getAnalytics();

  useEffect(() => {
    analytics.track(EVENTS.BRIDGE_VIEW, {
      referrer: 'results_page'
    });

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercentage === 25) {
        analytics.track(EVENTS.BRIDGE_SCROLL_DEPTH, { depth: 25 });
      }
      if (scrollPercentage === 50) {
        analytics.track(EVENTS.BRIDGE_SCROLL_DEPTH, { depth: 50 });
      }
      if (scrollPercentage === 75) {
        analytics.track(EVENTS.BRIDGE_SCROLL_DEPTH, { depth: 75 });
      }
      if (scrollPercentage === 100) {
        analytics.track(EVENTS.BRIDGE_SCROLL_DEPTH, { depth: 100 });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = () => {
    const timeOnBridge = Date.now() - bridgeStartTime;
    
    analytics.track(EVENTS.BRIDGE_CTA_CLICK, {
      timeOnBridge: timeOnBridge,
      scrollDepth: getScrollDepth()
    });

    // Redirect to VSL
    window.location.href = 'https://your-vsl-url.com';
  };
}
```

---

## ✅ ExitPopup.js - DÉJÀ FAIT ✓

```javascript
// Déjà implémenté:
✅ EVENTS.EXIT_POPUP_SHOWN - Quand popup affichée
✅ EVENTS.EXIT_POPUP_EMAIL_SUBMITTED - Quand email soumis
✅ EVENTS.EXIT_POPUP_DISMISSED - Quand popup fermée
✅ Soumission à Google Sheets - Déjà intégrée

// Ce qui fonctionne:
const analytics = getAnalytics();
analytics.track(EVENTS.EXIT_POPUP_EMAIL_SUBMITTED, {
  email: email,
  userContext: userContext
});
```

---

## 📊 AJOUTER NOUVEAUX EVENTS (Optional)

Si tu veux tracker plus de détails:

```javascript
// Dans analytics.js, ajouter:
export const EVENTS = {
  // ... existing events ...
  
  // Scroll tracking
  SCROLL_DEPTH_25: 'scroll_depth_25',
  SCROLL_DEPTH_50: 'scroll_depth_50',
  SCROLL_DEPTH_75: 'scroll_depth_75',
  SCROLL_DEPTH_100: 'scroll_depth_100',
  
  // Section visibility
  HERO_SECTION_VIEW: 'hero_section_view',
  RESULTS_SCORE_VISIBLE: 'results_score_visible',
  BRIDGE_CONTENT_VISIBLE: 'bridge_content_visible',
  
  // Button hovers
  CTA_HOVERED: 'cta_hovered',
  EMAIL_FORM_FOCUSED: 'email_form_focused',
  
  // Time-based
  TIME_ON_PAGE_30S: 'time_on_page_30s',
  TIME_ON_PAGE_1M: 'time_on_page_1m',
  TIME_ON_PAGE_2M: 'time_on_page_2m'
};
```

---

## 🔄 ORDRE D'IMPLÉMENTATION

### Week 1 Priority: ⭐ (Essentials)
- [ ] Hero.js tracking
- [ ] QuizStepper.js tracking
- [ ] Results.js tracking (CTA click)

### Week 2: 🔥 (High Impact)
- [ ] Bridge.js tracking
- [ ] Scroll depth tracking
- [ ] Time on page tracking

### Week 3+: 💎 (Nice to have)
- [ ] Hover tracking
- [ ] Form focus tracking
- [ ] Advanced user patterns

---

## 📈 RÉSULTAT FINAL

Avec tous ces trackings, tu auras:

```
User Journey Tracking:
Hero View → Quiz Start → Quiz Q1-Q5 Answers → Quiz Complete 
  ↓
Results View → Score → Results CTA Click
  ↓
Bridge View → Scroll Tracking → Bridge CTA Click → VSL
  ↓
Exit Popup Shown → Email Submitted → Google Sheets ✅

Plus: Exit Intent Tracking
- Tab Close Attempt → Popup → Email Capture
- Back Button → Popup → Email Capture  
- Tab Switch → Popup → Email Capture
```

Chaque événement avec timestamps, session IDs, device info, patterns.

**Data-driven optimization devient possible!** 📊

---

## ⏱️ Temps d'implémentation estimé

- Hero.js: 10 minutes
- QuizStepper.js: 15 minutes
- Results.js: 10 minutes
- Bridge.js: 10 minutes
- **Total: ~45 minutes**

Et ça te donne une vue complète du funnel!

---

## 🎯 Une fois implémenté

Tu peux:
- Voir exactement où les gens droppent
- Comprendre les patterns qui convertissent
- Optimiser avec DATA au lieu de guesses
- Augmenter ROI des ads
- Scaler ce qui fonctionne

C'est le fondement du marketing moderne! 🚀
