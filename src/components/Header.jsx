export default function Header({ currency, onCurrencyChange }) {
  return (
    <header className="header">
      <div className="shell header-row">
        <div>
          <div className="brand">Calculadora Financiera</div>
          <p>Simula préstamos, intereses y ahorros.</p>
        </div>
        <div className="seg small" role="group" aria-label="Moneda">
          {['DOP', 'USD'].map((c) => (
            <button key={c} type="button" className={currency === c ? 'on' : ''}
              aria-pressed={currency === c} onClick={() => onCurrencyChange(c)}>
              {c === 'DOP' ? 'RD$' : 'US$'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
