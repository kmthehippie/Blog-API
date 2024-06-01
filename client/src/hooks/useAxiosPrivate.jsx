import { axiosPrivate } from '../api/axios';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {
        const requestInt = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseInt = axiosPrivate.interceptors.response.use(
            response => {return response},
            async (error) => {
                const prevReq = error?.config;
                if (error?.response?.status === 401 && !prevReq?.sent) {
                    prevReq.sent = true;
                    // const newAccessToken = await refresh();
                    // prevReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    // return axiosPrivate(prevReq);
                    try {
                        const newAccessToken = await refresh();
                        prevReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevReq);
                    } catch (err) {
                        setAuth({});
                        location?.pathname.includes("admin") ? navigate('/admin', { replace: true }) :
                        navigate('/login', { replace: true });
                        return Promise.reject(err);
                    }
                }
                if (error?.response?.status === 403 && !prevReq?.sent) {
                    prevReq.sent = true;
                    // setAuth({});
                    // navigate('/login', { replace: true });
                    navigate('/unauthorized', { replace: true }); // Navigate to unauthorized page
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestInt);
            axiosPrivate.interceptors.response.eject(responseInt);
        };
    }, [auth, refresh, navigate, setAuth]);

    return axiosPrivate;
};

export default useAxiosPrivate;
