import React, { useState } from 'react';
import { X, Plus, Trash2, Wrench, IndianRupee, Calendar, User, Building } from 'lucide-react';
import { ServiceRecord, ServicePart, Vehicle } from '../../types';

interface ServiceFormProps {
  service?: ServiceRecord | null;
  vehicles: Vehicle[];
  onClose: () => void;
  onSave: (serviceData: Partial<ServiceRecord>) => void;
  isDarkMode?: boolean;
}

export default function ServiceForm({ service, vehicles, onClose, onSave }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    vehicleId: service?.vehicleId || '',
    vehicleRegistration: service?.vehicleRegistration || '',
    serviceDate: service?.serviceDate || new Date().toISOString().split('T')[0],
    serviceType: service?.serviceType || 'routine',
    mileage: service?.mileage || 0,
    description: service?.description || '',
    serviceProvider: service?.serviceProvider || '',
    technician: service?.technician || '',
    status: service?.status || 'scheduled',
    laborCost: service?.costs.labor || 0,
    nextServiceDue: service?.nextServiceDue || '',
    nextServiceMileage: service?.nextServiceMileage || 0,
    notes: service?.notes || '',
  });

  const [parts, setParts] = useState<ServicePart[]>(service?.costs.parts || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Vehicle is required';
    }
    if (!formData.serviceDate) {
      newErrors.serviceDate = 'Service date is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.serviceProvider.trim()) {
      newErrors.serviceProvider = 'Service provider is required';
    }
    if (!formData.technician.trim()) {
      newErrors.technician = 'Technician is required';
    }
    if (formData.mileage <= 0) {
      newErrors.mileage = 'Mileage must be greater than 0';
    }
    if (formData.laborCost < 0) {
      newErrors.laborCost = 'Labor cost cannot be negative';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const totalPartsCost = parts.reduce((sum, part) => sum + part.totalCost, 0);
    const totalCost = formData.laborCost + totalPartsCost;

    const serviceData: Partial<ServiceRecord> = {
      ...formData,
      costs: {
        labor: formData.laborCost,
        parts: parts,
        total: totalCost
      }
    };

    onSave(serviceData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'vehicleId') {
      const selectedVehicle = vehicles.find(v => v.id === value);
      setFormData(prev => ({
        ...prev,
        vehicleId: value,
        vehicleRegistration: selectedVehicle?.registrationNumber || '',
        mileage: selectedVehicle?.mileage || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['mileage', 'laborCost', 'nextServiceMileage'].includes(name) 
          ? parseFloat(value) || 0 
          : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addPart = () => {
    const newPart: ServicePart = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
      supplier: '',
      partNumber: ''
    };
    setParts(prev => [...prev, newPart]);
  };

  const updatePart = (index: number, field: keyof ServicePart, value: string | number) => {
    setParts(prev => prev.map((part, i) => {
      if (i === index) {
        const updatedPart = { ...part, [field]: value };
        if (field === 'quantity' || field === 'unitCost') {
          updatedPart.totalCost = updatedPart.quantity * updatedPart.unitCost;
        }
        return updatedPart;
      }
      return part;
    }));
  };

  const removePart = (index: number) => {
    setParts(prev => prev.filter((_, i) => i !== index));
  };

  const totalPartsCost = parts.reduce((sum, part) => sum + part.totalCost, 0);
  const totalCost = formData.laborCost + totalPartsCost;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {service ? 'Edit Service Record' : 'Add New Service Record'}
              </h2>
              <p className="text-gray-600">
                {service ? 'Update service information and costs' : 'Create a new vehicle service record'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Service Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Service Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle *
                </label>
                <select
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.vehicleId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNumber} - {vehicle.make} {vehicle.model}
                    </option>
                  ))}
                </select>
                {errors.vehicleId && (
                  <p className="text-red-600 text-sm mt-1">{errors.vehicleId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Date *
                </label>
                <input
                  type="date"
                  name="serviceDate"
                  value={formData.serviceDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.serviceDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.serviceDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.serviceDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="routine">Routine Maintenance</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Mileage (km) *
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.mileage ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.mileage && (
                  <p className="text-red-600 text-sm mt-1">{errors.mileage}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the service work performed..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Service Provider Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Service Provider
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Provider *
                </label>
                <input
                  type="text"
                  name="serviceProvider"
                  value={formData.serviceProvider}
                  onChange={handleChange}
                  placeholder="e.g., AutoCare Center"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.serviceProvider ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.serviceProvider && (
                  <p className="text-red-600 text-sm mt-1">{errors.serviceProvider}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technician *
                </label>
                <input
                  type="text"
                  name="technician"
                  value={formData.technician}
                  onChange={handleChange}
                  placeholder="e.g., Mike Johnson"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.technician ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.technician && (
                  <p className="text-red-600 text-sm mt-1">{errors.technician}</p>
                )}
              </div>
            </div>
          </div>

          {/* Cost Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <IndianRupee className="h-5 w-5 mr-2" />
              Cost Breakdown
            </h3>
            
            {/* Labor Cost */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Labor Cost
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">Rs</span>
                <input
                  type="number"
                  name="laborCost"
                  value={formData.laborCost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.laborCost ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.laborCost && (
                <p className="text-red-600 text-sm mt-1">{errors.laborCost}</p>
              )}
            </div>

            {/* Parts */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">Parts & Materials</h4>
                <button
                  type="button"
                  onClick={addPart}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Part</span>
                </button>
              </div>

              {parts.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No parts added yet</p>
                  <button
                    type="button"
                    onClick={addPart}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Add your first part
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {parts.map((part, index) => (
                    <div key={part.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                        <div className="lg:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Part Name
                          </label>
                          <input
                            type="text"
                            value={part.name}
                            onChange={(e) => updatePart(index, 'name', e.target.value)}
                            placeholder="e.g., Engine Oil"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={part.quantity}
                            onChange={(e) => updatePart(index, 'quantity', parseFloat(e.target.value) || 0)}
                            min="1"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Unit Cost
                          </label>
                          <input
                            type="number"
                            value={part.unitCost}
                            onChange={(e) => updatePart(index, 'unitCost', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Total Cost
                          </label>
                          <div className="px-2 py-1 text-sm bg-gray-100 border border-gray-300 rounded">
                            Rs {part.totalCost.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removePart(index)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Supplier
                          </label>
                          <input
                            type="text"
                            value={part.supplier}
                            onChange={(e) => updatePart(index, 'supplier', e.target.value)}
                            placeholder="e.g., AutoParts Plus"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Part Number
                          </label>
                          <input
                            type="text"
                            value={part.partNumber}
                            onChange={(e) => updatePart(index, 'partNumber', e.target.value)}
                            placeholder="e.g., EO-5W30-5L"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cost Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-blue-900 mb-3">Cost Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-blue-700">Labor Cost</p>
                  <p className="text-xl font-bold text-blue-900">Rs {formData.laborCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Parts Cost</p>
                  <p className="text-xl font-bold text-blue-900">Rs {totalPartsCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Total Cost</p>
                  <p className="text-2xl font-bold text-blue-900">Rs {totalCost.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Service Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Service Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Service Due Date
                </label>
                <input
                  type="date"
                  name="nextServiceDue"
                  value={formData.nextServiceDue}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Service Mileage (km)
                </label>
                <input
                  type="number"
                  name="nextServiceMileage"
                  value={formData.nextServiceMileage}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Add any additional notes about the service..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Wrench className="h-4 w-4" />
              <span>{service ? 'Update Service' : 'Add Service'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}