import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // Necesitarás instalar este paquete
import MessageSender from "./MessageSender"; // Ajusta la ruta si es necesario
import { ThemeProvider } from "./themeContex";
import "./App.css"; // Asegúrate de tener estilos CSS apropiados
import "./index.css";

const App = () => {
    const clientID = "411621429941-fptdrskuehn8j6pk6nhdjklbk6mllsvd.apps.googleusercontent.com";
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decoded = jwtDecode(token);
            if (decoded.email.endsWith("@educateparaelsaber.edu.co")) {
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem("authToken");
                setErrorMessage("Este correo no tiene acceso permitido.");
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setErrorMessage("");
    };

    return (
        <GoogleOAuthProvider clientId={clientID}>
            <div className="App">
                {!isAuthenticated ? (
                    <div className="login-container">
                        <h2>Accede con tu cuenta de Google</h2>
                        <p className="description">Por favor, inicia sesión para continuar.</p>
                        {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
                        
                        <div className="google-login-btn">
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    const token = credentialResponse.credential;
                                    const decoded = jwtDecode(token);

                                    // Validar el correo electrónico
                                    if (decoded.email.endsWith("@educateparaelsaber.edu.co")) {
                                        localStorage.setItem("authToken", token);
                                        setIsAuthenticated(true);
                                    } else {
                                        setErrorMessage("Este correo no tiene acceso permitido.");
                                    }
                                }}
                                onError={() => {
                                    console.log("Error en el login");
                                    setErrorMessage("La autenticación falló. Por favor, intenta nuevamente.");
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <ThemeProvider>
                        <div>
                            <button onClick={handleLogout}>Cerrar sesión</button>
                            <MessageSender />
                        </div>
                    </ThemeProvider>
                )}
            </div>
        </GoogleOAuthProvider>
    );
};

export default App;
