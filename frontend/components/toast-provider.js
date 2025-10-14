'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb',
        },
        // Success
        success: {
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            color: '#fff',
            border: 'none',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#14b8a6',
          },
        },
        // Error
        error: {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
            border: 'none',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
        // Loading
        loading: {
          style: {
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            color: '#fff',
            border: 'none',
          },
        },
      }}
    />
  )
}
