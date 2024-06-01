import { useState, useRef, useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import "../../styles/registration.scss"

const Registration = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const usernameRef = useRef()
  const passwordRef = useRef()
  const confirmpwRef = useRef()
  const emailRef = useRef()
  const errRef = useRef()
    
  useEffect(()=>{
      usernameRef.current.focus()
  }, [])

  useEffect(()=>{
      setErrors("")
  }, [])


  const handleFocus = (ref) =>{
    const label = ref.current.parentElement.querySelector('label')
    label.style.top = "0";
    label.style.transition = "0.6s"
}

const handleBlur =(ref)=>{
    if(ref.current && !ref.current.value){
        ref.current.parentElement.querySelector('label').style.top = '50%';
    }}
    


  const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    const newErrors = {};

    // Validation checks
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!pwPattern.test(password)) {
      newErrors.password = 'Password must be at least 8 characters long and contain at least one letter and one number';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Set errors if any, otherwise submit form
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        console.log('Form submitted:', formData);
        const response = await axiosPrivate.post(
          "/register", 
          JSON.stringify({ 
            "username": formData.username,
          "email": formData.email,
        "password": formData.password,
      "confirm_password": formData.confirmPassword }),
        {   
            headers: {"Content-Type": "application/json"},
            credentials: "include"
        });
        console.log(response.data)
        console.log(JSON.stringify(response))
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });                

        navigate("/login")
      } catch (error) {
        setErrors(error);
        console.log(error);
        errRef.current.focus()
      }
  
     
    }
  };

  return (
    <div className="registration-bg">
      <div className="registration">
      <form onSubmit={handleSubmit}>
      <div className='username'>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onFocus={()=> handleFocus(usernameRef)}
          onBlur={()=>handleBlur(usernameRef)}
          ref={usernameRef}
          autoComplete="off"
        />
        {errors.username && <p className="error">{errors.username}</p>}
      </div>
      <div className='email'>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={() => handleFocus(emailRef)} 
          onBlur={() => handleBlur(emailRef)}
          ref={emailRef} 
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>
      <div className='password'>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onFocus={() => handleFocus(passwordRef)} 
          onBlur={() => handleBlur(passwordRef)}
          ref={passwordRef}
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>
      <div className='cfm-password'>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onFocus={() => handleFocus(confirmpwRef)} 
          onBlur={() => handleBlur(confirmpwRef)}
          ref={confirmpwRef}
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
      </div>
      <button>Register</button>
    </form>
      </div>
    </div>
    
  );
};

export default Registration;
