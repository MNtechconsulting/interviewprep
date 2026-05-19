import { useState, useRef, useEffect } from 'react'

const fields = ['discription', 'situation', 'task', 'action', 'result', 'notes']

const STATUSES = [
  { value: 'not_started', label: 'Not Started', color: 'bg-gray-300',       text: 'text-gray-600' },
  { value: '1',           label: '1 — Needs Work', color: 'bg-red-400',    text: 'text-red-600'  },
  { value: '3',           label: '3 — Getting There', color: 'bg-yellow-400', text: 'text-yellow-600' },
  { value: '5',           label: '5 — Strong', color: 'bg-green-400',      text: 'text-green-600' },
]

function StatusBadge({ status }) {
  const s = STATUSES.find((s) => s.value === status) || STATUSES[0]
  return (
    <span className={`inline-block w-3 h-3 rounded-full ${s.color}`} />
  )
}

function SecCard({ title, discription, situation, task, action, result, notes, status, onSave }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ discription, situation, task, action, result, notes, status: status || 'not_started' })
  const [showStatus, setShowStatus] = useState(false)
  const statusRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showStatus) return
    const handler = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setShowStatus(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showStatus])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = () => {
    onSave?.({ title, ...form })
    setEditing(false)
  }

  const handleStatusSelect = (value) => {
    const updated = { ...form, status: value }
    setForm(updated)
    setShowStatus(false)
    onSave?.({ title, ...updated })
  }

  const currentStatus = STATUSES.find((s) => s.value === form.status) || STATUSES[0]

  return (
    <div
      onClick={() => !open && setOpen(true)}
      className={`rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden transition-colors ${!open ? 'cursor-pointer hover:bg-gray-100' : ''}`}
    >
      {/* Header — always visible */}
      <div className="w-full flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Status dot — always visible */}
          <div ref={statusRef} className="relative shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setShowStatus((v) => !v) }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors"
              title="Set status"
            >
              <StatusBadge status={form.status} />
              <span className={`text-xs font-medium ${currentStatus.text}`}>
                {currentStatus.label}
              </span>
            </button>

            {showStatus && (
              <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-40">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    onClick={(e) => { e.stopPropagation(); handleStatusSelect(s.value) }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${form.status === s.value ? 'font-semibold' : ''}`}
                  >
                    <span className={`w-3 h-3 rounded-full shrink-0 ${s.color}`} />
                    <span className={s.text}>{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <h4 className="text-base font-semibold break-words">{title}</h4>
        </div>

        {/* Collapse button when open */}
        {open && (
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); setEditing(false) }}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-200 text-sm leading-none shrink-0 ml-2"
            aria-label="Collapse"
          >
            ▲
          </button>
        )}
      </div>

      {/* Collapsible body */}
      {open && (
        <div className="px-6 pb-6 flex flex-col gap-4">
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
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-y bg-white"
                />
              ) : (
                <p className="text-gray-600 mt-1 select-text cursor-text">
                  {form[field] || '—'}
                </p>
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
              onClick={() => alert('AI DOESNT WORK SUCKAAAAA')}
              className="px-4 py-2 text-sm rounded-lg border border-purple-300 text-purple-500 hover:bg-purple-50 transition-colors"
            >
              AI Generate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SecCard
