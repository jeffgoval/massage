export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="mb-6">
      {label && (
        <label className="block mb-2 text-luxury-light font-body text-sm">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-lg bg-luxury-black/30 border ${error ? 'border-crimson-500' : 'border-crimson-600/30'} text-luxury-light font-body placeholder:text-gray-500 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-crimson-500">{error}</p>
      )}
    </div>
  );
}


