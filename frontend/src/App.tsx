import "./styles/App.scss";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileSelector } from "./components/FileSelector";
import { ChangeCalculator } from "./components/ChangeCalculator";

function App() {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    document.title = t("cashRegister");
  }, [t]);

  return (
    <div className="app-container">
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
