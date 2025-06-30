import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export const Analytics: React.FC = () => {
  const weeklyData = [
    { name: 'Mon', detections: 12, alerts: 3 },
    { name: 'Tue', detections: 8, alerts: 2 },
    { name: 'Wed', detections: 15, alerts: 5 },
    { name: 'Thu', detections: 10, alerts: 1 },
    { name: 'Fri', detections: 18, alerts: 7 },
    { name: 'Sat', detections: 6, alerts: 2 },
    { name: 'Sun', detections: 4, alerts: 1 }
  ];

  const weaponTypes = [
    { name: 'Handgun', value: 35, color: '#3b82f6' },
    { name: 'Knife', value: 25, color: '#10b981' },
    { name: 'Rifle', value: 20, color: '#f59e0b' },
    { name: 'Other', value: 20, color: '#6b7280' }
  ];

  const hourlyTrend = [
    { hour: '6AM', count: 2 },
    { hour: '9AM', count: 8 },
    { hour: '12PM', count: 15 },
    { hour: '3PM', count: 12 },
    { hour: '6PM', count: 18 },
    { hour: '9PM', count: 6 },
    { hour: '12AM', count: 3 }
  ];

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-gray-900">Security Analytics</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h4 className="text-gray-900 font-semibold mb-4">Weekly Detection Summary</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#374151',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="detections" fill="#3b82f6" name="Total Detections" />
              <Bar dataKey="alerts" fill="#f59e0b" name="Critical Alerts" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h4 className="text-gray-900 font-semibold mb-4">Weapon Type Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={weaponTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {weaponTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#374151',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm lg:col-span-2">
          <h4 className="text-gray-900 font-semibold mb-4">Detection Trends by Hour</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#374151',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h5 className="text-gray-900 font-medium mb-3">Detection Accuracy</h5>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">True Positives</span>
              <span className="text-green-600 text-sm font-medium">94.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h5 className="text-gray-900 font-medium mb-3">Response Time</h5>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Avg. Response</span>
              <span className="text-blue-600 text-sm font-medium">2.3 min</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h5 className="text-gray-900 font-medium mb-3">System Uptime</h5>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Operational</span>
              <span className="text-green-600 text-sm font-medium">99.8%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.8%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};