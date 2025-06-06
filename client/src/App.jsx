import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import VerifyEmail from './pages/VerifyEmail'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import {ToastContainer} from 'react-toastify'
// import 'react-toastify/dist/ReactToasify.css'

const App = () => {
  return (
    <>

    <ToastContainer />
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/verify' element={<VerifyEmail />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/reset-password' element={<ResetPassword />}/>
    </Routes>
    </>
  )
}

export default App
