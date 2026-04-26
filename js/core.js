/* TallerPro GT — js/core.js
   Módulo independiente — cada archivo tiene funciones específicas
   Para editar: modificar solo este archivo y recargar
*/

/* ================================================================
   SISTEMA DE LICENCIAS v2 - TallerPro GT
   ================================================================ */
var SUPA_URL = "https://voxclbgdoubntqyfupxl.supabase.co";
var SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZveGNsYmdkb3VibnRxeWZ1cHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDU2MzAsImV4cCI6MjA5MjY4MTYzMH0.op5UaDFbogxmgj29VAsTGTbEkcND_CLOqliKvz4flz0";
var DEMO_DIAS = 15;
var DEMO_BLOQUEADOS = ["reportes","fel","configuracion","whatsapp","contabilidad","nomina"];
var licenciaActual = null;

// ── ID único por instalación ─────────────────────────────────────
function resetDB(){indexedDB.deleteDatabase(DB_NAME);location.reload();}
window.onerror=function(msg,src,line,col,err){
  document.body.innerHTML='<div style="background:#1a1a1a;color:#e05a4e;padding:30px;font-family:monospace;font-size:13px;min-height:100vh">'
    +'<h2 style="color:#e8a820;margin-bottom:16px">TallerPro GT - Error</h2>'
    +'<div style="margin-bottom:8px"><b>Mensaje:</b> '+msg+'</div>'
    +'<div style="margin-bottom:8px"><b>Linea:</b> '+line+' | Col: '+col+'</div>'
    +'<div style="color:#9a9690;font-size:11px;margin-top:16px">Abre F12 Console para mas detalles</div>'
    +'<button onclick="resetDB()" '
    +'style="margin-top:20px;background:#e8a820;color:#000;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-size:14px">'
    +'Reiniciar base de datos</button></div>';
  return true;
};
// DB_NAME depende del taller_id guardado en localStorage (aislamiento por taller)
var _tid = localStorage.getItem('tpgt_taller_id') || '';
var DB_NAME = _tid ? ('TallerProDB_' + _tid) : 'TallerProDB';
const DB_VERSION=16;let db;
const STORES={
  usuarios:{keyPath:'id',autoIncrement:true},
  sesion:{keyPath:'key'},
  clientes:{keyPath:'id',autoIncrement:true},
  vehiculos:{keyPath:'id',autoIncrement:true},
  repuestos:{keyPath:'id',autoIncrement:true},
  insumos:{keyPath:'id',autoIncrement:true},
  recepciones:{keyPath:'id',autoIncrement:true},
  ordenes:{keyPath:'id',autoIncrement:true},
  facturas:{keyPath:'id',autoIncrement:true},
  activos:{keyPath:'id',autoIncrement:true},
  costos:{keyPath:'id',autoIncrement:true},
  alertas:{keyPath:'id',autoIncrement:true},
  cuentas_bancarias:{keyPath:'id',autoIncrement:true},
  movimientos_bancarios:{keyPath:'id',autoIncrement:true},
  servicios:{keyPath:'id',autoIncrement:true},
  llamadas_atencion:{keyPath:'id',autoIncrement:true},
  vacaciones_emp:{keyPath:'id',autoIncrement:true},
  documentos_emp:{keyPath:'id',autoIncrement:true},
  historial_pagos:{keyPath:'id',autoIncrement:true},
  contratos_flota:{keyPath:'id',autoIncrement:true},
  viaticos:{keyPath:'id',autoIncrement:true},
  whatsapp_logs:{keyPath:'id',autoIncrement:true},
  auditoria:{keyPath:'id',autoIncrement:true},
  servicios_externos:{keyPath:'id',autoIncrement:true},
  capacitaciones:{keyPath:'id',autoIncrement:true},
  aumentos_salariales:{keyPath:'id',autoIncrement:true},
  envios:{keyPath:'id',autoIncrement:true},
  cotizaciones:{keyPath:'id',autoIncrement:true},
  empleados:{keyPath:'id',autoIncrement:true},
  nomina:{keyPath:'id',autoIncrement:true},
  proveedores:{keyPath:'id',autoIncrement:true},
  asientos:{keyPath:'id',autoIncrement:true},
  fotos:{keyPath:'id',autoIncrement:true},
  kpi:{keyPath:'id',autoIncrement:true},
  config:{keyPath:'key'},
  bodegas:{keyPath:'id',autoIncrement:true},
  traslados:{keyPath:'id',autoIncrement:true}
};

