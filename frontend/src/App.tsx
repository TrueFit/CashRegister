import React, { useEffect, useState } from "react";
import "./App.css";
import { FileSelector } from "./components/FileSelector";
import { ChangeCalculator } from "./components/ChangeCalculator";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    document.title = t("cashRegister");
  }, [t]);

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
