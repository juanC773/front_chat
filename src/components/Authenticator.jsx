import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';

export default function Authenticator() {
    return (
        <div>
            <h1>Es mi header</h1>
            <div style={{display:'flex', flexDirection: 'row'}}>
                <button>Inicio</button>
                <Link to="/register">
                <button>
                    Registrarse
                </button>
            </Link>
                
                <button>Chat</button>
            </div>
            <Outlet/>
        </div>
    )
}