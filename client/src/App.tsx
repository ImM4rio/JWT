import { useAuth } from './Hooks/AuthHook';
import LoginForm from './Components/LoginForm'
import Users from './Components/Users';
import { useState } from 'react';
import axios from 'axios';
import { LoginResponse } from './Context/AuthProvider';

export interface User {
  id: number;
  name: string;
}

const App : React.FC = () => {

  const { user, loading } = useAuth();
  const [token, setToken] = useState<string | null>(null);


  const updateToken = async () => {
      const result = await axios.post<LoginResponse>('http://localhost:3003/api/refresh-token', {}, { withCredentials: true });
      setToken(result.data.accessToken);
  };

  if(loading) {
    return <p>Cargando ...</p>
  } 



  return (
    <div className='App'>
      <LoginForm />
      {user ? (<Users/>) : ("")}
      <button onClick={updateToken}>Nuevo token</button>
      <p style={{ fontSize: '.7rem' }}>{token}</p>

    </div>
  )
}

export default App;
