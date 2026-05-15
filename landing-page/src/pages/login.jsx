import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../firebase'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isNew, setIsNew] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isNew) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-semibold">{isNew ? 'Create Account' : 'Sign In'}</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-600 transition-colors"
        >
          {isNew ? 'Create Account' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={() => setIsNew((v) => !v)}
          className="text-sm text-gray-500 hover:text-blue-500 transition-colors"
        >
          {isNew ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </form>
    </div>
  )
}

export default Login
