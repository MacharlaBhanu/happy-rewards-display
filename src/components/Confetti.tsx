import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#FFD700", "#FF6B35", "#E63946", "#2ECC71", "#3498DB", "#9B59B6", "#F39C12"];
const PARTICLE_COUNT = 50;

interface ConfettiParticle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

export const Confetti = () => {
  const particles = useMemo<ConfettiParticle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.3,
      duration: Math.random() * 1.5 + 1.5,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}%`,
            y: -20,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: "120%",
            rotate: particle.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
};
