// Menú lateral y permisos por rol.
// ver: roles que pueden entrar al módulo · editar: roles que pueden crear/modificar.
const TODOS = ['admin', 'vendedor', 'repartidor'];
const ADMIN = ['admin'];
const VENTA = ['admin', 'vendedor'];

export const ROLES = ['admin', 'vendedor', 'repartidor'];

export const MENU = [
  { id: 'inicio', ruta: '/', nombre: 'Inicio', ver: TODOS, editar: [] },
  { id: 'usuarios', ruta: '/usuarios', nombre: 'Usuarios', ver: ADMIN, editar: ADMIN },
  { id: 'trabajadores', ruta: '/trabajadores', nombre: 'Trabajadores', ver: ADMIN, editar: ADMIN },
  { id: 'clientes', ruta: '/clientes', nombre: 'Clientes', ver: TODOS, editar: VENTA },
  { id: 'catalogo', ruta: '/catalogo', nombre: 'Catálogo', ver: TODOS, editar: ADMIN },
  { id: 'proveedores', ruta: '/proveedores', nombre: 'Proveedores', ver: ADMIN, editar: ADMIN },
  { id: 'compras', ruta: '/compras', nombre: 'Compras', ver: ADMIN, editar: ADMIN },
  { id: 'inventario', ruta: '/inventario', nombre: 'Inventario', ver: VENTA, editar: ADMIN },
  { id: 'pedidos', ruta: '/pedidos', nombre: 'Pedidos', ver: TODOS, editar: VENTA },
  { id: 'ventas', ruta: '/ventas', nombre: 'Ventas', ver: VENTA, editar: VENTA },
  { id: 'repartos', ruta: '/repartos', nombre: 'Repartos', ver: TODOS, editar: TODOS },
  { id: 'finanzas', ruta: '/finanzas', nombre: 'Finanzas', ver: ADMIN, editar: ADMIN },
  { id: 'reportes', ruta: '/reportes', nombre: 'Reportes', ver: ADMIN, editar: ADMIN },
  { id: 'configuracion', ruta: '/configuracion', nombre: 'Configuración', ver: ADMIN, editar: ADMIN },
];

export const menuPara = (rol) => MENU.filter((m) => m.ver.includes(rol));
export const puedeVer = (id, rol) => !!MENU.find((m) => m.id === id)?.ver.includes(rol);
export const puedeEditar = (id, rol) => !!MENU.find((m) => m.id === id)?.editar.includes(rol);
