import React, { useContext, useState } from 'react';
import { ThemeContext } from './themeContex';
import Papa from 'papaparse'; // Asegúrate de instalarlo: npm install papaparse
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';

const MessageSender = () => {
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [numbers, setNumbers] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);

    const handleSendMessage = async () => {
        const numberList = numbers.split(',').map(num => num.trim());
        setSuccessMessage('');
        setProgress(0);
        setIsSending(true);
        setIsCancelled(false);

        try {
            const progressIncrement = 100 / numberList.length;
            let currentProgress = 0;

            for (const number of numberList) {
                if (isCancelled) {
                    console.log("Envío cancelado");
                    setIsSending(false);
                    return;
                }

                const response = await fetch('http://localhost:5000/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message, numbers: [number] }),
                });

                if (response.ok) {
                    currentProgress += progressIncrement;
                    setProgress(Math.min(currentProgress, 100));
                } else {
                    console.error('Error al enviar mensaje a:', number);
                }
            }

            setSuccessMessage('Mensajes enviados');
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleCancelSend = async () => {
        try {
            const response = await fetch('http://localhost:5000/cancel-send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (response.ok) {
                console.log("Cancelación de envío exitosa");
            } else {
                console.error('Error al cancelar el envío');
            }
        } catch (error) {
            console.error('Error al enviar la solicitud de cancelación:', error);
        }
    };

    const handleCancel = () => {
        setIsCancelled(true);
        handleCancelSend();
        setIsSending(false);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: false, // Asume que no hay encabezado
                skipEmptyLines: true,
                complete: (result) => {
                    const csvNumbers = result.data.map(row => row[0]).join(',');
                    setNumbers(prev => (prev ? `${prev},${csvNumbers}` : csvNumbers)); // Agrega los números al estado existente
                },
                error: (error) => {
                    console.error('Error al leer el archivo CSV:', error);
                },
            });
        }
    };

    return (
        <div className={`container mt-5 ${isDarkMode ? 'dark-mode' : ''}`}>
            <h1 className="mb-4">Enviar Mensajes por WhatsApp</h1>

            {/* Barra de progreso */}
            <div className={`progress-container ${isDarkMode ? 'dark-mode' : ''}`}>
                <div
                    className={`progress-bar ${progress === 100 ? 'complete' : ''}`}
                    role="progressbar"
                    style={{
                        transform: `scaleX(${progress / 100})`,
                        transformOrigin: 'left',
                        backgroundColor: progress === 100 ? 'green' : 'blue',
                        color: progress === 100 ? 'white' : 'yellow',
                    }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                    {progress === 100 ? 'Mensajes enviados' : `${progress.toFixed(1)}%`}
                </div>
            </div>

            <div className="toggle-switch">
                <input
                    type="checkbox"
                    id="darkModeToggle"
                    onChange={toggleDarkMode}
                    checked={isDarkMode}
                />
                <label htmlFor="darkModeToggle" className="switch"></label>
            </div>

            <div className="form-group">
                <label>Mensaje:</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="4"
                    className="form-control"
                    placeholder="Escribe tu mensaje aquí..."
                />
            </div>

            <div className="form-group">
                <label>Números de Teléfono (separados por comas):</label>
                <textarea
                    value={numbers}
                    onChange={(e) => setNumbers(e.target.value)}
                    rows="4"
                    className="form-control"
                    placeholder="Introduce los números separados por comas..."
                />
            </div>

            <div className="form-group">
                <label>Cargar CSV:</label>
                <input
                    type="file"
                    className="form-control"
                    accept=".csv"
                    onChange={handleFileUpload}
                />
            </div>

            <div className="d-flex">
                <button onClick={handleSendMessage} className="btn btn-primary mb-4" disabled={isSending}>
                    Enviar Mensajes
                </button>
                <button onClick={handleCancel} className="btn btn-danger mb-4 ml-2" disabled={!isSending}>
                    Cancelar
                </button>
            </div>

            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default MessageSender;
