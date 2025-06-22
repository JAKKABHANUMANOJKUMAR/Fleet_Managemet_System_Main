import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { mockVehicles } from '../../data/mockData';

interface LiveMapProps {
  isDarkMode?: boolean;
}

export default function LiveMap({ isDarkMode = false }: LiveMapProps) {
  const activeVehicles = mockVehicles.filter(v => v.status === 'active');

  return (
    <div className={`rounded-xl shadow-sm border p-6 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="mb-6">
        <h2 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Live Vehicle Tracking</h2>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>Real-time GPS locations of active vehicles</p>
      </div>

      {/* Map Placeholder */}
      <div className={`rounded-lg h-64 flex items-center justify-center mb-4 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <div className="text-center">
          <MapPin className={`h-12 w-12 mx-auto mb-2 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Interactive Map</p>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>GPS tracking visualization</p>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="space-y-3">
        <h3 className={`text-lg font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>Active Vehicles</h3>
        {activeVehicles.map((vehicle) => (
          <div key={vehicle.id} className={`flex items-center justify-between p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{vehicle.registrationNumber}</p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {vehicle.make} {vehicle.model}
                </p>
              </div>
            </div>
            <div className={`flex items-center text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Navigation className="h-4 w-4 mr-1" />
              <span>
                {vehicle.location.lat.toFixed(4)}, {vehicle.location.lng.toFixed(4)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}