import React from 'react';
import { 
  Upload, 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Camera, 
  Settings,
  Shield,
  Clock
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'upload', label: 'Upload & Detect', icon: Upload },
  { id: 'live', label: 'Live Camera', icon: Camera },
  { id: 'alerts', label: 'Active Alerts', icon: AlertTriangle },
  { id: 'history', label: 'Detection History', icon: Clock },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-900 font-semibold">Security Dashboard</span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};