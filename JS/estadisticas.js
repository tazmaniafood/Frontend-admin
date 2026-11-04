/* Estadísticas de la semana, en una página corta:
   - 4 números clave arriba (ingresos, pedidos, ticket promedio, mejor día).
   - Una tarjeta con pestañas: Ventas (por día y por hora), Productos (lo más vendido de cada
     parte del menú de la tienda) y Pagos y entregas.
   Son DATOS DE EJEMPLO fijos hasta que el servidor guarde los pedidos reales. */
(()=>{
const fmt=n=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmt0=n=>'$'+Math.round(n).toLocaleString('en-US');
const num=n=>n.toLocaleString('es-CO'),pct=(a,b)=>Math.round(a/b*100)+'%';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

/* ---------- Semana: [pedidos, ingresos] por día (de hace 6 días a hoy) ---------- */
const SEMANA=[[48,1012],[52,1104],[61,1318],[74,1655],[96,2190],[88,1987],[55,1176]];
const ANTERIOR={ingresos:9310,pedidos:441};
const DIAS=['dom','lun','mar','mié','jue','vie','sáb'],DIAS_L=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const hoy=new Date();hoy.setHours(0,0,0,0);
const fechas=SEMANA.map((_,i)=>{const f=new Date(hoy);f.setDate(hoy.getDate()-(6-i));return f});
const fCorta=f=>f.toLocaleDateString('es-CO',{day:'numeric',month:'short'}).replace('.','');
document.getElementById('rango').textContent=`${fCorta(fechas[0])} – ${fCorta(fechas[6])}`;
const ingresos=SEMANA.reduce((t,d)=>t+d[1],0),pedidos=SEMANA.reduce((t,d)=>t+d[0],0);
const mejor=SEMANA.reduce((m,d,i)=>d[1]>SEMANA[m][1]?i:m,0);
/* [hora, pedidos, ventas] promedio por día */
const HORAS=[[11,3,52],[12,6,118],[13,8,161],[14,5,96],[15,3,61],[16,4,79],[17,7,142],[18,10,214],[19,12,251],[20,9,193],[21,5,104],[22,2,40]];
const hora=h=>(h%12||12)+(h<12?' am':' pm');

/* ---------- Lo más vendido (unidades en la semana) ---------- */
const PIZZAS=[['Hawaiana',64],['Pepperoni',52],['Mexicana',41],['La 4K',37],['Pizza a tu gusto',33],['Camarones',26],['Tropical',22],['Californiana',19],['Legendaria',15],['Ay Dios Mío',12]];
const BURGUERS=[['Gran Burguer',58],['Burguer de carne',34],['Burguer de pollo',27]];
const OTROS=[['Salchi Tazmania',61],['Perro salvaje',55],['Salchi Californiana',38],['Mazorcada TAZ',36]];
const BEBIDAS=[['Coca-Cola',74,21,18],['Pepsi',39,12,9],['Sprite',31,10,6]]; // [marca, lata, 1.5 L, 2 L]
const TOPPINGS=[['Queso extra',96,'Pizza'],['Tocineta',71,'Burguer'],['Jalapeño',44,'Perro'],['Pepperoni',41,'Pizza'],['Champiñones',38,'Pizza'],
  ['Maíz',35,'Mazorcada'],['Pollo desmechado',33,'Salchipapas'],['Jamón',31,'Pizza'],['Chorizo',27,'Salchipapas'],['Piña',25,'Pizza'],
  ['Carne desmechada',22,'Mazorcada'],['Cebolla',21,'Burguer'],['Camarones',18,'Pizza'],['Carne molida',16,'Perro'],['Pimentón',14,'Pizza'],
  ['Tomate',12,'Burguer'],['Durazno',8,'Pizza'],['Cereza',6,'Pizza']];
const SALSAS=[['Salsa rosada',142,'Salchipapas'],['Salsa de tomate',118,'Perro'],['Salsa verde',67,'Burguer']];
const TAMANOS=[['Familiar',138],['Medium',112],['Personal',71]];
const BORDES=[['Normal',176],['Queso',89],['Bocadillo',56]];
const MEDIOS=[['Tarjeta',196],['Efectivo',121],['Nequi',63],['Transferencia',47],['Daviplata',47]];
const TIPO=[['Domicilio',318],['Para llevar',156]];
const PLATOS=[...PIZZAS.map(([n,q])=>[n.startsWith('Pizza')?n:'Pizza '+n,q]),...BURGUERS,...OTROS].sort((a,b)=>b[1]-a[1]);
const suma=a=>a.reduce((t,f)=>t+f[1],0);
const bebTot=BEBIDAS.map(([n,a,b,c])=>[n,a+b+c,`Lata ${a} · 1.5 L ${b} · 2 L ${c}`]).sort((a,b)=>b[1]-a[1]);
const tamBeb=[['Lata',BEBIDAS.reduce((t,b)=>t+b[1],0)],['1.5 L',BEBIDAS.reduce((t,b)=>t+b[2],0)],['2 L',BEBIDAS.reduce((t,b)=>t+b[3],0)]];

/* ---------- Números clave ---------- */
const vs=(a,b)=>{const v=Math.round((a-b)/b*100);return `<span class="${v>=0?'sube':'baja'}">${v>=0?'+':''}${v}%</span> vs. semana anterior`};
const KPI=[
  ['Ingresos',fmt(ingresos),vs(ingresos,ANTERIOR.ingresos)],
  ['Pedidos',num(pedidos),vs(pedidos,ANTERIOR.pedidos)],
  ['Ticket promedio',fmt(ingresos/pedidos),'por pedido'],
  ['Mejor día',DIAS_L[fechas[mejor].getDay()],`${fmt0(SEMANA[mejor][1])} · ${SEMANA[mejor][0]} pedidos`]
];
document.getElementById('kpis').innerHTML=KPI.map(([t,v,s])=>`<div class="kpi"><small>${t}</small><b>${v}</b><em>${s}</em></div>`).join('');

/* ---------- Piezas ---------- */
function barras(datos,cls){ // una sola serie: [etiqueta, valor, texto del tooltip]
  const max=Math.max(...datos.map(d=>d[1]));
  return `<div class="barras ${cls}" style="--n:${datos.length}" role="img">${datos.map(([lab,v,tip])=>`<div class="b${v===max?' pico':''}" tabindex="0" aria-label="${tip.replace(/<[^>]+>/g,'')}">
    <i style="height:${(v/max*100).toFixed(1)}%">${v===max?`<em>${fmt0(v)}</em>`:''}<span class="tip">${tip}</span></i><small>${lab}</small></div>`).join('')}</div>`;
}
function lista(filas,unidad,dos){ // filas: [nombre, cantidad, detalle opcional]
  const total=suma(filas),max=Math.max(...filas.map(f=>f[1]));
  return `<ol class="rank${dos?' dos':''}">${filas.map(([n,q,det],i)=>`<li title="${esc(n)}: ${q} ${unidad} (${pct(q,total)})">
    <span class="pos">${i+1}</span><span class="nm">${esc(n)}${det?`<small>${esc(det)}</small>`:''}</span>
    <span class="pista"><i style="width:${(q/max*100).toFixed(1)}%"${i===0?' class="lider"':''}></i></span>
    <b>${num(q)}</b><span class="pc">${pct(q,total)}</span></li>`).join('')}</ol>`;
}
const bloque=(tit,sub,html)=>`<div class="bloque-est"><h3>${tit}${sub?` <small>${sub}</small>`:''}</h3>${html}</div>`;
const dato=(et,v)=>`<div class="dato"><small>${et}</small><b>${v}</b></div>`;

/* ---------- Vistas ---------- */
const PROD={
  top:['Top 10',()=>bloque('Los 10 platos más vendidos','unidades de la semana',lista(PLATOS.slice(0,10),'unidades',true))],
  pizzas:['Pizzas',()=>bloque('Pizzas',`${suma(PIZZAS)} vendidas`,lista(PIZZAS,'pizzas',true))],
  burguers:['Burguers',()=>bloque('Burguers',`${suma(BURGUERS)} vendidas`,lista(BURGUERS,'burguers'))],
  otros:['Perros, salchipapas y mazorcada',()=>bloque('Perros, salchipapas y mazorcada',`${suma(OTROS)} vendidos`,lista(OTROS,'unidades'))],
  bebidas:['Bebidas',()=>`<div class="dos-col">${bloque('Por marca',`${suma(bebTot)} bebidas`,lista(bebTot,'bebidas'))}${bloque('Por tamaño','todas las marcas',lista(tamBeb,'bebidas'))}</div>`],
  toppings:['Toppings',()=>bloque('Toppings extra','veces pedido y plato donde más se pide',lista(TOPPINGS.map(([n,q,p])=>[n,q,'Más en '+p]),'veces',true))],
  salsas:['Salsas',()=>bloque('Salsas extra','veces pedida y plato donde más se pide',lista(SALSAS.map(([n,q,p])=>[n,q,'Más en '+p]),'veces'))],
  pizza:['Tamaño y borde',()=>`<div class="dos-col">${bloque('Tamaño de pizza','',lista(TAMANOS,'pizzas'))}${bloque('Borde de pizza','',lista(BORDES,'pizzas'))}</div>`]
};
let vista='ventas',prod='top';
const VISTAS={
  ventas:()=>`<div class="dos-col graf">
      ${bloque('Ingresos por día',`total ${fmt0(ingresos)}`,barras(SEMANA.map(([p,v],i)=>{const f=fechas[i];return [`${DIAS[f.getDay()]} ${f.getDate()}`,v,`${DIAS_L[f.getDay()]} ${fCorta(f)} · <b>${fmt(v)}</b> · ${p} pedidos`]}),'dias'))}
      ${bloque('Ventas por hora','promedio diario',barras(HORAS.map(([h,p,v])=>[hora(h).replace(' ',''),v,`${hora(h)} · <b>${fmt(v)}</b> · ${p} pedidos`]),'horas'))}
    </div>
    <div class="datos">${dato('Hora pico',hora(HORAS.reduce((m,h)=>h[2]>m[2]?h:m)[0]))}${dato('Plato estrella',PLATOS[0][0])}${dato('Pedidos por día',Math.round(pedidos/7))}${dato('Ingreso por día',fmt0(ingresos/7))}</div>`,
  productos:()=>`<div class="chips sub-tabs" role="tablist" aria-label="Parte del menú">${Object.entries(PROD).map(([k,[t]])=>`<button class="pl${k===prod?' on':''}" type="button" role="tab" aria-selected="${k===prod}" data-prod="${k}">${t}</button>`).join('')}</div>${PROD[prod][1]()}`,
  pagos:()=>`<div class="dos-col">${bloque('Medios de pago',`${suma(MEDIOS)} pedidos`,lista(MEDIOS,'pedidos'))}${bloque('Domicilio o para llevar',`${suma(TIPO)} pedidos`,lista(TIPO,'pedidos'))}</div>`
};
function pintar(){
  document.querySelectorAll('[data-vista]').forEach(b=>{const on=b.dataset.vista===vista;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  document.getElementById('vista').innerHTML=VISTAS[vista]();
}
document.addEventListener('click',e=>{
  const v=e.target.closest('[data-vista]');if(v){vista=v.dataset.vista;return pintar()}
  const p=e.target.closest('[data-prod]');if(p){prod=p.dataset.prod;pintar()}
});
pintar();
})();
