"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type HistoryRow = {
  fecha: string;
  instrumento: string;
  precio: number;
};

type Period = "ALL" | "YTD" | "MTD" | "CUSTOM";

const dateLabel = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
  year: "2-digit",
});

function parseCsv(text: string): HistoryRow[] {
  const lines = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);

  return lines
    .slice(1)
    .map((line) => {
      const [fecha, instrumento, precio] = line.split(",");
      return {
        fecha: fecha?.trim(),
        instrumento: instrumento?.trim(),
        precio: Number(precio),
      };
    })
    .filter(
      (row) =>
        row.fecha &&
        row.instrumento &&
        Number.isFinite(row.precio)
    )
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function formatValue(value: number, instrument: string) {
  if (instrument === "USDCLP") {
    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return `${new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(value)}%`;
}

function periodLabel(period: Period) {
  if (period === "ALL") return "Todo";
  if (period === "YTD") return "YTD";
  if (period === "MTD") return "MTD";
  return "Rango";
}

export default function MarketHistoryChart() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [instrument, setInstrument] = useState("USDCLP");
  const [period, setPeriod] = useState<Period>("YTD");
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-09-25");

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch("/data/historicos.csv", { cache: "no-store" });
        if (!response.ok) throw new Error("No fue posible leer historicos.csv");
        const text = await response.text();
        setRows(parseCsv(text));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error leyendo el CSV");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const instruments = useMemo(
    () => Array.from(new Set(rows.map((row) => row.instrumento))).sort(),
    [rows]
  );

  const instrumentRows = useMemo(
    () => rows.filter((row) => row.instrumento === instrument),
    [rows, instrument]
  );

  const latestDate = instrumentRows.at(-1)?.fecha;

  const filteredRows = useMemo(() => {
    if (!instrumentRows.length || !latestDate) return [];

    if (period === "ALL") return instrumentRows;

    if (period === "CUSTOM") {
      return instrumentRows.filter(
        (row) => row.fecha >= fromDate && row.fecha <= toDate
      );
    }

    const latestYear = latestDate.slice(0, 4);
    if (period === "YTD") {
      return instrumentRows.filter((row) => row.fecha >= `${latestYear}-01-01`);
    }

    const latestMonth = latestDate.slice(0, 7);
    return instrumentRows.filter((row) => row.fecha.startsWith(latestMonth));
  }, [instrumentRows, latestDate, period, fromDate, toDate]);

  const first = filteredRows[0]?.precio;
  const last = filteredRows.at(-1)?.precio;
  const change = first != null && last != null ? last - first : null;
  const changePct =
    first != null && last != null && first !== 0
      ? ((last / first) - 1) * 100
      : null;

  return (
    <div className="card marketHistoryCard">
      <div className="marketHistoryHeader">
        <div>
          <h3>Histórico de mercado</h3>
          <div className="emptyNote">
            Fuente: <code>public/data/historicos.csv</code>
          </div>
        </div>

        <div className="marketControls">
          <label>
            <span>Instrumento</span>
            <select
              className="marketSelect"
              value={instrument}
              onChange={(event) => setInstrument(event.target.value)}
            >
              {(instruments.length ? instruments : ["USDCLP", "BTP30", "TREASURY 10Y"]).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>

          <div className="periodButtons" aria-label="Periodo del gráfico">
            {(["ALL", "YTD", "MTD", "CUSTOM"] as Period[]).map((item) => (
              <button
                key={item}
                className={period === item ? "active" : ""}
                onClick={() => setPeriod(item)}
              >
                {periodLabel(item)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {period === "CUSTOM" && (
        <div className="customDateRow">
          <label>
            <span>Desde</span>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </label>
          <label>
            <span>Hasta</span>
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
            />
          </label>
        </div>
      )}

      <div className="marketStats">
        <div>
          <span>Último</span>
          <strong>{last != null ? formatValue(last, instrument) : "—"}</strong>
        </div>
        <div>
          <span>Variación periodo</span>
          <strong className={change != null && change >= 0 ? "down" : "up"}>
            {change == null ? "—" : `${change >= 0 ? "+" : ""}${formatValue(change, instrument)}`}
          </strong>
        </div>
        <div>
          <span>Variación %</span>
          <strong className={changePct != null && changePct >= 0 ? "down" : "up"}>
            {changePct == null ? "—" : `${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%`}
          </strong>
        </div>
        <div>
          <span>Observaciones</span>
          <strong>{filteredRows.length}</strong>
        </div>
      </div>

      <div className="marketChartWrap">
        {loading ? (
          <div className="chartState">Cargando histórico…</div>
        ) : error ? (
          <div className="chartState error">{error}</div>
        ) : filteredRows.length === 0 ? (
          <div className="chartState">No hay datos para el rango seleccionado.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredRows} margin={{ top: 12, right: 18, left: 4, bottom: 4 }}>
              <CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false} />
              <XAxis
                dataKey="fecha"
                stroke="#758aa5"
                axisLine={false}
                tickLine={false}
                minTickGap={34}
                tickFormatter={(value) => dateLabel.format(new Date(`${value}T12:00:00`))}
              />
              <YAxis
                stroke="#758aa5"
                axisLine={false}
                tickLine={false}
                domain={["auto", "auto"]}
                width={74}
                tickFormatter={(value) => formatValue(Number(value), instrument)}
              />
              <Tooltip
                contentStyle={{
                  background: "#0c1829",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 10,
                }}
                labelFormatter={(value) =>
                  dateLabel.format(new Date(`${String(value)}T12:00:00`))
                }
                formatter={(value) => [formatValue(Number(value), instrument), instrument]}
              />
              <Line
                type="monotone"
                dataKey="precio"
                stroke="#4f9cff"
                strokeWidth={2.3}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
