import React from 'react';
import { X, Calendar, User, Building, IndianRupee, Wrench, FileText, Download, Edit } from 'lucide-react';
import { ServiceRecord } from '../../types';

interface ServiceDetailModalProps {
  service: ServiceRecord;
  onClose: () => void;
  onEdit: () => void;
  isDarkMode?: boolean;
}

export default function ServiceDetailModal({ service, onClose, onEdit, isDarkMode }: ServiceDetailModalProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getServiceTypeBadge = (type: string) => {
    const styles = {
      routine: 'bg-blue-100 text-blue-800',
      repair: 'bg-orange-100 text-orange-800',
      inspection: 'bg-purple-100 text-purple-800',
      emergency: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles[type as keyof typeof styles]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Service Record Details</h2>
              <p className="text-gray-600">{service.vehicleRegistration} - {service.serviceDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit Service"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Service Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">Service Date</h3>
              </div>
              <p className="text-lg font-bold text-blue-900">
                {new Date(service.serviceDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-blue-700">
                Vehicle Mileage at Service: {service.mileage.toLocaleString()} km
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <IndianRupee className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-green-900">Total Cost</h3>
              </div>
              <p className="text-lg font-bold text-green-900">
                Rs {service.costs.total.toFixed(2)}
              </p>
              <p className="text-sm text-green-700">
                Labor: Rs {service.costs.labor.toFixed(2)}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Wrench className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-900">Service Type</h3>
              </div>
              <div className="mb-2">
                {getServiceTypeBadge(service.serviceType)}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Status</h3>
              </div>
              <div className="mb-2">
                {getStatusBadge(service.status)}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Vehicle Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration:</span>
                    <span className="font-medium">{service.vehicleRegistration}</span>
                  </div>
                  <div className="flex justify-between">
                    <p className={`text-gray-500 ${
                      isDarkMode ? 'text-gray-400' : ''
                    }`}>Vehicle Mileage</p>
                    <p className={`font-semibold text-lg ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {service.mileage.toLocaleString()} km
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Provider */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Service Provider
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium">{service.serviceProvider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Technician:</span>
                    <span className="font-medium">{service.technician}</span>
                  </div>
                </div>
              </div>

              {/* Next Service */}
              {(service.nextServiceDue || service.nextServiceMileage) && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Service Due</h3>
                  <div className="space-y-2">
                    {service.nextServiceDue && (
                      <div className="flex justify-between">
                        <span className="text-blue-700">Date:</span>
                        <span className="font-medium text-blue-900">
                          {new Date(service.nextServiceDue).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {service.nextServiceMileage && (
                      <div className="flex justify-between">
                        <span className="text-blue-700">Next Service Mileage:</span>
                        <span className="font-medium text-blue-900">
                          {service.nextServiceMileage.toLocaleString()} km
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Service Description */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Description</h3>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2" />
                  Cost Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Labor Cost:</span>
                    <span className="font-bold text-green-900">Rs {service.costs.labor.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Parts Cost:</span>
                    <span className="font-bold text-green-900">
                      Rs {service.costs.parts.reduce((sum, part) => sum + part.totalCost, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-green-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-green-800">Total Cost:</span>
                      <span className="text-xl font-bold text-green-900">Rs {service.costs.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {service.notes && (
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4">Notes</h3>
                  <p className="text-yellow-800 leading-relaxed">{service.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Parts Used */}
          {service.costs.parts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Parts & Materials Used</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Part Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Part Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Cost
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cost
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {service.costs.parts.map((part, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{part.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{part.partNumber || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{part.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">Rs {part.unitCost.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Rs {part.totalCost.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{part.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Attachments */}
          {service.attachments && service.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.attachments.map((attachment, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{attachment}</p>
                        <p className="text-xs text-gray-500">Document</p>
                      </div>
                    </div>
                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Service</span>
          </button>
        </div>
      </div>
    </div>
  );
}