export function mensajeError(e) {
  const c = e?.code || '';
  if (c === 'permission-denied') return 'No tienes permiso para esta acción.';
  if (['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password', 'auth/invalid-email'].includes(c))
    return 'Usuario o contraseña incorrectos.';
  if (c === 'auth/too-many-requests') return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.';
  if (c === 'auth/network-request-failed' || c === 'unavailable') return 'Sin conexión. Revisa tu Internet.';
  if (c === 'auth/email-already-in-use') return 'Ese usuario ya existe.';
  if (c === 'auth/weak-password') return 'La contraseña debe tener al menos 6 caracteres.';
  if (e?.message === 'PERFIL_INACTIVO')
    return 'Tu usuario está inactivo o no tiene rol asignado. Habla con el administrador.';
  return e?.message || 'Ocurrió un error inesperado.';
}
