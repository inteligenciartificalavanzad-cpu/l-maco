import { createContext, useContext, useEffect, useState } from 'react';
import { escucharSesion, obtenerPerfil, iniciarSesion, cerrarSesion } from '../services/authService';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(
    () =>
      escucharSesion(async (user) => {
        if (!user) {
          setPerfil(null);
        } else {
          try {
            const p = await obtenerPerfil(user.uid);
            setPerfil(p && p.activo !== false && p.rol ? p : null);
          } catch {
            setPerfil(null);
          }
        }
        setCargando(false);
      }),
    []
  );

  const entrar = async (usuario, clave) => setPerfil(await iniciarSesion(usuario, clave));
  const salir = async () => {
    await cerrarSesion();
    setPerfil(null);
  };

  return <Ctx.Provider value={{ perfil, cargando, entrar, salir }}>{children}</Ctx.Provider>;
}
