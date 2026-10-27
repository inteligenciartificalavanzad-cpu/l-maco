import { useEffect, useState } from 'react';
import { listar } from '../../services/databaseService';
import { fechaCorta, hoy, kilos, soles, suma } from '../../utils/format';
import { calcularStock } from '../../utils/stock';
import DataTable from '../../components/DataTable';

const seguro = async (c) => {
  try {
    return await listar(c);
  } catch {
    return null; // el rol actual no tiene acceso a esa colección
  }
};

export default function Inicio() {
  const [d, setD] = useState(null);

  useEffect(() => {
    Promise.all([seguro('ventas'), seguro('pedidos'), seguro('movimientos')]).then(([ventas, pedidos, mov]) =>
      setD({ ventas, pedidos, mov })
    );
  }, []);

  if (!d) return <p className="sub">Cargando…</p>;

  const tarjetas = [];
  if (d.ventas) {
    const delDia = d.ventas.filter((v) => v.fecha === hoy());
    tarjetas.push({ et: 'Ventas de hoy', valor: soles(suma(delDia, 'total')), sub: `${delDia.length} ventas registradas` });
    tarjetas.push({ et: 'Por cobrar', valor: soles(suma(d.ventas, 'saldo')), sub: 'saldo pendiente de clientes' });
  }
  const pendientes = d.pedidos ? d.pedidos.filter((p) => ['pendiente', 'preparado'].includes(p.estado)) : null;
  if (pendientes) tarjetas.push({ et: 'Pedidos pendientes', valor: pendientes.length, sub: 'por entregar' });
  if (d.mov) {
    const stock = calcularStock(d.mov);
    tarjetas.push({ et: 'Stock total', valor: kilos(Object.values(stock).reduce((a, b) => a + b, 0)), sub: `${Object.keys(stock).length} productos` });
  }

  return (
    <section>
      <div className="barra">
        <div>
          <h2>Resumen del día</h2>
          <p className="sub">{fechaCorta(hoy())}</p>
        </div>
      </div>
      <div className="tarjetas">
        {tarjetas.map((t) => (
          <div key={t.et} className="tarjeta">
            <span>{t.et}</span>
            <strong>{t.valor}</strong>
            <small>{t.sub}</small>
          </div>
        ))}
      </div>
      {pendientes && (
        <div className="panel">
          <h3>Pedidos por entregar</h3>
          <DataTable
            porPagina={6}
            filas={pendientes}
            vacio="No hay pedidos pendientes."
            columnas={[
              { et: 'Entrega', f: (f) => fechaCorta(f.fecha) },
              { et: 'Cliente', k: 'cliente' },
              { et: 'Producto', k: 'producto' },
              { et: 'Cantidad', f: (f) => kilos(f.kg) },
            ]}
          />
        </div>
      )}
    </section>
  );
}
