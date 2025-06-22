import React from 'react';
import { Users, Star, Award, TrendingUp } from 'lucide-react';

interface DriverPerformanceProps {
  isDarkMode?: boolean;
  selectedBranch: string;
}

export default function DriverPerformance({ isDarkMode = false, selectedBranch }: DriverPerformanceProps) {
  // Mock driver performance data
  const topDrivers = [
    { id: '1', name: 'John Smith', rating: 4.9, deliveries: 45, efficiency: 96 },
    { id: '2', name: 'Maria Garcia', rating: 4.8, deliveries: 42, efficiency: 94 },
    { id: '3', name: 'David Johnson', rating: 4.7, deliveries: 38, efficiency: 91 },
  ];

  const performanceMetrics = {
    averageRating: 4.6,
    totalDeliveries: 847,
    averageEfficiency: 89.2,
    safetyScore: 95.8
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Driver Performance</h2>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>Top performers and team metrics</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`text-center p-4 rounded-lg ${
          isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
        }`}>
          <div className={`text-2xl font-bold ${
            isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
          }`}>{performanceMetrics.averageRating}</div>
          <div className={`text-sm ${
            isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
          }`}>Avg Rating</div>
        </div>
        <div className={`text-center p-4 rounded-lg ${
          isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
        }`}>
          <div className={`text-2xl font-bold ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}>{performanceMetrics.safetyScore}%</div>
          <div className={`text-sm ${
            isDarkMode ? 'text-green-300' : 'text-green-700'
          }`}>Safety Score</div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>Top Performers This Month</h3>
        
        {topDrivers.map((driver, index) => (
          <div key={driver.id} className={`flex items-center justify-between p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
              }`}>
                {index + 1}
              </div>
              <div>
                <h4 className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{driver.name}</h4>
                <div className="flex items-center space-x-2">
                  {renderStars(driver.rating)}
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>({driver.rating})</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-sm font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{driver.deliveries} deliveries</div>
              <div className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>{driver.efficiency}% efficiency</div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className={`mt-6 pt-6 border-t ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className={`h-5 w-5 mr-2 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Team Efficiency</span>
            </div>
            <span className={`font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{performanceMetrics.averageEfficiency}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className={`h-5 w-5 mr-2 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Total Deliveries</span>
            </div>
            <span className={`font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{performanceMetrics.totalDeliveries}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <button className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
          isDarkMode 
            ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        }`}>
          View Detailed Reports
        </button>
      </div>
    </div>
  );
}