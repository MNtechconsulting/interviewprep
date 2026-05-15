import { NavLink } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

function Navbar() {
  return (
    <nav className="flex items-center gap-6 px-8 py-4 border-b border-gray-200">
      <span className="font-semibold text-lg">MyApp</span>
      <div className="flex gap-4 ml-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-sm ${isActive ? 'text-blue-500 font-medium' : 'text-gray-500 hover:text-gray-800'}`
          }
        >
          Home
        </NavLink>
        <button
          onClick={() => signOut(auth)}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </nav>
  )
}

export default Navbar
