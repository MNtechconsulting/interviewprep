import { useState } from 'react'
import Card from '../components/card'
import SecCard from '../components/seccard'
import Tabs from '../components/tabs'
import CurrentJobs from '../components/currentjobs'
import Resume from '../components/resume'
import AddCardForm from '../components/addcardform'

function Home({ jobs, addJob, updateJob, deleteJob, cardsByJob, addCard, updateCard, deleteCard, resume, updateResume }) {
  const [activeTab, setActiveTab] = useState('My Experience')
  const [selectedJob, setSelectedJob] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)

  const cards = selectedJob ? (cardsByJob[selectedJob.id] || []) : []

  const handleClickCard = (card) => {
    setSelectedCard(selectedCard?.id === card.id ? null : card)
  }

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
          />
        )}

        {activeTab === 'STAR Cards' && (
          <div className="flex gap-6">
            <div className="flex flex-col gap-4 w-72">
              {!selectedJob ? (
                <p className="text-gray-400 text-sm">Select a job in Current Jobs first.</p>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
                    {selectedJob.title} — {selectedJob.company}
                  </p>
                  <AddCardForm onAdd={(card) => addCard(selectedJob.id, card)} />
                  {cards.length === 0 && (
                    <p className="text-gray-400 text-sm">No cards yet.</p>
                  )}
                  {cards.map((card) => (
                    <Card
                      key={card.id}
                      title={card.title}
                      description={card.situation}
                      active={selectedCard?.id === card.id}
                      onClick={() => handleClickCard(card)}
                      onDelete={() => {
                        deleteCard(selectedJob.id, card.id)
                        if (selectedCard?.id === card.id) setSelectedCard(null)
                      }}
                    />
                  ))}
                </>
              )}
            </div>

            {selectedCard && (
              <div className="w-96">
                <SecCard
                  title={selectedCard.title}
                  situation={selectedCard.situation}
                  task={selectedCard.task}
                  action={selectedCard.action}
                  result={selectedCard.result}
                  onSave={(updated) => {
                    updateCard(selectedJob.id, { ...selectedCard, ...updated })
                    setSelectedCard((prev) => ({ ...prev, ...updated }))
                  }}
                />
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}

export default Home
