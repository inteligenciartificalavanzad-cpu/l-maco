import CrudModule from '../../components/CrudModule';
import { fechaCorta, kilos, redondear, soles, suma } from '../../utils/format';

const config = {
  id: 'compras',
  coleccion: 'compras',
  titulo: 'Compras',
  descripcion: 'Al guardar una compra, los kilos entran al inventario automáticamente.',
  botonNuevo: 'Nueva compra',
  eliminarRoles: ['admin'],
  soloEditar: ['pagado'],
  campos: [
    { n: 'fecha', et: 'Fecha', t: 'date', req: true, def: 'hoy' },
    { n: 'proveedor', et: 'Proveedor', t: 'ref', coleccion: 'proveedores', req: true },
    { n: 'producto', et: 'Producto', t: 'ref', coleccion: 'catalogo', req: true, ancho: 'completo' },
    { n: 'kg', et: 'Kilos recibidos', t: 'number', req: true },
    { n: 'costo', et: 'Costo por kilo (S/)', t: 'number', req: true },
    { n: 'pagado', et: 'Pagado (S/)', t: 'number', def: 0 },
  ],
  calcular: (v) => ({ total: redondear(v.kg * v.costo), saldo: redondear(v.kg * v.costo - v.pagado) }),
  derivados: [
    { n: 'total', et: 'Total de la compra', f: soles },
    { n: 'saldo', et: 'Saldo por pagar', f: soles },
  ],
  movimiento: (d) => ({ fecha: d.fecha, producto: d.producto, productoId: d.productoId, tipo: 'entrada', kg: d.kg, nota: 'Compra a ' + d.proveedor }),
  resumen: (filas) => [
    { et: 'Total comprado', valor: soles(suma(filas, 'total')) },
    { et: 'Por pagar a proveedores', valor: soles(suma(filas, 'saldo')) },
  ],
  columnas: [
    { et: 'Fecha', f: (f) => fechaCorta(f.fecha) },
    { et: 'Proveedor', k: 'proveedor' },
    { et: 'Producto', k: 'producto' },
    { et: 'Cantidad', f: (f) => kilos(f.kg) },
    { et: 'Total', f: (f) => soles(f.total) },
    { et: 'Saldo', f: (f) => soles(f.saldo) },
  ],
};

export default function Compras() {
  return <CrudModule config={config} />;
}
