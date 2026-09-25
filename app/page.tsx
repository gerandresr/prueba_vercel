"use client";

import { useMemo, useState } from "react";
import { BarChart3, ChevronRight, Gauge, LayoutDashboard, ShieldAlert, WalletCards } from "lucide-react";
import { closingRates, limits, performance, positions, type Position } from "@/lib/data";

type View = "Resumen" | "Resultados" | "Posiciones" | "Límites";

const numFmt = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const moneyFmt = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 });

function calcCompliance(actual: number, budget: number) {
  if (!budget) return 0;
  return (actual / budget) * 100;
}

function KpiCard({
  label,
  actual,
  budget,
}: {
  label: string;
  actual: number;
  budget: number;
}) {
  const compliance = calcCompliance(actual, budget);
  const positive = compliance >= 100;

  return (
    <div className="card kpi">
      <div className="kpiTop">
        <span>{label}</span>
        <BarChart3 size={15} />
      </div>
      <div className="kpiValue">${moneyFmt.format(actual)} MM</div>
      <div className={`kpiFoot ${positive ? "up" : "warn"}`}>
        Cumplimiento: {numFmt.format(compliance)}%
      </div>
      <div className="smallMeta singleLine">Meta: ${moneyFmt.format(budget)} MM</div>
    </div>
  );
}

