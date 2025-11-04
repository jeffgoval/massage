import { motion } from 'framer-motion';

export function Card({ children, className = '', hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -8 } : {}}
      className={`bg-gradient-dark rounded-luxury p-6 shadow-luxury border border-crimson-600/30 transition-all duration-300 ${hover ? 'hover:shadow-crimson hover:border-crimson-600/60' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
