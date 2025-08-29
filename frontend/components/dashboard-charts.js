'use client'

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'

// Mock data for dashboard charts
const weeklyData = [
  { name: 'Mon', threats: 12, employees: 8, alerts: 15 },
  { name: 'Tue', threats: 19, employees: 12, alerts: 22 },
  { name: 'Wed', threats: 15, employees: 9, alerts: 18 },
  { name: 'Thu', threats: 25, employees: 15, alerts: 28 },
  { name: 'Fri', threats: 32, employees: 18, alerts: 35 },
  { name: 'Sat', threats: 8, employees: 5, alerts: 10 },
  { name: 'Sun', threats: 6, employees: 3, alerts: 8 }
]

const threatCategories = [
  { name: 'Data Exfiltration', value: 45, color: '#ef4444' },
  { name: 'Unauthorized Access', value: 38, color: '#f97316' },
  { name: 'Suspicious Browsing', value: 32, color: '#eab308' },
  { name: 'Policy Violation', value: 26, color: '#3b82f6' },
  { name: 'Malware Activity', value: 15, color: '#8b5cf6' }
]

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  threats: Math.floor(Math.random() * 20) + 1
}))

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="text-slate-900 dark:text-white font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Weekly Activity Chart Component
export const WeeklyActivityChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={weeklyData}>
      <defs>
        <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
      <XAxis 
        dataKey="name" 
        className="text-slate-600 dark:text-slate-400"
        fontSize={12}
      />
      <YAxis 
        className="text-slate-600 dark:text-slate-400"
        fontSize={12}
      />
      <Tooltip content={<CustomTooltip />} />
      <Area
        type="monotone"
        dataKey="threats"
        stroke="#3b82f6"
        strokeWidth={2}
        fillOpacity={1}
        fill="url(#colorThreats)"
        name="Threats Detected"
      />
    </AreaChart>
  </ResponsiveContainer>
)

// Threat Categories Pie Chart
export const ThreatCategoriesChart = () => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={threatCategories}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        dataKey="value"
        nameKey="name"
      >
        {threatCategories.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  </ResponsiveContainer>
)

// Hourly Activity Chart
export const HourlyActivityChart = () => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart data={hourlyData}>
      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
      <XAxis 
        dataKey="hour" 
        className="text-slate-600 dark:text-slate-400"
        fontSize={10}
        interval={2}
      />
      <YAxis 
        className="text-slate-600 dark:text-slate-400"
        fontSize={12}
      />
      <Tooltip content={<CustomTooltip />} />
      <Bar
        dataKey="threats"
        fill="#64748b"
        radius={[2, 2, 0, 0]}
        name="Threats"
      />
    </BarChart>
  </ResponsiveContainer>
)

// Mini chart for dashboard cards
export const MiniTrendChart = ({ data, color = "#3b82f6" }) => (
  <ResponsiveContainer width="100%" height={60}>
    <AreaChart data={data}>
      <Area
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={2}
        fill={color}
        fillOpacity={0.1}
      />
    </AreaChart>
  </ResponsiveContainer>
)
