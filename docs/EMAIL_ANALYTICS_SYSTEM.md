# 📊 EMAIL CAPTURE & ANALYTICS SYSTEM

## Overview

Système complet pour:
1. **Capturer les emails** via ExitPopup → Google Sheets
2. **Tracker l'activité** des visiteurs sur chaque étape du funnel
3. **Optimiser les conversions** basées sur les données

---

## ✨ Features

### ✅ Email Capture (Live)
- ExitPopup envoie emails directement à Google Sheets
- Captures: Email + User Pattern + Vitality Score + Session ID
- Temps réel (< 5 secondes pour apparaître dans Google Sheets)

### ✅ Analytics System (Ready)
- Event tracking sur tout le funnel
- Session-based tracking (chaque visiteur = ID unique)
- Structured logging pour futures analyses

### ✅ Visitor Behavior Tracking (Ready to implement on pages)
- Quiz: Questions answered, completion time, dropoff points
- Results: Time on page, CTA clicks, score distribution
- Bridge: Scroll depth, engagement, CTA conversions
- Exit intents: Track why users leave (type of exit)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Google Apps Script Webhook
1. Go to https://sheets.google.com
2. Create new sheet "Prelander Emails"
3. Tools → Script Editor → Paste code from `docs/QUICK_START.md`
4. Deploy as Web app → Copy URL

### Step 2: Configure Environment
Add to `.env.local`:
```
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK=https://script.google.com/macros/d/YOUR_ID/useweb
```

### Step 3: Restart & Test
```bash
npm run dev
```

---

## 📁 Files Created

```
src/app/
├── utils/
│   ├── analytics.js          # Event tracking system
│   └── googleSheets.js       # Google Sheets submission
├── components/
│   └── ExitPopup.js          # ✨ UPDATED - sends to Google Sheets
└── docs/
    ├── QUICK_START.md        # 5-min setup guide
    ├── GOOGLE_SHEETS_SETUP.js # Detailed instructions
    └── TRACKING_PLAN.md      # Complete funnel strategy
```

---

## 📊 Current Data Flow

```
User submits email in ExitPopup
         ↓
analyticsInstance tracks event
         ↓
submitEmailToGoogleSheets() called
         ↓
Google Apps Script webhook receives data
         ↓
Data appended to Google Sheet
         ↓
Email visible in Google Sheets (< 5 sec) ✅
```

---

## 🎯 Metrics to Track

### Week 1 Baseline
- Total page views
- Quiz starts
- Quiz completions
- Email captures via popup
- Exit popup trigger rate

### Week 2+ Analysis
- Quiz completion rate by pattern
- Email conversion rate by page location
- Exit popup conversion by trigger type
- Time on page vs conversion

---

## 🔧 Integration Checklist

- [x] Google Sheets webhook system
- [x] Email capture in ExitPopup
- [x] Analytics event system
- [x] Session tracking
- [ ] Track Hero → Quiz transitions
- [ ] Track Quiz → Results transitions
- [ ] Track Results → Bridge transitions
- [ ] Track Bridge → Offer conversions
- [ ] Google Sheets dashboard (formulas)
- [ ] Automated email alerts on new leads

---

## 📈 Next Steps

### Phase 1: Foundation (Week 1)
- Test email capture
- Manual weekly data review
- Identify biggest bottleneck

### Phase 2: Quiz Tracking (Week 2)
- Add tracking to QuizStepper.js
- Identify which questions cause dropoff
- Monitor time per question

### Phase 3: Full Funnel (Week 3-4)
- Add tracking to Results, Bridge pages
- Analyze conversion by user pattern
- Test hypotheses with A/B tests

### Phase 4: Optimization (Week 5+)
- Automate dashboard in Google Sheets
- Create weekly reports
- Implement improvements based on data

---

## 💡 Optimization Ideas

Based on data you'll collect:

**If email conversion low:**
- Increase popup urgency
- Change value offer
- Test different timing

**If quiz completion low:**
- Reduce number of questions
- Add progress indicators
- Make questions clearer

**If results-to-bridge low:**
- Improve results page copy
- Make score circle more impressive
- Add social proof earlier

**If bridge-to-offer low:**
- Bridge page too educational (feels salesy)
- CTA placement wrong
- VSL page has high friction

---

## 🛠️ Implementation Examples

### Track Hero CTA Click
```javascript
// In Hero.js
const analytics = getAnalytics();
const handleStartWithSpotReduction = () => {
  analytics.track(EVENTS.HERO_CTA_CLICK, {
    spotsBefore: spotsLeft,
    timeOnHero: Date.now() - heroStartTime
  });
  // ... existing code
};
```

### Track Quiz Completion
```javascript
// In QuizStepper.js
const analytics = getAnalytics();
// After quiz complete:
analytics.track(EVENTS.QUIZ_COMPLETED, {
  totalScore: score,
  timeSpent: completionTime,
  questionsAnswered: 5
});
```

### Track Results Page Time
```javascript
// In Results.js
useEffect(() => {
  const startTime = Date.now();
  return () => {
    const timeOnPage = Date.now() - startTime;
    analytics.track(EVENTS.RESULTS_VIEW, {
      vitalityScore,
      timeOnPage
    });
  };
}, []);
```

---

## 📞 Troubleshooting

**Emails not appearing in Google Sheets?**
1. Check webhook URL in .env.local
2. Restart dev server (important!)
3. Check browser console (F12) for errors
4. Verify Google Apps Script deployed correctly

**Want to see all events?**
Check browser console (F12) - all analytics events logged there

**Need help?**
See `docs/QUICK_START.md` for detailed troubleshooting

---

## 🎓 Learning Resources

- Google Apps Script docs: https://developers.google.com/apps-script
- Analytics best practices: https://www.measurementprotocol.com
- Funnel optimization: https://cxl.com/blog/conversion-rate-optimization/

---

## 🎉 You're All Set!

Email capture is live. Now:
1. Send test email via ExitPopup
2. Verify it appears in Google Sheets
3. Plan optimization based on Week 1 data
4. Add tracking to other pages as per checklist

Happy optimizing! 🚀
