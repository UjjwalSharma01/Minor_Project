'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  User,
  Calendar,
  Percent,
  BarChart3,
  Filter,
  Download,
  RefreshCw,
  Search,
  X
} from 'lucide-react'
import ProtectedRoute from '@/components/protected-route'

export default function ResultsPage() {
  const [selectedResult, setSelectedResult] = useState(null)
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock results data - this would come from your ML model
  const results = [
    {
      id: 1,
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      timestamp: '2024-01-15T14:30:00Z',
      behavior: 'job_hunting',
      confidence: 0.89,
      severity: 'high',
      riskScore: 85,
      details: {
        domainsVisited: ['linkedin.com', 'indeed.com', 'glassdoor.com'],
        suspiciousPatterns: 3,
        totalQueries: 156,
        timeSpent: '2h 34m'
      },
      recommendations: [
        'Schedule a one-on-one meeting to discuss career growth',
        'Review current role satisfaction and development opportunities',
        'Monitor future DNS activity for similar patterns'
      ]
    },
    {
      id: 2,
      employeeName: 'Sarah Wilson',
      employeeId: 'EMP002',
      timestamp: '2024-01-15T11:15:00Z',
      behavior: 'entertainment',
      confidence: 0.76,
      severity: 'medium',
      riskScore: 45,
      details: {
        domainsVisited: ['youtube.com', 'netflix.com', 'spotify.com'],
        suspiciousPatterns: 1,
        totalQueries: 89,
        timeSpent: '1h 12m'
      },
      recommendations: [
        'Provide gentle reminder about appropriate internet usage',
        'Consider implementing content filtering policies',
        'Monitor if this becomes a recurring pattern'
      ]
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      timestamp: '2024-01-15T09:45:00Z',
      behavior: 'normal',
      confidence: 0.95,
      severity: 'low',
      riskScore: 15,
      details: {
        domainsVisited: ['stackoverflow.com', 'github.com', 'docs.microsoft.com'],
        suspiciousPatterns: 0,
        totalQueries: 234,
        timeSpent: '3h 45m'
      },
      recommendations: [
        'No action required - normal work-related activity',
        'Employee showing good productivity patterns'
      ]
    },
    {
      id: 4,
      employeeName: 'Emily Davis',
      employeeId: 'EMP004',
      timestamp: '2024-01-15T16:20:00Z',
      behavior: 'productivity_loss',
      confidence: 0.82,
      severity: 'medium',
      riskScore: 62,
      details: {
        domainsVisited: ['facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com'],
        suspiciousPatterns: 2,
        totalQueries: 298,
        timeSpent: '2h 58m'
      },
      recommendations: [
        'Discuss time management and focus strategies',
        'Consider productivity tools and techniques',
        'Set clear expectations for social media usage during work hours'
      ]
    }
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'low':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return AlertTriangle
      case 'medium':
        return Target
      case 'low':
        return CheckCircle
      default:
        return Target
    }
  }

  const getBehaviorColor = (behavior) => {
    switch (behavior) {
      case 'job_hunting':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'entertainment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'productivity_loss':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'normal':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const filteredResults = results.filter(result => {
    const matchesFilter = filterSeverity === 'all' || result.severity === filterSeverity
    const matchesSearch = result.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.behavior.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Analysis Results
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Review behavior classifications and confidence scores from network log analysis
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                <button className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors duration-200">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
                <button className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
                  </div>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="all">All Severities</option>
                    <option value="high">High Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="low">Low Risk</option>
                  </select>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search employees or behaviors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent min-w-80"
                  />
                </div>
              </div>
            </motion.div>

            {/* Results Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Results</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {filteredResults.length}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
              
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Risk</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                      {filteredResults.filter(r => r.severity === 'high').length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </div>
              
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Confidence</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {Math.round(filteredResults.reduce((sum, r) => sum + r.confidence, 0) / filteredResults.length * 100)}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
              
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Normal Behavior</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                      {filteredResults.filter(r => r.behavior === 'normal').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </motion.div>

            {/* Results List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Classification Results
              </h2>
              
              <div className="space-y-4">
                {filteredResults.map((result, index) => {
                  const SeverityIcon = getSeverityIcon(result.severity)
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedResult(result)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {result.employeeName}
                              </h3>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {result.employeeId}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBehaviorColor(result.behavior)}`}>
                                {result.behavior.replace('_', ' ')}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(result.timestamp)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Percent className="h-4 w-4" />
                                <span>{Math.round(result.confidence * 100)}% confidence</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>Risk: {result.riskScore}/100</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(result.severity)}`}>
                            <SeverityIcon className="h-4 w-4 mr-1" />
                            {result.severity.toUpperCase()}
                          </div>
                          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200">
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Detailed Result Modal */}
      <AnimatePresence>
        {selectedResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedResult(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detailed Analysis: {selectedResult.employeeName}
                </h2>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Summary */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Behavior</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedResult.behavior.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {Math.round(selectedResult.confidence * 100)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Risk Score</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedResult.riskScore}/100
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Severity</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedResult.severity.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Activity Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Domains Visited</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedResult.details.domainsVisited.map((domain, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-sm rounded">
                            {domain}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Suspicious Patterns</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedResult.details.suspiciousPatterns}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Total Queries</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedResult.details.totalQueries}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Time Spent</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedResult.details.timeSpent}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {selectedResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  )
}
