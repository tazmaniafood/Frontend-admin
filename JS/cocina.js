/* Cocina: tablero de 2 columnas (Nuevos → Listos).
   Los tickets se mueven ARRASTRÁNDOLOS de una columna a otra. Con mouse se arrastra directo;
   con el dedo se mantiene presionado un momento (así deslizar sigue moviendo la página).
   Mientras se arrastra aparece abajo una zona para cancelar el pedido.
   Con teclado: enfocar un ticket y usar ← / → para moverlo de columna.
   Al quedar listo pasa a Entregas (En reparto si es a domicilio, Para llevar si se recoge). */
(()=>{
let d=TAZ.load();
const ORDEN=['nuevo','listo'];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

function ticket(o){
  const min=TAZ.minutos(o.creado),tarde=o.estado!=='listo'&&min>=15;
  return `<article class="ticket${tarde?' tarde':''}" data-id="${o.id}" tabindex="0" aria-roledescription="ticket arrastrable"
      aria-label="Pedido ${o.id}. ${TAZ.vis(o).t}. Arrástralo a otra columna o usa las flechas izquierda y derecha.">
    <header><b>#${o.id}</b>${TAZ.pastilla(o)}<span class="t">${tarde?'⏰ ':''}${TAZ.hace(o.creado)}</span></header>
    <ul>${o.items.map(i=>`<li><b>${esc(i.q)}×</b> ${esc(i.n)}${i.d?`<small>${esc(i.d)}</small>`:''}</li>`).join('')}</ul>
    <span class="agarre" aria-hidden="true"><i></i><i></i><i></i></span>
  </article>`;
}
function pintar(){
  if(arr)return; // no repintar mientras se arrastra
  document.querySelectorAll('.col').forEach(c=>{
    const lista=d.filter(o=>o.estado===c.dataset.estado).sort((a,b)=>a.creado-b.creado);
    c.querySelector('.n').textContent=lista.length;
    c.querySelector('.lista').innerHTML=lista.length?lista.map(ticket).join(''):'<p class="empty">Arrastra un pedido aquí</p>';
  });
}
function mover(id,estado){
  const o=d.find(x=>x.id===+id);if(!o||o.estado===estado)return;
  if(estado==='cancelado'&&!confirm(`¿Cancelar el pedido #${o.id}?`))return pintar();
  o.estado=estado;TAZ.save(d);pintar();
  TAZ.aviso(`Pedido #${o.id}: ${TAZ.vis(o).t}`);
  document.querySelector(`.ticket[data-id="${o.id}"]`)?.focus({preventScroll:true});
}

/* ---- Arrastrar (pointer events: sirve para mouse, dedo y lápiz) ---- */
let arr=null; // {el, id, x0, y0, dx, dy, fantasma, activo}
const zonaCancelar=document.getElementById('cancelar');
document.addEventListener('pointerdown',e=>{
  const el=e.target.closest('.ticket');if(!el||e.button>0)return;
  const r=el.getBoundingClientRect();
  const tactil=e.pointerType!=='mouse';
  arr={el,id:el.dataset.id,x0:e.clientX,y0:e.clientY,dx:e.clientX-r.left,dy:e.clientY-r.top,w:r.width,activo:false,pid:e.pointerId,tactil,listo:!tactil};
  if(tactil)arr.t=setTimeout(()=>{if(!arr)return;arr.listo=true;el.classList.add('agarrado');if(navigator.vibrate)try{navigator.vibrate(15)}catch(_){}},250);
});
function destino(x,y){
  const z=document.elementFromPoint(x,y);
  if(!z)return null;
  if(z.closest('#cancelar'))return 'cancelado';
  const c=z.closest('.col');return c?c.dataset.estado:null;
}
document.addEventListener('pointermove',e=>{
  if(!arr||e.pointerId!==arr.pid)return;
  if(!arr.activo){
    const mov=Math.hypot(e.clientX-arr.x0,e.clientY-arr.y0);
    if(!arr.listo){if(mov>8){clearTimeout(arr.t);arr=null}return} // con el dedo, mover antes de tiempo = desplazar la página
    if(mov<8)return; // un toque no es arrastre
    arr.activo=true;
    const f=arr.el.cloneNode(true);f.classList.add('fantasma');f.style.width=arr.w+'px';
    document.body.appendChild(f);arr.fantasma=f;
    arr.el.classList.add('levantado');document.body.classList.add('arrastrando');
    try{arr.el.setPointerCapture(e.pointerId)}catch(_){}
  }
  e.preventDefault();
  arr.fantasma.style.transform=`translate(${e.clientX-arr.dx}px,${e.clientY-arr.dy}px) rotate(-2deg)`;
  const dest=destino(e.clientX,e.clientY);
  document.querySelectorAll('.col').forEach(c=>c.classList.toggle('sobre',c.dataset.estado===dest));
  zonaCancelar.classList.toggle('sobre',dest==='cancelado');
  /* desplazar la página si se arrastra cerca del borde */
  if(e.clientY<70)scrollBy(0,-12);else if(e.clientY>innerHeight-70)scrollBy(0,12);
},{passive:false});
function soltar(e){
  if(!arr||e.pointerId!==arr.pid)return;
  const a=arr;arr=null;clearTimeout(a.t);a.el.classList.remove('agarrado');
  if(!a.activo)return;
  const dest=e.type==='pointerup'?destino(e.clientX,e.clientY):null;
  a.fantasma.remove();a.el.classList.remove('levantado');document.body.classList.remove('arrastrando');
  document.querySelectorAll('.col.sobre,#cancelar.sobre').forEach(c=>c.classList.remove('sobre'));
  if(dest)mover(a.id,dest);
}
document.addEventListener('pointerup',soltar);
document.addEventListener('pointercancel',soltar);
/* evitar que el navegador desplace la página en vez de arrastrar en pantallas táctiles */
document.addEventListener('touchmove',e=>{if(arr&&arr.activo)e.preventDefault()},{passive:false});

/* ---- Teclado: ← / → mueven el ticket enfocado ---- */
document.addEventListener('keydown',e=>{
  const el=e.target.closest&&e.target.closest('.ticket');if(!el)return;
  const o=d.find(x=>x.id===+el.dataset.id);const i=ORDEN.indexOf(o.estado);
  if(e.key==='ArrowRight'&&i<ORDEN.length-1){e.preventDefault();mover(o.id,ORDEN[i+1])}
  if(e.key==='ArrowLeft'&&i>0){e.preventDefault();mover(o.id,ORDEN[i-1])}
  if(e.key==='Delete'){e.preventDefault();mover(o.id,'cancelado')}
});

pintar();
setInterval(()=>{d=TAZ.load();pintar()},30000);
})();
