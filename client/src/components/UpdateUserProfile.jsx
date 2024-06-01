import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth"
import "../../styles/update-userprofile.scss"
import Unauthorized from "./Unauthorized"

const UpdateUserProfile = () => {
  const axiosPrivate = useAxiosPrivate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const { auth } = useAuth()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const fetchUserData = async () => {
      try {
        const response = await axiosPrivate.get(`/user/${auth.userId}`);
        const userData = response.data;
        isMounted && setFormData({
          username: userData.username,
          email: userData.email,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
    return () => {
      isMounted = false
      controller.abort()
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateUser = async()=>{
      try{
        const response = await axiosPrivate.patch(
          `/user/${auth.userId}/update`,
          JSON.stringify({ 
            username: formData.username,
            email: formData.email
           }),
        {
          headers: { "Content-Type": "application/json"},
          credentials: "include"
        })
      } catch (err) {
        console.error(err)
      }
    }
    updateUser()
   
  };

  return (
    <>
    {(formData.username !== "") ? (
      <div className="updateuserprofile-bg">
    <div className="updateuserprofile">    
    <h1>Update User Profile</h1>
    <form onSubmit={e => {handleSubmit(e)}}>
      <div className="username">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="email">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Update Profile</button>
    </form>
    </div>
  </div>) 
  : <Unauthorized/>}
      </>
  );

}

export default UpdateUserProfile;
