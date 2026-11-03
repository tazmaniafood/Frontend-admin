/* Inicio de sesión: valida con TAZ_AUTH y entra al panel (Pages/admin.html). */
(()=>{
const DESTINO='Pages/admin.html';
if(TAZ_AUTH.activa()){location.replace(DESTINO);return}
const f=document.getElementById('login'),err=document.getElementById('err'),
      u=document.getElementById('usuario'),c=document.getElementById('clave'),ver=document.getElementById('ver');
ver.addEventListener('click',()=>{const o=c.type==='password';c.type=o?'text':'password';ver.textContent=o?'Ocultar':'Ver';ver.setAttribute('aria-pressed',o)});
f.addEventListener('submit',e=>{
  e.preventDefault();
  if(!u.value.trim()||!c.value){err.textContent='Escribe tu usuario y contraseña.';return}
  if(TAZ_AUTH.login(u.value,c.value)){location.replace(DESTINO)}
  else{err.textContent='Usuario o contraseña incorrectos.';c.value='';c.focus()}
});
})();
