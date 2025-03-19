import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  children?: {
    title: string;
    path: string;
  }[];
}

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileOpen = false, 
  onCloseMobile = () => {},
  onCollapsedChange = () => {},
  isMobile = false
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

  // Initialize expanded items based on current route
  useEffect(() => {
    const updatedExpanded: Record<string, boolean> = {};
    
    sidebarItems.forEach(item => {
      if (item.children) {
        const isActive = item.children.some(child => 
          location.pathname === child.path || 
          location.pathname.startsWith(child.path + '/')
        );
        
        if (isActive) {
          updatedExpanded[item.title] = true;
        }
      }
    });
    
    setExpandedItems(prev => ({...prev, ...updatedExpanded}));
  }, [location.pathname]);

  // Notify parent component when collapsed state changes
  useEffect(() => {
    onCollapsedChange(collapsed);
  }, [collapsed, onCollapsedChange]);

  // Toggle submenu expansion
  const toggleExpand = (title: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Handle collapse toggle - tidak lagi dipakai
  const handleCollapseToggle = () => {
    // Function dipertahankan untuk kompatibilitas tapi tidak digunakan
    console.log("Collapse toggle tidak lagi digunakan");
  };

  // Check if a route is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') {
      return false;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Check if a parent route or any of its children are active
  const isParentActive = (item: SidebarItem) => {
    if (isActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child.path));
    }
    return false;
  };

  // Sidebar navigation items with icons
  const sidebarItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      path: '/',
      icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: 'Risk Register',
      path: '/risk-register',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      children: [
        { title: 'Risk List', path: '/risk-register' },
        { title: 'Hazard List', path: '/hazard-list' },
        { title: 'Top Risk Analysis', path: '/top-risk-analysis' },
      ]
    },
    {
      title: 'SA Management',
      path: '/jsa-home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: 'SA Approvals',
      path: '/l2sa-approvals',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div 
      className={`
        ${isMobileOpen ? 'fixed inset-0 z-40' : ''}
        ${isMobile ? (isMobileOpen ? 'block' : 'hidden') : (isMobileOpen ? 'hidden' : 'block')}
      `}
    >
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onCloseMobile}></div>
      )}
      
      <aside 
        className={`
          ${isMobileOpen && isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
          flex flex-col h-full w-64
          bg-white border-r border-gray-200 text-gray-700
          transition-all duration-300 ease-in-out
        `}
      >
        
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.title} className="rounded-md overflow-hidden">
                {item.children ? (
                  <div>
                    <button
                      className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-colors duration-200
                        ${isParentActive(item) 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-100'
                        }
                        ${collapsed ? 'justify-center' : ''}
                      `}
                      onClick={collapsed ? () => {
                        // Handle navigation to first child route when collapsed
                        if (item.children?.length) {
                          window.location.href = item.children[0].path;
                        }
                      } : () => toggleExpand(item.title)}
                    >
                      <span className={`${collapsed ? '' : 'mr-3'} ${isParentActive(item) ? 'text-blue-600' : 'text-gray-500'}`}>
                        <div className="h-6 w-6 flex items-center justify-center">
                          {item.icon}
                        </div>
                      </span>
                      {!collapsed && (
                        <>
                          <span className="flex-1 whitespace-nowrap">{item.title}</span>
                          <span className="ml-auto">
                            <svg
                              className={`w-4 h-4 transition-transform duration-200 ${
                                expandedItems[item.title] ? 'transform rotate-180' : ''
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </>
                      )}
                    </button>
                    
                    {/* Submenu */}
                    {!collapsed && expandedItems[item.title] && (
                      <ul className="mt-1 pl-4 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.title}>
                            <Link
                              to={child.path}
                              className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200
                                ${isActive(child.path) 
                                  ? 'bg-blue-50 text-blue-700' 
                                  : 'text-gray-600 hover:bg-gray-100'
                                }
                              `}
                              onClick={isMobileOpen ? onCloseMobile : undefined}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full mr-3 ${isActive(child.path) ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                              <span>{child.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200
                      ${isActive(item.path) 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'hover:bg-gray-100'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    onClick={isMobileOpen ? onCloseMobile : undefined}
                  >
                    <span className={`${collapsed ? '' : 'mr-3'} ${isActive(item.path) ? 'text-blue-600' : 'text-gray-500'}`}>
                      <div className="h-6 w-6 flex items-center justify-center">
                        {item.icon}
                      </div>
                    </span>
                    {!collapsed && <span className="whitespace-nowrap">{item.title}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        {!collapsed && (
          <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
            <p className="mb-1">Pertamina Risk Management System</p>
            <p>Version 1.0.0</p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default Sidebar;