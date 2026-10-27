import { useEffect, useState } from 'react';
import DataTable from './DataTable';
import { useAuth } from '../context/AuthContext';
import { puedeEditar } from '../config/menu';
import { listar, crear, actualizar, eliminar, crearConMovimiento } from '../services/databaseService';
import { mensajeError } from '../utils/errores';
import { hoy } from '../utils/format';

const opcion = (o) => (typeof o === 'string' ? { v: o, l: o.replace(/_/g, ' ') } : o);

/*
 * Módulo genérico: tabla + formulario + guardado en Firestore.
 * Cada módulo solo describe sus campos y columnas (ver src/modules/*).
 */
export default function CrudModule({ config }) {
  const { perfil } = useAuth();
  const editable = puedeEditar(config.id, perfil.rol);
  const puedeBorrar = editable && !config.sinEliminar && (!config.eliminarRoles || config.eliminarRoles.includes(perfil.rol));

  const [filas, setFilas] = useState([]);
  const [refs, setRefs] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [errorForm, setErrorForm] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCargando(true);
    setError('');
    try {
      const colRefs = [...new Set(config.campos.filter((c) => c.t === 'ref').map((c) => c.coleccion))];
      const [datos, ...listas] = await Promise.all([listar(config.coleccion), ...colRefs.map(listar)]);
      setFilas(datos);
      setRefs(Object.fromEntries(colRefs.map((c, i) => [c, listas[i]])));
    } catch (e) {
      setError(mensajeError(e));
    }
    setCargando(false);
  }
  useEffect(() => {
    cargar();
  }, [config.coleccion]);

  const aNumeros = (v) => {
    const r = { ...v };
    config.campos.filter((c) => c.t === 'number').forEach((c) => (r[c.n] = Number(v[c.n]) || 0));
    return r;
  };

  function nuevo() {
    const v = {};
    config.campos.forEach((c) => (v[c.n] = c.def === 'hoy' ? hoy() : c.def ?? ''));
    setErrorForm('');
    setModal({ modo: 'nuevo', valores: v });
  }
  function editar(fila) {
    setErrorForm('');
    setModal({ modo: 'editar', id: fila.id, valores: { ...fila } });
  }

  function cambiar(c, valor) {
    setModal((m) => {
      const v = { ...m.valores };
      if (c.t === 'ref') {
        const o = (refs[c.coleccion] || []).find((x) => x.id === valor);
        v[c.n + 'Id'] = valor;
        v[c.n] = o ? o[c.mostrar || 'nombre'] : '';
        if (o && c.copiar) Object.entries(c.copiar).forEach(([dest, orig]) => (v[dest] = o[orig] ?? ''));
      } else if (c.t === 'bool') {
        v[c.n] = valor === 'true';
      } else {
        v[c.n] = valor;
      }
      return { ...m, valores: v };
    });
  }

  async function guardar(e) {
    e.preventDefault();
    const v = modal.valores;
    const editando = modal.modo === 'editar';
    const falta = config.campos.find(
      (c) => c.req && !(editando && c.soloCrear) && (c.t === 'ref' ? !v[c.n + 'Id'] : v[c.n] === '' || v[c.n] == null)
    );
    if (falta) return setErrorForm(`Completa el campo: ${falta.et}`);

    const base = aNumeros(v);
    const datos = {};
    config.campos.forEach((c) => {
      if (c.noGuardar || (editando && c.soloCrear)) return;
      datos[c.n] = base[c.n];
      if (c.t === 'ref') datos[c.n + 'Id'] = v[c.n + 'Id'] || '';
    });
    if (config.calcular) Object.assign(datos, config.calcular(base));

    setGuardando(true);
    setErrorForm('');
    try {
      if (editando) await actualizar(config.coleccion, modal.id, datos);
      else if (config.crear) await config.crear(datos, v);
      else if (config.movimiento) await crearConMovimiento(config.coleccion, datos, config.movimiento(datos));
      else await crear(config.coleccion, datos);
      setModal(null);
      await cargar();
    } catch (err) {
      setErrorForm(mensajeError(err));
    }
    setGuardando(false);
  }

  async function borrar(fila) {
    if (!window.confirm('¿Eliminar este registro? No se puede deshacer.')) return;
    try {
      await eliminar(config.coleccion, fila.id, !!config.movimiento);
      await cargar();
    } catch (e) {
      setError(mensajeError(e));
    }
  }

  const derivados = modal && config.calcular ? config.calcular(aNumeros(modal.valores)) : {};

  return (
    <section>
      <div className="barra">
        <div>
          <h2>{config.titulo}</h2>
          {config.descripcion && <p className="sub">{config.descripcion}</p>}
        </div>
        {editable && (
          <button className="btn" onClick={nuevo}>
            {config.botonNuevo || 'Nuevo registro'}
          </button>
        )}
      </div>

      {config.resumen && !cargando && (
        <div className="resumen">
          {config.resumen(filas).map((r) => (
            <div key={r.et} className="chip">
              <span>{r.et}</span>
              <strong>{r.valor}</strong>
            </div>
          ))}
        </div>
      )}

      {error && <p className="error" role="alert">{error}</p>}

      {cargando ? (
        <p className="sub">Cargando…</p>
      ) : (
        <DataTable
          columnas={config.columnas}
          filas={filas}
          acciones={
            editable
              ? (f) => (
                  <>
                    <button className="btn-claro" onClick={() => editar(f)}>Editar</button>
                    {puedeBorrar && <button className="btn-peligro" onClick={() => borrar(f)}>Eliminar</button>}
                  </>
                )
              : null
          }
        />
      )}

      {modal && (
        <div className="velo" onMouseDown={(e) => e.target === e.currentTarget && setModal(null)}>
          <form className="modal" onSubmit={guardar}>
            <h3>{modal.modo === 'nuevo' ? config.botonNuevo || 'Nuevo registro' : 'Editar registro'}</h3>
            {config.soloEditar && modal.modo === 'editar' && (
              <p className="sub">Para cuidar el inventario, aquí solo se puede actualizar: {config.soloEditar.join(', ')}.</p>
            )}
            <div className="campos">
              {config.campos.map((c) => {
                const off = modal.modo === 'editar' && (c.soloCrear || (config.soloEditar && !config.soloEditar.includes(c.n)));
                if (modal.modo === 'editar' && c.noGuardar) return null;
                const val = modal.valores[c.n] ?? '';
                let input;
                if (c.t === 'select' || c.t === 'bool') {
                  const ops = c.t === 'bool' ? [{ v: 'true', l: 'Sí' }, { v: 'false', l: 'No' }] : c.op.map(opcion);
                  input = (
                    <select disabled={off} value={String(val)} onChange={(e) => cambiar(c, e.target.value)}>
                      {c.t === 'select' && <option value="">Selecciona…</option>}
                      {ops.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  );
                } else if (c.t === 'ref') {
                  input = (
                    <select disabled={off} value={modal.valores[c.n + 'Id'] || ''} onChange={(e) => cambiar(c, e.target.value)}>
                      <option value="">Selecciona…</option>
                      {(refs[c.coleccion] || []).map((o) => (
                        <option key={o.id} value={o.id}>{o[c.mostrar || 'nombre']}</option>
                      ))}
                    </select>
                  );
                } else if (c.t === 'textarea') {
                  input = <textarea rows="2" disabled={off} value={val} onChange={(e) => cambiar(c, e.target.value)} />;
                } else {
                  input = (
                    <input
                      type={c.t || 'text'}
                      step={c.t === 'number' ? c.paso || '0.01' : undefined}
                      min={c.t === 'number' ? '0' : undefined}
                      autoComplete={c.t === 'password' ? 'new-password' : 'off'}
                      disabled={off}
                      value={val}
                      onChange={(e) => cambiar(c, e.target.value)}
                    />
                  );
                }
                return (
                  <label key={c.n} className={c.ancho === 'completo' ? 'completo' : ''}>
                    {c.et}{c.req ? ' *' : ''}
                    {input}
                  </label>
                );
              })}
              {config.derivados?.map((d) => (
                <label key={d.n}>
                  {d.et}
                  <input readOnly value={d.f(derivados[d.n])} />
                </label>
              ))}
            </div>
            {errorForm && <p className="error" role="alert">{errorForm}</p>}
            <div className="modal-pie">
              <button type="button" className="btn-claro" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
