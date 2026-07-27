import { motion } from 'framer-motion';
import React from 'react';

// Liquid Glass Card Component with refined enterprise styling
export const LiquidGlassCard = React.forwardRef(({ children, ...props }, ref) => (
  <motion.div
    ref={ref}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      background: 'rgba(255, 255, 255, 0.82)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderRadius: '18px',
      border: '1px solid rgba(27, 54, 93, 0.08)',
      boxShadow: '0 20px 50px rgba(15, 42, 98, 0.12)',
      padding: '26px',
    }}
    {...props}
  >
    {children}
  </motion.div>
));

LiquidGlassCard.displayName = 'LiquidGlassCard';

// Gradient Text Component
export const GradientText = ({ children, ...props }) => (
  <span
    style={{
      background: 'linear-gradient(135deg, #1b365d, #ffc344)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700,
      ...props.style,
    }}
    {...props}
  >
    {children}
  </span>
);

// Animated Counter Component
export const AnimatedCounter = ({ value, prefix = '', suffix = '', duration = 2 }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const increment = Math.max(1, value / (duration * 60));
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// 3D Floating Cards with subtle parallax
export const FloatingCard3D = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, rotateX: -10 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 0.55, delay }}
    whileHover={{
      y: -10,
      boxShadow: '0 24px 48px rgba(27, 54, 93, 0.18)',
    }}
    style={{
      perspective: '1000px',
      transformStyle: 'preserve-3d',
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Shimmer Loading Effect
export const ShimmerEffect = () => (
  <motion.div
    style={{
      background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 100%)',
      backgroundSize: '200% 100%',
      borderRadius: '10px',
      minHeight: '10px',
    }}
    animate={{
      backgroundPosition: ['200% 0', '-200% 0'],
    }}
    transition={{
      duration: 1.6,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
);

// Enterprise Button
export const NeonButton = ({ children, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    style={{
      background: 'linear-gradient(135deg, #1b365d, #3b67a7)',
      color: '#ffffff',
      border: 'none',
      padding: '12px 28px',
      borderRadius: '13px',
      fontWeight: 700,
      fontSize: '0.95rem',
      cursor: 'pointer',
      boxShadow: '0 18px 32px rgba(27, 54, 93, 0.22)',
      textTransform: 'none',
      transition: 'all 0.25s ease',
    }}
    {...props}
  >
    {children}
  </motion.button>
);

// Animated Background Gradient
export const AnimatedBackgroundGradient = ({ darkMode }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      background: darkMode
        ? 'radial-gradient(circle at 20% 20%, rgba(59, 164, 255, 0.14) 0%, transparent 32%), ' +
          'radial-gradient(circle at 80% 80%, rgba(255, 179, 68, 0.14) 0%, transparent 30%), ' +
          'linear-gradient(135deg, #07101f 0%, #121f3b 100%)'
        : 'radial-gradient(circle at 20% 20%, rgba(59, 164, 255, 0.1) 0%, transparent 35%), ' +
          'radial-gradient(circle at 80% 80%, rgba(255, 179, 68, 0.1) 0%, transparent 35%), ' +
          'linear-gradient(135deg, #f4f7fb 0%, #e8eef8 100%)',
      pointerEvents: 'none',
    }}
  />
);

// Glass Morphism Container
export const GlassMorphismContainer = ({ children }) => (
  <div
    style={{
      background: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      border: '1px solid rgba(27, 54, 93, 0.08)',
      borderRadius: '22px',
      padding: '32px',
      boxShadow: '0 20px 45px rgba(27, 54, 93, 0.12)',
    }}
  >
    {children}
  </div>
);
