import { useState } from 'react';
import { listar } from '../../services/databaseService';
import { mensajeError } from '../../utils/errores';
import { hoy, kilos, soles, suma } from '../../utils/format';
import DataTable from '../../components/DataTable';

const primeroDeMes = () => hoy().slice(0, 8) + '01';

export default function Reportes() {
  const [desde, setDesde] = useState(primeroDeMes());
  const [hasta, setHasta] = useState(hoy());
  const [r, setR] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function generar() {
    setCargando(true);
    setError('');
    try {
      const dentro = (f) => f.fecha >= desde && f.fecha <= hasta;
      const [v, c, fin] = await Promise.all([listar('ventas'), listar('compras'), listar('finanzas')]);
      const ventas = v.filter(dentro), compras = c.filter(dentro), finanzas = fin.filter(dentro);
      const porProducto = {};
      ventas.forEach((x) => {
        const p = (porProducto[x.producto] ||= { id: x.producto, producto: x.producto, kg: 0, total: 0 });
        p.kg += Number(x.kg) || 0;
        p.total += Number(x.total) || 0;
      });
      setR({
        ventas: suma(ventas, 'total'),
        cobrado: suma(ventas, 'pagado'),
        kg: suma(ventas, 'kg'),
        compras: suma(compras, 'total'),
        ingresos: suma(finanzas.filter((f) => f.tipo === 'ingreso'), 'monto'),
        gastos: suma(finanzas.filter((f) => f.tipo === 'gasto'), 'monto'),
        productos: Object.values(porProducto).sort((a, b) => b.total - a.total),
      });
    } catch (e) {
      setError(mensajeError(e));
    }
    setCargando(false);
  }

  return (
    <section>
      <div className="barra"><div><h2>Reportes</h2><p className="sub">Resumen de ventas, compras y finanzas por rango de fechas.</p></div></div>
      <div className="filtros">
        <label>Desde<input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} /></label>
        <label>Hasta<input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} /></label>
        <button className="btn" onClick={generar} disabled={cargando}>{cargando ? 'Generando…' : 'Generar reporte'}</button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {r && (
        <>
          <div className="tarjetas">
            <div className="tarjeta"><span>Ventas</span><strong>{soles(r.ventas)}</strong><small>{kilos(r.kg)} vendidos · cobrado {soles(r.cobrado)}</small></div>
            <div className="tarjeta"><span>Compras de mercadería</span><strong>{soles(r.compras)}</strong><small>Ventas menos compras: {soles(r.ventas - r.compras)} (referencial)</small></div>
            <div className="tarjeta"><span>Ingresos y gastos registrados</span><strong>{soles(r.ingresos - r.gastos)}</strong><small>{soles(r.ingresos)} ingresos · {soles(r.gastos)} gastos</small></div>
          </div>
          <div className="panel">
            <h3>Ventas por producto</h3>
            <DataTable
              filas={r.productos}
              vacio="No hay ventas en este rango."
              columnas={[{ et: 'Producto', k: 'producto' }, { et: 'Cantidad', f: (f) => kilos(f.kg) }, { et: 'Total', f: (f) => soles(f.total) }]}
            />
          </div>
        </>
      )}
    </section>
  );
}
