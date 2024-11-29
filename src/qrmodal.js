// QRModal.js
import React, { useState, useEffect } from "react";
import Modal from "react-modal";

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
  }, []); // Este efecto solo se ejecuta una vez cuando el componente se monta

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>QR Code</h2>
      {qrImage ? (
        <img src={qrImage} alt="QR Code" style={{ width: "300px", height: "300px" }} />
      ) : (
        <p>Cargando QR...</p>
      )}
      <button onClick={onRequestClose}>Cerrar</button>
    </Modal>
  );
};

export default QRModal;
