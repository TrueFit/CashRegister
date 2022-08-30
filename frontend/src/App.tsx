import React, { useState } from "react";
import "./App.css";
import { FileSelector } from "./components/FileSelector";
import { ChangeCalculator } from "./components/ChangeCalculator";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="App">
      {selectedFile === null ? (
        <FileSelector onFileSelect={(file) => setSelectedFile(file)} />
      ) : (
        <ChangeCalculator
          file={selectedFile}
          onReset={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}

export default App;
