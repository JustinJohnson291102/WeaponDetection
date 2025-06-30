import React, { useCallback, useState } from 'react';
import { Upload, X, FileImage, Video, AlertCircle, Zap } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

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
    const validFiles = droppedFiles.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    setFiles(validFiles);
    onFileUpload(validFiles);
  }, [onFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    onFileUpload(selectedFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFileUpload(newFiles);
  };

  return (
    <div className="space-y-6">
      {/* YOLOv5 Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-blue-900 font-semibold">YOLOv5 Weapon Detection</h4>
            <p className="text-blue-700 text-sm">Upload images or videos for real-time weapon detection analysis</p>
          </div>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors bg-white ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Files for YOLOv5 Analysis
            </h3>
            <p className="text-gray-600 text-sm mb-4">
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
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              <Upload className="w-5 h-5 mr-2" />
              Select Files
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Supported formats: JPG, PNG, MP4, AVI, MOV • Max size: 50MB per file
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-gray-900 font-medium">Selected Files ({files.length})</h4>
            {isProcessing && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">YOLOv5 Processing...</span>
              </div>
            )}
          </div>
          
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                {file.type.startsWith('image/') ? (
                  <FileImage className="w-5 h-5 text-blue-500" />
                ) : (
                  <Video className="w-5 h-5 text-green-500" />
                )}
                <div>
                  <p className="text-gray-900 text-sm font-medium">{file.name}</p>
                  <p className="text-gray-500 text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isProcessing}
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
          
          {files.length > 0 && !isProcessing && (
            <button 
              onClick={() => onFileUpload(files)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <Zap className="w-5 h-5" />
              <span>Start YOLOv5 Detection</span>
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