function RatesTable() {
  return (
    <div className="card tableCard">
      <div className="tableToolbar">
        <div>
          <h3>Tasas de cierre</h3>
          <div className="emptyNote">Benchmarks CLP y UF</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Benchmark</th>
            <th className="num">Tasa</th>
            <th className="num">Delta (bp)</th>
          </tr>
        </thead>
        <tbody>
          {closingRates.map((row) => (
            <tr key={row.benchmark}>
              <td><strong>{row.benchmark}</strong></td>
              <td className="num">{numFmt.format(row.rate)}%</td>
              <td className={`num ${row.deltaBp > 0 ? "down" : row.deltaBp < 0 ? "up" : "mutedText"}`}>
                {row.deltaBp > 0 ? "+" : ""}
                {numFmt.format(row.deltaBp)} bp
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function dv01Class(dv01: number) {
  return dv01 > 0 ? "down" : dv01 < 0 ? "up" : "mutedText";
}

function PositionRows({ row }: { row: Position }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!row.children?.length;

  return (
    <>
      <tr
        className={hasChildren ? "expandable" : undefined}
        onClick={hasChildren ? () => setOpen((v) => !v) : undefined}
        aria-expanded={hasChildren ? open : undefined}
      >
        <td>
          <span className="instrumentCell">
            {hasChildren ? (
              <ChevronRight size={14} className={`expandChevron ${open ? "open" : ""}`} aria-hidden />
            ) : (
              <span className="expandChevronSpacer" aria-hidden />
            )}
            <strong>{row.instrument}</strong>
          </span>
        </td>
        <td className="num">{numFmt.format(row.duration)}</td>
        <td className={`num ${dv01Class(row.dv01)}`}>
          {row.dv01 > 0 ? "+" : ""}
          {numFmt.format(row.dv01)}
        </td>
      </tr>
      {hasChildren &&
        open &&
        row.children!.map((child) => (
          <tr key={`${row.instrument}-${child.instrument}`} className="subRow">
            <td>
              <span className="instrumentCell sub">
                <span className="expandChevronSpacer" aria-hidden />
                {child.instrument}
              </span>
            </td>
            <td className="num">{numFmt.format(child.duration)}</td>
            <td className={`num ${dv01Class(child.dv01)}`}>
              {child.dv01 > 0 ? "+" : ""}
              {numFmt.format(child.dv01)}
            </td>
          </tr>
        ))}
    </>
  );
}

function PositionsTable({ compact = false }: { compact?: boolean }) {
  const rows = compact ? positions.slice(0, 6) : positions;
  return (
    <div className="card tableCard">
      <div className="tableToolbar">
        <div>
          <h3>Posiciones</h3>
          <div className="emptyNote">Duración y DV01 por instrumento</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Instrumento</th>
            <th className="num">Duración</th>
            <th className="num">DV01</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <PositionRows key={row.instrument} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LimitScale({ name, min, max, current }: { name: string; min: number; max: number; current: number }) {
  const domain = max - min;
  const zeroPct = ((0 - min) / domain) * 100;
  const currentPct = ((current - min) / domain) * 100;
  const left = Math.min(zeroPct, currentPct);
  const width = Math.abs(currentPct - zeroPct);
  const tone = current > 0 ? "positive" : current < 0 ? "negative" : "neutral";

  return (
    <div className="limitRangeRow">
      <div className="limitRangeHead">
        <div>
          <strong>{name}</strong>
          <small>Rango {min} a {max}</small>
        </div>
        <div className={`limitCurrent ${tone}`}>
          Actual: {current > 0 ? "+" : ""}{numFmt.format(current)}
        </div>
      </div>
      <div className="limitTrackWrap">
        <span className="axisLabel left">{numFmt.format(min)}</span>
        <div className="limitTrack">
          <div className="zeroLine" style={{ left: `${zeroPct}%` }} />
          <div className={`rangeFill ${tone}`} style={{ left: `${left}%`, width: `${width}%` }} />
          <div className={`limitMarker ${tone}`} style={{ left: `${currentPct}%` }} />
        </div>
        <span className="axisLabel right">+{numFmt.format(max)}</span>
      </div>
    </div>
  );
}

function LimitsPanel({ compact = false }: { compact?: boolean }) {
  const rows = compact ? limits.slice(0, 5) : limits;
  return (
    <div className="card section sectionAuto">
      <div className="sectionTitle">
        <h3>Límites</h3>
        <span>DV01 en pesos</span>
      </div>
      <div className="limitRangeList">
        {rows.map((row) => (
          <LimitScale key={row.name} {...row} />
        ))}
      </div>
    </div>
  );
}

function Summary() {
  return (
    <>
      <div className="grid2">
        <KpiCard label="Resultado mensual" actual={performance.monthly.actual} budget={performance.monthly.budget} />
        <KpiCard label="Resultado anual" actual={performance.annual.actual} budget={performance.annual.budget} />
      </div>
      <div className="stackGrid">
        <RatesTable />
        <PositionsTable compact />
        <LimitsPanel compact />
      </div>
    </>
  );
}

function Results() {
  const monthlyCompliance = calcCompliance(performance.monthly.actual, performance.monthly.budget);
  const annualCompliance = calcCompliance(performance.annual.actual, performance.annual.budget);

  return (
    <div className="pageGrid singleCol">
      <div className="card tableCard">
        <div className="tableToolbar">
          <div>
            <h3>Resultados</h3>
            <div className="emptyNote">Actual vs meta</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Horizonte</th>
              <th className="num">Actual</th>
              <th className="num">Meta</th>
              <th className="num">Cumplimiento</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Mensual</strong></td>
              <td className="num">${moneyFmt.format(performance.monthly.actual)} MM</td>
              <td className="num">${moneyFmt.format(performance.monthly.budget)} MM</td>
              <td className={`num ${monthlyCompliance >= 100 ? "up" : "warn"}`}>{numFmt.format(monthlyCompliance)}%</td>
            </tr>
            <tr>
              <td><strong>Anual</strong></td>
              <td className="num">${moneyFmt.format(performance.annual.actual)} MM</td>
              <td className="num">${moneyFmt.format(performance.annual.budget)} MM</td>
              <td className={`num ${annualCompliance >= 100 ? "up" : "warn"}`}>{numFmt.format(annualCompliance)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <RatesTable />
    </div>
  );
}

function PositionsView() {
  const [q, setQ] = useState("");
  const rows = useMemo(
    () => positions.filter((p) => p.instrument.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <div className="card tableCard">
      <div className="tableToolbar">
        <div>
          <h3>Posiciones</h3>
          <div className="emptyNote">Filtra por nombre del instrumento</div>
        </div>
        <input className="search" placeholder="Buscar instrumento..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Instrumento</th>
            <th className="num">Duración</th>
            <th className="num">DV01</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <PositionRows key={row.instrument} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LimitsView() {
  return <LimitsPanel />;
}

export default function Home() {
  const [view, setView] = useState<View>("Resumen");
  const nav: [View, React.ReactNode][] = [
    ["Resumen", <LayoutDashboard size={17} key="a" />],
    ["Resultados", <BarChart3 size={17} key="b" />],
    ["Posiciones", <WalletCards size={17} key="c" />],
    ["Límites", <ShieldAlert size={17} key="d" />],
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">
            <Gauge size={22} />
          </div>
          <div>
            <strong>Trading Desk</strong>
            <span>Monitoreo de tasas y DV01</span>
          </div>
        </div>
        <div className="nav">
          {nav.map(([n, icon]) => (
            <button key={n} className={view === n ? "active" : ""} onClick={() => setView(n)}>
              {icon}
              <span>{n}</span>
            </button>
          ))}
        </div>
        <div className="sidebarFoot">
          Dashboard editable desde <strong style={{ color: "#dbe8f8" }}>lib/data.ts</strong>
        </div>
      </aside>
      <main className="main">
        <header className="header">
          <div>
            <h1>{view}</h1>
            <p>Gerencia de Intermediación Financiera · Monitor de cierre y límites</p>
          </div>
          <div className="headerRight">
            <div className="pill"><span className="dot" />Mercado abierto</div>
          </div>
        </header>
        {view === "Resumen" && <Summary />}
        {view === "Resultados" && <Results />}
        {view === "Posiciones" && <PositionsView />}
        {view === "Límites" && <LimitsView />}
      </main>
    </div>
  );
}
