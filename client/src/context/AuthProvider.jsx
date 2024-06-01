import {createContext, useState} from 'react'

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
 
    const [auth, setAuth] = useState({})
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false)
    const [isModalActive, setIsModalActive] = useState(false)
    const openModal = ()=>{
      setIsModalActive(true)
    }
    const closeModal = ()=>{
      setIsModalActive(false)
    }
    return (
    <AuthContext.Provider value={{auth, setAuth, persist, setPersist, isModalActive, openModal, closeModal}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext