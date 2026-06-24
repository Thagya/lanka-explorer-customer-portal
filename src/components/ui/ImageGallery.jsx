import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, ImageOff } from 'lucide-react'

const FALLBACK = 'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23f3f4f6%22%2F%3E%3Ctext x%3D%22200%22 y%3D%22155%22 font-family%3D%22sans-serif%22 font-size%3D%2214%22 fill%3D%22%239ca3af%22 text-anchor%3D%22middle%22%3EImage not available%3C%2Ftext%3E%3C%2Fsvg%3E'
const handleImgError = e => { e.currentTarget.src = FALLBACK; e.currentTarget.onerror = null }

export default function ImageGallery({ images = [], alt = '' }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!images.length) return (
    <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-2xl">
      <span className="text-gray-400 text-sm">No images</span>
    </div>
  )

  const prev = (e) => { e.stopPropagation(); setActive(i => (i - 1 + images.length) % images.length) }
  const next = (e) => { e.stopPropagation(); setActive(i => (i + 1) % images.length) }

  return (
    <>
      <div className="relative group rounded-2xl overflow-hidden">
        <img
          src={images[active]}
          alt={`${alt} ${active + 1}`}
          className="w-full h-72 md:h-96 object-cover cursor-pointer"
          onClick={() => setLightbox(true)}
          onError={handleImgError}
        />
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setActive(i) }}
                  className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-white scale-125' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full">
          {active + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <img key={i} src={img} alt={`thumb ${i + 1}`} onClick={() => setActive(i)}
              className={`w-16 h-16 object-cover rounded-lg flex-shrink-0 cursor-pointer transition-all ${i === active ? 'ring-2 ring-teal-500 opacity-100' : 'opacity-60 hover:opacity-90'}`}
              onError={handleImgError}
            />
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 text-white p-2"><X size={28} /></button>
          <button onClick={prev} className="absolute left-4 text-white p-2"><ChevronLeft size={36} /></button>
          <img src={images[active]} alt={alt} className="max-h-[85vh] max-w-[90vw] object-contain" onClick={e => e.stopPropagation()} onError={handleImgError} />
          <button onClick={next} className="absolute right-4 text-white p-2"><ChevronRight size={36} /></button>
        </div>
      )}
    </>
  )
}
