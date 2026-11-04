/* Cocina: tablero de 2 columnas. Cada pedido avanza Nuevo → Listo.
   Al quedar listo pasa a Delivery. */
(()=>{
let d=TAZ.load();
const SIG={nuevo:['listo','¡Listo! ✅'],listo:null};
function ticket(o){
  const min=TAZ.minutos(o.creado),tarde=o.estado!=='listo'&&min>=15;
  const sig=SIG[o.estado];
  return `<article class="ticket${tarde?' tarde':''}" data-id="${o.id}">
    <header><b>#${o.id}${o.tipo==='llevar'?' <span class="chip llevar">🥡 Para llevar</span>':''}</b><span class="t">${tarde?'⏰ ':''}${TAZ.hace(o.creado)}</span></header>
    <ul>${o.items.map(i=>`<li><b>${i.q}×</b> ${i.n}${i.d?`<small>${i.d}</small>`:''}</li>`).join('')}</ul>
    <div class="pie-t">${sig?`<button class="btn sm go" data-go="${sig[0]}">${sig[1]}</button>`:'<span class="chip espera">Listo para entregar</span>'}</div>
  </article>`;
}
function pintar(){
  document.querySelectorAll('.col').forEach(c=>{
    const lista=d.filter(o=>o.estado===c.dataset.estado).sort((a,b)=>a.creado-b.creado);
    c.querySelector('.n').textContent=lista.length;
    c.querySelector('.lista').innerHTML=lista.length?lista.map(ticket).join(''):'<p class="empty">Nada por aquí</p>';
  });
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-go]');
  if(b){const o=d.find(x=>x.id===+b.closest('.ticket').dataset.id);o.estado=b.dataset.go;TAZ.save(d);pintar();TAZ.aviso(`Pedido #${o.id}: ${TAZ.ESTADOS[o.estado].t}`)}
});
pintar();
setInterval(pintar,30000);
})();
