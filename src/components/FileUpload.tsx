import React, { useCallback, useState } from 'react';
import { Upload, X, FileImage, Video, AlertCircle, Zap, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== droppedFiles.length) {
      alert('Some files were skipped. Only images and videos under 50MB are supported.');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== selectedFiles.length) {
      alert('Some files were skipped. Only images and videos under 50MB are supported.');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    // Simulate upload progress
    files.forEach((file, index) => {
      const fileId = `${file.name}-${index}`;
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }, 200);
    });

    // Start actual upload
    onFileUpload(files);
  };

  const clearFiles = () => {
    setFiles([]);
    setUploadProgress({});
  };

  return (
    <div className="space-y-6">
      {/* YOLOv5 Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-blue-900 font-bold text-lg">YOLOv5 Weapon Detection Engine</h4>
            <p className="text-blue-700">Advanced AI model trained on 9 weapon classes with high accuracy detection</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-blue-600">
              <span>• Real-time processing</span>
              <span>• 94.2% accuracy</span>
              <span>• Multiple weapon types</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 bg-white ${
          dragActive
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <Upload className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Upload Files for AI Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop images or videos here, or click to select files
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Upload className="w-5 h-5 mr-2" />
              Select Files
            </label>
          </div>
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <FileImage className="w-4 h-4" />
              <span>Images: JPG, PNG, GIF</span>
            </div>
            <div className="flex items-center space-x-1">
              <Video className="w-4 h-4" />
              <span>Videos: MP4, AVI, MOV</span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>Max: 50MB per file</span>
            </div>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-gray-900 font-semibold">Selected Files ({files.length})</h4>
            <div className="flex items-center space-x-2">
              {isProcessing && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Processing...</span>
                </div>
              )}
              <button
                onClick={clearFiles}
                className="text-gray-500 hover:text-red-600 text-sm"
                disabled={isProcessing}
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div className="grid gap-3">
            {files.map((file, index) => {
              const fileId = `${file.name}-${index}`;
              const progress = uploadProgress[fileId] || 0;
              const isComplete = progress >= 100;
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="relative">
                      {file.type.startsWith('image/') ? (
                        <FileImage className="w-8 h-8 text-blue-500" />
                      ) : (
                        <Video className="w-8 h-8 text-green-500" />
                      )}
                      {isComplete && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>•</span>
                        <span>{file.type}</span>
                        {isProcessing && progress > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600 font-medium">{Math.round(progress)}%</span>
                          </>
                        )}
                      </div>
                      {isProcessing && progress > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isProcessing}
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              );
            })}
          </div>
          
          {files.length > 0 && !isProcessing && (
            <button 
              onClick={handleUpload}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              <span>Start YOLOv5 Detection Analysis</span>
            </button>
          )}
          
          {isProcessing && (
            <div className="w-full py-4 bg-blue-50 text-blue-700 rounded-lg font-medium text-center border border-blue-200">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>YOLOv5 analyzing frames... Please wait</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};