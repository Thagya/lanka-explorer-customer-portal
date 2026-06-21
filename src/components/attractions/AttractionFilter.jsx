import { Search } from 'lucide-react'

const CATEGORIES = ['All', 'Historical', 'Scenic', 'Beach', 'Cultural', 'Wildlife']

export default function AttractionFilter({ search, onSearch, category, onCategory }) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search attractions..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => onCategory(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all
              ${category === c
                ? 'bg-teal-500 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-500 hover:text-teal-500'
              }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
