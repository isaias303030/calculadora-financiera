import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import ModeTabs from './components/ModeTabs.jsx';
import CalcForm from './components/CalcForm.jsx';
import ResultPanel from './components/ResultPanel.jsx';
import History from './components/History.jsx';
import { calculate } from './utils/finance.js';
import { addEntry, makeEntry, removeEntry, sanitizeCurrency, sanitizeHistory, sanitizeType, sanitizeValues } from './utils/history.js';
import { useLocalStorage } from './utils/useLocalStorage.js';

const INITIAL = { principal: '100000', rate: '12', years: '2', monthly: '2000' };

export default function App() {
  // Todo esto se guarda en el navegador y se recupera al volver.
  const [type, setType] = useLocalStorage('calc:type', 'loan', sanitizeType);
  const [values, setValues] = useLocalStorage('calc:values', { ...INITIAL }, (v) => sanitizeValues(v, INITIAL));
  const [currency, setCurrency] = useLocalStorage('calc:currency', 'DOP', sanitizeCurrency);
  const [history, setHistory] = useLocalStorage('calc:history', [], sanitizeHistory);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Calculadora Financiera'; }, []);

  const clear = () => { setResult(null); setError(''); };
  const changeType = (next) => { setType(next); clear(); };
  const changeField = (field, value) => { setValues((prev) => ({ ...prev, [field]: value })); clear(); };
  const reset = () => { setValues({ ...INITIAL }); clear(); };

  const submit = (e) => {
    e.preventDefault();
    try {
      const res = calculate(type, values);
      setResult(res);
      setError('');
      setHistory((prev) => addEntry(prev, makeEntry(type, values, currency, res)));
    } catch (err) { setResult(null); setError(err.message); }
  };

  const loadEntry = (entry) => {
    setType(entry.type);
    setValues({ ...INITIAL, ...entry.values });
    setCurrency(entry.currency);
    try { setResult(calculate(entry.type, entry.values)); setError(''); }
    catch (err) { setResult(null); setError(err.message); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header currency={currency} onCurrencyChange={setCurrency} />
      <main className="shell">
        <h1>¿Cuánto te costará, o cuánto crecerá?</h1>
        <ModeTabs value={type} onChange={changeType} />
        {error && <p className="error" role="alert">{error}</p>}
        <div className="layout">
          <CalcForm type={type} values={values} currency={currency}
            onFieldChange={changeField} onSubmit={submit} onReset={reset} />
          <ResultPanel result={result} currency={currency} />
        </div>
        <History items={history} onLoad={loadEntry}
          onRemove={(id) => setHistory((prev) => removeEntry(prev, id))}
          onClear={() => setHistory([])} />
      </main>
      <footer className="shell footer">Calculadora Financiera · Proyecto educativo con React</footer>
    </>
  );
}
