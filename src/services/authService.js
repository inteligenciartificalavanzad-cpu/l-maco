import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../config/firebase';

// Las personas entran con "usuario" y contraseña. Firebase exige un correo,
// así que internamente el usuario se convierte en usuario@limcar.app.
const DOMINIO = '@limcar.app';
const USUARIO_VALIDO = /^[a-z0-9._-]{3,}$/;

export const normalizarUsuario = (u) => String(u || '').trim().toLowerCase();
export const aCorreo = (u) => normalizarUsuario(u) + DOMINIO;

export async function obtenerPerfil(uid) {
  const snap = await getDoc(doc(db, 'usuarios', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function iniciarSesion(usuario, clave) {
  const cred = await signInWithEmailAndPassword(auth, aCorreo(usuario), clave);
  const perfil = await obtenerPerfil(cred.user.uid);
  if (!perfil || perfil.activo === false || !perfil.rol) {
    await signOut(auth);
    throw new Error('PERFIL_INACTIVO');
  }
  return perfil;
}

export const cerrarSesion = () => signOut(auth);
export const escucharSesion = (callback) => onAuthStateChanged(auth, callback);

// Crea la cuenta de acceso sin cerrar la sesión del administrador
// (usa una segunda instancia temporal de Firebase).
export async function crearUsuario({ usuario, clave, nombre, rol, activo }) {
  const u = normalizarUsuario(usuario);
  if (!USUARIO_VALIDO.test(u)) throw new Error('El usuario debe tener al menos 3 caracteres (letras, números, punto o guion).');
  if (!clave || clave.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');

  const secundaria = initializeApp(firebaseConfig, 'secundaria-' + Date.now());
  try {
    const authSec = getAuth(secundaria);
    const cred = await createUserWithEmailAndPassword(authSec, aCorreo(u), clave);
    await setDoc(doc(db, 'usuarios', cred.user.uid), {
      usuario: u,
      nombre,
      rol,
      activo: activo !== false,
      creado: serverTimestamp(),
    });
    await signOut(authSec);
  } finally {
    await deleteApp(secundaria);
  }
}
