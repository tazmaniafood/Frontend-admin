/* Menú: la cocina cambia lo que YA existe en la tienda (no puede crear ni borrar):
   - Platos: nombre, descripción, precio y sus ingredientes, cada uno con su porción; se pueden
     AÑADIR ingredientes (y quitar los añadidos; los que trae la tienda solo se renombran)
     (en pizzas, por tamaño); la porción total del plato es la suma de los ingredientes.
   - Bordes y bebidas: nombre, precio y porción por tamaño (bordes según el tamaño de la pizza, bebidas en ml).
   - Toppings y salsas: nombre (uno solo) y, por cada plato, su precio y su porción
     (en pizza la porción va por tamaño).
   Pantalla compacta: una pestaña por sección; cada plato es una tarjeta pequeña (nombre y precios)
   que abre el editor en una ventana; toppings y salsas son una tabla por plato.

   Guardado: por id en este navegador (localStorage 'taz-menu') y se envía al servidor
       PUT /api/menu   { cambios: { "<id>": { n?, d?, p?, g? } }, actualizado }
   ids de toppings/salsas por plato: "<id>@<plato>" (ej. "topping-queso-extra@pizza").
   Si el servidor no responde, queda pendiente y se reintenta solo. */
(()=>{
const API='/api',KEY='taz-menu',LIM={n:60,d:220,p:999,g:99999};
const M=window.TAZ_MENU_BASE||{secciones:[],platos:[]};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const dinero=n=>(Math.round(n*100)/100).toFixed(2);
const iguales=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

/* ---- Base plana: id -> campos originales; meta: id -> sección ---- */
const BASE={},SEC={};
M.secciones.forEach(s=>{SEC[s.id]=s;s.items.forEach(it=>{
  if(s.extras){BASE[it.id]={n:it.n};M.platos.forEach(pl=>BASE[`${it.id}@${pl.id}`]={...it.plato[pl.id]})}
  else{const {id,...c}=it;BASE[id]=c}
})});

/* ---- Estado guardado y borrador ---- */
function leer(){try{const g=JSON.parse(localStorage.getItem(KEY));return g&&typeof g==='object'?g:{}}catch(e){return {}}}
function escribir(g){try{localStorage.setItem(KEY,JSON.stringify(g));return true}catch(e){return false}}
const guardado=leer();guardado.cambios=guardado.cambios||{};
/* quita lo que ya no existe en el menú base (por si cambió la tienda) */
Object.keys(guardado.cambios).forEach(id=>{
  if(!BASE[id])return delete guardado.cambios[id];
  /* y los campos que ese elemento ya no tiene (p. ej. el precio único de un topping de la versión anterior) */
  const c=guardado.cambios[id];Object.keys(c).forEach(k=>{if(!(k in BASE[id])||Array.isArray(c[k])!==Array.isArray(BASE[id][k]))delete c[k]});
  if(!Object.keys(c).length)delete guardado.cambios[id];
});
let borrador={};
const ref=id=>({...BASE[id],...(guardado.cambios[id]||{})});       // lo guardado
const val=id=>({...ref(id),...(borrador[id]||{})});                  // lo que se ve
const estado=id=>borrador[id]?'borr':guardado.cambios[id]?'edit':'';
const idsDe=s=>s.extras?s.items.flatMap(it=>[it.id,...M.platos.map(pl=>`${it.id}@${pl.id}`)]):s.items.map(i=>i.id);

let tab=(location.hash.slice(1)||M.secciones[0].id),plato=M.platos[0].id;
if(!SEC[tab])tab=M.secciones[0].id;
let actual=null; // plato abierto en la ventana de edición
/* Fotos de la tienda (miniaturas en IMG/Menu). Los platos que aún no tienen foto muestran su dibujo. */
const FOTOS={"pizza-hawaiana": "Menu/pizza-hawaiana.webp", "pizza-tropical": "Menu/pizza-tropical.webp", "pizza-ay-dios-mio": "Menu/pizza-ay-dios-mio.webp", "pizza-californiana": "Menu/pizza-californiana.webp", "pizza-mexicana": "Menu/pizza-mexicana.webp", "pizza-camarones": "Menu/pizza-camarones.webp", "pizza-la-4k": "Menu/pizza-la-4k.webp", "pizza-pizza-a-tu-gusto": "Menu/pizza-pizza-a-tu-gusto.webp", "bebida-coca-cola": "Menu/bebida-coca-cola.webp", "bebida-pepsi": "Menu/bebida-pepsi.webp", "bebida-sprite": "Menu/bebida-sprite.webp", "salsa-salsa-de-tomate": "Menu/salsa-salsa-de-tomate.svg", "salsa-salsa-rosada": "Menu/salsa-salsa-rosada.svg", "salsa-salsa-verde": "Menu/salsa-salsa-verde.svg", "topping-chorizo": "Menu/topping-chorizo.webp"};
const DIBUJO={pizzas:'🍕',bordes:'🧀',burger:'🍔',perro:'🌭',salchipapas:'🍟',mazorcada:'🌽',bebidas:'🥤',toppings:'🧀',salsas:'🥫'};
const foto=(id,sec,cls='')=>FOTOS[id]?`<img class="${cls}" src="../IMG/${FOTOS[id]}" alt="" loading="lazy">`:`<i class="dibujo ${cls}" aria-hidden="true">${DIBUJO[sec]||'🍽️'}</i>`;

/* ---- Formatos ---- */
const porcion=(g,u)=>g==null||g===''?'—':`${g} ${u}`;
const resumenPrecio=(it,s)=>Array.isArray(it.p)?it.p.map((p,i)=>`<span><small>${esc(corto(s.tamanos[i]))}</small>$${dinero(p)}</span>`).join(''):`<span>$${dinero(it.p)}</span>`;
/* Porción total de un plato = suma de sus ingredientes (j = tamaño en pizzas). null si no hay nada puesto */
const total=(ing,j)=>{const xs=ing.map(x=>j==null?x.g:x.g[j]).filter(v=>Number.isFinite(v));return xs.length?Math.round(xs.reduce((a,b)=>a+b,0)*10)/10:null};
const porTam=ing=>Array.isArray(ing[0]&&ing[0].g);
const resumenIng=(it,s)=>{
  const tot=porTam(it.ing)?s.tamanos.map((t,j)=>[t,total(it.ing,j)]):[[null,total(it.ing)]];
  const nIng=`<span class="n-ing">${it.ing.length} ingredientes</span>`;
  if(tot.every(([,v])=>v==null))return `<span class="falta">Sin porción</span>${nIng}`;
  return tot.map(([t,v])=>`<span>${t?`<small>${esc(corto(t))}</small>`:''}${porcion(v,s.u)}</span>`).join('')+nIng;
};
const resumenPorcion=(it,s)=>it.ing?resumenIng(it,s):Array.isArray(it.g)?(it.g.every(x=>x==null)?'<span class="falta">Sin porción</span>':it.g.map((g,i)=>`<span><small>${esc(corto(s.tamanos[i]))}</small> ${porcion(g,s.u)}</span>`).join('')):(it.g==null?'<span class="falta">Sin porción</span>':`<span>${porcion(it.g,s.u)}</span>`);
const corto=t=>({'Personal (lata)':'Lata','Personal':'P','Medium':'M','Familiar':'F'})[t]||t;
const chip=e=>e==='borr'?'<span class="est borr"><i></i>Sin guardar</span>':e==='edit'?'<span class="est edit"><i></i>Modificado</span>':'';

/* ---- Campos ---- */
const inPrecio=(id,v,i,lab)=>`<span class="pesos"><i aria-hidden="true">$</i><input class="fld" type="number" inputmode="decimal" min="0" max="${LIM.p}" step="0.01" value="${Number.isFinite(v)?dinero(v):''}" data-id="${id}" data-campo="p"${i!=null?` data-i="${i}"`:''} aria-label="${esc(lab)}"></span>`;
const inPorcion=(id,v,i,u,lab)=>`<span class="unidad"><input class="fld" type="number" inputmode="decimal" min="0" max="${LIM.g}" step="1" value="${v==null?'':v}" placeholder="—" data-id="${id}" data-campo="g"${i!=null?` data-i="${i}"`:''} aria-label="${esc(lab)}"><i aria-hidden="true">${u}</i></span>`;

/* ---- Fila de plato / borde / bebida ---- */
/* precios en una línea: "P $13 · M $19 · F $24" (sin centavos si son .00) */
const corto$=n=>'$'+(Number.isInteger(Math.round(n*100)/100)?String(Math.round(n)):dinero(n));
const precioCorto=(it,s)=>Array.isArray(it.p)?it.p.map((p,i)=>`<span><small>${esc(corto(s.tamanos[i]))}</small>${corto$(p)}</span>`).join('<i>·</i>'):`<span>${corto$(it.p)}</span>`;
function cabeza(id){ // contenido de la tarjeta: solo lo necesario para reconocer el plato
  const s=SEC[seccionDe(id)],it=val(id),e=estado(id);
  const extra=it.ing?`${it.ing.length} ingredientes`:it.g!==undefined?(Array.isArray(it.g)?(it.g.some(x=>x!=null)?'Con porción':'Sin porción'):(it.g==null?'Sin porción':porcion(it.g,s.u))):'';
  return `<span class="p-foto">${foto(id,s.id)}${e?`<i class="p-dot ${e}" title="${e==='borr'?'Sin guardar':'Modificado'}"></i>`:''}</span>
    <span class="p-cuerpo"><span class="p-top"><b>${esc(it.n)}</b></span>
    <span class="p-pre">${precioCorto(it,s)}</span>
    ${extra?`<span class="p-meta">${extra}</span>`:''}</span>`;
}
/* campo de porción de un ingrediente */
const inIng=(id,i,j,v,u,lab)=>`<span class="unidad"><input class="fld" type="number" inputmode="decimal" min="0" max="${LIM.g}" step="1" value="${v==null?'':v}" placeholder="—" data-id="${id}" data-campo="ing" data-i="${i}" data-k="g"${j!=null?` data-j="${j}"`:''} aria-label="${esc(lab)}"><i aria-hidden="true">${u}</i></span>`;
function tablaIng(id,it,s){
  const tam=porTam(it.ing),T=tam?s.tamanos:[null];
  return `<div class="bloque"><h5><span>3</span> Ingredientes <small>${it.ing.length} · porción de cada uno en ${s.u}${tam?', por tamaño':''}</small></h5>
  <table class="ing${tam?' tam3':''}"><thead><tr><th scope="col">Ingrediente</th>${T.map(t=>`<th scope="col" class="g">${t?esc(t):'Porción'}</th>`).join('')}</tr></thead>
  <tbody>${it.ing.map((x,i)=>`<tr${i>=BASE[id].ing.length?' class="nuevo-ing"':''}><td class="n"><span class="n-cel"><input class="fld fld-txt" type="text" maxlength="${LIM.n}" value="${esc(x.n)}" placeholder="Nombre del ingrediente" data-id="${id}" data-campo="ing" data-i="${i}" data-k="n" aria-label="Ingrediente ${i+1}">${i>=BASE[id].ing.length?`<button class="quitar" type="button" data-quitar="${id}|${i}" title="Quitar este ingrediente" aria-label="Quitar ${esc(x.n||'ingrediente')}">✕</button>`:''}</span></td>
    ${T.map((t,j)=>`<td class="g" data-l="${t?esc(t):'Porción'}">${inIng(id,i,tam?j:null,tam?x.g[j]:x.g,s.u,`${x.n}${t?' '+t:''}`)}</td>`).join('')}</tr>`).join('')}</tbody>
  <tfoot><tr><th scope="row">Porción total</th>${T.map((t,j)=>`<td class="g tot" data-l="${t?esc(t):'Total'}" data-total="${tam?j:''}">${porcion(total(it.ing,tam?j:null),s.u)}</td>`).join('')}</tr></tfoot></table>
  <button class="anadir" type="button" data-anadir="${id}">Añadir ingrediente</button></div>`;
}
function editor(id){
  const s=SEC[seccionDe(id)],it=val(id),o=BASE[id];
  /* precios por tamaño como "fichas": círculo que crece (P, M, F), precio y porción */
  const T=Array.isArray(o.p)?s.tamanos:[null];
  const conG=it.g!==undefined,tamIng=it.ing&&porTam(it.ing);
  const ficha=(t,i)=>{
    const tot=it.ing?`<span class="talla-tot"><small>Porción</small><b data-total="${tamIng?i:''}">${porcion(total(it.ing,tamIng?i:null),s.u)}</b></span>`:'';
    const g=conG?`<span class="talla-g"><small>Porción</small>${inPorcion(id,Array.isArray(o.g)?it.g[i]:it.g,Array.isArray(o.g)?i:null,s.u,t?`Porción ${t}`:'Porción')}</span>`:'';
    return `<div class="talla t${t?i:1}"><span class="talla-cab"><i class="talla-ico" aria-hidden="true"></i><b>${t?esc(t):'Precio'}</b></span>
      ${inPrecio(id,t?it.p[i]:it.p,t?i:null,t?`Precio ${t}`:'Precio')}${tot}${g}</div>`;
  };
  return `<div class="editor">
    <section class="ed-card ed-info">
      <h5><span>1</span> Información</h5>
      <label class="campo"><span>Nombre</span><input class="fld" type="text" maxlength="${LIM.n}" value="${esc(it.n)}" data-id="${id}" data-campo="n"></label>
      ${o.d!==undefined?`<label class="campo"><span>Descripción <small class="cont">${(it.d||'').length}/${LIM.d}</small></span><textarea class="fld" rows="2" maxlength="${LIM.d}" data-id="${id}" data-campo="d">${esc(it.d)}</textarea></label>`:''}
    </section>
    <section class="ed-card ed-precios">
      <h5><span>2</span> ${conG?'Precio y porción':'Precio'}${Array.isArray(o.p)?(s.id==='bordes'?' por tamaño de pizza':' por tamaño'):''}</h5>
      <div class="tallas n${T.length}">${T.map(ficha).join('')}</div>
    </section>
    ${it.ing?`<section class="ed-card ed-ing">${tablaIng(id,it,s)}</section>`:''}
    <div class="pie-ed">${estado(id)?`<p class="orig">Original: ${esc(o.n)} · ${Array.isArray(o.p)?o.p.map(p=>'$'+dinero(p)).join(' / '):'$'+dinero(o.p)}</p><button class="btn-txt" type="button" data-restaurar="${id}">Volver al original</button>`:''}</div>
    <p class="err" role="alert"></p>
  </div>`;
}
function fila(id){
  const e=estado(id);
  return `<button class="plato${e?' '+e:''}" type="button" data-abrir="${id}" data-fila="${id}" aria-haspopup="dialog">${cabeza(id)}</button>`;
}
/* ---- Ventana de edición ---- */
const dlg=document.createElement('dialog');
dlg.className='editor-dlg';dlg.setAttribute('aria-labelledby','ed-tit');
document.body.appendChild(dlg);
function pintarDlg(){
  if(!actual)return;
  const s=SEC[seccionDe(actual)];
  dlg.className=`editor-dlg ${COLOR[s.id]||'c-crema'}`;
  const v=val(actual);
  dlg.innerHTML=`<div class="dlg-top"><span class="dlg-foto${s.id==='pizzas'?' gira':''}">${foto(actual,s.id)}</span><span class="dlg-nom"><small>${esc(s.t)}</small><b id="ed-tit">${esc(v.n)}</b>${v.d?`<em id="ed-desc">${esc(v.d)}</em>`:''}<span class="dlg-precios" id="ed-precios">${precioCorto(v,s)}</span></span><button class="dlg-x" type="button" data-cerrar aria-label="Cerrar">✕</button></div>
    <div class="dlg-cuerpo">${editor(actual)}</div>
    <div class="dlg-pie"><span class="sub">Los cambios se guardan con el botón de abajo.</span><button class="btn ok" type="button" data-cerrar>Listo</button></div>`;
}
function abrir(id){actual=id;pintarDlg();if(!dlg.open)dlg.showModal();dlg.querySelector('[data-campo="n"]')?.focus({preventScroll:true})}
dlg.addEventListener('close',()=>{actual=null;pintar()});
dlg.addEventListener('click',e=>{if(e.target===dlg||e.target.closest('[data-cerrar]'))dlg.close()});
const seccionDe=id=>M.secciones.find(s=>s.items.some(i=>i.id===id.split('@')[0])).id;

/* ---- Tabla de toppings / salsas por plato ---- */
/* ---- Toppings y salsas: tarjetas por plato ---- */
const ICO_EX=[['queso','🧀'],['jamón','🍖'],['tocineta','🥓'],['pepperoni','🍕'],['pollo','🍗'],['carne','🥩'],['chorizo','🌭'],['camaron','🦐'],
  ['champiñon','🍄'],['piña','🍍'],['maíz','🌽'],['cebolla','🧅'],['pimentón','🫑'],['tomate','🍅'],['jalapeño','🌶️'],['durazno','🍑'],['cereza','🍒'],['salsa','🥫']];
const icoEx=n=>(ICO_EX.find(([k])=>n.toLowerCase().includes(k))||[,'✨'])[1];
const ICO_PL={pizza:'🍕',burger:'🍔',perro:'🌭',salchipapas:'🍟',mazorcada:'🌽'};
function tablaExtras(s){
  const pl=M.platos.find(p=>p.id===plato),esPizza=plato==='pizza',T=M.tamanosPizza;
  const tarjeta=it=>{
    const k=`${it.id}@${plato}`,v=val(k),base=val(it.id),n=base.n,e=estado(k)||estado(it.id);
    const ico=FOTOS[it.id]?`<img src="../IMG/${FOTOS[it.id]}" alt="">`:`<i aria-hidden="true">${icoEx(BASE[it.id].n)}</i>`;
    const porciones=esPizza
      ?`<div class="ex-g tres">${T.map((t,i)=>`<label><span>${esc(t[0])}<em>${esc(t)}</em></span>${inPorcion(k,v.g[i],i,s.u,`${n} ${t}`)}</label>`).join('')}</div>`
      :`<div class="ex-g"><label><span>Porción</span>${inPorcion(k,v.g,null,s.u,`Porción de ${n}`)}</label></div>`;
    return `<article class="extra${e?' '+e:''}${e==='borr'?' cambiado':''}" data-fila="${k}">
      <div class="ex-cab"><span class="ex-ico">${ico}</span>
        <input class="fld fld-txt ex-nom" type="text" maxlength="${LIM.n}" value="${esc(n)}" data-id="${it.id}" data-campo="n" aria-label="Nombre">
        ${e?`<button class="ex-orig" type="button" data-restaurar="${it.id}|${k}" title="Volver al original" aria-label="Volver ${esc(n)} al original">↺</button>`:''}</div>
      <div class="ex-cuerpo"><label class="ex-p"><span>Precio</span>${inPrecio(k,v.p,null,`Precio de ${n} en ${pl.t}`)}</label>${porciones}</div>
    </article>`;
  };
  return `<div class="chips platos" role="tablist" aria-label="Plato">${M.platos.map(p=>`<button type="button" role="tab" class="pl${p.id===plato?' on':''}" aria-selected="${p.id===plato}" data-plato="${p.id}"><span aria-hidden="true">${ICO_PL[p.id]||''}</span> ${esc(p.t)}${cuenta(s,p.id)}</button>`).join('')}</div>
  <p class="sub">${s.id==='toppings'?'Toppings':'Salsas'} en <b>${ICO_PL[plato]||''} ${esc(pl.t)}</b>: precio y cuánto se le echa${esPizza?' según el tamaño (P · M · F)':''}. El nombre cambia en todos los platos.</p>
  <div class="extras-grid${esPizza?' pizza':''}">${s.items.map(tarjeta).join('')}</div>`;
}
const cuenta=(s,pid)=>{const n=s.items.filter(it=>estado(`${it.id}@${pid}`)).length;return n?` <b class="n">${n}</b>`:''};

/* ---- Pintar ---- */
const COLOR={pizzas:'c-naranja',bordes:'c-amarillo',burger:'c-amarillo',perro:'c-rojo',salchipapas:'c-naranja',mazorcada:'c-verde',bebidas:'c-azul',toppings:'c-verde',salsas:'c-rojo'};
/* guarda en el borrador una lista nueva de ingredientes */
function cambiarIng(id,ing){
  const b={...(borrador[id]||{})};
  if(iguales(ing,ref(id).ing))delete b.ing;else b.ing=ing;
  if(Object.keys(b).length)borrador[id]=b;else delete borrador[id];
  refrescarFila(id);
}
function pintar(){
  document.getElementById('secciones').innerHTML=M.secciones.map(s=>{
    const n=idsDe(s).filter(estado).length;
    return `<button type="button" role="tab" class="tab ${COLOR[s.id]||''}${s.id===tab?' on':''}" aria-selected="${s.id===tab}" data-tab="${s.id}">${esc(s.t)}${n?` <b class="n">${n}</b>`:''}</button>`}).join('');
  const s=SEC[tab];
  /* caja con banda de color, igual que en Cocina y Estadísticas (mismo color por categoría) */
  document.getElementById('menu').innerHTML=`<section class="caja sec ${COLOR[s.id]||'c-crema'}" data-sec="${s.id}" aria-label="${esc(s.t)}">
    <h2 class="banda"><span>${esc(s.t)}${s.nota?` <small>${esc(s.nota)}</small>`:''}</span><b class="n">${s.items.length}</b></h2>
    ${s.extras?`<div class="cuerpo">${tablaExtras(s)}</div>`:`<div class="platos-grid">${s.items.map(i=>fila(i.id)).join('')}</div>`}
  </section>`;
  if(actual&&dlg.open)pintarDlg();
  barra();
}
function refrescarFila(id){ // actualiza el resumen sin tocar los campos que se están escribiendo
  const f=document.querySelector(`[data-fila="${id}"]`);if(!f)return;
  if(f.classList.contains('plato')){f.innerHTML=cabeza(id);f.classList.remove('borr','edit');if(estado(id))f.classList.add(estado(id))}
  if(f.classList.contains('extra')){const e=estado(id)||estado(id.split('@')[0]);f.classList.remove('borr','edit');if(e)f.classList.add(e)}
  f.classList.toggle('cambiado',f.classList.contains('extra')&&(estado(id)==='borr'||estado(id.split('@')[0])==='borr'));
  if(actual===id){const t=dlg.querySelector('#ed-tit');if(t)t.textContent=val(id).n}
  const tabs=document.getElementById('secciones');
  tabs.querySelectorAll('.tab').forEach(t=>{const s=SEC[t.dataset.tab],n=idsDe(s).filter(estado).length;const b=t.querySelector('.n');if(n){if(b)b.textContent=n;else t.insertAdjacentHTML('beforeend',` <b class="n">${n}</b>`)}else if(b)b.remove()});
  barra();
}
function barra(){
  const n=Object.keys(borrador).length,b=document.getElementById('barra');
  b.hidden=!n&&!guardado.pendiente;b.classList.toggle('solo-pendiente',!n&&!!guardado.pendiente);
  document.getElementById('barra-txt').textContent=n?`✏️ ${n} ${n===1?'cambio':'cambios'} sin guardar`:guardado.pendiente?'⏳ Guardado aquí, falta enviarlo al servidor':'';
  document.getElementById('guardar').textContent=n?'💾 Guardar':'↻ Reintentar envío';
  document.getElementById('descartar').hidden=!n;
}

/* ---- Leer y validar un campo ---- */
function leerCampo(el){
  const k=el.dataset.campo==='ing'?el.dataset.k:el.dataset.campo,v=el.value;
  if(k==='n'||k==='d')return v.replace(/\s+/g,' ').trim();
  if(k==='p'){const x=parseFloat(v);return v===''||isNaN(x)?NaN:Math.round(x*100)/100}
  if(k==='g'){if(v==='')return null;const x=parseFloat(v);return isNaN(x)?NaN:Math.round(x*10)/10}
}
function valido(k,x){
  if(k==='n')return !!x;
  if(k==='d')return true;
  if(k==='p')return Number.isFinite(x)&&x>=0&&x<=LIM.p;
  if(k==='g')return x===null||(Number.isFinite(x)&&x>=0&&x<=LIM.g);
}
/* valida un valor guardado en el borrador (los ingredientes son una lista de {n, g}) */
function validoValor(k,x){
  if(k==='ing')return x.every(r=>valido('n',r.n)&&(Array.isArray(r.g)?r.g.every(v=>valido('g',v)):valido('g',r.g)));
  return Array.isArray(x)?x.every(y=>valido(k,y)):valido(k,x);
}
const MSG={n:'El nombre no puede quedar vacío.',p:`El precio debe estar entre $0 y $${LIM.p}.`,g:`La porción debe ser un número entre 0 y ${LIM.g} (o vacía).`};
function marcarError(el,ok){
  el.setAttribute('aria-invalid',!ok);
  const cont=el.closest('.editor')||el.closest('tr');
  if(cont&&cont.matches('.editor')){const malos=[...cont.querySelectorAll('[aria-invalid="true"]')].map(x=>MSG[x.dataset.campo==='ing'?x.dataset.k:x.dataset.campo]);cont.querySelector('.err').textContent=[...new Set(malos)].join(' ')}
}
document.addEventListener('input',e=>{
  const el=e.target;if(!el.dataset||!el.dataset.campo)return;
  const id=el.dataset.id,k=el.dataset.campo,i=el.dataset.i;
  if(k==='d'){const c=el.closest('.editor')?.querySelector('.cont');if(c)c.textContent=`${el.value.length}/${LIM.d}`}
  const x=leerCampo(el);marcarError(el,valido(k==='ing'?el.dataset.k:k,x));
  let nuevo=x;
  if(k==='ing'){ // ingrediente i: su nombre o su porción (j = tamaño)
    nuevo=val(id).ing.map(r=>({n:r.n,g:Array.isArray(r.g)?[...r.g]:r.g}));
    const r=nuevo[+i];
    if(el.dataset.k==='n')r.n=x;else if(el.dataset.j!==undefined)r.g[+el.dataset.j]=x;else r.g=x;
  }else if(i!==undefined){nuevo=[...val(id)[k]];nuevo[+i]=x}
  const b={...(borrador[id]||{})};
  if(iguales(nuevo,ref(id)[k]))delete b[k];else b[k]=nuevo;
  if(Object.keys(b).length)borrador[id]=b;else delete borrador[id];
  if(k==='ing'){ // porción total en vivo
    const ed=el.closest('.editor'),s=SEC[seccionDe(id)],ing=val(id).ing;
    ed?.querySelectorAll('[data-total]').forEach(c=>c.textContent=porcion(total(ing,c.dataset.total===''?null:+c.dataset.total),s.u));
  }
  /* el nombre de un topping aparece en las 5 tablas: se actualiza el estado de su fila */
  document.querySelectorAll(`[data-fila="${id}"],[data-fila^="${id}@"]`).forEach(f=>refrescarFila(f.dataset.fila));
  if(!document.querySelector(`[data-fila="${id}"]`))refrescarFila(id);
  if(actual===id){const t=dlg.querySelector('#ed-tit');if(t)t.textContent=val(id).n;
    const de=dlg.querySelector('#ed-desc');if(de)de.textContent=val(id).d||'';
    const pr=dlg.querySelector('#ed-precios');if(pr)pr.innerHTML=precioCorto(val(id),SEC[seccionDe(id)])}
});
document.addEventListener('change',e=>{const el=e.target;if(el.dataset&&el.dataset.campo==='p'&&el.value!==''&&!isNaN(parseFloat(el.value)))el.value=dinero(parseFloat(el.value))});

document.addEventListener('click',e=>{
  const t=e.target.closest('[data-tab]');
  if(t){tab=t.dataset.tab;history.replaceState(null,'','#'+tab);pintar();return}
  const p=e.target.closest('[data-plato]');
  if(p){plato=p.dataset.plato;pintar();return}
  const a=e.target.closest('[data-abrir]');
  if(a){abrir(a.dataset.abrir);return}
  const an=e.target.closest('[data-anadir]');
  if(an){const id=an.dataset.anadir,ing=val(id).ing.map(r=>({n:r.n,g:Array.isArray(r.g)?[...r.g]:r.g}));
    ing.push({n:'',g:porTam(ing)?ing[0].g.map(()=>null):null});
    cambiarIng(id,ing);pintarDlg();
    const ins=dlg.querySelectorAll('[data-k="n"]');ins[ins.length-1]?.focus();return}
  const qu=e.target.closest('[data-quitar]');
  if(qu){const [id,i]=qu.dataset.quitar.split('|'),ing=val(id).ing.map(r=>({n:r.n,g:Array.isArray(r.g)?[...r.g]:r.g}));
    ing.splice(+i,1);cambiarIng(id,ing);pintarDlg();refrescarFila(id);return}
  const r=e.target.closest('[data-restaurar]');
  if(r){const ids=r.dataset.restaurar.split('|'),o=BASE[ids[0]];
    if(!confirm(`¿Volver "${val(ids[0]).n}" a como está en la tienda${ids[1]?` (en ${M.platos.find(x=>ids[1].endsWith('@'+x.id)).t})`:''}?`))return;
    let habia=false;ids.forEach(id=>{delete borrador[id];if(guardado.cambios[id]){delete guardado.cambios[id];habia=true}});
    if(habia)guardarTodo(`"${o.n}" volvió al original`);else{pintar();TAZ.aviso('Cambios descartados')}
  }
});
document.getElementById('descartar').addEventListener('click',()=>{
  const n=Object.keys(borrador).length;if(!n||!confirm(`¿Descartar ${n} ${n===1?'cambio':'cambios'} sin guardar?`))return;
  borrador={};pintar();TAZ.aviso('Cambios descartados');
});
document.getElementById('guardar').addEventListener('click',()=>{
  const ids=Object.keys(borrador);
  if(!ids.length)return enviar();
  const malo=ids.find(id=>Object.entries(borrador[id]).some(([k,x])=>!validoValor(k,x)));
  if(malo){
    const s=seccionDe(malo);if(s!==tab){tab=s;pintar()}
    if(malo.includes('@')){plato=malo.split('@')[1];pintar()}
    else abrir(malo);
    document.querySelectorAll('[data-campo]').forEach(el=>marcarError(el,valido(el.dataset.campo==='ing'?el.dataset.k:el.dataset.campo,leerCampo(el))));
    const el=document.querySelector('[aria-invalid="true"]');if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.focus({preventScroll:true})}
    return TAZ.aviso('Revisa los campos marcados en rojo');
  }
  ids.forEach(id=>{
    const c={...(guardado.cambios[id]||{}),...borrador[id]},o=BASE[id],r={};
    Object.keys(c).forEach(k=>{if(!iguales(c[k],o[k]===undefined&&k==='d'?'':o[k]))r[k]=c[k]});
    if(Object.keys(r).length)guardado.cambios[id]=r;else delete guardado.cambios[id];
  });
  borrador={};
  guardarTodo(`${ids.length} ${ids.length===1?'cambio guardado':'cambios guardados'}`);
});
async function guardarTodo(msg){
  guardado.actualizado=Date.now();guardado.pendiente=true;
  if(!escribir(guardado)){TAZ.aviso('⚠️ No se pudo guardar en este navegador');return}
  pintar();
  const ok=await enviar(true);
  TAZ.aviso(ok?`✅ ${msg} · enviado al servidor`:`💾 ${msg} · se enviará al servidor cuando esté disponible`);
}
let enviando=false;
async function enviar(callado){
  if(enviando)return false;enviando=true;
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),15000);
  try{
    const r=await fetch(`${API}/menu`,{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'same-origin',signal:ctl.signal,
      body:JSON.stringify({cambios:guardado.cambios,actualizado:guardado.actualizado})});
    if(!r.ok)throw new Error(r.status);
    guardado.pendiente=false;escribir(guardado);
    if(!callado)TAZ.aviso('✅ Cambios enviados al servidor');
    return true;
  }catch(e){if(!callado)TAZ.aviso('El servidor no respondió; se reintentará solo');return false}
  finally{clearTimeout(t);enviando=false;barra()}
}
window.addEventListener('beforeunload',e=>{if(Object.keys(borrador).length){e.preventDefault();e.returnValue=''}});
window.addEventListener('online',()=>{if(guardado.pendiente)enviar(true)});

pintar();
if(guardado.pendiente)enviar(true);
setInterval(()=>{if(guardado.pendiente)enviar(true)},30000);
})();
