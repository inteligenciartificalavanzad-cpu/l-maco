import CrudModule from '../../components/CrudModule';
import { fechaCorta, sinGuiones } from '../../utils/format';

const config = {
  id: 'repartos',
  coleccion: 'repartos',
  titulo: 'Repartos',
  descripcion: 'Entregas por fecha, chofer y vehículo. Anota devoluciones e incidencias.',
  botonNuevo: 'Nuevo reparto',
  eliminarRoles: ['admin'],
  campos: [
    { n: 'fecha', et: 'Fecha', t: 'date', req: true, def: 'hoy' },
    { n: 'chofer', et: 'Chofer', req: true },
    { n: 'vehiculo', et: 'Vehículo (placa)' },
    { n: 'cliente', et: 'Cliente', t: 'ref', coleccion: 'clientes', req: true, copiar: { direccion: 'direccion' } },
    { n: 'direccion', et: 'Dirección de entrega', ancho: 'completo' },
    { n: 'estado', et: 'Estado', t: 'select', op: ['programado', 'en_ruta', 'entregado', 'devuelto'], def: 'programado' },
    { n: 'incidencia', et: 'Incidencias o devoluciones', t: 'textarea', ancho: 'completo' },
  ],
  columnas: [
    { et: 'Fecha', f: (f) => fechaCorta(f.fecha) },
    { et: 'Chofer', k: 'chofer' },
    { et: 'Vehículo', k: 'vehiculo' },
    { et: 'Cliente', k: 'cliente' },
    { et: 'Dirección', k: 'direccion' },
    { et: 'Estado', f: (f) => sinGuiones(f.estado) },
  ],
};

export default function Repartos() {
  return <CrudModule config={config} />;
}
