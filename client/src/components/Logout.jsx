import "../../styles/login.scss"
import { useNavigate, useLocation } from 'react-router-dom'
import { useLogout } from "../hooks/useLogout"
import "../../styles/logout.scss"

const Logout = () => {
    const logout = useLogout()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"
    
    const handleYes = async () => {
        await logout()
        navigate("/home")
    };
    
    const handleNo = () =>{
        console.log("No do not logout")
        navigate(from, {replace: true})
    }
  return (
    <div className="logout-bg">
        <div className="logout">
            <h4>Are you sure you want to logout?</h4>
            <button onClick={handleYes}>Yes</button><span className="space"></span>
            <button onClick={()=>handleNo()}>No</button>
        </div>
    </div>
  )
}

export default Logout