function initDB(){
  return new Promise((res,rej)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=e=>{
      const d=e.target.result;
      Object.entries(STORES).forEach(([name,opts])=>{
        if(!d.objectStoreNames.contains(name)){
          const s=d.createObjectStore(name,opts);
          if(name==='vehiculos')s.createIndex('clienteId','clienteId',{unique:false});
          if(name==='facturas')s.createIndex('fecha','fecha',{unique:false});
          if(name==='ordenes')s.createIndex('estado','estado',{unique:false});
          if(name==='nomina')s.createIndex('empleadoId','empleadoId',{unique:false});
          if(name==='kpi')s.createIndex('empleadoId','empleadoId',{unique:false});
        }
      });
    };
    req.onsuccess=e=>{db=e.target.result;res(db);};
    req.onerror=e=>rej(e.target.error);
  });
}

function dbGet(store,key){return new Promise((r,j)=>{const tx=db.transaction(store,'readonly');tx.objectStore(store).get(key).onsuccess=e=>r(e.target.result);tx.onerror=e=>j(e)});}
function dbGetAll(store){return new Promise((r,j)=>{const tx=db.transaction(store,'readonly');tx.objectStore(store).getAll().onsuccess=e=>r(e.target.result);tx.onerror=e=>j(e)});}
function dbPut(store,obj){return new Promise((r,j)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(obj).onsuccess=e=>r(e.target.result);tx.onerror=e=>j(e)});}
function dbAdd(store,obj){return new Promise((r,j)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).add(obj).onsuccess=e=>r(e.target.result);tx.onerror=e=>j(e)});}
function dbDelete(store,key){return new Promise((r,j)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).delete(key).onsuccess=()=>r();tx.onerror=e=>j(e)});}
function dbGetByIndex(store,index,value){return new Promise((r,j)=>{const tx=db.transaction(store,'readonly');tx.objectStore(store).index(index).getAll(value).onsuccess=e=>r(e.target.result);tx.onerror=e=>j(e)});}


/* ---- UTILIDADES ---- */
const IVA=0.12,ISR=0.25,MARGEN_MIN=0.20;
// Salarios minimos 2026 - Acuerdo Gubernativo 256-2025
var SAL_MIN = {
  CE1: {noAgricola:4002.28, agricola:3791.20, maquila:3409.73},
  CE2: {noAgricola:3816.90, agricola:3625.89, maquila:3221.10}
};

