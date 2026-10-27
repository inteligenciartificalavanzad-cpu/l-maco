import CrudModule from '../../components/CrudModule';
import { soles } from '../../utils/format';

const config = {
  id: 'catalogo',
  coleccion: 'catalogo',
  titulo: 'Catálogo',
  descripcion: 'Pollo pelado con cola y sin cola, trozos y menudencias. Cada venta guarda el precio del momento.',
  botonNuevo: 'Nuevo producto',
  campos: [
    { n: 'nombre', et: 'Nombre del producto', req: true, ancho: 'completo' },
    {
      n: 'categoria', et: 'Categoría', t: 'select', req: true,
      op: ['Pollo pelado con cola', 'Pollo pelado sin cola', 'Trozos', 'Menudencias'],
    },
    { n: 'unidad', et: 'Unidad de venta', t: 'select', req: true, op: ['kg', 'unidad'], def: 'kg' },
    { n: 'detalle', et: 'Detalle (rango de peso, corte, etc.)', ancho: 'completo' },
    { n: 'precio', et: 'Precio por unidad (S/)', t: 'number', req: true },
    { n: 'activo', et: 'Activo', t: 'bool', def: true },
  ],
  columnas: [
    { et: 'Producto', k: 'nombre' },
    { et: 'Categoría', k: 'categoria' },
    { et: 'Detalle', k: 'detalle' },
    { et: 'Unidad', k: 'unidad' },
    { et: 'Precio', f: (f) => soles(f.precio) },
    { et: 'Estado', f: (f) => (f.activo === false ? 'Inactivo' : 'Activo') },
  ],
};

export default function Catalogo() {
  return <CrudModule config={config} />;
}
