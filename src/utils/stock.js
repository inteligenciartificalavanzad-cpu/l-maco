// El stock se calcula a partir de los movimientos de inventario.
const SUMAN = ['entrada', 'ajuste_mas'];

export function calcularStock(movimientos) {
  const stock = {};
  movimientos.forEach((m) => {
    const nombre = m.producto || 'Sin producto';
    const kg = Number(m.kg) || 0;
    stock[nombre] = (stock[nombre] || 0) + (SUMAN.includes(m.tipo) ? kg : -kg);
  });
  return stock;
}
