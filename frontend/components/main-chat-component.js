'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Bot, Send, Loader2, RefreshCw, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MainChatComponent() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I\'m Smart Processor. Send me your queries and I\'ll process them for you!' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showDebug, setShowDebug] = useState(false)
  const [lastRequest, setLastRequest] = useState(null)
  const [lastResponse, setLastResponse] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    
    // Validate that message contains at least one email address
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    const hasEmail = emailRegex.test(userMessage)
    
    if (!hasEmail) {
      // Show error message without sending to webhook
      setError('⚠️ Please include an email address in your message.')
      const errorMessages = [...messages, 
        { role: 'user', content: userMessage },
        { role: 'assistant', content: '⚠️ Please include an email address in your message. The email can be anywhere in your text, but it\'s required to process your request.' }
      ]
      setMessages(errorMessages)
      return
    }
    
    // Check if message contains behavior data with majority "work" activities
    try {
      // Try to parse JSON from the message
      const jsonMatch = userMessage.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const behaviorData = JSON.parse(jsonMatch[0]);
        
        // Check if it's an array and has behavior data
        if (Array.isArray(behaviorData) && behaviorData.length > 0) {
          const firstEntry = behaviorData[0];
          
          // Check if majority of queries are work-related
          if (firstEntry.features && firstEntry.features.work_pct) {
            const workPercentage = firstEntry.features.work_pct;
            
            // If work percentage is above 50%, don't send to database
            if (workPercentage > 0.5) {
              const workMessages = [...messages,
                { role: 'user', content: userMessage },
                { role: 'assistant', content: `✅ Data processed successfully!\n\n📊 Analysis Result: The user's activities show ${(workPercentage * 100).toFixed(1)}% work-related queries.\n\n✉️ No email alert sent - The majority of the user's queries are related to work activities, which is expected behavior. The data was not flagged for database storage or email notification.` }
              ]
              setMessages(workMessages)
              return
            }
          }
          
          // Also check behavior classification
          if (firstEntry.behavior === 'work') {
            const workMessages = [...messages,
              { role: 'user', content: userMessage },
              { role: 'assistant', content: `✅ Data processed successfully!\n\n📊 Analysis Result: User behavior classified as "work" activities.\n\n✉️ No email alert sent - The user's queries are primarily work-related, which is normal and expected behavior. The data was not flagged for database storage or email notification.` }
            ]
            setMessages(workMessages)
            return
          }
        }
      }
    } catch (parseError) {
      // If JSON parsing fails, continue with normal processing
      console.log('No behavior data detected, proceeding with normal processing')
    }
    
    setInputMessage('')
    setIsLoading(true)
    setError(null)

    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

    // Generate or retrieve session ID
    let sessionId = localStorage.getItem('chat_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('chat_session_id', sessionId)
    }

    try {
      console.log('📤 Sending message to n8n webhook')
      console.log('Message:', userMessage)
      
      // Comprehensive payload with all possible fields
      const payload = {
        // Standard chat fields
        action: 'sendMessage',
        chatInput: userMessage,
        message: userMessage,
        input: userMessage,
        query: userMessage,
        text: userMessage,
        
        // Session and context
        sessionId: sessionId,
        chatSessionKey: sessionId,
        
        // Conversation history for context
        conversationHistory: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        
        // Metadata
        timestamp: new Date().toISOString(),
        messageCount: messages.length,
        
        // User info (if available)
        userId: 'user-' + sessionId,
        
        // Additional context
        context: {
          platform: 'web',
          source: 'dashboard',
          conversationLength: messages.length
        }
      }

      console.log('📦 Full payload:', JSON.stringify(payload, null, 2))
      
      // Store request for debug view
      setLastRequest({
        url: 'https://n8n.ujjwalsharma.tech/webhook/12cfc5fd-580c-4942-a432-f3847197e2a4/chat',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        payload: payload,
        timestamp: new Date().toISOString()
      })
      
      const response = await fetch('https://n8n.ujjwalsharma.tech/webhook/12cfc5fd-580c-4942-a432-f3847197e2a4/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      console.log('📥 Response status:', response.status)
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
        throw new Error(`Webhook returned ${response.status}: ${errorText}`)
      }

      // Try to parse response
      const contentType = response.headers.get('content-type')
      let data
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
        console.log('✅ JSON Response data:', JSON.stringify(data, null, 2))
      } else {
        const textData = await response.text()
        console.log('✅ Text Response:', textData)
        data = { output: textData }
      }

      // Extract the AI response - check multiple possible fields
      let aiResponse = ''
      
      // Check if this is a Gmail API success response (id, threadId, labelIds)
      if (data.id && data.threadId && data.labelIds) {
        console.log('📧 Gmail API response detected - message processed successfully')
        aiResponse = '✅ Message processed successfully! Your query has been received and is being handled.'
      } else if (data.output) {
        aiResponse = data.output
      } else if (data.response) {
        aiResponse = data.response
      } else if (data.message) {
        aiResponse = data.message
      } else if (data.text) {
        aiResponse = data.text
      } else if (data.result) {
        aiResponse = data.result
      } else if (data.reply) {
        aiResponse = data.reply
      } else if (data.answer) {
        aiResponse = data.answer
      } else if (data.data && data.data.output) {
        aiResponse = data.data.output
      } else if (typeof data === 'string') {
        aiResponse = data
      } else {
        // If none of the expected fields exist, stringify the whole response
        console.warn('⚠️ Unexpected response structure:', data)
        aiResponse = '🤖 I received your message. Here\'s the response:\n\n' + JSON.stringify(data, null, 2)
      }

      if (!aiResponse || aiResponse.trim() === '') {
        aiResponse = '🤖 I received your message, but the response was empty. Please try again.'
      }

      console.log('💬 Final AI response:', aiResponse)

      // Store response for debug view
      setLastResponse({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: data,
        extractedResponse: aiResponse,
        timestamp: new Date().toISOString()
      })

      // Add AI response to chat
      setMessages([...newMessages, { role: 'assistant', content: aiResponse }])

    } catch (err) {
      console.error('❌ Error sending message:', err)
      setError('Failed to send message. Please try again.')
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: '❌ Sorry, I encountered an error: ' + err.message + '\n\nPlease check the console for details.' 
      }])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      { role: 'assistant', content: 'Hi! 👋 I\'m Smart Processor. Send me your queries and I\'ll process them for you!' }
    ])
  }

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white">Smart Processor</h2>
              <p className="text-slate-300 text-xs sm:text-sm flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Processing your queries</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs sm:text-sm"
              title="Toggle debug view"
            >
              🐛
            </button>
            <button
              onClick={clearChat}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title="Clear chat"
            >
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div className="bg-black text-green-400 p-4 max-h-64 overflow-y-auto text-xs font-mono border-b border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <strong className="text-yellow-400">🐛 DEBUG MODE</strong>
            <button onClick={() => setShowDebug(false)} className="text-red-400 hover:text-red-300">✕</button>
          </div>
          
          {lastRequest && (
            <div className="mb-4">
              <div className="text-blue-400 font-bold mb-1">📤 LAST REQUEST:</div>
              <div className="pl-2 space-y-1">
                <div><span className="text-gray-400">URL:</span> {lastRequest.url}</div>
                <div><span className="text-gray-400">Method:</span> {lastRequest.method}</div>
                <div><span className="text-gray-400">Time:</span> {lastRequest.timestamp}</div>
                <div className="text-gray-400">Payload:</div>
                <pre className="pl-2 text-xs overflow-x-auto">{JSON.stringify(lastRequest.payload, null, 2)}</pre>
              </div>
            </div>
          )}
          
          {lastResponse && (
            <div>
              <div className="text-green-400 font-bold mb-1">📥 LAST RESPONSE:</div>
              <div className="pl-2 space-y-1">
                <div><span className="text-gray-400">Status:</span> {lastResponse.status}</div>
                <div><span className="text-gray-400">Time:</span> {lastResponse.timestamp}</div>
                <div className="text-gray-400">Raw Data:</div>
                <pre className="pl-2 text-xs overflow-x-auto">{JSON.stringify(lastResponse.data, null, 2)}</pre>
                <div className="text-gray-400">Extracted Response:</div>
                <pre className="pl-2 text-xs">{lastResponse.extractedResponse}</pre>
              </div>
            </div>
          )}
          
          {!lastRequest && !lastResponse && (
            <div className="text-gray-500">Send a message to see debug information...</div>
          )}
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-0">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-slate-700' 
                    : 'bg-gradient-to-r from-slate-600 to-slate-700'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-slate-700 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-slate-600 to-slate-700">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center space-x-2">
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              disabled={isLoading}
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '52px', maxHeight: '120px' }}
            />
            <div className="absolute right-3 bottom-3 text-xs text-gray-400">
              Press Enter to send
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="h-[52px] px-5 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2 font-medium flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </div>

        {/* Helper Text */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center space-x-1">
            <MessageCircle className="h-3 w-3" />
            <span>Powered by n8n AI</span>
          </span>
          <span>{messages.length - 1} messages</span>
        </div>
      </div>
    </div>
  )
}
