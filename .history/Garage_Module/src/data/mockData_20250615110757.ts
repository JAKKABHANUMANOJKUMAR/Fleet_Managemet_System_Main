import { Vehicle, Driver, Alert, InventoryItem, User, ServiceRecord, Branch, FuelEntry } from '../types';

export const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Hyderabad Branch',
    location: 'Telangana',
    manager: 'John Manager',
    vehicleCount: 8,
    driverCount: 12,
    address: '123 Main St, Hyderabad, Telangana, 500001',
    phone: '+91-40-5555-0100',
    email: 'hyderabad@sindhuparcels.com'
  },
  {
    id: '2',
    name: 'Vijayawada Branch',
    location: 'Andhra Pradesh',
    manager: 'Sarah Wilson',
    vehicleCount: 6,
    driverCount: 8,
    address: '456 Krishna Ave, Vijayawada, Andhra Pradesh, 520001',
    phone: '+91-866-5555-0200',
    email: 'vijayawada@sindhuparcels.com'
  },
  {
    id: '3',
    name: 'Mumbai Branch',
    location: 'Mumbai',
    manager: 'Mike Rodriguez',
    vehicleCount: 4,
    driverCount: 6,
    address: '789 Andheri East, Mumbai, Maharashtra, 400093',
    phone: '+91-22-5555-0300',
    email: 'mumbai@sindhuparcels.com'
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    registrationNumber: 'TS07AB1224',
    make: 'Ford',
    model: 'Transit',
    year: 2022,
    status: 'active',
    driverId: '1',
    mileage: 45000,
    lastService: '2024-01-15',
    nextService: '2024-04-15',
    insurance: {
      provider: 'State Farm',
      policyNumber: 'SF123456789',
      expiryDate: '2024-12-31'
    },
    location: { lat: 17.3850, lng: 78.4867 },
    branchId: '1'
  },
  {
    id: '2',
    registrationNumber: 'AP07GF1554',
    make: 'Mercedes',
    model: 'Sprinter',
    year: 2021,
    status: 'maintenance',
    mileage: 67000,
    lastService: '2024-02-01',
    nextService: '2024-05-01',
    insurance: {
      provider: 'Allstate',
      policyNumber: 'AS987654321',
      expiryDate: '2024-11-30'
    },
    location: { lat: 16.5062, lng: 80.6480 },
    branchId: '2'
  },
  {
    id: '3',
    registrationNumber: 'TS07XT0234',
    make: 'Chevrolet',
    model: 'Express',
    year: 2023,
    status: 'active',
    driverId: '2',
    mileage: 23000,
    lastService: '2024-02-20',
    nextService: '2024-05-20',
    insurance: {
      provider: 'Progressive',
      policyNumber: 'PR456789123',
      expiryDate: '2025-01-15'
    },
    location: { lat: 19.0760, lng: 72.8777 },
    branchId: '3'
  },
  {
    id: '4',
    registrationNumber: 'AP07CD5678',
    make: 'Ford',
    model: 'Transit',
    year: 2022,
    status: 'active',
    driverId: '3',
    mileage: 38000,
    lastService: '2024-01-10',
    nextService: '2024-04-10',
    insurance: {
      provider: 'State Farm',
      policyNumber: 'SF234567890',
      expiryDate: '2024-10-31'
    },
    location: { lat: 16.5062, lng: 80.6480 },
    branchId: '2'
  },
  {
    id: '5',
    registrationNumber: 'TS07EF9012',
    make: 'Isuzu',
    model: 'NPR',
    year: 2021,
    status: 'active',
    mileage: 52000,
    lastService: '2024-02-15',
    nextService: '2024-05-15',
    insurance: {
      provider: 'Geico',
      policyNumber: 'GE345678901',
      expiryDate: '2025-02-28'
    },
    location: { lat: 17.3850, lng: 78.4867 },
    branchId: '1'
  },
  {
    id: '6',
    registrationNumber: 'AP07GH3456',
    make: 'Mercedes',
    model: 'Sprinter',
    year: 2023,
    status: 'active',
    mileage: 15000,
    lastService: '2024-03-01',
    nextService: '2024-06-01',
    insurance: {
      provider: 'Progressive',
      policyNumber: 'PR567890123',
      expiryDate: '2025-03-31'
    },
    location: { lat: 16.5062, lng: 80.6480 },
    branchId: '2'
  },
  {
    id: '7',
    registrationNumber: 'TS07IJ7890',
    make: 'Ford',
    model: 'Transit',
    year: 2022,
    status: 'active',
    driverId: '4',
    mileage: 45000,
    lastService: '2024-01-15',
    nextService: '2024-04-15',
    insurance: {
      provider: 'State Farm',
      policyNumber: 'SF123456789',
      expiryDate: '2024-12-31'
    },
    location: { lat: 17.3850, lng: 78.4867 },
    branchId: '1'
  },
  {
    id: '8',
    registrationNumber: 'AP07KL1234',
    make: 'Mercedes',
    model: 'Sprinter',
    year: 2021,
    status: 'maintenance',
    mileage: 67000,
    lastService: '2024-02-01',
    nextService: '2024-05-01',
    insurance: {
      provider: 'Allstate',
      policyNumber: 'AS987654321',
      expiryDate: '2024-11-30'
    },
    location: { lat: 16.5062, lng: 80.6480 },
    branchId: '2'
  }
];

