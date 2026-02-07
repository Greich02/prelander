import { useState, useEffect } from 'react';
import { Sparkles, Target, Zap, Heart, CheckCircle, Brain } from 'lucide-react';

const NOTIFICATIONS = [
  {
    message: '✨ Sarah just completed the assessment',
    icon: Sparkles,
    color: 'emerald'
  },
  {
    message: '🎯 Michael revealed his spiritual blueprint',
    icon: Target,
    color: 'blue'
  },
  {
    message: '⚡ Emma discovered her vitality pattern',
    icon: Zap,
    color: 'purple'
  },
  {
    message: '💚 James unlocked his energy insights',
    icon: Heart,
    color: 'green'
  },
  {
    message: '✓ Lisa completed her free assessment',
    icon: CheckCircle,
    color: 'emerald'
  },
  {
    message: '🧠 David explored his consciousness map',
    icon: Brain,
    color: 'purple'
  }
];

export default function useCredibleNotifications() {
  const [current, setCurrent] = useState(null);
  const [show, setShow] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(0);

  useEffect(() => {
    // Start showing notifications after 3 seconds
    const initialTimer = setTimeout(() => {
      setCurrent(NOTIFICATIONS[0]);
      setShow(true);
    }, 3000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!show || !current) return;

    // Show each notification for 4 seconds, then switch to next
    const timer = setTimeout(() => {
      setShow(false);
      
      // After fade-out (300ms), switch to next notification and fade in
      setTimeout(() => {
        const nextIndex = (notificationIndex + 1) % NOTIFICATIONS.length;
        setNotificationIndex(nextIndex);
        setCurrent(NOTIFICATIONS[nextIndex]);
        setShow(true);
      }, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [show, current, notificationIndex]);

  return { current, show };
}
