import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

export function useUserData(uid) {
  const [jobs, setJobs] = useState([])
  const [cardsByJob, setCardsByJob] = useState({})
  const [resume, setResume] = useState('')

  // Listen to jobs
  useEffect(() => {
    if (!uid) return
    const unsub = onSnapshot(collection(db, 'users', uid, 'jobs'), (snap) => {
      setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [uid])

  // Listen to resume
  useEffect(() => {
    if (!uid) return
    const unsub = onSnapshot(doc(db, 'users', uid, 'resume', 'main'), (snap) => {
      if (snap.exists()) setResume(snap.data().text || '')
    })
    return unsub
  }, [uid])

  // Listen to cards for each job
  useEffect(() => {
    if (!uid || jobs.length === 0) return
    const unsubs = jobs.map((job) =>
      onSnapshot(collection(db, 'users', uid, 'jobs', job.id, 'cards'), (snap) => {
        setCardsByJob((prev) => ({
          ...prev,
          [job.id]: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
        }))
      })
    )
    return () => unsubs.forEach((u) => u())
  }, [uid, jobs.length])

  const addJob = async (job) => {
    await addDoc(collection(db, 'users', uid, 'jobs'), job)
  }

  const updateJob = async (updated) => {
    const { id, ...data } = updated
    await updateDoc(doc(db, 'users', uid, 'jobs', id), data)
  }

  const addCard = async (jobId, card) => {
    await addDoc(collection(db, 'users', uid, 'jobs', jobId, 'cards'), card)
  }

  const updateCard = async (jobId, updated) => {
    const { id, ...data } = updated
    await updateDoc(doc(db, 'users', uid, 'jobs', jobId, 'cards', id), data)
  }

  const updateResume = async (text) => {
    await setDoc(doc(db, 'users', uid, 'resume', 'main'), { text })
    setResume(text)
  }

  const archiveJob = async (jobId) => {
    await updateDoc(doc(db, 'users', uid, 'jobs', jobId), { archived: true })
  }

  const restoreJob = async (jobId) => {
    await updateDoc(doc(db, 'users', uid, 'jobs', jobId), { archived: false })
  }

  const deleteJob = async (jobId) => {
    await deleteDoc(doc(db, 'users', uid, 'jobs', jobId))
  }

  const addCategory = async (jobId, category) => {
    const job = jobs.find((j) => j.id === jobId)
    const current = job?.categories || []
    if (current.includes(category)) return
    await updateDoc(doc(db, 'users', uid, 'jobs', jobId), { categories: [...current, category] })
  }

  const deleteCategory = async (jobId, category) => {
    const job = jobs.find((j) => j.id === jobId)
    const current = job?.categories || []
    await updateDoc(doc(db, 'users', uid, 'jobs', jobId), { categories: current.filter((c) => c !== category) })
  }

  const reorderCards = async (jobId, orderedIds) => {
    await Promise.all(
      orderedIds.map((id, index) =>
        updateDoc(doc(db, 'users', uid, 'jobs', jobId, 'cards', id), { order: index })
      )
    )
  }

  const archiveCard = async (jobId, cardId) => {
    await updateDoc(doc(db, 'users', uid, 'jobs', jobId, 'cards', cardId), { archived: true })
  }

  const restoreCard = async (jobId, cardId) => {
    await updateDoc(doc(db, 'users', uid, 'jobs', jobId, 'cards', cardId), { archived: false })
  }

  const deleteCard = async (jobId, cardId) => {
    await deleteDoc(doc(db, 'users', uid, 'jobs', jobId, 'cards', cardId))
  }

  return { jobs, cardsByJob, resume, addJob, updateJob, deleteJob, archiveJob, restoreJob, addCard, updateCard, deleteCard, archiveCard, restoreCard, reorderCards, addCategory, deleteCategory, updateResume }
}
