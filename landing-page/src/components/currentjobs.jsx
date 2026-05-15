import { useState, useEffect } from 'react'

const emptyJob = { title: '', company: '', description: '' }

function CurrentJobs({ jobs, onUpdateJob, onAddJob, onDeleteJob, onSelectJob, selectedJob }) {
  const [editing, setEditing] = useState(false)
  const [desc, setDesc] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyJob)

  // Sync desc when selectedJob changes from outside (e.g. Firestore update)
  useEffect(() => {
    if (selectedJob) setDesc(selectedJob.description || '')
  }, [selectedJob?.id])

  const handleSelect = (job) => {
    onSelectJob(job)
    setDesc(job.description || '')
    setEditing(false)
    setShowForm(false)
  }

  const handleSave = () => {
    const updated = { ...selectedJob, description: desc }
    onUpdateJob?.(updated)
    onSelectJob(updated)
    setEditing(false)
  }

  const handleAddJob = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onAddJob?.({ ...form })
    setForm(emptyJob)
    setShowForm(false)
  }

  return (
    <div className="flex gap-6 w-full max-w-4xl">
      {/* Job list */}
      <div className="flex flex-col gap-3 w-72 shrink-0">
        <button
          onClick={() => { setShowForm(true); onSelectJob(null) }}
          className="rounded-2xl border-2 border-dashed border-gray-300 p-4 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors text-center"
        >
          + Add Job
        </button>

        {jobs.length === 0 && !showForm && (
          <p className="text-gray-400 text-sm">No jobs added yet.</p>
        )}
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => handleSelect(job)}
            className={`rounded-2xl border p-4 cursor-pointer transition-colors relative group ${
              selectedJob?.id === job.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <p className="font-medium text-sm pr-6">{job.title}</p>
            <p className="text-xs text-gray-400 mt-1">{job.company}</p>
            {onDeleteJob && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (selectedJob?.id === job.id) onSelectJob(null)
                  onDeleteJob(job.id)
                }}
                className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-lg leading-none"
                aria-label="Delete job"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add job form */}
      {showForm && (
        <form onSubmit={handleAddJob} className="flex-1 rounded-2xl bg-gray-50 p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold">New Job</h2>
          <input
            placeholder="Job Title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={6}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
          />
          <div className="flex gap-2 self-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Editable description panel */}
      {selectedJob && !showForm && (
        <div className="flex-1 rounded-2xl bg-gray-50 p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
            <p className="text-sm text-gray-400">{selectedJob.company}</p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">
              Description
            </span>
            {editing ? (
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={8}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none bg-white"
              />
            ) : (
              <p className="text-gray-600 mt-1 whitespace-pre-wrap">{desc || '—'}</p>
            )}
          </div>

          <div className="flex gap-2">
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
              onClick={() => alert('AI generate coming soon')}
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

export default CurrentJobs
