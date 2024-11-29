import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import './index.css';

Modal.setAppElement("#root");

const QRModal = ({ isOpen, onRequestClose }) => {
  const [qrImage, setQrImage] = useState(null);
  const [qrScanned, setQrScanned] = useState(false);

  useEffect(() => {
    const fetchQrImage = async () => {
      try {
        const response = await fetch("https://whatsappsbackend.onrender.com/qr"); // URL del backend para obtener el QR
        if (response.ok) {
          const imageBlob = await response.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          setQrImage(imageUrl);
        } else {
          console.error("No se encontró el QR");
        }
      } catch (error) {
        console.error("Error al obtener el QR:", error);
      }
    };

    fetchQrImage();
  }, []); // Este efecto solo se ejecuta una vez cuando el componente se monta

  useEffect(() => {
    const checkQrStatus = async () => {
      try {
        const response = await fetch("https://whatsappsbackend.onrender.com/qr-status"); // URL para verificar el estado del QR
        if (response.ok) {
          const data = await response.json();
          setQrScanned(data.qrScanned); // Actualiza el estado del QR
        }
      } catch (error) {
        console.error("Error al verificar el estado del QR:", error);
      }
    };

    const interval = setInterval(checkQrStatus, 2000); // Verifica cada 2 segundos
    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>QR Code</h2>
      {qrScanned ? (
        <p style={{ color: "green", fontWeight: "bold" }}>¡QR escaneado con éxito!</p>
      ) : (
        qrImage ? (
          <img src={qrImage} alt="QR Code" style={{ width: "300px", height: "300px" }} />
        ) : (
          <p>Cargando QR...</p>
        )
      )}
      <button onClick={onRequestClose}>Cerrar</button>
    </Modal>
  );
};

export default QRModal;
