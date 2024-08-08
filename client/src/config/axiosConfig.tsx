import { useEffect, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import { LoginResponse } from '../Context/AuthProvider';

axios.defaults.withCredentials = true;

const useAxiosInterceptors = ( accessToken: string | null, setAccessToken: (token: string) => void, logout: () => void ) => {

  const refreshingToken = useRef<Promise<AxiosResponse<LoginResponse>> | null>(null);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async config => {
        const token = accessToken; 
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      response => {
        if(response.config.url?.includes('refresh-token')) {
          const token = response.data.accessToken;
          if(token) setAccessToken(token)
        } 
        return response
      },
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !(originalRequest.url.includes('/api/login') || originalRequest.url.includes('api/verify-session')))  {
          if (refreshingToken.current) {
            await refreshingToken.current;
            return axios(originalRequest);
          }

          originalRequest._retry = true;
          try {

            refreshingToken.current = axios.post<LoginResponse>('http://localhost:3003/api/refresh-token', {}, { withCredentials: true })
            const response = await refreshingToken.current;
            setAccessToken(response.data.accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
            refreshingToken.current = null;
            console.log(originalRequest.headers['Authorization'])
          
            return axios(originalRequest);
            
          } catch (refreshError) {
         
            logout();
            refreshingToken.current = null;
            return Promise.reject(refreshError);
          
          } 
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [setAccessToken, logout, accessToken]);
};

export default useAxiosInterceptors;
