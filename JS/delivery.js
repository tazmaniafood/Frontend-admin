/* Delivery: solo los pedidos listos por entregar.
   1. El repartidor desliza el botón verde hasta el final.
   2. Se abre la cámara DENTRO del navegador (pide permiso la primera vez).
   3. Toma la foto, puede repetirla, y al "Enviar" se sube al servidor:
        POST /api/pedidos/{numero}/entrega   (cuerpo: la foto en JPEG, Content-Type image/jpeg)
      El servidor la guarda en la base de datos y marca el pedido como entregado.
   Si no hay conexión o el servidor falla, la foto queda guardada en el celular como
   "pendiente de enviar" y se reintenta sola (cada 30 s y al volver la conexión).
   Sin foto no se entrega. Con teclado: enfocar el botón y presionar Enter o Espacio. */
(()=>{
const API='/api'; // Nginx manda /api/ al backend (Server-TAZ)
/* Esta misma lógica sirve para dos páginas: Delivery (domicilio) y Para llevar (llevar).
   La página lo indica con <body data-tipo="...">. En Para llevar no se muestra la dirección. */
const TIPO=document.body.dataset.tipo||'domicilio';
let d=TAZ.load();

function tarjeta(o){
  return `<article class="entrega panel" data-id="${o.id}" style="--c:${TAZ.ESTADOS[o.estado].c}">
    <div class="cab"><b>#${o.id}</b><span class="t">${TAZ.hace(o.creado)}</span><b class="total">${TAZ.fmt(o.total)}</b></div>
    <div class="cliente">
      <p class="nom">${o.cliente}</p>
      ${TIPO==='domicilio'&&o.dir?`<p>📍 <a href="https://maps.google.com/?q=${encodeURIComponent(o.dir)}" target="_blank" rel="noopener">${o.dir}</a></p>`:''}
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
  const lista=d.filter(o=>o.estado==='listo'&&(o.tipo||'domicilio')===TIPO).sort((a,b)=>a.creado-b.creado);
  const n=document.getElementById('n');
  if(n)n.textContent=lista.length===1?'1 pedido por entregar':`${lista.length} pedidos por entregar`;
  const p=document.getElementById('pend'),np=d.filter(o=>o.fotoPendiente).length;
  if(p)p.textContent=np?`⏳ ${np} foto${np>1?'s':''} sin enviar`:'';
  document.getElementById('entregas').innerHTML=lista.length?lista.map(tarjeta).join(''):'<p class="empty">No hay pedidos por entregar 🎉</p>';
}
function volver(el){
  if(!el||!el.isConnected)return;
  el.classList.remove('hecho','foto');el.style.setProperty('--x','0px');el.style.setProperty('--p',0);
  el.querySelector('.txt').textContent='Desliza para entregar';el.querySelector('.perilla').textContent='➜';
}
function guardar(){try{localStorage.setItem('taz-admin',JSON.stringify(d));return true}catch(e){return false}}

/* =================== Cámara en el navegador =================== */
const dlg=document.getElementById('camara'),video=document.getElementById('cam-video'),
      img=document.getElementById('cam-foto'),msg=document.getElementById('cam-msg');
let stream=null,actual=null,blob=null; // actual = {el, o}

function apagar(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}video.srcObject=null}
async function encender(){
  apagar();dlg.classList.add('sin');msg.textContent='Abriendo cámara…';
  if(!window.isSecureContext||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
    msg.textContent='Este navegador no permite usar la cámara aquí. Abre el panel con https:// en Chrome o Safari.';return;
  }
  try{
    stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}}});
    if(!dlg.open)return apagar();
    video.srcObject=stream;await video.play().catch(()=>{});
    msg.textContent='';dlg.classList.remove('sin');
  }catch(e){
    msg.textContent=e&&e.name==='NotAllowedError'
      ?'No diste permiso para la cámara. Toca el candado 🔒 junto a la dirección, permite la cámara y vuelve a intentar.'
      :e&&(e.name==='NotFoundError'||e.name==='OverconstrainedError')
      ?'No se encontró una cámara en este dispositivo.'
      :'No se pudo abrir la cámara. Cierra otras apps que la estén usando y vuelve a intentar.';
  }
}
function abrirCamara(el){
  const o=d.find(x=>x.id===+el.closest('.entrega').dataset.id);if(!o||o.estado!=='listo')return volver(el);
  actual={el,o};blob=null;
  el.classList.add('foto');el.querySelector('.txt').textContent='Toma la foto de la entrega';el.querySelector('.perilla').textContent='📷';
  document.getElementById('cam-ped').textContent='#'+o.id;
  dlg.classList.remove('tomada','enviando');img.removeAttribute('src');
  dlg.showModal();encender();
}
function cerrarCamara(cancelado){
  apagar();if(dlg.open)dlg.close();
  if(cancelado&&actual){volver(actual.el);TAZ.aviso('Sin foto no se puede entregar')}
  actual=null;blob=null;
}
function tomar(){
  if(!stream||!video.videoWidth)return;
  const max=1280,s=Math.min(1,max/Math.max(video.videoWidth,video.videoHeight));
  const c=document.createElement('canvas');c.width=Math.round(video.videoWidth*s);c.height=Math.round(video.videoHeight*s);
  c.getContext('2d').drawImage(video,0,0,c.width,c.height);
  c.toBlob(b=>{
    if(!b)return;blob=b;img.src=URL.createObjectURL(b);
    dlg.classList.add('tomada');apagar(); // la cámara se apaga mientras se revisa la foto
    if(navigator.vibrate)try{navigator.vibrate(20)}catch(e){}
  },'image/jpeg',0.7);
}
async function enviar(){
  if(!actual||!blob)return;
  const {el,o}=actual;dlg.classList.add('enviando');msg.textContent='Enviando foto…';
  const ok=await subir(o.id,blob);
  o.estado='entregado';o.entregado=Date.now();
  o.miniatura=await miniatura(blob); // pequeña, para verla en "Todos los pedidos"
  if(ok){delete o.foto;delete o.fotoPendiente;o.fotoEnviada=true}
  else{o.foto=await aTexto(blob);o.fotoPendiente=true}
  if(!guardar()){ // sin espacio en el celular: no se pierde la entrega, pero avisa
    delete o.foto;delete o.miniatura;guardar();TAZ.aviso('⚠️ No hay espacio para guardar la foto en el celular');
  }
  msg.textContent='';cerrarCamara(false);
  el.classList.remove('foto');el.classList.add('hecho');
  el.querySelector('.txt').textContent='¡Entregado!';el.querySelector('.perilla').textContent='✓';
  if(navigator.vibrate)try{navigator.vibrate(30)}catch(e){}
  setTimeout(()=>{pintar();TAZ.aviso(ok?`Pedido #${o.id}: entregado y foto enviada ✅`:`Pedido #${o.id}: entregado. La foto se enviará cuando haya conexión ⏳`)},900);
}
dlg.addEventListener('click',e=>{
  const b=e.target.closest('[data-cam]');if(!b)return;
  ({cerrar:()=>cerrarCamara(true),tomar,repetir:()=>{blob=null;dlg.classList.remove('tomada');encender()},enviar})[b.dataset.cam]();
});
dlg.addEventListener('cancel',e=>{e.preventDefault();cerrarCamara(true)}); // tecla Esc
document.addEventListener('visibilitychange',()=>{ // al salir de la app se apaga la cámara
  if(!dlg.open)return;
  if(document.hidden)apagar();else if(!dlg.classList.contains('tomada'))encender();
});

/* =================== Envío al servidor =================== */
async function subir(id,b){
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),20000);
  try{
    const r=await fetch(`${API}/pedidos/${encodeURIComponent(id)}/entrega`,{method:'POST',headers:{'Content-Type':'image/jpeg'},body:b,signal:ctl.signal,credentials:'same-origin'});
    return r.ok;
  }catch(e){return false}finally{clearTimeout(t)}
}
/* Miniatura de la foto (lado mayor 320 px) en base64 */
function miniatura(b){
  return new Promise(r=>{const u=URL.createObjectURL(b),i=new Image();
    i.onload=()=>{const s=Math.min(1,320/Math.max(i.naturalWidth,i.naturalHeight)),c=document.createElement('canvas');
      c.width=Math.round(i.naturalWidth*s);c.height=Math.round(i.naturalHeight*s);c.getContext('2d').drawImage(i,0,0,c.width,c.height);
      URL.revokeObjectURL(u);r(c.toDataURL('image/jpeg',0.6))};
    i.onerror=()=>{URL.revokeObjectURL(u);r(null)};i.src=u});
}
const aTexto=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.onerror=()=>r(null);f.readAsDataURL(b)});
const aBlob=async u=>(await fetch(u)).blob();
let reintentando=false;
async function reintentar(){
  if(reintentando||!navigator.onLine)return;reintentando=true;
  try{
    for(const o of d.filter(x=>x.fotoPendiente&&x.foto)){
      if(!(await subir(o.id,await aBlob(o.foto))))break;
      delete o.foto;delete o.fotoPendiente;o.fotoEnviada=true;guardar();pintar();TAZ.aviso(`Foto del pedido #${o.id} enviada ✅`);
    }
  }finally{reintentando=false}
}
window.addEventListener('online',reintentar);

/* =================== Deslizar =================== */
const max=el=>el.clientWidth-el.querySelector('.perilla').offsetWidth-8;
document.addEventListener('keydown',e=>{
  const el=e.target.closest&&e.target.closest('.desliza');
  if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();if(!el.matches('.hecho,.foto')){el.style.setProperty('--x',max(el)+'px');el.style.setProperty('--p',1);abrirCamara(el)}}
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
  if(e.type==='pointerup'&&x>=max(el)*0.85){el.style.setProperty('--x',max(el)+'px');el.style.setProperty('--p',1);abrirCamara(el)}
  else volver(el);
}
document.addEventListener('pointerup',soltar);
document.addEventListener('pointercancel',soltar);

pintar();reintentar();
setInterval(()=>{if(!actual&&!arr){d=TAZ.load();pintar();reintentar()}},30000);
})();
