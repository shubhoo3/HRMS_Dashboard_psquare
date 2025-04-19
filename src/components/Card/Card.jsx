import './Card.css'

const Card = ({ 
  children, 
  title, 
  subtitle, 
  icon, 
  actions,
  variant = 'default',
  fullHeight = false
}) => {
  return (
    <div className={`card card-${variant} ${fullHeight ? 'card-full-height' : ''}`}>
      {(title || subtitle || icon || actions) && (
        <div className="card-header">
          <div className="card-header-left">
            {icon && <div className="card-icon">{icon}</div>}
            <div className="card-header-titles">
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}

export default Card