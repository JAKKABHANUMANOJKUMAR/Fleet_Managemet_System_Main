import React, { useState } from 'react';
import { Users, Bell, Globe, Shield, Palette, Database, Plus, Edit, Trash2, Eye } from 'lucide-react';
import UserManagementForm from './UserManagementForm';
import { mockUsers } from '../../data/mockData';
import { User } from '../../types';

interface SettingsPageProps {
  isDarkMode?: boolean;
}

export default function SettingsPage({ isDarkMode = false }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(mockUsers);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData }
          : user
      ));
      showNotification('success', 'User updated successfully');
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        ...userData as User,
        lastLogin: new Date().toISOString(),
      };
      setUsers(prev => [...prev, newUser]);
      showNotification('success', 'New user created successfully');
    }
    
    setIsUserFormOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      showNotification('success', 'User deleted successfully');
    }
  };

  const tabs = [
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'regional', name: 'Regional Settings', icon: Globe },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'data', name: 'Data & Backup', icon: Database },
  ];

  return (
    <div className="p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
          notification.type === 'success' 
            ? isDarkMode 
              ? 'bg-green-900/30 text-green-400 border border-green-800' 
              : 'bg-green-100 text-green-800 border border-green-200'
            : isDarkMode 
              ? 'bg-red-900/30 text-red-400 border border-red-800' 
              : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className={`ml-2 hover:opacity-70 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            ×
          </button>
        </div>
      )}

      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Settings</h1>
        <p className={`mt-2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>Manage application settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className={`rounded-xl shadow-sm border p-2 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            {activeTab === 'users' && <UserManagement isDarkMode={isDarkMode} users={users} onSaveUser={handleSaveUser} onDeleteUser={handleDeleteUser} setIsUserFormOpen={setIsUserFormOpen} setEditingUser={setEditingUser} />}
            {activeTab === 'notifications' && <NotificationSettings isDarkMode={isDarkMode} />}
            {activeTab === 'regional' && <RegionalSettings isDarkMode={isDarkMode} />}
            {activeTab === 'security' && <SecuritySettings isDarkMode={isDarkMode} />}
            {activeTab === 'appearance' && <AppearanceSettings isDarkMode={isDarkMode} />}
            {activeTab === 'data' && <DataBackupSettings isDarkMode={isDarkMode} />}
          </div>
        </div>
      </div>

      {/* User Form */}
      {isUserFormOpen && (
        <UserManagementForm
          user={editingUser}
          onClose={() => {
            setIsUserFormOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

function UserManagement({ 
  isDarkMode, 
  users, 
  onSaveUser, 
  onDeleteUser, 
  setIsUserFormOpen, 
  setEditingUser 
}: { 
  isDarkMode: boolean;
  users: User[];
  onSaveUser: (userData: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  setIsUserFormOpen: (open: boolean) => void;
  setEditingUser: (user: User | null) => void;
}) {
  const getRoleBadge = (role: string) => {
    const styles = {
      admin: isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800',
      manager: isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800',
      operator: isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[role as keyof typeof styles]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
      inactive: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>User Management</h2>
        <button
          onClick={() => {
            setEditingUser(null);
            setIsUserFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>
      
      {/* Users Table */}
      <div className={`rounded-lg border overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'border-gray-600' : 'border-gray-200'
      }`}>
        <table className="w-full">
          <thead className={`transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>User</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>Role</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>Status</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>Last Login</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>Permissions</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 divide-gray-700' 
              : 'bg-white divide-gray-200'
          }`}>
            {users.map((user) => (
              <tr key={user.id} className={`transition-colors duration-200 ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-600">
                      <span className="text-sm font-medium text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className={`text-sm font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {user.name}
                      </div>
                      <div className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.status)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  {new Date(user.lastLogin).toLocaleDateString()}
                </td>
                <td className={`px-6 py-4 text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  <div className="max-w-xs">
                    <span className="text-xs">
                      {user.permissions.length} permission{user.permissions.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => console.log('View user', user.id)}
                      className={`p-1 transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-800'
                      }`}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setIsUserFormOpen(true);
                      }}
                      className={`p-1 transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-green-400 hover:text-green-300' 
                          : 'text-green-600 hover:text-green-800'
                      }`}
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className={`p-1 transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-red-600 hover:text-red-800'
                      }`}
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permissions Overview */}
      <div>
        <h3 className={`text-lg font-medium mb-4 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>Role Permissions Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              role: 'Administrator', 
              description: 'Full system access including user management, system settings, and all operational features.',
              permissions: ['All Permissions', 'User Management', 'System Settings', 'Data Backup']
            },
            { 
              role: 'Manager', 
              description: 'Access to all operational features including vehicles, drivers, services, and reports.',
              permissions: ['Dashboard', 'Vehicles', 'Drivers', 'Services', 'Alerts', 'Inventory', 'Reports']
            },
            { 
              role: 'Operator', 
              description: 'Limited access to view vehicles and alerts. Cannot modify data or access sensitive features.',
              permissions: ['Dashboard', 'View Vehicles', 'View Alerts']
            }
          ].map((roleInfo) => (
            <div key={roleInfo.role} className={`p-4 border rounded-lg transition-colors duration-300 ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700' 
                : 'border-gray-200 bg-white'
            }`}>
              <h4 className={`font-medium mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{roleInfo.role}</h4>
              <p className={`text-sm mb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {roleInfo.description}
              </p>
              <div className="space-y-1">
                {roleInfo.permissions.map((permission, index) => (
                  <div key={index} className={`text-xs px-2 py-1 rounded ${
                    isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {permission}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationSettings({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>Notification Settings</h2>
      
      <div className="space-y-4">
        {[
          { title: 'Email Notifications', description: 'Receive email alerts for critical events' },
          { title: 'SMS Notifications', description: 'Get SMS alerts for urgent issues' },
          { title: 'Browser Notifications', description: 'Show browser notifications' },
          { title: 'Maintenance Reminders', description: 'Notify before scheduled maintenance' },
          { title: 'License Expiry Alerts', description: 'Alert when licenses are expiring' },
        ].map((setting) => (
          <div key={setting.title} className={`flex items-center justify-between p-4 border rounded-lg transition-colors duration-300 ${
            isDarkMode 
              ? 'border-gray-600 bg-gray-700' 
              : 'border-gray-200 bg-white'
          }`}>
            <div>
              <h3 className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{setting.title}</h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>{setting.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionalSettings({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>Regional Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Language</label>
          <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Timezone</label>
          <div className={`px-3 py-2 border rounded-lg ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
            UTC+05:30 (India)
          </div>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Date Format</label>
          <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Currency</label>
          <div className={`px-3 py-2 border rounded-lg ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
            Rupees (Rs)
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>Security Settings</h2>
      
      <div className="space-y-4">
        <div className={`p-4 border rounded-lg transition-colors duration-300 ${
          isDarkMode 
            ? 'border-gray-600 bg-gray-700' 
            : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`font-medium mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Password Policy</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Require minimum 8 characters</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Require uppercase and lowercase letters</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Require numbers and special characters</span>
            </label>
          </div>
        </div>
        
        <div className={`p-4 border rounded-lg transition-colors duration-300 ${
          isDarkMode 
            ? 'border-gray-600 bg-gray-700' 
            : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`font-medium mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Session Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Session Timeout</label>
              <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-600 border-gray-500 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
                <option>4 hours</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Max Login Attempts</label>
              <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-600 border-gray-500 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}>
                <option>3</option>
                <option>5</option>
                <option>10</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>Appearance Settings</h2>
      
      <div className="space-y-4">
        <div className={`p-4 border rounded-lg transition-colors duration-300 ${
          isDarkMode 
            ? 'border-gray-600 bg-gray-700' 
            : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`font-medium mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Theme</h3>
          <div className="grid grid-cols-3 gap-4">
            {['Light', 'Dark', 'Auto'].map((theme) => (
              <label key={theme} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                isDarkMode 
                  ? 'border-gray-600 hover:bg-gray-600' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="theme"
                  value={theme.toLowerCase()}
                  className="mr-3"
                  defaultChecked={theme === (isDarkMode ? 'Dark' : 'Light')}
                />
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{theme}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className={`p-4 border rounded-lg transition-colors duration-300 ${
          isDarkMode 
            ? 'border-gray-600 bg-gray-700' 
            : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`font-medium mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Display Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Compact mode</span>
              <input type="checkbox" className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Show sidebar icons only</span>
              <input type="checkbox" className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>High contrast mode</span>
              <input type="checkbox" className="toggle" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataBackupSettings({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>Data & Backup Settings</h2>
      
      <div className="space-y-4">
        <div className={`p-4 border rounded-lg transition-colors duration-300 ${
          isDarkMode 
            ? 'border-gray-600 bg-gray-700' 
            : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`font-medium mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Automatic Backups</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Enable automatic backups</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Backup Frequency</label>
                <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Retention Period</label>
                <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}>
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>1 year</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-4 border rounded-lg transition-colors duration-300 ${
          isDarkMode 
            ? 'border-gray-600 bg-gray-700' 
            : 'border-gray-200 bg-white'
        }`}>
          <h3 className={`font-medium mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Data Export</h3>
          <div className="space-y-3">
            <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Export All Data
            </button>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Export all fleet data in CSV format</p>
          </div>
        </div>
      </div>
    </div>
  );
}