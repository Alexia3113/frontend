import {useForm} from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoPersonAdd, IoLogIn } from 'react-icons/io5';
import ReCaptcha from 'react-google-recaptcha';


function RegisterPage() {
    const {register, handleSubmit, formState:{errors} }= useForm();
    const {signup, isAuthenticated, errors:registerErrors }  = useAuth();
    const navigate = useNavigate();
    const [captchaValue, setCaptchaValue] = useState(null)
    console.log(registerErrors)

    useEffect( ()=>{
        if(isAuthenticated)
            navigate('/products')
    }, [isAuthenticated, navigate])

    const onSubmit = handleSubmit ( async(values)=>{
        console.log(values);
        signup(values);
    })//fin de onSubmit
  return (
    <div className="flex items-center justify-center h-screen">
        <div className='bg-zinc-800 max-w-md p-10 rounded-md' >
            <h1 className='text-3xl font-bold'>Register</h1>
            {
                registerErrors.map( (error,i) => (
                    <div className='bg-red-500 p-2 my-2 text-white' key={i}>
                        {error}
                    </div>
                ))
            }
            <form onSubmit={onSubmit}>
                <label htmlFor='username'>Username</label>
                <input type="text" 
                            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                            placeholder='Username'
                    {
                        ...register("username",{required:true, minLength:5})
                    }
                />
                { errors.username?.type==="required" &&(
                    <p className='text-red-500'>Nombre del usuario requerido</p>
                )}
                { errors.username?.type==="minLenght" && (
                    <p className='text-red-500'>La longitud minima es de 5 caracteres</p>
                )}
                <label htmlFor='email'>Email</label>
                <input type="email" 
                    className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                    placeholder='Email'
                    {
                        ...register("email", {required:true,
                                            pattern:{
                                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                                message: 'Please enter a valid email'
                                            },
                        })
                    }           
                />
                { errors.email?.type==='required' &&(
                    <p className='text-red-500'>Email es requerido</p>
                )}
                { errors.email?.message &&(
                    <p className='text-red-500'>Email no valido</p>
                )}

                <label htmlFor='password'>Password</label>
                <input type="password" 
                    className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                    placeholder='Password'
                    {
                        ...register("password",{required:true,minLength:6})
                    }
                />
                { errors.password?.type==="required" &&(
                    <p className='text-red-500'>Password requerido</p>
                )}
                { errors.password?.type==="minLenght" && (
                    <p className='text-red-500'>La longitud minima es de 6 caracteres</p>
                )}
                <button className='bg-zinc-700 px-3 py-3 my-3 rounded-md'
                        type="submit" disabled={!captchaValue}><IoPersonAdd size={30} />
                </button>
                <ReCaptcha sitekey='6LcqG5wqAAAAAKUIB8qZ5CC9Ql74lVVrSolTd5KT'
              onChange={(value)=> setCaptchaValue(value)} />
                
            </form>
            <div className='flex gap-x-2 justify-between pt-5 mt-5'>
                ¿Ya tienes una cuenta?
                <Link to='/login' className='text-sky-500'>
                    <div className='flex mx-2 px-2 items-start'>
                        !Inicia sesión! <IoLogIn size={30} className='mx-1'/>
                    </div>
                </Link>
            </div>
        </div>
    </div>
  )
}
export default RegisterPage