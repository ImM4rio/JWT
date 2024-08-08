import { useState } from 'react';
import { User } from '../App';
import axios from 'axios';


const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = () => {
    axios.get<User[]>('http://localhost:3003/api/users')
      .then((response) => { 
          setUsers(response.data);
      })
      .catch((error) => console.error(error));
  };



  return (
    <div>
      <div
        style={{
          gap: '1rem',
          width: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {users.length > 0 ? (
          <div>
            <h1>Users</h1>
            <ul>
              {users.map((user) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          ''
        )}
        <button onClick={getUsers}>Pedir usuarios</button>
      </div>
    </div>
  );
};

export default Users;
