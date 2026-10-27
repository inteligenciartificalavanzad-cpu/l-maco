import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MENU, puedeVer } from './config/menu';
import LoginLayout from './layouts/LoginLayout';
import MainLayout from './layouts/MainLayout';
import Inicio from './modules/inicio';
import Usuarios from './modules/usuarios';
import Trabajadores from './modules/trabajadores';
import Clientes from './modules/clientes';
import Catalogo from './modules/catalogo';
import Proveedores from './modules/proveedores';
import Compras from './modules/compras';
import Inventario from './modules/inventario';
import Pedidos from './modules/pedidos';
import Ventas from './modules/ventas';
import Repartos from './modules/repartos';
import Finanzas from './modules/finanzas';
import Reportes from './modules/reportes';
import Configuracion from './modules/configuracion';

const PAGINAS = {
  inicio: Inicio, usuarios: Usuarios, trabajadores: Trabajadores, clientes: Clientes,
  catalogo: Catalogo, proveedores: Proveedores, compras: Compras, inventario: Inventario,
  pedidos: Pedidos, ventas: Ventas, repartos: Repartos, finanzas: Finanzas,
  reportes: Reportes, configuracion: Configuracion,
};

function Protegido({ children }) {
  const { perfil, cargando } = useAuth();
  if (cargando) return <div className="pantalla-carga">Cargando…</div>;
  if (!perfil) return <Navigate to="/login" replace />;
  return children;
}

function Permiso({ id, children }) {
  const { perfil } = useAuth();
  return puedeVer(id, perfil.rol) ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginLayout />} />
          <Route path="/" element={<Protegido><MainLayout /></Protegido>}>
            {MENU.map((m) => {
              const Pagina = PAGINAS[m.id];
              const elemento = <Permiso id={m.id}><Pagina /></Permiso>;
              return m.ruta === '/' ? (
                <Route key={m.id} index element={elemento} />
              ) : (
                <Route key={m.id} path={m.ruta.slice(1)} element={elemento} />
              );
            })}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
