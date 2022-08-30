import { useCallback, useState } from "react";

interface FileSelectorProps {
  onFileSelect: (file: File) => void;
}

export const FileSelector = ({ onFileSelect }: FileSelectorProps) => {
  const [dragging, setDragging] = useState(false);

  const selectFile = useCallback(
    (files: FileList | null) => {
      if (files !== null && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="component-container">
      <h3>Select a file</h3>
      <div
        className="drag-and-drop-file-selector"
        style={dragging ? { backgroundColor: "#B4E0B4" } : undefined}
        onDrop={(dragEvent) => {
          dragEvent.preventDefault();
          selectFile(dragEvent.dataTransfer.files);
        }}
        onDragOver={(dragEvent) => {
          dragEvent.preventDefault();
          setDragging(true);
        }}
        onDragExit={() => {
          setDragging(false);
        }}
      >
        <p className="drag-and-drop-prompt">Drag and drop your file here</p>
      </div>
      <div className="button-container">
        <label htmlFor="file-upload" className="browse-files-button">
          Browse files
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={(changeEvent) => {
            selectFile(changeEvent.target.files);
          }}
        />
      </div>
    </div>
  );
};
