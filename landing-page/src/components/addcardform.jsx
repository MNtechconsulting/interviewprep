import { useState } from 'react'

const empty = { title: '', situation: '', task: '', action: '', result: '' }

function AddCardForm({ onAdd }) {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState(empty)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onAdd({ id: Date.now(), ...form })
    setForm(empty)
    setShow(false)
  }

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="rounded-2xl border-2 border-dashed border-gray-300 p-4 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors w-full text-center"
      >
        + Add Card
      </button>
    )
  }

  const fields = [
    { name: 'title', placeholder: 'Title', rows: 1 },
    { name: 'situation', placeholder: 'Situation', rows: 2 },
    { name: 'task', placeholder: 'Task', rows: 2 },
    { name: 'action', placeholder: 'Action', rows: 2 },
    { name: 'result', placeholder: 'Result', rows: 2 },
  ]

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-blue-300 bg-blue-50 p-4 flex flex-col gap-2">
      {fields.map(({ name, placeholder, rows }) => (
        <textarea
          key={name}
          name={name}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          rows={rows}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none bg-white"
        />
      ))}
      <div className="flex gap-2 self-end">
        <button
          type="button"
          onClick={() => { setShow(false); setForm(empty) }}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  )
}

export default AddCardForm
