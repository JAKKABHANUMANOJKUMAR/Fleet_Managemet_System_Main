import React, { useState } from 'react';
import { Plus, Package, AlertTriangle, TrendingDown, CheckCircle, Clock, Filter } from 'lucide-react';
import DataTable from '../Common/DataTable';
import MetricCard from '../Common/MetricCard';
import RestockForm from './RestockForm';
import InventoryForm from './InventoryForm';
import BranchFilter from '../Common/BranchFilter';
import { mockInventory, mockBranches } from '../../data/mockData';
import { InventoryItem } from '../../types';

interface InventoryPageProps {
  isDarkMode?: boolean;
}

export default function InventoryPage({ isDarkMode = false }: InventoryPageProps) {
  const [inventory, setInventory] = useState(mockInventory);
  const [isRestockFormOpen, setIsRestockFormOpen] = useState(false);
  const [isInventoryFormOpen, setIsInventoryFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Mock user role and branch - in real app, this would come from auth context
  const userRole = 'admin'; // 'admin', 'manager', 'operator'
  const userBranch = '1'; // Only relevant for operators

  // Filter inventory based on selected branch and user permissions
  const getFilteredInventory = () => {
    let filteredInventory = inventory;

    // Note: For inventory, we might want to show all items to all users
    // since spare parts can be shared across branches, but we could add
    // branch-specific inventory tracking if needed
    
    // If implementing branch-specific inventory:
    // if (userRole === 'operator' && userBranch) {
    //   filteredInventory = filteredInventory.filter(item => item.branchId === userBranch);
    // } else if (selectedBranch !== 'all') {
    //   filteredInventory = filteredInventory.filter(item => item.branchId === selectedBranch);
    // }

    return filteredInventory;
  };

  const filteredInventory = getFilteredInventory();
  const lowStockItems = filteredInventory.filter(item => item.currentStock <= item.minThreshold);
  const totalValue = filteredInventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRestock = (itemId: string, quantity: number, cost: number, supplier?: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          currentStock: item.currentStock + quantity,
          cost: cost,
          supplier: supplier || item.supplier,
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
    
    setIsRestockFormOpen(false);
    setSelectedItem(null);
    showNotification('success', `Successfully restocked ${quantity} units. Total cost: Rs ${(quantity * cost).toFixed(2)}`);
  };

  const handleSaveItem = (itemData: Partial<InventoryItem>) => {
    if (editingItem) {
      // Update existing item
      setInventory(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...itemData }
          : item
      ));
      showNotification('success', 'Item updated successfully');
    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        ...itemData as InventoryItem,
        lastRestocked: new Date().toISOString().split('T')[0]
      };
      setInventory(prev => [...prev, newItem]);
      showNotification('success', 'New item added successfully');
    }
    
    setIsInventoryFormOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(prev => prev.filter(item => item.id !== itemId));
      showNotification('success', 'Item deleted successfully');
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minThreshold) {
      return { 
        status: 'low', 
        color: isDarkMode ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-100' 
      };
    } else if (item.currentStock <= item.minThreshold * 1.5) {
      return { 
        status: 'warning', 
        color: isDarkMode ? 'text-orange-400 bg-orange-900/30' : 'text-orange-600 bg-orange-100' 
      };
    }
    return { 
      status: 'good', 
      color: isDarkMode ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-100' 
    };
  };

  const columns = [
    { key: 'name', label: 'Item Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'currentStock',
      label: 'Current Stock',
      sortable: true,
      render: (value: number, row: InventoryItem) => {
        const stockStatus = getStockStatus(row);
        return (
          <div className="flex items-center space-x-2">
            <span className="font-medium">{value} {row.unit}</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
              {stockStatus.status}
            </span>
          </div>
        );
      }
    },
    {
      key: 'minThreshold',
      label: 'Min Threshold',
      sortable: true,
      render: (value: number, row: InventoryItem) => `${value} ${row.unit}`
    },
    { key: 'supplier', label: 'Supplier', sortable: true },
    {
      key: 'cost',
      label: 'Unit Cost',
      sortable: true,
      render: (value: number) => `Rs ${value.toFixed(2)}`
    },
    {
      key: 'lastRestocked',
      label: 'Last Restocked',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: InventoryItem) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedItem(row);
              setIsRestockFormOpen(true);
            }}
            className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 font-medium ${
              isDarkMode 
                ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            Restock
          </button>
          <button
            onClick={() => {
              setEditingItem(row);
              setIsInventoryFormOpen(true);
            }}
            className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 font-medium ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteItem(row.id)}
            className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 font-medium ${
              isDarkMode 
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
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
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Inventory Management</h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Track and manage spare parts and supplies</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setIsInventoryFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Branch Filter - Optional for inventory */}
      {(userRole === 'admin' || userRole === 'manager') && false && ( // Disabled for now
        <div className={`rounded-xl shadow-sm border p-4 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-4">
            <Filter className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <div className="flex items-center space-x-4">
              <BranchFilter
                selectedBranch={selectedBranch}
                onBranchChange={setSelectedBranch}
                branches={mockBranches}
                isDarkMode={isDarkMode}
                userRole={userRole}
                userBranch={userBranch}
              />
            </div>
          </div>
        </div>
      )}

      {/* Inventory Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Items"
          value={filteredInventory.length}
          icon={Package}
          color="blue"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStockItems.length}
          change={{ value: 'Action required', trend: 'down' }}
          icon={AlertTriangle}
          color="red"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="Total Value"
          value={`Rs ${totalValue.toLocaleString()}`}
          icon={TrendingDown}
          color="green"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="Categories"
          value={new Set(filteredInventory.map(item => item.category)).size}
          icon={Package}
          color="purple"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className={`border rounded-xl p-6 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-red-900/20 border-red-800' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className={`text-lg font-semibold ${
              isDarkMode ? 'text-red-400' : 'text-red-900'
            }`}>Low Stock Alert</h2>
            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
              isDarkMode 
                ? 'bg-red-900/50 text-red-300' 
                : 'bg-red-100 text-red-800'
            }`}>
              {lowStockItems.length} items
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item) => (
              <div key={item.id} className={`p-4 rounded-lg border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-red-800' 
                  : 'bg-white border-red-100'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{item.name}</h3>
                  <Clock className="h-4 w-4 text-red-500 flex-shrink-0" />
                </div>
                <p className={`text-sm mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Category: {item.category}</p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      Stock: {item.currentStock} {item.unit}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Min: {item.minThreshold} {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Rs {item.cost.toFixed(2)}/{item.unit}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{item.supplier}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setIsRestockFormOpen(true);
                  }}
                  className={`w-full px-3 py-2 text-sm rounded-lg transition-colors duration-200 font-medium ${
                    isDarkMode 
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  Restock Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredInventory}
        searchPlaceholder="Search inventory..."
        isDarkMode={isDarkMode}
      />

      {/* Restock Form */}
      {isRestockFormOpen && selectedItem && (
        <RestockForm
          item={selectedItem}
          onClose={() => {
            setIsRestockFormOpen(false);
            setSelectedItem(null);
          }}
          onRestock={handleRestock}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Inventory Form */}
      {isInventoryFormOpen && (
        <InventoryForm
          item={editingItem}
          onClose={() => {
            setIsInventoryFormOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}