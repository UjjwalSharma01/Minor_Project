'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Shield, 
  AlertTriangle,
  Download,
  RefreshCw,
  PieChart,
  Clock
} from 'lucide-react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('threats')

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalThreats: 156,
      threatsTrend: +12.5,
      employeesAffected: 23,
      employeesTrend: -8.3,
      averageScore: 67.8,
      scoreTrend: +5.2,
      alertsSent: 89,
      alertsTrend: +15.7
    },
    behaviorTypes: [
      { name: 'Data Exfiltration', count: 45, percentage: 28.8, color: 'bg-red-500' },
      { name: 'Unauthorized Access', count: 38, percentage: 24.4, color: 'bg-orange-500' },
      { name: 'Suspicious Browsing', count: 32, percentage: 20.5, color: 'bg-yellow-500' },
      { name: 'Policy Violation', count: 26, percentage: 16.7, color: 'bg-blue-500' },
      { name: 'Malware Activity', count: 15, percentage: 9.6, color: 'bg-purple-500' }
    ],
    weeklyTrends: [
      { date: 'Mon', threats: 12, employees: 8, alerts: 15 },
      { date: 'Tue', threats: 19, employees: 12, alerts: 22 },
      { date: 'Wed', threats: 15, employees: 9, alerts: 18 },
      { date: 'Thu', threats: 25, employees: 15, alerts: 28 },
      { date: 'Fri', threats: 32, employees: 18, alerts: 35 },
      { date: 'Sat', threats: 8, employees: 5, alerts: 10 },
      { date: 'Sun', threats: 6, employees: 3, alerts: 8 }
    ],
    topEmployees: [
      { name: 'John Doe', incidents: 8, riskScore: 85, department: 'Finance' },
      { name: 'Sarah Wilson', incidents: 6, riskScore: 78, department: 'IT' },
      { name: 'Mike Johnson', incidents: 5, riskScore: 72, department: 'HR' },
      { name: 'Emily Davis', incidents: 4, riskScore: 68, department: 'Marketing' },
      { name: 'Robert Brown', incidents: 3, riskScore: 65, department: 'Sales' }
    ],
    hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      threats: Math.floor(Math.random() * 20) + 1
    }))
  }

  const StatCard = ({ title, value, trend, icon: Icon, color }) => (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 dark:border-slate-700/50"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {Math.abs(trend)}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">vs last week</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  const maxWeeklyValue = Math.max(...analyticsData.weeklyTrends.map(d => d[selectedMetric]))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Analytics & Reporting
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Comprehensive insights into network security behavior and trends
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Threats"
            value={analyticsData.overview.totalThreats}
            trend={analyticsData.overview.threatsTrend}
            icon={Shield}
            color="bg-gradient-to-r from-red-500 to-orange-500"
          />
          <StatCard
            title="Employees Affected"
            value={analyticsData.overview.employeesAffected}
            trend={analyticsData.overview.employeesTrend}
            icon={Users}
            color="bg-gradient-to-r from-blue-500 to-purple-500"
          />
          <StatCard
            title="Average Risk Score"
            value={`${analyticsData.overview.averageScore}%`}
            trend={analyticsData.overview.scoreTrend}
            icon={TrendingUp}
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
          />
          <StatCard
            title="Alerts Sent"
            value={analyticsData.overview.alertsSent}
            trend={analyticsData.overview.alertsTrend}
            icon={AlertTriangle}
            color="bg-gradient-to-r from-emerald-500 to-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Trends Chart */}
          <div className="lg:col-span-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Weekly Trends</h3>
              <div className="flex items-center gap-2">
                <select 
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
                >
                  <option value="threats">Threats</option>
                  <option value="employees">Employees</option>
                  <option value="alerts">Alerts</option>
                </select>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2">
              {analyticsData.weeklyTrends.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day[selectedMetric] / maxWeeklyValue) * 200}px` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg mb-2 min-h-[4px]"
                  />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{day.date}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">{day[selectedMetric]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Behavior Types Distribution */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Threat Categories
            </h3>
            
            <div className="space-y-4">
              {analyticsData.behaviorTypes.map((behavior, index) => (
                <motion.div
                  key={behavior.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-3 h-3 rounded-full ${behavior.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{behavior.name}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{behavior.count}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${behavior.percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-2 rounded-full ${behavior.color}`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Risk Employees */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Users className="h-5 w-5" />
              High-Risk Employees
            </h3>
            
            <div className="space-y-4">
              {analyticsData.topEmployees.map((employee, index) => (
                <motion.div
                  key={employee.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{employee.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{employee.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{employee.incidents} incidents</div>
                    <div className={`text-sm font-medium ${
                      employee.riskScore >= 80 ? 'text-red-600 dark:text-red-400' :
                      employee.riskScore >= 65 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {employee.riskScore}% risk
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hourly Activity Heatmap */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activity Heatmap (24h)
            </h3>
            
            <div className="grid grid-cols-12 gap-1">
              {analyticsData.hourlyActivity.map((hour) => {
                const intensity = hour.threats / 20 // Normalize to 0-1
                const opacity = Math.max(0.1, intensity)
                return (
                  <motion.div
                    key={hour.hour}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: hour.hour * 0.02 }}
                    className="aspect-square rounded-sm flex items-center justify-center text-xs font-medium relative group cursor-pointer"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${opacity})`,
                      color: intensity > 0.5 ? 'white' : '#1f2937'
                    }}
                    title={`${hour.hour}:00 - ${hour.threats} threats`}
                  >
                    {hour.hour < 10 ? `0${hour.hour}` : hour.hour}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {hour.threats} threats
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-slate-500 dark:text-slate-400">
              <span>00:00</span>
              <span>Activity Level</span>
              <span>23:00</span>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-100">PDF Report</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
              <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-900 dark:text-green-100">CSV Data</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
              <Download className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-purple-900 dark:text-purple-100">JSON Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
