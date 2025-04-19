import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  FaChartLine, 
  FaUserTie, 
  FaUsers, 
  FaCalendarCheck, 
  FaCalendarAlt, 
  FaSignOutAlt 
} from 'react-icons/fa'
import Logo from './Logo'
import './Sidebar.css'

const Sidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Logo />
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaChartLine />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/candidates" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaUserTie />
              <span>Candidates</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/employees" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaUsers />
              <span>Employees</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/attendance" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaCalendarCheck />
              <span>Attendance</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/leaves" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaCalendarAlt />
              <span>Leaves</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar