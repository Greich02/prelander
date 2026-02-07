/**
 * Analytics & Tracking System
 * Tracks user behavior across the entire funnel for optimization
 */

const EVENTS = {
  // Hero Section
  HERO_VIEW: 'hero_view',
  HERO_CTA_CLICK: 'hero_cta_click',
  TIMER_EXPIRY: 'timer_expiry',
  
  // Quiz
  QUIZ_START: 'quiz_start',
  QUIZ_QUESTION_ANSWERED: 'quiz_question_answered',
  QUIZ_COMPLETED: 'quiz_completed',
  QUIZ_ABANDONED: 'quiz_abandoned',
  
  // Results
  RESULTS_VIEW: 'results_view',
  RESULTS_CTA_CLICK: 'results_cta_click',
  
  // Bridge
  BRIDGE_VIEW: 'bridge_view',
  BRIDGE_CTA_CLICK: 'bridge_cta_click',
  
  // Exit Popup
  EXIT_POPUP_SHOWN: 'exit_popup_shown',
  EXIT_POPUP_EMAIL_SUBMITTED: 'exit_popup_email_submitted',
  EXIT_POPUP_DISMISSED: 'exit_popup_dismissed',
  
  // Exit Intents
  EXIT_ATTEMPT_TAB_CLOSE: 'exit_attempt_tab_close',
  EXIT_ATTEMPT_BACK_BUTTON: 'exit_attempt_back_button',
  EXIT_ATTEMPT_TAB_CHANGE: 'exit_attempt_tab_change',
};

class Analytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.events = [];
    this.userPattern = null;
    this.vitalityScore = null;
    
    // Initialize session in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_session_id', this.sessionId);
      localStorage.setItem('analytics_start_time', this.startTime);
    }
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track any event
   * @param {string} eventName - Event type from EVENTS constant
   * @param {object} metadata - Additional data about the event
   */
  track(eventName, metadata = {}) {
    if (typeof window === 'undefined') return;

    const event = {
      name: eventName,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      timeOnPage: Date.now() - this.startTime,
      currentUrl: window.location.pathname,
      userPattern: this.userPattern,
      vitalityScore: this.vitalityScore,
      ...metadata
    };

    this.events.push(event);
    console.log('📊 Analytics Event:', event.name, metadata);

    // Send to backend immediately for important events
    if ([
      EVENTS.EXIT_POPUP_EMAIL_SUBMITTED,
      EVENTS.QUIZ_COMPLETED,
      EVENTS.EXIT_ATTEMPT_TAB_CLOSE,
      EVENTS.EXIT_ATTEMPT_BACK_BUTTON
    ].includes(eventName)) {
      this.sendEvent(event);
    }
  }

  /**
   * Set user vitality score and pattern
   */
  setUserInfo(score, pattern) {
    this.vitalityScore = score;
    this.userPattern = pattern;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_vitality_score', score);
      localStorage.setItem('analytics_user_pattern', pattern);
    }
  }

  /**
   * Send event to backend
   */
  async sendEvent(event) {
    try {
      // Send to your backend endpoint
      // For now, this logs to console; you'll replace with actual API call
      console.log('📤 Sending event to backend:', event);
      
      // Example: send to your own API
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
    } catch (error) {
      console.error('Error sending analytics event:', error);
    }
  }

  /**
   * Get session summary
   */
  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      duration: Date.now() - this.startTime,
      userPattern: this.userPattern,
      vitalityScore: this.vitalityScore,
      events: this.events
    };
  }

  /**
   * Send all events (on page unload or completion)
   */
  async sendSessionSummary() {
    if (typeof window === 'undefined' || this.events.length === 0) return;

    const summary = this.getSessionSummary();
    
    try {
      // Send complete session summary to backend
      console.log('📊 Final Session Summary:', summary);
      
      // Example: send to your own API
      // await fetch('/api/analytics/session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(summary),
      //   keepalive: true // Important for sending on unload
      // });
    } catch (error) {
      console.error('Error sending session summary:', error);
    }
  }
}

// Create global analytics instance
let analyticsInstance = null;

export const getAnalytics = () => {
  if (typeof window === 'undefined') return null;
  
  if (!analyticsInstance) {
    analyticsInstance = new Analytics();
  }
  
  return analyticsInstance;
};

export { EVENTS, Analytics };
