'use client'

import { motion } from 'framer-motion'
import { Shield, BarChart3, Users, AlertTriangle, Upload, Mail, Sparkles, TrendingUp, Lock } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { SimpleParticles, GlassCard, ScrollReveal } from '@/components/animated-particles'
import { PremiumButton, InteractiveCard, AnimatedIcon, FloatingElement } from '@/components/premium-interactions'

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze network logs to detect employee behavior patterns and convert them into actionable insights.'
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
      description: 'Simple drag-and-drop interface for network log uploads with support for multiple file formats and batch processing.'
    },
    {
      icon: Mail,
      title: 'Smart Notifications',
      description: 'Customizable email templates and escalation workflows for HR departments and management teams.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="glass border-b backdrop-blur-lg sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatedIcon icon={Shield} size={32} withBounce color="#475569" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                InsightNet
              </span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ThemeToggle />
              <PremiumButton 
                size="sm"
                onClick={() => window.location.href = '/dashboard'}
              >
                Get Started
              </PremiumButton>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Particles */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Animated particles background */}
        <SimpleParticles count={40} />
        
        {/* Gradient orb backgrounds */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 backdrop-blur-sm border border-teal-500/20 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-medium text-teal-900 dark:text-teal-300">
                AI-Powered Intelligence Platform
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              AI-Powered{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-500 animate-gradient">
                  Network Insights
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 via-cyan-600 to-amber-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Monitor employee behavior, detect anomalies, and ensure productivity with our premium AI platform. 
              Get instant insights from network logs with automated alerts and comprehensive reporting.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <PremiumButton 
                size="lg"
                variant="primary"
                onClick={() => window.location.href = '/dashboard'}
                className="shadow-2xl shadow-slate-500/50"
              >
                <span className="flex items-center gap-2">
                  Start Analyzing Now
                  <TrendingUp className="w-5 h-5" />
                </span>
              </PremiumButton>
              <PremiumButton 
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '/dashboard/upload'}
              >
                <span className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Network Logs
                </span>
              </PremiumButton>
            </motion.div>

            {/* Stats badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap justify-center gap-6 mt-12"
            >
              {[
                { label: '99.9%', sublabel: 'Accuracy' },
                { label: '24/7', sublabel: 'Monitoring' },
                { label: '<1s', sublabel: 'Response Time' }
              ].map((stat, i) => (
                <FloatingElement key={i} delay={i * 0.2}>
                  <div className="glass px-6 py-3 rounded-xl">
                    <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                      {stat.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.sublabel}
                    </div>
                  </div>
                </FloatingElement>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 backdrop-blur-sm border border-teal-500/20 rounded-full mb-4"
            >
              <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-medium text-teal-900 dark:text-teal-300">
                Enterprise-Grade Security
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Modern HR Teams
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to monitor, analyze, and respond to employee behavior patterns in real-time.
            </p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 0.1} direction="up">
                <InteractiveCard className="h-full">
                  <div className="p-6 md:p-8">
                    <FloatingElement delay={index * 0.3} className="mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 dark:from-teal-500 dark:to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>
                    </FloatingElement>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </InteractiveCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <SimpleParticles count={20} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <GlassCard className="p-8 md:p-12">
              <FloatingElement>
                <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/30">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </FloatingElement>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Transform Your HR Analytics?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Join leading companies using AI-powered network analysis for employee monitoring and actionable insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PremiumButton 
                  size="lg"
                  variant="primary"
                  onClick={() => window.location.href = '/dashboard'}
                  className="shadow-2xl shadow-slate-500/50"
                >
                  Get Started Today
                </PremiumButton>
                <PremiumButton 
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard/analytics'}
                >
                  View Demo
                </PremiumButton>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-slate-400" />
            <span className="text-lg font-semibold">InsightNet</span>
          </div>
          <p className="text-gray-400 mb-4">
            Premium AI-powered network log analysis for modern enterprises
          </p>
          <p className="text-sm text-gray-500">
            © 2025 InsightNet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
