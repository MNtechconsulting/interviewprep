import { useState, useEffect } from 'react'

const emptyJob = { title: '', company: '', url: '', intro: '', description: '', summary: '' }

function CurrentJobs({ jobs, onUpdateJob, onAddJob, onDeleteJob, onArchiveJob, onRestoreJob, onSelectJob, selectedJob, onGenerateCards }) {
  const [editing, setEditing] = useState(false)
  const [desc, setDesc] = useState('')
  const [intro, setIntro] = useState('')
  const [summary, setSummary] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [form, setForm] = useState(emptyJob)

  const activeJobs = jobs.filter((j) => !j.archived)
  const archivedJobs = jobs.filter((j) => j.archived)

  useEffect(() => {
    if (selectedJob) {
      setDesc(selectedJob.description || '')
      setIntro(selectedJob.intro || '')
      setSummary(selectedJob.summary || '')
    }
  }, [selectedJob?.id])

  const handleSelect = (job) => {
    onSelectJob(job)
    setDesc(job.description || '')
    setEditing(false)
    setShowForm(false)
  }

  const handleSave = () => {
    const updated = { ...selectedJob, intro, description: desc, summary }
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

        {activeJobs.length === 0 && !showForm && (
          <p className="text-gray-400 text-sm">No jobs added yet.</p>
        )}
        {activeJobs.map((job) => (
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
            {onArchiveJob && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!confirm('Archive this job?')) return
                  if (selectedJob?.id === job.id) onSelectJob(null)
                  onArchiveJob(job.id)
                }}
                className="absolute top-3 right-3 text-gray-300 hover:text-yellow-500 transition-colors opacity-0 group-hover:opacity-100 text-lg leading-none"
                aria-label="Archive job"
                title="Archive"
              >
                ↓
              </button>
            )}
          </div>
        ))}

        {/* Archive section */}
        {archivedJobs.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowArchive((v) => !v)}
              className="w-full text-left text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-between px-1 py-2"
            >
              <span>Archived ({archivedJobs.length})</span>
              <span>{showArchive ? '▲' : '▼'}</span>
            </button>

            {showArchive && (
              <div className="flex flex-col gap-2 mt-1">
                {archivedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-4 relative group opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <p className="font-medium text-sm pr-12 text-gray-500">{job.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{job.company}</p>
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onRestoreJob?.(job.id)}
                        className="text-gray-400 hover:text-blue-500 transition-colors text-xs px-1.5 py-0.5 rounded border border-gray-200 hover:border-blue-300"
                        title="Restore"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => {
                          if (!confirm('Permanently delete this job?')) return
                          onDeleteJob?.(job.id)
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors text-lg leading-none"
                        title="Delete permanently"
                        aria-label="Delete job"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
          <input
            type="url"
            placeholder="Job URL (optional)"
            value={form.url}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
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
            {selectedJob.url && (
              <a
                href={selectedJob.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline break-all"
              >
                {selectedJob.url}
              </a>
            )}
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">
              Intro
            </span>
            {editing ? (
              <textarea
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                rows={3}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none bg-white"
              />
            ) : (
              <p className="text-gray-600 mt-1 whitespace-pre-wrap">{intro || '—'}</p>
            )}
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

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">
              Summary
            </span>
            {editing ? (
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none bg-white"
              />
            ) : (
              <p className="text-gray-600 mt-1 whitespace-pre-wrap">{summary || '—'}</p>
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
              onClick={() => {
                const text = desc || selectedJob.description || ''
                const bullets = text
                  .split('\n')
                  .map((l) => l.replace(/^[\s\-•*]+/, '').trim())
                  .filter((l) => l.length > 0)
                if (bullets.length === 0) return alert('No bullet points found in description.')
                onGenerateCards?.(bullets)
              }}
              className="px-4 py-2 text-sm rounded-lg border border-green-300 text-green-600 hover:bg-green-50 transition-colors"
            >
              Generate STAR Cards
            </button>
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