export const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@sindhuparcels.com',
    phone: '+91-98765-43210',
    licenseNumber: 'DL123456789',
    licenseExpiry: '2025-06-15',
    status: 'active',
    experience: 8,
    rating: 4.8,
    assignedVehicle: '1',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '+91-98765-43211',
      relationship: 'Spouse'
    },
    branchId: '1'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@sindhuparcels.com',
    phone: '+91-98765-43212',
    licenseNumber: 'DL987654321',
    licenseExpiry: '2024-09-20',
    status: 'active',
    experience: 12,
    rating: 4.9,
    assignedVehicle: '3',
    emergencyContact: {
      name: 'Carlos Garcia',
      phone: '+91-98765-43213',
      relationship: 'Husband'
    },
    branchId: '3'
  },
  {
    id: '3',
    name: 'David Johnson',
    email: 'david.johnson@sindhuparcels.com',
    phone: '+91-98765-43214',
    licenseNumber: 'DL456789123',
    licenseExpiry: '2024-12-10',
    status: 'active',
    experience: 5,
    rating: 4.5,
    assignedVehicle: '4',
    emergencyContact: {
      name: 'Lisa Johnson',
      phone: '+91-98765-43215',
      relationship: 'Sister'
    },
    branchId: '2'
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@sindhuparcels.com',
    phone: '+91-98765-43216',
    licenseNumber: 'DL789123456',
    licenseExpiry: '2025-03-15',
    status: 'active',
    experience: 6,
    rating: 4.7,
    assignedVehicle: '7',
    emergencyContact: {
      name: 'Fatima Hassan',
      phone: '+91-98765-43217',
      relationship: 'Wife'
    },
    branchId: '1'
  },
  {
    id: '5',
    name: 'Robert Chen',
    email: 'robert.chen@sindhuparcels.com',
    phone: '+91-98765-43218',
    licenseNumber: 'DL321654987',
    licenseExpiry: '2025-11-15',
    status: 'active',
    experience: 7,
    rating: 4.6,
    assignedVehicle: '6',
    emergencyContact: {
      name: 'Linda Chen',
      phone: '+91-98765-43219',
      relationship: 'Wife'
    },
    branchId: '2'
  },
  {
    id: '6',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@sindhuparcels.com',
    phone: '+91-98765-43220',
    licenseNumber: 'DL654987321',
    licenseExpiry: '2024-07-22',
    status: 'inactive',
    experience: 3,
    rating: 4.3,
    emergencyContact: {
      name: 'Maria Rodriguez',
      phone: '+91-98765-43221',
      relationship: 'Mother'
    },
    branchId: '1'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'maintenance',
    severity: 'high',
    message: 'Vehicle TS07AB1224 requires immediate maintenance - brake system warning light is on',
    status: 'active',
    timestamp: '2024-03-15T10:30:00Z',
    vehicleId: '1',
    driverId: '1',
    branchId: '1',
    userRole: 'manager'
  },
  {
    id: '2',
    type: 'safety',
    severity: 'medium',
    message: 'Driver John Smith has exceeded speed limit by 20km/h',
    status: 'resolved',
    timestamp: '2024-03-14T15:45:00Z',
    vehicleId: '1',
    driverId: '1',
    branchId: '1',
    userRole: 'manager'
  },
  {
    id: '3',
    type: 'fuel',
    severity: 'low',
    message: 'Vehicle AP07GF1554 is low on fuel (15% remaining)',
    status: 'active',
    timestamp: '2024-03-15T09:15:00Z',
    vehicleId: '2',
    branchId: '2',
    userRole: 'operator'
  },
  {
    id: '4',
    type: 'maintenance',
    severity: 'medium',
    message: 'Vehicle TS07XT0234 needs scheduled oil change',
    status: 'dismissed',
    timestamp: '2024-03-13T14:20:00Z',
    vehicleId: '3',
    driverId: '2',
    branchId: '3',
    userRole: 'operator'
  },
  {
    id: '5',
    type: 'safety',
    severity: 'high',
    message: 'Vehicle AP07CD5678 has a flat tire on rear left wheel',
    status: 'active',
    timestamp: '2024-03-15T11:00:00Z',
    vehicleId: '4',
    driverId: '3',
    branchId: '2',
    userRole: 'manager'
  },
  {
    id: '6',
    type: 'maintenance',
    severity: 'medium',
    message: 'Vehicle TS07EF9012 needs air filter replacement',
    status: 'active',
    timestamp: '2024-03-15T12:30:00Z',
    vehicleId: '5',
    branchId: '1',
    userRole: 'operator'
  },
  {
    id: '7',
    type: 'safety',
    severity: 'low',
    message: 'Vehicle AP07GH3456 windshield wipers need replacement',
    status: 'active',
    timestamp: '2024-03-15T13:45:00Z',
    vehicleId: '6',
    branchId: '2',
    userRole: 'operator'
  },
  {
    id: '8',
    type: 'fuel',
    severity: 'medium',
    message: 'Vehicle TS07IJ7890 fuel efficiency below normal range',
    status: 'active',
    timestamp: '2024-03-15T14:20:00Z',
    vehicleId: '7',
    driverId: '4',
    branchId: '1',
    userRole: 'manager'
  },
  {
    id: '9',
    type: 'maintenance',
    severity: 'high',
    message: 'Vehicle AP07KL1234 engine temperature warning light is on',
    status: 'active',
    timestamp: '2024-03-15T15:10:00Z',
    vehicleId: '8',
    branchId: '2',
    userRole: 'manager'
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Engine Oil (5W-30)',
    category: 'Lubricants',
    currentStock: 25,
    minThreshold: 10,
    maxThreshold: 50,
    unit: 'liters',
    supplier: 'AutoParts Plus',
    lastRestocked: '2024-02-15',
    cost: 8.50
  },
  {
    id: '2',
    name: 'Brake Pads',
    category: 'Brake System',
    currentStock: 8,
    minThreshold: 5,
    maxThreshold: 20,
    unit: 'sets',
    supplier: 'Brake Masters',
    lastRestocked: '2024-01-20',
    cost: 45.00
  },
  {
    id: '3',
    name: 'Air Filter',
    category: 'Engine Components',
    currentStock: 3,
    minThreshold: 5,
    maxThreshold: 15,
    unit: 'pieces',
    supplier: 'Filter Pro',
    lastRestocked: '2024-03-01',
    cost: 12.75
  },
  {
    id: '4',
    name: 'Transmission Fluid',
    category: 'Lubricants',
    currentStock: 15,
    minThreshold: 8,
    maxThreshold: 30,
    unit: 'liters',
    supplier: 'AutoParts Plus',
    lastRestocked: '2024-02-28',
    cost: 18.00
  },
  {
    id: '5',
    name: 'Tire Set (Commercial)',
    category: 'Tires',
    currentStock: 2,
    minThreshold: 4,
    maxThreshold: 12,
    unit: 'sets',
    supplier: 'Tire World',
    lastRestocked: '2024-01-15',
    cost: 450.00
  }
];

