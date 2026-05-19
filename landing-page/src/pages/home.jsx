import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Card from '../components/card'
import SecCard from '../components/seccard'
import Tabs from '../components/tabs'
import CurrentJobs from '../components/currentjobs'
import Resume from '../components/resume'
import AddCardForm from '../components/addcardform'

// Sortable wrapper for each card row
function SortableCard({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }
  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute left-[-22px] top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity touch-none select-none"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      {children}
    </div>
  )
}

// Collapsible category panel — stacks on mobile, sidebar on desktop
function CategoryPanel({ categories, activeCards, activeCategory, setActiveCategory, handleDeleteCategory, selectedJob, newCat, setNewCat, handleAddCategory }) {
  const [open, setOpen] = useState(false)
  const activeCatLabel = activeCategory || 'All'

  return (
    <div className="md:hidden">
      {/* Mobile: collapsible bar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700"
      >
        <span>Filter: <span className="text-blue-500">{activeCatLabel}</span></span>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2 bg-white border border-gray-200 rounded-2xl p-3">
          <CategoryList
            categories={categories}
            activeCards={activeCards}
            activeCategory={activeCategory}
            setActiveCategory={(cat) => { setActiveCategory(cat); setOpen(false) }}
            handleDeleteCategory={handleDeleteCategory}
            selectedJob={selectedJob}
            newCat={newCat}
            setNewCat={setNewCat}
            handleAddCategory={handleAddCategory}
          />
        </div>
      )}
    </div>
  )
}

// Desktop sidebar — hidden on mobile, shown on md+
function CategorySidebar({ categories, activeCards, activeCategory, setActiveCategory, handleDeleteCategory, selectedJob, newCat, setNewCat, handleAddCategory }) {
  return (
    <div className="hidden md:flex flex-col gap-3 w-48 shrink-0 sticky top-6 self-start">
      <CategoryList
        categories={categories}
        activeCards={activeCards}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        handleDeleteCategory={handleDeleteCategory}
        selectedJob={selectedJob}
        newCat={newCat}
        setNewCat={setNewCat}
        handleAddCategory={handleAddCategory}
      />
    </div>
  )
}

function CategoryList({ categories, activeCards, activeCategory, setActiveCategory, handleDeleteCategory, selectedJob, newCat, setNewCat, handleAddCategory }) {
  return (
    <>
      {categories.map((cat) => (
        <div key={cat} className="relative group/cat">
          <Card
            title={cat}
            description={`${activeCards.filter((c) => c.category === cat).length} cards`}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
          <button
            onClick={() => handleDeleteCategory(cat)}
            className="absolute top-2 right-2 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover/cat:opacity-100 text-base leading-none"
            title="Delete category"
          >
            ×
          </button>
        </div>
      ))}

      <Card
        title="Uncategorized"
        description={`${activeCards.filter((c) => !c.category || !categories.includes(c.category)).length} cards`}
        active={activeCategory === 'Uncategorized'}
        onClick={() => setActiveCategory('Uncategorized')}
      />

      {selectedJob && (
        <form onSubmit={handleAddCategory} className="flex gap-1 mt-1">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New category…"
            className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-400"
          />
          <button
            type="submit"
            className="px-2 py-1.5 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shrink-0"
          >
            +
          </button>
        </form>
      )}
    </>
  )
}

function Home({ jobs, addJob, updateJob, deleteJob, archiveJob, restoreJob, cardsByJob, addCard, updateCard, deleteCard, archiveCard, restoreCard, reorderCards, addCategory, deleteCategory, resume, updateResume }) {
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem('activeTab') || 'My Experience'
  )
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    localStorage.setItem('activeTab', tab)
  }

  const [selectedJob, setSelectedJob] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [showArchivedCards, setShowArchivedCards] = useState(false)
  const [newCat, setNewCat] = useState('')

  // Restore selected job from localStorage once jobs are loaded
  const [restoredJob, setRestoredJob] = useState(false)
  useEffect(() => {
    if (restoredJob || jobs.length === 0) return
    const savedId = localStorage.getItem('selectedJobId')
    if (savedId) {
      const found = jobs.find((j) => j.id === savedId)
      if (found) setSelectedJob(found)
    }
    setRestoredJob(true)
  }, [jobs, restoredJob])

  // Keep selectedJob in sync with live Firestore data
  useEffect(() => {
    if (!selectedJob) return
    const updated = jobs.find((j) => j.id === selectedJob.id)
    if (updated) setSelectedJob(updated)
  }, [jobs])

  const handleSelectJob = (job) => {
    setSelectedJob(job)
    localStorage.setItem('selectedJobId', job?.id ?? '')
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const categories = jobs.find((j) => j.id === selectedJob?.id)?.categories || []
  const allCards = selectedJob ? (cardsByJob[selectedJob.id] || []) : []
  const activeCards = [...allCards.filter((c) => !c.archived)].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const archivedCards = allCards.filter((c) => c.archived)

  const filteredCards = activeCategory === 'Uncategorized'
    ? activeCards.filter((c) => !c.category || !categories.includes(c.category))
    : activeCategory
    ? activeCards.filter((c) => c.category === activeCategory)
    : activeCards

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id || !selectedJob) return
    const oldIndex = filteredCards.findIndex((c) => c.id === active.id)
    const newIndex = filteredCards.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(filteredCards, oldIndex, newIndex)
    reorderCards(selectedJob.id, reordered.map((c) => c.id))
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    const trimmed = newCat.trim()
    if (!trimmed || !selectedJob) return
    addCategory(selectedJob.id, trimmed)
    setNewCat('')
  }

  const handleDeleteCategory = (cat) => {
    if (!confirm(`Delete category "${cat}"?`)) return
    deleteCategory(selectedJob.id, cat)
    if (activeCategory === cat) setActiveCategory(null)
  }

  return (
    <div>
      <Tabs active={activeTab} onChange={handleTabChange} />

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
            onArchiveJob={archiveJob}
            onRestoreJob={restoreJob}
            selectedJob={selectedJob}
            onSelectJob={handleSelectJob}
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
          <div className="flex flex-col w-full max-w-4xl gap-4">

            {/* Mobile collapsible category panel */}
            <CategoryPanel
              categories={categories}
              activeCards={activeCards}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              handleDeleteCategory={handleDeleteCategory}
              selectedJob={selectedJob}
              newCat={newCat}
              setNewCat={setNewCat}
              handleAddCategory={handleAddCategory}
            />

            <div className="flex gap-6 w-full">
              {/* Desktop sidebar */}
              <CategorySidebar
                categories={categories}
                activeCards={activeCards}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                handleDeleteCategory={handleDeleteCategory}
                selectedJob={selectedJob}
                newCat={newCat}
                setNewCat={setNewCat}
                handleAddCategory={handleAddCategory}
              />

              {/* STAR cards list */}
              <div className="flex flex-col gap-6 flex-1 min-w-0">
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

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={filteredCards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                      <div className="flex flex-col gap-4">
                        {filteredCards.map((card) => (
                          <SortableCard key={card.id} id={card.id}>
                            <button
                              onClick={() => confirm('Archive this card?') && archiveCard(selectedJob.id, card.id)}
                              className="absolute top-4 right-3 text-gray-300 hover:text-yellow-500 transition-colors opacity-0 group-hover:opacity-100 text-lg leading-none z-10"
                              aria-label="Archive card"
                              title="Archive"
                            >
                              ↓
                            </button>
                            {/* Category badges */}
                            <div className="mb-1 flex flex-wrap gap-2">
                              {card.category && categories.includes(card.category) ? (
                                // Assigned — only show an Uncategorized button to remove
                                <button
                                  onClick={() => confirm('Remove category from this card?') && updateCard(selectedJob.id, { ...card, category: '' })}
                                  className="text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors"
                                  title="Remove category"
                                >
                                  {card.category.split(' ')[0]} ×
                                </button>
                              ) : (
                                // Unassigned — show all category options
                                categories.map((cat) => (
                                  <button
                                    key={cat}
                                    onClick={() => updateCard(selectedJob.id, { ...card, category: cat })}
                                    className="text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                                  >
                                    {cat.split(' ')[0]}
                                  </button>
                                ))
                              )}
                            </div>
                            <SecCard
                              title={card.title}
                              discription={card.discription}
                              situation={card.situation}
                              task={card.task}
                              action={card.action}
                              result={card.result}
                              notes={card.notes}
                              status={card.status}
                              onSave={(updated) => updateCard(selectedJob.id, { ...card, ...updated })}
                            />
                          </SortableCard>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  {/* Archived cards section */}
                  {archivedCards.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowArchivedCards((v) => !v)}
                        className="w-full text-left text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-between py-2"
                      >
                        <span>Archived ({archivedCards.length})</span>
                        <span>{showArchivedCards ? '▲' : '▼'}</span>
                      </button>

                      {showArchivedCards && (
                        <div className="flex flex-col gap-4 mt-2">
                          {archivedCards.map((card) => (
                            <div key={card.id} className="relative group opacity-50 hover:opacity-100 transition-opacity">
                              <div className="absolute top-4 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                  onClick={() => restoreCard(selectedJob.id, card.id)}
                                  className="text-gray-400 hover:text-blue-500 transition-colors text-xs px-1.5 py-0.5 rounded border border-gray-200 hover:border-blue-300"
                                  title="Restore"
                                >
                                  ↑
                                </button>
                                <button
                                  onClick={() => confirm('Permanently delete this card?') && deleteCard(selectedJob.id, card.id)}
                                  className="text-gray-400 hover:text-red-400 transition-colors text-lg leading-none"
                                  title="Delete permanently"
                                >
                                  ×
                                </button>
                              </div>
                              <SecCard
                                title={card.title}
                                discription={card.discription}
                                situation={card.situation}
                                task={card.task}
                                action={card.action}
                                result={card.result}
                                notes={card.notes}
                                status={card.status}
                                onSave={(updated) => updateCard(selectedJob.id, { ...card, ...updated })}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default Home
