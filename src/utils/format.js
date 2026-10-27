export const soles = (n) =>
  'S/ ' + Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const kilos = (n) =>
  Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' kg';

export const redondear = (n) => Math.round((Number(n) || 0) * 100) / 100;

export const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const fechaCorta = (f) => (f ? f.split('-').reverse().join('/') : '');
export const sinGuiones = (t) => String(t ?? '').replace(/_/g, ' ');
export const suma = (filas, campo) => filas.reduce((a, f) => a + (Number(f[campo]) || 0), 0);
