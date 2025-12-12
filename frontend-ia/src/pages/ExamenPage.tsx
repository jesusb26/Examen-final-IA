import { useState, useEffect } from "react";
import "./ExamenPage.css";

type RespuestasUsuario = Record<number, string>; // id -> "A" | "B" | "C" | "D"

const ABCD = "ABCD";
const letraAIndice = (letra: string) => ABCD.indexOf(letra);

export default function ExamenPage() {
  const [examen, setExamen] = useState<any>(null);
  const [respuestas, setRespuestas] = useState<RespuestasUsuario>({});
  const [resultado, setResultado] = useState<string>("");
  const [verificado, setVerificado] = useState<boolean>(false);

  // Cargar persistencia al montar
  useEffect(() => {
    const examenGuardado = localStorage.getItem("examen");
    const respuestasGuardadas = localStorage.getItem("respuestas");
    const resultadoGuardado = localStorage.getItem("resultado");
    const verificadoGuardado = localStorage.getItem("verificado");

    if (examenGuardado) setExamen(JSON.parse(examenGuardado));
    if (respuestasGuardadas) setRespuestas(JSON.parse(respuestasGuardadas));
    if (resultadoGuardado) setResultado(resultadoGuardado);
    if (verificadoGuardado) setVerificado(verificadoGuardado === "true");
  }, []);

  const generarExamen = async () => {
    setResultado("");
    setRespuestas({});
    setVerificado(false);
    localStorage.removeItem("respuestas");
    localStorage.removeItem("resultado");
    localStorage.setItem("verificado", "false");

    const textoGuardado = localStorage.getItem("texto_estudio");
    if (!textoGuardado) {
      setResultado("⚠️ No hay texto cargado. Sube un archivo primero.");
      return;
    }

    const res = await fetch("http://localhost:3000/plan-estudio/examen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad: 20 }),
    });

    const data = await res.json();
    if (data.error) {
      setResultado(data.mensaje || "❌ Error generando examen");
    } else {
      setExamen(data);
      localStorage.setItem("examen", JSON.stringify(data));
    }
  };

  // Guardar selección como letra “A”-“D”
  const seleccionarOpcion = (pregId: number, opcionIndex: number) => {
    const letraSeleccionada = ABCD[opcionIndex];
    setRespuestas((prev) => {
      const next = { ...prev, [pregId]: letraSeleccionada };
      localStorage.setItem("respuestas", JSON.stringify(next));
      return next;
    });
  };

  const enviarRespuestas = () => {
    if (!examen) return;

    let correctas = 0;

    examen.preguntas.forEach((preg: any) => {
      const seleccionUsuario = respuestas[preg.id]; // letra
      if (seleccionUsuario && seleccionUsuario === preg.correcta) {
        correctas++;
      }
    });

    const incorrectas = examen.preguntas.length - correctas;
    const textoResultado = `Aciertos: ${correctas} | Errores: ${incorrectas}`;

    setResultado(textoResultado);
    setVerificado(true);

    localStorage.setItem("resultado", textoResultado);
    localStorage.setItem("verificado", "true");
  };

  return (
    <div className="page-container">
      <div className="card-wide">
        <h1 className="title">Examen</h1>

        <div className="header-actions">
          <button className="btn-action" onClick={generarExamen}>Generar Examen</button>
          {examen && (
            <button
              className="btn-action"
              onClick={enviarRespuestas}
              disabled={verificado}
            >
              {verificado ? "Verificado" : "Verificar"}
            </button>
          )}
        </div>

        {resultado && <div className="resultado-banner">{resultado}</div>}

        {examen && (
          <div className="examen-content">
            {examen.preguntas.map((p: any) => {
              const indiceCorrecto = letraAIndice(p.correcta); // índice 0-3
              return (
                <div key={p.id} className="pregunta-box">
                  <strong>{p.id}. {p.pregunta}</strong>
                  <div className="opciones-grid">
                    {p.opciones.map((opc: string, index: number) => {
                      const letraOpcion = ABCD[index];
                      const esSeleccionada = respuestas[p.id] === letraOpcion;
                      const esCorrecta = index === indiceCorrecto;

                      let clase = "opcion-item";
                      if (verificado) {
                        if (esCorrecta) clase += " opcion-correcta";
                        else if (esSeleccionada) clase += " opcion-incorrecta";
                        else clase += " opcion-neutra";
                      }

                      return (
                        <label key={`${p.id}-opc-${index}`} className={clase}>
                          <input
                            type="radio"
                            name={`preg-${p.id}`}
                            value={letraOpcion}
                            checked={esSeleccionada}
                            disabled={verificado} // bloquear cambios tras verificar
                            onChange={() => seleccionarOpcion(p.id, index)}
                          />
                          <span className="opcion-texto">
                            {letraOpcion}. {opc}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
