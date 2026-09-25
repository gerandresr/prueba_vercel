"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, BarChart, Bar, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, Gauge, LayoutDashboard, LineChart as LineIcon, ShieldAlert, WalletCards } from "lucide-react";
import { deskResults, limits, monthlyPnl, positions, productPnl } from "@/lib/data";

type View = "Resumen" | "Resultados" | "Posiciones" | "Límites";

const fmt = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1 });

function Kpi({ label, value, foot, positive=true }: { label:string; value:string; foot:string; positive?:boolean }) {
  return <div className="card kpi"><div className="kpiTop"><span>{label}</span><BarChart3 size={15}/></div><div className="kpiValue">{value}</div><div className={`kpiFoot ${positive ? "up" : "down"}`}>{foot}</div></div>
}

function LimitRows({ compact=false }: { compact?: boolean }) {
  return <div>{limits.slice(0, compact ? 4 : limits.length).map((l) => {
    const pct = Math.min(100, l.current / l.limit * 100);
    return <div className="limitRow" key={l.name}><div className="limitHead"><span>{l.name}</span><span>{pct.toFixed(0)}%</span></div><div className="bar"><div className={`fill ${pct >= 80 ? "warn" : ""}`} style={{width:`${pct}%`}}/></div><div className="smallMeta"><span>{fmt.format(l.current)} {l.unit}</span><span>Límite {fmt.format(l.limit)}</span></div></div>
  })}</div>
}

function Summary() {
  return <>
    <div className="grid5">
      <Kpi label="P&L Mes" value="$113 MM" foot="↑ 8,4% vs mes anterior"/>
      <Kpi label="P&L YTD" value="$905 MM" foot="↑ 34,1% vs presupuesto"/>
      <Kpi label="Cumplimiento" value="134%" foot="Presupuesto YTD: $675 MM"/>
      <Kpi label="DV01 Total" value="$12,6 MM/bp" foot="70% del límite"/>
      <Kpi label="Exposición USD" value="US$9,7 MM" foot="65% del límite"/>
    </div>
    <div className="sectionGrid">
      <div className="card section"><div className="sectionTitle"><h3>P&L acumulado vs presupuesto</h3><div className="legend"><span><i style={{background:"#4f9cff"}}/>Real</span><span><i style={{background:"#57d8e8"}}/>Presupuesto</span></div></div><div className="chartWrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlyPnl}><defs><linearGradient id="pnl" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f9cff" stopOpacity={.32}/><stop offset="95%" stopColor="#4f9cff" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false}/><XAxis dataKey="month" stroke="#758aa5" tickLine={false} axisLine={false}/><YAxis stroke="#758aa5" tickLine={false} axisLine={false}/><Tooltip contentStyle={{background:"#0c1829",border:"1px solid rgba(255,255,255,.1)",borderRadius:10}}/><Area type="monotone" dataKey="pnl" stroke="#4f9cff" strokeWidth={2.5} fill="url(#pnl)"/><Line type="monotone" dataKey="budget" stroke="#57d8e8" strokeWidth={2} strokeDasharray="5 5" dot={false}/></AreaChart></ResponsiveContainer></div></div>
      <div className="card section"><div className="sectionTitle"><h3>Utilización de límites</h3><span>Actualizado 08:45</span></div><LimitRows compact/></div>
    </div>
    <div className="sectionGrid" style={{gridTemplateColumns:"1fr 1fr"}}>
      <div className="card section"><div className="sectionTitle"><h3>P&L por producto</h3><span>MM CLP</span></div><div className="chartWrap"><ResponsiveContainer><BarChart data={productPnl} layout="vertical"><CartesianGrid stroke="rgba(255,255,255,.05)" horizontal={false}/><XAxis type="number" stroke="#758aa5" axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" width={90} stroke="#9db0c8" axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"#0c1829",border:"1px solid rgba(255,255,255,.1)",borderRadius:10}}/><Bar dataKey="value" fill="#4f9cff" radius={[0,6,6,0]}/></BarChart></ResponsiveContainer></div></div>
      <div className="card section"><div className="sectionTitle"><h3>Composición del resultado</h3><span>YTD</span></div><div className="chartWrap"><ResponsiveContainer><PieChart><Pie data={productPnl} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={3}>{productPnl.map((_,i)=><Cell key={i} fill={["#4f9cff","#57d8e8","#31d098","#f4b860"][i]}/>)}</Pie><Tooltip contentStyle={{background:"#0c1829",border:"1px solid rgba(255,255,255,.1)",borderRadius:10}}/></PieChart></ResponsiveContainer></div></div>
    </div>
  </>
}

