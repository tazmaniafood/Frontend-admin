/* Delivery: pedidos listos por entregar y entregados.
   Un solo botón "Entregar" pasa el pedido de Listo a Entregado. */
(()=>{
let d=TAZ.load(),filtro='listo';
function tarjeta(o){
  const E=TAZ.ESTADOS[o.estado];
  let acc='';
  if(o.estado==='listo')acc=`<button class="entregar" type="button" data-go="entregado"><span class="ck" aria-hidden="true">✓</span>Entregar</button>`;
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
document.addEventListener('click',e=>{
  const f=e.target.closest('.f');if(f){filtro=f.dataset.f;return pintar()}
  const b=e.target.closest('[data-go]');
  if(b){const o=d.find(x=>x.id===+b.closest('.entrega').dataset.id);o.estado=b.dataset.go;TAZ.save(d);pintar();TAZ.aviso(`Pedido #${o.id}: ${TAZ.ESTADOS[o.estado].t}`)}
});
pintar();
})();
