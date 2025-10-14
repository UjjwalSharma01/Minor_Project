'use client'

import { motion } from 'framer-motion'
import { forwardRef, useState } from 'react'
import confetti from 'canvas-confetti'

// Premium button with multiple hover effects and magnetic attraction
export const PremiumButton = forwardRef(({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  withGlow = true,
  withScale = true,
  magnetic = true,
  ...props 
}, ref) => {
  const [magneticPosition, setMagneticPosition] = useState({ x: 0, y: 0 })
  const buttonRef = useState(null)[0]

  const variants = {
    primary: 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-teal-500/25',
    secondary: 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white shadow-amber-500/25',
    accent: 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white shadow-slate-500/25',
    outline: 'border-2 border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white',
    ghost: 'hover:bg-teal-50 dark:hover:bg-teal-900/20 text-teal-700 dark:text-teal-300'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  const handleMouseMove = (e) => {
    if (!magnetic || disabled) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * 0.2
    const deltaY = (e.clientY - centerY) * 0.2

    setMagneticPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setMagneticPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      className={`
        relative overflow-hidden
        rounded-xl font-semibold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${withGlow ? 'shadow-lg hover:shadow-2xl' : ''}
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: magneticPosition.x,
        y: magneticPosition.y,
      }}
      whileHover={!disabled && withScale ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{
        x: { type: 'spring', stiffness: 200, damping: 15 },
        y: { type: 'spring', stiffness: 200, damping: 15 },
        scale: { type: 'spring', stiffness: 400, damping: 20 },
      }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Glow effect */}
      {withGlow && !disabled && (
        <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 bg-gradient-to-r from-teal-400 to-cyan-400" />
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
})

PremiumButton.displayName = 'PremiumButton'

// Interactive card with tilt effect
export const InteractiveCard = ({ 
  children, 
  className = '',
  withTilt = true,
  withGlow = true,
  onClick
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

  const handleMouseMove = (e) => {
    if (!withTilt) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0.5, y: 0.5 })
  }

  // Subtle tilt calculation (max 5 degrees)
  const tiltX = withTilt ? (mousePosition.y - 0.5) * 5 : 0
  const tiltY = withTilt ? (mousePosition.x - 0.5) * -5 : 0

  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-white dark:bg-gray-800
        rounded-2xl
        border border-gray-200 dark:border-gray-700
        shadow-lg
        transition-all duration-300
        cursor-pointer
        group
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tiltX,
        rotateY: tiltY,
        scale: mousePosition.x !== 0.5 || mousePosition.y !== 0.5 ? 1.02 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        boxShadow: withTilt && (mousePosition.x !== 0.5 || mousePosition.y !== 0.5)
          ? `${(mousePosition.x - 0.5) * 20}px ${(mousePosition.y - 0.5) * 20}px 40px rgba(20, 184, 166, 0.15)`
          : undefined,
      }}
    >
      {/* Gradient background that appears on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Glow effect */}
      {withGlow && (
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      )}

      {/* Top border highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Corner shine effect that follows cursor */}
      <motion.div
        className="absolute w-48 h-48 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-20 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none"
        style={{
          left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </motion.div>
  )
}

// Icon with bounce animation
export const AnimatedIcon = ({ 
  icon: Icon, 
  className = '',
  size = 24,
  withBounce = true,
  withGlow = false,
  color = 'currentColor'
}) => {
  return (
    <motion.div
      className={`inline-flex ${className}`}
      whileHover={withBounce ? { 
        scale: 1.2,
        rotate: [0, -10, 10, -10, 0],
      } : { scale: 1.1 }}
      transition={{ 
        type: 'spring',
        stiffness: 400,
        damping: 10
      }}
    >
      {withGlow && (
        <motion.div
          className="absolute inset-0 blur-md"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Icon size={size} color={color} />
        </motion.div>
      )}
      <Icon size={size} color={color} className="relative z-10" />
    </motion.div>
  )
}

// Success confetti effect
export const triggerSuccessConfetti = () => {
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999
  }

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    })
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  })

  fire(0.2, {
    spread: 60,
  })

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  })

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  })

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}

// Error shake animation
export const ErrorShake = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      animate={{
        x: [0, -10, 10, -10, 10, 0],
      }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}

// Pulse animation for important elements
export const PulseEffect = ({ children, className = '', intensity = 'normal' }) => {
  const intensities = {
    subtle: { scale: [1, 1.02, 1] },
    normal: { scale: [1, 1.05, 1] },
    strong: { scale: [1, 1.1, 1] }
  }

  return (
    <motion.div
      className={className}
      animate={intensities[intensity]}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}

// Gradient border animation
export const GradientBorder = ({ children, className = '', animated = true }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(90deg, #14b8a6, #06b6d4, #f59e0b, #14b8a6)',
          backgroundSize: '400% 400%',
        }}
        animate={animated ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <div className="relative bg-white dark:bg-gray-900 m-[2px] rounded-2xl">
        {children}
      </div>
    </div>
  )
}

// Premium card with gradient border and 3D effect
export const PremiumCard = ({ 
  children, 
  className = '',
  withGradientBorder = false,
  withTilt = false,
  onClick
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!withTilt) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePosition({ x, y })
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 0.5, y: 0.5 })
  }

  // Very subtle tilt (max 3 degrees for premium feel)
  const tiltX = withTilt && isHovered ? (mousePosition.y - 0.5) * 3 : 0
  const tiltY = withTilt && isHovered ? (mousePosition.x - 0.5) * -3 : 0

  const cardContent = (
    <motion.div
      className={`
        relative overflow-hidden
        bg-white dark:bg-gray-800
        rounded-2xl
        shadow-xl
        transition-shadow duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tiltX,
        rotateY: tiltY,
      }}
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      whileTap={onClick ? { scale: 0.99 } : {}}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        boxShadow: isHovered
          ? `${(mousePosition.x - 0.5) * 15}px ${(mousePosition.y - 0.5) * 15}px 30px rgba(20, 184, 166, 0.2), 0 10px 40px rgba(0, 0, 0, 0.1)`
          : '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Subtle gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-cyan-500/5 opacity-0 transition-opacity duration-300"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Cursor-following light effect */}
      {withTilt && (
        <motion.div
          className="absolute w-32 h-32 bg-gradient-to-br from-teal-400/30 to-cyan-400/30 rounded-full blur-2xl opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`,
          }}
          transition={{
            opacity: { duration: 0.3 },
            left: { type: 'spring', stiffness: 150, damping: 20 },
            top: { type: 'spring', stiffness: 150, damping: 20 },
          }}
          style={{
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </motion.div>
  )

  if (withGradientBorder) {
    return (
      <GradientBorder className={className}>
        <div className="p-0.5">
          {cardContent}
        </div>
      </GradientBorder>
    )
  }

  return cardContent
}

// Floating element animation
export const FloatingElement = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
    >
      {children}
    </motion.div>
  )
}

// Shimmer loading effect
export const ShimmerEffect = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}
