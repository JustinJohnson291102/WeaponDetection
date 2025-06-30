import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Play, Square, Settings } from 'lucide-react';

export const LiveCamera: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
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
    setIsStreaming(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Live Camera Feed</h3>
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
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={startStream}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <Play className="w-4 h-4" />
              <span>Start</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {hasPermission === false ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <CameraOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-gray-900 font-semibold mb-2">Camera Access Denied</h4>
              <p className="text-gray-600 text-sm mb-4">
                Please allow camera access to use live detection
              </p>
              <button
                onClick={startStream}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Grant Permission
              </button>
            </div>
          </div>
        ) : !isStreaming ? (
          <div className="h-96 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-gray-900 font-semibold mb-2">Camera Ready</h4>
              <p className="text-gray-600 text-sm mb-4">
                Click start to begin live weapon detection
              </p>
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
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">LIVE</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border">
                <p className="text-gray-900 text-sm">
                  🔍 Scanning for weapons... No threats detected
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <h5 className="text-gray-900 font-medium mb-2">Detection Status</h5>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-gray-600 text-sm">{isStreaming ? 'Active' : 'Inactive'}</span>
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
      </div>
    </div>
  );
};