function Card({ title, description, onClick, onDelete, active }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-4 shadow-sm cursor-pointer transition-colors relative group ${
        active ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      <h2 className="text-base font-semibold mb-1 pr-6">{title}</h2>
      <p className="text-gray-500 text-sm">{description}</p>
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-lg leading-none"
          aria-label="Delete card"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default Card
