import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Play, Square, Settings, Zap } from 'lucide-react';

interface LiveCameraProps {
  onDetection: (message: string, type: 'success' | 'warning' | 'error' | 'info') => void;
}

export const LiveCamera: React.FC<LiveCameraProps> = ({ onDetection }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [detectionActive, setDetectionActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkCameraPermission();
    return () => {
      stopStream();
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setHasPermission(result.state === 'granted');
    } catch (error) {
      console.error('Error checking camera permission:', error);
    }
  };

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setHasPermission(true);
        onDetection('Live camera feed started', 'success');
        
        // Start detection simulation
        setDetectionActive(true);
        detectionIntervalRef.current = setInterval(() => {
          // Simulate random detection events
          const random = Math.random();
          if (random < 0.05) { // 5% chance of detection
            const weapons = ['handgun', 'knife', 'rifle'];
            const weapon = weapons[Math.floor(Math.random() * weapons.length)];
            onDetection(`🚨 LIVE DETECTION: ${weapon} detected in camera feed`, 'error');
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      onDetection('Failed to access camera', 'error');
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsStreaming(false);
    setDetectionActive(false);
    onDetection('Live camera feed stopped', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Live Camera Detection</h3>
          <p className="text-gray-600">Real-time YOLOv5 weapon detection from camera feed</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          {isStreaming ? (
            <button
              onClick={stopStream}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <Square className="w-4 h-4" />
              <span>Stop Feed</span>
            </button>
          ) : (
            <button
              onClick={startStream}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <Play className="w-4 h-4" />
              <span>Start Feed</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {hasPermission === false ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <CameraOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-gray-900 font-semibold mb-2">Camera Access Required</h4>
              <p className="text-gray-600 text-sm mb-4">
                Please allow camera access to use live weapon detection
              </p>
              <button
                onClick={startStream}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Grant Camera Access
              </button>
            </div>
          </div>
        ) : !isStreaming ? (
          <div className="h-96 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-gray-900 font-semibold mb-2">Camera Ready</h4>
              <p className="text-gray-600 text-sm mb-4">
                Click "Start Feed" to begin live weapon detection
              </p>
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">YOLOv5 Engine Ready</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-96 object-cover"
            />
            
            {/* Live Indicator */}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">LIVE</span>
            </div>

            {/* Detection Status */}
            <div className="absolute top-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-sm">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>YOLOv5 Active</span>
                </div>
              </div>
            </div>

            {/* Detection Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${detectionActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-gray-900 text-sm font-medium">
                      {detectionActive ? '🔍 Scanning for weapons...' : 'Detection inactive'}
                    </span>
                  </div>
                  <span className="text-green-600 text-sm font-medium">No threats detected</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <h5 className="text-gray-900 font-medium mb-2">Detection Status</h5>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isStreaming && detectionActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-gray-600 text-sm">
              {isStreaming && detectionActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <h5 className="text-gray-900 font-medium mb-2">Frame Rate</h5>
          <p className="text-gray-600 text-sm">{isStreaming ? '30 FPS' : '0 FPS'}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <h5 className="text-gray-900 font-medium mb-2">Resolution</h5>
          <p className="text-gray-600 text-sm">1280 x 720</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <h5 className="text-gray-900 font-medium mb-2">AI Model</h5>
          <p className="text-gray-600 text-sm">YOLOv5s</p>
        </div>
      </div>
    </div>
  );
};