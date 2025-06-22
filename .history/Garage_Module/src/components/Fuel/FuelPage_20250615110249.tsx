import React, { useState } from 'react';
import { Fuel } from 'lucide-react';

interface FuelEntry {
  vehicleNumber: string;
  vehicleId: string;
  driverId: string;
  startLocation: string;
  endLocation: string;
  tripStartDate: string;
  tripEndDate: string;
  startLocationReading: number;
  endLocationReading: number;
  fuelLoad: number;
  fuelBill: File | null;
  fuelRemaining: number;
  fuelConsumed: number;
  mileage: number;
  branch: string;
}

export default function FuelPage() {
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<FuelEntry>>({});

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
      
      setFuelEntries([...fuelEntries, { ...newEntry as FuelEntry, mileage }]);
      setNewEntry({});
      setShowAddForm(false);
    }
  };

  const totalFuelConsumed = fuelEntries.reduce((sum, entry) => sum + (entry.fuelConsumed || 0), 0);
  const totalFuelCost = fuelEntries.reduce((sum, entry) => sum + (entry.fuelLoad || 0), 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Fuel className="h-6 w-6 mr-2" />
          Fuel Management
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Fuel
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Fuel Entry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Vehicle Number"
              className="input-field"
              value={newEntry.vehicleNumber || ''}
              onChange={(e) => setNewEntry({ ...newEntry, vehicleNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="Vehicle ID"
              className="input-field"
              value={newEntry.vehicleId || ''}
              onChange={(e) => setNewEntry({ ...newEntry, vehicleId: e.target.value })}
            />
            <input
              type="text"
              placeholder="Driver ID"
              className="input-field"
              value={newEntry.driverId || ''}
              onChange={(e) => setNewEntry({ ...newEntry, driverId: e.target.value })}
            />
            <input
              type="text"
              placeholder="Start Location"
              className="input-field"
              value={newEntry.startLocation || ''}
              onChange={(e) => setNewEntry({ ...newEntry, startLocation: e.target.value })}
            />
            <input
              type="text"
              placeholder="End Location"
              className="input-field"
              value={newEntry.endLocation || ''}
              onChange={(e) => setNewEntry({ ...newEntry, endLocation: e.target.value })}
            />
            <input
              type="date"
              placeholder="Trip Start Date"
              className="input-field"
              value={newEntry.tripStartDate || ''}
              onChange={(e) => setNewEntry({ ...newEntry, tripStartDate: e.target.value })}
            />
            <input
              type="date"
              placeholder="Trip End Date"
              className="input-field"
              value={newEntry.tripEndDate || ''}
              onChange={(e) => setNewEntry({ ...newEntry, tripEndDate: e.target.value })}
            />
            <input
              type="number"
              placeholder="Start Location Reading (Kms)"
              className="input-field"
              value={newEntry.startLocationReading || ''}
              onChange={(e) => setNewEntry({ ...newEntry, startLocationReading: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="End Location Reading (Kms)"
              className="input-field"
              value={newEntry.endLocationReading || ''}
              onChange={(e) => setNewEntry({ ...newEntry, endLocationReading: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Fuel Load"
              className="input-field"
              value={newEntry.fuelLoad || ''}
              onChange={(e) => setNewEntry({ ...newEntry, fuelLoad: Number(e.target.value) })}
            />
            <input
              type="file"
              className="input-field"
              onChange={(e) => setNewEntry({ ...newEntry, fuelBill: e.target.files?.[0] || null })}
            />
            <input
              type="number"
              placeholder="Fuel Remaining"
              className="input-field"
              value={newEntry.fuelRemaining || ''}
              onChange={(e) => setNewEntry({ ...newEntry, fuelRemaining: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Fuel Consumed"
              className="input-field"
              value={newEntry.fuelConsumed || ''}
              onChange={(e) => setNewEntry({ ...newEntry, fuelConsumed: Number(e.target.value) })}
            />
            <input
              type="text"
              placeholder="Branch"
              className="input-field"
              value={newEntry.branch || ''}
              onChange={(e) => setNewEntry({ ...newEntry, branch: e.target.value })}
            />
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddFuel}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total Fuel Consumed</h3>
          <p className="text-3xl font-bold text-blue-600">{totalFuelConsumed.toFixed(2)} L</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total Fuel Cost</h3>
          <p className="text-3xl font-bold text-blue-600">₹{totalFuelCost.toFixed(2)}</p>
        </div>
      </div>

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
            {fuelEntries.map((entry, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{entry.vehicleNumber}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">ID: {entry.vehicleId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{entry.startLocation} → {entry.endLocation}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{entry.tripStartDate} to {entry.tripEndDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">Consumed: {entry.fuelConsumed}L</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Remaining: {entry.fuelRemaining}L</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{entry.mileage.toFixed(2)} km/L</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{entry.branch}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 