import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';
import React from 'react';
import { useTheme } from './ThemeContext.js';

export default function Authenticator() {
    const { darkMode, toggleDarkMode } = useTheme(); 

    return (
        <div>
            <h1>Es mi header</h1>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <button>Inicio</button>
                <Link to="/register">
                    <button>Registrarse</button>
                </Link>
                <button>Chat</button>
                <button onClick={toggleDarkMode}>
                    {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                </button>
            </div>
            <Outlet />
        </div>
    );
}




