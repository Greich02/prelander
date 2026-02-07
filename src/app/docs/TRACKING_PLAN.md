# 📊 TRACKING PLAN - COMPLETE FUNNEL ANALYTICS

## OVERVIEW

Ce plan permet de tracker chaque étape du funnel pour optimiser les conversions.

---

## 1️⃣ HERO SECTION TRACKING

### Events à tracker:
```javascript
✅ hero_view - User lands on page
✅ hero_cta_click - User clicks "Begin Assessment"
✅ timer_view - User sees countdown timer
✅ spots_counter_view - User sees spots remaining
✅ scroll_to_quiz - User scrolled to quiz section
```

### Données à capturer:
- Timestamp
- Session ID
- Time on hero (en secondes)
- Device type (mobile/tablet/desktop)
- Traffic source (organic/paid/direct)

### Optimisation:
- Si < 20% click "Begin Assessment" → CTA copy needs work
- Si < 5% voir le countdown timer → Timer not visible enough
- Si beaucoup de scrolls mais peu de clicks → Content not convincing

---

## 2️⃣ QUIZ FUNNEL TRACKING

### Events à tracker:
```javascript
✅ quiz_start - User starts quiz (after Hero CTA)
✅ quiz_question_viewed - User sees each question (Q1, Q2, Q3, Q4, Q5)
✅ quiz_question_answered - User answers each question
✅ quiz_completed - User completes all 5 questions
✅ quiz_abandoned - User starts but doesn't finish
✅ quiz_completion_time - How long it took (should be ~1-2 mins)
```

### Données par question:
```javascript
{
  questionIndex: 0,
  selectedAnswer: "Deeply connected and energized",
  answerValue: 4,
  timeSpent: 15, // secondes
  isAutoAdvanced: true // auto-skip after selection
}
```

### Dropoff Analysis:
- Q1: If 20%+ quit here → Question too hard or confusing
- Q2: If 15%+ quit → Pattern becoming clear, users leaving
- Q3: If > Q2 dropoff → Fatigue setting in
- Q4: If > Q3 dropoff → Too long assessment
- Q5: If > Q4 dropoff → Final question unclear

---

## 3️⃣ RESULTS PAGE TRACKING

### Events à tracker:
```javascript
✅ results_view - User lands on /results page
✅ results_score_displayed - Score circle animation completes
✅ results_section_viewed - User scrolls to each section
✅ results_cta_click - User clicks "See What This Could Mean"
✅ results_time_on_page - Time spent on results page
```

### Score Distribution:
```javascript
Track distribution:
- Score 0-40 (High Revival) - X users
- Score 41-70 (Moderate Blockage) - X users
- Score 71-100 (Strong Foundation) - X users

Compare conversion by score:
- Which score range converts best to bridge page?
- Which score sends most exit popups?
```

---

## 4️⃣ EXIT POPUP TRACKING

### Events à tracker:
```javascript
✅ exit_popup_triggered - Popup shows (track trigger type)
  - exit_attempt_tab_close
  - exit_attempt_back_button
  - exit_attempt_tab_change
  
✅ exit_popup_shown - Popup visible
✅ exit_popup_email_submitted - User submits email ⭐ CONVERSION
✅ exit_popup_dismissed - User closes popup
✅ exit_popup_cta_clicked - User clicks "Resume Quiz" or "Start Quiz"
```

### Données à Google Sheets:
```javascript
{
  timestamp: "2026-02-07T14:23:45Z",
  email: "user@example.com",
  userPattern: "The Disconnected Seeker",
  vitalityScore: 35,
  sessionId: "session_123456",
  popupTrigger: "exit_attempt_tab_close",
  timeOnPageBeforePopup: 45,
  hasCompletedQuiz: false,
  conversionPoint: "email_capture" ✅
}
```

### Analysis:
- Conversion rate (email submissions / popup shows) - Target: > 15%
- By trigger type: Which exit intent converts best?
- Time on page: Do users need more time to submit?
- By user pattern: Do some patterns submit more emails?

---

## 5️⃣ BRIDGE PAGE TRACKING

### Events à tracker:
```javascript
✅ bridge_view - User lands on /bridge
✅ bridge_scroll_depth - How far user scrolls (25%, 50%, 75%, 100%)
✅ bridge_time_on_page - Total time spent
✅ bridge_cta_click - User clicks "See How This Works"
✅ bridge_to_offer - User leaves bridge (redirect to VSL)
```

