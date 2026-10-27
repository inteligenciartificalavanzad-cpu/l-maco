import { useLocation } from 'react-router-dom';
import { MENU } from '../config/menu';
import { useAuth } from '../context/AuthContext';

export default function Header({ abrirMenu }) {
  const { perfil } = useAuth();
  const { pathname } = useLocation();
  const actual = MENU.find((m) => m.ruta === pathname);
  return (
    <header className="header">
      <button className="hamburguesa" onClick={abrirMenu} aria-label="Abrir menú">Menú</button>
      <h1>{actual?.nombre || 'LÍMCAR'}</h1>
      <div className="usuario">
        <strong>{perfil.nombre || perfil.usuario}</strong>
        <span>{perfil.rol}</span>
      </div>
    </header>
  );
}
