import { useState } from 'react'
import Card from '../components/card'
import SecCard from '../components/seccard'
import Tabs from '../components/tabs'
import CurrentJobs from '../components/currentjobs'
import Resume from '../components/resume'
import AddCardForm from '../components/addcardform'

const CATEGORIES = ['Key Responsibilities', 'Required Qualifications', 'Preferred Qualifications']

function Home({ jobs, addJob, updateJob, deleteJob, cardsByJob, addCard, updateCard, deleteCard, resume, updateResume }) {
  const [activeTab, setActiveTab] = useState('My Experience')
  const [selectedJob, setSelectedJob] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)

  const allCards = selectedJob ? (cardsByJob[selectedJob.id] || []) : []
  const filteredCards = activeCategory === 'Uncategorized'
    ? allCards.filter((c) => !c.category || !CATEGORIES.includes(c.category))
    : activeCategory
    ? allCards.filter((c) => c.category === activeCategory)
    : allCards

  return (
    <div>
      <Tabs active={activeTab} onChange={setActiveTab} />

      <main className="min-h-screen flex items-start justify-center p-10">

        {activeTab === 'My Experience' && (
          <Resume value={resume} onChange={updateResume} />
        )}

        {activeTab === 'Current Jobs' && (
          <CurrentJobs
            jobs={jobs}
            onUpdateJob={updateJob}
            onAddJob={addJob}
            onDeleteJob={deleteJob}
            selectedJob={selectedJob}
            onSelectJob={setSelectedJob}
            onGenerateCards={(bullets) => {
              bullets.forEach((bullet) =>
                addCard(selectedJob.id, {
                  title: bullet,
                  situation: '',
                  task: '',
                  action: '',
                  result: '',
                  category: '',
                })
              )
            }}
          />
        )}

        {activeTab === 'STAR Cards' && (
          <div className="flex gap-6 w-full max-w-5xl">

            {/* Category sidebar */}
            <div className="flex flex-col gap-3 w-56 shrink-0 sticky top-6 self-start">
              <Card
                title="All"
                description={`${allCards.length} cards`}
                active={activeCategory === null}
                onClick={() => setActiveCategory(null)}
              />
              {CATEGORIES.map((cat) => (
                <Card
                  key={cat}
                  title={cat}
                  description={`${allCards.filter((c) => c.category === cat).length} cards`}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
              <Card
                title="Uncategorized"
                description={`${allCards.filter((c) => !c.category || !CATEGORIES.includes(c.category)).length} cards`}
                active={activeCategory === 'Uncategorized'}
                onClick={() => setActiveCategory('Uncategorized')}
              />
            </div>

            {/* STAR cards list */}
            <div className="flex flex-col gap-6 flex-1">
              {!selectedJob ? (
                <p className="text-gray-400 text-sm">Select a job in Current Jobs first.</p>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
                      {selectedJob.title} — {selectedJob.company}
                      {activeCategory && ` · ${activeCategory}`}
                    </p>
                    <AddCardForm onAdd={(card) => addCard(selectedJob.id, { ...card, category: activeCategory || '' })} />
                  </div>
                  {filteredCards.length === 0 && (
                    <p className="text-gray-400 text-sm">No cards in this category.</p>
                  )}
                  {filteredCards.map((card) => (
                    <div key={card.id} className="relative group">
                      <button
                        onClick={() => deleteCard(selectedJob.id, card.id)}
                        className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-lg leading-none z-10"
                        aria-label="Delete card"
                      >
                        ×
                      </button>
                      {/* Category badge */}
                      <div className="mb-1 flex gap-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => updateCard(selectedJob.id, { ...card, category: cat })}
                            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                              card.category === cat
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500'
                            }`}
                          >
                            {cat.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                      <SecCard
                        title={card.title}
                        situation={card.situation}
                        task={card.task}
                        action={card.action}
                        result={card.result}
                        onSave={(updated) => updateCard(selectedJob.id, { ...card, ...updated })}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default Home
