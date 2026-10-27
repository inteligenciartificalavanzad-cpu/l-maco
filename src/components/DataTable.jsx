import { useMemo, useState } from 'react';

// Tabla con búsqueda y paginación. Cada columna: { et, k } o { et, f: (fila) => texto }.
export default function DataTable({ columnas, filas, acciones, porPagina = 10, vacio = 'Aún no hay registros.' }) {
  const [texto, setTexto] = useState('');
  const [pagina, setPagina] = useState(0);

  const valor = (c, f) => String(c.f ? c.f(f) : f[c.k] ?? '');

  const filtradas = useMemo(() => {
    const t = texto.trim().toLowerCase();
    if (!t) return filas;
    return filas.filter((f) => columnas.some((c) => valor(c, f).toLowerCase().includes(t)));
  }, [texto, filas, columnas]);

  const paginas = Math.max(1, Math.ceil(filtradas.length / porPagina));
  const actual = Math.min(pagina, paginas - 1);
  const visibles = filtradas.slice(actual * porPagina, (actual + 1) * porPagina);

  return (
    <div className="tabla-caja">
      <input
        className="buscar"
        type="search"
        placeholder="Buscar…"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          setPagina(0);
        }}
      />
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              {columnas.map((c) => (
                <th key={c.et}>{c.et}</th>
              ))}
              {acciones && <th />}
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 && (
              <tr>
                <td colSpan={columnas.length + 1} className="vacio">
                  {texto ? 'No hay resultados para tu búsqueda.' : vacio}
                </td>
              </tr>
            )}
            {visibles.map((f) => (
              <tr key={f.id}>
                {columnas.map((c) => (
                  <td key={c.et} data-et={c.et}>{valor(c, f)}</td>
                ))}
                {acciones && <td className="acciones">{acciones(f)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginas > 1 && (
        <div className="paginas">
          <button className="btn-claro" disabled={actual === 0} onClick={() => setPagina(actual - 1)}>Anterior</button>
          <span>Página {actual + 1} de {paginas}</span>
          <button className="btn-claro" disabled={actual >= paginas - 1} onClick={() => setPagina(actual + 1)}>Siguiente</button>
        </div>
      )}
    </div>
  );
}
