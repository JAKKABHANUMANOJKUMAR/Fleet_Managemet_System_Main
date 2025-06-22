import React from 'react';
import { Calendar, Clock, ChevronDown } from 'lucide-react';

interface TimeFilterProps {
  selectedTimeRange: string;
  onTimeRangeChange: (timeRange: string) => void;
  isDarkMode?: boolean;
}

export default function TimeFilter({ 
  selectedTimeRange, 
  onTimeRangeChange, 
  isDarkMode = false 
}: TimeFilterProps) {
  const timeRanges = [
    { id: 'today', label: 'Today', icon: Clock },
    { id: 'week', label: 'This Week', icon: Calendar },
    { id: 'month', label: 'This Month', icon: Calendar },
  ];

  const selectedRange = timeRanges.find(range => range.id === selectedTimeRange);

  return (
    <div className="relative">
      <label className={`block text-sm font-medium mb-2 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        Time Period
      </label>
      <div className="relative">
        <select
          value={selectedTimeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
          className={`appearance-none w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {timeRanges.map((range) => (
            <option key={range.id} value={range.id}>
              {range.label}
            </option>
          ))}
        </select>
        
        {selectedRange && (
          <selectedRange.icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
        )}
        
        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </div>
      
      <div className={`mt-2 text-sm ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Viewing: {selectedRange?.label}
      </div>
    </div>
  );
}