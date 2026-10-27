import CrudModule from '../../components/CrudModule';
import { fechaCorta, kilos, sinGuiones } from '../../utils/format';
import { calcularStock } from '../../utils/stock';

const config = {
  id: 'inventario',
  coleccion: 'movimientos',
  titulo: 'Inventario',
  descripcion: 'Existencias por producto y movimientos. Las compras y ventas generan sus movimientos solas.',
  botonNuevo: 'Registrar movimiento',
  eliminarRoles: ['admin'],
  campos: [
    { n: 'fecha', et: 'Fecha', t: 'date', req: true, def: 'hoy' },
    {
      n: 'tipo', et: 'Tipo', t: 'select', req: true,
      op: [
        { v: 'entrada', l: 'Entrada' },
        { v: 'salida', l: 'Salida' },
        { v: 'merma', l: 'Merma' },
        { v: 'ajuste_mas', l: 'Ajuste (sumar)' },
        { v: 'ajuste_menos', l: 'Ajuste (restar)' },
      ],
    },
    { n: 'producto', et: 'Producto', t: 'ref', coleccion: 'catalogo', req: true, ancho: 'completo' },
    { n: 'kg', et: 'Cantidad (kg)', t: 'number', req: true },
    { n: 'nota', et: 'Nota', ancho: 'completo' },
  ],
  resumen: (filas) => {
    const stock = calcularStock(filas);
    const lista = Object.entries(stock).map(([p, kg]) => ({ et: 'Stock: ' + p, valor: kilos(kg) }));
    return lista.length ? lista : [{ et: 'Stock', valor: 'Sin movimientos' }];
  },
  columnas: [
    { et: 'Fecha', f: (f) => fechaCorta(f.fecha) },
    { et: 'Producto', k: 'producto' },
    { et: 'Tipo', f: (f) => sinGuiones(f.tipo) },
    { et: 'Cantidad', f: (f) => kilos(f.kg) },
    { et: 'Origen', f: (f) => f.origen || 'manual' },
    { et: 'Nota', k: 'nota' },
  ],
};

export default function Inventario() {
  return <CrudModule config={config} />;
}
