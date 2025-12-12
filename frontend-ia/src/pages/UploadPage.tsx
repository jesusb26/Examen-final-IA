import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadPage.css";


export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [nivel, setNivel] = useState("medio");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      setMensaje("⚠️ Por favor, selecciona un archivo.");
      return;
    }

    try {
      setCargando(true);
      setMensaje("Procesando documento...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("nivel", nivel);

      const API_URL = process.env.REACT_APP_BACKEND_URL;
      const res = await fetch(`${API_URL}/resumen`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        setMensaje("❌ Error: " + (data.mensaje || "Ocurrió un problema"));
      } else {
        setMensaje("✅ ¡Archivo procesado con éxito!");
        localStorage.setItem("texto_estudio", data.resumen);
        setTimeout(() => navigate("/resumen"), 1500); // 1.5s para leer
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="title">Subir Material de Estudio</h1>
        
        <div className="upload-area">
          <input
            type="file"
            id="fileInput"
            className="file-input-hidden"
            accept=".pdf,.txt,.docx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <label htmlFor="fileInput" className="file-label">
            {file ? (
              <span className="file-name">📄 {file.name}</span>
            ) : (
              <span>📂 Haz clic para seleccionar un archivo</span>
            )}
          </label>
        </div>

        <div className="form-group">
          <label className="label">Profundidad del resumen:</label>
          <select
            className="select"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
          >
            <option value="corto">Resumen Corto (Conceptos clave)</option>
            <option value="medio">Resumen Medio (Balanceado)</option>
            <option value="largo">Resumen Largo (Detallado)</option>
          </select>
        </div>

        <button className="btn-primary" onClick={handleUpload} disabled={cargando}>
          {cargando ? "Analizando..." : "Comenzar Estudio"}
        </button>

        {mensaje && <div className={`message ${mensaje.includes("❌") || mensaje.includes("⚠️") ? "error" : "success"}`}>{mensaje}</div>}
      </div>
    </div>
  );
}
