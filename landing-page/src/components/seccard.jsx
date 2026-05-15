import { useState } from 'react'

const fields = ['situation', 'task', 'action', 'result']

function SecCard({ title, situation, task, action, result, onSave }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ situation, task, action, result })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = () => {
    onSave?.({ title, ...form })
    setEditing(false)
  }

  const handleAI = () => {
    // placeholder for AI generation
    alert('AI generate coming soon')
  }

  return (
    <div className="rounded-2xl bg-gray-50 p-6 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{title}</h2>

      {fields.map((field) => (
        <div key={field}>
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            {field}
          </span>
          {editing ? (
            <textarea
              name={field}
              value={form[field] || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none bg-white"
            />
          ) : (
            <p className="text-gray-600 mt-1">{form[field] || '—'}</p>
          )}
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:border-blue-400 hover:text-blue-500 transition-colors"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        )}
        <button
          onClick={handleAI}
          className="px-4 py-2 text-sm rounded-lg border border-purple-300 text-purple-500 hover:bg-purple-50 transition-colors"
        >
          AI Generate
        </button>
      </div>
    </div>
  )
}

export default SecCard
