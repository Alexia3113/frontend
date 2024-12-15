import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate,Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoPersonAdd, IoLogIn, IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import ReCaptcha from 'react-google-recaptcha';

function LoginPage() {
  const {register,handleSubmit, formState: {errors}} = useForm();
  const {signin, isAuthenticated ,errors:signInErrors} = useAuth();
  const [passwordShowm, setPasswordShown] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null)

  const tooglePasswordVisibility = () =>{
    setPasswordShown(passwordShowm? false:true);
  }

  const navigate = useNavigate();

  useEffect( ()=>{
    if(isAuthenticated)
      navigate('/add-product');
  },[isAuthenticated, navigate])

  const onSubmit = handleSubmit( (data)=>{
    //console.log(data);
    signin(data);
  })

  return (
    <div className= "flex items-center justify-center h-screen">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        <h1 className='text-3xl font-bold'>Login</h1>
        {
            signInErrors.map( (error,i) => (
                <div className='bg-red-500 p-2 my-2 text-white' key={i}>
                    {error}
                </div>
            ))
        }
        <form onSubmit={onSubmit}>
          <label htmlFor='email'>Email</label>
              <input type="email" 
                  className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                  placeholder='Email'
                  {
                      ...register("email", {required:true})
                  }           
              />
              { errors.email &&(
                  <p className='text-red-500'>Email es requerido</p>
              )}
              <label htmlFor='password'>Password</label>
              <div className='flex justify-end items-center relative'>
                  <input type={passwordShowm? "text": "password"} 
                      className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
                      placeholder='Password'
                      {
                          ...register("password",{required:true,minLength:6})
                      }
                  />
                  {
                    passwordShowm? <IoEyeSharp size={30} className='absolute mr-2 w-10'
                                              onClick={tooglePasswordVisibility} />
                                   :
                                   <IoEyeOffSharp size={30} className='absolute mr-2 w-10'
                                                  onClick={tooglePasswordVisibility}/>
                  }
                  { errors.password?.type==="required" &&(
                      <p className='text-red-500'>Password requerido</p>
                  )}
                  { errors.password?.type==="minLenght" && (
                      <p className='text-red-500'>La longitud minima es de 6 caracteres</p>
                  )}
            </div>
              <button className='bg-zinc-700 px-3 py-3 my-3 rounded-md'
                      type="submit"
                      disabled={!captchaValue}>
                <IoLogIn size={30}/>
              </button>

              <ReCaptcha sitekey='6LcqG5wqAAAAAKUIB8qZ5CC9Ql74lVVrSolTd5KT'
                        onChange={(value)=> setCaptchaValue(value)} />
          </form>
          <div className='flex gap-x-2 justify-between pt-5 mt-5'>
            ¿No tienes una cuenta?
            <Link to="/register" className='text-sky-500'>
              <div className='flex mx-2 px-2 items-start'>
                !Crea una! <IoPersonAdd size={30} className='mx-1'/>
              </div>
            </Link>
          </div>
      </div>
    </div>
  )
}

export default LoginPage