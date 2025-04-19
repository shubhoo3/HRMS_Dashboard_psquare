import { Link } from 'react-router-dom'
import './Logo.css'

const Logo = ({ size = 'medium' }) => {
  return (
    <Link to="/" className={`logo logo-${size}`}>
      <div className="logo-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="3" fill="#5E17EB"/>
          <path d="M6 6H18V18H6V6Z" stroke="white" strokeWidth="1.5"/>
        </svg>
      </div>
      <span className="logo-text">HR Pulse</span>
    </Link>
  )
}

export default Logo