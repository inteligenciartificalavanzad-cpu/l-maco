import CrudModule from '../../components/CrudModule';
import { fechaCorta, kilos, sinGuiones } from '../../utils/format';

const config = {
  id: 'pedidos',
  coleccion: 'pedidos',
  titulo: 'Pedidos',
  descripcion: 'Pedidos de clientes. No descuentan stock hasta que se registra la venta.',
  botonNuevo: 'Nuevo pedido',
  eliminarRoles: ['admin'],
  campos: [
    { n: 'fecha', et: 'Fecha de entrega', t: 'date', req: true, def: 'hoy' },
    { n: 'cliente', et: 'Cliente', t: 'ref', coleccion: 'clientes', req: true },
    { n: 'producto', et: 'Producto', t: 'ref', coleccion: 'catalogo', req: true },
    { n: 'kg', et: 'Cantidad (kg o unidades)', t: 'number', req: true },
    { n: 'estado', et: 'Estado', t: 'select', op: ['pendiente', 'preparado', 'en_reparto', 'entregado', 'cancelado'], def: 'pendiente' },
    { n: 'nota', et: 'Nota', ancho: 'completo' },
  ],
  columnas: [
    { et: 'Entrega', f: (f) => fechaCorta(f.fecha) },
    { et: 'Cliente', k: 'cliente' },
    { et: 'Producto', k: 'producto' },
    { et: 'Cantidad', f: (f) => kilos(f.kg) },
    { et: 'Estado', f: (f) => sinGuiones(f.estado) },
  ],
};

export default function Pedidos() {
  return <CrudModule config={config} />;
}
