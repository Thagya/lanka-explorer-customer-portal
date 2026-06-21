const TYPES = [
  { key: '',        label: 'All Types' },
  { key: 'hotel',   label: '🏨 Hotels' },
  { key: 'tour',    label: '🗺️ Tours' },
  { key: 'vehicle', label: '🚙 Vehicles' },
]

export default function ListingFilter({ type, onType }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
      {TYPES.map(t => (
        <button
          key={t.key}
          onClick={() => onType(t.key)}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all
            ${type === t.key
              ? 'bg-teal-500 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-500 hover:text-teal-500'
            }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