const fmt=n=>`Q ${parseFloat(n||0).toLocaleString('es-GT',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fmtNum=n=>parseFloat(n||0).toLocaleString('es-GT',{minimumFractionDigits:2,maximumFractionDigits:2});
const today=()=>new Date().toISOString().split('T')[0];
const nowTs=()=>new Date().toISOString();
const genId=p=>p+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase();
// ── Helpers de formulario (shorthand) ────────────────────────────
var $v = function(id){ var el=document.getElementById(id); return el?el.value:''; };
var $n = function(id){ return parseFloat($v(id))||0; };
var $el = function(id){ return document.getElementById(id); };
var $ch = function(id){ var el=document.getElementById(id); return el?el.checked:false; };


/* ================================================================
   UTILIDADES DE TELÉFONO - Formato Guatemala (+502)
   ================================================================ */
function normalizarTel(tel) {
  if (!tel) return '';
  // Quitar todo excepto dígitos y +
  var clean = tel.replace(/[^\d+]/g,'');
  // Si empieza con 502 sin +, agregar +
  if (clean.startsWith('502') && !clean.startsWith('+')) clean = '+' + clean;
  // Si es solo 8 dígitos (celular GT sin código), agregar +502
  if (/^[3-9]\d{7}$/.test(clean)) clean = '+502' + clean;
  // Si empieza con 0 quitar el 0 inicial (algunos escriben 0502...)
  if (clean.startsWith('0502')) clean = '+' + clean.slice(1);
  return clean;
}

function formatearTelDisplay(tel) {
  if (!tel) return '';
  var n = normalizarTel(tel);
  // Guatemala: +502 XXXX-XXXX
  if (n.startsWith('+502') && n.length === 12) {
    return '+502 ' + n.slice(4,8) + '-' + n.slice(8,12);
  }
  return n;
}

function validarTel(tel) {
  if (!tel) return true; // opcional
  var n = normalizarTel(tel);
  return n.startsWith('+') && n.length >= 10;
}

// Aplicar formato al salir del campo
function onTelBlur(input) {
  if (!input || !input.value.trim()) return;
  var fmt = formatearTelDisplay(input.value.trim());
  if (fmt) input.value = fmt;
  if (!validarTel(input.value)) {
    input.style.borderColor = 'var(--red)';
    input.title = 'Formato inválido. Ej: +502 5555-0000';
  } else {
    input.style.borderColor = '';
    input.title = '';
  }
}


function toggleSelectAll(tbodyId, checkName) {
  var checks = document.querySelectorAll('input[name="'+checkName+'"]');
  var header = document.getElementById('chk_all_'+checkName);
  checks.forEach(function(c){ c.checked = header ? header.checked : true; });
}
function getSelectedIds(checkName) {
  return Array.from(document.querySelectorAll('input[name="'+checkName+'"]:checked'))
    .map(function(c){ return parseInt(c.value); }).filter(Boolean);
}

function fechaLegible(s){
  if(!s)return'—';
  try{
    var d=new Date(s+(s.length===10?'T00:00:00':''));
    if(isNaN(d))return s;
    var dd=String(d.getDate()).padStart(2,'0');
    var mm=String(d.getMonth()+1).padStart(2,'0');
    var yy=d.getFullYear();
    return dd+'-'+mm+'-'+yy;
  }catch(e){return s;}
}
function fechaLegibleCorta(s){
  if(!s)return'—';
  try{
    var d=new Date(s+(s.length===10?'T00:00:00':''));
    if(isNaN(d))return s;
    var meses=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return String(d.getDate()).padStart(2,'0')+' '+meses[d.getMonth()]+' '+d.getFullYear();
  }catch(e){return s;}
}
function addDays(ds,d){const dt=new Date(ds+'T00:00:00');dt.setDate(dt.getDate()+d);return dt.toISOString().split('T')[0];}
function diasRestantes(ds){const d=new Date(ds+'T00:00:00');const n=new Date();n.setHours(0,0,0,0);return Math.round((d-n)/(864e5));}
function hashSimple(s){let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}return h.toString(16);}
function numLetras(n){const e=Math.floor(n);const d=Math.round((n-e)*100);return`QUETZALES ${e.toLocaleString('es-GT')} CON ${d.toString().padStart(2,'0')}/100`;}

function toast(msg,type='green'){
  const t=document.createElement('div');
  t.style.cssText=`position:fixed;bottom:24px;right:24px;z-index:9999;padding:11px 18px;border-radius:8px;font-size:13px;font-weight:500;background:var(--bg2);border:1px solid var(--border2);color:var(--text);box-shadow:0 4px 24px rgba(0,0,0,.5);transition:opacity .3s;display:flex;align-items:center;gap:8px`;
  const icons={green:'\u2713',red:'\u2715',amber:'\u26A0',blue:'\u2139'};
  t.innerHTML=`<span style="color:var(--${type})">${icons[type]||'\u2022'}</span>${msg}`;
  document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),300);},2800);
}

/* ---- SESI\u00D3N / AUTH ---- */
let sesionActual=null;

const PERFILES={
  admin:{label:'Administrador',color:'red',nivel:3,permisos:['todo']},
  supervisor:{label:'Supervisor',color:'amber',nivel:2,permisos:['ordenes','clientes','vehiculos','repuestos','insumos','recepciones','facturas','proveedores','empleados','alertas','kpi']},
  operador:{label:'Operador',color:'blue',nivel:1,permisos:['ordenes','clientes','vehiculos','recepciones','repuestos','insumos','alertas']}
};

function puedeAcceder(modulo){
  if(!sesionActual)return false;
  const p=PERFILES[sesionActual.perfil];
  if(!p)return false;
  if(p.permisos.includes('todo'))return true;
  return p.permisos.includes(modulo);
}

function soloAdmin(){return sesionActual?.perfil==='admin';}
function adminOSupervisor(){return sesionActual?.perfil==='admin'||sesionActual?.perfil==='supervisor';}

var SAL_MIN_2026 = {
  vigencia: '01 enero 2026', acuerdo: 'AG 256-2025', bonificacion: 250,
  CE1: {
    noAgricola: { diario: 131.58, base: 4002.28, total: 4252.28, label: 'CE1 No Agricola (Talleres/Mecanica/Servicios) — Dto. Guatemala' },
    agricola:   { diario: 124.64, base: 3791.20, total: 4041.20, label: 'CE1 Agricola — Dto. Guatemala' },
    maquila:    { diario: 112.10, base: 3409.73, total: 3659.73, label: 'CE1 Exportadora/Maquila — Dto. Guatemala' }
  },
  CE2: {
    noAgricola: { diario: 125.49, base: 3816.90, total: 4066.90, label: 'CE2 No Agricola (Talleres/Mecanica/Servicios) — Resto pais' },
    agricola:   { diario: 119.21, base: 3625.89, total: 3875.89, label: 'CE2 Agricola — Resto pais' },
    maquila:    { diario: 105.90, base: 3321.10, total: 3571.10, label: 'CE2 Exportadora/Maquila — Resto pais' }
  }
};
function aplicarSalMin(sel, inp) {
  if (!sel||!inp||!sel.value) return;
  var p=sel.value.split('_'); var ce=p[0],tipo=p[1];
  if (SAL_MIN_2026[ce]&&SAL_MIN_2026[ce][tipo]) {
    var s=SAL_MIN_2026[ce][tipo];
    inp.value=s.base.toFixed(2); inp.style.borderColor='var(--green)';
    inp.title=s.label+' | Base: Q'+s.base.toFixed(2)+' + Q250 bonif = Q'+s.total.toFixed(2);
    inp.dispatchEvent(new Event('change'));
  }
}

async function filtrarTabla(inputId,tbodyId){
  const q=document.getElementById(inputId)?.value?.toLowerCase()||'';
  document.querySelectorAll(`#${tbodyId} tr`).forEach(tr=>{tr.style.display=tr.textContent.toLowerCase().includes(q)?'':'none';});
}


