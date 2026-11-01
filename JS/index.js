/* Inicio del panel: cuenta pedidos por estado y las ventas para las tarjetas. */
(()=>{
const d=TAZ.load(),E=TAZ.ESTADOS;
const n=e=>d.filter(o=>o.estado===e).length;
document.getElementById('resumen').innerHTML=Object.keys(E).map(k=>
  `<div class="res" style="--c:${E[k].c}"><span>${E[k].ico} ${E[k].t}</span><b>${n(k)}</b></div>`).join('');
document.getElementById('cCocina').textContent=n('nuevo')+n('prep');
document.getElementById('cDelivery').textContent=n('listo')+n('camino');
document.getElementById('cVentas').textContent=TAZ.fmt(d.reduce((t,o)=>t+o.total,0));
})();
