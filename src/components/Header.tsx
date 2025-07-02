import React, { useState } from 'react';
import { Shield, Bell, Settings, User, X, Check, Trash2, LogOut, UserCircle, BarChart3 } from 'lucide-react';
import { User as UserType, Notification } from '../types';

interface HeaderProps {
  alertCount: number;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  user: UserType;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  alertCount, 
  notifications, 
  onMarkAsRead, 
  onClearAll, 
  user,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">WeaponGuard</h1>
            <p className="text-sm text-gray-600">AI Security Detection System</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors rounded-lg hover:bg-gray-100"
            >
              <Bell className="w-6 h-6" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {alertCount > 99 ? '99+' : alertCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    <div className="flex items-center space-x-2">
                      {notifications.length > 0 && (
                        <button
                          onClick={onClearAll}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Clear all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 mb-2 rounded-lg border ${getNotificationColor(notification.type)} ${
                            !notification.read ? 'border-l-4' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                              <div className="flex-1">
                                <p className="text-sm text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            {!notification.read && (
                              <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-blue-600 capitalize">{user.role} Account</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to profile settings
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to analytics
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">My Analytics</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to settings
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Settings</span>
                  </button>

                  <hr className="my-2" />

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (window.confirm('Are you sure you want to logout?')) {
                        onLogout();
                      }
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
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