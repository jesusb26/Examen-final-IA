import { useState, useEffect } from "react";
import "./FlashcardsPage.css";

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Recuperar flashcards guardadas
    const guardadas = localStorage.getItem("flashcards");
    if (guardadas) {
      setFlashcards(JSON.parse(guardadas));
    }
  }, []);

  const generarFlashcards = async () => {
    const textoGuardado = localStorage.getItem("texto_estudio");
    if (!textoGuardado) {
      setError("⚠️ No hay texto cargado. Sube un archivo primero.");
      return;
    }

    try {
      setCargando(true);
      setError("");

      const API_URL = import.meta.env.VITE_BACKEND_URL;

      const res = await fetch(`${API_URL}/flashcards/usar-archivo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cantidad: 8 }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.mensaje || "❌ Error generando flashcards");
      } else {
        setFlashcards(data.flashcards ?? []);
        localStorage.setItem("flashcards", JSON.stringify(data.flashcards)); // 👈 persistencia
      }
    } catch (err) {
      console.error(err);
      setError("❌ Error al generar las flashcards.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card-wide">
        <h1 className="title">Flashcards</h1>

        <button className="btn-action" onClick={generarFlashcards} disabled={cargando}>
          {cargando ? "Generando..." : "Generar Flashcards"}
        </button>

        {error && <p className="error">{error}</p>}

        <div className="flashcards-grid">
          {flashcards.map((fc, i) => (
            <div key={i} className="flashcard fade-in">
              <p className="pregunta-label">Pregunta</p>
              <p className="texto-pregunta">{fc.pregunta}</p>
              <div className="respuesta-container">
                <p className="respuesta-label">Respuesta</p>
                <p className="texto-respuesta">{fc.respuesta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
