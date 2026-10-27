import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mensajeError } from '../utils/errores';

export default function LoginLayout() {
  const { perfil, entrar } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (perfil) return <Navigate to="/" replace />;

  async function enviar(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await entrar(usuario, clave);
    } catch (err) {
      setError(mensajeError(err));
      setEnviando(false);
    }
  }

  return (
    <div className="login">
      <div className="login-marca">
        <img src={import.meta.env.BASE_URL + 'logo.svg'} alt="" width="72" height="72" />
        <h1>LÍMCAR</h1>
        <p>Distribuidora de pollo pelado.<br />Pedidos, ventas, inventario y repartos en un solo lugar.</p>
      </div>
      <form className="login-form" onSubmit={enviar}>
        <h2>Iniciar sesión</h2>
        <label>
          Usuario
          <input value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" autoCapitalize="none" required />
        </label>
        <label>
          Contraseña
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" disabled={enviando}>{enviando ? 'Ingresando…' : 'Ingresar'}</button>
      </form>
    </div>
  );
}
