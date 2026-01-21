import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti } from "./Confetti";

interface CashbackDetails {
  amount: number;
  currency?: string;
}

interface RewardDetails {
  id: string;
  badge: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  gradientColors?: string[];
}

interface RewardSlotProps {
  cashback?: CashbackDetails;
  rewards?: RewardDetails[];
  onComplete?: () => void;
}

const RewardSlot = ({ cashback, rewards = [], onComplete }: RewardSlotProps) => {
  const [phase, setPhase] = useState(0);
  // Phase 0: Initial
  // Phase 1: Banner appears
  // Phase 2: Confetti + Cashback card
  // Phase 3: Footer appears
  // Phase 4: Card slides up (only if rewards exist)
  // Phase 5: Rewards appear

  const hasRewards = rewards.length > 0;

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Banner slides in (100ms)
    timers.push(setTimeout(() => setPhase(1), 100));

    // Phase 2: Confetti + Cashback card (300ms)
    timers.push(setTimeout(() => setPhase(2), 300));

    // Phase 3: Footer appears (1000ms)
    timers.push(setTimeout(() => setPhase(3), 1000));

    if (hasRewards) {
      // Phase 4: Card slides up (2500ms)
      timers.push(setTimeout(() => setPhase(4), 2500));

      // Phase 5: Rewards appear (3000ms)
      timers.push(setTimeout(() => {
        setPhase(5);
        onComplete?.();
      }, 3000));
    } else {
      timers.push(setTimeout(() => onComplete?.(), 1500));
    }

    return () => timers.forEach(clearTimeout);
  }, [hasRewards, onComplete]);

  const currency = cashback?.currency || "₹";

  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden">
      {/* Green Banner */}
      <AnimatePresence>
        {phase >= 1 && cashback && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-gradient-to-r from-[#90EE90] to-[#98FB98] px-4 py-3 rounded-lg mb-4 shadow-sm"
          >
            <p className="text-center text-gray-800 font-medium text-sm">
              🎉 Yay! You won {currency}{cashback.amount} cashback!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti */}
      {phase >= 2 && <Confetti />}

      {/* Cashback Card */}
      <AnimatePresence>
        {phase >= 2 && cashback && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: phase >= 4 ? 0.92 : 1,
              opacity: phase >= 4 ? 0.85 : 1,
              y: phase >= 4 ? -80 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 0.5,
            }}
            className="bg-white rounded-2xl shadow-xl p-6 mx-auto relative z-10"
            style={{ maxWidth: "280px" }}
          >
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-2">You won</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl">🪙</span>
                <span className="text-4xl font-bold text-gray-900">
                  {currency}{cashback.amount}
                </span>
              </div>
              <p className="text-gray-600 font-medium">Cashback</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Text */}
      <AnimatePresence>
        {phase >= 3 && cashback && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: phase >= 4 ? -70 : 0,
              color: phase >= 4 ? "#22c55e" : "#6b7280"
            }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm mt-4"
          >
            {phase >= 4 
              ? "✓ Added to your Amazon Pay balance" 
              : "Will be added to your Amazon Pay Balance"
            }
          </motion.p>
        )}
      </AnimatePresence>

      {/* Rewards Section */}
      <AnimatePresence>
        {phase >= 5 && hasRewards && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-6 space-y-3"
          >
            <p className="text-gray-600 text-sm font-medium px-2">
              Recommended rewards for you
            </p>
            
            {rewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-4 shadow-lg overflow-hidden relative"
              >
                {/* Badge */}
                <div className="inline-block bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2">
                  {reward.badge}
                </div>
                
                <h3 className="text-white font-semibold text-base mb-1">
                  {reward.title}
                </h3>
                
                {reward.subtitle && (
                  <p className="text-purple-200 text-sm mb-3">
                    {reward.subtitle}
                  </p>
                )}
                
                <button className="bg-white text-purple-700 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                  {reward.buttonText} ⊕
                </button>
                
                {/* Decorative card image placeholder */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-10 bg-gradient-to-br from-white/20 to-white/5 rounded-md border border-white/20" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardSlot;
