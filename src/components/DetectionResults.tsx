import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Target, Eye, Trash2, ArrowLeft, Filter } from 'lucide-react';
import { Detection } from '../types';
import { WEAPON_CLASSES, THREAT_LEVELS } from '../constants/weapons';

interface DetectionResultsProps {
  detections: Detection[];
  onClearHistory?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const DetectionResults: React.FC<DetectionResultsProps> = ({ 
  detections, 
  onClearHistory,
  showBackButton = false,
  onBack
}) => {
  const [filterThreat, setFilterThreat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'threat'>('newest');

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

  // Filter and sort detections
  const filteredDetections = detections
    .filter(detection => {
      if (filterThreat === 'all') return true;
      return detection.threatLevel === filterThreat;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'threat':
          const threatOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return threatOrder[b.threatLevel as keyof typeof threatOrder] - threatOrder[a.threatLevel as keyof typeof threatOrder];
        default:
          return 0;
      }
    });

  if (detections.length === 0) {
    return (
      <div className="space-y-6">
        {showBackButton && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        )}
        
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Detections Yet</h3>
          <p className="text-gray-500">Upload files to start YOLOv5 weapon detection analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900">Detection History</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>{filteredDetections.length} of {detections.length} results</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterThreat}
              onChange={(e) => setFilterThreat(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Threats</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'threat')}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="threat">By Threat Level</option>
          </select>

          {onClearHistory && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all detection history? This action cannot be undone.')) {
                  onClearHistory();
                }
              }}
              className="flex items-center space-x-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-2xl font-bold text-gray-900">{detections.length}</p>
          <p className="text-gray-600 text-sm">Total Files</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-2xl font-bold text-red-600">
            {detections.filter(d => d.detectedClasses.length > 0).length}
          </p>
          <p className="text-gray-600 text-sm">Threats Found</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-2xl font-bold text-orange-600">
            {detections.filter(d => d.threatLevel === 'critical').length}
          </p>
          <p className="text-gray-600 text-sm">Critical</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-2xl font-bold text-green-600">
            {detections.filter(d => d.detectedClasses.length === 0).length}
          </p>
          <p className="text-gray-600 text-sm">Clean Files</p>
        </div>
      </div>
      
      {/* Detection Results */}
      <div className="grid gap-6">
        {filteredDetections.map((detection) => (
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
                      <div className="flex justify-between">
                        <span>Threat Level:</span>
                        <span className={`font-medium`} style={{ color: THREAT_LEVELS[detection.threatLevel].color }}>
                          {detection.threatLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDetections.length === 0 && detections.length > 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more results</p>
        </div>
      )}
    </div>
  );
};