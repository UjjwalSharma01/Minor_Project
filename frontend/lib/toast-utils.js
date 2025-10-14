'use client'

import toast from 'react-hot-toast'
import { triggerSuccessConfetti } from '@/components/premium-interactions'

// Success toast with confetti
export const showSuccessToast = (message, withConfetti = true) => {
  if (withConfetti) {
    triggerSuccessConfetti()
  }
  return toast.success(message, {
    duration: 3000,
    icon: '🎉',
  })
}

// Error toast with shake animation
export const showErrorToast = (message) => {
  return toast.error(message, {
    duration: 4000,
    icon: '❌',
  })
}

// Info toast
export const showInfoToast = (message) => {
  return toast(message, {
    duration: 3000,
    icon: 'ℹ️',
    style: {
      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      color: '#fff',
      border: 'none',
    },
  })
}

// Warning toast
export const showWarningToast = (message) => {
  return toast(message, {
    duration: 3500,
    icon: '⚠️',
    style: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#fff',
      border: 'none',
    },
  })
}

// Loading toast
export const showLoadingToast = (message) => {
  return toast.loading(message, {
    style: {
      background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
      color: '#fff',
      border: 'none',
    },
  })
}

// Promise toast
export const showPromiseToast = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: (data) => {
        triggerSuccessConfetti()
        return messages.success || 'Success!'
      },
      error: messages.error || 'Error occurred',
    },
    {
      success: {
        duration: 3000,
        icon: '🎉',
      },
    }
  )
}

// Custom toast with action button
export const showCustomToast = (message, actionLabel, actionHandler) => {
  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <span className="text-white text-lg">🎯</span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            actionHandler()
            toast.dismiss(t.id)
          }}
          className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-teal-600 hover:text-teal-500 focus:outline-none"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  ))
}
