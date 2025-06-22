import React, { useState } from 'react';
import { X, Package, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '../../types';

interface InventoryFormProps {
  item?: InventoryItem | null;
  onClose: () => void;
  onSave: (itemData: Partial<InventoryItem>) => void;
  isDarkMode?: boolean;
}

export default function InventoryForm({ item, onClose, onSave, isDarkMode = false }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || '',
    currentStock: item?.currentStock || 0,
    minThreshold: item?.minThreshold || 0,
    maxThreshold: item?.maxThreshold || 0,
    unit: item?.unit || '',
    supplier: item?.supplier || '',
    cost: item?.cost || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Lubricants',
    'Brake System',
    'Engine Components',
    'Electrical',
    'Tires',
    'Filters',
    'Belts & Hoses',
    'Transmission',
    'Suspension',
    'Body Parts',
    'Tools',
    'Cleaning Supplies',
    'Other'
  ];

  const units = [
    'pieces',
    'liters',
    'gallons',
    'sets',
    'pairs',
    'meters',
    'feet',
    'kilograms',
    'pounds',
    'boxes',
    'bottles',
    'tubes'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
    }
    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }
    if (formData.currentStock < 0) {
      newErrors.currentStock = 'Current stock cannot be negative';
    }
    if (formData.minThreshold <= 0) {
      newErrors.minThreshold = 'Minimum threshold must be greater than 0';
    }
    if (formData.maxThreshold <= formData.minThreshold) {
      newErrors.maxThreshold = 'Maximum threshold must be greater than minimum threshold';
    }
    if (formData.cost <= 0) {
      newErrors.cost = 'Cost must be greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      lastRestocked: item?.lastRestocked || new Date().toISOString().split('T')[0]
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['currentStock', 'minThreshold', 'maxThreshold', 'cost'].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getStockStatus = () => {
    if (formData.currentStock <= formData.minThreshold) {
      return { status: 'Critical', color: 'text-red-600', icon: AlertTriangle };
    } else if (formData.currentStock <= formData.minThreshold * 1.5) {
      return { status: 'Low', color: 'text-orange-600', icon: AlertTriangle };
    }
    return { status: 'Good', color: 'text-green-600', icon: Package };
  };

  const stockStatus = getStockStatus();
  const StatusIcon = stockStatus.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b transition-colors duration-300 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {item ? 'Update item information and stock levels' : 'Add a new item to your inventory'}
              </p>
            </div>
          </div>
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
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.name 
                      ? 'border-red-300' 
                      : isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Engine Oil (5W-30)"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.category 
                      ? 'border-red-300' 
                      : isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.unit 
                      ? 'border-red-300' 
                      : isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select a unit</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                {errors.unit && (
                  <p className="text-red-600 text-sm mt-1">{errors.unit}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Supplier *
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.supplier 
                      ? 'border-red-300' 
                      : isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., AutoParts Plus"
                />
                {errors.supplier && (
                  <p className="text-red-600 text-sm mt-1">{errors.supplier}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Stock Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Current Stock
                </label>
                <input
                  type="number"
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.currentStock 
                      ? 'border-red-300' 
                      : isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                {errors.currentStock && (
                  <p className="text-red-600 text-sm mt-1">{errors.currentStock}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Minimum Threshold *
                </label>
                <input
                  type="number"
                  name="minThreshold"
                  value={formData.minThreshold}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.minThreshold 
                      ? 'border-red-300' 
                      : isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                {errors.minThreshold && (
                  <p className="text-red-600 text-sm mt-1">{errors.minThreshold}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Maximum Threshold *
                </label>
                <input
                  type="number"
                  name="maxThreshold"
                  value={formData.maxThreshold}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.maxThreshold 
                      ? 'border-red-300' 
                      : isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                {errors.maxThreshold && (
                  <p className="text-red-600 text-sm mt-1">{errors.maxThreshold}</p>
                )}
              </div>
            </div>

            {/* Stock Status Indicator */}
            {formData.minThreshold > 0 && (
              <div className={`mt-4 p-4 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-2">
                  <StatusIcon className={`h-5 w-5 ${stockStatus.color}`} />
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Stock Status:</span>
                  <span className={`text-sm font-bold ${stockStatus.color}`}>
                    {stockStatus.status}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Current: {formData.currentStock} {formData.unit} | 
                  Min: {formData.minThreshold} {formData.unit} | 
                  Max: {formData.maxThreshold} {formData.unit}
                </p>
              </div>
            )}
          </div>

          {/* Cost Information */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Cost Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Unit Cost *
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Rs</span>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.cost 
                        ? 'border-red-300' 
                        : isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                {errors.cost && (
                  <p className="text-red-600 text-sm mt-1">{errors.cost}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Total Value
                </label>
                <div className={`px-3 py-2 border rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-100 border-gray-300'
                }`}>
                  <span className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ${(formData.currentStock * formData.cost).toFixed(2)}
                  </span>
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
              className={`px-6 py-2 border rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 border-gray-600 hover:bg-gray-700' 
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Package className="h-4 w-4" />
              <span>{item ? 'Update Item' : 'Add Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}