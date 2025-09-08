import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IAchievement } from '../types/data';

interface Props {
  achievement: IAchievement;
}

export const AchievementCard: React.FC<Props> = ({ achievement }) => {
  const { name, description, rules, points, pivot } = achievement;
  const progressValue = Math.min(1, pivot.progress / rules.target);
  const [justUnlocked, setJustUnlocked] = useState(false);

  useEffect(() => {
    if (pivot.unlocked_at) {
      setJustUnlocked(true);
      const t = setTimeout(() => setJustUnlocked(false), 2500);
      return () => clearTimeout(t);
    }
  }, [pivot.unlocked_at]);

  return (
    <motion.div
      layout
      className={`relative rounded-lg border p-4 bg-white shadow-sm overflow-hidden ${pivot.unlocked_at ? 'border-emerald-400' : 'border-gray-200'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-sm">{name}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        {/* You can show points or type here if needed */}
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{points} pts</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded">
        <motion.div
          className="h-2 bg-emerald-500 rounded"
          initial={{ width: 0 }}
          animate={{ width: `${progressValue * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-gray-500">
        <span>{pivot.progress}/{rules.target} progress</span>
        {pivot.unlocked_at && <span className="text-emerald-600 font-medium">Unlocked</span>}
      </div>
      <AnimatePresence>
        {justUnlocked && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-emerald-500/80 text-white font-semibold text-sm"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            Achievement Unlocked!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AchievementCard;
