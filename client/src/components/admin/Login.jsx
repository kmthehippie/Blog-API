import {useState, useEffect, useRef} from 'react'
import "../../../styles/login.scss"
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axiosPrivate from "../../api/axios"
import useAuth from "../../hooks/useAuth"

const AdminLogin = () => {
    const { setAuth, persist, setPersist } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const usernameRef = useRef()
    const passwordRef = useRef()
    const errRef = useRef()

    useEffect(()=>{
        usernameRef.current.focus()
    }, [])

    useEffect(()=>{
        setErrMsg("")
    }, [username, password])

    const handleFocus = (ref) =>{
        const label = ref.current.parentElement.querySelector('label')
        label.style.top = "0";
        label.style.transition = "0.6s"
    }
    
    const handleBlur =(ref)=>{
        if(ref.current && !ref.current.value){
            ref.current.parentElement.querySelector('label').style.top = '50%';
        }}
        
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axiosPrivate.post(
                "/login", 
                JSON.stringify({ username, password }),
            {   
                headers: {"Content-Type": "application/json"},
                withCredentials: true
            })
            const accessToken = response?.data?.accessToken;
            const userTypes = response?.data?.userTypes;
            const userId = response?.data?.userId;
  
            setAuth({username, userId, userTypes, accessToken})
            setUsername("")
            setPassword("")
            navigate("/admin/dashboard")
        }catch(err){
            if(!err?.response){
                setErrMsg("No server response")
            }else if (err.response?.status === 400) {
                setErrMsg("Missing Username or Password")
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized")
            } else {
                setErrMsg("Login Failed")
            }
            errRef.current.focus()
        }
    }
   
    const togglePersist = () => {
        setPersist(prev => !prev)
    }

    useEffect(()=>{
        localStorage.setItem("persist", persist)
    }, [persist])
    
  return (
    <div className="login-bg">
        <div className="login">
            <h1>Admin Login</h1>
            <p ref={errRef} className={errMsg ? "errMsg": "offscreen"} aria-live="assertive">{errMsg}</p>
            <form onSubmit={handleSubmit}>
                <div className="username">
                    <label htmlFor="username">Username</label>
                    <input 
                    id="username"
                    type="text"
                    name="username" 
                    onChange={(e)=> (setUsername(e.target.value))} 
                    autoComplete="off"
                    value={username}
                    ref={usernameRef}
                    onFocus={()=>handleFocus(usernameRef)}
                    onBlur={()=>handleBlur(usernameRef)}
                    required
                    />
                    
                </div>
                <div className="password">
                    <label htmlFor="password">Password</label>
                    <input 
                    id="password"
                    type="password"
                    name="password" 
                    onChange={(e)=> (setPassword(e.target.value))} 
                    onFocus={() => handleFocus(passwordRef)} 
                    onBlur={() => handleBlur(passwordRef)}
                    value={password}
                    ref={passwordRef} // Ensure passwordRef is assigned here
                    required
                />

                </div>
                <button>Sign In</button>
                <div className="persist-div">
                <input 
                type="checkbox"
                id="persist"
                onChange={togglePersist}
                checked={persist} />
                <label htmlFor="persist">Remember this computer</label>
                </div>
                
            </form>
          
        </div>
    </div>
  )
}

export default AdminLogin