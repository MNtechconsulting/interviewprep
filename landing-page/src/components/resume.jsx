import { useState } from 'react'

const placeholder = `John Doe
john@email.com | linkedin.com/in/johndoe | github.com/johndoe

SUMMARY
Experienced software engineer with a passion for building great products.

EXPERIENCE
Software Engineer — Acme Corp (2022 – Present)
- Built and maintained React applications
- Collaborated with cross-functional teams

Junior Developer — Startup Inc (2020 – 2022)
- Developed REST APIs using Node.js
- Wrote unit and integration tests

EDUCATION
B.S. Computer Science — State University (2020)

SKILLS
JavaScript, React, Node.js, TypeScript, SQL`

function Resume({ value, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || placeholder)

  const handleSave = () => {
    onChange?.(draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(value || placeholder)
    setEditing(false)
  }

  return (
    <div className="w-full max-w-3xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Resume</h2>
        <div className="flex gap-2">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={28}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-400 resize-y"
        />
      ) : (
        <pre className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-mono whitespace-pre-wrap leading-relaxed">
          {value || placeholder}
        </pre>
      )}
    </div>
  )
}

export default Resume
