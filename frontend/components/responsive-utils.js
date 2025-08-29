'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'

// Custom hook for responsive breakpoints
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('desktop')

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth
      if (width < 640) setBreakpoint('mobile')
      else if (width < 768) setBreakpoint('tablet')
      else if (width < 1024) setBreakpoint('laptop')
      else setBreakpoint('desktop')
    }

    checkBreakpoint()
    window.addEventListener('resize', checkBreakpoint)
    return () => window.removeEventListener('resize', checkBreakpoint)
  }, [])

  return breakpoint
}

// Responsive Grid Component
export const ResponsiveGrid = ({ 
  children, 
  columns = { mobile: 1, tablet: 2, laptop: 3, desktop: 4 },
  gap = 'gap-6',
  className = ''
}) => {
  const breakpoint = useBreakpoint()
  const currentColumns = columns[breakpoint] || columns.desktop || 4

  return (
    <div className={`grid grid-cols-${currentColumns} ${gap} ${className}`}>
      {children}
    </div>
  )
}

// Responsive Container
export const ResponsiveContainer = ({ 
  children, 
  maxWidth = '7xl',
  padding = { mobile: 'px-4', tablet: 'px-6', laptop: 'px-8', desktop: 'px-8' },
  className = ''
}) => {
  const breakpoint = useBreakpoint()
  const currentPadding = padding[breakpoint] || padding.desktop || 'px-8'

  return (
    <div className={`max-w-${maxWidth} mx-auto ${currentPadding} ${className}`}>
      {children}
    </div>
  )
}

// Mobile-First Navigation Menu
export const MobileMenu = ({ 
  isOpen, 
  onClose, 
  children, 
  title = "Menu"
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto h-full pb-20">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Responsive Card Component
export const ResponsiveCard = ({ 
  children, 
  padding = { mobile: 'p-4', tablet: 'p-6', laptop: 'p-6', desktop: 'p-8' },
  className = '',
  hover = true
}) => {
  const breakpoint = useBreakpoint()
  const currentPadding = padding[breakpoint] || padding.desktop || 'p-8'

  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 transition-all duration-200 ${currentPadding} ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Collapsible Section for Mobile
export const CollapsibleSection = ({ 
  title, 
  children, 
  defaultOpen = false,
  icon: Icon
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
          <span className="font-medium text-slate-900 dark:text-white">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white dark:bg-slate-900">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Responsive Table Wrapper
export const ResponsiveTable = ({ children, className = '' }) => {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'

  if (isMobile) {
    // On mobile, convert table to card layout
    return (
      <div className={`space-y-4 ${className}`}>
        {/* This would need custom implementation per table */}
        {children}
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        {children}
      </table>
    </div>
  )
}

// Responsive Modal
export const ResponsiveModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md'
}) => {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
              animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
              exit={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full ${isMobile ? 'h-full' : sizes[size]} ${isMobile ? 'rounded-t-2xl' : 'rounded-2xl'} bg-white dark:bg-slate-900 shadow-xl ${isMobile ? 'mt-auto' : ''}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className={`p-6 ${isMobile ? 'overflow-y-auto flex-1' : ''}`}>
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Responsive Stats Grid
export const ResponsiveStatsGrid = ({ stats = [] }) => {
  const breakpoint = useBreakpoint()
  
  const getGridCols = () => {
    switch (breakpoint) {
      case 'mobile': return 'grid-cols-1'
      case 'tablet': return 'grid-cols-2'
      case 'laptop': return 'grid-cols-3'
      default: return 'grid-cols-4'
    }
  }

  return (
    <div className={`grid ${getGridCols()} gap-4 md:gap-6`}>
      {stats.map((stat, index) => (
        <ResponsiveCard key={index} className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {stat.value}
          </div>
          <div className="text-sm md:text-base text-slate-600 dark:text-slate-400">
            {stat.label}
          </div>
          {stat.change && (
            <div className={`text-xs md:text-sm mt-1 ${
              stat.change > 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {stat.change > 0 ? '+' : ''}{stat.change}%
            </div>
          )}
        </ResponsiveCard>
      ))}
    </div>
  )
}

// Touch-friendly input for mobile
export const TouchInput = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '',
  ...props 
}) => {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 
        rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
        ${isMobile ? 'text-16px' : ''} ${className}
      `}
      style={isMobile ? { fontSize: '16px' } : {}} // Prevents zoom on iOS
      {...props}
    />
  )
}
