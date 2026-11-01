/* Estadísticas: números del día, ventas por hora y lo más vendido.
   Son DATOS DE EJEMPLO fijos hasta que exista el sistema real de pedidos. */
(()=>{
const fmt=TAZ.fmt;
/* [hora, pedidos, ventas] */
const HORAS=[[11,4,62],[12,9,171],[13,12,236],[14,7,128],[15,5,84],[16,6,103],[17,10,198],[18,15,311],[19,18,389],[20,14,287],[21,8,152],[22,3,51]];
const TOP=[['Pizza Hawaiana',23],['Salchi Tazmania',19],['Perro salvaje',17],['Gran Burguer',14],['Pizza La 4K',11]];
const ventas=HORAS.reduce((t,h)=>t+h[2],0),pedidos=HORAS.reduce((t,h)=>t+h[1],0);

const KPI=[
  ['💵','Ventas de hoy',fmt(ventas),'+12% vs. ayer'],
  ['🧾','Pedidos',pedidos,'+8 vs. ayer'],
  ['🎟️','Ticket promedio',fmt(ventas/pedidos),'por pedido'],
  ['⏱️','Tiempo en cocina','14 min','promedio']
];
document.getElementById('kpis').innerHTML=KPI.map(([i,t,v,s])=>`<div class="kpi panel"><span class="i">${i}</span><small>${t}</small><b>${v}</b><em>${s}</em></div>`).join('');

/* Barras de ventas por hora (una sola serie: sin leyenda, el título la nombra) */
const max=Math.max(...HORAS.map(h=>h[2])),pico=HORAS.find(h=>h[2]===max);
document.getElementById('horas').innerHTML=HORAS.map(([h,p,v])=>{
  const lab=(h%12||12)+(h<12?'am':'pm');
  return `<div class="b${v===max?' pico':''}" tabindex="0" aria-label="${lab}: ${fmt(v)} en ${p} pedidos">
    <i style="height:${(v/max*100).toFixed(1)}%">${v===max?`<em>${fmt(v)}</em>`:''}<span class="tip">${lab} · <b>${fmt(v)}</b> · ${p} pedidos</span></i>
    <small>${lab}</small></div>`;
}).join('');

/* Lo más vendido: barras horizontales */
const tmax=TOP[0][1];
document.getElementById('top').innerHTML=TOP.map(([n,q])=>`<li><span class="nm">${n}</span><span class="pista"><i style="width:${(q/tmax*100).toFixed(1)}%"></i></span><b>${q}</b></li>`).join('');

document.querySelector('#tabla tbody').innerHTML=HORAS.map(([h,p,v])=>`<tr><td>${(h%12||12)+(h<12?' am':' pm')}</td><td>${p}</td><td>${fmt(v)}</td></tr>`).join('');
})();
