/**
 * SETUP GUIDE: Google Sheets Integration
 * 
 * This guide explains how to set up Google Sheets to receive emails from ExitPopup
 */

const SETUP_GUIDE = `
# 🎯 GOOGLE SHEETS INTEGRATION - COMPLETE SETUP

## Step 1: Create a Google Sheet

1. Go to https://sheets.google.com
2. Create a new spreadsheet named "Prelander - Exit Popup Emails"
3. Set up columns:
   - Column A: Timestamp
   - Column B: Email
   - Column C: User Pattern
   - Column D: Vitality Score
   - Column E: Session ID
   - Column F: User Agent
   - Column G: Referrer

Example header row:
Timestamp | Email | User Pattern | Vitality Score | Session ID | User Agent | Referrer

## Step 2: Create Google Apps Script Webhook

1. Open your Google Sheet
2. Go to Tools → Script Editor
3. Replace the code with the following:

---
// Google Apps Script Code (paste in Script Editor)

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Add new row with data
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
        message: 'Email saved to Google Sheets',
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

---

4. Click "Deploy" → "New deployment"
5. Select "Type" → "Web app"
6. Set "Execute as": Your Google Account
7. Set "Who has access": "Anyone"
8. Click "Deploy"
9. Copy the deployment URL (looks like: https://script.google.com/macros/d/[ID]/useweb)

## Step 3: Add Webhook URL to Environment

1. Open your project's .env.local file
2. Add the line:
   NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK=https://script.google.com/macros/d/[YOUR_ID]/useweb

3. Restart your development server

## Step 4: Test the Integration

1. Open your site in browser
2. Go to ExitPopup
3. Submit an email
4. Check your Google Sheet - the email should appear within seconds!

## TRACKING EVENTS

The system automatically tracks these events in Google Sheets:

### Exit Popup Events
- Email submitted (with user pattern & score)
- Popup shown
- Popup dismissed

### Quiz Events
- Quiz started
- Each question answered (progressive tracking)
- Quiz completed (final score captured)
- Quiz abandoned

### Pages Events
- Hero page viewed
- Results page viewed
- Bridge page viewed

### Exit Intent Events
- User attempted to close tab
- User clicked back button
- User switched tabs

## ADVANCED: Using Zapier (Alternative)

If you prefer Zapier integration:

1. Create a Zapier account (zapier.com)
2. Create a "Catch Webhooks" trigger
3. Set it to send data to Google Sheets
4. Use the Zapier webhook URL in your .env.local

Benefits:
- No coding required
- Built-in error handling
- Email notifications on new submissions
- Data filtering and formatting

Cost: ~\$20/month for production use

## ANALYSIS IDEAS

With this data, you can:

1. **Conversion Optimization**
   - Track which patterns convert best
   - Identify drop-off points in quiz
   - Optimize CTA placement

2. **User Insights**
   - See which user patterns submit emails most
   - Identify pain points in user journey
   - Time to completion analysis

3. **A/B Testing**
   - Compare different CTA copy
   - Test different color schemes
   - Measure urgency timer impact

4. **Segment Analysis**
   - Which patterns have highest engagement
   - Geographic/device analysis via user agent
   - Traffic source analysis via referrer

## TROUBLESHOOTING

**Emails not appearing in Google Sheets?**
- Check that webhook URL is correct in .env.local
- Check browser console for errors
- Verify Google Apps Script is deployed as "Web app" with "Anyone" access
- Check Google Apps Script execution logs

**Getting CORS errors?**
- Google Apps Script handles CORS automatically
- If issues persist, add a simple CORS proxy

**Want to add more fields?**
- Edit the Google Apps Script to add columns
- Update the googleSheets.js submitEmailToGoogleSheets function
- Restart dev server
`;

export default SETUP_GUIDE;
