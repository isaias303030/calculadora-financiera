import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate } from '../src/utils/finance.js';
const v = (principal, rate, years, monthly = '0') => ({ principal, rate, years, monthly });
const near = (a, b) => assert.ok(Math.abs(a - b) < 0.01, `${a} ≉ ${b}`);

test('interés simple: 1000, 12 %, 2 años', () => {
  const r = calculate('simple', v(1000, 12, 2));
  near(r.interest, 240); near(r.total, 1240);
});
test('compuesto con tasa 0 conserva el capital', () => near(calculate('compound', v(1000, 0, 2)).total, 1000));
test('compuesto coincide con la fórmula cerrada', () =>
  near(calculate('compound', v(1000, 12, 2)).total, 1000 * Math.pow(1.01, 24)));
test('préstamo a tasa 0: 1200 en 1 año = 100/mes', () => near(calculate('loan', v(1200, 0, 1)).main, 100));
test('préstamo termina con deuda 0', () => {
  const r = calculate('loan', v(100000, 12, 2));
  assert.equal(r.rows.at(-1).balance, 0);
  near(r.main, 4707.35);
});
test('ahorro con aportes suma depósitos + intereses', () => {
  const r = calculate('savings', v(0, 0, 1, 100));
  near(r.total, 1200); near(r.interest, 0);
});
test('capital negativo lanza error', () => assert.throws(() => calculate('loan', v(-100, 12, 2))));

// ---- historial ----
import { addEntry, makeEntry, removeEntry, sanitizeHistory, MAX_ENTRIES } from '../src/utils/history.js';
const mk = (principal = '1000', now = 1) => makeEntry('loan', v(principal, 12, 2), 'DOP', calculate('loan', v(principal, 12, 2)), now);

test('historial: agrega al inicio y respeta el máximo', () => {
  let list = [];
  for (let i = 0; i < MAX_ENTRIES + 5; i++) list = addEntry(list, mk(String(1000 + i), i));
  assert.equal(list.length, MAX_ENTRIES);
  assert.equal(list[0].values.principal, String(1000 + MAX_ENTRIES + 4));
});
test('historial: un cálculo idéntico al último no se duplica', () => {
  const list = addEntry(addEntry([], mk('5000', 1)), mk('5000', 2));
  assert.equal(list.length, 1);
  assert.equal(list[0].savedAt, 2);
});
test('historial: eliminar por id', () => {
  const a = mk('1000', 1), b = mk('2000', 2);
  assert.deepEqual(removeEntry([b, a], a.id).map((e) => e.id), [b.id]);
});
test('historial: descarta datos corruptos del almacenamiento', () => {
  assert.deepEqual(sanitizeHistory('basura'), []);
  assert.deepEqual(sanitizeHistory([null, { id: 1 }, { ...mk(), type: 'otro' }]), []);
  assert.equal(sanitizeHistory([mk()]).length, 1);
});
