'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Shield,
  Upload,
  BarChart3,
  Users,
  AlertTriangle,
  Mail
} from 'lucide-react'
import ProtectedRoute from '@/components/protected-route'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/lib/auth-context'
import MainChatComponent from '@/components/main-chat-component'

const quickActions = [
  { name: 'Upload Network Logs', icon: Upload, href: '/dashboard/upload', color: 'blue' },
  { name: 'Analytics Dashboard', icon: BarChart3, href: '/dashboard/analytics', color: 'green' },
  { name: 'View Results', icon: Shield, href: '/dashboard/results', color: 'purple' },
  { name: 'Manage Employees', icon: Users, href: '/dashboard/employees', color: 'indigo' },
  { name: 'Alert System', icon: Mail, href: '/dashboard/alerts', color: 'yellow' },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Simple Header */}
        <header className="glass border-b backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  InsightNet Dashboard
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 dark:text-gray-300">
                  Welcome, {user?.displayName || user?.email || 'User'}
                </span>
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 bg-gradient-to-r from-slate-700/10 to-slate-600/10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back! 👋
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Send your queries to our Smart Processor for instant analysis and insights.
                  </p>
                </div>
              </div>
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
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={action.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push(action.href)}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                          <action.icon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {action.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Main Chat Component */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-3"
                style={{ height: '600px', maxHeight: '600px' }}
              >
                <MainChatComponent />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
