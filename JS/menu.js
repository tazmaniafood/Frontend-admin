/* Menú: la cocina cambia nombre, descripción y precios de lo que YA existe en la tienda
   (platos, bordes, bebidas, toppings y salsas). No se puede crear ni borrar nada:
   la lista sale de menu-base.js y aquí solo se editan sus campos.

   Lo cambiado se guarda por id en este navegador (localStorage 'taz-menu') y se envía al servidor:
       PUT /api/menu   { cambios: { "<id>": { n, d, p } }, actualizado }
   Si el servidor no responde, queda "pendiente de enviar" y se reintenta solo.
   La tienda mostrará los cambios cuando lea el menú desde el servidor. */
(()=>{
const API='/api',KEY='taz-menu';
const BASE=window.TAZ_MENU_BASE||[];
const LIM={n:60,d:220,pmax:999};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const dinero=n=>(Math.round(n*100)/100).toFixed(2);

/* ---- Guardado ---- */
function leer(){try{const g=JSON.parse(localStorage.getItem(KEY));return g&&typeof g==='object'?g:{}}catch(e){return {}}}
function escribir(g){try{localStorage.setItem(KEY,JSON.stringify(g));return true}catch(e){return false}}
let guardado=leer();              // {cambios:{id:{n,d,p}}, pendiente:bool, actualizado}
guardado.cambios=guardado.cambios||{};
let borrador={};                  // cambios en pantalla que todavía no se guardan: {id:{n,d,p}}

const items={};BASE.forEach(s=>s.items.forEach(i=>items[i.id]={...i,sec:s}));
/* valor actual de un elemento = original + lo guardado + lo que se está escribiendo */
const actual=id=>({...items[id],...(guardado.cambios[id]||{}),...(borrador[id]||{})});
const iguales=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
/* quita del objeto los campos que quedaron igual al original */
function limpiar(id,c){
  const o=items[id],r={};
  if(c.n!==undefined&&c.n!==o.n)r.n=c.n;
  if(c.d!==undefined&&c.d!==(o.d||''))r.d=c.d;
  if(c.p!==undefined&&!iguales(c.p,o.p))r.p=c.p;
  return Object.keys(r).length?r:null;
}

/* ---- Pintar ---- */
function campoPrecio(it,i,lab){
  const v=Array.isArray(it.p)?it.p[i]:it.p;
  return `<label class="precio"><span>${esc(lab||'Precio')}</span><span class="pesos"><i aria-hidden="true">$</i>
    <input type="number" inputmode="decimal" min="0" max="${LIM.pmax}" step="0.01" value="${dinero(v)}" data-campo="p" data-i="${i}" aria-label="${esc(lab?'Precio '+lab:'Precio')} de ${esc(it.n)}" required></span></label>`;
}
function tarjeta(id){
  const it=actual(id),o=items[id],sec=o.sec;
  const editadoGuardado=!!guardado.cambios[id],enBorrador=!!borrador[id];
  const precios=Array.isArray(o.p)?sec.tamanos.map((t,i)=>campoPrecio(it,i,t)).join(''):campoPrecio(it,null,'');
  return `<article class="item panel${enBorrador?' cambiado':''}" data-id="${id}">
    <div class="item-cab">
      <span class="marca">${enBorrador?'<span class="chip borr">✏️ Sin guardar</span>':editadoGuardado?'<span class="chip edit">✅ Modificado</span>':''}</span>
      ${editadoGuardado||enBorrador?`<button class="btn sm restaurar" type="button" data-restaurar title="Volver al nombre, descripción y precio originales">↺ Original</button>`:''}
    </div>
    <label class="campo"><span>Nombre</span><input type="text" maxlength="${LIM.n}" value="${esc(it.n)}" data-campo="n" required aria-label="Nombre"></label>
    ${o.d!==undefined?`<label class="campo"><span>Descripción</span><textarea rows="3" maxlength="${LIM.d}" data-campo="d" aria-label="Descripción de ${esc(o.n)}">${esc(it.d)}</textarea><small class="cont">${(it.d||'').length}/${LIM.d}</small></label>`:''}
    <div class="precios${Array.isArray(o.p)?' varios':''}">${precios}</div>
    ${editadoGuardado||enBorrador?`<p class="orig">Original: <b>${esc(o.n)}</b> · ${Array.isArray(o.p)?o.p.map((p,i)=>`${esc(sec.tamanos[i])} $${dinero(p)}`).join(' · '):'$'+dinero(o.p)}</p>`:''}
    <p class="err" role="alert"></p>
  </article>`;
}
function pintar(){
  document.getElementById('secciones').innerHTML=BASE.map(s=>`<a href="#sec-${s.id}">${s.ico} ${esc(s.t)}</a>`).join('');
  document.getElementById('menu').innerHTML=BASE.map(s=>`<section class="sec" id="sec-${s.id}">
    <h2>${s.ico} ${esc(s.t)} <small>${s.items.length}</small></h2>${s.nota?`<p class="sub">${esc(s.nota)}</p>`:''}
    <div class="items">${s.items.map(i=>tarjeta(i.id)).join('')}</div></section>`).join('');
  barra();
}
function repintar(id){const el=document.querySelector(`.item[data-id="${id}"]`);if(!el)return;
  const foco=document.activeElement&&el.contains(document.activeElement)?[document.activeElement.dataset.campo,document.activeElement.dataset.i,document.activeElement.selectionStart]:null;
  el.outerHTML=tarjeta(id);
  if(foco){const n=document.querySelector(`.item[data-id="${id}"] [data-campo="${foco[0]}"]${foco[1]!==undefined?`[data-i="${foco[1]}"]`:''}`);if(n){n.focus();try{if(foco[2]!=null)n.setSelectionRange(foco[2],foco[2])}catch(e){}}}
  barra();
}
function barra(){
  const n=Object.keys(borrador).length,b=document.getElementById('barra');
  b.hidden=!n&&!guardado.pendiente;
  b.classList.toggle('solo-pendiente',!n&&!!guardado.pendiente);
  document.getElementById('barra-txt').textContent=n?`✏️ ${n} ${n===1?'elemento':'elementos'} con cambios sin guardar`:guardado.pendiente?'⏳ Cambios guardados aquí, falta enviarlos al servidor':'';
  document.getElementById('guardar').textContent=n?'💾 Guardar cambios':'↻ Reintentar envío';
  document.getElementById('descartar').hidden=!n;
}

/* ---- Editar ---- */
function validar(el){
  const id=el.dataset.id,errs=[];
  el.querySelectorAll('[data-campo]').forEach(c=>{
    const v=c.value;let ok=true;
    if(c.dataset.campo==='n'&&!v.trim()){ok=false;errs.push('El nombre no puede quedar vacío.')}
    if(c.dataset.campo==='p'){const x=parseFloat(v);if(v===''||isNaN(x)||x<0||x>LIM.pmax){ok=false;errs.push(`El precio debe estar entre $0 y $${LIM.pmax}.`)}}
    c.setAttribute('aria-invalid',!ok);
  });
  el.querySelector('.err').textContent=[...new Set(errs)].join(' ');
  return !errs.length;
}
function leerTarjeta(el){
  const id=el.dataset.id,o=items[id],c={};
  el.querySelectorAll('[data-campo]').forEach(x=>{
    const k=x.dataset.campo;
    if(k==='n')c.n=x.value.replace(/\s+/g,' ').trim();
    if(k==='d')c.d=x.value.replace(/\s+/g,' ').trim();
    if(k==='p'){const v=Math.round((parseFloat(x.value)||0)*100)/100;if(Array.isArray(o.p)){c.p=c.p||[...actual(id).p];c.p[+x.dataset.i]=v}else c.p=v}
  });
  return c;
}
document.addEventListener('input',e=>{
  const el=e.target.closest('.item');if(!el)return;
  const id=el.dataset.id;
  if(e.target.dataset.campo==='d'){const k=el.querySelector('.cont');if(k)k.textContent=`${e.target.value.length}/${LIM.d}`}
  validar(el);
  const nuevo=leerTarjeta(el),base={...items[id],...(guardado.cambios[id]||{})};
  const dif=['n','d','p'].some(k=>nuevo[k]!==undefined&&!iguales(nuevo[k],k==='d'?(base.d||''):base[k]));
  const antes=!!borrador[id];
  if(dif)borrador[id]=nuevo;else delete borrador[id];
  el.classList.toggle('cambiado',dif);
  if(antes!==dif){ // cambia la etiqueta de la tarjeta sin perder lo que se escribe
    const m=el.querySelector('.marca');m.innerHTML=dif?'<span class="chip borr">✏️ Sin guardar</span>':guardado.cambios[id]?'<span class="chip edit">✅ Modificado</span>':'';
  }
  barra();
});
/* al salir del campo, el precio se muestra con 2 decimales */
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.campo==='p'&&e.target.value!==''&&!isNaN(parseFloat(e.target.value)))e.target.value=dinero(parseFloat(e.target.value))});

