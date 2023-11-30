import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { axiosPrivate } from "../api/axios";

const useAxiosPrivate = () => {
    const token = Cookies.get('jwt');

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
        }
    }, [token])

    return axiosPrivate;
}

export default useAxiosPrivate;