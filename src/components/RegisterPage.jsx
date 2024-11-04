import { useState } from "react"
import { useNavigate } from "react-router-dom";


export default function RegisterPage(){

    const [user, setUser] = useState('');
    const nav = useNavigate();

    const handleUserChange =(event) =>{
        setUser(event.target.value);
    }
    const handleSubmit = () =>{

        const token = "Bearer asfas"
        localStorage.setItem("token",token);
        nav('/chat/' + user )
    }

    return (
        <div>
            <h1>Sign up </h1>
            <input onChange={handleUserChange} value={user}/>
            <button onClick={handleSubmit}>Registro</button>
        </div>)
}