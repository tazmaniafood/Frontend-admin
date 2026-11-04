/* Menú: la cocina cambia lo que YA existe en la tienda (no puede crear ni borrar):
   - Platos, bordes y bebidas: nombre, descripción, precio y porción (g o ml); en pizzas y
     bebidas el precio y la porción van por tamaño.
   - Toppings y salsas: nombre (uno solo) y, por cada plato, su precio y su porción
     (en pizza la porción va por tamaño).
   Pantalla compacta: una pestaña por sección; cada plato es una fila que se abre para editar;
   toppings y salsas son una tabla por plato.

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
  const c=guardado.cambios[id];Object.keys(c).forEach(k=>{if(!(k in BASE[id]))delete c[k]});
  if(!Object.keys(c).length)delete guardado.cambios[id];
});
let borrador={};
const ref=id=>({...BASE[id],...(guardado.cambios[id]||{})});       // lo guardado
const val=id=>({...ref(id),...(borrador[id]||{})});                  // lo que se ve
const estado=id=>borrador[id]?'borr':guardado.cambios[id]?'edit':'';
const idsDe=s=>s.extras?s.items.flatMap(it=>[it.id,...M.platos.map(pl=>`${it.id}@${pl.id}`)]):s.items.map(i=>i.id);

let tab=(location.hash.slice(1)||M.secciones[0].id),plato=M.platos[0].id;
if(!SEC[tab])tab=M.secciones[0].id;
const abiertos=new Set();

/* ---- Formatos ---- */
const porcion=(g,u)=>g==null||g===''?'—':`${g} ${u}`;
const resumenPrecio=(it,s)=>Array.isArray(it.p)?it.p.map((p,i)=>`<span><small>${esc(corto(s.tamanos[i]))}</small> $${dinero(p)}</span>`).join(''):`<span>$${dinero(it.p)}</span>`;
const resumenPorcion=(it,s)=>Array.isArray(it.g)?(it.g.every(x=>x==null)?'<span class="falta">Sin porción</span>':it.g.map((g,i)=>`<span><small>${esc(corto(s.tamanos[i]))}</small> ${porcion(g,s.u)}</span>`).join('')):(it.g==null?'<span class="falta">Sin porción</span>':`<span>${porcion(it.g,s.u)}</span>`);
const corto=t=>({'Personal (lata)':'Lata','Personal':'P','Medium':'M','Familiar':'F'})[t]||t;
const chip=e=>e==='borr'?'<span class="chip borr">✏️ Sin guardar</span>':e==='edit'?'<span class="chip edit">✅ Modificado</span>':'';

/* ---- Campos ---- */
const inPrecio=(id,v,i,lab)=>`<span class="pesos"><i aria-hidden="true">$</i><input type="number" inputmode="decimal" min="0" max="${LIM.p}" step="0.01" value="${Number.isFinite(v)?dinero(v):''}" data-id="${id}" data-campo="p"${i!=null?` data-i="${i}"`:''} aria-label="${esc(lab)}"></span>`;
const inPorcion=(id,v,i,u,lab)=>`<span class="unidad"><input type="number" inputmode="decimal" min="0" max="${LIM.g}" step="1" value="${v==null?'':v}" placeholder="—" data-id="${id}" data-campo="g"${i!=null?` data-i="${i}"`:''} aria-label="${esc(lab)}"><i aria-hidden="true">${u}</i></span>`;

