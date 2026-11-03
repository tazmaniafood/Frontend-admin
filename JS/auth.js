/* Sesión del panel admin, con dos usuarios:
   - cocina:     ve Estadísticas y Cocina
   - repartidor: ve solo Delivery
   PROVISIONAL: usuarios y contraseñas fijos en el navegador, solo para pruebas.
   No es seguridad real (cualquiera puede leer este archivo). Cuando exista el
   backend, login() debe llamar a la API y la sesión debe validarse en el servidor. */
(()=>{
const KEY='taz-admin-sesion';
const USUARIOS={
  cocina:    {clave:'Cocina2026*', rol:'COCINA',     inicio:'estadisticas.html', paginas:['estadisticas.html','cocina.html']},
  repartidor:{clave:'Reparto2026*',rol:'REPARTIDOR', inicio:'delivery.html',     paginas:['delivery.html']}
};
const TODAS=['estadisticas.html','cocina.html','delivery.html'];
const get=()=>{try{return JSON.parse(sessionStorage.getItem(KEY))}catch(e){return null}};
const set=v=>{try{v?sessionStorage.setItem(KEY,JSON.stringify(v)):sessionStorage.removeItem(KEY)}catch(e){}};
const enPages=/\/Pages\//i.test(location.pathname);
const raiz=enPages?'../':'';
const pagina=(location.pathname.split('/').pop()||'').toLowerCase();

const AUTH={
  /* Usuario de la sesión actual, o null */
  usuario(){const s=get();return s&&USUARIOS[s.u]?Object.assign({u:s.u},USUARIOS[s.u]):null},
  activa:()=>!!AUTH.usuario(),
  login(u,c){
    const k=String(u).trim().toLowerCase();
    if(USUARIOS[k]&&USUARIOS[k].clave===c){set({u:k,t:Date.now()});return true}
    return false;
  },
  salir(){set(null);location.replace(raiz+'index.html')},
  /* Página de inicio del usuario, relativa a Pages/ */
  inicio:()=>{const u=AUTH.usuario();return u?u.inicio:'estadisticas.html'}
};
window.TAZ_AUTH=AUTH;

if(enPages){
  const u=AUTH.usuario();
  /* Sin sesión: al inicio de sesión. Página que no le toca: a su inicio. */
  if(!u){location.replace('../index.html');return}
  if(TODAS.includes(pagina)&&!u.paginas.includes(pagina)){location.replace(u.inicio);return}
  /* Esconder del menú las secciones que este usuario no ve (antes de pintar) */
  const css=TODAS.filter(p=>!u.paginas.includes(p)).map(p=>`.top nav a[href="${p}"]`).join(',');
  const solo=u.paginas.length<2?'.top nav{display:none!important}':'';
  if(css||solo)document.write(`<style>${css?css+'{display:none!important}':''}${solo}</style>`);
  document.addEventListener('DOMContentLoaded',()=>{
    const top=document.querySelector('.top'),brand=document.querySelector('.top .brand');
    if(!top||!brand)return;
    /* Con una sola sección (repartidor) no hace falta el menú de secciones */
    if(u.paginas.length<2)top.classList.add('solo');
    /* El logo abre un menú con el usuario y el botón Salir */
    const m=document.createElement('div');
    m.className='cuenta-menu';m.id='cuenta-menu';m.setAttribute('role','menu');
    m.innerHTML=`<span class="rol">Conectado como <b>${u.rol}</b></span><button class="salir" type="button" role="menuitem">🚪 Salir</button>`;
    top.appendChild(m);brand.setAttribute('aria-controls','cuenta-menu');
    const abrir=on=>{m.classList.toggle('on',on);brand.setAttribute('aria-expanded',on);if(on)m.querySelector('.salir').focus()};
    brand.addEventListener('click',e=>{e.preventDefault();abrir(!m.classList.contains('on'))});
    m.querySelector('.salir').addEventListener('click',AUTH.salir);
    document.addEventListener('click',e=>{if(m.classList.contains('on')&&!m.contains(e.target)&&!brand.contains(e.target))abrir(false)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('on')){abrir(false);brand.focus()}});
  });
}
})();
