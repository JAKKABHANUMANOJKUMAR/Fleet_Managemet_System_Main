import React from 'react';
import MetricCard from '../Common/MetricCard';
import { Truck, Gauge, Users, Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockServiceRecords } from '../../data/mockData';

interface FleetOverviewProps {
  isDarkMode?: boolean;
  vehicles: any[];
  drivers: any[];
  alerts: any[];
  selectedBranch: string;
}

export default function FleetOverview({ isDarkMode = false, vehicles, drivers, alerts, selectedBranch }: FleetOverviewProps) {
  const totalMileage = vehicles.reduce((sum, v) => sum + v.mileage, 0);
  const avgMileage = vehicles.length > 0 ? Math.round(totalMileage / vehicles.length) : 0;

  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const inMaintenance = vehicles.filter(v => v.status === 'maintenance').length;
  const retiredVehicles = vehicles.filter(v => v.status === 'retired').length;

  const last30DaysDeliveries = mockServiceRecords.filter(s =>
    new Date(s.serviceDate) > new Date(new Date().setDate(new Date().getDate() - 30))
  ).length;

  const onTimeDeliveryRate = 95;

  return (
    <div className={`p-6 rounded-xl shadow-sm border ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h2 className={`text-xl font-semibold mb-6 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>Fleet Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Vehicles"
          value={vehicles.length}
          icon={Truck}
          color="blue"
          isDarkMode={isDarkMode}
        />
        <MetricCard
          title="Average Mileage"
          value={`${avgMileage.toLocaleString()} km`}
          icon={Gauge}
          color="green"
          isDarkMode={isDarkMode}
        />
        <MetricCard
          title="Active Drivers"
          value={drivers.filter((d: any) => d.status === 'active').length}
          icon={Users}
          color="yellow"
          isDarkMode={isDarkMode}
        />
        <MetricCard
          title="Total Deliveries (30 Days)"
          value={last30DaysDeliveries}
          icon={Package}
          color="purple"
          isDarkMode={isDarkMode}
        />
        <MetricCard
          title="On-Time Delivery Rate"
          value={`${onTimeDeliveryRate}%`}
          icon={CheckCircle}
          color="blue"
          isDarkMode={isDarkMode}
        />
        <MetricCard
          title="Critical Alerts"
          value={alerts.filter((a: any) => a.priority === 'critical').length}
          icon={AlertTriangle}
          color="red"
          isDarkMode={isDarkMode}
        />
      </div>

      <div className="mt-8">
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Recent Vehicle Activity</h3>
        <div className="space-y-4">
          {vehicles.slice(0, 5).map((vehicle: any) => (
            <div key={vehicle.id} className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{vehicle.make} {vehicle.model} ({vehicle.registrationNumber})</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.mileage.toLocaleString()} km</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  vehicle.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : vehicle.status === 'maintenance'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}