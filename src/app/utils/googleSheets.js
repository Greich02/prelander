/**
 * Google Sheets Integration
 * Submits emails and user data to Google Sheets via Apps Script webhook
 */

/**
 * Submit email to Google Sheets
 * @param {string} email - User email
 * @param {string} userPattern - User's vitality pattern
 * @param {number} vitalityScore - User's vitality score
 * @returns {Promise<object>}
 */
export async function submitEmailToGoogleSheets(email, userPattern, vitalityScore) {
  try {
    // Get your Google Apps Script webhook URL and replace below
    const GOOGLE_SHEETS_WEBHOOK_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK || '';
    
    if (!GOOGLE_SHEETS_WEBHOOK_URL) {
      console.warn('Google Sheets webhook URL not configured');
      return { success: false, message: 'Configuration missing' };
    }

    const payload = {
      email,
      userPattern,
      vitalityScore,
      timestamp: new Date().toISOString(),
      sessionId: typeof window !== 'undefined' ? localStorage.getItem('analytics_session_id') : null,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      referrer: typeof document !== 'undefined' ? document.referrer : null
    };

    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Email submitted to Google Sheets:', result);
    
    return { 
      success: true, 
      message: 'Email saved successfully',
      data: result
    };

  } catch (error) {
    console.error('❌ Error submitting to Google Sheets:', error);
    return { 
      success: false, 
      message: error.message 
    };
  }
}

/**
 * Log page view
 */
export function logPageView(pageName) {
  try {
    const GOOGLE_SHEETS_WEBHOOK_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK || '';
    
    if (!GOOGLE_SHEETS_WEBHOOK_URL) return;

    const payload = {
      eventType: 'page_view',
      pageName,
      timestamp: new Date().toISOString(),
      sessionId: typeof window !== 'undefined' ? localStorage.getItem('analytics_session_id') : null,
    };

    // Send asynchronously without blocking
    fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(err => console.error('Error logging page view:', err));

  } catch (error) {
    console.error('Error in logPageView:', error);
  }
}
