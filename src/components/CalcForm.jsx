import Field from './Field.jsx';

export default function CalcForm({ type, values, currency, onFieldChange, onSubmit, onReset }) {
  const sym = currency === 'USD' ? 'US$' : 'RD$';
  const set = (name) => (v) => onFieldChange(name, v);
  return (
    <form className="panel" onSubmit={onSubmit} noValidate>
      <h2>Datos</h2>
      <Field id="principal" label={type === 'loan' ? 'Monto del préstamo' : 'Capital inicial'}
        unit={sym} value={values.principal} onChange={set('principal')} />
      <Field id="rate" label="Tasa anual" unit="%" value={values.rate} onChange={set('rate')} />
      <Field id="years" label="Plazo" unit="años" value={values.years} onChange={set('years')}
        hint={type === 'loan' ? '1.5 años equivale a 18 cuotas.' : 'Admite decimales: 2.5 años = 30 meses.'} />
      {type === 'savings' && (
        <Field id="monthly" label="Aporte mensual" unit={sym} value={values.monthly}
          onChange={set('monthly')} hint="Se deposita al final de cada mes." />
      )}
      <div className="actions">
        <button className="primary" type="submit">Calcular</button>
        <button className="ghost" type="button" onClick={onReset}>Limpiar</button>
      </div>
    </form>
  );
}
