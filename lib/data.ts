export const performance = {
  monthly: { actual: 126, budget: 100 },
  annual: { actual: 912, budget: 760 },
};

export const closingRates = [
  { benchmark: "PESOS-02", rate: 5.42, deltaBp: 3.5 },
  { benchmark: "PESOS-05", rate: 5.68, deltaBp: -2.0 },
  { benchmark: "PESOS-10", rate: 5.95, deltaBp: 1.3 },
  { benchmark: "UF-02", rate: 2.12, deltaBp: -0.8 },
  { benchmark: "UF-05", rate: 2.45, deltaBp: 2.4 },
  { benchmark: "UF-10", rate: 2.78, deltaBp: -1.6 },
];

export const positions = [
  { instrument: "DPF", duration: 0.65, dv01: -63.7 },
  { instrument: "DPR", duration: 1.07, dv01: -1.5 },
  { instrument: "Bancarios CLP", duration: 1.30, dv01: -5.6 },
  { instrument: "Bancarios UF", duration: 1.73, dv01: -1.5 },
  { instrument: "Gobierno CLP", duration: 2.81, dv01: -31.7 },
  { instrument: "Gobierno UF", duration: 2.87, dv01: -24.1 },
];

export const limits = [
  { name: "Gobierno CLP", min: -35, max: 25, current: -31 },
  { name: "Derivados CLP", min: -22, max: 22, current: 8 },
  { name: "Gobierno UF", min: -25, max: 20, current: -6 },
  { name: "Derivados UF", min: -18, max: 18, current: 11 },
  { name: "DPF", min: -16, max: 14, current: -9 },
  { name: "DPR", min: -12, max: 12, current: 3 },
  { name: "Bancarios CLP", min: -20, max: 18, current: 7 },
  { name: "Bancarios UF", min: -15, max: 12, current: -4 },
];
