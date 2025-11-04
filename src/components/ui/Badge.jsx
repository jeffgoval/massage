const variants = {
  vip: 'bg-gradient-gold text-black',
  exclusive: 'bg-gradient-primary text-white',
  verified: 'bg-white/10 text-gold-500 border border-gold-500',
  available: 'bg-green-500/20 text-green-400 border border-green-500',
};

export function Badge({ variant = 'exclusive', children, icon }) {
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}


