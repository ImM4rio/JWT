import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3003; 

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const users = [
  { id: 1, name: 'Mario', password: '1234' },
  { id: 2, name: 'Yani', password: '1234' },
  { id: 3, name: 'Pampi', password: '1234' },
];

//---- GET ----\\
app.get('/api/users', (req: Request, res: Response) => {
  console.log('Request received for /api/user');
  const usersWithoutPassword = users.map(({ password, ...user }) => user);
  console.log('Responding with:', usersWithoutPassword);
  res.json(usersWithoutPassword);
});

app.get('/api/verify-session', (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No token found' });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    const { id, name } = decoded;

    // Optionally create a new access token
    const accessToken = jwt.sign({ id, name }, process.env.JWT_SECRET!, { expiresIn: '15m' });

    // Simulate user fetching from a database or user store
    const user = users.find(u => u.id === id);

    if (user) {
      res.json({ user: { id: user.id, name: user.name }, accessToken });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});


//---- POST ----\\
//=> Login example with refreshtoken and acces token
app.post('/api/login', (req: Request, res: Response) => {
  const { name, password } = req.body;
  console.log('Request received for /api/login with body:', req.body);

  if (!name || !password) {
    return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
  }

  const user = users.find(user => user.name === name);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // Generate JWT
  const accessToken = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET!, { expiresIn: '15m' });

  // Generate Refresh token
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

  // Refresh token in secure cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });

  res.json({ message: 'Login exitoso', user: { id: user.id, name: user.name }, accessToken });
});

app.post('/api/refresh-token', (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: 'Refresh no encontrado' });

  // Verify token
  jwt.verify(refreshToken, process.env.JWT_SECRET!, (error: any, decoded: any) => {

    if (error) return res.status(403).json({ message: 'Token no válido' })
    
    const { id, name } = decoded;

    // Generate new token
    const newAccessToken = jwt.sign({id, name}, process.env.JWT_SECRET!, { expiresIn: '15min' })

    // Optionally can create a new refresh token to update

    res.json({ accessToken: newAccessToken });

  });
});

app.post('/api/logout', (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict'
  });

  res.json({ message: 'Logout exitoso' })
}); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
