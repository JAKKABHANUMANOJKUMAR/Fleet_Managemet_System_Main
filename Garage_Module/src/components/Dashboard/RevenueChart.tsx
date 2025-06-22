import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 45000, target: 50000 },
  { month: 'Feb', revenue: 52000, target: 50000 },
  { month: 'Mar', revenue: 48000, target: 50000 },
  { month: 'Apr', revenue: 61000, target: 55000 },
  { month: 'May', revenue: 58000, target: 55000 },
  { month: 'Jun', revenue: 67000, target: 60000 },
];

const dailyRevenueData = [
  { day: 'Mon', revenue: 8500 },
  { day: 'Tue', revenue: 9200 },
  { day: 'Wed', revenue: 8800 },
  { day: 'Thu', revenue: 9600 },
  { day: 'Fri', revenue: 10200 },
  { day: 'Sat', revenue: 7800 },
  { day: 'Sun', revenue: 6900 },
];

interface RevenueChartProps {
  isDarkMode?: boolean;
  selectedBranch: string;
}

export default function RevenueChart({ isDarkMode = false, selectedBranch }: RevenueChartProps) {
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const avgMonthlyRevenue = Math.round(totalRevenue / revenueData.length);
  const currentMonthRevenue = revenueData[revenueData.length - 1].revenue;
  const growthRate = revenueData.length > 1 
    ? Math.round(((currentMonthRevenue - revenueData[revenueData.length - 2].revenue) / revenueData[revenueData.length - 2].revenue) * 100)
    : 0;

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Revenue Analytics</h2>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Monthly revenue trends and performance</p>
          </div>
          <DollarSign className={`h-6 w-6 ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`} />
        </div>
        
        {/* Revenue Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className={`text-center p-3 rounded-lg ${
            isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
          }`}>
            <div className={`text-lg font-bold ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>${currentMonthRevenue.toLocaleString()}</div>
            <div className={`text-xs ${
              isDarkMode ? 'text-green-300' : 'text-green-700'
            }`}>This Month</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${
            isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
          }`}>
            <div className={`text-lg font-bold ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>${avgMonthlyRevenue.toLocaleString()}</div>
            <div className={`text-xs ${
              isDarkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>Avg Monthly</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${
            growthRate >= 0
              ? isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
              : isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
          }`}>
            <div className={`text-lg font-bold flex items-center justify-center ${
              growthRate >= 0
                ? isDarkMode ? 'text-green-400' : 'text-green-600'
                : isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              {growthRate >= 0 ? '+' : ''}{growthRate}%
            </div>
            <div className={`text-xs ${
              growthRate >= 0
                ? isDarkMode ? 'text-green-300' : 'text-green-700'
                : isDarkMode ? 'text-red-300' : 'text-red-700'
            }`}>Growth</div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="mb-6">
        <h3 className={`text-lg font-medium mb-4 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>Monthly Revenue vs Target</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="month" 
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: isDarkMode ? '#4B5563' : '#D1D5DB' }}
            />
            <YAxis 
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: isDarkMode ? '#4B5563' : '#D1D5DB' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                borderRadius: '8px',
                color: isDarkMode ? '#F9FAFB' : '#111827'
              }}
              formatter={(value, name) => [
                `Rs ${Number(value).toLocaleString()}`,
                name === 'revenue' ? 'Revenue' : 'Target'
              ]}
            />
            <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#6B7280" radius={[4, 4, 0, 0]} opacity={0.3} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Revenue Trend */}
      <div>
        <h3 className={`text-lg font-medium mb-4 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>This Week's Daily Revenue</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={dailyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="day" 
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: isDarkMode ? '#4B5563' : '#D1D5DB' }}
            />
            <YAxis 
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: isDarkMode ? '#4B5563' : '#D1D5DB' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                borderRadius: '8px',
                color: isDarkMode ? '#F9FAFB' : '#111827'
              }}
              formatter={(value) => [`Rs ${Number(value).toLocaleString()}`, 'Revenue']}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}