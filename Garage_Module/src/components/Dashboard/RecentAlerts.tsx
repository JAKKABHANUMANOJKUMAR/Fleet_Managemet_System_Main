import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Alert } from '../../types';

interface RecentAlertsProps {
  isDarkMode?: boolean;
  alerts: Alert[];
  timeRange: string;
}

export default function RecentAlerts({ isDarkMode = false, alerts, timeRange }: RecentAlertsProps) {
  // Filter alerts based on time range
  const getAlertsForTimeRange = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    return alerts.filter(alert => {
      const alertDate = new Date(alert.timestamp);
      return alertDate >= startDate;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const filteredAlerts = getAlertsForTimeRange();
  const recentAlerts = filteredAlerts.slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return isDarkMode ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-100';
      case 'warning':
        return isDarkMode ? 'text-orange-400 bg-orange-900/30' : 'text-orange-600 bg-orange-100';
      case 'info':
        return isDarkMode ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-100';
      default:
        return isDarkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'acknowledged':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'today': return 'today';
      case 'week': return 'this week';
      case 'month': return 'this month';
      default: return 'recent';
    }
  };

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Recent Alerts</h2>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>System notifications from {getTimeRangeLabel(timeRange)} ({filteredAlerts.length} total)</p>
        </div>
        <button className={`text-blue-600 hover:text-blue-700 text-sm font-medium ${
          isDarkMode ? 'text-blue-400 hover:text-blue-300' : ''
        }`}>
          View All
        </button>
      </div>

      <div className="space-y-4">
        {recentAlerts.length === 0 ? (
          <div className={`text-center py-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No alerts {getTimeRangeLabel(timeRange)}</p>
            <p className="text-sm">All systems are running smoothly</p>
          </div>
        ) : (
          recentAlerts.map((alert) => (
            <div key={alert.id} className={`flex items-start space-x-4 p-4 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}>
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(alert.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium truncate ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {alert.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{alert.description}</p>
                <p className={`text-xs mt-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {new Date(alert.timestamp).toLocaleDateString()} at{' '}
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}