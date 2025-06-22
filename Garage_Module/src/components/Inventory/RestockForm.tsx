import React, { useState } from 'react';
import { X, Package, Calendar, IndianRupee } from 'lucide-react';
import { InventoryItem } from '../../types';

interface RestockFormProps {
  item: InventoryItem;
  onClose: () => void;
  onRestock: (itemId: string, quantity: number, cost: number, supplier?: string) => void;
  isDarkMode?: boolean;
}

export default function RestockForm({ item, onClose, onRestock, isDarkMode = false }: RestockFormProps) {
  const [formData, setFormData] = useState({
    quantity: item.maxThreshold - item.currentStock,
    cost: item.cost,
    supplier: item.supplier,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    if (formData.cost <= 0) {
      newErrors.cost = 'Cost must be greater than 0';
    }
    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onRestock(item.id, formData.quantity, formData.cost, formData.supplier);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'cost' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const suggestedQuantity = item.maxThreshold - item.currentStock;
  const totalCost = formData.quantity * formData.cost;
  const newStockLevel = item.currentStock + formData.quantity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4 transition-colors duration-300 ${
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
              }`}>Restock Item</h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{item.name}</p>
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
          {/* Current Stock Info */}
          <div className={`rounded-lg p-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Current Stock Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Current Stock</p>
                <p className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{item.currentStock} {item.unit}</p>
              </div>
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Min Threshold</p>
                <p className="text-xl font-bold text-red-600">{item.minThreshold} {item.unit}</p>
              </div>
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Max Threshold</p>
                <p className="text-xl font-bold text-green-600">{item.maxThreshold} {item.unit}</p>
              </div>
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Category</p>
                <p className={`text-lg font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{item.category}</p>
              </div>
            </div>
          </div>

          {/* Restock Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Restock Quantity *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.quantity 
                      ? 'border-red-300' 
                      : isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <span className={`absolute right-3 top-2 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{item.unit}</span>
              </div>
              {errors.quantity && (
                <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
              )}
              <p className={`text-sm mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Suggested: {suggestedQuantity} {item.unit} (to reach max threshold)
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Unit Cost *
              </label>
              <div className="relative">
                <IndianRupee className={`absolute left-3 top-2.5 h-4 w-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
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
            />
            {errors.supplier && (
              <p className="text-red-600 text-sm mt-1">{errors.supplier}</p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Add any notes about this restock order..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Summary */}
          <div className={`rounded-lg p-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-900'
            }`}>Restock Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>Total Cost</p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-900'
                }`}>Rs {totalCost.toFixed(2)}</p>
              </div>
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>New Stock Level</p>
                <p className={`text-2xl font-bold ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-900'
                }`}>{newStockLevel} {item.unit}</p>
              </div>
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>Stock Status</p>
                <p className={`text-lg font-bold ${
                  newStockLevel >= item.maxThreshold ? 'text-green-600' : 
                  newStockLevel >= item.minThreshold ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {newStockLevel >= item.maxThreshold ? 'Optimal' : 
                   newStockLevel >= item.minThreshold ? 'Adequate' : 'Low'}
                </p>
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
              <span>Confirm Restock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}