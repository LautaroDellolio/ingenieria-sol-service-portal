// Heuristica para distinguir "esto fallo por falta de conexion" de "esto
// fallo porque el servidor respondio con un error real" (ej. RLS, columna
// invalida). No hay forma 100% confiable de saberlo desde el cliente, pero
// esta cobertura alcanza los casos reales: sin red, fetch nunca llega a
// completar (TypeError en Chrome/Firefox/Safari) o navigator.onLine ya lo
// indica de entrada.
const NETWORK_ERROR_MESSAGE_PATTERNS = [/failed to fetch/i, /networkerror/i, /load failed/i, /network request failed/i]

export function isOnline() {
  return typeof navigator === 'undefined' ? true : navigator.onLine
}

export function isNetworkError(error) {
  if (!isOnline()) return true
  if (!error) return false
  if (error instanceof TypeError) return true
  const message = typeof error.message === 'string' ? error.message : ''
  return NETWORK_ERROR_MESSAGE_PATTERNS.some((pattern) => pattern.test(message))
}
