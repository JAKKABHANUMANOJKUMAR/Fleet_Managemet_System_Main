import React from 'react';
import { X, User, Phone, Mail, Calendar, Star, Shield, AlertTriangle, Car } from 'lucide-react';
import { Driver } from '../../types';

interface DriverDetailModalProps {
  driver: Driver;
  onClose: () => void;
  onEdit: () => void;
  isDarkMode?: boolean;
}

export default function DriverDetailModal({ driver, onClose, onEdit, isDarkMode = false }: DriverDetailModalProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      active: isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
      inactive: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800',
      suspended: isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800',
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
      case 'inactive':
        return 'text-gray-600';
      case 'suspended':
        return 'text-red-600';
      default:
        return isDarkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`}
          />
        ))}
        <span className={`ml-2 text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const isLicenseExpiringSoon = () => {
    const expiryDate = new Date(driver.licenseExpiry);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expiryDate <= thirtyDaysFromNow;
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
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Driver Details</h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {driver.name} - License: {driver.licenseNumber}
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
              title="Edit Driver"
            >
              <User className="h-5 w-5" />
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
          {/* Driver Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-4 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <div className="flex items-center mb-2">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-900'
                }`}>Driver Info</h3>
              </div>
              <p className={`text-lg font-bold ${
                isDarkMode ? 'text-blue-300' : 'text-blue-900'
              }`}>
                {driver.name}
              </p>
              <p className={`text-sm ${
                isDarkMode ? 'text-blue-400' : 'text-blue-700'
              }`}>
                {driver.experience} years experience
              </p>
            </div>

            <div className={`p-4 rounded-lg transition-colors duration-300 ${
              driver.status === 'active' 
                ? isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
                : driver.status === 'inactive'
                  ? isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  : isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
            }`}>
              <div className="flex items-center mb-2">
                <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(driver.status)}`}></div>
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Status</h3>
              </div>
              <div className="mb-2">
                {getStatusBadge(driver.status)}
              </div>
            </div>

            <div className={`p-4 rounded-lg transition-colors duration-300 ${
              isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
            }`}>
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-900'
                }`}>Rating</h3>
              </div>
              <div className="mb-2">
                {renderRating(driver.rating)}
              </div>
            </div>

            <div className={`p-4 rounded-lg transition-colors duration-300 ${
              isLicenseExpiringSoon()
                ? isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
                : isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
            }`}>
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>License</h3>
              </div>
              <p className={`text-sm font-medium ${
                isLicenseExpiringSoon()
                  ? isDarkMode ? 'text-red-400' : 'text-red-600'
                  : isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                {isLicenseExpiringSoon() ? '⚠️ Expiring Soon' : '✅ Valid'}
              </p>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Expires: {new Date(driver.licenseExpiry).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Personal Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-500 mr-3" />
                    <div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</span>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {driver.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-3" />
                    <div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</span>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {driver.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-3" />
                    <div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</span>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {driver.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                    <div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Experience</span>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {driver.experience} years
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* License Information */}
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Shield className="h-5 w-5 mr-2" />
                  License Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>License Number:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {driver.licenseNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Expiry Date:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(driver.licenseExpiry).toLocaleDateString()}
                    </span>
                  </div>
                  {isLicenseExpiringSoon() && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                    }`}>
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <p className="text-sm font-medium">
                          License expires within 30 days
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance */}
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Star className="h-5 w-5 mr-2" />
                  Performance
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Overall Rating:</span>
                    <div className="flex items-center">
                      {renderRating(driver.rating)}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Experience Level:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {driver.experience >= 10 ? 'Expert' : driver.experience >= 5 ? 'Experienced' : 'Beginner'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Name:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {driver.emergencyContact.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Phone:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {driver.emergencyContact.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Relationship:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {driver.emergencyContact.relationship}
                    </span>
                  </div>
                  <button className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}>
                    Call Emergency Contact
                  </button>
                </div>
              </div>

              {/* Vehicle Assignment */}
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Car className="h-5 w-5 mr-2" />
                  Vehicle Assignment
                </h3>
                <div className="space-y-3">
                  {driver.assignedVehicle ? (
                    <>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Assigned Vehicle:</span>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {driver.assignedVehicle}
                        </span>
                      </div>
                      <button className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}>
                        View Vehicle Details
                      </button>
                    </>
                  ) : (
                    <div className={`text-center py-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <Car className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No vehicle assigned</p>
                      <button className={`mt-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}>
                        Assign Vehicle
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`p-6 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Quick Actions</h3>
                <div className="space-y-3">
                  <button className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}>
                    <Phone className="h-4 w-4 inline mr-2" />
                    Call Driver
                  </button>
                  <button className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}>
                    <Mail className="h-4 w-4 inline mr-2" />
                    Send Email
                  </button>
                  <button className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                    driver.status === 'active'
                      ? isDarkMode 
                        ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                      : isDarkMode 
                        ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}>
                    {driver.status === 'active' ? 'Deactivate Driver' : 'Activate Driver'}
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
            <User className="h-4 w-4" />
            <span>Edit Driver</span>
          </button>
        </div>
      </div>
    </div>
  );
}