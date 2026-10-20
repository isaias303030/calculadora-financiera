import { MODES, money } from '../utils/finance.js';

const when = new Intl.DateTimeFormat('es-DO', { dateStyle: 'medium', timeStyle: 'short' });
const label = (type) => MODES.find((m) => m.value === type)?.label ?? type;

export default function History({ items, onLoad, onRemove, onClear }) {
  const confirmClear = () => {
    if (window.confirm('¿Borrar todo el historial guardado?')) onClear();
  };

  return (
    <section className="panel history" aria-label="Historial de cálculos">
      <div className="history-head">
        <h2>Cálculos guardados</h2>
        {items.length > 0 && (
          <button type="button" className="link" onClick={confirmClear}>Borrar todo</button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="history-empty">Aquí se guardará cada cálculo que hagas. Se conserva aunque cierres la página.</p>
      ) : (
        <ul>
          {items.map((e) => (
            <li key={e.id}>
              <button type="button" className="history-open" onClick={() => onLoad(e)}
                aria-label={`Abrir cálculo de ${label(e.type)} del ${when.format(e.savedAt)}`}>
                <span className="history-type">{label(e.type)}</span>
                <span className="history-main">{e.mainLabel}: <b>{money(e.main, e.currency)}</b></span>
                <span className="history-meta">
                  {money(Number(e.values.principal) || 0, e.currency)} · {e.values.rate} % · {e.values.years} años
                  {e.type === 'savings' && ` · aporte ${money(Number(e.values.monthly) || 0, e.currency)}`}
                  {' · '}{when.format(e.savedAt)}
                </span>
              </button>
              <button type="button" className="history-del" onClick={() => onRemove(e.id)}
                aria-label="Eliminar este cálculo">✕</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
