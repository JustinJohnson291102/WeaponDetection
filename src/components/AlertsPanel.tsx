import React from 'react';
import { AlertTriangle, Clock, MapPin, Shield } from 'lucide-react';

interface Alert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  location?: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export const AlertsPanel: React.FC = () => {
  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'Weapon Detection',
      severity: 'critical',
      message: 'Automatic rifle detected in Building A, Floor 2',
      timestamp: '2025-01-11T10:30:00Z',
      location: 'Building A - Floor 2',
      status: 'active'
    },
    {
      id: '2',
      type: 'Weapon Detection',
      severity: 'high',
      message: 'Handgun detected in parking lot',
      timestamp: '2025-01-11T09:15:00Z',
      location: 'Parking Lot - Section B',
      status: 'acknowledged'
    },
    {
      id: '3',
      type: 'Weapon Detection',
      severity: 'medium',
      message: 'Knife detected in cafeteria area',
      timestamp: '2025-01-11T08:45:00Z',
      location: 'Cafeteria',
      status: 'resolved'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600';
      case 'acknowledged': return 'text-yellow-600';
      case 'resolved': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-red-200';
      case 'acknowledged': return 'border-yellow-200';
      case 'resolved': return 'border-green-200';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Active Alerts</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-600 text-sm font-medium">
            {mockAlerts.filter(a => a.status === 'active').length} Active
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white rounded-xl p-6 border-l-4 ${
              alert.status === 'active' ? 'border-l-red-500' : 
              alert.status === 'acknowledged' ? 'border-l-yellow-500' : 'border-l-green-500'
            } border-r border-t border-b ${getBorderColor(alert.status)} shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold">{alert.type}</h4>
                  <p className="text-gray-600 text-sm">{alert.message}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(alert.status)} bg-gray-50 px-2 py-1 rounded-full`}>
                {alert.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
                {alert.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{alert.location}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {alert.status === 'active' && (
                  <>
                    <button className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs rounded transition-colors border border-yellow-300">
                      Acknowledge
                    </button>
                    <button className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded transition-colors border border-green-300">
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h4 className="text-gray-900 font-semibold">Security Recommendations</h4>
        </div>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li>• Increase security patrols in high-alert areas</li>
          <li>• Review access control logs for suspicious activity</li>
          <li>• Verify all detection alerts with security personnel</li>
          <li>• Update emergency response protocols</li>
        </ul>
      </div>
    </div>
  );
};