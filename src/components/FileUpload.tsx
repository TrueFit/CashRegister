import { useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onFileContent: (content: string) => void;
  error?: string;
}

export function FileUpload({ onFileContent, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.txt')) {
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setFileName('');
    onFileContent('');
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".txt"
          onChange={handleFileSelect}
          id="file-input"
          style={{ display: 'none' }}
        />

        {!fileName ? (
          <>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="file-upload-text">
              Drag and drop your file here, or{' '}
              <label htmlFor="file-input" className="file-upload-link">
                browse
              </label>
            </p>
            <p className="file-upload-hint">Accepts .txt files</p>
          </>
        ) : (
          <div className="file-upload-success">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className="file-upload-name">{fileName}</p>
            <button onClick={handleClear} className="button button-secondary" style={{ marginTop: '12px' }}>
              Clear & Upload New
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-error">{error}</p>}
    </div>
  );
}
