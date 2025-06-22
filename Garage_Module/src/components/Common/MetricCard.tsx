import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: LucideIcon | React.ComponentType<{ className?: string }> | string;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  isDarkMode?: boolean;
  className?: string;
}

export default function MetricCard({ title, value, change, icon: Icon, color, isDarkMode = false, className }: MetricCardProps) {
  const colorClasses = {
    blue: '#4299E1',
    green: '#48BB78',
    red: '#F56565',
    yellow: '#FFA500',
    purple: '#8B5CF6',
  };

  const changeColorClasses = {
    up: '#48BB78',
    down: '#F56565',
    neutral: isDarkMode ? '#9CA3AF' : '#718096',
  };

  return (
    <div className={`p-6 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${className} ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
        : 'bg-white border-gray-200 hover:bg-gray-50'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{title}</p>
          <p className={`text-3xl font-bold mt-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{value}</p>
          {change && (
            <p className="text-sm mt-2" style={{ color: changeColorClasses[change.trend] }}>
              {change.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg" style={{ backgroundColor: colorClasses[color] }}>
            {typeof Icon === 'string' ? (
              <span className="text-white text-lg font-semibold">{Icon}</span>
            ) : (
              <Icon className="h-6 w-6 text-white" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}