import React from 'react';
import { Shield, Bell, Settings, User } from 'lucide-react';

interface HeaderProps {
  alertCount: number;
}

export const Header: React.FC<HeaderProps> = ({ alertCount }) => {
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
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors" />
            {alertCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {alertCount > 99 ? '99+' : alertCount}
              </span>
            )}
          </div>
          <Settings className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors" />
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
};