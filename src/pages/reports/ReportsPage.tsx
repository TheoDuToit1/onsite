import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Briefcase, 
  Users, 
  Calendar,
  FileText,
  Clock,
  Target,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PageHeader from '@/components/PageHeader'

// Sample data for charts
const monthlyRevenue = [
  { month: 'Jan', revenue: 45000, jobs: 12, quotes: 18 },
  { month: 'Feb', revenue: 52000, jobs: 15, quotes: 22 },
  { month: 'Mar', revenue: 48000, jobs: 13, quotes: 20 },
  { month: 'Apr', revenue: 61000, jobs: 18, quotes: 25 },
  { month: 'May', revenue: 55000, jobs: 16, quotes: 23 },
  { month: 'Jun', revenue: 67000, jobs: 20, quotes: 28 }
]

const jobTypes = [
  { name: 'Kitchen Renovations', value: 35, color: '#F97316' },
  { name: 'Bathroom Renovations', value: 25, color: '#3B82F6' },
  { name: 'Office Fit-outs', value: 20, color: '#10B981' },
  { name: 'Home Extensions', value: 15, color: '#8B5CF6' },
  { name: 'Other', value: 5, color: '#6B7280' }
]

const weeklyPerformance = [
  { week: 'Week 1', completed: 8, pending: 3, revenue: 15000 },
  { week: 'Week 2', completed: 12, pending: 2, revenue: 22000 },
  { week: 'Week 3', completed: 10, pending: 4, revenue: 18000 },
  { week: 'Week 4', completed: 15, pending: 1, revenue: 28000 }
]

const clientSatisfaction = [
  { month: 'Jan', satisfaction: 4.2 },
  { month: 'Feb', satisfaction: 4.5 },
  { month: 'Mar', satisfaction: 4.3 },
  { month: 'Apr', satisfaction: 4.7 },
  { month: 'May', satisfaction: 4.6 },
  { month: 'Jun', satisfaction: 4.8 }
]

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('6months')

  const StatCard = ({ title, value, change, icon: Icon, trend }: {
    title: string
    value: string
    change: string
    icon: any
    trend: 'up' | 'down'
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border shadow-sm p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
          <div className={`flex items-center gap-1 mt-2 text-sm ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {change}
          </div>
        </div>
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <Icon className="h-6 w-6 text-orange-600" />
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        actions={(
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export PDF</Button>
          </div>
        )}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="R 328,000"
          change="+12.5% from last period"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Jobs Completed"
          value="94"
          change="+8.2% from last period"
          icon={Briefcase}
          trend="up"
        />
        <StatCard
          title="Active Clients"
          value="67"
          change="+15.3% from last period"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Avg. Rating"
          value="4.6/5.0"
          change="+0.3 from last period"
          icon={Award}
          trend="up"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Revenue Trend</h3>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +18.2%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: any) => [`R ${value.toLocaleString()}`, 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#F97316" 
                fill="url(#colorRevenue)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Job Types Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Job Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {jobTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {jobTypes.map((type, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: type.color }}
                />
                <span className="text-sm text-neutral-600">{type.name}</span>
                <span className="text-sm font-medium text-neutral-900">{type.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-neutral-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm text-neutral-600">Pending</span>
            </div>
          </div>
        </motion.div>

        {/* Client Satisfaction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">Client Satisfaction</h3>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +0.3 points
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clientSatisfaction}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis domain={[3.5, 5]} stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: any) => [`${value}/5.0`, 'Rating']}
              />
              <Line 
                type="monotone" 
                dataKey="satisfaction" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-green-800">Revenue Goal</h4>
            <p className="text-sm text-green-600 mt-1">82% achieved this quarter</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-blue-800">Avg. Project Time</h4>
            <p className="text-sm text-blue-600 mt-1">12.5 days (improved by 2 days)</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h4 className="font-semibold text-orange-800">Quote Conversion</h4>
            <p className="text-sm text-orange-600 mt-1">68% (up from 62%)</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
