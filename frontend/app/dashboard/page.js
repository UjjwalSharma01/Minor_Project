'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  AlertTriangle,
  TrendingUp, 
  TrendingDown,
  Shield,
  Clock,
  BarChart3,
  Upload,
  Mail
} from 'lucide-react'
import ProtectedRoute from '@/components/protected-route'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/lib/auth-context'

const stats = [
  { name: 'Total Employees', value: '156', change: '+12%', changeType: 'increase', icon: Users },
  { name: 'Active Alerts', value: '23', change: '+5%', changeType: 'increase', icon: AlertTriangle },
  { name: 'DNS Logs Processed', value: '1.2M', change: '+18%', changeType: 'increase', icon: BarChart3 },
  { name: 'Security Score', value: '87%', change: '+3%', changeType: 'increase', icon: Shield },
]

const recentActivities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'High risk behavior detected',
    time: '2 minutes ago',
    type: 'alert',
    severity: 'high'
  },
  {
    id: 2,
    user: 'Sarah Wilson',
    action: 'Job hunting activity detected',
    time: '15 minutes ago',
    type: 'warning',
    severity: 'medium'
  },
  {
    id: 3,
    user: 'Mike Johnson',
    action: 'Entertainment usage within limits',
    time: '1 hour ago',
    type: 'info',
    severity: 'low'
  },
  {
    id: 4,
    user: 'Emily Davis',
    action: 'Warning email sent',
    time: '2 hours ago',
    type: 'email',
    severity: 'medium'
  },
]

const quickActions = [
  { name: 'Upload DNS Logs', icon: Upload, href: '/dashboard/upload', color: 'blue' },
  { name: 'View Results', icon: BarChart3, href: '/dashboard/results', color: 'green' },
  { name: 'Manage Employees', icon: Users, href: '/dashboard/employees', color: 'purple' },
  { name: 'Send Warning', icon: Mail, href: '/dashboard/email', color: 'yellow' },
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
                  DNS Analytics Dashboard
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
          <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 bg-gradient-to-r from-slate-700/10 to-slate-600/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Here&apos;s what&apos;s happening with your team&apos;s DNS activity today.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Last updated: 2 minutes ago</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-slate-700 dark:bg-slate-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h2>
            <button className="text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
              >
                <div className={`w-2 h-2 rounded-full ${
                  activity.severity === 'high' ? 'bg-red-500' :
                  activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.user}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.action}
                  </p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(action.href)}
                className="w-full flex items-center space-x-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  action.color === 'blue' ? 'bg-slate-100 dark:bg-slate-800' :
                  action.color === 'red' ? 'bg-slate-100 dark:bg-slate-800' :
                  action.color === 'yellow' ? 'bg-slate-100 dark:bg-slate-800' :
                  'bg-slate-100 dark:bg-slate-800'
                }`}>
                  <action.icon className={`h-5 w-5 ${
                    action.color === 'blue' ? 'text-slate-700 dark:text-slate-300' :
                    action.color === 'red' ? 'text-slate-700 dark:text-slate-300' :
                    action.color === 'yellow' ? 'text-slate-700 dark:text-slate-300' :
                    'text-slate-700 dark:text-slate-300'
                  }`} />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-200">
                  {action.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Weekly DNS Activity
          </h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
              7 days
            </button>
            <button className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
              30 days
            </button>
          </div>
        </div>
        <div className="h-64 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500 dark:text-slate-400">
              Chart component will be implemented in Phase 4
            </p>
          </div>
        </div>
      </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
