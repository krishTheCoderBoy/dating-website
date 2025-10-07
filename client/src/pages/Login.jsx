import React,{useContext, useState} from 'react'
import assets from '../assets/photo/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Login() {

  const navigate = useNavigate()

  const {backendUrl,setIsLoggedIn,getUserData} = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
  try {
    e.preventDefault();

    if (state === "Sign Up") {
      const { data } = await axios.post(
        backendUrl + '/api/auth/register',
        { name, email, password },
        { withCredentials: true }  // 👈 critical
      );

      console.log("👉 Register response:", data);

      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } else {
      const { data } = await axios.post(
        backendUrl + '/api/auth/login',
        { email, password },
        { withCredentials: true }  // 👈 critical
      );

      console.log("👉 Login response:", data);

      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    }
  } catch (error) {
    console.log("❌ Login/Register error:", error.response?.data || error.message);
    if (error.response && error.response.data) {
      toast.error(error.response.data.message || "Something went wrong");
    } else {
      toast.error(error.message || "Something went wrong");
    }
  }
};


  return (
    <div className='flex  min-h-screen items-center justify-center px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img  onClick={()=>navigate('/')}src = {assets.logo} alt = "logo" className='absolute left-5 sm:left-20 top-5 sm:w-32 cursor-pointer'/>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-fullsm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3 '>{state ==='Sign Up' ?'Create Account':'Login'}</h2>
        <p className='text-center text-sm mb-6'>{state ==='Sign Up' ?'Create your account':'Login to your account'}</p>
        <form onSubmit={onSubmitHandler}>
            {state ==='Sign Up' && (
              <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.person_icon} alt="" />
            <input 
            onChange={e => setName(e.target.value)} 
            value={name} 
            className= 'bg-transparent outline-none' type="text" placeholder="Full Name" required />
          </div>
            ) }
      
          <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input 
            onChange={e => setEmail(e.target.value)} 
            value={email} 
            className= 'bg-transparent outline-none' type="email" placeholder="Enter Your email" required />
          </div>

          <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input 
            onChange={e => setPassword(e.target.value)} 
            value={password} 
            className= 'bg-transparent outline-none' type="password" placeholder="Enter Password" required />
          </div>

          <p onClick={()=>navigate('/resetpassword')}className='mb-4 text-indigo-500 cursor-pointer'>Forgot password?</p>
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium'>{state}</button>
        </form>

          {state ==='Sign Up' ? 
          (<p className='text-gray-400 text-center text-xs mt-4'>Already have an account? {''}
          <span onClick={()=> setState('Login')}className='text-blue-400 cursor-pointer underline'>Login here</span>
        </p>):
        (
        <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account? {''}
          <span onClick={()=> setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Signup here</span>
        </p>)}

      </div>

      </div>
  )
}

export default Login