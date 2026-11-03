/* Delivery: pedidos listos por entregar y entregados.
   Para entregar se arrastra el botón verde hasta el final ("Desliza para entregar").
   Con teclado: enfocar el botón y presionar Enter o Espacio. */
(()=>{
let d=TAZ.load(),filtro='listo';
function tarjeta(o){
  const E=TAZ.ESTADOS[o.estado];
  let acc='';
  if(o.estado==='listo')acc=`<div class="desliza" role="button" tabindex="0" aria-label="Desliza para entregar el pedido #${o.id}">
      <span class="relleno" aria-hidden="true"></span>
      <span class="txt" aria-hidden="true">Desliza para entregar</span>
      <span class="perilla" aria-hidden="true">➜</span>
    </div>`;
  if(o.estado==='entregado')acc=`<span class="chip">🏁 Entregado</span>`;
  return `<article class="entrega panel" data-id="${o.id}" style="--c:${E.c}">
    <div class="cab"><b>#${o.id}</b><span class="chip estado">${E.ico} ${E.t}</span><span class="t">${TAZ.hace(o.creado)}</span><b class="total">${TAZ.fmt(o.total)}</b></div>
    <div class="cliente">
      <p class="nom">${o.cliente}</p>
      <p>📍 <a href="https://maps.google.com/?q=${encodeURIComponent(o.dir)}" target="_blank" rel="noopener">${o.dir}</a></p>
      <p>📞 <a href="tel:${o.tel.replace(/\s/g,'')}">${o.tel}</a></p>
    </div>
    <ul class="items">${o.items.map(i=>`<li><b>${i.q}×</b> ${i.n}</li>`).join('')}</ul>
    <div class="acc">${acc}</div>
  </article>`;
}
function pintar(){
  document.querySelectorAll('.f').forEach(b=>{
    const on=b.dataset.f===filtro;b.classList.toggle('on',on);b.setAttribute('aria-selected',on);
    b.querySelector('b').textContent=d.filter(o=>o.estado===b.dataset.f).length;
  });
  const lista=d.filter(o=>o.estado===filtro).sort((a,b)=>filtro==='entregado'?b.creado-a.creado:a.creado-b.creado);
  document.getElementById('entregas').innerHTML=lista.length?lista.map(tarjeta).join(''):'<p class="empty">No hay pedidos en esta sección</p>';
}
function entregar(el){
  const o=d.find(x=>x.id===+el.closest('.entrega').dataset.id);if(!o||o.estado!=='listo')return;
  o.estado='entregado';TAZ.save(d);
  el.classList.add('hecho');el.querySelector('.txt').textContent='¡Entregado!';el.querySelector('.perilla').textContent='✓';
  if(navigator.vibrate)try{navigator.vibrate(30)}catch(e){}
  setTimeout(()=>{pintar();TAZ.aviso(`Pedido #${o.id}: Entregado`)},450);
}
document.addEventListener('click',e=>{
  const f=e.target.closest('.f');if(f){filtro=f.dataset.f;return pintar()}
});
document.addEventListener('keydown',e=>{
  const el=e.target.closest&&e.target.closest('.desliza');
  if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();if(!el.classList.contains('hecho')){el.style.setProperty('--x',max(el)+'px');entregar(el)}}
});
/* Arrastre de la perilla (mouse, dedo o lápiz) */
const max=el=>el.clientWidth-el.querySelector('.perilla').offsetWidth-8;
let arr=null;
document.addEventListener('pointerdown',e=>{
  const per=e.target.closest('.desliza:not(.hecho) .perilla');if(!per)return;
  const el=per.parentElement;e.preventDefault();
  arr={el,x0:e.clientX,id:e.pointerId};el.classList.add('arrastrando');
  try{el.setPointerCapture(e.pointerId)}catch(_){}
});
document.addEventListener('pointermove',e=>{
  if(!arr||e.pointerId!==arr.id)return;
  const x=Math.min(max(arr.el),Math.max(0,e.clientX-arr.x0));
  arr.el.style.setProperty('--x',x+'px');arr.el.style.setProperty('--p',x/max(arr.el));
});
function soltar(e){
  if(!arr||e.pointerId!==arr.id)return;
  const {el}=arr;arr=null;el.classList.remove('arrastrando');
  const x=parseFloat(el.style.getPropertyValue('--x'))||0;
  if(x>=max(el)*0.85){el.style.setProperty('--x',max(el)+'px');el.style.setProperty('--p',1);entregar(el)}
  else{el.style.setProperty('--x','0px');el.style.setProperty('--p',0)}
}
document.addEventListener('pointerup',soltar);
document.addEventListener('pointercancel',soltar);
pintar();
})();
