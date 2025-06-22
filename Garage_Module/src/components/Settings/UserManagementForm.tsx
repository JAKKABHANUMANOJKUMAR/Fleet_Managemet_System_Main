import React, { useState } from 'react';
import { X, User, Mail, Shield, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../../types';

interface UserManagementFormProps {
  user?: UserType | null;
  onClose: () => void;
  onSave: (userData: Partial<UserType>) => void;
  isDarkMode?: boolean;
}

export default function UserManagementForm({ user, onClose, onSave, isDarkMode = false }: UserManagementFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'operator',
    password: '',
    confirmPassword: '',
    permissions: user?.permissions || [],
    status: user?.status || 'active',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availablePermissions = [
    { id: 'dashboard', label: 'Dashboard Access', description: 'View main dashboard and analytics' },
    { id: 'vehicles', label: 'Vehicle Management', description: 'View, add, edit, and delete vehicles' },
    { id: 'drivers', label: 'Driver Management', description: 'View, add, edit, and delete drivers' },
    { id: 'services', label: 'Service Management', description: 'Manage vehicle services and maintenance' },
    { id: 'alerts', label: 'Alert Management', description: 'View and manage system alerts' },
    { id: 'inventory', label: 'Inventory Management', description: 'Manage spare parts and supplies' },
    { id: 'reports', label: 'Reports & Analytics', description: 'Generate and view reports' },
    { id: 'settings', label: 'System Settings', description: 'Access system configuration' },
    { id: 'user_management', label: 'User Management', description: 'Create and manage user accounts' },
    { id: 'backup_restore', label: 'Backup & Restore', description: 'Perform data backup and restore operations' },
  ];

  const rolePermissions = {
    admin: ['dashboard', 'vehicles', 'drivers', 'services', 'alerts', 'inventory', 'reports', 'settings', 'user_management', 'backup_restore'],
    manager: ['dashboard', 'vehicles', 'drivers', 'services', 'alerts', 'inventory', 'reports'],
    operator: ['dashboard', 'vehicles', 'alerts'],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!user && !formData.password) {
      newErrors.password = 'Password is required for new users';
    }
    if (!user && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!user && formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.permissions.length === 0) {
      newErrors.permissions = 'At least one permission must be selected';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      permissions: formData.permissions,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-assign permissions based on role
    if (name === 'role') {
      setFormData(prev => ({
        ...prev,
        permissions: rolePermissions[value as keyof typeof rolePermissions] || []
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
    
    if (errors.permissions) {
      setErrors(prev => ({ ...prev, permissions: '' }));
    }
  };

  const selectAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: availablePermissions.map(p => p.id)
    }));
  };

  const clearAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: []
    }));
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
              }`}>
                {user ? 'Edit User' : 'Create New User'}
              </h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {user ? 'Update user information and permissions' : 'Add a new user to the system'}
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
                  Full Name *
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
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.email 
                      ? 'border-red-300' 
                      : isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="operator">Operator</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
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
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Password Section */}
          {!user && (
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        errors.password 
                          ? 'border-red-300' 
                          : isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-2.5 ${
                        isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        errors.confirmPassword 
                          ? 'border-red-300' 
                          : isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-2.5 ${
                        isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Permissions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Permissions & Access Control</h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={selectAllPermissions}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={clearAllPermissions}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Role-based permission info */}
            <div className={`mb-4 p-4 rounded-lg ${
              isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <div className="flex items-center mb-2">
                <Shield className="h-4 w-4 text-blue-600 mr-2" />
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-900'
                }`}>
                  Role-based Permissions
                </span>
              </div>
              <p className={`text-sm ${
                isDarkMode ? 'text-blue-300' : 'text-blue-800'
              }`}>
                {formData.role === 'admin' && 'Administrators have full system access including user management and system settings.'}
                {formData.role === 'manager' && 'Managers can access all operational features but cannot manage users or system settings.'}
                {formData.role === 'operator' && 'Operators have limited access to view vehicles and alerts only.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availablePermissions.map((permission) => (
                <div key={permission.id} className={`p-4 border rounded-lg transition-colors duration-200 ${
                  formData.permissions.includes(permission.id)
                    ? isDarkMode 
                      ? 'border-blue-500 bg-blue-900/20' 
                      : 'border-blue-500 bg-blue-50'
                    : isDarkMode 
                      ? 'border-gray-600 bg-gray-700' 
                      : 'border-gray-200 bg-white'
                }`}>
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.id)}
                      onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                      className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {permission.label}
                      </h4>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {permission.description}
                      </p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            {errors.permissions && (
              <p className="text-red-600 text-sm mt-2">{errors.permissions}</p>
            )}
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
              <User className="h-4 w-4" />
              <span>{user ? 'Update User' : 'Create User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}