import { useCallback, useRef, useState } from "react"

type FileUploadProps = {
  onFileLoaded: (content: string, fileName: string) => void
}

export function FileUpload({ onFileLoaded }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setFileName(file.name)
        onFileLoaded(content, file.name)
      }
      reader.readAsText(file)
    },
    [onFileLoaded],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const isLoaded = fileName !== null

  return (
    <div
      className={`dropzone ${isLoaded ? "dropzone-loaded" : ""} ${isDragging ? "dropzone-dragging" : ""}`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <div className="dropzone-icon">{isLoaded ? "\u{1F4C4}" : "\u{1F4C1}"}</div>
      <div className="dropzone-text">
        {isLoaded ? (
          <strong>{fileName}</strong>
        ) : (
          <>
            <strong>Drop file here</strong> or click to browse
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  )
}
