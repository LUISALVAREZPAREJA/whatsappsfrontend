import React, { useEffect, useState } from "react";
import './index.css';

const Logs = () => {
  const [latestLog, setLatestLog] = useState(""); // Usamos un único log

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("https://whatsappsbackend.onrender.com/api/logs"); // Realiza la solicitud con fetch
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json(); // Convierte la respuesta a JSON
        setLatestLog(data.latestLog); // Actualiza el estado con el último log
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    // Llama a la función al iniciar
    fetchLogs();

    // Configura el intervalo para actualizar cada 5 segundos
    const interval = setInterval(() => {
      fetchLogs();
    }, 5000);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

   // Determina la clase CSS según el contenido del log
   const alertClass =
   latestLog === "Proveedor conectado y listo"
     ? "alert alert-success"
     : latestLog.includes("⚡⚡ ACCIÓN REQUERIDA ⚡⚡")
     ? "alert alert-danger"
     : "alert alert-warning"; // Clase predeterminada (opcional)

 return (
   <div className={alertClass} role="alert">
     <p>{latestLog}</p> {/* Muestra el último log */}
   </div>
 );
};

export default Logs;
