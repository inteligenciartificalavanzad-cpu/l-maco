import { useEffect, useState } from 'react';
import { obtenerDoc, guardarDoc } from '../../services/databaseService';
import { mensajeError } from '../../utils/errores';

const VACIO = { nombre: 'LÍMCAR', ruc: '', telefono: '', direccion: '' };

export default function Configuracion() {
  const [v, setV] = useState(VACIO);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerDoc('config', 'empresa').then((d) => d && setV({ ...VACIO, ...d })).catch((e) => setError(mensajeError(e)));
  }, []);

  const campo = (n, et) => (
    <label>{et}<input value={v[n] || ''} onChange={(e) => setV({ ...v, [n]: e.target.value })} /></label>
  );

  async function guardar(e) {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      await guardarDoc('config', 'empresa', { nombre: v.nombre, ruc: v.ruc, telefono: v.telefono, direccion: v.direccion });
      setMsg('Datos guardados.');
    } catch (err) {
      setError(mensajeError(err));
    }
  }

  return (
    <section>
      <div className="barra"><div><h2>Configuración</h2><p className="sub">Datos de la empresa. Moneda: soles (S/).</p></div></div>
      <form className="panel form-simple" onSubmit={guardar}>
        {campo('nombre', 'Nombre de la empresa')}
        {campo('ruc', 'RUC')}
        {campo('telefono', 'Teléfono')}
        {campo('direccion', 'Dirección')}
        {error && <p className="error" role="alert">{error}</p>}
        {msg && <p className="ok">{msg}</p>}
        <div><button className="btn">Guardar cambios</button></div>
      </form>
    </section>
  );
}
