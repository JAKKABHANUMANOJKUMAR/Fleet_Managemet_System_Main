import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import VehiclesPage from './components/Vehicles/VehiclesPage';
import DriversPage from './components/Drivers/DriversPage';
import AlertsPage from './components/Alerts/AlertsPage';
import InventoryPage from './components/Inventory/InventoryPage';
import ServicesPage from './components/Services/ServicesPage';
import SettingsPage from './components/Settings/SettingsPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Apply dark mode class to document root and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className={`min-h-screen flex font-urbanist transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 text-white' 
          : 'bg-white text-gray-900'
      }`}>
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={setSidebarOpen}
          isDarkMode={isDarkMode}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            isDarkMode={isDarkMode}
            onThemeToggle={() => setIsDarkMode(!isDarkMode)}
          />
          
          <main className={`flex-1 overflow-y-auto transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <Routes>
              <Route path="/" element={<Dashboard isDarkMode={isDarkMode} />} />
              <Route path="/vehicles" element={<VehiclesPage isDarkMode={isDarkMode} />} />
              <Route path="/drivers" element={<DriversPage isDarkMode={isDarkMode} />} />
              <Route path="/alerts" element={<AlertsPage isDarkMode={isDarkMode} />} />
              <Route path="/inventory" element={<InventoryPage isDarkMode={isDarkMode} />} />
              <Route path="/services" element={<ServicesPage isDarkMode={isDarkMode} />} />
              <Route path="/settings" element={<SettingsPage isDarkMode={isDarkMode} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;