export const mockServiceRecords: ServiceRecord[] = [
  {
    id: 'sr1',
    vehicleId: '1',
    vehicleRegistration: 'TS07AB1224',
    serviceDate: '2024-01-15',
    serviceType: 'routine',
    mileage: 45000,
    description: 'Oil change, tire rotation, fluid check',
    serviceProvider: 'QuickLube',
    technician: 'Mike Technician',
    status: 'completed',
    costs: { labor: 100, parts: [{ id: 'p1', name: 'Oil Filter', quantity: 1, unitCost: 15, totalCost: 15, supplier: 'AutoParts' }], total: 115 },
    nextServiceDue: '2024-07-15',
    nextServiceMileage: 50000,
    branchId: 'Telangana'
  },
  {
    id: 'sr2',
    vehicleId: '2',
    vehicleRegistration: 'AP07GF1554',
    serviceDate: '2024-02-01',
    serviceType: 'repair',
    mileage: 67500,
    description: 'Brake pad replacement and rotor resurfacing',
    serviceProvider: 'BrakeMasters',
    technician: 'Sarah Mechanic',
    status: 'in-progress',
    costs: { labor: 250, parts: [{ id: 'p2', name: 'Brake Pads', quantity: 2, unitCost: 50, totalCost: 100, supplier: 'BrakeCo' }], total: 350 },
    nextServiceMileage: 72000,
    branchId: 'Andhra Pradesh'
  },
  {
    id: 'sr3',
    vehicleId: '3',
    vehicleRegistration: 'TS07XT0234',
    serviceDate: '2024-03-01',
    serviceType: 'inspection',
    mileage: 23000,
    description: 'Annual safety inspection',
    serviceProvider: 'VehicleInspect',
    technician: 'David Inspector',
    status: 'scheduled',
    costs: { labor: 50, parts: [], total: 50 },
    nextServiceMileage: 28000,
    branchId: 'Telangana'
  },
  {
    id: 'sr4',
    vehicleId: '4',
    vehicleRegistration: 'AP07AB1234',
    serviceDate: '2024-03-10',
    serviceType: 'routine',
    mileage: 46200,
    description: 'Oil change and fluid top-off',
    serviceProvider: 'Local Garage',
    technician: 'Anna Driver',
    status: 'completed',
    costs: { labor: 80, parts: [{ id: 'p3', name: 'Engine Oil', quantity: 5, unitCost: 8, totalCost: 40, supplier: 'OilSupplies' }], total: 120 },
    nextServiceMileage: 51000,
    branchId: 'Andhra Pradesh'
  },
  {
    id: 'sr5',
    vehicleId: '5',
    vehicleRegistration: 'TS07LG1024',
    serviceDate: '2024-03-15',
    serviceType: 'emergency',
    mileage: 68000,
    description: 'Flat tire repair',
    serviceProvider: 'Roadside Assist',
    technician: 'Chris Fixer',
    status: 'completed',
    costs: { labor: 60, parts: [{ id: 'p4', name: 'Tire Patch Kit', quantity: 1, unitCost: 10, totalCost: 10, supplier: 'TyreSupplies' }], total: 70 },
    nextServiceMileage: 73000,
    branchId: 'Telangana'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@fleet.com',
    role: 'admin',
    permissions: ['dashboard', 'vehicles', 'drivers', 'services', 'alerts', 'inventory', 'reports', 'settings', 'user_management', 'backup_restore'],
    lastLogin: '2024-03-15T09:00:00Z',
    status: 'active'
  },
  {
    id: '2',
    name: 'Fleet Manager',
    email: 'manager@fleet.com',
    role: 'manager',
    permissions: ['dashboard', 'vehicles', 'drivers', 'services', 'alerts', 'inventory', 'reports'],
    lastLogin: '2024-03-14T17:30:00Z',
    status: 'active'
  },
  {
    id: '3',
    name: 'Operator',
    email: 'operator@fleet.com',
    role: 'operator',
    permissions: ['dashboard', 'vehicles', 'alerts'],
    lastLogin: '2024-03-13T11:15:00Z',
    status: 'active'
  }
];

