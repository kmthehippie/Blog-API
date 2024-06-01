import api from '../api/axios'
import useAuth from "./useAuth"

const useRefreshToken = () => {

    const {auth, setAuth} = useAuth();


    const refresh = async()=>{
            const response = await api.get("/refresh", {
                withCredentials: true
            })

            if(auth.username === undefined){
                let username = response?.data?.username
                let userId = response?.data?.userId
                let accessToken = response?.data?.accessToken
                let userTypes = response?.data?.userTypes
                setAuth({username, userId, userTypes, accessToken})
            } else {
                setAuth(prev => {
                    return { 
                        ...prev, 
                        userTypes: response.data.userTypes, 
                        accessToken: response.data.accessToken }
                })
            }
            
            return response.data.accessToken
        
    }
  return refresh

}

export default useRefreshToken