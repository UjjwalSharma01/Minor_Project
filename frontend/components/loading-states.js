'use client'

import { motion } from 'framer-motion'
import { Loader2, AlertCircle, RefreshCw, Wifi } from 'lucide-react'

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      {text && <span className="text-slate-600 dark:text-slate-400">{text}</span>}
    </div>
  )
}

// Enhanced Skeleton Loading Component with Shimmer
export const SkeletonLoader = ({ className = '', children, withShimmer = true }) => (
  <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700 rounded ${className}`}>
    {children}
    {withShimmer && (
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
    )}
  </div>
)

// Card Skeleton with premium shimmer effect
export const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
    <div className="space-y-4">
      <SkeletonLoader className="h-8 w-3/4" />
      <SkeletonLoader className="h-4 w-full" />
      <SkeletonLoader className="h-4 w-5/6" />
      <div className="flex gap-2 mt-4">
        <SkeletonLoader className="h-10 w-24 rounded-lg" />
        <SkeletonLoader className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  </div>
)

// Dashboard Card Skeleton
export const DashboardCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <SkeletonLoader className="h-4 w-24 mb-2" />
        <SkeletonLoader className="h-8 w-32" />
      </div>
      <SkeletonLoader className="h-12 w-12 rounded-xl" />
    </div>
    <SkeletonLoader className="h-3 w-full" />
  </div>
)

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 4 }) => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
    {Array.from({ length: columns }).map((_, i) => (
      <SkeletonLoader key={i} className="h-4 flex-1" />
    ))}
  </div>
)

// Page Loading Component
export const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Loading Dashboard</h2>
        <p className="text-slate-600 dark:text-slate-400">Please wait while we load your data...</p>
      </div>
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </motion.div>
  </div>
)

// Error Component
export const ErrorDisplay = ({ 
  title = 'Something went wrong', 
  message = 'An unexpected error occurred. Please try again.', 
  onRetry,
  showRefresh = true 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center max-w-md mx-auto"
  >
    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
      <AlertCircle className="h-8 w-8 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
    {showRefresh && (
      <button
        onClick={onRetry}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    )}
  </motion.div>
)

// Connection Status Component
export const ConnectionStatus = ({ isOnline = true }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm ${
      isOnline 
        ? 'bg-green-100/90 dark:bg-green-900/30 border border-green-200 dark:border-green-700' 
        : 'bg-red-100/90 dark:bg-red-900/30 border border-red-200 dark:border-red-700'
    }`}
  >
    <div className="flex items-center gap-2">
      <Wifi className={`h-4 w-4 ${isOnline ? 'text-green-600' : 'text-red-600'}`} />
      <span className={`text-sm font-medium ${isOnline ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
        {isOnline ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  </motion.div>
)

// Form Loading State
export const FormLoader = ({ isLoading, children }) => (
  <div className="relative">
    {children}
    {isLoading && (
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
        <LoadingSpinner text="Processing..." />
      </div>
    )}
  </div>
)

// Data Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonLoader 
            key={colIndex} 
            className="h-4 flex-1" 
          />
        ))}
      </div>
    ))}
  </div>
)

// Chart Skeleton
export const ChartSkeleton = () => (
  <div className="space-y-4">
    <SkeletonLoader className="h-6 w-48" />
    <div className="h-64 flex items-end justify-between gap-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonLoader 
          key={i} 
          className={`w-full`}
          style={{ height: `${Math.random() * 200 + 50}px` }}
        />
      ))}
    </div>
  </div>
)

// Button Loading State
export const ButtonLoader = ({ isLoading, children, ...props }) => (
  <button
    {...props}
    disabled={isLoading || props.disabled}
    className={`${props.className} relative ${isLoading ? 'cursor-not-allowed opacity-75' : ''}`}
  >
    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )}
    <span className={isLoading ? 'invisible' : 'visible'}>
      {children}
    </span>
  </button>
)