async function getLineasFactura(){
  // Formato nuevo: lr0, ld0, lq0, lu0, lp0
  var rowsNew = Array.from(document.querySelectorAll('div[id]')).filter(function(r){
    return /^lr\d+$/.test(r.id);
  });
  if (rowsNew.length) {
    return rowsNew.map(function(r) {
      var ix = r.id.replace('lr','');
      return {
        desc: (document.getElementById('ld'+ix)||{}).value||'',
        qty:  parseFloat((document.getElementById('lq'+ix)||{}).value)||1,
        unit: parseFloat((document.getElementById('lu'+ix)||{}).value)||0,
        desc_pct: parseFloat((document.getElementById('lp'+ix)||{}).value)||0
      };
    }).filter(function(l){ return l.desc||l.unit>0; });
  }
  // Formato legacy: lf_row_X
  return Array.from(document.querySelectorAll('[id^="lf_row_"]')).map(function(r) {
    var ix = r.id.split('_').pop();
    return {
      desc: (document.getElementById('lf_d_'+ix)||{}).value||'',
      qty:  parseFloat((document.getElementById('lf_q_'+ix)||{}).value)||1,
      unit: parseFloat((document.getElementById('lf_u_'+ix)||{}).value)||0,
      desc_pct: parseFloat((document.getElementById('lf_p_'+ix)||{}).value)||0
    };
  }).filter(function(l){ return l.desc||l.unit>0; });
}
function getLF() { return getLineasFactura(); }



function calcLFTotal(i) {
  var qty  = parseFloat((document.getElementById('lq'+i)||{}).value)||0;
  var unit = parseFloat((document.getElementById('lu'+i)||{}).value)||0;
  var desc = parseFloat((document.getElementById('lp'+i)||{}).value)||0;
  var tot  = qty * unit * (1 - desc/100);
  var el   = document.getElementById('lt'+i);
  if (el) el.textContent = 'Q ' + tot.toFixed(2);
}

