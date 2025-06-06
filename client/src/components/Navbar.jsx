import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/Appcontext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
const Navbar = () => {

    const navigate = useNavigate()

    const {setIsLoggedIn, userData, setUserData, backendUrl} = useContext(AppContext)

    const sendVerificationOtp = async () => {

      try {
        axios.defaults.withCredentials = true

        const {data} = await axios.post(backendUrl + "/api/auth/send-verify-otp")
        if(data.success){
          navigate("/verify")
          toast.success(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }

    }

    const logOut = async () => {

      try {
        axios.defaults.withCredentials = true
         
        const {data} = await axios.post(backendUrl + "/api/auth/logout")
        data.success && setIsLoggedIn(false)
        data.success && setUserData(false)
          navigate("/")
      } catch (error) {
         toast.error(error.message)
      }

    }

  return (
    <div className='flex justify-between items-center sm:p-6 sm:px-24 p-4 w-full absolute top-0'>
      <img src={assets.logo} alt="" className='w-28 sm:w-32'/>

{userData ? 
<div className='size-8 flex justify-center items-center rounded-full bg-black relative text-white group'>{userData.name[0].toUpperCase()}

<div className='hidden absolute group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
  <ul className='list-none bg-gray-100 text-sm m-0 p-2'>
    {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify email</li>
}
    <li onClick={logOut} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
  </ul>
</div>

</div> :  <button onClick={() => navigate("/login")} className='flex items-center gap-2 border border-gray-500 px-6 py-2 rounded-full text-gray-800 transition-all hover:bg-gray-100  '>Login <img src={assets.arrow_icon} alt="" /></button>
}
    
    </div>
  )
}

export default Navbar
