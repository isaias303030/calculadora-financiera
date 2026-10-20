import { useState } from 'react';
import { money } from '../utils/finance.js';

export default function ResultPanel({ result, currency }) {
  const [copied, setCopied] = useState(false);
  if (!result)
    return (
      <section className="panel empty" aria-live="polite">
        <h2>Tu resultado aparecerá aquí</h2>
        <p>Completa los datos y pulsa Calcular.</p>
      </section>
    );

  const fmt = (n) => money(n, currency);
  const share = Math.max(0, Math.min(100, (result.interest / result.total) * 100));

  const copy = async () => {
    const text = `${result.mainLabel}: ${fmt(result.main)} | ${result.totalLabel}: ${fmt(result.total)} | ${result.interestLabel}: ${fmt(result.interest)}`;
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); }
  };

  return (
    <section className="panel results" aria-live="polite">
      <h2>Resultado</h2>
      <div className="main-figure">
        <span>{result.mainLabel}</span>
        <strong>{fmt(result.main)}</strong>
      </div>
      <div className="split" role="img" aria-label={`Intereses: ${share.toFixed(0)} % del total`}>
        <i style={{ width: `${100 - share}%` }} /><i className="int" style={{ width: `${share}%` }} />
      </div>
      <dl>
        <div><dt>{result.totalLabel}</dt><dd>{fmt(result.total)}</dd></div>
        <div><dt>{result.interestLabel}</dt><dd>{fmt(result.interest)}</dd></div>
        <div><dt>Intereses sobre el total</dt><dd>{share.toFixed(1)} %</dd></div>
      </dl>
      <button type="button" className="ghost" onClick={copy}>{copied ? 'Copiado ✓' : 'Copiar resultado'}</button>
      <div className="table-wrap">
        <table>
          <caption>Detalle por año</caption>
          <thead><tr><th>Período</th><th>{result.flowLabel}</th><th>Intereses</th><th>{result.balanceLabel}</th></tr></thead>
          <tbody>
            {result.rows.map((r) => (
              <tr key={r.period}><th scope="row">{r.period}</th><td>{fmt(r.flow)}</td><td>{fmt(r.interest)}</td><td>{fmt(r.balance)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">Simulación educativa: no incluye comisiones, impuestos, seguros ni cambios de tasa. El cambio de moneda solo altera el formato, no convierte importes.</p>
    </section>
  );
}
