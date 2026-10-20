// Campo numérico controlado y reutilizable.
export default function Field({ id, label, value, onChange, unit, hint }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input id={id} type="number" inputMode="decimal" min="0" step="any"
          value={value} onChange={(e) => onChange(e.target.value)} />
        {unit && <span className="unit">{unit}</span>}
      </div>
      {hint && <small>{hint}</small>}
    </div>
  );
}
