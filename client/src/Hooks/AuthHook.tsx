import { useContext } from 'react'
import { AuthContextType, AuthContext } from '../Context/AuthProvider'

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');

  return context;
}