import React, { useState } from 'react';
import { Fuel, Plus, X, Filter, IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import { mockFuelEntries, mockBranches } from '../../data/mockData';
import { FuelEntry } from '../../types';
import BranchFilter from '../Common/BranchFilter';
import DataTable from '../Common/DataTable';
import MetricCard from '../Common/MetricCard';

interface FuelPageProps {
  isDarkMode?: boolean;
}

export default function FuelPage({ isDarkMode = false }: FuelPageProps) {
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>(mockFuelEntries);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<FuelEntry>>({});
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Mock user role and branch - in real app, this would come from auth context
  const userRole = 'admin'; // 'admin', 'manager', 'operator'
  const userBranch = '1'; // Only relevant for operators

  // Filter fuel entries based on selected branch and user permissions
  const getFilteredEntries = () => {
    let filteredEntries = fuelEntries;

    // If user is operator, restrict to their branch only
    if ((userRole as string) === 'operator' && userBranch) {
      filteredEntries = filteredEntries.filter(e => e.branch === mockBranches.find(b => b.id === userBranch)?.name);
    } else if (selectedBranch !== 'all') {
      // For admin/manager, filter by selected branch
      filteredEntries = filteredEntries.filter(e => e.branch === mockBranches.find(b => b.id === selectedBranch)?.name);
    }

    return filteredEntries;
  };

  const filteredEntries = getFilteredEntries();

  const calculateMileage = (start: number, end: number, consumed: number) => {
    if (consumed <= 0) return 0;
    return (end - start) / consumed;
  };

  const handleAddFuel = () => {
    if (newEntry.startLocationReading && newEntry.endLocationReading && newEntry.fuelConsumed) {
      const mileage = calculateMileage(
        newEntry.startLocationReading,
        newEntry.endLocationReading,
        newEntry.fuelConsumed
      );
      
      const newFuelEntry: FuelEntry = {
        id: (fuelEntries.length + 1).toString(),
        vehicleNumber: newEntry.vehicleNumber || '',
        vehicleId: newEntry.vehicleId || '',
        driverId: newEntry.driverId || '',
        startLocation: newEntry.startLocation || '',
        endLocation: newEntry.endLocation || '',
        tripStartDate: newEntry.tripStartDate || '',
        tripEndDate: newEntry.tripEndDate || '',
        startLocationReading: newEntry.startLocationReading || 0,
        endLocationReading: newEntry.endLocationReading || 0,
        fuelLoad: newEntry.fuelLoad || 0,
        fuelBill: newEntry.fuelBill || null,
        fuelRemaining: newEntry.fuelRemaining || 0,
        fuelConsumed: newEntry.fuelConsumed || 0,
        mileage,
        branch: newEntry.branch || ''
      };
      
      setFuelEntries([...fuelEntries, newFuelEntry]);
      setNewEntry({});
      setShowAddForm(false);
    }
  };

  const totalFuelConsumed = filteredEntries.reduce((sum, entry) => sum + entry.fuelConsumed, 0);
  const totalFuelCost = filteredEntries.reduce((sum, entry) => sum + entry.fuelLoad, 0);
  const avgMileage = filteredEntries.reduce((sum, entry) => sum + entry.mileage, 0) / filteredEntries.length || 0;

  const columns = [
    { 
      key: 'vehicleNumber', 
      label: 'Vehicle', 
      sortable: true,
      render: (value: string, row: FuelEntry) => (
        <div>
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {row.branch} • {row.mileage.toFixed(2)} km/L
          </div>
        </div>
      )
    },
    {
      key: 'tripStartDate',
      label: 'Trip Period',
      sortable: true,
      render: (_: any, row: FuelEntry) => (
        <div>
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {new Date(row.tripStartDate).toLocaleDateString()} - {new Date(row.tripEndDate).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {row.startLocation} → {row.endLocation}
          </div>
        </div>
      )
    },
    {
      key: 'fuelConsumed',
      label: 'Fuel',
      sortable: true,
      render: (_: any, row: FuelEntry) => (
        <div className="text-right">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {row.fuelConsumed.toFixed(2)} L
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Remaining: {row.fuelRemaining.toFixed(2)} L
          </div>
        </div>
      )
    },
    {
      key: 'fuelLoad',
      label: 'Cost',
      sortable: true,
      render: (value: number) => (
        <div className="text-right">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ₹{value.toFixed(2)}
          </div>
        </div>
      )
    },
    {
      key: 'mileage',
      label: 'Mileage',
      sortable: true,
      render: (value: number) => (
        <div className="text-right">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {value.toFixed(2)} km/L
          </div>
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
          }`}>Fuel Management</h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Track and manage fuel consumption and costs</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Fuel</span>
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

      {/* Fuel Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Fuel Consumed"
          value={`${totalFuelConsumed.toFixed(2)} L`}
          icon={TrendingDown}
          color="blue"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="Total Fuel Cost"
          value={`₹${totalFuelCost.toFixed(2)}`}
          icon={IndianRupee}
          color="green"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="Average Mileage"
          value={`${avgMileage.toFixed(2)} km/L`}
          icon={TrendingUp}
          color="purple"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="Total Entries"
          value={filteredEntries.length}
          icon={Fuel}
          color="yellow"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Fuel Entries Table */}
      <DataTable
        columns={columns}
        data={filteredEntries}
        searchPlaceholder="Search fuel entries..."
        isDarkMode={isDarkMode}
      />

      {/* Add Fuel Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b transition-colors duration-300 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Fuel className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Add Fuel Entry</h2>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Enter fuel consumption details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddFuel(); }} className="p-6 space-y-6">
              {/* Vehicle Information */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Vehicle Number *</label>
                    <input
                      type="text"
                      value={newEntry.vehicleNumber || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, vehicleNumber: e.target.value })}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Vehicle ID *</label>
                    <input
                      type="text"
                      value={newEntry.vehicleId || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, vehicleId: e.target.value })}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Driver ID *</label>
                    <input
                      type="text"
                      value={newEntry.driverId || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, driverId: e.target.value })}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Branch *</label>
                    <select
                      value={newEntry.branch || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, branch: e.target.value })}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">Select a branch</option>
                      {mockBranches.map(branch => (
                        <option key={branch.id} value={branch.name}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Trip Information */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Trip Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Start Location *</label>
                    <input
                      type="text"
                      value={newEntry.startLocation || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, startLocation: e.target.value })}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>End Location *</label>
                    <input
                      type="text"
                      value={newEntry.endLocation || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, endLocation: e.target.value })}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Trip Start Date *</label>
                    <input
                      type="date"
                      value={newEntry.tripStartDate || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, tripStartDate: e.target.value })}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Trip End Date *</label>
                    <input
                      type="date"
                      value={newEntry.tripEndDate || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, tripEndDate: e.target.value })}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Fuel Information */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Fuel Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Start Location Reading (Kms) *</label>
                    <input
                      type="number"
                      value={newEntry.startLocationReading || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, startLocationReading: Number(e.target.value) })}
                      required
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>End Location Reading (Kms) *</label>
                    <input
                      type="number"
                      value={newEntry.endLocationReading || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, endLocationReading: Number(e.target.value) })}
                      required
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Fuel Load *</label>
                    <input
                      type="number"
                      value={newEntry.fuelLoad || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, fuelLoad: Number(e.target.value) })}
                      required
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Fuel Remaining *</label>
                    <input
                      type="number"
                      value={newEntry.fuelRemaining || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, fuelRemaining: Number(e.target.value) })}
                      required
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Fuel Consumed *</label>
                    <input
                      type="number"
                      value={newEntry.fuelConsumed || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, fuelConsumed: Number(e.target.value) })}
                      required
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Fuel Bill</label>
                    <input
                      type="file"
                      onChange={(e) => setNewEntry({ ...newEntry, fuelBill: e.target.files?.[0] || null })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className={`flex items-center justify-end space-x-4 pt-6 border-t transition-colors duration-300 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 border-gray-600 hover:bg-gray-700' 
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Fuel Entry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 