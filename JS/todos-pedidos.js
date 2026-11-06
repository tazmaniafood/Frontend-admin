/* Todos los pedidos: tabla de 6 columnas (pedido, cliente con celular y dirección, orden,
   pago con total/estado/medio, estado del pedido y foto de entrega).
   La foto se muestra así:
     - si todavía no se envió al servidor, la que quedó guardada en el celular;
     - si ya se envió, se pide al servidor: GET /api/pedidos/{numero}/entrega
       (si el servidor no responde, se muestra la miniatura guardada). */
(()=>{
const API='/api';
/* Filtro por estado: por defecto solo los ACTIVOS (en cocina o en reparto), no los ya entregados */
let d=TAZ.load(),filtro='activos',texto='';
const pasa=(o,f)=>f==='activos'?o.estado!=='entregado':o.estado===f;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

const MEDIO=TAZ.MEDIOS;
function evidencia(o){
  const mini=o.miniatura||o.foto;
  if(mini)return `<button class="foto" type="button" data-ver="${o.id}" aria-label="Ver foto de entrega del pedido #${o.id}"><img src="${mini}" alt=""></button>${o.fotoPendiente?'<small class="sub">Sin enviar</small>':''}`;
  if(o.fotoEnviada)return `<button class="ver" type="button" data-ver="${o.id}">Ver foto</button>`;
  return '<span class="nada">—</span>';
}
/* Estado del pedido:
   nuevo     -> En cocina   (está en el tablero de Cocina)
   listo     -> En reparto  (cocina lo terminó y va a Entregas; para llevar: listo para recoger)
   entregado -> Entregado
   "Nuevo" queda para cuando el pedido llegue de la tienda y cocina aún no lo haya visto. */
const STATUS={recibido:['nuevo','Nuevo'],nuevo:['cocina','En cocina'],listo:['reparto','En reparto'],entregado:['entregado','Entregado']};
function status(o){
  const [c,t]=o.estado==='listo'&&o.tipo==='llevar'?['reparto','Listo para recoger']:(STATUS[o.estado]||['nuevo',o.estado]);
  return `<span class="st ${c}">${t}</span>`;
}
function fila(o){
  const dir=o.tipo==='llevar'?'<span class="tag llevar">Para llevar</span>'
    :`<span class="tag dom">Domicilio</span>${o.dir?` <a class="dir" href="https://maps.google.com/?q=${encodeURIComponent(o.dir)}" target="_blank" rel="noopener">${esc(o.dir)}</a>`:''}`;
  return `<tr>
    <td data-l="Pedido"><div><b class="num">#${esc(o.id)}</b></div></td>
    <td data-l="Cliente"><div><span class="cli">${esc(o.cliente)}</span><a class="tel" href="tel:${esc(String(o.tel).replace(/\s/g,''))}">${esc(o.tel)}</a><span class="lugar">${dir}</span></div></td>
    <td data-l="Orden"><div><ul class="orden">${o.items.map(i=>`<li><b>${esc(i.q)}×</b> ${esc(i.n)}${i.d?`<small>${esc(i.d)}</small>`:''}</li>`).join('')}</ul></div></td>
    <td data-l="Pago" class="c-pago"><div><b class="total">${TAZ.fmt(o.total)}</b><span class="pago ${o.pagado?'si':'no'}">${o.pagado?'Pagado':'Sin pagar'}</span><small class="sub">${esc(MEDIO[o.medio]||o.medio||'—')}</small></div></td>
    <td data-l="Estado"><div>${status(o)}</div></td>
    <td data-l="Foto" class="c-foto"><div>${evidencia(o)}</div></td>
  </tr>`;
}
function pintar(){
  const q=texto.trim().toLowerCase();
  document.querySelectorAll('.f').forEach(b=>{const n=b.querySelector('b');if(n)n.textContent=d.filter(o=>pasa(o,b.dataset.f)).length});
  const lista=d.filter(o=>pasa(o,filtro)
    &&(!q||String(o.id).includes(q)||String(o.cliente).toLowerCase().includes(q)||String(o.tel).replace(/\s/g,'').includes(q.replace(/\s/g,''))))
    .sort((a,b)=>b.creado-a.creado);
  document.getElementById('n').textContent=lista.length;
  document.getElementById('filas').innerHTML=lista.length?lista.map(fila).join(''):'<tr class="vacio"><td colspan="6"><p class="empty">No hay pedidos en esta vista</p></td></tr>';
}

/* ---- Visor de la foto ---- */
const vis=document.getElementById('visor'),vimg=document.getElementById('visor-img'),vpie=document.getElementById('visor-pie');
function ver(id){
  const o=d.find(x=>x.id===+id);if(!o)return;
  document.getElementById('visor-tit').textContent=`Foto de entrega · pedido #${o.id}`;
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
