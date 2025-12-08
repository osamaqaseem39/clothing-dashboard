import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';

const Header: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Toggle button and Search */}
        <div className="flex items-center space-x-4">
          {/* Sidebar toggle button */}
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors group relative"
            onClick={toggleSidebar}
            title="Toggle Sidebar (Ctrl+B)"
          >
            <Bars3Icon className="h-6 w-6" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Ctrl+B
            </span>
          </button>
          
          {/* Search */}
          <div className="flex-1 max-w-lg lg:max-w-xs">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search..."
              type="search"
            />
          </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Removed Cart Icon */}

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
              {/* Notification badge */}
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>

            {/* Notifications dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="px-4 py-8 text-center text-gray-500">
                      <p className="text-sm">No notifications</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <a href="/notifications" className="text-sm text-primary-600 hover:text-primary-500">
                      View all notifications
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  {user?.lastName?.charAt(0)?.toUpperCase() || ''}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email || 'User'}
              </span>
            </button>

            {/* User dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  {/* User info section */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 font-semibold text-sm">
                          {user?.firstName?.charAt(0)?.toUpperCase() || ''}{user?.lastName?.charAt(0)?.toUpperCase() || ''}
                        </span>
                      </div>
                      <div className="ml-3 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.firstName && user?.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user?.email || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email || ''}
                        </p>
                        {user?.role && (
                          <p className="text-xs text-gray-500 capitalize mt-0.5">
                            {user.role}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    to="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
