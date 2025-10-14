'use client'

import { useState } from 'react'
import { Bot, RefreshCw } from 'lucide-react'

export default function SimpleChatComponent() {
  const [key, setKey] = useState(0)

  const handleRefresh = () => {
    setKey(prev => prev + 1)
  }

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
              <p className="text-blue-100 text-sm flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Online and ready to help</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Refresh chat"
          >
            <RefreshCw className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Chat Container - Using Iframe */}
      <div className="flex-1 relative bg-gray-50 dark:bg-gray-900">
        <iframe
          key={key}
          src="https://n8n.ujjwalsharma.tech/webhook/12cfc5fd-580c-4942-a432-f3847197e2a4/chat"
          className="w-full h-full border-0"
          style={{ minHeight: '500px' }}
          allow="clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          title="AI Chat Assistant"
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>💡 Tip: Press Enter to send messages</span>
          <span>Powered by n8n</span>
        </div>
      </div>
    </div>
  )
}
