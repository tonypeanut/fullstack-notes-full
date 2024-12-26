import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children }) => {
  const { token, setToken } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (isTokenExpired) {
          setToken(null); // Limpia el token del contexto
          localStorage.removeItem('token'); // Limpia el token almacenado
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setToken(null);
        localStorage.removeItem('token');
      }
    }
  }, [token, setToken]);

  if (!token || new Date(jwtDecode(token).exp * 1000) < new Date()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;