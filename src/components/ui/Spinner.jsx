export default function Spinner({ className = '' }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-teal-500 border-t-transparent w-6 h-6 ${className}`} />
  )
}