var calcTotFac = function(){ if(typeof calcFacTotales==="function") calcFacTotales(); };
function calcFacTotales(){
  try{
    // Leer TODAS las líneas (incluso vacías) para mostrar totales en tiempo real
    var rowsNew = Array.from(document.querySelectorAll('div[id]')).filter(function(r){
      return /^lr\d+$/.test(r.id);
    });
    var lineasAll = rowsNew.length ? rowsNew.map(function(r){
      var ix = r.id.replace('lr','');
      return {
        qty:  parseFloat((document.getElementById('lq'+ix)||{}).value)||0,
        unit: parseFloat((document.getElementById('lu'+ix)||{}).value)||0,
        desc_pct: parseFloat((document.getElementById('lp'+ix)||{}).value)||0
      };
    }) : getLineasFactura();
    const bruto=lineasAll.reduce((a,l)=>a+(l.qty*l.unit),0);
    const desc=lineasAll.reduce((a,l)=>a+(l.qty*l.unit*(l.desc_pct||0)/100),0);
    const sub=parseFloat((bruto-desc).toFixed(2));
    const iva=parseFloat((sub*IVA).toFixed(2));
    const total=parseFloat((sub+iva).toFixed(2));
    const el=document.getElementById('fac_tots')||document.getElementById('fac_totales');if(!el)return;
    const row=(label,val,cls='',bold=false)=>`<div style="display:flex;justify-content:space-between;gap:24px;font-size:${bold?'14':'13'}px;${bold?'font-weight:700;':''}color:${cls?`var(--${cls})`:'var(--text2)'};${bold?'border-top:1px solid var(--border);padding-top:8px;margin-top:4px':''}"><span>${label}</span><span style="font-family:var(--font-mono)">Q&nbsp;${fmtNum(val)}</span></div>`;
    el.innerHTML=`<div style="display:inline-block;text-align:right;min-width:280px;background:var(--bg3);border-radius:var(--radius);padding:14px 16px;border:1px solid var(--border)">
      ${row('Subtotal bruto:',bruto)}
      ${desc>0?row('(-) Descuentos:',desc,'red'):''}
      ${row('Subtotal neto:',sub)}
      ${row('IVA (12%):',iva,'accent')}
      ${row('TOTAL A PAGAR:',total,'green',true)}
    </div>`;
  }catch(e){}
}

function exportarBackup(){
  const data={};
  for(const store of Object.keys(STORES))data[store]=await dbGetAll(store);
  data._exportedAt=nowTs();data._version=DB_VERSION;
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=`TallerPro_backup_${today()}.json`;a.click();
  toast('Backup exportado');
}
function importarBackup(){
  const input=document.createElement('input');input.type='file';input.accept='.json';
  input.onchange=async e=>{
    const file=e.target.files[0];if(!file)return;
    const data=JSON.parse(await file.text());
    if(!confirm(`\u00BFImportar backup de ${data._exportedAt}? SOBREESCRIBIR\u00C1 los datos actuales.`))return;
    for(const[store,records]of Object.entries(data)){
      if(!STORES[store])continue;
      const tx=db.transaction(store,'readwrite');tx.objectStore(store).clear();
      for(const rec of records)tx.objectStore(store).put(rec);
    }
    toast('Backup importado');setTimeout(()=>navTo('dashboard'),600);
  };input.click();
}

