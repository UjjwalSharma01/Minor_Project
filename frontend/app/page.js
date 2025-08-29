'use client'

import { motion } from 'framer-motion'
import { Shield, BarChart3, Users, AlertTriangle, Upload, Mail } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze DNS logs to detect employee behavior patterns and potential security risks.'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Get instant insights with confidence scores, anomaly detection, and comprehensive behavior classification.'
    },
    {
      icon: Users,
      title: 'Employee Monitoring',
      description: 'Track and monitor employee activities across different categories: work, entertainment, unethical, and neutral behavior.'
    },
    {
      icon: AlertTriangle,
      title: 'Automated Alerts',
      description: 'Intelligent threshold-based email warnings with n8n automation integration for immediate response to policy violations.'
    },
    {
      icon: Upload,
      title: 'Easy Upload',
      description: 'Simple drag-and-drop interface for DNS log uploads with support for multiple file formats and batch processing.'
    },
    {
      icon: Mail,
      title: 'Smart Notifications',
      description: 'Customizable email templates and escalation workflows for HR departments and management teams.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Navigation */}
      <nav className="glass border-b backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                DNS Analytics Pro
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link 
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">DNS Analytics</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Monitor employee behavior, detect anomalies, and ensure productivity with our premium AI platform. 
              Get instant insights from DNS logs with automated alerts and comprehensive reporting.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Start Analyzing Now
              </Link>
              <Link 
                href="/upload"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Upload DNS Logs
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-500/10 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern HR Teams
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to monitor, analyze, and respond to employee behavior patterns in real-time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Transform Your HR Analytics?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join leading companies using AI-powered DNS analysis for employee monitoring and security.
            </p>
            <Link 
              href="/dashboard"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">DNS Analytics Pro</span>
          </div>
          <p className="text-gray-400 mb-4">
            Premium AI-powered DNS log analysis for modern enterprises
          </p>
          <p className="text-sm text-gray-500">
            © 2025 DNS Analytics Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
