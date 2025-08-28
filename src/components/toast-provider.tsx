'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(209, 213, 219, 0.3)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px 20px',
          color: '#374151',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
          style: {
            border: '1px solid rgba(16, 185, 129, 0.2)',
            background: 'rgba(255, 255, 255, 0.95)',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
          style: {
            border: '1px solid rgba(239, 68, 68, 0.2)',
            background: 'rgba(255, 255, 255, 0.95)',
          },
        },
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#ffffff',
          },
          style: {
            border: '1px solid rgba(59, 130, 246, 0.2)',
            background: 'rgba(255, 255, 255, 0.95)',
          },
        },
      }}
    />
  )
}
