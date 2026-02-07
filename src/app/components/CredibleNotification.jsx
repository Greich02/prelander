'use client';

import { motion, AnimatePresence } from 'framer-motion';
import useCredibleNotifications from './hooks/useCredibleNotifications';

export default function CredibleNotification() {
  const { current, show } = useCredibleNotifications();

  if (!current) return null;

  const colors = {
    emerald: { bg: 'from-emerald-400 to-green-500', border: 'border-emerald-200' },
    blue: { bg: 'from-blue-400 to-indigo-500', border: 'border-blue-200' },
    purple: { bg: 'from-purple-400 to-purple-500', border: 'border-purple-200' },
    green: { bg: 'from-green-400 to-emerald-500', border: 'border-green-200' }
  };

  const c = colors[current.color] || colors.emerald;
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 right-4 left-4 md:left-auto md:right-4 z-40 max-w-md"
        >
          <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border-2 ${c.border} p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-800 flex-1">{current.message}</p>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}