/* ---- Fila de plato / borde / bebida ---- */
function cabeza(id){
  const s=SEC[seccionDe(id)],it=val(id);
  return `<span class="f-nom"><b>${esc(it.n)}</b>${it.d!==undefined?`<small>${esc(it.d)}</small>`:''}</span>
    <span class="f-pre">${resumenPrecio(it,s)}</span>
    <span class="f-por">${resumenPorcion(it,s)}</span>
    <span class="f-est">${chip(estado(id))}</span>
    <span class="f-abrir" aria-hidden="true">${abiertos.has(id)?'▲':'✏️'}</span>`;
}
function editor(id){
  const s=SEC[seccionDe(id)],it=val(id),o=BASE[id];
  const filas=Array.isArray(o.p)
    ?s.tamanos.map((t,i)=>`<tr><th scope="row">${esc(t)}</th><td>${inPrecio(id,it.p[i],i,`Precio ${t}`)}</td><td>${inPorcion(id,it.g[i],i,s.u,`Porción ${t}`)}</td></tr>`).join('')
    :`<tr><th scope="row">Único</th><td>${inPrecio(id,it.p,null,'Precio')}</td><td>${inPorcion(id,it.g,null,s.u,'Porción')}</td></tr>`;
  return `<div class="editor">
    <label class="campo"><span>Nombre</span><input type="text" maxlength="${LIM.n}" value="${esc(it.n)}" data-id="${id}" data-campo="n"></label>
    ${o.d!==undefined?`<label class="campo"><span>Descripción <small class="cont">${(it.d||'').length}/${LIM.d}</small></span><textarea rows="2" maxlength="${LIM.d}" data-id="${id}" data-campo="d">${esc(it.d)}</textarea></label>`:''}
    <table class="tam"><thead><tr><th scope="col">Tamaño</th><th scope="col">Precio</th><th scope="col">Porción (${s.u})</th></tr></thead><tbody>${filas}</tbody></table>
    <div class="pie-ed">${estado(id)?`<p class="orig">Original: <b>${esc(o.n)}</b> · ${Array.isArray(o.p)?o.p.map(p=>'$'+dinero(p)).join(' / '):'$'+dinero(o.p)}</p><button class="btn sm" type="button" data-restaurar="${id}">↺ Volver al original</button>`:''}</div>
    <p class="err" role="alert"></p>
  </div>`;
}
function fila(id){
  const ab=abiertos.has(id);
  return `<article class="fila panel${estado(id)==='borr'?' cambiado':''}${ab?' abierta':''}" data-fila="${id}">
    <button class="f-cab" type="button" aria-expanded="${ab}" data-abrir="${id}">${cabeza(id)}</button>
    ${ab?editor(id):''}
  </article>`;
}
const seccionDe=id=>M.secciones.find(s=>s.items.some(i=>i.id===id.split('@')[0])).id;

/* ---- Tabla de toppings / salsas por plato ---- */
function tablaExtras(s){
  const pl=M.platos.find(p=>p.id===plato),esPizza=plato==='pizza',T=M.tamanosPizza;
  const cab=esPizza?T.map(t=>`<th scope="col" class="g">${esc(t)} <small>${s.u}</small></th>`).join(''):`<th scope="col" class="g">Porción <small>${s.u}</small></th>`;
  return `<div class="platos" role="tablist" aria-label="Plato">${M.platos.map(p=>`<button type="button" role="tab" class="pl${p.id===plato?' on':''}" aria-selected="${p.id===plato}" data-plato="${p.id}">${p.ico} ${esc(p.t)}${cuenta(s,p.id)}</button>`).join('')}</div>
  <p class="sub">${pl.ico} ${s.id==='toppings'?'Toppings':'Salsas'} en <b>${esc(pl.t)}</b>: precio que se cobra y cuánto se le echa${esPizza?' según el tamaño de la pizza':''}. El nombre es el mismo en todos los platos.</p>
  <div class="panel tabla-ex"><table class="ex${esPizza?' pizza':''}">
    <thead><tr><th scope="col">${s.id==='toppings'?'Topping':'Salsa'}</th><th scope="col" class="p">Precio</th>${cab}<th scope="col" class="e"><span class="sr">Estado</span></th></tr></thead>
    <tbody>${s.items.map(it=>{
      const k=`${it.id}@${plato}`,v=val(k),n=val(it.id).n,e=estado(k)||estado(it.id);
      const gs=esPizza?T.map((t,i)=>`<td class="g" data-l="${esc(t)}">${inPorcion(k,v.g[i],i,s.u,`${n} ${t}`)}</td>`).join(''):`<td class="g" data-l="Porción">${inPorcion(k,v.g,null,s.u,`Porción de ${n}`)}</td>`;
      return `<tr class="${e==='borr'?'cambiado':''}" data-fila="${k}">
        <td class="n"><input type="text" maxlength="${LIM.n}" value="${esc(n)}" data-id="${it.id}" data-campo="n" aria-label="Nombre"></td>
        <td class="p" data-l="Precio">${inPrecio(k,v.p,null,`Precio de ${n} en ${pl.t}`)}</td>${gs}
        <td class="e">${e?`<button class="mini" type="button" data-restaurar="${it.id}|${k}" title="Volver al original" aria-label="Volver ${esc(n)} al original">↺</button>`:''}</td>
      </tr>`}).join('')}</tbody></table></div>`;
}
const cuenta=(s,pid)=>{const n=s.items.filter(it=>estado(`${it.id}@${pid}`)).length;return n?` <b class="n">${n}</b>`:''};

