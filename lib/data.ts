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
  { instrument: "BTP 2030", duration: 1.9, dv01: -3.4 },
  { instrument: "BTP 2035", duration: 4.8, dv01: -8.2 },
  { instrument: "BTU 2032", duration: 3.7, dv01: 5.1 },
  { instrument: "BTU 2040", duration: 7.6, dv01: -2.9 },
  { instrument: "IRS CLP 5Y", duration: 4.9, dv01: 6.4 },
  { instrument: "Cross UF/CLP 7Y", duration: 6.1, dv01: -4.0 },
];

export const limits = [
  { name: "Gobierno CLP", min: -35, max: 25, current: -31 },
  { name: "Derivados CLP", min: -22, max: 22, current: 8 },
  { name: "Gobierno UF", min: -25, max: 20, current: -6 },
  { name: "Derivados UF", min: -18, max: 18, current: 11 },
  { name: "IIF CLP", min: -16, max: 14, current: -9 },
  { name: "IIF UF", min: -12, max: 12, current: 3 },
  { name: "RF Bancario CLP", min: -20, max: 18, current: 7 },
  { name: "RF Bancario UF", min: -15, max: 12, current: -4 },
];