function Results() {
  return <div className="pageGrid">
    <div className="card section wide"><div className="sectionTitle"><h3>Resultado acumulado 2026</h3><span>MM CLP</span></div><div className="chartWrap"><ResponsiveContainer><LineChart data={monthlyPnl}><CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false}/><XAxis dataKey="month" stroke="#758aa5" axisLine={false} tickLine={false}/><YAxis stroke="#758aa5" axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"#0c1829",border:"1px solid rgba(255,255,255,.1)",borderRadius:10}}/><Line dataKey="pnl" stroke="#4f9cff" strokeWidth={3}/><Line dataKey="budget" stroke="#57d8e8" strokeDasharray="6 6" dot={false}/></LineChart></ResponsiveContainer></div></div>
    <div className="card section wide"><div className="sectionTitle"><h3>Resultados por mesa / producto</h3><span>YTD</span></div><div className="resultList">{deskResults.map(r => <div className="resultItem" key={r.desk}><div><strong>{r.desk}</strong><small>Resultado acumulado</small></div><div><strong>${r.actual} MM</strong><small>Real</small></div><div><strong>${r.budget} MM</strong><small>Presupuesto</small></div><div><strong className={r.actual >= r.budget ? "up":"down"}>{(r.actual/r.budget*100).toFixed(0)}%</strong><small>{r.yoy >= 0 ? "+":""}{r.yoy}% YoY</small></div></div>)}</div></div>
  </div>
}

function Positions() {
  const [q,setQ]=useState("");
  const rows=useMemo(()=>positions.filter(p=>`${p.instrument} ${p.book} ${p.currency}`.toLowerCase().includes(q.toLowerCase())),[q]);
  return <div className="card tableCard"><div className="tableToolbar"><div><h3>Posiciones actuales</h3><div className="emptyNote">Datos de ejemplo · cartera consolidada</div></div><input className="search" placeholder="Buscar instrumento..." value={q} onChange={e=>setQ(e.target.value)}/></div><table><thead><tr><th>Instrumento</th><th>Libro</th><th>Moneda</th><th className="num">Nominal</th><th className="num">MTM</th><th className="num">DV01</th><th className="num">Duración</th><th className="num">P&L</th></tr></thead><tbody>{rows.map(p=><tr key={p.instrument}><td><strong>{p.instrument}</strong></td><td><span className="tag">{p.book}</span></td><td>{p.currency}</td><td className="num">{fmt.format(p.notional)}</td><td className="num">{fmt.format(p.mtm)}</td><td className="num">{fmt.format(p.dv01)}</td><td className="num">{fmt.format(p.duration)}</td><td className={`num ${p.pnl>=0?"up":"down"}`}>{p.pnl>=0?"+":""}{fmt.format(p.pnl)}</td></tr>)}</tbody></table></div>
}

function Limits() {
  const max = limits.reduce((a,b)=> a.current/a.limit > b.current/b.limit ? a:b);
  return <div className="pageGrid"><div className="card section"><div className="sectionTitle"><h3>Estado de límites</h3><span>Riesgo mercado</span></div><LimitRows/></div><div className="card section"><div className="sectionTitle"><h3>Mayor utilización</h3><span>{max.name}</span></div><div className="utilBig">{(max.current/max.limit*100).toFixed(0)}%</div><div className="bar" style={{height:12}}><div className="fill" style={{width:`${max.current/max.limit*100}%`}}/></div><p className="emptyNote" style={{marginTop:18}}>Ningún límite se encuentra excedido en los datos de ejemplo. Puedes reemplazar estos valores por límites reales desde <code>lib/data.ts</code>.</p></div><div className="card section wide"><div className="sectionTitle"><h3>Utilización comparada</h3><span>% del límite</span></div><div className="chartWrap"><ResponsiveContainer><BarChart data={limits.map(l=>({...l,pct:+(l.current/l.limit*100).toFixed(1)}))}><CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false}/><XAxis dataKey="name" stroke="#758aa5" tick={{fontSize:11}} axisLine={false} tickLine={false}/><YAxis domain={[0,100]} stroke="#758aa5" axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"#0c1829",border:"1px solid rgba(255,255,255,.1)",borderRadius:10}}/><Bar dataKey="pct" fill="#57d8e8" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></div></div>
}

export default function Home(){
  const [view,setView]=useState<View>("Resumen");
  const nav:[View,React.ReactNode][]=[["Resumen",<LayoutDashboard size={17} key="a"/>],["Resultados",<LineIcon size={17} key="b"/>],["Posiciones",<WalletCards size={17} key="c"/>],["Límites",<ShieldAlert size={17} key="d"/>]];
  return <div className="app"><aside className="sidebar"><div className="brand"><div className="logo"><Gauge size={22}/></div><div><strong>Trading Propietario</strong><span>Risk & Performance</span></div></div><div className="nav">{nav.map(([n,icon])=><button key={n} className={view===n?"active":""} onClick={()=>setView(n)}>{icon}<span>{n}</span></button>)}</div><div className="sidebarFoot">MVP demostrativo<br/><strong style={{color:"#dbe8f8"}}>Datos ficticios</strong></div></aside><main className="main"><header className="header"><div><h1>{view}</h1><p>Gerencia de Intermediación Financiera · Dashboard de gestión</p></div><div className="headerRight"><div className="pill"><span className="dot"/>Mercado abierto</div><select className="dateSelect" defaultValue="Sep 2026"><option>Sep 2026</option><option>Ago 2026</option><option>Jul 2026</option></select></div></header>{view==="Resumen"&&<Summary/>}{view==="Resultados"&&<Results/>}{view==="Posiciones"&&<Positions/>}{view==="Límites"&&<Limits/>}</main></div>
}
