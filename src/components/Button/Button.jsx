import { forwardRef } from 'react'
import './Button.css'

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...rest
}, ref) => {
  return (
    <button
      ref={ref}
      className={`button button-${variant} button-${size} ${fullWidth ? 'button-full-width' : ''}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      {...rest}
    >
      {isLoading && <span className="button-spinner" />}
      {leftIcon && !isLoading && <span className="button-icon button-icon-left">{leftIcon}</span>}
      <span className="button-text">{children}</span>
      {rightIcon && !isLoading && <span className="button-icon button-icon-right">{rightIcon}</span>}
    </button>
  )
})

Button.displayName = 'Button'

export default Button