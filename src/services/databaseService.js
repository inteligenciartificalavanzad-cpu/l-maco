import {
  collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, setDoc,
  query, where, writeBatch, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const segundos = (d) => d.creado?.seconds ?? 0;

export async function listar(nombre) {
  const snap = await getDocs(collection(db, nombre));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => segundos(b) - segundos(a));
}

export const crear = (nombre, datos) =>
  addDoc(collection(db, nombre), { ...datos, creado: serverTimestamp() });

export const actualizar = (nombre, id, datos) =>
  updateDoc(doc(db, nombre, id), { ...datos, modificado: serverTimestamp() });

// Guarda el registro Y su movimiento de inventario en una sola operación:
// o se guardan los dos o no se guarda ninguno.
export async function crearConMovimiento(nombre, datos, movimiento) {
  const lote = writeBatch(db);
  const ref = doc(collection(db, nombre));
  lote.set(ref, { ...datos, creado: serverTimestamp() });
  const movRef = doc(collection(db, 'movimientos'));
  lote.set(movRef, { ...movimiento, origen: nombre, origenId: ref.id, creado: serverTimestamp() });
  await lote.commit();
  return ref.id;
}

// Si el registro generó movimientos de inventario, los elimina junto con él.
export async function eliminar(nombre, id, conMovimiento = false) {
  if (!conMovimiento) return deleteDoc(doc(db, nombre, id));
  const lote = writeBatch(db);
  const movs = await getDocs(query(collection(db, 'movimientos'), where('origenId', '==', id)));
  movs.docs.forEach((m) => lote.delete(m.ref));
  lote.delete(doc(db, nombre, id));
  await lote.commit();
}

export async function obtenerDoc(coleccion, id) {
  const snap = await getDoc(doc(db, coleccion, id));
  return snap.exists() ? snap.data() : null;
}

export const guardarDoc = (coleccion, id, datos) =>
  setDoc(doc(db, coleccion, id), { ...datos, modificado: serverTimestamp() }, { merge: true });
