import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface MotionIconWrapProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Subtle hover motion for icons without an animate-ui registry entry. */
export function MotionIconWrap({ children, className, style }: MotionIconWrapProps) {
  return (
    <motion.span
      className={className}
      style={{ display: 'inline-flex', lineHeight: 0, ...style }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      {children}
    </motion.span>
  );
}
