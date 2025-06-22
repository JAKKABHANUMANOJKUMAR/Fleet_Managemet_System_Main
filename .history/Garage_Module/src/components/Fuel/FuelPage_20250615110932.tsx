import React, { useState } from 'react';
import { Fuel, Plus, X } from 'lucide-react';
import { mockFuelEntries, mockBranches } from '../../data/mockData';
import { FuelEntry } from '../../types';
import BranchFilter from '../Common/BranchFilter';

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Fuel className="h-6 w-6 mr-2" />
            Fuel Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage fuel consumption and tracking</p>
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
          <BranchFilter
            selectedBranch={selectedBranch}
            onBranchChange={setSelectedBranch}
            branches={mockBranches}
            isDarkMode={isDarkMode}
            userRole={userRole}
            userBranch={userBranch}
          />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Total Fuel Consumed</h3>
          <p className="text-3xl font-bold text-blue-600">{totalFuelConsumed.toFixed(2)} L</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Total Fuel Cost</h3>
          <p className="text-3xl font-bold text-blue-600">₹{totalFuelCost.toFixed(2)}</p>
        </div>
      </div>

      {/* Add Fuel Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h2 className="text-2xl font-bold dark:text-white">Add Fuel Entry</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddFuel(); }} className="p-6 space-y-6">
              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Vehicle Number *</label>
                    <input
                      type="text"
                      value={newEntry.vehicleNumber || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, vehicleNumber: e.target.value })}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Vehicle ID *</label>
                    <input
                      type="text"
                      value={newEntry.vehicleId || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, vehicleId: e.target.value })}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Driver ID *</label>
                    <input
                      type="text"
                      value={newEntry.driverId || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, driverId: e.target.value })}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Branch *</label>
                    <select
                      value={newEntry.branch || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, branch: e.target.value })}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Trip Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Start Location *</label>
                    <input
                      type="text"
                      value={newEntry.startLocation || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, startLocation: e.target.value })}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">End Location *</label>
                    <input
                      type="text"
                      value={newEntry.endLocation || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, endLocation: e.target.value })}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Trip Start Date *</label>
                    <input
                      type="date"
                      value={newEntry.tripStartDate || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, tripStartDate: e.target.value })}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Trip End Date *</label>
                    <input
                      type="date"
                      value={newEntry.tripEndDate || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, tripEndDate: e.target.value })}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Fuel Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Fuel Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Start Location Reading (Kms) *</label>
                    <input
                      type="number"
                      value={newEntry.startLocationReading || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, startLocationReading: Number(e.target.value) })}
                      required
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">End Location Reading (Kms) *</label>
                    <input
                      type="number"
                      value={newEntry.endLocationReading || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, endLocationReading: Number(e.target.value) })}
                      required
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Fuel Load *</label>
                    <input
                      type="number"
                      value={newEntry.fuelLoad || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, fuelLoad: Number(e.target.value) })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Fuel Remaining *</label>
                    <input
                      type="number"
                      value={newEntry.fuelRemaining || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, fuelRemaining: Number(e.target.value) })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Fuel Consumed *</label>
                    <input
                      type="number"
                      value={newEntry.fuelConsumed || ''}
                      onChange={(e) => setNewEntry({ ...newEntry, fuelConsumed: Number(e.target.value) })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Fuel Bill</label>
                    <input
                      type="file"
                      onChange={(e) => setNewEntry({ ...newEntry, fuelBill: e.target.files?.[0] || null })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border rounded-lg transition-colors duration-200 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Fuel Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fuel Entries Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trip</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fuel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mileage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Branch</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium dark:text-white">{entry.vehicleNumber}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">ID: {entry.vehicleId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm dark:text-white">{entry.startLocation} → {entry.endLocation}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{entry.tripStartDate} to {entry.tripEndDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm dark:text-white">Consumed: {entry.fuelConsumed}L</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Remaining: {entry.fuelRemaining}L</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm dark:text-white">{entry.mileage.toFixed(2)} km/L</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm dark:text-white">{entry.branch}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 