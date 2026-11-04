/* Todos los pedidos: tabla con número de pedido, orden, celular, nombre,
   estado del pago, medio de pago y la foto de entrega (evidencia).
   La foto se muestra así:
     - si todavía no se envió al servidor, la que quedó guardada en el celular;
     - si ya se envió, se pide al servidor: GET /api/pedidos/{numero}/entrega
       (si el servidor no responde, se muestra la miniatura guardada). */
(()=>{
const API='/api';
let d=TAZ.load(),filtro='todos',texto='';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

function evidencia(o){
  const mini=o.miniatura||o.foto;
  if(mini)return `<button class="foto" type="button" data-ver="${o.id}" aria-label="Ver foto de entrega del pedido #${o.id}"><img src="${mini}" alt=""></button>${o.fotoPendiente?'<small class="sub">⏳ Sin enviar</small>':''}`;
  if(o.fotoEnviada)return `<button class="btn sm" type="button" data-ver="${o.id}">📷 Ver foto</button>`;
  return o.estado==='entregado'?'<span class="nada">Sin foto</span>':'<span class="nada">Aún no se entrega</span>';
}
function fila(o){
  const E=TAZ.ESTADOS[o.estado]||{t:o.estado,ico:''};
  return `<tr>
    <td data-l="N.º pedido"><div><b class="num">#${esc(o.id)}</b><small class="sub">${E.ico} ${esc(E.t)} · ${o.tipo==='llevar'?'🥡 Para llevar':'🛵 Domicilio'}</small></div></td>
    <td data-l="Orden"><div><ul class="orden">${o.items.map(i=>`<li><b>${esc(i.q)}×</b> ${esc(i.n)}${i.d?` <small>${esc(i.d)}</small>`:''}</li>`).join('')}</ul><small class="sub total">${TAZ.fmt(o.total)}</small></div></td>
    <td data-l="Celular"><div><a href="tel:${esc(String(o.tel).replace(/\s/g,''))}">${esc(o.tel)}</a></div></td>
    <td data-l="Nombre"><div>${esc(o.cliente)}</div></td>
    <td data-l="Pago"><div>${o.pagado?'<span class="chip si">✅ Pagado</span>':'<span class="chip no">⏳ Sin pagar</span>'}</div></td>
    <td data-l="Medio de pago"><div>${esc(TAZ.MEDIOS[o.medio]||o.medio||'—')}</div></td>
    <td data-l="Evidencia"><div>${evidencia(o)}</div></td>
  </tr>`;
}
function pintar(){
  const q=texto.trim().toLowerCase();
  const lista=d.filter(o=>(filtro==='todos'||(filtro==='pagado')===!!o.pagado)
    &&(!q||String(o.id).includes(q)||String(o.cliente).toLowerCase().includes(q)||String(o.tel).replace(/\s/g,'').includes(q.replace(/\s/g,''))))
    .sort((a,b)=>b.creado-a.creado);
  document.getElementById('n').textContent=lista.length===1?'1 pedido':`${lista.length} pedidos`;
  document.getElementById('filas').innerHTML=lista.length?lista.map(fila).join(''):'<tr class="vacio"><td colspan="7"><p class="empty">No hay pedidos que coincidan</p></td></tr>';
}

/* ---- Visor de la foto ---- */
const vis=document.getElementById('visor'),vimg=document.getElementById('visor-img'),vpie=document.getElementById('visor-pie');
function ver(id){
  const o=d.find(x=>x.id===+id);if(!o)return;
  document.getElementById('visor-tit').textContent=`📷 Evidencia del pedido #${o.id}`;
  vpie.textContent=o.entregado?`Entregado el ${new Date(o.entregado).toLocaleString('es-CO',{dateStyle:'medium',timeStyle:'short'})}`:'';
  vimg.alt=`Foto de entrega del pedido #${o.id}`;
  const respaldo=o.foto||o.miniatura;
  vimg.onerror=()=>{vimg.onerror=null;if(respaldo)vimg.src=respaldo;else{vimg.removeAttribute('src');vpie.textContent='No se pudo cargar la foto del servidor.'}};
  vimg.src=o.foto?o.foto:o.fotoEnviada?`${API}/pedidos/${encodeURIComponent(o.id)}/entrega`:respaldo;
  vis.showModal();
}
vis.addEventListener('click',e=>{if(e.target===vis||e.target.closest('[data-cerrar]'))vis.close()});

document.addEventListener('click',e=>{
  const f=e.target.closest('.f');
  if(f){filtro=f.dataset.f;document.querySelectorAll('.f').forEach(b=>{const on=b===f;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});return pintar()}
  const v=e.target.closest('[data-ver]');if(v)ver(v.dataset.ver);
});
document.getElementById('buscar').addEventListener('input',e=>{texto=e.target.value;pintar()});
pintar();
setInterval(()=>{if(!vis.open){d=TAZ.load();pintar()}},30000);
})();
