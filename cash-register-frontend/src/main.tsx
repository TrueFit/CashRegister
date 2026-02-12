import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import FileUploadPage from "./FileUploadPage.tsx";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<FileUploadPage />} />
    </Routes>
  </BrowserRouter>,
)