/* ---- PAGE ROUTER ---- */
async function renderPage(page){
  const content=document.getElementById('content');
  const topbarTitle=document.getElementById('topbar-title');
  const topbarActions=document.getElementById('topbar-actions');
  topbarActions.innerHTML='';
  const titles={dashboard:'Dashboard General',dashboard_mecanicos:'KPI Mec\u00E1nicos',dashboard_financiero:'Dashboard Financiero',
    alertas:'Alertas',recepciones:'Recepci\u00F3n',ordenes:'\u00D3rdenes de Trabajo',facturas:'Facturaci\u00F3n',
    repuestos:'Repuestos',insumos:'Insumos',proveedores:'Proveedores',
    clientes:'Clientes',vehiculos:'Veh\u00EDculos',historial_pagos:'Historial de Pagos',gestion_rrhh:'Gestion de Empleados',liquidacion:'Liquidacion de Empleados',reporte_general:'Reporte General',empleados:'Empleados',nomina:'N\u00F3mina',
    viaticos:'Viaticos y Gastos',impuestos:'IVA / ISR',costos:'Costos Operativos',activos:'Activos & Depreciaci\u00F3n',rentabilidad:'Rentabilidad',
    contabilidad:'Contabilidad',whatsapp:'WhatsApp Bot',fel:'Facturacion FEL',envios:'Envios',cotizador:'Cotizador de Servicios',budget:'Budget / Presupuesto',flota:'Flota Empresarial',auditoria:'Log de Auditoria',servicios_externos:'Servicios Externos',capacitacion:'Capacitaciones',aumentos:'Aumentos Salariales',dash_facturas:'Dashboard Facturas',dash_cotizaciones:'Dashboard Cotizaciones',dash_budget:'Dashboard Budget',import_export:'Importar / Exportar',impuestos:'IVA / ISR',bancos:'Cuentas Bancarias',servicios:'Servicios y Gastos Fijos',usuarios:'Usuarios & Accesos',configuracion:'Configuraci\u00F3n'};
  topbarTitle.textContent=titles[page]||page;
  content.innerHTML=`<div style="color:var(--text3);padding:20px;text-align:center">\u2699 Cargando...</div>`;
  const pages={dashboard:renderDashboard,dashboard_mecanicos:renderDashboard_mecanicos,
    dashboard_financiero:renderDashboard_financiero,alertas:renderAlertas,
    recepciones:renderRecepciones,ordenes:renderOrdenes,facturas:renderFacturas,
    repuestos:renderRepuestos,insumos:renderInsumos,proveedores:renderProveedores,
    clientes:renderClientes,vehiculos:renderVehiculos,historial_pagos:renderHistorialPagos,
    gestion_rrhh:renderGestionRRHH,
    liquidacion:renderLiquidacion,
    reporte_general:renderReporteGeneral,
    empleados:renderEmpleados,nomina:renderNomina,
    viaticos:renderViaticos,
    costos:renderCostos,activos:renderActivos,rentabilidad:renderRentabilidad,
    whatsapp:renderWhatsApp,pos:renderConfigPos,
    fel:renderFEL,
    envios:renderEnvios,
    cotizador:renderCotizador,
    budget:renderBudget,
    flota:renderFlota,
    auditoria:renderAuditoria,importar_sat:renderImportarSAT,licencia:renderLicencia,bodegas:renderBodegas,
    servicios_externos:renderServiciosExternos,
    capacitacion:renderCapacitacion,
    aumentos:renderAumentos,
    dash_facturas:renderDashFacturas,
    dash_cotizaciones:renderDashCotizaciones,
    dash_budget:renderDashBudget,
    import_export:renderImportExport,
    impuestos:renderImpuestos,
    bancos:renderBancos,
    servicios:renderServicios,contabilidad:renderAsientos,usuarios:renderUsuarios,configuracion:renderConfiguracion};
  if(pages[page])await pages[page](content,topbarActions);
}

/* ---- INIT ---- */

async function leerArchivoTexto(file) {
  return new Promise(function(res, rej) {
    var r = new FileReader();
    r.onload = function(e){ res(e.target.result); };
    r.onerror = function(e){ rej(new Error('No se pudo leer el archivo')); };
    r.readAsText(file, 'UTF-8');
  });
}

function leerArchivoBuffer(file) {
  return new Promise(function(res, rej) {
    var r = new FileReader();
    r.onload = function(e){ res(e.target.result); };
    r.onerror = function(e){ rej(new Error('No se pudo leer el archivo')); };
    r.readAsArrayBuffer(file);
  });
}

function parsearLinea(linea, sep) {
  // Parsear CSV respetando campos entre comillas
  var cols = [];
  var actual = '';
  var enComillas = false;
  for (var i=0; i<linea.length; i++) {
    var c = linea[i];
    if (c === '"') {
      enComillas = !enComillas;
    } else if (c === sep && !enComillas) {
      cols.push(actual.trim());
      actual = '';
    } else {
      actual += c;
    }
  }
  cols.push(actual.trim());
  return cols;
}

function get(cols, idx) {
  if (idx < 0 || idx >= cols.length) return '';
  return (cols[idx] || '').replace(/^"|"$/g, '').trim();
}

function buscarCol(header, nombres) {
  for (var i=0; i<nombres.length; i++) {
    var idx = header.indexOf(nombres[i]);
    if (idx >= 0) return idx;
    // Búsqueda parcial
    for (var j=0; j<header.length; j++) {
      if (header[j].includes(nombres[i]) || nombres[i].includes(header[j])) return j;
    }
  }
  return -1;
}

function normalFecha(str) {
  if (!str) return today();
  str = str.trim().replace(/"/g,'');
  // DD/MM/YYYY → YYYY-MM-DD
  var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0');
  // DD-MM-YYYY
  m = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (m) return m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0');
  // YYYY-MM-DD ya está bien
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0,10);
  // Fecha con hora: 2025-01-15 14:30:00
  if (/^\d{4}-\d{2}-\d{2}\s/.test(str)) return str.slice(0,10);
  return today();
}

