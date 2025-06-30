import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Target, Eye } from 'lucide-react';
import { Detection } from '../types';
import { WEAPON_CLASSES, THREAT_LEVELS } from '../constants/weapons';

interface DetectionResultsProps {
  detections: Detection[];
}

export const DetectionResults: React.FC<DetectionResultsProps> = ({ detections }) => {
  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <Target className="w-5 h-5 text-yellow-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (detections.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Detections Yet</h3>
        <p className="text-gray-500">Upload files to start YOLOv5 weapon detection analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">YOLOv5 Detection Results</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Eye className="w-4 h-4" />
          <span>{detections.length} files analyzed</span>
        </div>
      </div>
      
      <div className="grid gap-6">
        {detections.map((detection) => (
          <div key={detection.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getThreatIcon(detection.threatLevel)}
                  <div>
                    <h4 className="text-gray-900 font-semibold text-lg">{detection.filename}</h4>
                    <p className="text-gray-500 text-sm">Analyzed: {formatTime(detection.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold`}
                    style={{
                      backgroundColor: THREAT_LEVELS[detection.threatLevel].bg,
                      color: THREAT_LEVELS[detection.threatLevel].color,
                    }}
                  >
                    {detection.threatLevel.toUpperCase()} THREAT
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Image with Bounding Boxes */}
                <div className="space-y-4">
                  <h5 className="text-gray-900 font-semibold flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Annotated Frame</span>
                  </h5>
                  <div className="relative">
                    <img
                      src={detection.imageUrl}
                      alt={detection.filename}
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    {/* Simulated Bounding Box Overlay */}
                    {detection.detectedClasses.length > 0 && (
                      <div className="absolute inset-0 pointer-events-none">
                        {detection.detectedClasses.map((detectedClass, index) => (
                          <div
                            key={index}
                            className="absolute border-2 border-red-500"
                            style={{
                              left: `${detectedClass.bbox.x}px`,
                              top: `${detectedClass.bbox.y}px`,
                              width: `${detectedClass.bbox.width}px`,
                              height: `${detectedClass.bbox.height}px`,
                            }}
                          >
                            <div className="absolute -top-8 left-0 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                              {WEAPON_CLASSES[detectedClass.class]?.name || detectedClass.class} {(detectedClass.confidence * 100).toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Detection Analysis */}
                <div className="space-y-6">
                  <div>
                    <h5 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <span>YOLOv5 Analysis Results</span>
                    </h5>
                    
                    {detection.detectedClasses.length > 0 ? (
                      <div className="space-y-3">
                        {detection.detectedClasses.map((detectedClass, index) => (
                          <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: WEAPON_CLASSES[detectedClass.class]?.color || '#dc2626' }}
                                />
                                <span className="text-gray-900 font-semibold">
                                  {WEAPON_CLASSES[detectedClass.class]?.name || detectedClass.class}
                                </span>
                              </div>
                              <span className="text-red-700 font-bold text-lg">
                                {(detectedClass.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p><strong>Confidence:</strong> {(detectedClass.confidence * 100).toFixed(1)}% certainty</p>
                              <p><strong>Location:</strong> x:{detectedClass.bbox.x}, y:{detectedClass.bbox.y}</p>
                              <p><strong>Size:</strong> {detectedClass.bbox.width}×{detectedClass.bbox.height}px</p>
                            </div>
                            <div className="mt-3 p-2 bg-white rounded border">
                              <p className="text-sm font-medium text-red-800">
                                🚨 <strong>{WEAPON_CLASSES[detectedClass.class]?.name || detectedClass.class}</strong> detected with <strong>{(detectedClass.confidence * 100).toFixed(0)}% confidence</strong>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-800 font-medium">No weapons detected in this frame</span>
                        </div>
                        <p className="text-green-700 text-sm mt-2">YOLOv5 analysis completed - Frame is clear</p>
                      </div>
                    )}
                  </div>

                  {/* Technical Details */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h6 className="text-gray-900 font-medium mb-3">Technical Details</h6>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Model:</span>
                        <span className="font-medium text-gray-900">YOLOv5s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overall Confidence:</span>
                        <span className="font-medium text-gray-900">{(detection.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Status:</span>
                        <span className="font-medium text-green-600">Completed</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Classes Detected:</span>
                        <span className="font-medium text-gray-900">{detection.detectedClasses.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};