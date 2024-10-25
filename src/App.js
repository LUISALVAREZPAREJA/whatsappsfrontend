import React from 'react';
import { ThemeProvider } from './themeContex';
import MessageSender from './MessageSender'; // Ajusta la ruta si es necesario
import './App.css';
import './index.css';


const App = () => {
    return (
        <ThemeProvider>
            <div className="App">
                <MessageSender />
            </div>
        </ThemeProvider>
    );
};

export default App;
