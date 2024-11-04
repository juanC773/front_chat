import { Outlet } from "react-router-dom";

export default function Authenticator() {
    return (
        <div>
            <h1>Es mi header</h1>
            <div style={{display:'flex', flexDirection: 'row'}}>
                <button>Inicio</button>
                <button>Registro</button>
                <button>Chat</button>
            </div>
            <Outlet/>
        </div>
    )
}