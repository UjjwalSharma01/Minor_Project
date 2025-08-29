'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  BarChart3, 
  Upload, 
  Users, 
  Mail, 
  Menu, 
  X,
  LogOut,
  User
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'
import { useAuth } from '@/lib/auth-context'
import ProtectedRoute from './protected-route'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Upload Logs', href: '/dashboard/upload', icon: Upload },
    { name: 'View Results', href: '/dashboard/results', icon: Shield },
    { name: 'Employees', href: '/dashboard/employees', icon: Users },
    { name: 'Email Alerts', href: '/dashboard/alerts', icon: Mail },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ]

  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ 
            x: sidebarOpen ? 0 : '-100%',
            transition: { type: 'spring', damping: 30, stiffness: 300 }
          }}
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl lg:static lg:translate-x-0 lg:shadow-none"
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  FocusGuard ML
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* User Info */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.displayName || user?.email || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    HR Administrator
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 py-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </motion.div>
                  </Link>
                )
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
                <ThemeToggle />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 dark:text-gray-300">
                  Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
                </span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
