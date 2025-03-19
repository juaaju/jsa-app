import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(true);

  const handleCloseMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const handleCollapsedChange = useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarHidden(prev => !prev);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      {/* Navbar - Selalu terlihat di atas */}
      <Navbar onToggleSidebar={toggleSidebar} />
      
      {/* Konten utama dengan sidebar dan outlet */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden by default */}
        {!sidebarHidden && (
          <Sidebar 
            isMobileOpen={isMobileOpen} 
            onCloseMobile={handleCloseMobile}
            onCollapsedChange={handleCollapsedChange}
          />
        )}
        
        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto p-4 transition-all duration-300`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;