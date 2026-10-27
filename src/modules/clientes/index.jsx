import CrudModule from '../../components/CrudModule';

const config = {
  id: 'clientes',
  coleccion: 'clientes',
  titulo: 'Clientes',
  descripcion: 'Registra y busca a tus clientes por nombre, teléfono o zona.',
  botonNuevo: 'Nuevo cliente',
  campos: [
    { n: 'nombre', et: 'Nombre o razón social', req: true, ancho: 'completo' },
    { n: 'telefono', et: 'Teléfono', t: 'tel' },
    { n: 'provincia', et: 'Provincia' },
    { n: 'distrito', et: 'Distrito' },
    { n: 'zona', et: 'Zona' },
    { n: 'direccion', et: 'Dirección', ancho: 'completo' },
  ],
  columnas: [
    { et: 'Nombre', k: 'nombre' },
    { et: 'Teléfono', k: 'telefono' },
    { et: 'Distrito', k: 'distrito' },
    { et: 'Zona', k: 'zona' },
    { et: 'Dirección', k: 'direccion' },
  ],
};

export default function Clientes() {
  return <CrudModule config={config} />;
}
