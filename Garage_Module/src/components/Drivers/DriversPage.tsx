import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Star, Filter } from 'lucide-react';
import DataTable from '../Common/DataTable';
import DriverForm from './DriverForm';
import DriverDetailModal from './DriverDetailModal';
import BranchFilter from '../Common/BranchFilter';
import { mockDrivers, mockBranches } from '../../data/mockData';
import { Driver } from '../../types';

interface DriversPageProps {
  isDarkMode?: boolean;
}

export default function DriversPage({ isDarkMode = false }: DriversPageProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Mock user role and branch - in real app, this would come from auth context
  const userRole = 'admin'; // 'admin', 'manager', 'operator'
  const userBranch = '1'; // Only relevant for operators

  // Filter drivers based on selected branch and user permissions
  const getFilteredDrivers = () => {
    let filteredDrivers = mockDrivers;

    // If user is operator, restrict to their branch only
    if ((userRole as string) === 'operator' && userBranch) {
      filteredDrivers = filteredDrivers.filter(d => d.branchId === userBranch);
    } else if (selectedBranch !== 'all') {
      // For admin/manager, filter by selected branch
      filteredDrivers = filteredDrivers.filter(d => d.branchId === selectedBranch);
    }

    return filteredDrivers;
  };

  const filteredDrivers = getFilteredDrivers();

  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
      inactive: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800',
      suspended: isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderRating = (rating: number) => (
    <div className="flex items-center space-x-1">
      <Star className="h-4 w-4 text-yellow-400 fill-current" />
      <span className="text-sm font-medium">{rating}</span>
    </div>
  );

  const getBranchName = (branchId?: string) => {
    if (!branchId) return 'Unassigned';
    const branch = mockBranches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown';
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'licenseNumber', label: 'License Number', sortable: true },
    {
      key: 'branchId',
      label: 'Branch',
      sortable: true,
      render: (value: string) => (
        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {getBranchName(value)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value)
    },
    { key: 'experience', label: 'Experience', sortable: true, render: (value: number) => `${value} years` },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value: number) => renderRating(value)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Driver) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDriver(row)}
            className={`p-1 transition-colors duration-200 ${
              isDarkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setEditingDriver(row);
              setIsFormOpen(true);
            }}
            className={`p-1 transition-colors duration-200 ${
              isDarkMode 
                ? 'text-green-400 hover:text-green-300' 
                : 'text-green-600 hover:text-green-800'
            }`}
            title="Edit Driver"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => console.log('Delete driver', row.id)}
            className={`p-1 transition-colors duration-200 ${
              isDarkMode 
                ? 'text-red-400 hover:text-red-300' 
                : 'text-red-600 hover:text-red-800'
            }`}
            title="Delete Driver"
          >
            <Trash2 className="h-4 w-4" />
          </button>
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
          }`}>Drivers</h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Manage driver information and assignments</p>
        </div>
        <button
          onClick={() => {
            setEditingDriver(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Driver</span>
        </button>
      </div>

      {/* Branch Filter */}
      {(userRole === 'admin' || userRole === 'manager') && (
        <div className={`rounded-xl shadow-sm border p-4 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-4">
            <Filter className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <div className="flex items-center space-x-4">
              <BranchFilter
                selectedBranch={selectedBranch}
                onBranchChange={setSelectedBranch}
                branches={mockBranches}
                isDarkMode={isDarkMode}
                userRole={userRole}
                userBranch={userBranch}
              />
            </div>
          </div>
        </div>
      )}

      {/* Driver Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className={`border rounded-xl p-6 transition-colors duration-300 hover:scale-110 transition-transform ${
          isDarkMode 
            ? 'bg-green-900/20 border-green-800' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              isDarkMode ? 'text-green-400' : 'text-green-900'
            }`}>
              {filteredDrivers.filter(d => d.status === 'active').length}
            </p>
            <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>Active Drivers</p>
          </div>
        </div>
        <div className={`border rounded-xl p-6 transition-colors duration-300 hover:scale-110 transition-transform ${
          isDarkMode 
            ? 'bg-yellow-900/20 border-yellow-800' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              isDarkMode ? 'text-yellow-400' : 'text-yellow-900'
            }`}>
              {filteredDrivers.filter(d => d.status === 'inactive').length}
            </p>
            <p className={isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}>Inactive</p>
          </div>
        </div>
        <div className={`border rounded-xl p-6 transition-colors duration-300 hover:scale-110 transition-transform ${
          isDarkMode 
            ? 'bg-blue-900/20 border-blue-800' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              isDarkMode ? 'text-blue-400' : 'text-blue-900'
            }`}>
              {(filteredDrivers.reduce((sum, d) => sum + d.rating, 0) / filteredDrivers.length).toFixed(1) || '0.0'}
            </p>
            <p className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>Avg Rating</p>
          </div>
        </div>
        <div className={`border rounded-xl p-6 transition-colors duration-300 hover:scale-110 transition-transform ${
          isDarkMode 
            ? 'bg-purple-900/20 border-purple-800' 
            : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              isDarkMode ? 'text-purple-400' : 'text-purple-900'
            }`}>
              {filteredDrivers.length}
            </p>
            <p className={isDarkMode ? 'text-purple-300' : 'text-purple-700'}>Total Drivers</p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredDrivers}
        searchPlaceholder="Search drivers..."
        onRowClick={handleViewDriver}
        isDarkMode={isDarkMode}
      />

      {/* Driver Form */}
      {isFormOpen && (
        <DriverForm
          driver={editingDriver}
          onClose={() => {
            setIsFormOpen(false);
            setEditingDriver(null);
          }}
          onSave={(driverData) => {
            console.log('Save driver:', driverData);
            setIsFormOpen(false);
            setEditingDriver(null);
          }}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Driver Detail Modal */}
      {isDetailModalOpen && selectedDriver && (
        <DriverDetailModal
          driver={selectedDriver}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedDriver(null);
          }}
          onEdit={() => {
            setEditingDriver(selectedDriver);
            setIsDetailModalOpen(false);
            setIsFormOpen(true);
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}