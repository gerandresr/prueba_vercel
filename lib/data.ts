export const monthlyPnl = [
  { month: "Ene", pnl: 88, budget: 75 }, { month: "Feb", pnl: 182, budget: 150 },
  { month: "Mar", pnl: 276, budget: 225 }, { month: "Abr", pnl: 358, budget: 300 },
  { month: "May", pnl: 472, budget: 375 }, { month: "Jun", pnl: 566, budget: 450 },
  { month: "Jul", pnl: 674, budget: 525 }, { month: "Ago", pnl: 792, budget: 600 },
  { month: "Sep", pnl: 905, budget: 675 },
];

export const productPnl = [
  { name: "Derivados", value: 385 },
  { name: "Spot FX", value: 242 },
  { name: "Renta Fija", value: 198 },
  { name: "Propietario", value: 80 },
];

export const positions = [
  { instrument: "BCP 2031", book: "RF Local", currency: "CLP", notional: 12500, mtm: 12640, dv01: 3.4, pnl: 142, duration: 4.9 },
  { instrument: "BTU 2035", book: "RF Local", currency: "UF", notional: 8200, mtm: 8345, dv01: 4.1, pnl: 96, duration: 7.3 },
  { instrument: "USDCLP Fwd 3M", book: "FX", currency: "USD", notional: 6.5, mtm: 112, dv01: 0.2, pnl: 84, duration: 0.2 },
  { instrument: "CLP Cámara 2Y", book: "Derivados", currency: "CLP", notional: 18500, mtm: 164, dv01: 2.8, pnl: 73, duration: 1.8 },
  { instrument: "Cross UF/CLP 5Y", book: "Derivados", currency: "UF", notional: 6400, mtm: 98, dv01: 2.1, pnl: 51, duration: 4.4 },
  { instrument: "USD Cash", book: "FX", currency: "USD", notional: 3.2, mtm: 2980, dv01: 0, pnl: -18, duration: 0 },
];

export const limits = [
  { name: "DV01 Total", current: 12.6, limit: 18, unit: "MM CLP/bp" },
  { name: "Exposición USD", current: 9.7, limit: 15, unit: "MM USD" },
  { name: "Stop Loss Mensual", current: 104, limit: 250, unit: "MM CLP" },
  { name: "Nominal Derivados", current: 24.9, limit: 40, unit: "MMM CLP" },
  { name: "VaR 1D 99%", current: 186, limit: 300, unit: "MM CLP" },
];

export const deskResults = [
  { desk: "Derivados", actual: 385, budget: 290, yoy: 18 },
  { desk: "Spot FX", actual: 242, budget: 205, yoy: 11 },
  { desk: "Renta Fija", actual: 198, budget: 175, yoy: -4 },
  { desk: "Propietario", actual: 80, budget: 105, yoy: -12 },
];
