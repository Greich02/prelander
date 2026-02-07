# 🚀 QUICK START: EMAIL CAPTURE & ANALYTICS

## ✅ What's Been Set Up

### 1. Google Sheets Integration
- ExitPopup now sends emails directly to Google Sheets
- Captures: Email, User Pattern, Vitality Score, Session ID, User Agent, Referrer

### 2. Analytics System
- Track events across entire funnel
- Session-based tracking (each visitor gets unique ID)
- Ready for dashboard creation

---

## 🔧 SETUP IN 5 MINUTES

### Step 1: Create Google Apps Script

1. Go to https://sheets.google.com
2. Create new sheet named "Prelander Emails"
3. Add columns: `Timestamp | Email | User Pattern | Vitality Score | Session ID | User Agent | Referrer | Event Type`
4. Go to **Tools → Script Editor**
5. Copy this code:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSheet();
    
    sheet.appendRow([
      new Date().toISOString(),
      data.email || '',
      data.userPattern || '',
      data.vitalityScore || '',
      data.sessionId || '',
      data.userAgent || '',
      data.referrer || '',
      data.eventType || 'email_submission'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved',
        email: data.email
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

6. Click **Deploy → New Deployment**
7. Choose **Type: Web app**
8. Set **Execute as: Your Account**
9. Set **Who has access: Anyone**
10. Click **Deploy** and copy the URL

### Step 2: Add Webhook URL

1. Open `.env.local` in your project
2. Add this line:
```
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK=https://script.google.com/macros/d/YOUR_SCRIPT_ID/useweb
```
3. Replace `YOUR_SCRIPT_ID` with the ID from step 1

4. Restart your dev server

### Step 3: Test It!

1. Open your site
2. Trigger exit popup (close tab / back button)
3. Submit an email
4. Check your Google Sheet - email should appear! ✅

---

## 📊 TRACKING EVENTS (Ready to Implement)

The analytics system tracks these events:

### Quiz Events
- `quiz_start` - User begins quiz
- `quiz_question_answered` - User answers question X
- `quiz_completed` - All 5 questions done
- `quiz_abandoned` - User quit early

### Results Events
- `results_view` - User lands on /results
- `results_cta_click` - User clicks CTA

### Exit Popup Events
- `exit_popup_shown` - Popup appears
- `exit_popup_email_submitted` - User submits email ⭐
- `exit_popup_dismissed` - User closes popup

### Page Events
- `hero_view` - User lands on hero
- `bridge_view` - User reaches bridge page
- `exit_attempt_tab_close` - User tries to close tab
- `exit_attempt_back_button` - User hits back button

---

## 🎯 KEY METRICS TO MONITOR

```javascript
Week 1:
- Total visitors: ____ 
- Quiz starts: ____ (target: > 25% of visitors)
- Quiz completions: ____ (target: > 85% of starters)
- Email captures via popup: ____ (target: > 15% of popup shows)

Calculate:
- Quiz completion rate = Completions / Starts
- Email conversion rate = Emails / Popup Shows
- Exit popup trigger rate = Popup Shows / Page Views
```

---

## 📈 NEXT STEPS (Implement in Order)

### Week 1: Foundation
- [x] Google Sheets integration
- [x] Email capture working
- [ ] Manual weekly report from Google Sheets
- [ ] Identify biggest bottleneck

### Week 2: Quiz Tracking
- [ ] Track which questions people quit on
- [ ] Monitor average time per question
- [ ] Identify if quiz is too long

### Week 3: Pattern Analysis
- [ ] See which user patterns convert best
- [ ] Analyze quiz answer distribution
- [ ] Check if certain patterns need different CTA

### Week 4: Advanced
- [ ] Device/geo breakdown
- [ ] Traffic source analysis
- [ ] Create automated dashboard
- [ ] A/B test different CTAs

---

## 💡 OPTIMIZATION IDEAS (Based on Data)

If emails are low (< 10% conversion):
→ Increase exit popup urgency
→ Try different value offer
→ Track exit popup timing

If quiz completion is low (< 70%):
→ Check which question people quit on
→ Shorten quiz? (reduce from 5 to 4 questions)
→ Add encouragement messages between questions

If results CTA is low (< 20% to bridge):
→ Results copy not convincing enough
→ Score circle not visually appealing enough
→ Bridge page intro not compelling

If bridge CTA is low (< 25%):
→ Bridge page educational content feels salesy
→ CTA placement wrong (too far down)
→ VSL page is red flag for users

---

## 🔗 RELATED FILES

- `/src/app/utils/analytics.js` - Event tracking system
- `/src/app/utils/googleSheets.js` - Google Sheets submission
- `/src/app/docs/GOOGLE_SHEETS_SETUP.js` - Detailed setup guide
- `/src/app/docs/TRACKING_PLAN.md` - Complete tracking strategy
- `/src/app/components/ExitPopup.js` - Email capture (already integrated!)

---

## ❓ TROUBLESHOOTING

**Emails not appearing in Google Sheets?**
- Check webhook URL in .env.local is correct
- Restart dev server (changes to .env.local require restart)
- Check browser console for errors
- Verify Google Apps Script deployed as "Web app" with "Anyone" access

**Getting CORS errors?**
- Google Apps Script handles CORS automatically
- Should be no CORS issues with this setup

**Want to add more tracking?**
1. Call `getAnalytics().track(EVENTS.MY_EVENT, {data})`
2. Event automatically gets session ID, timestamp, page URL
3. Data sent to backend (see analytics.js for endpoint)

---

## 📞 SUPPORT

For issues:
1. Check browser console (F12) for errors
2. Check Google Apps Script execution logs (Script Editor → Execution)
3. Verify .env.local has correct webhook URL
4. Test with postman: POST to webhook URL with sample data

Good luck! 🚀
