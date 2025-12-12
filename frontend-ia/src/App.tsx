import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import UploadPage from "./pages/UploadPage";
import ResumenPage from "./pages/ResumenPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import ExamenPage from "./pages/ExamenPage";
import SidebarLayout from "./pages/SidebarLayout";

export default function App() {
  useEffect(() => {
    // 👇 Limpia todo el localStorage al recargar la app
    localStorage.clear();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <SidebarLayout>
              <UploadPage />
            </SidebarLayout>
          }
        />
        <Route
          path="/resumen"
          element={
            <SidebarLayout>
              <ResumenPage />
            </SidebarLayout>
          }
        />
        <Route
          path="/flashcards"
          element={
            <SidebarLayout>
              <FlashcardsPage />
            </SidebarLayout>
          }
        />
        <Route
          path="/examen"
          element={
            <SidebarLayout>
              <ExamenPage />
            </SidebarLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