export const mockFuelEntries: FuelEntry[] = [
  {
    id: '1',
    vehicleNumber: 'TS07AB1224',
    vehicleId: '1',
    driverId: '1',
    startLocation: 'Hyderabad',
    endLocation: 'Vijayawada',
    tripStartDate: '2024-03-15',
    tripEndDate: '2024-03-15',
    startLocationReading: 45000,
    endLocationReading: 45350,
    fuelLoad: 2500,
    fuelBill: null,
    fuelRemaining: 15,
    fuelConsumed: 35,
    mileage: 10,
    branch: 'Hyderabad Branch'
  },
  {
    id: '2',
    vehicleNumber: 'AP07GF1554',
    vehicleId: '2',
    driverId: '2',
    startLocation: 'Vijayawada',
    endLocation: 'Mumbai',
    tripStartDate: '2024-03-14',
    tripEndDate: '2024-03-15',
    startLocationReading: 67000,
    endLocationReading: 67800,
    fuelLoad: 3000,
    fuelBill: null,
    fuelRemaining: 20,
    fuelConsumed: 80,
    mileage: 10,
    branch: 'Vijayawada Branch'
  },
  {
    id: '3',
    vehicleNumber: 'TS07XT0234',
    vehicleId: '3',
    driverId: '3',
    startLocation: 'Mumbai',
    endLocation: 'Hyderabad',
    tripStartDate: '2024-03-13',
    tripEndDate: '2024-03-14',
    startLocationReading: 23000,
    endLocationReading: 23800,
    fuelLoad: 2800,
    fuelBill: null,
    fuelRemaining: 25,
    fuelConsumed: 75,
    mileage: 10.67,
    branch: 'Mumbai Branch'
  },
  {
    id: '4',
    vehicleNumber: 'AP07CD5678',
    vehicleId: '4',
    driverId: '4',
    startLocation: 'Hyderabad',
    endLocation: 'Bangalore',
    tripStartDate: '2024-03-12',
    tripEndDate: '2024-03-13',
    startLocationReading: 38000,
    endLocationReading: 38600,
    fuelLoad: 2600,
    fuelBill: null,
    fuelRemaining: 18,
    fuelConsumed: 62,
    mileage: 9.68,
    branch: 'Hyderabad Branch'
  },
  {
    id: '5',
    vehicleNumber: 'TS07EF9012',
    vehicleId: '5',
    driverId: '5',
    startLocation: 'Bangalore',
    endLocation: 'Chennai',
    tripStartDate: '2024-03-11',
    tripEndDate: '2024-03-12',
    startLocationReading: 52000,
    endLocationReading: 52500,
    fuelLoad: 2400,
    fuelBill: null,
    fuelRemaining: 22,
    fuelConsumed: 58,
    mileage: 8.62,
    branch: 'Vijayawada Branch'
  }
];