import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './Hooks/AuthHook';
import LoginForm from './Components/LoginForm'
import Users from './Components/Users';

export interface User {
  id: number;
  name: string;
}

const App : React.FC = () => {

  axios.defaults.withCredentials = true;

  const { user, loading } = useAuth();

  if(loading) {
    return <p>Cargando ...</p>
  } 



  return (
    <div className='App'>
      <LoginForm />
      {user ? (<Users/>) : ("")}
    </div>
  )
}

export default App;
