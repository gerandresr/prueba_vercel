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

export type SubPosition = {
  instrument: string;
  duration: number;
  dv01: number;
};

export type Position = {
  instrument: string;
  duration: number;
  dv01: number;
  children?: SubPosition[];
};

export const positions: Position[] = [
  {
    instrument: "DPF",
    duration: 0.65,
    dv01: -63.7,
    children: [
      { instrument: "30d", duration: 0.08, dv01: -18.4 },
      { instrument: "180d", duration: 0.49, dv01: -24.9 },
      { instrument: "270d", duration: 0.74, dv01: -20.4 },
    ],
  },
  {
    instrument: "DPR",
    duration: 1.07,
    dv01: -1.5,
    children: [
      { instrument: "30d", duration: 0.08, dv01: -0.4 },
      { instrument: "180d", duration: 0.49, dv01: -0.6 },
      { instrument: "270d", duration: 0.74, dv01: -0.5 },
    ],
  },
  { instrument: "Bancarios CLP", duration: 1.30, dv01: -5.6 },
  { instrument: "Bancarios UF", duration: 1.73, dv01: -1.5 },
  {
    instrument: "Gobierno CLP",
    duration: 2.81,
    dv01: -31.7,
    children: [
      { instrument: "BTP27", duration: 1.92, dv01: -11.8 },
      { instrument: "BTP28", duration: 2.74, dv01: -10.5 },
      { instrument: "BTP29", duration: 3.61, dv01: -9.4 },
    ],
  },
  {
    instrument: "Gobierno UF",
    duration: 2.87,
    dv01: -24.1,
    children: [
      { instrument: "BTU28", duration: 2.31, dv01: -9.1 },
      { instrument: "BTU30", duration: 3.05, dv01: -8.2 },
      { instrument: "BTU31", duration: 3.78, dv01: -6.8 },
    ],
  },
];

export type MarketQuote = { tenor: string; mid: number };
export type MarketTable = { name: string; quotes: MarketQuote[] };

export const markets: MarketTable[] = [
  {
    name: "Swap CLP",
    quotes: [
      { tenor: "1M", mid: 5.38 },
      { tenor: "3M", mid: 5.31 },
      { tenor: "6M", mid: 5.19 },
      { tenor: "1Y", mid: 4.95 },
      { tenor: "2Y", mid: 4.78 },
      { tenor: "5Y", mid: 5.12 },
      { tenor: "10Y", mid: 5.54 },
    ],
  },
  {
    name: "CCS",
    quotes: [
      { tenor: "1Y", mid: 1.42 },
      { tenor: "2Y", mid: 1.58 },
      { tenor: "3Y", mid: 1.71 },
      { tenor: "5Y", mid: 1.93 },
      { tenor: "10Y", mid: 2.24 },
    ],
  },
  {
    name: "Sofr",
    quotes: [
      { tenor: "1M", mid: 4.86 },
      { tenor: "3M", mid: 4.72 },
      { tenor: "6M", mid: 4.55 },
      { tenor: "1Y", mid: 4.21 },
      { tenor: "2Y", mid: 3.88 },
      { tenor: "5Y", mid: 3.79 },
    ],
  },
  {
    name: "Breakeven",
    quotes: [
      { tenor: "1Y", mid: 3.05 },
      { tenor: "2Y", mid: 3.18 },
      { tenor: "5Y", mid: 3.34 },
      { tenor: "10Y", mid: 3.41 },
    ],
  },
  {
    name: "USDCLP NDF",
    quotes: [
      { tenor: "Spot", mid: 948.5 },
      { tenor: "1M", mid: 951.2 },
      { tenor: "3M", mid: 956.8 },
      { tenor: "6M", mid: 964.1 },
      { tenor: "1Y", mid: 978.4 },
    ],
  },
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