/* ---- Pintar ---- */
function pintar(){
  document.getElementById('secciones').innerHTML=M.secciones.map(s=>{
    const n=idsDe(s).filter(estado).length;
    return `<button type="button" role="tab" class="tab${s.id===tab?' on':''}" aria-selected="${s.id===tab}" data-tab="${s.id}">${s.ico} ${esc(s.t)}${n?` <b class="n">${n}</b>`:''}</button>`}).join('');
  const s=SEC[tab];
  document.getElementById('menu').innerHTML=`<section class="sec" aria-label="${esc(s.t)}">
    ${s.extras?tablaExtras(s):`${s.nota?`<p class="sub">${esc(s.nota)}</p>`:''}
      <div class="lista-cab" aria-hidden="true"><span>Nombre</span><span>Precio</span><span>Porción</span><span></span><span></span></div>
      <div class="lista">${s.items.map(i=>fila(i.id)).join('')}</div>`}
  </section>`;
  barra();
}
function refrescarFila(id){ // actualiza el resumen sin tocar los campos que se están escribiendo
  const f=document.querySelector(`[data-fila="${id}"]`);if(!f)return;
  const c=f.querySelector('.f-cab');if(c)c.innerHTML=cabeza(id);
  f.classList.toggle('cambiado',estado(id)==='borr'||(f.tagName==='TR'&&estado(id.split('@')[0])==='borr'));
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
  const k=el.dataset.campo,v=el.value;
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
const MSG={n:'El nombre no puede quedar vacío.',p:`El precio debe estar entre $0 y $${LIM.p}.`,g:`La porción debe ser un número entre 0 y ${LIM.g} (o vacía).`};
function marcarError(el,ok){
  el.setAttribute('aria-invalid',!ok);
  const cont=el.closest('.editor')||el.closest('tr');
  if(cont&&cont.matches('.editor')){const malos=[...cont.querySelectorAll('[aria-invalid="true"]')].map(x=>MSG[x.dataset.campo]);cont.querySelector('.err').textContent=[...new Set(malos)].join(' ')}
}
document.addEventListener('input',e=>{
  const el=e.target;if(!el.dataset||!el.dataset.campo)return;
  const id=el.dataset.id,k=el.dataset.campo,i=el.dataset.i;
  if(k==='d'){const c=el.closest('.editor')?.querySelector('.cont');if(c)c.textContent=`${el.value.length}/${LIM.d}`}
  const x=leerCampo(el);marcarError(el,valido(k,x));
  let nuevo=x;
  if(i!==undefined){nuevo=[...val(id)[k]];nuevo[+i]=x}
  const b={...(borrador[id]||{})};
  if(iguales(nuevo,ref(id)[k]))delete b[k];else b[k]=nuevo;
  if(Object.keys(b).length)borrador[id]=b;else delete borrador[id];
  /* el nombre de un topping aparece en las 5 tablas: se actualiza el estado de su fila */
  document.querySelectorAll(`[data-fila="${id}"],[data-fila^="${id}@"]`).forEach(f=>refrescarFila(f.dataset.fila));
  if(!document.querySelector(`[data-fila="${id}"]`))refrescarFila(id);
});
document.addEventListener('change',e=>{const el=e.target;if(el.dataset&&el.dataset.campo==='p'&&el.value!==''&&!isNaN(parseFloat(el.value)))el.value=dinero(parseFloat(el.value))});

document.addEventListener('click',e=>{
  const t=e.target.closest('[data-tab]');
  if(t){tab=t.dataset.tab;history.replaceState(null,'','#'+tab);pintar();return}
  const p=e.target.closest('[data-plato]');
  if(p){plato=p.dataset.plato;pintar();return}
  const a=e.target.closest('[data-abrir]');
  if(a){const id=a.dataset.abrir;abiertos.has(id)?abiertos.delete(id):abiertos.add(id);
    const f=a.closest('.fila');f.outerHTML=fila(id);
    if(abiertos.has(id))document.querySelector(`[data-fila="${id}"] [data-campo="n"]`)?.focus({preventScroll:true});
    return}
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
  const malo=ids.find(id=>Object.entries(borrador[id]).some(([k,x])=>Array.isArray(x)?x.some(y=>!valido(k,y)):!valido(k,x)));
  if(malo){
    const s=seccionDe(malo);if(s!==tab){tab=s;pintar()}
    if(malo.includes('@')){plato=malo.split('@')[1];pintar()}
    else if(!abiertos.has(malo)){abiertos.add(malo);pintar()}
    document.querySelectorAll('[data-campo]').forEach(el=>marcarError(el,valido(el.dataset.campo,leerCampo(el))));
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
  TAZ.aviso(ok?`✅ ${msg} y enviados al servidor`:`💾 ${msg}. Se enviarán al servidor cuando esté disponible`);
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
