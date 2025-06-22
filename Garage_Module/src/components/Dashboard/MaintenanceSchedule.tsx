import React from 'react';
import { Calendar, Wrench, AlertTriangle, Clock } from 'lucide-react';
import { Vehicle } from '../../types';

interface MaintenanceScheduleProps {
  isDarkMode?: boolean;
  vehicles: Vehicle[];
  selectedBranch: string;
  timeRange: string;
}

export default function MaintenanceSchedule({ isDarkMode = false, vehicles, selectedBranch, timeRange }: MaintenanceScheduleProps) {
  // Calculate maintenance schedules based on time range
  const getMaintenanceForTimeRange = () => {
    const now = new Date();
    let endDate: Date;
    
    switch (timeRange) {
      case 'today':
        endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'week':
        endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    return vehicles.filter(v => {
      if (!v.nextService) return false;
      const nextServiceDate = new Date(v.nextService);
      return nextServiceDate >= now && nextServiceDate <= endDate;
    }).sort((a, b) => new Date(a.nextService!).getTime() - new Date(b.nextService!).getTime());
  };

  const upcomingMaintenance = getMaintenanceForTimeRange();

  const overdueMaintenance = vehicles.filter(v => {
    if (!v.nextService) return false;
    const nextServiceDate = new Date(v.nextService);
    return nextServiceDate < new Date();
  });

  const inMaintenance = vehicles.filter(v => v.status === 'maintenance');

  const getMaintenanceStatus = (vehicle: Vehicle) => {
    if (!vehicle.nextService) return 'unknown';
    const nextServiceDate = new Date(vehicle.nextService);
    const now = new Date();
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    if (nextServiceDate < now) return 'overdue';
    if (nextServiceDate <= sevenDaysFromNow) return 'urgent';
    return 'scheduled';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return isDarkMode ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-100';
      case 'urgent':
        return isDarkMode ? 'text-orange-400 bg-orange-900/30' : 'text-orange-600 bg-orange-100';
      case 'scheduled':
        return isDarkMode ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-100';
      default:
        return isDarkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      case 'urgent':
        return <Clock className="h-4 w-4" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Wrench className="h-4 w-4" />;
    }
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'today': return 'today';
      case 'week': return 'this week';
      case 'month': return 'this month';
      default: return 'today';
    }
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
        }`}>Maintenance Schedule</h2>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>Maintenance due {getTimeRangeLabel(timeRange)} and overdue tasks</p>
      </div>

      {/* Maintenance Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`text-center p-4 rounded-lg ${
          isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
        }`}>
          <div className={`text-2xl font-bold ${
            isDarkMode ? 'text-red-400' : 'text-red-600'
          }`}>{overdueMaintenance.length}</div>
          <div className={`text-sm ${
            isDarkMode ? 'text-red-300' : 'text-red-700'
          }`}>Overdue</div>
        </div>
        <div className={`text-center p-4 rounded-lg ${
          isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'
        }`}>
          <div className={`text-2xl font-bold ${
            isDarkMode ? 'text-orange-400' : 'text-orange-600'
          }`}>{upcomingMaintenance.length}</div>
          <div className={`text-sm ${
            isDarkMode ? 'text-orange-300' : 'text-orange-700'
          }`}>Due {getTimeRangeLabel(timeRange)}</div>
        </div>
        <div className={`text-center p-4 rounded-lg ${
          isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
        }`}>
          <div className={`text-2xl font-bold ${
            isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
          }`}>{inMaintenance.length}</div>
          <div className={`text-sm ${
            isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
          }`}>In Progress</div>
        </div>
      </div>

      {/* Maintenance List */}
      <div className="space-y-3">
        <h3 className={`text-lg font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>Priority Maintenance</h3>
        
        {upcomingMaintenance.length === 0 && overdueMaintenance.length === 0 ? (
          <div className={`text-center py-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No maintenance due {getTimeRangeLabel(timeRange)}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...overdueMaintenance, ...upcomingMaintenance].slice(0, 5).map((vehicle) => {
              const status = getMaintenanceStatus(vehicle);
              const statusColor = getStatusColor(status);
              const StatusIcon = () => getStatusIcon(status);
              
              return (
                <div key={vehicle.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${statusColor}`}>
                      <StatusIcon />
                    </div>
                    <div>
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{vehicle.registrationNumber}</h4>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {vehicle.make} {vehicle.model} • {vehicle.mileage.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                    <p className={`text-sm mt-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {vehicle.nextService ? new Date(vehicle.nextService).toLocaleDateString() : 'Not scheduled'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className={`mt-6 pt-6 border-t ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex space-x-3">
          <button className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
            isDarkMode 
              ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}>
            Schedule Maintenance
          </button>
          <button className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
            isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}>
            View All
          </button>
        </div>
      </div>
    </div>
  );
}