import "../styles/FileSelector.scss";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface FileSelectorProps {
  onFileSelect: (file: File) => void;
}

export const FileSelector = ({ onFileSelect }: FileSelectorProps) => {
  const { t } = useTranslation();

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
      <h3>{t("selectAFile")}</h3>
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
        <p className="drag-and-drop-prompt">{t("dragAndDropYourFileHere")}</p>
      </div>
      <div className="button-container">
        <label htmlFor="file-upload" className="browse-files-button">
          {t("browseFiles")}
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
