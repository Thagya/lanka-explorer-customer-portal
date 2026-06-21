export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  )
}
