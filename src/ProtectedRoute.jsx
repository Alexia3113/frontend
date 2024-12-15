import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute() {
    const {loading,isAuthenticated}=useAuth();
    console.log("Loading:" +loading);
    console.log("isAuthenticated:" + isAuthenticated);

    //si esta cargando la app los datos retornan cargando en un h1
    if(loading) {
        return <h1>cargando...</h1>
    }
    //si la aplicacion no esta cargando y ademas no esta autenticando, entonces redirige a /login
    if(!loading && !isAuthenticated)
        return <Navigate to='/login' replace/>
    return( <Outlet /> ) 
}
export default ProtectedRoute