import { useState } from 'react'

function Input({ onAdd }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title, description })
    setTitle('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-6 border-b border-gray-200">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:border-blue-400"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:border-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-600 transition-colors"
      >
        Add Card
      </button>
    </form>
  )
}

export default Input
