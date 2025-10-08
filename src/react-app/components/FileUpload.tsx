import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText } from 'lucide-react';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  acceptedTypes?: string[];
  label?: string;
}

interface UploadedFile {
  file: File;
  preview?: string;
  id: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
  maxSizePerFile = 10, // 10MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf', 'text/plain'],
  label = 'Upload Files'
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        errors.push(`${file.name}: File type not supported`);
        return;
      }

      // Check file size
      if (file.size > maxSizePerFile * 1024 * 1024) {
        errors.push(`${file.name}: File too large (max ${maxSizePerFile}MB)`);
        return;
      }

      // Check total files limit
      if (uploadedFiles.length + newFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const uploadedFile: UploadedFile = {
        file,
        id: Math.random().toString(36).substr(2, 9)
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
          setUploadedFiles(prev => 
            prev.map(f => f.id === uploadedFile.id ? uploadedFile : f)
          );
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadedFile);
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
      setTimeout(() => setError(''), 5000);
    } else {
      setError('');
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onFilesChange(updatedFiles.map(f => f.file));
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.file));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType === 'application/pdf') return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop files here, or{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500">
          Supports: JPG, PNG, SVG, PDF, TXT (Max {maxSizePerFile}MB each, {maxFiles} files total)
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files ({uploadedFiles.length}/{maxFiles})</h4>
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {uploadedFile.preview ? (
                  <img 
                    src={uploadedFile.preview} 
                    alt={uploadedFile.file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                    {getFileIcon(uploadedFile.file.type)}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeFile(uploadedFile.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;