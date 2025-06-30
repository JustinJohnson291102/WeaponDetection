import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatsCards } from './components/StatsCards';
import { FileUpload } from './components/FileUpload';
import { DetectionResults } from './components/DetectionResults';
import { LiveCamera } from './components/LiveCamera';
import { AlertsPanel } from './components/AlertsPanel';
import { Analytics } from './components/Analytics';
import { Detection, AlertStats, DetectedClass } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const mockStats: AlertStats = {
    total: 247,
    today: 18,
    thisWeek: 89,
    critical: 5,
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const response = await fetch('http://localhost:8000/detect', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      const detected = result.detections as DetectedClass[];

      const newDetection: Detection = {
        id: `detection-${Date.now()}`,
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

      setDetections([newDetection, ...detections]);
    } catch (error) {
      console.error('Detection failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

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
        return <LiveCamera />;
      case 'alerts':
        return <AlertsPanel />;
      case 'analytics':
        return <Analytics />;
      case 'history':
        return <DetectionResults detections={detections} />;
      default:
        return (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Feature Coming Soon</h3>
            <p className="text-gray-500">This feature is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header alertCount={mockStats.critical} />
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
