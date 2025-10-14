'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load the n8n chat embed script
    if (typeof window !== 'undefined' && !isLoaded) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js'
      script.onload = () => setIsLoaded(true)
      document.head.appendChild(script)

      return () => {
        // Cleanup script if component unmounts
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      }
    }
  }, [isLoaded])

  useEffect(() => {
    // Initialize the chat widget when loaded
    if (isLoaded && isOpen && typeof window !== 'undefined') {
      const container = document.getElementById('n8n-chat-container')
      if (container && !container.hasChildNodes()) {
        const chatElement = document.createElement('n8n-chat')
        chatElement.setAttribute('webhookUrl', 'https://n8n.ujjwalsharma.tech/webhook/12cfc5fd-580c-4942-a432-f3847197e2a4/chat')
        chatElement.setAttribute('chatInputKey', 'chatInput')
        chatElement.setAttribute('chatSessionKey', 'sessionId')
        chatElement.setAttribute('defaultLanguage', 'en')
        chatElement.setAttribute('showWelcomeScreen', 'true')
        chatElement.setAttribute('initialMessages', JSON.stringify([
          'Hi there! 👋',
          'I\'m your AI assistant. How can I help you today?'
        ]))
        chatElement.style.width = '100%'
        chatElement.style.height = '100%'
        container.appendChild(chatElement)
      }
    }
  }, [isLoaded, isOpen])

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 group"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6 group-hover:animate-bounce" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 w-[400px] h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Assistant</h3>
                  <p className="text-blue-100 text-xs">Online now</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Container */}
            <div 
              id="n8n-chat-container" 
              className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden"
            >
              {!isLoaded && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading chat...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Responsive Styling */}
      <style jsx>{`
        @media (max-width: 640px) {
          .fixed.bottom-24.right-6 {
            width: calc(100vw - 2rem);
            height: calc(100vh - 10rem);
            right: 1rem;
            bottom: 5rem;
          }
        }
      `}</style>
    </>
  )
}
