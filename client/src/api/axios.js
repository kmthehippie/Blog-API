import axios from "axios"

const BASE_URL = "0.0.0.0:3000"

export default axios.create({
    baseURL : BASE_URL,

})

export const axiosPrivate = axios.create({
    baseURL : BASE_URL,
    headers: {'Content-Type': "application/json"},
    withCredentials: true
})
