import { NavLink } from 'react-router-dom';
import { menuPara } from '../config/menu';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ abierto, cerrar }) {
  const { perfil, salir } = useAuth();
  return (
    <>
      {abierto && <div className="cortina" onClick={cerrar} />}
      <aside className={'sidebar' + (abierto ? ' abierto' : '')}>
        <div className="marca">
          <img src={import.meta.env.BASE_URL + 'logo.svg'} alt="" width="38" height="38" />
          <div>
            <strong>LÍMCAR</strong>
            <span>Pollo pelado</span>
          </div>
        </div>
        <nav>
          {menuPara(perfil.rol).map((m) => (
            <NavLink key={m.id} to={m.ruta} end={m.ruta === '/'} onClick={cerrar}>
              {m.nombre}
            </NavLink>
          ))}
        </nav>
        <button className="salir" onClick={salir}>Cerrar sesión</button>
      </aside>
    </>
  );
}
