import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/Appcontext'

const Header = () => {

  const {userData} = useContext(AppContext)

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800 '>
      <img className='size-36 rounded-full mb-6' src={assets.header_img} alt="" />
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : 'Developer'}! <img className='w-8 aspect-square' src={assets.hand_wave} alt="" /></h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to Our App</h2>
      <p className='mb-8 max-w-md'>Let's start with a quick product and we get you up and running</p>
      <button className='border border-gray-500 px-8 py-2.5 hover:bg-gray-100 rounded-full transition-all'>Get Started</button>
    </div>
  )
}

export default Header
