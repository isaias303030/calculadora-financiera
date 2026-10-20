// Lógica pura del historial (sin React ni localStorage) para poder probarla.
import { MODES } from './finance.js';

export const MAX_ENTRIES = 30;

const MODE_VALUES = MODES.map((m) => m.value);
const CURRENCIES = ['DOP', 'USD'];
const FIELDS = ['principal', 'rate', 'years', 'monthly'];

const sameInputs = (a, b) =>
  a.type === b.type && a.currency === b.currency && FIELDS.every((f) => a.values[f] === b.values[f]);

export function makeEntry(type, values, currency, result, now = Date.now()) {
  return {
    id: `${now}-${Math.random().toString(36).slice(2, 7)}`,
    savedAt: now,
    type,
    currency,
    values: Object.fromEntries(FIELDS.map((f) => [f, String(values[f] ?? '')])),
    mainLabel: result.mainLabel,
    main: result.main,
  };
}

// Agrega al inicio. Si es idéntico al último guardado, solo actualiza su fecha.
export function addEntry(list, entry) {
  const rest = list[0] && sameInputs(list[0], entry) ? list.slice(1) : list;
  return [entry, ...rest].slice(0, MAX_ENTRIES);
}

export const removeEntry = (list, id) => list.filter((e) => e.id !== id);

// Descarta datos corruptos o manipulados que vengan de localStorage.
export function sanitizeHistory(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((e) =>
      e && typeof e.id === 'string' && Number.isFinite(e.savedAt) && Number.isFinite(e.main) &&
      typeof e.mainLabel === 'string' && MODE_VALUES.includes(e.type) &&
      CURRENCIES.includes(e.currency) && e.values && typeof e.values === 'object')
    .map((e) => ({ ...e, values: Object.fromEntries(FIELDS.map((f) => [f, String(e.values[f] ?? '')])) }))
    .slice(0, MAX_ENTRIES);
}

export const sanitizeType = (v) => (MODE_VALUES.includes(v) ? v : 'loan');
export const sanitizeCurrency = (v) => (CURRENCIES.includes(v) ? v : 'DOP');
export const sanitizeValues = (v, initial) =>
  v && typeof v === 'object'
    ? Object.fromEntries(FIELDS.map((f) => [f, typeof v[f] === 'string' ? v[f] : initial[f]]))
    : initial;
