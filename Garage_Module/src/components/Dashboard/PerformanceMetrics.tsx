import React from 'react';
import { TrendingUp, Target, Award, Clock } from 'lucide-react';

interface PerformanceMetricsProps {
  isDarkMode?: boolean;
  selectedBranch: string;
}

export default function PerformanceMetrics({ isDarkMode = false, selectedBranch }: PerformanceMetricsProps) {
  // Mock performance data
  const metrics = {
    onTimeDelivery: 94.5,
    customerSatisfaction: 4.8,
    averageDeliveryTime: 2.3,
    completedDeliveries: 847,
    targetDeliveries: 900,
    efficiency: 87.2
  };

  const completionRate = Math.round((metrics.completedDeliveries / metrics.targetDeliveries) * 100);

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Performance Metrics</h2>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>Key performance indicators and targets</p>
      </div>

      <div className="space-y-6">
        {/* On-Time Delivery */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Clock className={`h-5 w-5 mr-2 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`} />
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>On-Time Delivery</span>
            </div>
            <span className={`text-lg font-bold ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>{metrics.onTimeDelivery}%</span>
          </div>
          <div className={`w-full bg-gray-200 rounded-full h-2 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${metrics.onTimeDelivery}%` }}
            ></div>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Award className={`h-5 w-5 mr-2 ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`} />
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Customer Satisfaction</span>
            </div>
            <span className={`text-lg font-bold ${
              isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`}>{metrics.customerSatisfaction}/5.0</span>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`h-2 flex-1 rounded ${
                  star <= metrics.customerSatisfaction
                    ? 'bg-yellow-500'
                    : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Delivery Completion */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Target className={`h-5 w-5 mr-2 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Delivery Target</span>
            </div>
            <span className={`text-lg font-bold ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>{completionRate}%</span>
          </div>
          <div className={`w-full bg-gray-200 rounded-full h-2 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className={`flex justify-between text-xs mt-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <span>{metrics.completedDeliveries} completed</span>
            <span>{metrics.targetDeliveries} target</span>
          </div>
        </div>

        {/* Efficiency Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <TrendingUp className={`h-5 w-5 mr-2 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Overall Efficiency</span>
            </div>
            <span className={`text-lg font-bold ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>{metrics.efficiency}%</span>
          </div>
          <div className={`w-full bg-gray-200 rounded-full h-2 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${metrics.efficiency}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{metrics.averageDeliveryTime}h</div>
            <div className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Avg Delivery Time</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{metrics.completedDeliveries}</div>
            <div className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Deliveries Today</div>
          </div>
        </div>
      </div>
    </div>
  );
}