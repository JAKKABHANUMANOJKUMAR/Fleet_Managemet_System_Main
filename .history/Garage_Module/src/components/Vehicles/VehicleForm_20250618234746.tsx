import React, { useState } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onClose: () => void;
  onSave: (vehicle: Partial<Vehicle>) => void;
  isDarkMode?: boolean;
}

export default function VehicleForm({ vehicle, onClose, onSave, isDarkMode = false }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    registrationNumber: vehicle?.registrationNumber || '',
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    status: vehicle?.status || 'active',
    mileage: vehicle?.mileage || 0,
    lastService: vehicle?.lastService || '',
    nextService: vehicle?.nextService || '',
    insuranceProvider: vehicle?.insurance?.provider || '',
    policyNumber: vehicle?.insurance?.policyNumber || '',
    insuranceExpiry: vehicle?.insurance?.expiryDate || '',
    tyres: {
      tyre1: {
        number: vehicle?.tyres?.tyre1?.number || '',
        photo: vehicle?.tyres?.tyre1?.photo || undefined
      },
      tyre2: {
        number: vehicle?.tyres?.tyre2?.number || '',
        photo: vehicle?.tyres?.tyre2?.photo || undefined
      },
      tyre3: {
        number: vehicle?.tyres?.tyre3?.number || '',
        photo: vehicle?.tyres?.tyre3?.photo || undefined
      },
      tyre4: {
        number: vehicle?.tyres?.tyre4?.number || '',
        photo: vehicle?.tyres?.tyre4?.photo || undefined
      },
      tyre5: {
        number: vehicle?.tyres?.tyre5?.number || '',
        photo: vehicle?.tyres?.tyre5?.photo || undefined
      },
      tyre6: {
        number: vehicle?.tyres?.tyre6?.number || '',
        photo: vehicle?.tyres?.tyre6?.photo || undefined
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      insurance: {
        provider: formData.insuranceProvider,
        policyNumber: formData.policyNumber,
        expiryDate: formData.insuranceExpiry,
      },
      tyres: formData.tyres
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    
    if (name.includes('tyres.')) {
      const [, tyreKey, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        tyres: {
          ...prev.tyres,
          [tyreKey]: {
            ...prev.tyres[tyreKey as keyof typeof prev.tyres],
            [field]: field === 'photo' ? (files?.[0] || undefined) : value
          }
        }
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Registration Number *
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
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
                }`}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Make *
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
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
                }`}>
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
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
                }`}>
                  Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
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
                }`}>
                  Current Mileage (km)
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Maintenance Information */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Maintenance Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Last Service Date
                </label>
                <input
                  type="date"
                  name="lastService"
                  value={formData.lastService}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Next Service Date
                </label>
                <input
                  type="date"
                  name="nextService"
                  value={formData.nextService}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Insurance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Insurance Provider
                </label>
                <input
                  type="text"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
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
                }`}>
                  Policy Number
                </label>
                <input
                  type="text"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleChange}
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
                }`}>
                  Insurance Expiry
                </label>
                <input
                  type="date"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Documents & Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Vehicle Documents
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-blue-500 bg-gray-700' 
                    : 'border-gray-300 hover:border-blue-500 bg-gray-50'
                }`}>
                  <Upload className={`h-8 w-8 mx-auto mb-2 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Upload registration, permits, and other documents
                  </p>
                  <input type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
                  <button type="button" className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Choose Files
                  </button>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Vehicle Photos
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-blue-500 bg-gray-700' 
                    : 'border-gray-300 hover:border-blue-500 bg-gray-50'
                }`}>
                  <Camera className={`h-8 w-8 mx-auto mb-2 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Upload vehicle photos
                  </p>
                  <input type="file" className="hidden" multiple accept=".jpg,.jpeg,.png" />
                  <button type="button" className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Choose Photos
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tyres Details */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Tyres Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tyre 1 */}
              <div className={`p-4 border rounded-lg ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <h4 className={`text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Tyre 1</h4>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tyre Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tyres.tyre1.number"
                      value={formData.tyres.tyre1.number}
                      onChange={handleChange}
                      placeholder="Enter tyre number"
                      required
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tyre Photo
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors duration-200 ${
                      isDarkMode 
                        ? 'border-gray-500 hover:border-blue-500 bg-gray-600' 
                        : 'border-gray-300 hover:border-blue-500 bg-white'
                    }`}>
                      <input
                        type="file"
                        name="tyres.tyre1.photo"
                        onChange={handleChange}
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        id="tyre1-photo"
                      />
                      <label htmlFor="tyre1-photo" className="cursor-pointer">
                        <Camera className={`h-5 w-5 mx-auto mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Choose Photo
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tyre 2 */}
              <div className={`p-4 border rounded-lg ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <h4 className={`text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Tyre 2</h4>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tyre Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tyres.tyre2.number"
                      value={formData.tyres.tyre2.number}
                      onChange={handleChange}
                      placeholder="Enter tyre number"
                      required
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tyre Photo
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors duration-200 ${
                      isDarkMode 
                        ? 'border-gray-500 hover:border-blue-500 bg-gray-600' 
                        : 'border-gray-300 hover:border-blue-500 bg-white'
                    }`}>
                      <input
                        type="file"
                        name="tyres.tyre2.photo"
                        onChange={handleChange}
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        id="tyre2-photo"
                      />
                      <label htmlFor="tyre2-photo" className="cursor-pointer">
                        <Camera className={`h-5 w-5 mx-auto mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Choose Photo
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tyre 3 */}
              <div className={`p-4 border rounded-lg ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <h4 className={`text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Tyre 3</h4>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tyre Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tyres.tyre3.number"
                      value={formData.tyres.tyre3.number}
                      onChange={handleChange}
                      placeholder="Enter tyre number"
                      required
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tyre Photo
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors duration-200 ${
                      isDarkMode 
                        ? 'border-gray-500 hover:border-blue-500 bg-gray-600' 
                        : 'border-gray-300 hover:border-blue-500 bg-white'
                    }`}>
                      <input
                        type="file"
                        name="tyres.tyre3.photo"
                        onChange={handleChange}
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        id="tyre3-photo"
                      />
                      <label htmlFor="tyre3-photo" className="cursor-pointer">
                        <Camera className={`h-5 w-5 mx-auto mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Choose Photo
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tyre 4 */}
              <div className={`p-4 border rounded-lg ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <h4 className={`text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Tyre 4</h4>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tyre Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tyres.tyre4.number"
                      value={formData.tyres.tyre4.number}
                      onChange={handleChange}
                      placeholder="Enter tyre number"
                      required
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tyre Photo
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors duration-200 ${
                      isDarkMode 
                        ? 'border-gray-500 hover:border-blue-500 bg-gray-600' 
                        : 'border-gray-300 hover:border-blue-500 bg-white'
                    }`}>
                      <input
                        type="file"
                        name="tyres.tyre4.photo"
                        onChange={handleChange}
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        id="tyre4-photo"
                      />
                      <label htmlFor="tyre4-photo" className="cursor-pointer">
                        <Camera className={`h-5 w-5 mx-auto mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Choose Photo
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tyre 5 */}
              <div className={`p-4 border rounded-lg ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <h4 className={`text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Tyre 5</h4>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tyre Number
                    </label>
                    <input
                      type="text"
                      name="tyres.tyre5.number"
                      value={formData.tyres.tyre5.number}
                      onChange={handleChange}
                      placeholder="Enter tyre number"
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tyre Photo
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors duration-200 ${
                      isDarkMode 
                        ? 'border-gray-500 hover:border-blue-500 bg-gray-600' 
                        : 'border-gray-300 hover:border-blue-500 bg-white'
                    }`}>
                      <input
                        type="file"
                        name="tyres.tyre5.photo"
                        onChange={handleChange}
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        id="tyre5-photo"
                      />
                      <label htmlFor="tyre5-photo" className="cursor-pointer">
                        <Camera className={`h-5 w-5 mx-auto mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Choose Photo
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tyre 6 */}
              <div className={`p-4 border rounded-lg ${
                isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <h4 className={`text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Tyre 6</h4>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tyre Number
                    </label>
                    <input
                      type="text"
                      name="tyres.tyre6.number"
                      value={formData.tyres.tyre6.number}
                      onChange={handleChange}
                      placeholder="Enter tyre number"
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tyre Photo
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors duration-200 ${
                      isDarkMode 
                        ? 'border-gray-500 hover:border-blue-500 bg-gray-600' 
                        : 'border-gray-300 hover:border-blue-500 bg-white'
                    }`}>
                      <input
                        type="file"
                        name="tyres.tyre6.photo"
                        onChange={handleChange}
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        id="tyre6-photo"
                      />
                      <label htmlFor="tyre6-photo" className="cursor-pointer">
                        <Camera className={`h-5 w-5 mx-auto mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Choose Photo
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className={`flex items-center justify-end space-x-4 pt-6 border-t transition-colors duration-300 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}