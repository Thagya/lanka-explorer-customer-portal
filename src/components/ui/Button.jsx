export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-teal-500 text-white hover:bg-teal-400 active:scale-95',
    secondary: 'bg-white text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white active:scale-95',
    ghost:     'text-teal-500 hover:bg-teal-500/10 active:scale-95',
    danger:    'bg-red-600 text-white hover:bg-red-700 active:scale-95',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
