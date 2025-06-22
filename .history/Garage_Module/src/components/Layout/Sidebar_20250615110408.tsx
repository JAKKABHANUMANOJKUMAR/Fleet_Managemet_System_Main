import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Users,
  AlertTriangle,
  Settings,
  Package,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Fuel
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Vehicles', href: '/vehicles', icon: Car },
  { name: 'Drivers', href: '/drivers', icon: Users },
  { name: 'Services', href: '/services', icon: Wrench },
  { name: 'Fuel', href: '/fuel', icon: Fuel },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  isDarkMode: boolean;
}

export default function Sidebar({ isOpen, onToggle, isDarkMode }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const shouldShowExpanded = isOpen || isHovered;

  return (
    <div 
      className={`transition-all duration-300 ${
        shouldShowExpanded ? 'w-64' : 'w-16'
      } flex flex-col border-r ${
        isDarkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`p-6 flex items-center ${shouldShowExpanded ? 'justify-between' : 'justify-center'} border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-center">
          <img 
            src="/ss-removebg-preview.png" 
            alt="Sindhu Parcel Services" 
            className={`transition-all duration-300 object-contain ${
              shouldShowExpanded ? 'h-16 w-auto' : 'h-12 w-auto'
            }`}
          />
        </div>
        {shouldShowExpanded && (
          <button
            onClick={() => onToggle(!isOpen)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
            }`}
            aria-label="Toggle sidebar"
          >
            {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-8">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                    shouldShowExpanded ? 'px-4 py-3' : 'justify-center py-3'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
                title={!shouldShowExpanded ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className={`transition-all duration-300 ${
                  shouldShowExpanded ? 'opacity-100 translate-x-0 ml-3' : 'opacity-0 -translate-x-2 absolute'
                }`}>
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className={`p-6 border-t ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-600">
            <span className="text-sm font-medium text-white">A</span>
          </div>
          <div className={`ml-3 transition-all duration-300 ${
            shouldShowExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 absolute'
          }`}>
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Admin User</p>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>admin@sindhuparcels.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}