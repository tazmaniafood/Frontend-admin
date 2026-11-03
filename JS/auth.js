/* Sesión del panel admin.
   PROVISIONAL: usuario y contraseña fijos en el navegador, solo para pruebas.
   No es seguridad real (cualquiera puede leer este archivo). Cuando exista el
   backend, login() debe llamar a la API y la sesión debe validarse en el servidor. */
(()=>{
const KEY='taz-admin-sesion';
const USUARIO='admin', CLAVE='Taz2026*';
const get=()=>{try{return JSON.parse(sessionStorage.getItem(KEY))}catch(e){return null}};
const set=v=>{try{v?sessionStorage.setItem(KEY,JSON.stringify(v)):sessionStorage.removeItem(KEY)}catch(e){}};
const enPages=/\/Pages\//i.test(location.pathname);
const raiz=enPages?'../':'';

const AUTH={
  activa:()=>!!(get()&&get().u),
  login(u,c){
    if(String(u).trim().toLowerCase()===USUARIO&&c===CLAVE){set({u:USUARIO,t:Date.now()});return true}
    return false;
  },
  salir(){set(null);location.replace(raiz+'index.html')},
  /* Páginas del panel: si no hay sesión, vuelve al inicio de sesión */
  proteger(){if(!AUTH.activa())location.replace(raiz+'index.html')}
};
window.TAZ_AUTH=AUTH;

if(enPages){
  AUTH.proteger();
  /* Botón "Salir" dentro de la pastilla ADMIN del header */
  document.addEventListener('DOMContentLoaded',()=>{
    const a=document.querySelector('.top .admin');if(!a)return;
    const b=document.createElement('button');
    b.type='button';b.className='salir';b.textContent='Salir';b.title='Cerrar sesión';
    b.addEventListener('click',AUTH.salir);a.appendChild(b);
  });
}
})();
