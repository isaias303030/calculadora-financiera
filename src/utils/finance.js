// Lógica financiera pura: no importa React. Tasas en % anual (12 = 12 %).
// Plazo en años; para préstamo, ahorro y compuesto se usan meses = round(años × 12)
// con capitalización mensual.

export const MODES = [
  { value: 'loan', label: 'Préstamo' },
  { value: 'simple', label: 'Interés simple' },
  { value: 'compound', label: 'Interés compuesto' },
  { value: 'savings', label: 'Ahorro' },
];

export const money = (amount, currency = 'DOP') =>
  new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'es-DO', {
    style: 'currency',
    currency,
  }).format(amount);

const cents = (n) => (Math.abs(n) < 0.005 ? 0 : n); // evita -0.00

export function calculate(type, values) {
  const P = Number(values.principal);
  const r = Number(values.rate) / 100;
  const t = Number(values.years);
  const monthly = type === 'savings' ? Number(values.monthly || 0) : 0;

  const numbers = [P, r, t, monthly];
  if (!numbers.every(Number.isFinite) || r < 0 || t <= 0 || monthly < 0)
    throw new Error('Revisa los datos: el plazo debe ser mayor que cero y la tasa y el aporte no pueden ser negativos.');
  if (type === 'savings' ? P + monthly <= 0 : P <= 0)
    throw new Error(type === 'savings' ? 'Indica un capital inicial o un aporte mensual mayor que cero.' : 'El capital debe ser mayor que cero.');

  const months = Math.round(t * 12);
  if (months < 1) throw new Error('El plazo debe ser de al menos un mes.');
  const i = r / 12;
  const rows = [];

  if (type === 'simple') {
    const interest = P * r * t;
    for (let y = 1; y <= Math.ceil(t); y++) {
      const yearFraction = Math.min(1, t - (y - 1));
      const yi = P * r * yearFraction;
      rows.push({ period: `Año ${y}`, flow: 0, interest: yi, balance: P + P * r * Math.min(y, t) });
    }
    return {
      type, main: interest, mainLabel: 'Interés generado',
      total: P + interest, totalLabel: 'Monto final',
      interest, interestLabel: 'Interés total', base: P,
      rows, flowLabel: 'Aportado', balanceLabel: 'Saldo',
    };
  }

  if (type === 'loan') {
    const payment = i === 0 ? P / months : (P * i) / (1 - Math.pow(1 + i, -months));
    let debt = P, yInt = 0, yPaid = 0;
    for (let k = 1; k <= months; k++) {
      const int = debt * i;
      debt = debt + int - payment;
      yInt += int; yPaid += payment;
      if (k % 12 === 0 || k === months) {
        rows.push({ period: `Año ${Math.ceil(k / 12)}`, flow: yPaid, interest: yInt, balance: cents(debt) });
        yInt = 0; yPaid = 0;
      }
    }
    const total = payment * months;
    return {
      type, main: payment, mainLabel: 'Cuota mensual',
      total, totalLabel: 'Total a pagar',
      interest: total - P, interestLabel: 'Intereses pagados', base: P,
      rows, flowLabel: 'Pagado', balanceLabel: 'Deuda pendiente',
    };
  }

  // compound / savings: mismo motor; ahorro agrega aporte mensual
  let bal = P, yInt = 0, yFlow = 0;
  for (let k = 1; k <= months; k++) {
    const int = bal * i;
    bal += int + monthly;
    yInt += int; yFlow += monthly;
    if (k % 12 === 0 || k === months) {
      rows.push({ period: `Año ${Math.ceil(k / 12)}`, flow: yFlow, interest: yInt, balance: bal });
      yInt = 0; yFlow = 0;
    }
  }
  const deposited = P + monthly * months;
  return {
    type, main: bal, mainLabel: type === 'savings' ? 'Ahorro proyectado' : 'Monto futuro',
    total: bal, totalLabel: type === 'savings' ? 'Saldo final' : 'Monto final',
    interest: bal - deposited, interestLabel: 'Intereses ganados', base: deposited,
    rows, flowLabel: 'Aportado', balanceLabel: 'Saldo',
  };
}
