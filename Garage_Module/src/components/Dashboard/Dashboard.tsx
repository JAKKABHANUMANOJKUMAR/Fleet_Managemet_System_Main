import React, { useState, useEffect } from 'react';
import MetricCard from '../Common/MetricCard';
import VehicleChart from './VehicleChart';
import RecentAlerts from './RecentAlerts';
import BranchSelector from './BranchSelector';
import MaintenanceSchedule from './MaintenanceSchedule';
import TimeFilter from './TimeFilter';
import {
  Car,
  Users,
  AlertTriangle,
  DollarSign,
  Wrench,
  Clock,
  Truck,
  Package
} from 'lucide-react';
import { mockVehicles, mockDrivers, mockAlerts, mockBranches } from '../../data/mockData';

interface DashboardProps {
  isDarkMode?: boolean;
}

export default function Dashboard({ isDarkMode = false }: DashboardProps) {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');

  // Filter data based on selected branch
  const filteredVehicles = selectedBranch === 'all' 
    ? mockVehicles 
    : mockVehicles.filter(v => v.branchId === selectedBranch);
  
  const filteredDrivers = selectedBranch === 'all'
    ? mockDrivers
    : mockDrivers.filter(d => d.branchId === selectedBranch);

  const filteredAlerts = selectedBranch === 'all'
    ? mockAlerts
    : mockAlerts.filter(a => {
        const vehicle = mockVehicles.find(v => v.id === a.vehicleId);
        const driver = mockDrivers.find(d => d.id === a.driverId);
        return (vehicle && vehicle.branchId === selectedBranch) || 
               (driver && driver.branchId === selectedBranch);
      });

  // Calculate key metrics
  const activeVehicles = filteredVehicles.filter(v => v.status === 'active').length;
  const activeDrivers = filteredDrivers.filter(d => d.status === 'active').length;
  const criticalAlerts = filteredAlerts.filter(a => a.severity === 'high' && a.status === 'active').length;
  const maintenanceVehicles = filteredVehicles.filter(v => v.status === 'maintenance').length;
  const retiredVehicles = filteredVehicles.filter(v => v.status === 'retired').length;
  
  // Hardcoded driver status breakdown as per user request
  const activeDriversCount = 12;
  const maintenanceDriversCount = 3;
  const retiredDriversCount = 1;
  const totalDriversCount = activeDriversCount + maintenanceDriversCount + retiredDriversCount;

  const utilizationRate = filteredVehicles.length > 0 
    ? Math.round((activeVehicles / filteredVehicles.length) * 100) 
    : 0;

  // Mock revenue and delivery data based on time range
  const getRevenueData = (timeRange: string) => {
    switch (timeRange) {
      case 'today':
        return { revenue: 3420, growth: '+8.5%', deliveries: 47 };
      case 'week':
        return { revenue: 24580, growth: '+12%', deliveries: 342 };
      case 'month':
        return { revenue: 98750, growth: '+15.2%', deliveries: 1456 };
      default:
        return { revenue: 3420, growth: '+8.5%', deliveries: 47 };
    }
  };

  const revenueData = getRevenueData(selectedTimeRange);
  const onTimeDeliveryRate = 94.5;

  const selectedBranchName = selectedBranch === 'all' 
    ? 'All Branches' 
    : mockBranches.find(b => b.id === selectedBranch)?.name || 'Unknown Branch';

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      default: return 'Today';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Branch Selector and Time Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className={`text-4xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Dashboard</h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {selectedBranchName} • {getTimeRangeLabel(selectedTimeRange)} Overview
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <TimeFilter
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={setSelectedTimeRange}
            isDarkMode={isDarkMode}
          />
          <BranchSelector
            selectedBranch={selectedBranch}
            onBranchChange={setSelectedBranch}
            branches={mockBranches}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Active Vehicles"
          value={activeVehicles}
          change={{ value: `${utilizationRate}% utilization`, trend: utilizationRate >= 80 ? 'up' : 'neutral' }}
          icon={Truck}
          color="blue"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="Available Drivers"
          value={activeDrivers}
          change={{ value: `${Math.round((activeDrivers / filteredDrivers.length) * 100)}% active`, trend: 'up' }}
          icon={Users}
          color="green"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="Critical Alerts"
          value={criticalAlerts}
          change={{ value: criticalAlerts > 0 ? 'Needs attention' : 'All clear', trend: criticalAlerts > 0 ? 'down' : 'up' }}
          icon={AlertTriangle}
          color="red"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <MetricCard
          title="In Maintenance"
          value={maintenanceVehicles}
          change={{ value: `${Math.round((maintenanceVehicles / filteredVehicles.length) * 100)}% of fleet`, trend: 'neutral' }}
          icon={Wrench}
          color="yellow"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="Today Revenue"
          value={`₹${revenueData.revenue.toLocaleString()}`}
          change={{ value: revenueData.growth + ' vs last period', trend: 'up' }}
          icon={() => <span className="text-lg font-bold">₹</span>}
          color="purple"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="On-Time Delivery"
          value={`${onTimeDeliveryRate}%`}
          change={{ value: `${revenueData.deliveries} deliveries`, trend: 'up' }}
          icon={Package}
          color="green"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Branch Overview (only show when "All Branches" is selected) */}
      {selectedBranch === 'all' && (
        <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Branch Performance Overview</h2>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Compare performance across all branches for {getTimeRangeLabel(selectedTimeRange).toLowerCase()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBranches.map((branch) => {
              const branchVehicles = mockVehicles.filter(v => v.branchId === branch.id);
              const branchDrivers = mockDrivers.filter(d => d.branchId === branch.id);
              const branchActiveVehicles = branchVehicles.filter(v => v.status === 'active').length;
              const branchUtilization = branchVehicles.length > 0 
                ? Math.round((branchActiveVehicles / branchVehicles.length) * 100) 
                : 0;
              
              // Mock branch revenue based on time range
              const getBranchRevenue = (branchId: string, timeRange: string) => {
                const baseRevenue = { '1': 1200, '2': 980, '3': 1240 }[branchId] || 1000;
                const multiplier = { 'today': 1, 'week': 7, 'month': 30 }[timeRange] || 1;
                return Math.round(baseRevenue * multiplier);
              };
              
              const branchRevenue = getBranchRevenue(branch.id, selectedTimeRange);
              
              return (
                <div key={branch.id} className={`p-4 rounded-lg border transition-colors duration-300 flex flex-col ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{branch.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      branchUtilization >= 80
                        ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                        : branchUtilization >= 60
                          ? isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                          : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                    }`}>
                      {branchUtilization}%
                    </span>
                  </div>
                  <div className="space-y-2 flex-grow">
                    <div className="flex justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Vehicles:</span>
                      <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                        {branchActiveVehicles}/{branchVehicles.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Drivers:</span>
                      <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                        {branchDrivers.filter(d => d.status === 'active').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Revenue:</span>
                      <span className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        Rs {branchRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Location:</span>
                      <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                        {branch.location}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setSelectedBranch(branch.id)}
                      className={`w-full px-3 py-2 text-sm rounded-lg transition-colors duration-200 font-medium ${
                        isDarkMode 
                          ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VehicleChart isDarkMode={isDarkMode} selectedBranch={selectedBranch} timeRange={selectedTimeRange} />
        <MaintenanceSchedule 
          isDarkMode={isDarkMode} 
          vehicles={filteredVehicles}
          selectedBranch={selectedBranch}
          timeRange={selectedTimeRange}
        />
      </div>

      {/* Recent Alerts */}
      <RecentAlerts isDarkMode={isDarkMode} alerts={filteredAlerts} timeRange={selectedTimeRange} />

      {/* Fleet Status Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h2>
        
      </div>
    </div>
  );
}