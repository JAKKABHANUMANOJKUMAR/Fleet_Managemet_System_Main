import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';
import DataTable from '../Common/DataTable';
import VehicleForm from './VehicleForm';
import VehicleDetailModal from './VehicleDetailModal';
import BranchFilter from '../Common/BranchFilter';
import { mockVehicles, mockBranches } from '../../data/mockData';
import { Vehicle } from '../../types';

interface VehiclesPageProps {
  isDarkMode?: boolean;
}

export default function VehiclesPage({ isDarkMode = false }: VehiclesPageProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Mock user role and branch - in real app, this would come from auth context
  const userRole: 'admin' | 'manager' | 'operator' = 'admin'; // 'admin', 'manager', 'operator'
  const userBranch = '1'; // Only relevant for operators

  // Filter vehicles based on selected branch and user permissions
  const getFilteredVehicles = () => {
    let filteredVehicles = mockVehicles;

    // If user is operator, restrict to their branch only
    if ((userRole as string) === 'operator' && userBranch) {
      filteredVehicles = filteredVehicles.filter(v => v.branchId === userBranch);
    } else if (selectedBranch !== 'all') {
      // For admin/manager, filter by selected branch
      filteredVehicles = filteredVehicles.filter(v => v.branchId === selectedBranch);
    }

    return filteredVehicles;
  };

  const filteredVehicles = getFilteredVehicles();

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
      maintenance: isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      retired: isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getBranchName = (branchId?: string) => {
    if (!branchId) return 'Unassigned';
    const branch = mockBranches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown';
  };

  const columns = [
    { key: 'registrationNumber', label: 'Registration', sortable: true },
    { key: 'make', label: 'Make', sortable: true },
    { key: 'model', label: 'Model', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
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
    { key: 'mileage', label: 'Mileage', sortable: true, render: (value: number) => `${value.toLocaleString()} km` },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Vehicle) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewVehicle(row)}
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
              setEditingVehicle(row);
              setIsFormOpen(true);
            }}
            className={`p-1 transition-colors duration-200 ${
              isDarkMode 
                ? 'text-green-400 hover:text-green-300' 
                : 'text-green-600 hover:text-green-800'
            }`}
            title="Edit Vehicle"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => console.log('Delete vehicle', row.id)}
            className={`p-1 transition-colors duration-200 ${
              isDarkMode 
                ? 'text-red-400 hover:text-red-300' 
                : 'text-red-600 hover:text-red-800'
            }`}
            title="Delete Vehicle"
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
          }`}>Vehicles</h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Manage your fleet vehicles and their information</p>
        </div>
        <button
          onClick={() => {
            setEditingVehicle(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Vehicle</span>
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

      {/* Vehicle Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className={`border rounded-xl p-6 transition-all duration-2000 hover:scale-110 ${
          isDarkMode 
            ? 'bg-green-900/20 border-green-800' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              isDarkMode ? 'text-green-400' : 'text-green-900'
            }`}>
              {filteredVehicles.filter(v => v.status === 'active').length}
            </p>
            <p className={isDarkMode ? 'text-green-300' : 'text-green-700'}>Active Vehicles</p>
          </div>
        </div>
        <div className={`border rounded-xl p-6 transition-all duration-2000 hover:scale-110 ${
          isDarkMode 
            ? 'bg-yellow-900/20 border-yellow-800' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              isDarkMode ? 'text-yellow-400' : 'text-yellow-900'
            }`}>
              {filteredVehicles.filter(v => v.status === 'maintenance').length}
            </p>
            <p className={isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}>In Maintenance</p>
          </div>
        </div>
        <div className={`border rounded-xl p-6 transition-all duration-2000 hover:scale-110 ${
          isDarkMode 
            ? 'bg-blue-900/20 border-blue-800' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              isDarkMode ? 'text-blue-400' : 'text-blue-900'
            }`}>
              {Math.round((filteredVehicles.filter(v => v.status === 'active').length / filteredVehicles.length) * 100) || 0}%
            </p>
            <p className={isDarkMode ? 'text-blue-300' : 'text-blue-700'}>Utilization Rate</p>
          </div>
        </div>
        <div className={`border rounded-xl p-6 transition-all duration-2000 hover:scale-110 ${
          isDarkMode 
            ? 'bg-purple-900/20 border-purple-800' 
            : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              isDarkMode ? 'text-purple-400' : 'text-purple-900'
            }`}>
              {filteredVehicles.length}
            </p>
            <p className={isDarkMode ? 'text-purple-300' : 'text-purple-700'}>Total Vehicles</p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredVehicles}
        searchPlaceholder="Search vehicles..."
        onRowClick={handleViewVehicle}
        isDarkMode={isDarkMode}
      />

      {/* Vehicle Form */}
      {isFormOpen && (
        <VehicleForm
          vehicle={editingVehicle}
          onClose={() => {
            setIsFormOpen(false);
            setEditingVehicle(null);
          }}
          onSave={(vehicleData) => {
            console.log('Save vehicle:', vehicleData);
            setIsFormOpen(false);
            setEditingVehicle(null);
          }}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Vehicle Detail Modal */}
      {isDetailModalOpen && selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedVehicle(null);
          }}
          onEdit={() => {
            setEditingVehicle(selectedVehicle);
            setIsDetailModalOpen(false);
            setIsFormOpen(true);
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}