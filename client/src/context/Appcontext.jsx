import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppcontextProvider = ({children}) => {


    axios.defaults.withCredentials = true

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)


    // function to refresh and check if user is-auth i.e if user logged in and token is provided in the cookies
    const getAuthState = async () => {

        try {
            const {data} = await axios.get(backendUrl + "/api/auth/is-auth")
            if(data.success){
                setIsLoggedIn(true)
                getUserData()
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    const getUserData = async () => {

        try {
            const {data} = await axios.get(backendUrl + "/api/user/data")
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }

    }

    const value = {
     backendUrl,
     isLoggedIn,
     setIsLoggedIn,
     userData,
     setUserData,
     getUserData
    }

    useEffect(() => {
     getAuthState()
    }, [])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppcontextProvider
