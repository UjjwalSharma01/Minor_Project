'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import confetti from 'canvas-confetti'

// Premium button with multiple hover effects
export const PremiumButton = forwardRef(({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  withGlow = true,
  withScale = true,
  ...props 
}, ref) => {
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
      whileHover={!disabled && withScale ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
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
      whileHover={{ 
        scale: 1.02,
        y: -8,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
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

      {/* Corner shine effect */}
      <motion.div
        className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-20 rounded-full blur-2xl transition-opacity duration-500"
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
export const GradientBorder = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(90deg, #14b8a6, #06b6d4, #f59e0b, #14b8a6)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
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
