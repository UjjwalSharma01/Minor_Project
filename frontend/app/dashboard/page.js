'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield,
  Database,
  Sparkles,
  MessageSquare
} from 'lucide-react'
import ProtectedRoute from '@/components/protected-route'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/lib/auth-context'
import MainChatComponent from '@/components/main-chat-component'
import AirtableViewer from '@/components/airtable-viewer'
import { SimpleParticles, GlassCard } from '@/components/animated-particles'
import { PremiumButton, InteractiveCard, AnimatedIcon } from '@/components/premium-interactions'

const quickActions = [
  { name: 'Smart Processor', icon: MessageSquare, view: 'chat', color: 'teal' },
  { name: 'Database Viewer', icon: Database, view: 'database', color: 'cyan' },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState('chat')
  const [tableName, setTableName] = useState('Main Table')
  // Base ID from environment variable (token is scoped to this specific base)
  const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        <SimpleParticles count={25} />
        
        {/* Simple Header */}
        <header className="glass border-b backdrop-blur-lg sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AnimatedIcon icon={Shield} size={32} withBounce color="#475569" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  InsightNet Dashboard
                </span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="hidden sm:inline-block text-gray-600 dark:text-gray-300">
                  Welcome, {user?.displayName || user?.email || 'User'}
                </span>
                <ThemeToggle />
                <PremiumButton
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                >
                  Logout
                </PremiumButton>
              </motion.div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back! 👋
                      </h1>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        {activeView === 'chat' 
                          ? 'Send your queries to our Smart Processor for instant analysis and insights.'
                          : 'View and manage your database records from Airtable.'}
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Quick Actions Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <GlassCard hover={false} className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Navigation
                  </h2>
                  <div className="space-y-2">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <InteractiveCard
                          onClick={() => setActiveView(action.view)}
                          withTilt={false}
                          className={`cursor-pointer transition-all ${
                            activeView === action.view 
                              ? 'ring-2 ring-teal-500 bg-teal-500/10' 
                              : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3 p-3">
                            <motion.div 
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                                activeView === action.view
                                  ? 'bg-gradient-to-br from-teal-500 to-cyan-500 shadow-teal-500/50'
                                  : 'bg-gradient-to-br from-teal-600 to-cyan-600 shadow-teal-500/30'
                              }`}
                              whileHover={{ rotate: [0, -10, 10, 0] }}
                              transition={{ duration: 0.3 }}
                            >
                              <action.icon className="h-5 w-5 text-white" />
                            </motion.div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white flex-1">
                              {action.name}
                            </span>
                          </div>
                        </InteractiveCard>
                      </motion.div>
                    ))}
                  </div>

                  {/* Database Configuration Form */}
                  {activeView === 'database' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Table Settings
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Table Name
                          </label>
                          <input
                            type="text"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="Main Table"
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                          />
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Enter the exact table name from your Airtable base
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </GlassCard>
              </motion.div>

              {/* Main Content Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-3"
              >
                {activeView === 'chat' ? (
                  <div style={{ height: '600px', maxHeight: '600px' }}>
                    <MainChatComponent />
                  </div>
                ) : (
                  <GlassCard hover={false} className="p-6">
                    <AirtableViewer baseId={baseId} tableName={tableName} />
                  </GlassCard>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
