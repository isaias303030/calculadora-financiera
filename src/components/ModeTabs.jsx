import { MODES } from '../utils/finance.js';

// Sin estado propio: el padre decide qué modo está activo.
export default function ModeTabs({ value, onChange }) {
  return (
    <div className="seg tabs" role="group" aria-label="Tipo de cálculo">
      {MODES.map((m) => (
        <button key={m.value} type="button" className={value === m.value ? 'on' : ''}
          aria-pressed={value === m.value} onClick={() => onChange(m.value)}>
          {m.label}
        </button>
      ))}
    </div>
  );
}
