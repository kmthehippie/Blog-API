import "../../styles/nav.scss"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { useEffect, useState } from "react"


const Nav = () => {
  
  const { auth } = useAuth()
  let userId = auth?.userId
  let username = auth?.username


  return (
    <nav>
        <div className='logo left-nav'>
            <Link to="/home"><h1>KM blogs</h1></Link>
        </div>
        <div className="right-nav">
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/posts">All Posts</Link></li>
                {/* Todo: If User is Logged IN, convert to a Logout button and SHOW the USER tab */}
                {!userId && <li className="log-btn"><Link to="/login">Login</Link></li>}
                {userId &&  (
                  <>
                  <li><Link to={`/user/${userId}`}>{username}</Link></li>
                  <li className="log-btn"><Link to={`/logout`}>Logout</Link></li>
                  </>
                ) }            
            </ul>
        </div>
    </nav>
  )
}

export default Nav
