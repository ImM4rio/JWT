import {
  createContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { User } from '../App';
import axios from 'axios';
import useAxiosInterceptors from '../config/axiosConfig';


export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export interface LoginResponse {
  message: string;
  user?: User;
  accessToken: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (username: string, password: string) => {

    try {
      const response = await axios.post<LoginResponse>(
        'http://localhost:3003/api/login',
        { name: username, password }
      );

      if (response.data.user) {
        setUser(response.data.user);
        setAccessToken(response.data.accessToken);
        setError(null)
      }

    } catch (err) {
      if( axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message)
      }
      else{
        setError('Error desconocido')
      }
    }
    finally {
      setLoading(false);
    }
  };

  const logout = () => {
    axios.post('http://localhost:3003/api/logout', {}, { withCredentials: true })
    .then(() => {
      setUser(null);
      setAccessToken(null);
    })
    .catch(error => {
      console.error('Logout error:', error);
      setUser(null);
      setAccessToken(null);
    });
  }

  useAxiosInterceptors(accessToken, setAccessToken, logout);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/verify-session', { withCredentials: true });
        if (response.data.user) {
          setUser(response.data.user);
          setAccessToken(response.data.accessToken);
        }
      } catch (err) {
        console.error('Session verification error:', err);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
