import React, { useState } from 'react';
import { User, Settings as SettingsIcon, Bell, Shield, Camera, Database, LogOut, Save, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsProps {
  user: UserType;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: user.name,
      email: user.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      criticalOnly: false,
      soundEnabled: true
    },
    detection: {
      confidenceThreshold: 0.5,
      autoSave: true,
      realTimeProcessing: true,
      maxFileSize: 50
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      autoLogout: true
    }
  });

  const handleSave = (section: string) => {
    // Save settings logic here
    console.log(`Saving ${section} settings:`, settings[section as keyof typeof settings]);
    // You can add API calls here to save to backend
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'detection', label: 'Detection', icon: Camera },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Storage', icon: Database }
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, name: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, email: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.profile.currentPassword}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, currentPassword: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={settings.profile.newPassword}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, newPassword: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={settings.profile.confirmPassword}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  profile: { ...prev.profile, confirmPassword: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        {[
          { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive detection alerts via email' },
          { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications for real-time alerts' },
          { key: 'criticalOnly', label: 'Critical Alerts Only', description: 'Only receive notifications for critical threats' },
          { key: 'soundEnabled', label: 'Sound Notifications', description: 'Play sound for new alerts' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-gray-900 font-medium">{item.label}</h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, [item.key]: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetectionSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Configuration</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confidence Threshold: {(settings.detection.confidenceThreshold * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={settings.detection.confidenceThreshold}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              detection: { ...prev.detection, confidenceThreshold: parseFloat(e.target.value) }
            }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-gray-600 text-sm mt-1">Minimum confidence level for weapon detection</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max File Size: {settings.detection.maxFileSize} MB
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="10"
            value={settings.detection.maxFileSize}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              detection: { ...prev.detection, maxFileSize: parseInt(e.target.value) }
            }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {[
          { key: 'autoSave', label: 'Auto-save Results', description: 'Automatically save detection results' },
          { key: 'realTimeProcessing', label: 'Real-time Processing', description: 'Process uploads immediately' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-gray-900 font-medium">{item.label}</h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.detection[item.key as keyof typeof settings.detection] as boolean}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  detection: { ...prev.detection, [item.key]: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout: {settings.security.sessionTimeout} minutes
          </label>
          <select
            value={settings.security.sessionTimeout}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={0}>Never</option>
          </select>
        </div>

        {[
          { key: 'twoFactorAuth', label: 'Two-Factor Authentication', description: 'Add an extra layer of security' },
          { key: 'autoLogout', label: 'Auto Logout', description: 'Automatically logout after session timeout' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-gray-900 font-medium">{item.label}</h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security[item.key as keyof typeof settings.security] as boolean}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, [item.key]: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Storage</h3>
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-900 font-medium mb-2">Storage Usage</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Detection Results</span>
              <span className="text-blue-900 font-medium">2.3 GB</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-blue-700 text-xs">45% of 5 GB limit used</p>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left transition-colors">
            <h4 className="text-gray-900 font-medium">Export Data</h4>
            <p className="text-gray-600 text-sm">Download all your detection data</p>
          </button>
          
          <button className="w-full p-3 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg text-left transition-colors">
            <h4 className="text-yellow-900 font-medium">Clear Cache</h4>
            <p className="text-yellow-700 text-sm">Clear temporary files and cache</p>
          </button>
          
          <button className="w-full p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-left transition-colors">
            <h4 className="text-red-900 font-medium">Delete All Data</h4>
            <p className="text-red-700 text-sm">Permanently delete all detection results</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSettings();
      case 'notifications': return renderNotificationSettings();
      case 'detection': return renderDetectionSettings();
      case 'security': return renderSecuritySettings();
      case 'data': return renderDataSettings();
      default: return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Settings</h3>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {renderContent()}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => handleSave(activeSection)}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};