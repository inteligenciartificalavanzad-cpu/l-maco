import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function MainLayout() {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="app">
      <Sidebar abierto={abierto} cerrar={() => setAbierto(false)} />
      <div className="principal">
        <Header abrirMenu={() => setAbierto(true)} />
        <main className="contenido">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
