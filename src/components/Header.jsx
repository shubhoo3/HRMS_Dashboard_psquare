import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { FaBell, FaUser, FaSearch } from 'react-icons/fa'
import './Header.css'

const Header = () => {
  const { user } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }
  
  return (
    <header className="header">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="search-input" 
        />
      </div>
      
      <div className="header-actions">
        <div className="notification-icon">
          <FaBell />
          <span className="notification-badge">3</span>
        </div>
        
        <div className="user-menu">
          <button className="user-button" onClick={toggleDropdown}>
            <div className="user-avatar">
              <FaUser />
            </div>
            <span className="user-name">{user?.name || 'User'}</span>
          </button>
          
          {showDropdown && (
            <div className="user-dropdown">
              <div className="user-info">
                <div className="user-avatar">
                  <FaUser />
                </div>
                <div>
                  <p className="user-name">{user?.name || 'User'}</p>
                  <p className="user-email">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <ul className="dropdown-menu">
                <li><a href="#">My Profile</a></li>
                <li><a href="#">Settings</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header