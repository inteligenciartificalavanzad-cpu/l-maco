import CrudModule from '../../components/CrudModule';
import { fechaCorta, kilos, redondear, soles, suma } from '../../utils/format';

const config = {
  id: 'ventas',
  coleccion: 'ventas',
  titulo: 'Ventas',
  descripcion: 'Al guardar una venta, los kilos salen del inventario. Para registrar un cobro posterior, edita el monto pagado.',
  botonNuevo: 'Nueva venta',
  eliminarRoles: ['admin'],
  soloEditar: ['pagado'],
  campos: [
    { n: 'fecha', et: 'Fecha', t: 'date', req: true, def: 'hoy' },
    { n: 'cliente', et: 'Cliente', t: 'ref', coleccion: 'clientes', req: true },
    { n: 'producto', et: 'Producto', t: 'ref', coleccion: 'catalogo', req: true, copiar: { precio: 'precio' } },
    { n: 'kg', et: 'Cantidad (kg)', t: 'number', req: true },
    { n: 'precio', et: 'Precio aplicado (S/)', t: 'number', req: true },
    { n: 'metodo', et: 'Forma de pago', t: 'select', op: ['efectivo', 'yape_plin', 'transferencia', 'credito'], def: 'efectivo' },
    { n: 'pagado', et: 'Pagado (S/)', t: 'number', def: 0 },
  ],
  calcular: (v) => ({ total: redondear(v.kg * v.precio), saldo: redondear(v.kg * v.precio - v.pagado) }),
  derivados: [
    { n: 'total', et: 'Total de la venta', f: soles },
    { n: 'saldo', et: 'Saldo por cobrar', f: soles },
  ],
  movimiento: (d) => ({ fecha: d.fecha, producto: d.producto, productoId: d.productoId, tipo: 'salida', kg: d.kg, nota: 'Venta a ' + d.cliente }),
  resumen: (filas) => [
    { et: 'Total vendido', valor: soles(suma(filas, 'total')) },
    { et: 'Por cobrar', valor: soles(suma(filas, 'saldo')) },
  ],
  columnas: [
    { et: 'Fecha', f: (f) => fechaCorta(f.fecha) },
    { et: 'Cliente', k: 'cliente' },
    { et: 'Producto', k: 'producto' },
    { et: 'Cantidad', f: (f) => kilos(f.kg) },
    { et: 'Total', f: (f) => soles(f.total) },
    { et: 'Saldo', f: (f) => soles(f.saldo) },
  ],
};

export default function Ventas() {
  return <CrudModule config={config} />;
}
