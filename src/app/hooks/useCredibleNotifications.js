'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, Zap, CheckCircle, Activity } from 'lucide-react';

const NOTIFICATIONS = [
  // Hourly stats
  {
    icon: Users,
    getMessage: () => `${Math.floor(Math.random() * 35) + 15} people completed the assessment in the last hour`,
    color: 'emerald'
  },
  {
    icon: Activity,
    getMessage: () => `${Math.floor(Math.random() * 10) + 3} assessments started in the last 10 minutes`,
    color: 'purple'
  },
  {
    icon: TrendingUp,
    getMessage: () => `${Math.floor(Math.random() * 250) + 150} pineal patterns discovered today`,
    color: 'blue'
  },
  // Anonymous events
  {
    icon: CheckCircle,
    getMessage: () => 'Someone just discovered their pineal calcification level',
    color: 'green'
  },
  {
    icon: Zap,
    getMessage: () => 'Assessment completed • Protocol delivered',
    color: 'purple'
  },
  {
    icon: Users,
    getMessage: () => 'Someone just unlocked their spiritual anti-aging pattern',
    color: 'emerald'
  },
  // Milestones
  {
    icon: Users,
    getMessage: () => '12,847+ pineal assessments completed',
    color: 'blue'
  },
  {
    icon: TrendingUp,
    getMessage: () => '94% discover patterns they didn\'t know existed',
    color: 'emerald'
  }
];

export default function useCredibleNotifications() {
  const [current, setCurrent] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const showNext = () => {
      const notif = NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];
      setCurrent({
        id: Date.now(),
        icon: notif.icon,
        message: notif.getMessage(),
        color: notif.color
      });
      setShow(true);
      
      setTimeout(() => setShow(false), 5000);
      setTimeout(showNext, Math.floor(Math.random() * 25000) + 25000);
    };

    const timer = setTimeout(showNext, 4000);
    return () => clearTimeout(timer);
  }, []);

  return { current, show };
}