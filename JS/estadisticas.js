/* Estadísticas de la semana, en una página corta:
   - Arriba: ingresos, la calificación de Google (al centro, más grande) y pedidos.
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
const MEDIOS=[['Stripe',353],['Efectivo',121]];
const TIPO=[['Domicilio',318],['Para llevar',156]];
/* Gastos de la semana (ejemplo): por categoría y por día (mismos días que SEMANA) */
const GASTOS=[['Ingredientes e insumos',3650],['Nómina',1820],['Arriendo',560],['Servicios (luz, gas, agua)',310],['Empaques',240],['Comisiones de Stripe',230],['Domicilios (gasolina)',120],['Publicidad',50]];
const GASTOS_DIA=[820,860,950,1060,1320,1240,730];
const GASTOS_ANTERIOR=6610;
const PLATOS=[...PIZZAS.map(([n,q])=>[n.startsWith('Pizza')?n:'Pizza '+n,q]),...BURGUERS,...OTROS].sort((a,b)=>b[1]-a[1]);
const suma=a=>a.reduce((t,f)=>t+f[1],0);
const bebTot=BEBIDAS.map(([n,a,b,c])=>[n,a+b+c,`Lata ${a} · 1.5 L ${b} · 2 L ${c}`]).sort((a,b)=>b[1]-a[1]);
const tamBeb=[['Lata',BEBIDAS.reduce((t,b)=>t+b[1],0)],['1.5 L',BEBIDAS.reduce((t,b)=>t+b[2],0)],['2 L',BEBIDAS.reduce((t,b)=>t+b[3],0)]];

/* ---------- Números clave ---------- */
const vs=(a,b)=>{const v=Math.round((a-b)/b*100);return `<span class="${v>=0?'sube':'baja'}">${v>=0?'+':''}${v}%</span> vs. semana anterior`};
/* en gastos, subir es malo: rojo si suben, verde si bajan */
const vsGasto=(a,b)=>{const v=Math.round((a-b)/b*100);return `<span class="${v>0?'baja':'sube'}">${v>=0?'+':''}${v}%</span> vs. semana anterior`};
/* Calificación de Google (ejemplo). Cuando se conecte, sale de Google Business Profile / Places API */
const GOOGLE={nota:4.8,resenas:312,nuevas:14,dist:[[5,251],[4,41],[3,11],[2,4],[1,5]]};
function estrellas(n){ // 5 estrellas con relleno parcial
  return `<span class="estrellas" role="img" aria-label="${n} de 5 estrellas">${[0,1,2,3,4].map(i=>{
    const f=Math.max(0,Math.min(1,n-i))*100;
    return `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><defs><linearGradient id="e${i}"><stop offset="${f}%" stop-color="#ffc933"/><stop offset="${f}%" stop-color="#ffffff26"/></linearGradient></defs><path fill="url(#e${i})" d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>`}).join('')}</span>`;
}
const maxG=Math.max(...GOOGLE.dist.map(d=>d[1]));
document.getElementById('kpis').innerHTML=`
  <div class="kpi k-ing"><small>Ingresos de la semana</small><b>${fmt(ingresos)}</b><em>${vs(ingresos,ANTERIOR.ingresos)}</em></div>
  <div class="kpi k-google">
    <div class="g-nota"><small><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z"/><path fill="#34A853" d="M12 23c3 0 5.4-1 7.2-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.2v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.2a11 11 0 0 0 0 9.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2.2 7.1l3.6 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg> Calificación en Google</small>
      <div class="g-fila"><b>${GOOGLE.nota.toFixed(1)}</b>${estrellas(GOOGLE.nota)}</div>
      <em>${num(GOOGLE.resenas)} reseñas · <span class="sube">+${GOOGLE.nuevas}</span> esta semana</em></div>
    <ol class="g-dist" aria-label="Reseñas por estrellas">${GOOGLE.dist.map(([e,c])=>`<li><span>${e}★</span><i><b style="width:${(c/maxG*100).toFixed(1)}%"></b></i><span>${c}</span></li>`).join('')}</ol>
  </div>
  <div class="kpi k-ped"><small>Pedidos de la semana</small><b>${num(pedidos)}</b><em>${vs(pedidos,ANTERIOR.pedidos)}</em></div>`;

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
    <b>${unidad==='dólares'?fmt0(q):num(q)}</b><span class="pc">${pct(q,total)}</span></li>`).join('')}</ol>`;
}
const bloque=(tit,sub,html,col='naranja')=>`<div class="bloque-est col-${col}"><h3>${tit}${sub?` <small>${sub}</small>`:''}</h3>${html}</div>`;
const dato=(et,v)=>`<div class="dato"><small>${et}</small><b>${v}</b></div>`;

