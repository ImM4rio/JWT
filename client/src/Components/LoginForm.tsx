import styles from './LoginForm.module.css';

import { useState } from 'react';
import { useAuth } from '../Hooks/AuthHook';

const LoginForm: React.FC = () => {
  const { user, login, logout, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(username, password);
 
      
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      {user ? (
        <div>
          <div>Bienvenido {user.name}</div>
          <button type='button' onClick={logout}>Cerrar Sesión</button>
        </div>
      ) : (
        <div>
          <div className={styles.inputGroup}>
            <label htmlFor='username'>Nombre de usuario:</label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='password'>Contraseña:</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type='submit'>Iniciar sesión</button>
          {error && <p style={{ color: 'red', textWrap: 'nowrap' }}>{error}</p>}
        </div>
      )}
    </form>
  );
};

export default LoginForm;
