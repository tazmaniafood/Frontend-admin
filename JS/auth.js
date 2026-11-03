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
  if(css)document.write(`<style>${css}{display:none!important}</style>`);
  document.addEventListener('DOMContentLoaded',()=>{
    const brand=document.querySelector('.top .brand');
    if(brand){brand.href=u.inicio;brand.title=brand.ariaLabel='Ir al inicio'}
    const a=document.querySelector('.top .admin');if(!a)return;
    const tag=a.querySelector('.tag');if(tag)tag.textContent=u.rol;
    const b=document.createElement('button');
    b.type='button';b.className='salir';b.textContent='Salir';b.title='Cerrar sesión';
    b.addEventListener('click',AUTH.salir);a.appendChild(b);
  });
}
})();
