/* Estadísticas de la semana: ingresos, pedidos, ventas por día y por hora,
   y lo más vendido de cada parte del menú (el mismo menú de la tienda Frontend-consumidor):
   platos, pizzas, burguers, perros / salchipapas / mazorcada, bebidas, toppings, salsas,
   tamaños y bordes de pizza, medios de pago y domicilio vs. para llevar.
   Son DATOS DE EJEMPLO fijos hasta que el servidor guarde los pedidos reales. */
(()=>{
const fmt=n=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}),num=n=>n.toLocaleString('es-CO'),pct=(a,b)=>Math.round(a/b*100)+'%';

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
const vs=(a,b)=>{const v=Math.round((a-b)/b*100);return `${v>=0?'▲ +':'▼ '}${v}% vs. semana anterior`};

/* ---------- Lo más vendido (unidades en la semana) ---------- */
const PIZZAS=[['Hawaiana',64],['Pepperoni',52],['Mexicana',41],['La 4K',37],['Pizza a tu gusto',33],['Camarones',26],['Tropical',22],['Californiana',19],['Legendaria',15],['Ay Dios Mío',12]];
const BURGUERS=[['Gran Burguer',58],['De carne',34],['De pollo',27]];
const OTROS=[['Salchi Tazmania',61],['Perro salvaje',55],['Salchi Californiana',38],['Mazorcada TAZ',36]];
/* bebidas: [nombre, lata, 1.5 L, 2 L] */
const BEBIDAS=[['Coca-Cola',74,21,18],['Pepsi',39,12,9],['Sprite',31,10,6]];
/* toppings extra: [nombre, veces, plato donde más se pide] */
const TOPPINGS=[['Queso extra',96,'Pizza'],['Tocineta',71,'Burguer'],['Jalapeño',44,'Perro'],['Pepperoni',41,'Pizza'],['Champiñones',38,'Pizza'],
  ['Maíz',35,'Mazorcada'],['Pollo desmechado',33,'Salchipapa'],['Jamón',31,'Pizza'],['Chorizo',27,'Salchipapa'],['Piña',25,'Pizza'],
  ['Carne desmechada',22,'Mazorcada'],['Cebolla',21,'Burguer'],['Camarones',18,'Pizza'],['Carne molida',16,'Perro'],['Pimentón',14,'Pizza'],
  ['Tomate',12,'Burguer'],['Durazno',8,'Pizza'],['Cereza',6,'Pizza']];
/* salsas: [nombre, veces, plato donde más se pide] */
const SALSAS=[['Salsa rosada',142,'Salchipapa'],['Salsa de tomate',118,'Perro'],['Salsa verde',67,'Burguer']];
const TAMANOS=[['Familiar',138],['Medium',112],['Personal',71]];
const BORDES=[['Normal',176],['Queso',89],['Bocadillo',56]];
const MEDIOS=[['💳 Tarjeta',196],['💵 Efectivo',121],['📱 Nequi',63],['🏦 Transferencia',47],['📱 Daviplata',47]];
const TIPO=[['🛵 Domicilio',318],['🥡 Para llevar',156]];

const PLATOS=[...PIZZAS.map(([n,q])=>['Pizza '+n.replace(/^Pizza /,''),q,'🍕']),...BURGUERS.map(([n,q])=>[n==='Gran Burguer'?n:'Burguer '+n.toLowerCase(),q,'🍔']),
  ...OTROS.map(([n,q])=>[n,q,n.startsWith('Salchi')?'🍟':n.startsWith('Perro')?'🌭':'🌽'])].sort((a,b)=>b[1]-a[1]);
const estrella=PLATOS[0];

/* ---------- KPIs ---------- */
const KPI=[
  ['💵','Ingresos de la semana',fmt(ingresos),vs(ingresos,ANTERIOR.ingresos)],
  ['🧾','Pedidos de la semana',num(pedidos),vs(pedidos,ANTERIOR.pedidos)],
  ['🎟️','Ticket promedio',fmt(ingresos/pedidos),'por pedido'],
  ['📅','Mejor día',DIAS_L[fechas[mejor].getDay()],`${fmt(SEMANA[mejor][1])} · ${SEMANA[mejor][0]} pedidos`],
  ['⭐','Plato estrella',estrella[0],`${estrella[1]} vendidos`],
  ['🛵','Domicilio / Para llevar',`${pct(TIPO[0][1],pedidos)} / ${pct(TIPO[1][1],pedidos)}`,`${TIPO[0][1]} y ${TIPO[1][1]} pedidos`]
];
document.getElementById('kpis').innerHTML=KPI.map(([i,t,v,s])=>`<div class="kpi panel"><span class="i" aria-hidden="true">${i}</span><small>${t}</small><b>${v}</b><em>${s}</em></div>`).join('');