/* ---------- Vistas ---------- */
const PROD={
  top:['Top 10',()=>bloque('Los 10 platos más vendidos','unidades de la semana',lista(PLATOS.slice(0,10),'unidades',true))],
  pizzas:['Pizzas',()=>bloque('Pizzas',`${suma(PIZZAS)} vendidas`,lista(PIZZAS,'pizzas',true),'naranja')],
  burguers:['Burguers',()=>bloque('Burguers',`${suma(BURGUERS)} vendidas`,lista(BURGUERS,'burguers'),'amarillo')],
  otros:['Perros, salchipapas y mazorcada',()=>bloque('Perros, salchipapas y mazorcada',`${suma(OTROS)} vendidos`,lista(OTROS,'unidades'),'rojo')],
  bebidas:['Bebidas',()=>`<div class="dos-col">${bloque('Por marca',`${suma(bebTot)} bebidas`,lista(bebTot,'bebidas'),'azul')}${bloque('Por tamaño','todas las marcas',lista(tamBeb,'bebidas'),'azul')}</div>`],
  toppings:['Toppings',()=>bloque('Toppings extra','veces pedido y plato donde más se pide',lista(TOPPINGS.map(([n,q,p])=>[n,q,'Más en '+p]),'veces',true),'verde')],
  salsas:['Salsas',()=>bloque('Salsas extra','veces pedida y plato donde más se pide',lista(SALSAS.map(([n,q,p])=>[n,q,'Más en '+p]),'veces'),'rojo')],
  pizza:['Tamaño y borde',()=>`<div class="dos-col">${bloque('Tamaño de pizza','',lista(TAMANOS,'pizzas'),'naranja')}${bloque('Borde de pizza','',lista(BORDES,'pizzas'),'amarillo')}</div>`]
};
let vista='ventas',prod='top';
const VISTAS={
  ventas:()=>`<div class="dos-col graf">
      ${bloque('Ingresos por día',`total ${fmt0(ingresos)}`,barras(SEMANA.map(([p,v],i)=>{const f=fechas[i];return [`${DIAS[f.getDay()]} ${f.getDate()}`,v,`${DIAS_L[f.getDay()]} ${fCorta(f)} · <b>${fmt(v)}</b> · ${p} pedidos`]}),'dias'))}
      ${bloque('Ventas por hora','promedio diario',barras(HORAS.map(([h,p,v])=>[hora(h).replace(' ',''),v,`${hora(h)} · <b>${fmt(v)}</b> · ${p} pedidos`]),'horas'))}
    </div>
    <div class="datos">${dato('Hora pico',hora(HORAS.reduce((m,h)=>h[2]>m[2]?h:m)[0]))}${dato('Plato estrella',PLATOS[0][0])}${dato('Ticket promedio',fmt(ingresos/pedidos))}${dato('Pedidos por día',Math.round(pedidos/7))}</div>`,
  productos:()=>`<div class="chips sub-tabs" role="tablist" aria-label="Parte del menú">${Object.entries(PROD).map(([k,[t]])=>`<button class="pl${k===prod?' on':''}" type="button" role="tab" aria-selected="${k===prod}" data-prod="${k}">${t}</button>`).join('')}</div>${PROD[prod][1]()}`,
  gastos:()=>{
    const gastos=suma(GASTOS),ganancia=ingresos-gastos,margen=Math.round(ganancia/ingresos*100);
    const gan=SEMANA.map(([p,v],i)=>{const f=fechas[i],g=v-GASTOS_DIA[i];return [`${DIAS[f.getDay()]} ${f.getDate()}`,g,`${DIAS_L[f.getDay()]} · ingresos <b>${fmt0(v)}</b> · gastos <b>${fmt0(GASTOS_DIA[i])}</b> · ganancia <b>${fmt0(g)}</b>`]});
    return `<div class="resumen-gastos">
        <div class="rg rg-gasto"><small>Gastos de la semana</small><b>${fmt0(gastos)}</b><em>${vsGasto(gastos,GASTOS_ANTERIOR)}</em></div>
        <div class="rg rg-gan"><small>Ganancia</small><b>${fmt0(ganancia)}</b><em>ingresos ${fmt0(ingresos)} − gastos</em></div>
        <div class="rg rg-margen"><small>Margen</small><b>${margen}%</b><em>de cada $100 vendidos quedan $${margen}</em></div>
        <div class="rg rg-mayor"><small>Mayor gasto</small><b>${GASTOS[0][0].split(' ')[0]}</b><em>${pct(GASTOS[0][1],gastos)} de los gastos</em></div>
      </div>
      <div class="dos-col graf">
        ${bloque('Ganancia por día','ingresos menos gastos',barras(gan,'dias verde'),'verde')}
        ${bloque('Gastos por categoría',`${fmt0(gastos)} en total`,lista(GASTOS.map(([n,v])=>[n,v]),'dólares'),'rojo')}
      </div>`},
  pagos:()=>`<div class="dos-col">${bloque('Medios de pago',`${suma(MEDIOS)} pedidos`,lista(MEDIOS,'pedidos'),'morado')}${bloque('Domicilio o para llevar',`${suma(TIPO)} pedidos`,lista(TIPO,'pedidos'),'azul')}</div>`
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
