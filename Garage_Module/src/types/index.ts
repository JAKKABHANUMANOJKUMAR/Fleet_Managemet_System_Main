export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  status: 'active' | 'maintenance' | 'retired';
  driverId?: string;
  mileage: number;
  lastService: string;
  nextService?: string;
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  branchId?: string;
  tyres?: {
    tyre1: {
      number: string;
      photo?: File | string;
    };
    tyre2: {
      number: string;
      photo?: File | string;
    };
    tyre3: {
      number: string;
      photo?: File | string;
    };
    tyre4: {
      number: string;
      photo?: File | string;
    };
    tyre5: {
      number: string;
      photo?: File | string;
    };
    tyre6: {
      number: string;
      photo?: File | string;
    };
  };
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'active' | 'inactive' | 'suspended';
  experience: number;
  rating: number;
  assignedVehicle?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  branchId?: string;
}

export interface Alert {
  id: string;
  type: 'maintenance' | 'fuel' | 'safety' | 'other';
  severity: 'low' | 'medium' | 'high';
  message: string;
  vehicleId: string;
  driverId?: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'dismissed';
  branchId: string;
  userRole: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  maxThreshold: number;
  unit: string;
  supplier: string;
  lastRestocked: string;
  cost: number;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  vehicleRegistration: string;
  serviceDate: string;
  serviceType: 'routine' | 'repair' | 'inspection' | 'emergency';
  mileage: number;
  description: string;
  serviceProvider: string;
  technician: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  costs: {
    labor: number;
    parts: ServicePart[];
    total: number;
  };
  nextServiceDue?: string;
  nextServiceMileage?: number;
  notes?: string;
  attachments?: string[];
  branchId?: string;
}

export interface ServicePart {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier: string;
  partNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  permissions: string[];
  lastLogin: string;
  status: 'active' | 'inactive';
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  vehicleCount: number;
  driverCount: number;
  address: string;
  phone: string;
  email: string;
}

export interface FuelEntry {
  id: string;
  vehicleNumber: string;
  vehicleId: string;
  driverId: string;
  startLocation: string;
  endLocation: string;
  tripStartDate: string;
  tripEndDate: string;
  startLocationReading: number;
  endLocationReading: number;
  fuelLoad: number;
  fuelBill: File | null;
  fuelRemaining: number;
  fuelConsumed: number;
  mileage: number;
  branch: string;
}