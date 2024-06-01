import useAuth from './useAuth'
import axiosPrivate from "../api/axios"

export const useLogout = () => {
    const {setAuth} = useAuth()
    const logout = async()=>{
        setAuth({})
        try{
            const response = await axiosPrivate.post("/logout", {}, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true 
            });
            console.log(response.data);
        } catch(err) {
            if (err.response) {
                console.error(err.response.data);
                console.error(err.response.status);
                console.error(err.response.headers);
            } else {
                console.error(err.message);
            }
        }
    }
  return logout
}