/* ---------- Barras verticales (una sola serie: sin leyenda, el título la nombra) ---------- */
function barras(el,datos){ // datos: [etiqueta corta, valor, tooltip]
  const max=Math.max(...datos.map(d=>d[1]));
  el.style.setProperty('--n',datos.length);
  el.innerHTML=datos.map(([lab,v,tip])=>`<div class="b${v===max?' pico':''}" tabindex="0" aria-label="${tip}">
    <i style="height:${(v/max*100).toFixed(1)}%">${v===max?`<em>${fmt(v)}</em>`:''}<span class="tip">${tip}</span></i>
    <small>${lab}</small></div>`).join('');
}
barras(document.getElementById('dias'),SEMANA.map(([p,v],i)=>{const f=fechas[i];return [`${DIAS[f.getDay()]} ${f.getDate()}`,v,`${DIAS_L[f.getDay()]} ${fCorta(f)} · <b>${fmt(v)}</b> · ${p} pedidos`]}));
/* [hora, pedidos, ventas] promedio por día */
const HORAS=[[11,3,52],[12,6,118],[13,8,161],[14,5,96],[15,3,61],[16,4,79],[17,7,142],[18,10,214],[19,12,251],[20,9,193],[21,5,104],[22,2,40]];
barras(document.getElementById('horas'),HORAS.map(([h,p,v])=>{const l=(h%12||12)+(h<12?'am':'pm');return [l,v,`${l} · <b>${fmt(v)}</b> · ${p} pedidos`]}));

/* ---------- Rankings: barras horizontales de una sola serie ---------- */
function lista(filas,total,unidad){ // filas: [nombre, cantidad, detalle opcional]
  const max=Math.max(...filas.map(f=>f[1]));
  return `<ol class="rank">${filas.map(([n,q,det],i)=>`<li title="${n}: ${q} ${unidad} (${pct(q,total)})">
    <span class="pos">${i+1}</span><span class="nm">${n}${det?`<small>${det}</small>`:''}</span><b>${num(q)}</b>
    <span class="pista"><i style="width:${(q/max*100).toFixed(1)}%"${i===0?' class="lider"':''}></i></span><span class="pc">${pct(q,total)}</span></li>`).join('')}</ol>`;
}
const suma=a=>a.reduce((t,f)=>t+f[1],0);
/* misma banda de color por categoría que en la página Menú */
const tarjeta=(cls,ico,tit,sub,cuerpo,color='c-crema')=>`<section class="caja rk ${cls} ${color}"><h3 class="banda"><span><span aria-hidden="true">${ico}</span> ${tit}</span></h3><div class="cuerpo"><p class="sub">${sub}</p>${cuerpo}</div></section>`;
const bebTot=BEBIDAS.map(([n,a,b,c])=>[n,a+b+c,`Lata ${a} · 1.5 L ${b} · 2 L ${c}`]);
const tamBeb=[['Personal (lata)',BEBIDAS.reduce((t,b)=>t+b[1],0)],['1.5 L',BEBIDAS.reduce((t,b)=>t+b[2],0)],['2 L',BEBIDAS.reduce((t,b)=>t+b[3],0)]];

document.getElementById('ranking').innerHTML=[
  tarjeta('ancho','🍽️','Top 10 platos','Todos los platos del menú, en unidades',lista(PLATOS.slice(0,10).map(([n,q,e])=>[`${e} ${n}`,q]),suma(PLATOS),'unidades'),'c-amarillo'),
  tarjeta('','🍔','Burguers','Cuál burguer se vende más',lista(BURGUERS,suma(BURGUERS),'burguers'),'c-amarillo'),
  tarjeta('ancho','🍕','Pizzas','Cuál pizza se vende más',lista(PIZZAS,suma(PIZZAS),'pizzas'),'c-naranja'),
  tarjeta('','🌭','Perros, salchipapas y mazorcada','Los demás platos',lista(OTROS,suma(OTROS),'unidades'),'c-naranja'),
  tarjeta('','🥤','Bebidas','Por marca, con sus tamaños',lista(bebTot.sort((a,b)=>b[1]-a[1]),suma(bebTot),'bebidas'),'c-azul'),
  tarjeta('','🧃','Tamaños de bebida','Todas las marcas juntas',lista(tamBeb,suma(tamBeb),'bebidas'),'c-azul'),
  tarjeta('','🥫','Salsas','Veces que se pidió cada salsa extra',lista(SALSAS.map(([n,q,p])=>[n,q,`Más pedida en: ${p}`]),suma(SALSAS),'veces'),'c-naranja'),
  tarjeta('completo','🧀','Toppings extra','Veces que se pidió cada topping y en qué plato se pide más',lista(TOPPINGS.map(([n,q,p])=>[n,q,`Más pedido en: ${p}`]),suma(TOPPINGS),'veces'),'c-verde'),
  tarjeta('','📏','Tamaños de pizza','Personal, Medium o Familiar',lista(TAMANOS,suma(TAMANOS),'pizzas')),
  tarjeta('','🧀','Bordes de pizza','Normal, Queso o Bocadillo',lista(BORDES,suma(BORDES),'pizzas')),
  tarjeta('','💳','Medios de pago','Pedidos pagados con cada medio',lista(MEDIOS,suma(MEDIOS),'pedidos'))
].join('');
})();
