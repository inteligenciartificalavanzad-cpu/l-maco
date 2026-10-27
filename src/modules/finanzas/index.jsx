import CrudModule from '../../components/CrudModule';
import { fechaCorta, soles } from '../../utils/format';

const total = (filas, tipo) => filas.filter((f) => f.tipo === tipo).reduce((a, f) => a + (Number(f.monto) || 0), 0);

const config = {
  id: 'finanzas',
  coleccion: 'finanzas',
  titulo: 'Finanzas',
  descripcion: 'Ingresos y gastos de la empresa: cobros, pagos a proveedores, sueldos, combustible, etc.',
  botonNuevo: 'Nuevo movimiento',
  campos: [
    { n: 'fecha', et: 'Fecha', t: 'date', req: true, def: 'hoy' },
    { n: 'tipo', et: 'Tipo', t: 'select', req: true, op: ['ingreso', 'gasto'] },
    { n: 'categoria', et: 'Categoría', t: 'select', op: ['Cobro a cliente', 'Pago a proveedor', 'Sueldos y adelantos', 'Combustible', 'Alquiler', 'Servicios', 'Otros'] },
    { n: 'monto', et: 'Monto (S/)', t: 'number', req: true },
    { n: 'concepto', et: 'Concepto', ancho: 'completo' },
  ],
  resumen: (filas) => [
    { et: 'Ingresos', valor: soles(total(filas, 'ingreso')) },
    { et: 'Gastos', valor: soles(total(filas, 'gasto')) },
    { et: 'Balance', valor: soles(total(filas, 'ingreso') - total(filas, 'gasto')) },
  ],
  columnas: [
    { et: 'Fecha', f: (f) => fechaCorta(f.fecha) },
    { et: 'Tipo', k: 'tipo' },
    { et: 'Categoría', k: 'categoria' },
    { et: 'Concepto', k: 'concepto' },
    { et: 'Monto', f: (f) => soles(f.monto) },
  ],
};

export default function Finanzas() {
  return <CrudModule config={config} />;
}
