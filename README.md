# Calculadora Financiera (React + Vite)
Versión propia basada en la guía FinanCalc.

```
npm install
npm run dev     # http://localhost:5173
npm test        # pruebas de las fórmulas (Node, sin dependencias)
```
## Estructura
- `src/utils/finance.js` fórmulas puras (sin React) y formato de moneda
- `src/App.jsx` estado (useState/useEffect) y coordinación
- `src/components/` Header, ModeTabs, Field, CalcForm, ResultPanel, History
- `src/utils/history.js` lógica pura del historial; `useLocalStorage.js` persistencia

## Qué agrega respecto a la guía
Aporte mensual en Ahorro, tabla de detalle por año (con deuda pendiente en Préstamo),
barra capital/intereses, botón Copiar, selector RD$/US$ (solo formato), modo oscuro y pruebas automáticas.

## Guardado de resultados
Cada vez que pulsas Calcular, el cálculo se guarda en el historial (máx. 30, sin duplicar el último).
Se almacena en `localStorage` del navegador, junto con el modo, la moneda y los datos del formulario,
así que se recupera al recargar. Desde el historial puedes reabrir o eliminar cálculos, o borrar todo.
