import { useEffect, useState } from 'react';

// useState que se guarda en localStorage. Si el almacenamiento falla
// (modo privado, cuota llena, datos corruptos) la app sigue funcionando en memoria.
export function useLocalStorage(key, initial, sanitize = (x) => x) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : sanitize(JSON.parse(raw));
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin almacenamiento */ }
  }, [key, value]);
  return [value, setValue];
}
