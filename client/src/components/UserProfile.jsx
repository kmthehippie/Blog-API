import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useState, useEffect } from 'react'
import "../../styles/userprofile.scss"
import { Link } from "react-router-dom"
import Unauthorized from "./Unauthorized"


const UserProfile = () => {
  const { auth } = useAuth()
  const userId = auth?.userId
  const [user, setUser] = useState()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const getUserProfile = async () => {
      try {
        const response = await axiosPrivate.get(`/user/${userId}`, {
          signal: controller.signal
        }) 
        console.log(response)
        isMounted && setUser(response.data)
      } catch (err) {
        console.error(err)
      }
    }

    getUserProfile()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  return (
    <>
      {user && userId === user._id ? (
        <div className="userprofile-bg">
          <div className="userprofile-header">
          <h1>Hi, {user.username} </h1>
          <p>Welcome to your profile</p>
          </div>
          
          <div className="username">
          <h4>Username:<span className="info">  {user.username}</span>
          </h4>
          
          </div>

          <div className="email">
          <h4>Email Address:  <span className="info">  {user.email}</span>
          </h4>
         
          </div>

          <br/>
          <button><Link to={`/user/${userId}/update`}>Update</Link></button>
          
        </div>
      ) : (
        <Unauthorized />
      )}
    </>
  )
}

export default UserProfile
