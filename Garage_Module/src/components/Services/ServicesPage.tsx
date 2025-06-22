import React, { useState } from 'react';
import { Plus, Wrench, Calendar, IndianRupee, Clock, CheckCircle, AlertTriangle, Eye, Filter } from 'lucide-react';
import DataTable from '../Common/DataTable';
import MetricCard from '../Common/MetricCard';
import ServiceForm from './ServiceForm';
import ServiceDetailModal from './ServiceDetailModal';
import BranchFilter from '../Common/BranchFilter';
import { mockServiceRecords, mockVehicles, mockBranches } from '../../data/mockData';
import { ServiceRecord } from '../../types';

interface ServicesPageProps {
  isDarkMode?: boolean;
}

export default function ServicesPage({ isDarkMode = false }: ServicesPageProps) {
  const [services, setServices] = useState(mockServiceRecords);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Mock user role and branch - in real app, this would come from auth context
  const userRole = 'admin'; // 'admin', 'manager', 'operator'
  const userBranch = '1'; // Only relevant for operators

  // Filter services based on selected branch and user permissions
  const getFilteredServices = () => {
    let filteredServices = services;

    // If user is operator, restrict to their branch only
    if ((userRole as string) === 'operator' && userBranch) {
      filteredServices = filteredServices.filter(s => s.branchId === userBranch);
    } else if (selectedBranch !== 'all') {
      // For admin/manager, filter by selected branch
      filteredServices = filteredServices.filter(s => s.branchId === selectedBranch);
    }

    return filteredServices;
  };

  const filteredServices = getFilteredServices();

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSaveService = (serviceData: Partial<ServiceRecord>) => {
    if (editingService) {
      // Update existing service
      setServices(prev => prev.map(service => 
        service.id === editingService.id 
          ? { ...service, ...serviceData }
          : service
      ));
      showNotification('success', 'Service record updated successfully');
    } else {
      // Add new service
      const newService: ServiceRecord = {
        id: Date.now().toString(),
        ...serviceData as ServiceRecord,
      };
      setServices(prev => [...prev, newService]);
      showNotification('success', 'New service record added successfully');
    }
    
    setIsFormOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      setServices(prev => prev.filter(service => service.id !== serviceId));
      showNotification('success', 'Service record deleted successfully');
    }
  };

  const handleViewDetails = (service: ServiceRecord) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      scheduled: isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800',
      'in-progress': isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      completed: isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
      cancelled: isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getServiceTypeBadge = (type: string) => {
    const styles = {
      routine: isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800',
      repair: isDarkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-800',
      inspection: isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-800',
      emergency: isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[type as keyof typeof styles]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getBranchName = (vehicleId: string) => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    if (!vehicle || !vehicle.branchId) return 'Unassigned';
    const branch = mockBranches.find(b => b.id === vehicle.branchId);
    return branch ? branch.name : 'Unknown';
  };

  // Calculate metrics
  const totalServices = filteredServices.length;
  const completedServices = filteredServices.filter(s => s.status === 'completed').length;
  const inProgressServices = filteredServices.filter(s => s.status === 'in-progress').length;
  const totalCost = filteredServices.reduce((sum, service) => sum + service.costs.total, 0);
  const avgCostPerService = totalServices > 0 ? totalCost / totalServices : 0;

  const columns = [
    { 
      key: 'vehicleRegistration', 
      label: 'Vehicle', 
      sortable: true,
      render: (value: string, row: ServiceRecord) => (
        <div>
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {getBranchName(row.vehicleId)} • {row.mileage.toLocaleString()} km
          </div>
        </div>
      )
    },
    {
      key: 'serviceDate',
      label: 'Service Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'serviceType',
      label: 'Type',
      sortable: true,
      render: (value: string) => getServiceTypeBadge(value)
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'serviceProvider',
      label: 'Service Provider',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'costs',
      label: 'Total Cost',
      sortable: true,
      render: (value: any) => (
        <div className="text-right">
          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Rs {value.total.toFixed(2)}
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Labor: Rs {value.labor.toFixed(2)}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: ServiceRecord) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetails(row)}
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
              setEditingService(row);
              setIsFormOpen(true);
            }}
            className={`p-1 transition-colors duration-200 ${
              isDarkMode 
                ? 'text-green-400 hover:text-green-300' 
                : 'text-green-600 hover:text-green-800'
            }`}
            title="Edit Service"
          >
            <Wrench className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteService(row.id)}
            className={`p-1 transition-colors duration-200 ${
              isDarkMode 
                ? 'text-red-400 hover:text-red-300' 
                : 'text-red-600 hover:text-red-800'
            }`}
            title="Delete Service"
          >
            <AlertTriangle className="h-4 w-4" />
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
          }`}>Vehicle Services</h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Track and manage vehicle maintenance and repair services</p>
        </div>
        <button 
          onClick={() => {
            setEditingService(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Branch Filter */}
      {(userRole === 'admin' || userRole === 'manager') && (
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

      {/* Service Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Services"
          value={totalServices}
          icon={Wrench}
          color="blue"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="Completed"
          value={completedServices}
          icon={CheckCircle}
          color="green"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="In Progress"
          value={inProgressServices}
          icon={Clock}
          color="yellow"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
        <MetricCard
          title="Average Cost"
          value={`Rs ${avgCostPerService.toFixed(2)}`}
          icon="Rs"
          color="purple"
          isDarkMode={isDarkMode}
          className="hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Upcoming Services Alert */}
      {filteredServices.filter(s => s.status === 'scheduled').length > 0 && (
        <div className={`border rounded-xl p-6 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-blue-900/20 border-blue-800' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className={`text-lg font-semibold ${
              isDarkMode ? 'text-blue-400' : 'text-blue-900'
            }`}>Upcoming Services</h2>
            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
              isDarkMode 
                ? 'bg-blue-900/50 text-blue-300' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {filteredServices.filter(s => s.status === 'scheduled').length} scheduled
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.filter(s => s.status === 'scheduled').map((service) => (
              <div key={service.id} className={`p-4 rounded-lg border transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-gray-800 border-blue-800' 
                  : 'bg-white border-blue-100'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{service.vehicleRegistration}</h3>
                  <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                </div>
                <p className={`text-sm mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>{service.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {new Date(service.serviceDate).toLocaleDateString()}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {service.serviceProvider}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Rs {service.costs.total.toFixed(2)}
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{service.serviceType}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(service)}
                  className={`w-full px-3 py-2 text-sm rounded-lg transition-colors duration-200 font-medium ${
                    isDarkMode 
                      ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredServices}
        searchPlaceholder="Search services..."
        onRowClick={handleViewDetails}
        isDarkMode={isDarkMode}
      />

      {/* Service Form */}
      {isFormOpen && (
        <ServiceForm
          service={editingService}
          vehicles={mockVehicles}
          onClose={() => {
            setIsFormOpen(false);
            setEditingService(null);
          }}
          onSave={handleSaveService}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Service Detail Modal */}
      {isDetailModalOpen && selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedService(null);
          }}
          onEdit={() => {
            setEditingService(selectedService);
            setIsDetailModalOpen(false);
            setIsFormOpen(true);
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}