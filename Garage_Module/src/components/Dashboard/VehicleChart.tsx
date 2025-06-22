import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const statusData = [
  { name: 'Active', value: 12, color: '#4CAF50' },
  { name: 'Maintenance', value: 3, color: '#FF9800' },
  { name: 'Retired', value: 1, color: '#F44336' },
];

const driverStatusData = [
  { name: 'Active', value: 12, color: '#4CAF50' },
  { name: 'Maintenance', value: 3, color: '#FF9800' },
  { name: 'Retired', value: 1, color: '#F44336' },
];

interface VehicleChartProps {
  isDarkMode?: boolean;
  selectedBranch: string;
  timeRange: string;
}

export default function VehicleChart({ isDarkMode = false, selectedBranch, timeRange }: VehicleChartProps) {
  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      default: return 'Current';
    }
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Status Distribution</h2>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>{getTimeRangeLabel(timeRange)} vehicle status breakdown</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center">
        {/* Vehicle Pie Chart */}
        <div className="w-full lg:w-1/2">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#F9FAFB' : '#111827'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Legend and Stats */}
        <div className="w-full lg:w-1/2 lg:pl-6">
          <div className="space-y-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.value}
                  </span>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {Math.round((item.value / statusData.reduce((sum, s) => sum + s.value, 0)) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className={`mt-6 pt-4 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {statusData.reduce((sum, item) => sum + item.value, 0)}
                </div>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Total Vehicles</div>
              </div>
              <div>
                <div className={`text-xl font-bold text-green-600`}>
                  {Math.round((statusData.find(s => s.name === 'Active')?.value || 0) / statusData.reduce((sum, s) => sum + s.value, 0) * 100)}%
                </div>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Utilization</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drivers Status Breakdown */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Today Drivers Status Breakdown</h3>

        <div className="flex flex-col lg:flex-row items-center">
          {/* Driver Pie Chart */}
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={driverStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {driverStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: isDarkMode ? '#F9FAFB' : '#111827'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Driver Legend and Stats */}
          <div className="w-full lg:w-1/2 lg:pl-6">
            <div className="space-y-4">
              {driverStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.value}
                    </span>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {Math.round((item.value / driverStatusData.reduce((sum, s) => sum + s.value, 0)) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className={`mt-6 pt-4 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {driverStatusData.reduce((sum, item) => sum + item.value, 0)}
                  </div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Total Drivers</div>
                </div>
                <div>
                  <div className={`text-xl font-bold text-green-600`}>
                    {Math.round((driverStatusData.find(s => s.name === 'Active')?.value || 0) / driverStatusData.reduce((sum, s) => sum + s.value, 0) * 100)}%
                  </div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Utilization
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}