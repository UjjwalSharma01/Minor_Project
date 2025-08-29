'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Check, Copy, Heart, Star, Bookmark, Share2, ArrowUp } from 'lucide-react'

// Animated Button with Hover Effects
export const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick,
  className = '',
  disabled = false,
  ...props 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white',
    secondary: 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white',
    danger: 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} ${sizes[size]} 
        rounded-lg font-medium transition-all duration-200 
        shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Copy to Clipboard with Animation
export const CopyButton = ({ text, children }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <motion.button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center gap-2 text-emerald-600"
          >
            <Check className="h-4 w-4" />
            <span className="text-sm">Copied!</span>
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400"
          >
            <Copy className="h-4 w-4" />
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// Floating Action Button
export const FloatingActionButton = ({ onClick, icon: Icon, label, position = 'bottom-right' }) => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  return (
    <motion.button
      onClick={onClick}
      className={`fixed ${positions[position]} z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group`}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <Icon className="h-6 w-6" />
      {label && (
        <div className="absolute right-full mr-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {label}
        </div>
      )}
    </motion.button>
  )
}

// Like Button with Heart Animation
export const LikeButton = ({ isLiked: initialLiked = false, onToggle }) => {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [particles, setParticles] = useState([])

  const handleClick = () => {
    const newLiked = !isLiked
    setIsLiked(newLiked)
    onToggle?.(newLiked)

    if (newLiked) {
      // Create particle effect
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: Math.random(),
        angle: (i * 60) * (Math.PI / 180),
        delay: i * 0.1
      }))
      setParticles(newParticles)
      setTimeout(() => setParticles([]), 1000)
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        className={`p-2 rounded-full transition-colors ${
          isLiked 
            ? 'bg-red-100 dark:bg-red-900/30 text-red-500' 
            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        </motion.div>
      </motion.button>
      
      {/* Particle effect */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full pointer-events-none"
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              opacity: 1 
            }}
            animate={{ 
              x: Math.cos(particle.angle) * 30,
              y: Math.sin(particle.angle) * 30,
              scale: 1,
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.6,
              delay: particle.delay,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Star Rating Component
export const StarRating = ({ rating, maxRating = 5, onRate, size = 'md', readonly = false }) => {
  const [hoveredRating, setHoveredRating] = useState(0)

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= (hoveredRating || rating)
        
        return (
          <motion.button
            key={index}
            onMouseEnter={() => !readonly && setHoveredRating(starValue)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            onClick={() => !readonly && onRate?.(starValue)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'}`}
            whileHover={!readonly ? { scale: 1.2 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
          >
            <Star 
              className={`${sizes[size]} transition-colors ${
                isFilled 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </motion.button>
        )
      })}
    </div>
  )
}

// Bookmark Toggle
export const BookmarkButton = ({ isBookmarked: initialBookmarked = false, onToggle }) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)

  const handleClick = () => {
    const newBookmarked = !isBookmarked
    setIsBookmarked(newBookmarked)
    onToggle?.(newBookmarked)
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors ${
        isBookmarked 
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500' 
          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
      }`}
      whileHover={{ scale: 1.1, rotate: isBookmarked ? 0 : 12 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={isBookmarked ? { 
          scale: [1, 1.3, 1],
          rotate: [0, -10, 10, 0]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
      </motion.div>
    </motion.button>
  )
}

// Share Button with Animation
export const ShareButton = ({ onShare, url, title }) => {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    
    if (navigator.share && url) {
      try {
        await navigator.share({ url, title })
      } catch {
        console.log('Share cancelled or failed')
      }
    } else {
      onShare?.()
    }
    
    setTimeout(() => setIsSharing(false), 500)
  }

  return (
    <motion.button
      onClick={handleShare}
      className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isSharing ? { rotate: [0, -10, 10, 0] } : {}}
    >
      <Share2 className="h-5 w-5" />
    </motion.button>
  )
}

// Scroll to Top Button
export const ScrollToTopButton = ({ threshold = 300 }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > threshold)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <FloatingActionButton
          onClick={scrollToTop}
          icon={ArrowUp}
          label="Scroll to top"
          position="bottom-right"
        />
      )}
    </AnimatePresence>
  )
}

// Progress Button (for file uploads, form submissions, etc.)
export const ProgressButton = ({ 
  progress = 0, 
  isActive = false, 
  children, 
  onClick,
  className = '' 
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative overflow-hidden px-6 py-3 rounded-lg font-medium transition-all duration-200 ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-blue-500/20"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
