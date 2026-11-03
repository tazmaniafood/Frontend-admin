/* Delivery: solo los pedidos listos por entregar.
   Para entregar se arrastra el botón verde hasta el final ("Desliza para entregar")
   y se abre la cámara del celular para tomar la foto de la entrega. Sin foto no
   se entrega: si se cancela la cámara, el botón vuelve al inicio.
   Con teclado: enfocar el botón y presionar Enter o Espacio.
   La foto se guarda reducida en el pedido (o.foto, JPEG en base64) junto con la
   hora de entrega (o.entregado). Cuando exista el backend, hay que subirla a la API. */
(()=>{
let d=TAZ.load();
function tarjeta(o){
  return `<article class="entrega panel" data-id="${o.id}" style="--c:${TAZ.ESTADOS[o.estado].c}">
    <div class="cab"><b>#${o.id}</b><span class="t">${TAZ.hace(o.creado)}</span><b class="total">${TAZ.fmt(o.total)}</b></div>
    <div class="cliente">
      <p class="nom">${o.cliente}</p>
      <p>📍 <a href="https://maps.google.com/?q=${encodeURIComponent(o.dir)}" target="_blank" rel="noopener">${o.dir}</a></p>
      <p>📞 <a href="tel:${o.tel.replace(/\s/g,'')}">${o.tel}</a></p>
    </div>
    <ul class="items">${o.items.map(i=>`<li><b>${i.q}×</b> ${i.n}</li>`).join('')}</ul>
    <div class="acc"><div class="desliza" role="button" tabindex="0" aria-label="Desliza para entregar el pedido #${o.id}. Se abrirá la cámara para la foto de entrega">
      <span class="relleno" aria-hidden="true"></span>
      <span class="txt" aria-hidden="true">Desliza para entregar</span>
      <span class="perilla" aria-hidden="true">➜</span>
    </div></div>
  </article>`;
}
function pintar(){
  const lista=d.filter(o=>o.estado==='listo').sort((a,b)=>a.creado-b.creado);
  const n=document.getElementById('n');
  if(n)n.textContent=lista.length===1?'1 pedido por entregar':`${lista.length} pedidos por entregar`;
  document.getElementById('entregas').innerHTML=lista.length?lista.map(tarjeta).join(''):'<p class="empty">No hay pedidos por entregar 🎉</p>';
}

/* ---- Cámara: un input de archivo con capture abre la cámara normal del celular ---- */
const cam=document.createElement('input');
cam.type='file';cam.accept='image/*';cam.setAttribute('capture','environment');cam.hidden=true;
document.body.appendChild(cam);
let pendiente=null; // {el, o}

function volver(el){
  el.classList.remove('hecho','foto');el.style.setProperty('--x','0px');el.style.setProperty('--p',0);
  el.querySelector('.txt').textContent='Desliza para entregar';el.querySelector('.perilla').textContent='➜';
}
function pedirFoto(el){
  const o=d.find(x=>x.id===+el.closest('.entrega').dataset.id);if(!o||o.estado!=='listo')return volver(el);
  pendiente={el,o};
  el.classList.add('foto');el.querySelector('.txt').textContent='Toma la foto de la entrega';el.querySelector('.perilla').textContent='📷';
  cam.value='';
  cam.click(); // debe llamarse en el mismo gesto del usuario (al soltar o con Enter)
}
function cancelar(){
  if(!pendiente)return;const {el}=pendiente;pendiente=null;volver(el);
  TAZ.aviso('Sin foto no se puede entregar');
}
cam.addEventListener('cancel',cancelar);
/* Navegadores sin evento "cancel": al volver a la página sin foto, se cancela */
window.addEventListener('focus',()=>setTimeout(()=>{if(pendiente&&!cam.files.length&&!pendiente.leyendo)cancelar()},800));

cam.addEventListener('change',async()=>{
  const f=cam.files&&cam.files[0];if(!pendiente)return;
  if(!f)return cancelar();
  pendiente.leyendo=true;
  const {el,o}=pendiente;
  el.querySelector('.txt').textContent='Guardando foto…';
  let foto;
  try{foto=await reducir(f,800,0.6)}catch(e){pendiente=null;volver(el);return TAZ.aviso('No se pudo leer la foto, intenta de nuevo')}
  pendiente=null;
  o.estado='entregado';o.entregado=Date.now();o.foto=foto;
  if(!guardar()){o.estado='listo';delete o.entregado;delete o.foto;volver(el);return TAZ.aviso('No hay espacio para guardar la foto')}
  el.classList.remove('foto');el.classList.add('hecho');
  el.querySelector('.txt').textContent='¡Entregado!';el.querySelector('.perilla').textContent='✓';
  const acc=el.closest('.acc');acc.insertAdjacentHTML('afterbegin',`<img class="prueba" src="${foto}" alt="Foto de la entrega del pedido #${o.id}">`);
  if(navigator.vibrate)try{navigator.vibrate(30)}catch(e){}
  setTimeout(()=>{pintar();TAZ.aviso(`Pedido #${o.id}: Entregado 📷`)},1200);
});
/* Guarda los pedidos; si no cabe, borra las fotos más viejas y reintenta */
function guardar(){
  const ok=()=>{try{localStorage.setItem('taz-admin',JSON.stringify(d));return true}catch(e){return false}};
  if(ok())return true;
  const conFoto=d.filter(x=>x.foto&&x.estado==='entregado').sort((a,b)=>(a.entregado||0)-(b.entregado||0));
  while(conFoto.length>1){delete conFoto.shift().foto;if(ok())return true}
  return false;
}
/* Reduce la foto (lado mayor = max px) y la pasa a JPEG para que ocupe poco */
function reducir(file,max,q){
  return new Promise((res,rej)=>{
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{
      const s=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
      const c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*s);c.height=Math.round(img.naturalHeight*s);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);
      res(c.toDataURL('image/jpeg',q));
    };
    img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('imagen'))};
    img.src=url;
  });
}

/* ---- Deslizar ---- */
const max=el=>el.clientWidth-el.querySelector('.perilla').offsetWidth-8;
document.addEventListener('keydown',e=>{
  const el=e.target.closest&&e.target.closest('.desliza');
  if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();if(!el.matches('.hecho,.foto')){el.style.setProperty('--x',max(el)+'px');el.style.setProperty('--p',1);pedirFoto(el)}}
});
let arr=null;
document.addEventListener('pointerdown',e=>{
  const per=e.target.closest('.desliza:not(.hecho):not(.foto) .perilla');if(!per)return;
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
  if(e.type==='pointerup'&&x>=max(el)*0.85){el.style.setProperty('--x',max(el)+'px');el.style.setProperty('--p',1);pedirFoto(el)}
  else volver(el);
}
document.addEventListener('pointerup',soltar);
document.addEventListener('pointercancel',soltar);
pintar();
setInterval(()=>{if(!pendiente&&!arr){d=TAZ.load();pintar()}},30000);
})();
