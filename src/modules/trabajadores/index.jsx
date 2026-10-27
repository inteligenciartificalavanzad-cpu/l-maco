import CrudModule from '../../components/CrudModule';
import { soles } from '../../utils/format';

const config = {
  id: 'trabajadores',
  coleccion: 'trabajadores',
  titulo: 'Trabajadores',
  descripcion: 'Personal de la empresa.',
  botonNuevo: 'Nuevo trabajador',
  campos: [
    { n: 'nombre', et: 'Nombre completo', req: true, ancho: 'completo' },
    { n: 'dni', et: 'DNI' },
    { n: 'telefono', et: 'Teléfono', t: 'tel' },
    { n: 'cargo', et: 'Cargo', t: 'select', op: ['chofer', 'ayudante', 'vendedor', 'almacén', 'administración', 'otro'] },
    { n: 'sueldo', et: 'Sueldo (S/)', t: 'number' },
    { n: 'ingreso', et: 'Fecha de ingreso', t: 'date' },
    { n: 'estado', et: 'Estado', t: 'select', op: ['activo', 'inactivo'], def: 'activo' },
  ],
  columnas: [
    { et: 'Nombre', k: 'nombre' },
    { et: 'DNI', k: 'dni' },
    { et: 'Cargo', k: 'cargo' },
    { et: 'Teléfono', k: 'telefono' },
    { et: 'Sueldo', f: (f) => soles(f.sueldo) },
    { et: 'Estado', k: 'estado' },
  ],
};

export default function Trabajadores() {
  return <CrudModule config={config} />;
}
