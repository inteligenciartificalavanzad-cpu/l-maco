import CrudModule from '../../components/CrudModule';

const config = {
  id: 'proveedores',
  coleccion: 'proveedores',
  titulo: 'Proveedores',
  descripcion: 'Granjas y proveedores que te abastecen.',
  botonNuevo: 'Nuevo proveedor',
  campos: [
    { n: 'nombre', et: 'Nombre o razón social', req: true, ancho: 'completo' },
    { n: 'ruc', et: 'RUC' },
    { n: 'contacto', et: 'Persona de contacto' },
    { n: 'telefono', et: 'Teléfono', t: 'tel' },
    { n: 'direccion', et: 'Dirección', ancho: 'completo' },
  ],
  columnas: [
    { et: 'Proveedor', k: 'nombre' },
    { et: 'RUC', k: 'ruc' },
    { et: 'Contacto', k: 'contacto' },
    { et: 'Teléfono', k: 'telefono' },
  ],
};

export default function Proveedores() {
  return <CrudModule config={config} />;
}
