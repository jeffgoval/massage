import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-primary text-white shadow-crimson',
  gold: 'bg-gradient-gold text-black shadow-gold',
  outline: 'border-2 border-gold-500 text-gold-500',
  ghost: 'bg-white/5 border border-white/20 text-luxury-light',
};

export function Button({ variant = 'primary', children, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`px-8 py-3 rounded-full font-display text-base transition-all duration-300 tracking-wide ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}