async function cargarSheetJS() {
  if (window.XLSX) return;
  await new Promise(function(res, rej) {
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

async function resetearBaseDatos() {
  // Rescatar usuarios antes de borrar
  var usuariosBackup = [];
  try {
    var todos = await dbGetAll('usuarios');
    // Conservar solo: demo, admin, y cualquier usuario con perfil admin activo
    usuariosBackup = todos.filter(function(u) {
      return u.username === 'demo' || u.username === 'admin' || (u.perfil === 'admin' && u.activo !== false);
    });
  } catch(e) {}

  // Guardar localStorage antes de borrar
  var licBackup    = localStorage.getItem('tpgt_licencia');
  var tallerBackup = localStorage.getItem('tpgt_taller_id');
  var perfilBackup = localStorage.getItem('tpgt_taller_profile');

  // Borrar DB
  if (db) { try { db.close(); } catch(e) {} }
  await new Promise(function(res) {
    var req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = res; req.onerror = res; req.onblocked = res;
  });

  // Restaurar localStorage
  if (licBackup)    localStorage.setItem('tpgt_licencia', licBackup);
  if (tallerBackup) localStorage.setItem('tpgt_taller_id', tallerBackup);
  if (perfilBackup) localStorage.setItem('tpgt_taller_profile', perfilBackup);

  // Re-abrir DB y restaurar usuarios conservados
  try {
    db = await initDB();
    // Asegurar que demo/admin existen con sus passwords originales
    var hayDemo  = usuariosBackup.find(function(u){ return u.username==='demo'; });
    var hayAdmin = usuariosBackup.find(function(u){ return u.username==='admin'; });
    if (!hayDemo) usuariosBackup.push({nombre:'Demo Admin',username:'demo',passwordHash:hashSimple('demo123'),esDemo:true,perfil:'admin',activo:true,createdAt:nowTs()});
    if (!hayAdmin) usuariosBackup.push({nombre:'Administrador',username:'admin',passwordHash:hashSimple('admin123'),esDemo:false,perfil:'admin',activo:true,createdAt:nowTs()});
    for (var j=0; j<usuariosBackup.length; j++) {
      var u = Object.assign({}, usuariosBackup[j]);
      delete u.id; // dejar que autoIncrement asigne nuevo id
      await dbAdd('usuarios', u);
    }
  } catch(e) { console.error('Error restaurando usuarios:', e); }

  toast('✓ Base de datos reiniciada. Los usuarios se conservaron.');
  setTimeout(function(){ location.reload(); }, 1500);
}

async function mostrarZonaPeligroCfg() {
  openModal('zonaPeligro', 'Reiniciar base de datos',
    '<div style="background:var(--red-dim);border:1px solid rgba(224,90,78,.4);border-radius:8px;padding:14px;margin-bottom:14px">'
    + '<div style="font-weight:700;font-size:14px;color:var(--red);margin-bottom:6px">⚠ Esta acción no se puede deshacer</div>'
    + '<div style="font-size:12px;color:var(--text2);line-height:1.8">Se eliminarán TODOS los datos: clientes, vehículos, órdenes, empleados, facturas, costos, inventario.<br><strong>La licencia y el perfil del taller NO se borran.</strong></div>'
    + '</div>'
    + '<div style="font-size:13px;margin-bottom:8px">Escribe <strong>CONFIRMAR</strong> para continuar:</div>'
    + '<input id="reset_confirm_txt" placeholder="CONFIRMAR" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px;color:var(--text);font-size:14px;text-align:center;font-weight:700;outline:none;box-sizing:border-box">',
    async function() {
      var txt = (document.getElementById('reset_confirm_txt')||{}).value||'';
      if (txt.trim() !== 'CONFIRMAR') { toast('Escribe CONFIRMAR para continuar', 'red'); return; }
      await resetearBaseDatos();
    }, false
  );
}



function logAuditoria(accion, modulo, descripcion, datos) {
  try {
    var u = sesionActual || {};
    await dbAdd('auditoria', {
      fecha: nowTs(),
      usuario: u.username || 'sistema',
      nombre: u.nombre || '',
      accion: accion,
      modulo: modulo,
      descripcion: descripcion,
      datos: datos ? JSON.stringify(datos).slice(0,500) : '',
      ip: 'local',
      createdAt: nowTs()
    });
  } catch(e) {}
}

async
