import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatsCards } from './components/StatsCards';
import { FileUpload } from './components/FileUpload';
import { DetectionResults } from './components/DetectionResults';
import { LiveCamera } from './components/LiveCamera';
import { AlertsPanel } from './components/AlertsPanel';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { AuthPage } from './components/AuthPage';
import { Detection, AlertStats, DetectedClass, User, Notification } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [detections, setDetections] = useState<Detection[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('weaponguard_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const mockStats: AlertStats = {
    total: detections.length,
    today: detections.filter(d => {
      const today = new Date().toDateString();
      return new Date(d.timestamp).toDateString() === today;
    }).length,
    thisWeek: detections.filter(d => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(d.timestamp) > weekAgo;
    }).length,
    critical: detections.filter(d => d.threatLevel === 'critical').length,
  };

  const handleAuth = (userData: User) => {
    setUser(userData);
    localStorage.setItem('weaponguard_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('weaponguard_user');
    setDetections([]);
    setNotifications([]);
    setActiveTab('upload');
  };

  const addNotification = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    addNotification('Starting YOLOv5 weapon detection analysis...', 'info');

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/detect', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const detected = result.detections as DetectedClass[];

        const newDetection: Detection = {
          id: `detection-${Date.now()}-${Math.random()}`,
          timestamp: new Date().toISOString(),
          filename: result.filename,
          detectedClasses: detected,
          threatLevel: result.threat_level,
          confidence: detected.length > 0
            ? Math.max(...detected.map(d => d.confidence))
            : 0,
          imageUrl: result.annotated_image,
          status: 'completed',
        };

        setDetections(prev => [newDetection, ...prev]);

        // Add notification based on detection results
        if (detected.length > 0) {
          const weaponNames = detected.map(d => d.class).join(', ');
          addNotification(
            `🚨 WEAPON DETECTED: ${weaponNames} found in ${file.name}`,
            newDetection.threatLevel === 'critical' ? 'error' : 'warning'
          );
        } else {
          addNotification(
            `✅ Analysis complete: No weapons detected in ${file.name}`,
            'success'
          );
        }
      }
    } catch (error) {
      console.error('Detection failed:', error);
      addNotification(
        `❌ Detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading WeaponGuard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div className="space-y-8">
            <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />
            <DetectionResults detections={detections} />
          </div>
        );
      case 'live':
        return <LiveCamera onDetection={addNotification} />;
      case 'alerts':
        return <AlertsPanel detections={detections} />;
      case 'analytics':
        return <Analytics detections={detections} />;
      case 'history':
        return <DetectionResults detections={detections} />;
      case 'settings':
        return <Settings user={user} onLogout={handleLogout} />;
      default:
        return (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Feature Coming Soon</h3>
            <p className="text-gray-500">This feature is under development</p>
          </div>
        );
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        alertCount={unreadNotifications.length} 
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onClearAll={clearAllNotifications}
        user={user}
      />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-8">
          <StatsCards stats={mockStats} />
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;