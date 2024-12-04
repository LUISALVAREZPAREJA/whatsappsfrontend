import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import './index.css'; // Asegúrate de incluir los estilos

Modal.setAppElement("#root");

const QRModal = ({ isOpen, onRequestClose }) => {
  const [qrImage, setQrImage] = useState(null);

  useEffect(() => {
    const fetchQrImage = async () => {
      try {
        const response = await fetch("https://whatsappsbackend.onrender.com/qr"); // Tu URL del backend
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

    const interval = setInterval(() => {
      fetchQrImage();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="modal-overlay"
      className="modal-content"
    >
      <h2>Código QR</h2>
      {qrImage ? (
        <img src={qrImage} alt="Código QR" />
      ) : (
        <p>Cargando QR...</p>
      )}
      <button onClick={onRequestClose}>Cerrar</button>
    </Modal>
  );
};

export default QRModal;
