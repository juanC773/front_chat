import { createBrowserRouter,createRoutesFromElements, Route } from "react-router-dom";
import ChatPage from "../components/Chat";
import RegisterPage from "../components/RegisterPage";
import Authenticator from "../components/Authenticator";


const router = createRoutesFromElements([
    <Route path="/" element={<Authenticator/>}>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/chat/:user?" element={<ChatPage/>}/>
        <Route path="*" element={<div>Not Found</div>}/>
    </Route>

])

export const routes = createBrowserRouter(router);