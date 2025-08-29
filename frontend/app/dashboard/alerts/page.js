'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Send, 
  Settings, 
  AlertTriangle, 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Plus,
  Bell,
  Search
} from 'lucide-react'

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState('compose')
  const [emailTemplate, setEmailTemplate] = useState({
    subject: 'Security Alert: Suspicious Network Activity Detected',
    content: `Dear {employeeName},

Our security monitoring system has detected suspicious network activity associated with your account on {date} at {time}.

Details:
- Behavior Classification: {behaviorType}
- Confidence Score: {confidenceScore}%
- Risk Level: {riskLevel}

Please review your recent network activity and ensure your account security. If you believe this is a false positive, please contact the IT security team immediately.

Best regards,
IT Security Team`
  })
  const [thresholds, setThresholds] = useState({
    highRisk: 85,
    mediumRisk: 60,
    autoSend: true,
    cooldownPeriod: 24
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock alert history data
  const alertHistory = [
    {
      id: 1,
      employee: 'John Doe',
      email: 'john.doe@company.com',
      behaviorType: 'Data Exfiltration',
      confidenceScore: 92,
      status: 'sent',
      timestamp: '2024-01-15 14:30:00',
      riskLevel: 'high'
    },
    {
      id: 2,
      employee: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      behaviorType: 'Unauthorized Access',
      confidenceScore: 78,
      status: 'pending',
      timestamp: '2024-01-15 13:45:00',
      riskLevel: 'medium'
    },
    {
      id: 3,
      employee: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      behaviorType: 'Suspicious Browsing',
      confidenceScore: 65,
      status: 'draft',
      timestamp: '2024-01-15 12:20:00',
      riskLevel: 'medium'
    }
  ]

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const handleSendAlert = (alertId) => {
    // Logic to send alert would go here
    console.log('Sending alert:', alertId)
  }

  const handleDeleteAlert = (alertId) => {
    // Logic to delete alert would go here
    console.log('Deleting alert:', alertId)
  }

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'draft': return <Edit3 className="h-4 w-4 text-gray-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredAlerts = alertHistory.filter(alert => {
    const matchesSearch = alert.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.behaviorType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Email Alert System
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Manage security alerts and email notifications for suspicious network behavior
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-1 rounded-xl">
            {[
              { id: 'compose', label: 'Compose Alert', icon: Mail },
              { id: 'templates', label: 'Templates', icon: Edit3 },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'history', label: 'Alert History', icon: Clock }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'compose' && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Compose Security Alert
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recipient Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Select Recipients
                  </label>
                  <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Affected Employees</span>
                    </div>
                    <div className="space-y-2">
                      {['John Doe', 'Sarah Wilson', 'Mike Johnson'].map((name) => (
                        <label key={name} className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">{name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Alert Details */}
                  <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Alert Details</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Behavior Type
                        </label>
                        <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-sm">
                          <option>Data Exfiltration</option>
                          <option>Unauthorized Access</option>
                          <option>Suspicious Browsing</option>
                          <option>Policy Violation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Risk Level
                        </label>
                        <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-sm">
                          <option>High</option>
                          <option>Medium</option>
                          <option>Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Confidence Score
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          defaultValue="85"
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Preview */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Preview
                  </label>
                  <div className="bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-600 px-4 py-3 border-b border-slate-200 dark:border-slate-500">
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-600 dark:text-slate-400">Subject:</span>
                          <span className="text-slate-900 dark:text-white">{emailTemplate.subject}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-600 dark:text-slate-400">To:</span>
                          <span className="text-slate-900 dark:text-white">Selected employees</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                        {emailTemplate.content}
                      </div>
                    </div>
                  </div>

                  {/* Send Button */}
                  <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    Send Alert Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Email Templates
                </h2>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Template
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Subject Template
                  </label>
                  <input 
                    type="text"
                    value={emailTemplate.subject}
                    onChange={(e) => setEmailTemplate({...emailTemplate, subject: e.target.value})}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Content Template
                  </label>
                  <textarea 
                    value={emailTemplate.content}
                    onChange={(e) => setEmailTemplate({...emailTemplate, content: e.target.value})}
                    rows={12}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Available Variables:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <span>• {'{employeeName}'}</span>
                    <span>• {'{date}'}</span>
                    <span>• {'{time}'}</span>
                    <span>• {'{behaviorType}'}</span>
                    <span>• {'{confidenceScore}'}</span>
                    <span>• {'{riskLevel}'}</span>
                  </div>
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Save Template
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Alert Settings
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Threshold Configuration */}
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Risk Thresholds</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        High Risk Threshold (%)
                      </label>
                      <input 
                        type="range"
                        min="70"
                        max="100"
                        value={thresholds.highRisk}
                        onChange={(e) => setThresholds({...thresholds, highRisk: e.target.value})}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>70%</span>
                        <span className="font-medium text-red-600 dark:text-red-400">{thresholds.highRisk}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Medium Risk Threshold (%)
                      </label>
                      <input 
                        type="range"
                        min="40"
                        max="80"
                        value={thresholds.mediumRisk}
                        onChange={(e) => setThresholds({...thresholds, mediumRisk: e.target.value})}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>40%</span>
                        <span className="font-medium text-yellow-600 dark:text-yellow-400">{thresholds.mediumRisk}%</span>
                        <span>80%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Automation Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-800 dark:text-slate-200">Automation</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={thresholds.autoSend}
                        onChange={(e) => setThresholds({...thresholds, autoSend: e.target.checked})}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Auto-send alerts for high-risk detections
                      </span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Cooldown Period (hours)
                      </label>
                      <input 
                        type="number"
                        min="1"
                        max="168"
                        value={thresholds.cooldownPeriod}
                        onChange={(e) => setThresholds({...thresholds, cooldownPeriod: e.target.value})}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Minimum time between alerts for the same employee
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-600">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Alert History
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="sent">Sent</option>
                    <option value="pending">Pending</option>
                    <option value="draft">Draft</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-600">
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Employee</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Behavior</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Risk</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Score</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlerts.map((alert) => (
                      <tr key={alert.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{alert.employee}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{alert.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{alert.behaviorType}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskBadgeColor(alert.riskLevel)}`}>
                            {alert.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{alert.confidenceScore}%</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(alert.status)}
                            <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{alert.status}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400">{alert.timestamp}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {alert.status === 'draft' && (
                              <button 
                                onClick={() => handleSendAlert(alert.id)}
                                className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                title="Send Alert"
                              >
                                <Send className="h-4 w-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteAlert(alert.id)}
                              className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete Alert"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
