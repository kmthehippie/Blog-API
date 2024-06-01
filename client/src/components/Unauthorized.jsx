import { useNavigate } from "react-router-dom"
import "../../styles/unauthorized.scss"
const Unauthorized = () => {
const navigate = useNavigate()
const goBack = () => navigate(-1)
  return (
    <div className="unauth">
      <h1>
        Unauthorized
      </h1>
      <p> You do not have access to the requested page.</p>
      <button onClick={goBack}>Go Back</button>
    </div>
  )
}

export default Unauthorized