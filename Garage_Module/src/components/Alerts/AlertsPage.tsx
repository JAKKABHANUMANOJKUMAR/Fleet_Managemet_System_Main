import React, { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, Filter } from 'lucide-react';
import DataTable from '../Common/DataTable';
import BranchFilter from '../Common/BranchFilter';
import { mockAlerts, mockVehicles, mockDrivers, mockBranches } from '../../data/mockData';

interface AlertsPageProps {
  isDarkMode?: boolean;
}

type UserRole = 'admin' | 'operator' | 'manager';

export default function AlertsPage({ isDarkMode = false }: AlertsPageProps) {
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user role and branch - in real app, this would come from auth context
  const userRole = 'admin' as UserRole;
  const userBranch = 'branch1';

  // Filter alerts based on selected branch and user permissions
  const getFilteredAlerts = () => {
    let filteredAlerts = mockAlerts;

    // If user is operator, restrict to their branch only
    if (userRole === 'operator' && userBranch) {
      filteredAlerts = filteredAlerts.filter(alert => {
        const vehicle = mockVehicles.find(v => v.id === alert.vehicleId);
        const driver = mockDrivers.find(d => d.id === alert.driverId);
        return (vehicle && vehicle.branchId === userBranch) || 
               (driver && driver.branchId === userBranch);
      });
    } else if (selectedBranch !== 'all') {
      // For admin/manager, filter by selected branch
      filteredAlerts = filteredAlerts.filter(alert => {
        const vehicle = mockVehicles.find(v => v.id === alert.vehicleId);
        const driver = mockDrivers.find(d => d.id === alert.driverId);
        return (vehicle && vehicle.branchId === selectedBranch) || 
               (driver && driver.branchId === selectedBranch);
      });
    }

    return filteredAlerts.filter(alert => {
      // Apply search filter
      const searchMatch = searchTerm === '' || 
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply priority and status filters
      const priorityMatch = filterPriority === 'all' || alert.severity === filterPriority;
      const statusMatch = filterStatus === 'all' || alert.status === filterStatus;

      return searchMatch && priorityMatch && statusMatch;
    });
  };

  const filteredAlerts = getFilteredAlerts();

  const getPriorityBadge = (severity: string) => {
    const styles = {
      high: isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800',
      medium: isDarkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-800',
      low: isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[severity as keyof typeof styles]}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800',
      acknowledged: isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      resolved: isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return '🔧';
      case 'license':
        return '📄';
      case 'insurance':
        return '🛡️';
      case 'fuel':
        return '⛽';
      case 'speed':
        return '⚡';
      case 'accident':
        return '🚨';
      default:
        return '⚠️';
    }
  };

  const getBranchName = (alertId: string) => {
    const alert = mockAlerts.find(a => a.id === alertId);
    if (!alert) return 'Unknown';
    
    const vehicle = mockVehicles.find(v => v.id === alert.vehicleId);
    const driver = mockDrivers.find(d => d.id === alert.driverId);
    
    const branchId = vehicle?.branchId || driver?.branchId;
    if (!branchId) return 'Unassigned';
    
    const branch = mockBranches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown';
  };

  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getTypeIcon(value)}</span>
          <span className="capitalize">{value}</span>
        </div>
      )
    },
    {
      key: 'severity',
      label: 'Priority',
      sortable: true,
      render: (value: string) => getPriorityBadge(value)
    },
    { key: 'message', label: 'Message', sortable: true },
    { key: 'description', label: 'Description' },
    {
      key: 'id',
      label: 'Branch',
      render: (value: string) => (
        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {getBranchName(value)}
        </span>
      )
    },
    {
      key: 'timestamp',
      label: 'Date/Time',
      sortable: true,
      render: (value: string) => (
        <div>
          <div className="text-sm">{new Date(value).toLocaleDateString()}</div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          {row.status === 'active' && (
            <button
              onClick={() => console.log('Acknowledge alert', row.id)}
              className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 font-medium ${
                isDarkMode 
                  ? 'bg-orange-900/30 text-orange-400 hover:bg-orange-900/50' 
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              }`}
            >
              Acknowledge
            </button>
          )}
          {row.status !== 'resolved' && (
            <button
              onClick={() => console.log('Resolve alert', row.id)}
              className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 font-medium ${
                isDarkMode 
                  ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Resolve
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Alerts</h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Monitor and manage system alerts and notifications</p>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className={`border rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-red-900/20 border-red-800' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-red-400' : 'text-red-900'
              }`}>
                {filteredAlerts.filter(a => a.severity === 'high' && a.status === 'active').length}
              </p>
              <p className={isDarkMode ? 'text-red-300' : 'text-red-700'}>High Priority Alerts</p>
            </div>
          </div>
        </div>
        <div className={`border rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-orange-900/20 border-orange-800' 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-orange-400' : 'text-orange-900'
              }`}>
                {filteredAlerts.filter(a => a.status === 'active').length}
              </p>
              <p className={isDarkMode ? 'text-orange-300' : 'text-orange-700'}>Active Alerts</p>
            </div>
          </div>
        </div>
        <div className={`border rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
          isDarkMode 
            ? 'bg-green-900/20 border-green-800' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-green-400' : 'text-green-900'
              }`}>
                {filteredAlerts.filter(a => a.status === 'resolved').length}
              </p>
              <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-xl shadow-sm border p-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-4">
          <Filter className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <div className="flex items-center space-x-4">
            {/* Branch Filter - only show for admin/manager */}
            {(userRole === 'admin' || userRole === 'manager') && (
              <BranchFilter
                selectedBranch={selectedBranch}
                onBranchChange={setSelectedBranch}
                branches={mockBranches}
                isDarkMode={isDarkMode}
                userRole={userRole}
                userBranch={userBranch}
              />
            )}
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredAlerts}
        searchPlaceholder="Search alerts..."
        isDarkMode={isDarkMode}
      />
    </div>
  );
}