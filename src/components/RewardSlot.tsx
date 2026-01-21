import { useState, useEffect } from "react";
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
}

interface RewardSlotProps {
  cashback?: CashbackDetails;
  rewards?: RewardDetails[];
  onComplete?: () => void;
}

const RewardSlot = ({ cashback, rewards = [], onComplete }: RewardSlotProps) => {
  const [phase, setPhase] = useState(0);
  // Case 1 (no rewards): 
  //   Phase 0 -> initial (card + footer visible)
  //   Phase 1 -> confetti + card/footer move up
  //   Phase 2 -> header appears
  //   Phase 3 -> everything moves up and disappears
  // Case 2 (with rewards): Phase 0 -> 1 (banner) -> 2 (confetti + card) -> 3 (card slides up + banner transforms) -> 4 (rewards)

  const hasRewards = rewards.length > 0;
  const currency = cashback?.currency || "₹";

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    if (hasRewards) {
      // Case 2: With rewards
      timers.push(setTimeout(() => setPhase(1), 100));    // Banner appears
      timers.push(setTimeout(() => setPhase(2), 500));    // Confetti + card
      timers.push(setTimeout(() => setPhase(3), 2500));   // Card slides up, banner transforms
      timers.push(setTimeout(() => {
        setPhase(4);
        onComplete?.();
      }, 3000)); // Rewards appear
    } else {
      // Case 1: Cashback only
      timers.push(setTimeout(() => setPhase(1), 100));    // Card + footer start moving up
      timers.push(setTimeout(() => setPhase(2), 600));    // Header appears + confetti
      timers.push(setTimeout(() => setPhase(3), 2000));   // Everything moves up and disappears
      timers.push(setTimeout(() => {
        onComplete?.();
      }, 2500));
    }

    return () => timers.forEach(clearTimeout);
  }, [hasRewards, onComplete]);

  // CASE 1: Cashback Only
  // Card + Footer visible first, move up, header appears, then all disappear
  if (!hasRewards) {
    return (
      <div className="relative w-full max-w-md mx-auto overflow-hidden py-8">
        {/* Confetti - appears with header */}
        {phase >= 2 && phase < 3 && <Confetti />}

        {/* Header/Banner - appears in phase 2 */}
        <AnimatePresence>
          {phase >= 2 && phase < 3 && cashback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] px-4 py-3 rounded-xl mb-4 shadow-sm"
            >
              <p className="text-center text-gray-700 font-medium text-sm">
                🎉 Yay! You won {currency}{cashback.amount} cashback!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card + Footer Container - moves up together */}
        <AnimatePresence>
          {phase < 3 && cashback && (
            <motion.div
              initial={{ y: 0 }}
              animate={{ 
                y: phase >= 1 ? -40 : 0,
              }}
              exit={{ 
                y: -150, 
                opacity: 0,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="relative z-10"
            >
              {/* Cashback Card */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.1,
                }}
                className="bg-white rounded-2xl shadow-xl p-6 mx-auto"
                style={{ maxWidth: "240px" }}
              >
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-2">You won</p>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">🪙</span>
                    <span className="text-3xl font-bold text-green-600">
                      {currency}{cashback.amount}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">Cashback</p>
                </div>
              </motion.div>

              {/* Footer Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-center text-gray-500 text-sm mt-6"
              >
                Added to your Amazon Pay balance
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // CASE 2: Cashback + Rewards (With banner, card slides up)
  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden">
      {/* Green Banner - transforms to compact version */}
      <AnimatePresence>
        {phase >= 1 && cashback && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] px-4 py-3 rounded-xl mb-4 shadow-sm"
          >
            {phase < 3 ? (
              // Initial banner
              <p className="text-center text-gray-700 font-medium text-sm">
                🎉 Yay! You won {currency}{cashback.amount} cashback!
              </p>
            ) : (
              // Transformed compact version with cashback amount
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-3"
              >
                <span className="text-gray-600 text-sm">🎉 Yay! You Won {currency}{cashback.amount} cashback!</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti */}
      {phase >= 2 && phase < 3 && <Confetti />}

      {/* Cashback Card - Only shows before transform */}
      <AnimatePresence>
        {phase >= 2 && phase < 3 && cashback && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="bg-white rounded-2xl shadow-xl p-6 mx-auto relative z-10"
            style={{ maxWidth: "240px" }}
          >
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-2">You won</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🪙</span>
                <span className="text-3xl font-bold text-green-600">
                  {currency}{cashback.amount}
                </span>
              </div>
              <p className="text-gray-600 font-medium">Cashback</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Cashback Row - Shows after transform */}
      <AnimatePresence>
        {phase >= 3 && cashback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-2 py-2"
          >
            <span className="text-xl">🪙</span>
            <span className="text-xl font-bold text-green-600">{currency}{cashback.amount}</span>
            <span className="text-gray-600 font-medium">Cashback</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rewards Section */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-4 space-y-3"
          >
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
