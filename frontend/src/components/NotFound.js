import React, { useEffect }  from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige a login o a notes si ya está autenticado
    navigate('/login'); // Cambia a '/notes' si prefieres redirigir a notas.
  }, [navigate]);

  return (
    <div>
      <h1>Página no encontrada</h1>
    </div>
  );
};

export default NotFound;
