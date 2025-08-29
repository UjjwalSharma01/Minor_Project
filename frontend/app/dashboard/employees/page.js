'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users,
  Search,
  Eye,
  Mail,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  MoreVertical,
  UserPlus,
  Download,
  Shield,
  Activity
} from 'lucide-react'
import ProtectedRoute from '@/components/protected-route'

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterRisk, setFilterRisk] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  // Mock employee data
  const [employees] = useState([
    {
      id: 1,
      name: 'John Doe',
      employeeId: 'EMP001',
      email: 'john.doe@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      riskScore: 85,
      riskTrend: 'up',
      lastActivity: '2024-01-15T14:30:00Z',
      status: 'active',
      behaviorHistory: [
        { date: '2024-01-15', behavior: 'job_hunting', confidence: 0.89, riskScore: 85 },
        { date: '2024-01-14', behavior: 'normal', confidence: 0.92, riskScore: 20 },
        { date: '2024-01-13', behavior: 'entertainment', confidence: 0.76, riskScore: 45 },
        { date: '2024-01-12', behavior: 'normal', confidence: 0.94, riskScore: 15 },
        { date: '2024-01-11', behavior: 'productivity_loss', confidence: 0.81, riskScore: 60 }
      ],
      alerts: 3,
      warningsSent: 1
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      employeeId: 'EMP002',
      email: 'sarah.wilson@company.com',
      department: 'Marketing',
      position: 'Marketing Manager',
      riskScore: 45,
      riskTrend: 'stable',
      lastActivity: '2024-01-15T11:15:00Z',
      status: 'active',
      behaviorHistory: [
        { date: '2024-01-15', behavior: 'entertainment', confidence: 0.76, riskScore: 45 },
        { date: '2024-01-14', behavior: 'normal', confidence: 0.88, riskScore: 25 },
        { date: '2024-01-13', behavior: 'normal', confidence: 0.91, riskScore: 18 },
        { date: '2024-01-12', behavior: 'entertainment', confidence: 0.73, riskScore: 42 },
        { date: '2024-01-11', behavior: 'normal', confidence: 0.89, riskScore: 22 }
      ],
      alerts: 1,
      warningsSent: 0
    },
    {
      id: 3,
      name: 'Mike Johnson',
      employeeId: 'EMP003',
      email: 'mike.johnson@company.com',
      department: 'Engineering',
      position: 'DevOps Engineer',
      riskScore: 15,
      riskTrend: 'down',
      lastActivity: '2024-01-15T09:45:00Z',
      status: 'active',
      behaviorHistory: [
        { date: '2024-01-15', behavior: 'normal', confidence: 0.95, riskScore: 15 },
        { date: '2024-01-14', behavior: 'normal', confidence: 0.93, riskScore: 18 },
        { date: '2024-01-13', behavior: 'normal', confidence: 0.96, riskScore: 12 },
        { date: '2024-01-12', behavior: 'normal', confidence: 0.94, riskScore: 16 },
        { date: '2024-01-11', behavior: 'entertainment', confidence: 0.71, riskScore: 38 }
      ],
      alerts: 0,
      warningsSent: 0
    },
    {
      id: 4,
      name: 'Emily Davis',
      employeeId: 'EMP004',
      email: 'emily.davis@company.com',
      department: 'HR',
      position: 'HR Specialist',
      riskScore: 62,
      riskTrend: 'up',
      lastActivity: '2024-01-15T16:20:00Z',
      status: 'active',
      behaviorHistory: [
        { date: '2024-01-15', behavior: 'productivity_loss', confidence: 0.82, riskScore: 62 },
        { date: '2024-01-14', behavior: 'entertainment', confidence: 0.78, riskScore: 48 },
        { date: '2024-01-13', behavior: 'normal', confidence: 0.87, riskScore: 28 },
        { date: '2024-01-12', behavior: 'productivity_loss', confidence: 0.85, riskScore: 58 },
        { date: '2024-01-11', behavior: 'normal', confidence: 0.90, riskScore: 24 }
      ],
      alerts: 2,
      warningsSent: 1
    },
    {
      id: 5,
      name: 'Alex Chen',
      employeeId: 'EMP005',
      email: 'alex.chen@company.com',
      department: 'Sales',
      position: 'Sales Representative',
      riskScore: 32,
      riskTrend: 'stable',
      lastActivity: '2024-01-15T13:10:00Z',
      status: 'active',
      behaviorHistory: [
        { date: '2024-01-15', behavior: 'normal', confidence: 0.89, riskScore: 32 },
        { date: '2024-01-14', behavior: 'normal', confidence: 0.91, riskScore: 28 },
        { date: '2024-01-13', behavior: 'entertainment', confidence: 0.74, riskScore: 41 },
        { date: '2024-01-12', behavior: 'normal', confidence: 0.88, riskScore: 30 },
        { date: '2024-01-11', behavior: 'normal', confidence: 0.92, riskScore: 26 }
      ],
      alerts: 0,
      warningsSent: 0
    }
  ])

  const departments = ['all', 'Engineering', 'Marketing', 'HR', 'Sales', 'Finance']
  const riskLevels = ['all', 'high', 'medium', 'low']

  const getRiskLevel = (score) => {
    if (score >= 70) return 'high'
    if (score >= 40) return 'medium'
    return 'low'
  }

  const getRiskColor = (score) => {
    if (score >= 70) return 'text-red-600 bg-red-50 dark:bg-red-900/20'
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
    return 'text-green-600 bg-green-50 dark:bg-green-900/20'
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return TrendingUp
      case 'down':
        return TrendingDown
      default:
        return Activity
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-red-500'
      case 'down':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const filteredAndSortedEmployees = employees
    .filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment
      const matchesRisk = filterRisk === 'all' || getRiskLevel(emp.riskScore) === filterRisk
      return matchesSearch && matchesDepartment && matchesRisk
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'risk':
          return b.riskScore - a.riskScore
        case 'department':
          return a.department.localeCompare(b.department)
        case 'lastActivity':
          return new Date(b.lastActivity) - new Date(a.lastActivity)
        default:
          return 0
      }
    })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString) => {
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
                  Employee Management
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Monitor employee behavior patterns and manage security risks
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                <button className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </button>
                <button className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors duration-200">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </button>
              </div>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {employees.length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
              
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Risk</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                      {employees.filter(e => getRiskLevel(e.riskScore) === 'high').length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </div>
              
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Alerts</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {employees.reduce((sum, e) => sum + e.alerts, 0)}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
              
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Warnings Sent</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {employees.reduce((sum, e) => sum + e.warningsSent, 0)}
                    </p>
                  </div>
                  <Mail className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
            </motion.div>

            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent min-w-80"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    {riskLevels.map(level => (
                      <option key={level} value={level}>
                        {level === 'all' ? 'All Risk Levels' : `${level.charAt(0).toUpperCase() + level.slice(1)} Risk`}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="risk">Sort by Risk</option>
                    <option value="department">Sort by Department</option>
                    <option value="lastActivity">Sort by Last Activity</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Employee List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Employee List ({filteredAndSortedEmployees.length})
              </h2>
              
              <div className="space-y-4">
                {filteredAndSortedEmployees.map((employee, index) => {
                  const TrendIcon = getTrendIcon(employee.riskTrend)
                  return (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {employee.name}
                              </h3>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {employee.employeeId}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(employee.riskScore)}`}>
                                {getRiskLevel(employee.riskScore).toUpperCase()} RISK
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <span>{employee.email}</span>
                              <span>•</span>
                              <span>{employee.department}</span>
                              <span>•</span>
                              <span>{employee.position}</span>
                            </div>
                            
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>Last activity: {formatDateTime(employee.lastActivity)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {employee.riskScore}
                              </span>
                              <TrendIcon className={`h-5 w-5 ${getTrendColor(employee.riskTrend)}`} />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Risk Score</span>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                              {employee.alerts}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Alerts</span>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                              {employee.warningsSent}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Warnings</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedEmployee(employee)}
                              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
                              title="View Details"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
                              title="Send Warning"
                            >
                              <Mail className="h-5 w-5" />
                            </button>
                            <button
                              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
                              title="More Actions"
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </div>
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

      {/* Employee Detail Modal */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEmployee(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedEmployee.name} - Behavior History
                </h2>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Employee Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Employee Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600 dark:text-gray-400">ID:</span> {selectedEmployee.employeeId}</div>
                      <div><span className="text-gray-600 dark:text-gray-400">Email:</span> {selectedEmployee.email}</div>
                      <div><span className="text-gray-600 dark:text-gray-400">Department:</span> {selectedEmployee.department}</div>
                      <div><span className="text-gray-600 dark:text-gray-400">Position:</span> {selectedEmployee.position}</div>
                    </div>
                  </div>
                  
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Risk Assessment</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600 dark:text-gray-400">Current Score:</span> {selectedEmployee.riskScore}/100</div>
                      <div><span className="text-gray-600 dark:text-gray-400">Risk Level:</span> {getRiskLevel(selectedEmployee.riskScore).toUpperCase()}</div>
                      <div><span className="text-gray-600 dark:text-gray-400">Trend:</span> {selectedEmployee.riskTrend.toUpperCase()}</div>
                      <div><span className="text-gray-600 dark:text-gray-400">Status:</span> {selectedEmployee.status.toUpperCase()}</div>
                    </div>
                  </div>
                  
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Activity Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-600 dark:text-gray-400">Active Alerts:</span> {selectedEmployee.alerts}</div>
                      <div><span className="text-gray-600 dark:text-gray-400">Warnings Sent:</span> {selectedEmployee.warningsSent}</div>
                      <div><span className="text-gray-600 dark:text-gray-400">Last Activity:</span> {formatDateTime(selectedEmployee.lastActivity)}</div>
                    </div>
                  </div>
                </div>

                {/* Behavior History */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Behavior History</h3>
                  <div className="space-y-3">
                    {selectedEmployee.behaviorHistory.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(entry.date)}
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            entry.behavior === 'normal' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                            entry.behavior === 'job_hunting' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            entry.behavior === 'entertainment' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {entry.behavior.replace('_', ' ')}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {Math.round(entry.confidence * 100)}% confidence
                          </span>
                          <span className={`font-medium ${
                            entry.riskScore >= 70 ? 'text-red-600' :
                            entry.riskScore >= 40 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            Risk: {entry.riskScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  )
}
