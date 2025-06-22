import React from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export default function Header({ isDarkMode, onThemeToggle }: HeaderProps) {
  // Mock user data - in a real app, this would come from authentication context
  const currentUser = {
    name: 'Admin User',
    role: 'Administrator',
    avatar: 'A'
  };

  return (
    <header className={`shadow-sm border-b px-6 py-4 flex items-center justify-between transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center flex-1">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search vehicles, drivers, alerts, services..."
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button
          onClick={onThemeToggle}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isDarkMode 
              ? 'hover:bg-gray-800 text-gray-300 hover:text-white' 
              : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
          }`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        
        <button className={`relative p-2 rounded-lg transition-colors duration-200 ${
          isDarkMode 
            ? 'hover:bg-gray-800 text-gray-300' 
            : 'hover:bg-gray-50 text-gray-700'
        }`}>
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
            3
          </span>
        </button>

        {/* User Info */}
        <div className={`flex items-center space-x-3 pl-4 border-l ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="text-right">
            <p className={`text-sm font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{currentUser.name}</p>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>{currentUser.role}</p>
          </div>
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-600">
            <span className="text-sm font-medium text-white">{currentUser.avatar}</span>
          </div>
        </div>
      </div>
    </header>
  );
}