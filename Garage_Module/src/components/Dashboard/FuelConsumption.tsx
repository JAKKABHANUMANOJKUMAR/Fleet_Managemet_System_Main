import React from 'react';
import { Fuel, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fuelData = [
  { day: 'Mon', consumption: 145, cost: 189 },
  { day: 'Tue', consumption: 132, cost: 172 },
  { day: 'Wed', consumption: 158, cost: 206 },
  { day: 'Thu', consumption: 142, cost: 185 },
  { day: 'Fri', consumption: 167, cost: 218 },
  { day: 'Sat', consumption: 123, cost: 160 },
  { day: 'Sun', consumption: 98, cost: 128 },
];

interface FuelConsumptionProps {
  isDarkMode?: boolean;
  selectedBranch: string;
}

export default function FuelConsumption({ isDarkMode = false, selectedBranch }: FuelConsumptionProps) {
  const totalConsumption = fuelData.reduce((sum, item) => sum + item.consumption, 0);
  const totalCost = fuelData.reduce((sum, item) => sum + item.cost, 0);
  const avgConsumption = Math.round(totalConsumption / fuelData.length);
  const avgCostPerLiter = (totalCost / totalConsumption).toFixed(2);

  // Calculate efficiency metrics
  const fuelEfficiency = 7.2; // L/100km
  const weeklyImprovement = -3.5; // % improvement

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Fuel Management</h2>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>Consumption tracking and cost analysis</p>
      </div>

      {/* Fuel Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`text-center p-4 rounded-lg ${
          isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'
        }`}>
          <div className={`text-2xl font-bold ${
            isDarkMode ? 'text-orange-400' : 'text-orange-600'
          }`}>{totalConsumption}L</div>
          <div className={`text-sm ${
            isDarkMode ? 'text-orange-300' : 'text-orange-700'
          }`}>This Week</div>
        </div>
        <div className={`text-center p-4 rounded-lg ${
          isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
        }`}>
          <div className={`text-2xl font-bold ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}>${totalCost}</div>
          <div className={`text-sm ${
            isDarkMode ? 'text-green-300' : 'text-green-700'
          }`}>Total Cost</div>
        </div>
      </div>

      {/* Fuel Consumption Chart */}
      <div className="mb-6">
        <h3 className={`text-lg font-medium mb-4 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>Weekly Consumption</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={fuelData}>
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
              formatter={(value, name) => [
                name === 'consumption' ? `${value}L` : `Rs ${value}`,
                name === 'consumption' ? 'Consumption' : 'Cost'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="consumption" 
              stroke="#F97316" 
              strokeWidth={3}
              dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Efficiency Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className={`h-5 w-5 mr-2 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Fuel Efficiency</span>
          </div>
          <span className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{fuelEfficiency} L/100km</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className={`h-5 w-5 mr-2 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`} />
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Avg Cost/Liter</span>
          </div>
          <span className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>${avgCostPerLiter}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingDown className={`h-5 w-5 mr-2 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`} />
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Weekly Improvement</span>
          </div>
          <span className={`font-semibold ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}>{weeklyImprovement}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Fuel className={`h-5 w-5 mr-2 ${
              isDarkMode ? 'text-orange-400' : 'text-orange-600'
            }`} />
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Daily Average</span>
          </div>
          <span className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{avgConsumption}L</span>
        </div>
      </div>

      {/* Fuel Alerts */}
      <div className={`mt-6 p-4 rounded-lg ${
        isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
      }`}>
        <div className="flex items-center mb-2">
          <Fuel className={`h-4 w-4 mr-2 ${
            isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
          }`} />
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-yellow-400' : 'text-yellow-800'
          }`}>Fuel Optimization Tips</span>
        </div>
        <p className={`text-xs ${
          isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
        }`}>
          Consider route optimization to reduce fuel consumption by up to 15%
        </p>
      </div>
    </div>
  );
}