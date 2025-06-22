import React from 'react';
import { X, Car, Calendar, MapPin, Shield, Wrench, User } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onEdit: () => void;
  isDarkMode?: boolean;
}

export default function VehicleDetailModal({ vehicle, onClose, onEdit, isDarkMode = false }: VehicleDetailModalProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      active: isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
      maintenance: isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      retired: isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'maintenance':
        return 'text-yellow-600';
      case 'retired':
        return 'text-red-600';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-xl shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto m-4 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Vehicle Details</h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {vehicle.registrationNumber} - {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-blue-400 hover:bg-gray-700' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              title="Edit Vehicle"
            >
              <Wrench className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Vehicle Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-4 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <div className="flex items-center mb-2">
                <Car className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-900'
                }`}>Registration</h3>
              </div>
              <p className={`text-lg font-bold ${
                isDarkMode ? 'text-blue-300' : 'text-blue-900'
              }`}>
                {vehicle.registrationNumber}
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-blue-400' : 'text-blue-700'
              }`}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
            </div>

            <div className={`p-4 rounded-lg transition-colors duration-300 ${
              vehicle.status === 'active' 
                ? isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
                : vehicle.status === 'maintenance'
                  ? isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
                  : isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
            }`}>
              <div className="flex items-center mb-2">
                <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(vehicle.status)}`}></div>
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Status</h3>
              </div>
              <div className="mb-2">
                {getStatusBadge(vehicle.status)}
              </div>
            </div>

            <div className={`p-4 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'
            }`}>
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Mileage</h3>
              </div>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {vehicle.mileage.toLocaleString()} km
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-purple-400' : 'text-purple-700'
              }`}>
                Current odometer
              </p>
            </div>

            <div className={`p-4 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Location</h3>
              </div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>
                {vehicle.location.lat.toFixed(4)}, {vehicle.location.lng.toFixed(4)}
              </p>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                GPS Coordinates
              </p>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Vehicle Information */}
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Vehicle Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Make:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {vehicle.make}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Model:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {vehicle.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Year:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {vehicle.year}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Registration:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {vehicle.registrationNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Maintenance Schedule */}
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Calendar className="h-5 w-5 mr-2" />
                  Maintenance Schedule
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Last Service:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {vehicle.lastService ? new Date(vehicle.lastService).toLocaleDateString() : 'Not recorded'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Next Service:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {vehicle.nextService ? new Date(vehicle.nextService).toLocaleDateString() : 'Not scheduled'}
                    </span>
                  </div>
                  {vehicle.nextService && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      new Date(vehicle.nextService) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        ? isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                        : isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                    }`}>
                      <p className="text-sm font-medium">
                        {new Date(vehicle.nextService) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          ? '⚠️ Service due soon'
                          : '✅ Service up to date'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tyres Details */}
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Car className="h-5 w-5 mr-2" />
                  Tyres Details
                </h3>
                {vehicle.tyres ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tyre 1 */}
                    <div className={`p-3 border rounded-lg ${
                      isDarkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-200 bg-white'
                    }`}>
                      <h4 className={`text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Tyre 1</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Number:</span>
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {vehicle.tyres.tyre1.number || 'Not specified'}
                          </span>
                        </div>
                        {vehicle.tyres.tyre1.photo && (
                          <div className="mt-2">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Photo:</span>
                            <div className={`mt-1 p-2 border rounded ${
                              isDarkMode ? 'border-gray-500 bg-gray-500' : 'border-gray-300 bg-gray-100'
                            }`}>
                              <p className={`text-xs text-center ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>Photo uploaded</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tyre 2 */}
                    <div className={`p-3 border rounded-lg ${
                      isDarkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-200 bg-white'
                    }`}>
                      <h4 className={`text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Tyre 2</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Number:</span>
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {vehicle.tyres.tyre2.number || 'Not specified'}
                          </span>
                        </div>
                        {vehicle.tyres.tyre2.photo && (
                          <div className="mt-2">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Photo:</span>
                            <div className={`mt-1 p-2 border rounded ${
                              isDarkMode ? 'border-gray-500 bg-gray-500' : 'border-gray-300 bg-gray-100'
                            }`}>
                              <p className={`text-xs text-center ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>Photo uploaded</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tyre 3 */}
                    <div className={`p-3 border rounded-lg ${
                      isDarkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-200 bg-white'
                    }`}>
                      <h4 className={`text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Tyre 3</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Number:</span>
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {vehicle.tyres.tyre3.number || 'Not specified'}
                          </span>
                        </div>
                        {vehicle.tyres.tyre3.photo && (
                          <div className="mt-2">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Photo:</span>
                            <div className={`mt-1 p-2 border rounded ${
                              isDarkMode ? 'border-gray-500 bg-gray-500' : 'border-gray-300 bg-gray-100'
                            }`}>
                              <p className={`text-xs text-center ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>Photo uploaded</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tyre 4 */}
                    <div className={`p-3 border rounded-lg ${
                      isDarkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-200 bg-white'
                    }`}>
                      <h4 className={`text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Tyre 4</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Number:</span>
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {vehicle.tyres.tyre4.number || 'Not specified'}
                          </span>
                        </div>
                        {vehicle.tyres.tyre4.photo && (
                          <div className="mt-2">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Photo:</span>
                            <div className={`mt-1 p-2 border rounded ${
                              isDarkMode ? 'border-gray-500 bg-gray-500' : 'border-gray-300 bg-gray-100'
                            }`}>
                              <p className={`text-xs text-center ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>Photo uploaded</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tyre 5 */}
                    <div className={`p-3 border rounded-lg ${
                      isDarkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-200 bg-white'
                    }`}>
                      <h4 className={`text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Tyre 5</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Number:</span>
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {vehicle.tyres.tyre5.number || 'Not specified'}
                          </span>
                        </div>
                        {vehicle.tyres.tyre5.photo && (
                          <div className="mt-2">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Photo:</span>
                            <div className={`mt-1 p-2 border rounded ${
                              isDarkMode ? 'border-gray-500 bg-gray-500' : 'border-gray-300 bg-gray-100'
                            }`}>
                              <p className={`text-xs text-center ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>Photo uploaded</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tyre 6 */}
                    <div className={`p-3 border rounded-lg ${
                      isDarkMode ? 'border-gray-600 bg-gray-600' : 'border-gray-200 bg-white'
                    }`}>
                      <h4 className={`text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Tyre 6</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Number:</span>
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {vehicle.tyres.tyre6.number || 'Not specified'}
                          </span>
                        </div>
                        {vehicle.tyres.tyre6.photo && (
                          <div className="mt-2">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Photo:</span>
                            <div className={`mt-1 p-2 border rounded ${
                              isDarkMode ? 'border-gray-500 bg-gray-500' : 'border-gray-300 bg-gray-100'
                            }`}>
                              <p className={`text-xs text-center ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>Photo uploaded</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 text-center rounded-lg ${
                    isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <p className="text-sm">No tyre information available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Insurance Information */}
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Shield className="h-5 w-5 mr-2" />
                  Insurance Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Provider:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {vehicle.insurance.provider}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Policy Number:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {vehicle.insurance.policyNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Expiry Date:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(vehicle.insurance.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                  {vehicle.insurance.expiryDate && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      new Date(vehicle.insurance.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        ? isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                        : isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                    }`}>
                      <p className="text-sm font-medium">
                        {new Date(vehicle.insurance.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          ? '⚠️ Insurance expiring soon'
                          : '✅ Insurance valid'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Driver Assignment */}
              {vehicle.driverId && (
                <div className={`p-6 rounded-lg transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <User className="h-5 w-5 mr-2" />
                    Assigned Driver
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Driver ID:</span>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {vehicle.driverId}
                      </span>
                    </div>
                    <button className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}>
                      View Driver Details
                    </button>
                  </div>
                </div>
              )}

              {/* Location Information */}
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <MapPin className="h-5 w-5 mr-2" />
                  Current Location
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Latitude:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {vehicle.location.lat.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Longitude:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {vehicle.location.lng.toFixed(6)}
                    </span>
                  </div>
                  <button className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}>
                    View on Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end space-x-4 p-6 border-t transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'text-gray-300 border-gray-600 hover:bg-gray-700' 
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Wrench className="h-4 w-4" />
            <span>Edit Vehicle</span>
          </button>
        </div>
      </div>
    </div>
  );
}