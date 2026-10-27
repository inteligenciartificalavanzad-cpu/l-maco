import CrudModule from '../../components/CrudModule';
import { crearUsuario } from '../../services/authService';

const config = {
  id: 'usuarios',
  coleccion: 'usuarios',
  titulo: 'Usuarios',
  descripcion: 'Cuentas de acceso. Cada persona entra con su usuario y contraseña.',
  botonNuevo: 'Nuevo usuario',
  sinEliminar: true, // se desactivan, no se borran
  campos: [
    { n: 'nombre', et: 'Nombre completo', req: true, ancho: 'completo' },
    { n: 'usuario', et: 'Usuario (para ingresar)', req: true, soloCrear: true },
    { n: 'clave', et: 'Contraseña (mínimo 6)', t: 'password', req: true, soloCrear: true, noGuardar: true },
    { n: 'rol', et: 'Rol', t: 'select', req: true, op: ['admin', 'vendedor', 'repartidor'] },
    { n: 'activo', et: 'Activo', t: 'bool', def: true },
  ],
  // La contraseña la gestiona Firebase Authentication; nunca se guarda en Firestore.
  crear: (datos, v) => crearUsuario({ usuario: v.usuario, clave: v.clave, nombre: datos.nombre, rol: datos.rol, activo: datos.activo }),
  columnas: [
    { et: 'Nombre', k: 'nombre' },
    { et: 'Usuario', k: 'usuario' },
    { et: 'Rol', k: 'rol' },
    { et: 'Estado', f: (f) => (f.activo === false ? 'Inactivo' : 'Activo') },
  ],
};

export default function Usuarios() {
  return <CrudModule config={config} />;
}