document.addEventListener('click',e=>{
  const r=e.target.closest('[data-restaurar]');
  if(r){const id=r.closest('.item').dataset.id,o=items[id];
    if(!confirm(`¿Volver "${actual(id).n}" a como estaba en la tienda?\n\n${o.n} · ${Array.isArray(o.p)?o.p.map(p=>'$'+dinero(p)).join(' / '):'$'+dinero(o.p)}`))return;
    delete borrador[id];
    if(guardado.cambios[id]){delete guardado.cambios[id];guardarTodo(`"${o.n}" volvió al original`)}else{repintar(id);TAZ.aviso('Cambios descartados')}
  }
});
document.getElementById('descartar').addEventListener('click',()=>{
  const n=Object.keys(borrador).length;if(!n)return;
  if(!confirm(`¿Descartar los cambios de ${n} ${n===1?'elemento':'elementos'}?`))return;
  const ids=Object.keys(borrador);borrador={};ids.forEach(repintar);TAZ.aviso('Cambios descartados');
});
document.getElementById('guardar').addEventListener('click',()=>{
  const ids=Object.keys(borrador);
  if(!ids.length)return enviar();
  const malas=ids.filter(id=>!validar(document.querySelector(`.item[data-id="${id}"]`)));
  if(malas.length){const el=document.querySelector(`.item[data-id="${malas[0]}"]`);el.scrollIntoView({behavior:'smooth',block:'center'});el.querySelector('[aria-invalid="true"]')?.focus();return TAZ.aviso('Revisa los campos marcados en rojo')}
  ids.forEach(id=>{const c=limpiar(id,{...(guardado.cambios[id]||{}),...borrador[id]});if(c)guardado.cambios[id]=c;else delete guardado.cambios[id]});
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
    guardado.pendiente=false;escribir(guardado);barra();
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
