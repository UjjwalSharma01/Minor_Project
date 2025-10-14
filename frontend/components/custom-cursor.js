'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

/**
 * Premium Custom Cursor Component
 * Creates a beautiful cursor follower with smooth animations
 */
export const CustomCursor = ({ variant = 'default' }) => {
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  // Instant position for the dot (follows cursor exactly)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Delayed position for the ring (smooth follow)
  const springConfig = { damping: 25, stiffness: 150 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)

      // Check if hovering over interactive elements
      const target = e.target
      const isInteractive = 
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('.cursor-pointer')

      setIsPointer(!!isInteractive)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseEnter = () => setIsHidden(false)
    const handleMouseLeave = () => setIsHidden(true)

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.body.addEventListener('mouseenter', handleMouseEnter)
    document.body.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cursorX, cursorY])

  if (isHidden) return null

  return (
    <>
      {/* Outer ring - follows cursor with SMOOTH DELAY */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
      >
        <motion.div
          className="flex items-center justify-center"
          style={{
            width: '48px',
            height: '48px',
            marginLeft: '-24px',
            marginTop: '-24px',
          }}
          animate={{
            scale: isClicking ? 0.85 : isPointer ? 1.8 : 1,
            opacity: isPointer ? 1 : 0.7,
          }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 18,
          }}
        >
          {/* Beautiful gradient ring with glow */}
          <div className="w-full h-full rounded-full border-2 border-teal-500/60 bg-gradient-to-br from-teal-500/5 via-cyan-500/5 to-transparent backdrop-blur-sm shadow-lg shadow-teal-500/20" />
        </motion.div>
      </motion.div>

      {/* Inner dot - follows cursor INSTANTLY (no delay) - stays with default cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: cursorX,
          top: cursorY,
        }}
      >
        <motion.div
          className="flex items-center justify-center"
          style={{
            width: '8px',
            height: '8px',
            marginLeft: '-4px',
            marginTop: '-4px',
          }}
          animate={{
            scale: isClicking ? 0.6 : isPointer ? 0 : 1,
            opacity: isPointer ? 0 : 1,
          }}
          transition={{
            scale: { type: 'spring', stiffness: 500, damping: 25 },
            opacity: { duration: 0.15 },
          }}
        >
          {/* Small accent dot that stays perfectly aligned with cursor */}
          <div className="w-full h-full bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full shadow-lg shadow-teal-500/50" />
        </motion.div>
      </motion.div>

      {/* Ripple effect on click - uses instant position */}
      {isClicking && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{
            x: cursorX, // Instant position
            y: cursorY, // Instant position
          }}
          initial={{ opacity: 0.8, scale: 0.5 }}
          animate={{ opacity: 0, scale: 2.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <div className="w-20 h-20 rounded-full border-2 border-teal-400/40 bg-teal-400/5" />
          </div>
        </motion.div>
      )}
    </>
  )
}

/**
 * Premium Cursor with Glow Effect
 */
export const GlowCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const [isPointer, setIsPointer] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 30, stiffness: 200 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const updatePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)

      const target = e.target
      const isInteractive = 
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer')

      setIsPointer(!!isInteractive)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', updatePosition)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [cursorX, cursorY])

  if (!isVisible) return null

  return (
    <>
      {/* Ambient glow effect that follows cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9994] mix-blend-soft-light dark:mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: isPointer ? 1.4 : 1,
            opacity: isPointer ? 0.8 : 0.4,
          }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 25,
          }}
        >
          {/* Soft gradient glow */}
          <div className="w-40 h-40 bg-gradient-to-r from-teal-500/15 via-cyan-500/10 to-amber-500/5 rounded-full blur-3xl" />
        </motion.div>
      </motion.div>
    </>
  )
}

/**
 * Magnetic Cursor Effect
 * Buttons attract the cursor when nearby
 */
export const MagneticCursor = ({ strength = 0.3, children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Cursor Trail Effect
 */
export const CursorTrail = () => {
  const [trail, setTrail] = useState([])

  useEffect(() => {
    const updateTrail = (e) => {
      const newDot = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      }

      setTrail((prev) => [...prev.slice(-8), newDot])
    }

    window.addEventListener('mousemove', updateTrail)
    return () => window.removeEventListener('mousemove', updateTrail)
  }, [])

  return (
    <>
      {trail.map((dot, index) => (
        <motion.div
          key={dot.id}
          className="fixed w-2 h-2 bg-teal-500/30 rounded-full pointer-events-none z-[9990]"
          style={{
            left: dot.x,
            top: dot.y,
          }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, delay: index * 0.05 }}
        />
      ))}
    </>
  )
}