### Conversion funnel:
```javascript
Quiz Completed: 100%
     ↓
Results Viewed: X%
     ↓
Bridge Viewed: X%
     ↓
Offer Clicked: X% ← FINAL CONVERSION
```

---

## 6️⃣ EXIT INTENT TRACKING

### Types d'exits à tracker:
```javascript
✅ exit_tab_close - beforeunload event
✅ exit_back_button - popstate event
✅ exit_tab_switch - visibilitychange event
```

### Par page:
```javascript
Hero page:
- % attempting to leave without quiz
- % submitting email via popup
- % restarting quiz via popup

Results page:
- % leaving without seeing bridge
- % submitting email before leaving
- % continuing to bridge

Bridge page:
- % leaving before seeing offer
- % submitting email before leaving
- % clicking offer
```

---

## 7️⃣ CONVERSION METRICS DASHBOARD

### Top-level KPIs:
```javascript
1. Quiz Start Rate = Quiz Starts / Page Views
   Target: > 25%

2. Quiz Completion Rate = Quiz Completions / Quiz Starts
   Target: > 85%

3. Email Capture Rate (Exit Popup) = Emails Submitted / Exit Popups
   Target: > 15%

4. Results to Bridge Rate = Bridge Clicks / Results Views
   Target: > 40%

5. Bridge to Offer Rate = Offer Clicks / Bridge Views
   Target: > 30%

6. End-to-End Conversion = Offer Clicks / Page Views
   Target: > 3%
```

### Revenue Metrics:
```javascript
Cost Per Lead = Ad Spend / Emails Captured
Cost Per Click = Ad Spend / Offer Clicks
Cost Per Sale = Ad Spend / Actual Sales (if tracked)
```

---

## 8️⃣ DEVICE & GEO TRACKING

### By Device:
```javascript
Mobile vs Desktop:
- Quiz completion rate differs?
- Exit popup conversion differs?
- Which device sends more traffic?
```

### By Traffic Source:
```javascript
- Organic: How do users behave?
- Paid Ads: Different conversion rates?
- Direct: Cold traffic analysis
```

---

## 9️⃣ SESSION HEATMAP

Track complete user journeys:
```javascript
Session 1: Hero → Quiz (Q1→Q2→Q3→Q4→Q5) → Results → Exit Popup (Email) ✅
Session 2: Hero → Quiz (Q1→Q2→QUIT) → Exit Popup (Dismissed)
Session 3: Hero → Results (direct skip?) → Bridge → Offer ✅

Identify patterns:
- Which paths convert?
- Where do most users drop?
- What's the fastest path to conversion?
```

---

## 🔟 IMPLEMENTATION CHECKLIST

- [x] Analytics utility created (`utils/analytics.js`)
- [x] Google Sheets integration (`utils/googleSheets.js`)
- [x] ExitPopup sends emails to Google Sheets
- [ ] Add tracking to Hero.js (quiz start)
- [ ] Add tracking to QuizStepper.js (question tracking)
- [ ] Add tracking to Results.js (score/CTA)
- [ ] Add tracking to bridge components
- [ ] Create Google Sheets dashboard for visualization
- [ ] Set up automated alerts (email when > 100 leads)
- [ ] Weekly analytics review & optimization

---

## NEXT STEPS

1. Configure Google Sheets webhook (see GOOGLE_SHEETS_SETUP.js)
2. Add NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK to .env.local
3. Test email submission via ExitPopup
4. Integrate tracking across all pages
5. Create automated dashboard in Google Sheets
6. Run first week of analytics
7. Optimize based on data

---

## QUESTIONS TO ANSWER WITH DATA

✅ What's our biggest bottleneck?
✅ Which user pattern converts best?
✅ Does timing matter (early vs late exit popups)?
✅ Is the quiz too long? (check Q3/Q4/Q5 dropoff)
✅ Does the timer create urgency or anxiety?
✅ Which CTA copy converts best?
✅ What's the ideal time on results page?
✅ Are mobile users different from desktop?
✅ Where do paid ads underperform?
✅ Which traffic source sends best quality leads?
`;

export default TRACKING_PLAN;
