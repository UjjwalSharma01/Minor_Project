'use client'

import { motion } from 'framer-motion'
import { InteractiveCard, PremiumCard, GradientBorder } from './premium-interactions'
import { TrendingUp, Zap, Shield, Users } from 'lucide-react'

// Card with shimmer effect on hover
export const ShimmerCard = ({ children, className = '', onClick }) => {
  return (
    <div className={`relative overflow-hidden group ${className}`} onClick={onClick}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

// Stats card with premium styling
export const StatsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  color = 'teal',
  withTilt = false 
}) => {
  const colorClasses = {
    teal: 'from-teal-600 to-cyan-600',
    amber: 'from-amber-600 to-orange-600',
    slate: 'from-slate-600 to-slate-700',
    emerald: 'from-emerald-600 to-teal-600',
  }

  return (
    <PremiumCard withTilt={withTilt} className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </h3>
            {trend && (
              <span className={`text-sm font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <motion.div
              className={`h-1.5 rounded-full bg-gradient-to-r ${colorClasses[color]}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.abs(trend) * 10, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
    </PremiumCard>
  )
}

// Feature card with icon
export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  withGradientBorder = false,
  onClick 
}) => {
  const CardWrapper = withGradientBorder ? 
    ({ children }) => <GradientBorder><div className="p-6">{children}</div></GradientBorder> :
    ({ children }) => <InteractiveCard withTilt={true} onClick={onClick}>{children}</InteractiveCard>

  return (
    <CardWrapper>
      <div className={withGradientBorder ? '' : 'p-6'}>
        <motion.div 
          className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/30"
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </CardWrapper>
  )
}

// Notification card with subtle animation
export const NotificationCard = ({ 
  title, 
  message, 
  time, 
  type = 'info',
  unread = false 
}) => {
  const typeColors = {
    info: 'from-cyan-600 to-blue-600',
    success: 'from-teal-600 to-emerald-600',
    warning: 'from-amber-600 to-orange-600',
    error: 'from-red-600 to-rose-600',
  }

  return (
    <InteractiveCard withTilt={false} withGlow={false}>
      <div className="p-4 flex gap-4">
        <div className={`flex-shrink-0 w-2 rounded-full bg-gradient-to-b ${typeColors[type]} ${unread ? 'opacity-100' : 'opacity-30'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {time}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {message}
          </p>
        </div>
      </div>
    </InteractiveCard>
  )
}

// Metric card with animated number
export const MetricCard = ({ 
  label, 
  value, 
  suffix = '', 
  icon: Icon,
  gradient = 'from-teal-600 to-cyan-600' 
}) => {
  return (
    <ShimmerCard className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <motion.h3 
          className="text-3xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {value}
        </motion.h3>
        {suffix && (
          <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </ShimmerCard>
  )
}

// Example showcase of all card types
export const CardShowcase = () => {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Premium Cards Showcase
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          icon={TrendingUp}
          label="Total Revenue"
          value="$45.2K"
          trend={12.5}
          color="teal"
          withTilt={true}
        />
        <StatsCard 
          icon={Users}
          label="Active Users"
          value="2,845"
          trend={8.2}
          color="amber"
          withTilt={true}
        />
        <StatsCard 
          icon={Shield}
          label="Security Score"
          value="98%"
          trend={-2.1}
          color="emerald"
          withTilt={true}
        />
        <StatsCard 
          icon={Zap}
          label="Performance"
          value="Fast"
          color="slate"
          withTilt={true}
        />
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={Shield}
          title="Secure by Default"
          description="Enterprise-grade security with end-to-end encryption and advanced threat protection."
          withGradientBorder={false}
        />
        <FeatureCard
          icon={TrendingUp}
          title="Real-time Analytics"
          description="Get instant insights with our powerful analytics engine and visualization tools."
          withGradientBorder={true}
        />
        <FeatureCard
          icon={Zap}
          title="Lightning Fast"
          description="Optimized for performance with blazing fast load times and smooth interactions."
          withGradientBorder={false}
        />
      </div>

      {/* Notification Cards */}
      <div className="space-y-3 max-w-md">
        <NotificationCard
          title="New alert received"
          message="Suspicious activity detected on employee ID 1234. Please review immediately."
          time="2m ago"
          type="warning"
          unread={true}
        />
        <NotificationCard
          title="Analysis complete"
          message="Your network log analysis has finished processing. View results now."
          time="1h ago"
          type="success"
          unread={false}
        />
      </div>
    </div>
  )
}
