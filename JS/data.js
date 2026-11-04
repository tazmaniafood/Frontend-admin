/* Datos compartidos del panel (cocina, entregas, todos los pedidos, estadísticas).
   Por ahora son PEDIDOS DE PRUEBA guardados en el navegador (localStorage 'taz-admin').
   Cuando exista el backend, solo hay que cambiar load()/save() por llamadas a la API. */
(()=>{
const KEY='taz-admin',MIN=60000;
const ESTADOS={
  nuevo:{t:'Nuevo',ico:'🆕',c:'#4c8dd9'},
  listo:{t:'Listo',ico:'✅',c:'#5fc27a'},
  entregado:{t:'Entregado',ico:'🏁',c:'#cdb39d'}
};

/* Tipo de pedido: 'domicilio' (lo lleva el repartidor) o 'llevar' (el cliente lo recoge en el local) */
const LLEVAR=[1040,1036,1034];
/* Medio de pago y si el pago ya está confirmado (mismos valores que la tabla pedidos del servidor) */
const MEDIOS={efectivo:'💵 Efectivo',tarjeta:'💳 Tarjeta',transferencia:'🏦 Transferencia',nequi:'📱 Nequi',daviplata:'📱 Daviplata'};
const PAGOS={1041:['tarjeta',true],1040:['efectivo',false],1039:['nequi',true],1038:['tarjeta',true],1037:['transferencia',false],
             1036:['efectivo',false],1035:['daviplata',true],1034:['efectivo',true],1033:['tarjeta',true]};
const pago=id=>PAGOS[id]||['efectivo',false];
function seed(){
  const now=Date.now();
  const o=(id,min,estado,cliente,tel,dir,items,total,rep)=>({id,creado:now-min*MIN,estado,tipo:LLEVAR.includes(id)?'llevar':'domicilio',medio:pago(id)[0],pagado:pago(id)[1],cliente,tel,dir,items,total,repartidor:rep||''});
  return [
    o(1041,2,'nuevo','Laura M.','+1 408 555 0141','1180 Lincoln Ave, San Jose',[{q:1,n:'Pizza Hawaiana',d:'Familiar · Borde de bocadillo'},{q:2,n:'Coca-Cola'}],32),
    o(1040,6,'nuevo','Jorge P.','+1 669 555 0177','455 Park Ave, San Jose',[{q:1,n:'Salchi Tazmania',d:'Extra: Huevo'}],20.5),
    o(1039,11,'nuevo','Ana R.','+1 408 555 0102','77 Race St, San Jose',[{q:1,n:'Pizza a tu gusto',d:'Medium · Pollo, Champiñones, Maíz'},{q:1,n:'Perro salvaje'}],32),
    o(1038,17,'nuevo','Miguel S.','+1 650 555 0190','2010 The Alameda, San Jose',[{q:2,n:'Gran Burguer',d:'Extra: Tocineta'},{q:2,n:'Pepsi'}],35),
    o(1037,24,'listo','Valentina C.','+1 408 555 0133','63 N Keeble Ave, San Jose',[{q:1,n:'Pizza La 4K',d:'Personal'}],22),
    o(1036,31,'listo','Pedro G.','+1 669 555 0118','300 Meridian Ave, San Jose',[{q:1,n:'Mazorcada TAZ',d:'Extra: Queso extra'},{q:1,n:'Sprite'}],20),
    o(1035,38,'listo','Sofía L.','+1 408 555 0165','901 Bird Ave, San Jose',[{q:1,n:'Pizza Mexicana',d:'Familiar'}],29,'Carlos'),
    o(1034,55,'entregado','Camilo H.','+1 650 555 0124','150 Stockton Ave, San Jose',[{q:3,n:'Perro salvaje'}],30,'Daniela'),
    o(1033,70,'entregado','Isabel T.','+1 408 555 0187','520 W San Carlos St, San Jose',[{q:1,n:'Pizza Camarones',d:'Medium'},{q:1,n:'Coca-Cola'}],28.5,'Andrés')
  ];
}
function load(){
  try{const d=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(d)&&d.length){
    /* Estados que ya no existen: "En preparación" vuelve a Nuevos y "En camino" a Listos */
    const MAPA={prep:'nuevo',camino:'listo'};let cambio=false;d.forEach(o=>{if(MAPA[o.estado]){o.estado=MAPA[o.estado];cambio=true}
      if(!o.tipo){o.tipo=LLEVAR.includes(o.id)?'llevar':'domicilio';cambio=true}
      if(o.medio===undefined){[o.medio,o.pagado]=pago(o.id);cambio=true}});if(cambio)save(d);return d}}catch(e){}
  const d=seed();save(d);return d;
}
function save(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
const fmt=n=>'$'+n.toFixed(2);
const hace=t=>{const m=Math.max(0,Math.round((Date.now()-t)/MIN));return m<1?'ahora':m<60?`hace ${m} min`:`hace ${Math.floor(m/60)} h ${m%60} min`};
const minutos=t=>Math.round((Date.now()-t)/MIN);

/* Reloj del header + aviso */
function reloj(){const el=document.getElementById('reloj');if(!el)return;const f=()=>el.textContent=new Date().toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});f();setInterval(f,15000)}
function aviso(txt){const t=document.getElementById('toast');if(!t)return;t.textContent=txt;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),1800)}

window.TAZ={ESTADOS,MEDIOS,load,save,reset(){const d=seed();save(d);return d},fmt,hace,minutos,aviso};
document.addEventListener('DOMContentLoaded',reloj);
})();
