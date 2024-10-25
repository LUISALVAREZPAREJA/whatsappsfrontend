import React, { useContext, useState } from 'react';
import Papa from 'papaparse';
import { ThemeContext } from './themeContex';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';

const MessageSender = () => {
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [numbers, setNumbers] = useState([]); // Cambiado a array
    const [successMessage, setSuccessMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Manejar la selección de archivo CSV
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: function(results) {
                    const numbersArray = results.data.flat();
                    setNumbers(numbersArray.map(num => num.trim())); // Almacena como array
                },
                error: function(error) {
                    console.error("Error al analizar el archivo:", error);
                }
            });
        }
    };

    // Manejar la selección de imagen o archivo
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    // Enviar mensaje con archivo
    const handleSendMessage = async () => {
        setSuccessMessage('');
        setProgress(0);
        setIsSending(true);
        setIsCancelled(false);

        const formData = new FormData();
        formData.append('message', message);

        if (selectedFile) {
            formData.append('file', selectedFile); // Solo añade si hay archivo
        }

        try {
            const progressIncrement = 100 / numbers.length;
            let currentProgress = 0;

            for (const number of numbers) {
                if (isCancelled) {
                    console.log("Envío cancelado");
                    setIsSending(false);
                    return;
                }
            
                if (!number) {
                    console.error('Número vacío, saltando...');
                    continue; // Saltar si el número está vacío
                }
            
                formData.append('numbers[]', number); // Usa 'numbers[]' para tratarlo como un array
            

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send-message`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    currentProgress += progressIncrement;
                    setProgress(Math.min(currentProgress, 100));
                } else {
                    console.error('Error al enviar mensaje a:', number);
                }

                // Limpiar formData para el siguiente número
                formData.delete('numbers');
            }

            setSuccessMessage('Mensajes enviados');
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleCancel = () => {
        setIsCancelled(true);
        setIsSending(false);
    };

    return (
        <div className={`mt-5 ${isDarkMode ? 'dark-mode' : ''}`}>
            <h1 className="mb-4">Enviar Mensajes por WhatsApp</h1>

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
                <label>Subir archivo o imagen para enviar:</label>
                <input type="file" className="form-control-file" onChange={handleFileUpload} />
            </div>

            <div className="form-group" id="numeros">
                <label>Números de Teléfono (separados por comas o usando CSV):</label>
                <textarea
                    value={numbers.join(', ')} // Mostrar como string para el usuario
                    onChange={(e) => setNumbers(e.target.value.split(',').map(num => num.trim()))} // Actualizar como array
                    rows="4"
                    className="form-control"
                    placeholder="Introduce los números separados por comas o usa un archivo CSV..."
                />
            </div>

            <div className="drop-area mb-3">
                <p>Arrastra y suelta un archivo CSV aquí o selecciona los números manualmente.</p>
            </div>

            <div className="form-group">
                <label>Subir archivo CSV:</label>
                <input type="file" className="form-control-file" accept=".csv" onChange={handleFileChange} />
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