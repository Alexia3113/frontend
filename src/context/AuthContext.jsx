import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest, logoutRequest } from "../api/auth";
import PropTypes from "prop-types";
import Cookies from 'js-cookie';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth= ()=>{
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('UseAuth debe estar definido')
    }
    return context;
}

// eslint-disable-next-line react/prop-types, no-unused-vars
export const AuthProvider = ( {children })=>{
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signup = async ( user)=>{
        //console.log("hola")
       try {
            const res = await registerRequest(user);
            console.log(res);
            setUser(res.data);
            setIsAuthenticated(true);
            console.log("hola")

       } catch (error) {
        console.log("2")
            console.log([error.response.data.message]);
            //si existe un error al registrar el usuario guardamos el error en la variable error
            setErrors([error.response.data.message]);
        }
    }//fin de signup

    const signin = async ( user ) => {
        try {
            const res = await loginRequest(user);
            console.log(res);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            //console.log(error)
            setErrors([error.response.data.message]);
        }
    }//fin de signin

    //funcion para cerrar sesión
    const logout = () =>{
        logoutRequest();
        Cookies.remove('token');
        setIsAuthenticated(false);
        setUser(null);
    }

    useEffect( ()=>{
        if(errors.length > 0){
            const timer = setTimeout( ()=>{
                setErrors( [] );
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    useEffect(()=>{
        async function checkLogin() {
        const cookies = Cookies.get();
            if(!cookies.token){
                //si no hay cookie que contenga el token
                setIsAuthenticated(false); //el usuario no esta auteticado
                setLoading(false); //no hay cookie y ya no se  cargan los datos
                //establecemos los datos del usuario en null
                return setUser(null);
            }//fin de !cookies.token

            try {
                const res = await verifyTokenRequest(cookies.token);
                console.log(res);
                if(!res.data){
                    setIsAuthenticated(false); //el usuario no esta autentificado
                    setLoading(false);
                    
                    return setUser(null);
                }
                setIsAuthenticated(true);
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false),
                setLoading(false);
                setUser(null);
            }//fin del catch
        }//fin de checklogin
        checkLogin();
    },[]);//fin de useEffect
    
    return(
        <AuthContext.Provider value={{
            signup,
            signin,
            user,
            isAuthenticated,
            errors,
            loading,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}//fin de AuthProvider

AuthProvider.propTypes={
    children: PropTypes.any
}

