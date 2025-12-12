import { useState, useEffect } from "react";
import "./ResumenPage.css";

export default function ResumenPage() {
  const [resumen, setResumen] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const textoGuardado = localStorage.getItem("texto_estudio");
    if (textoGuardado) {
      setResumen(textoGuardado);
    } else {
      setResumen("⚠️ No hay texto cargado. Sube un archivo primero.");
    }
    setCargando(false);
  }, []);

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="title">Resumen</h1>

        {cargando ? (
          <p>🔄 Cargando...</p>
        ) : (
          <pre className="resultado">{resumen}</pre>
        )}
      </div>
    </div>
  );
}
