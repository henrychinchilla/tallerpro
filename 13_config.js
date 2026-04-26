/* TallerPro GT — js/02_core_utils.js */
/* Generado automáticamente — editar este archivo */

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

async function loginUsuario(username,password){
  const usuarios=await dbGetAll('usuarios');
  const hash=hashSimple(password);
  const user=usuarios.find(u=>u.username===username&&u.passwordHash===hash&&u.activo);
  if(!user)return null;
  const ses={key:'sesion_actual',userId:user.id,username:user.username,nombre:user.nombre,perfil:user.perfil,loginAt:nowTs()};
  await dbPut('sesion',ses);
  sesionActual=ses;
  return ses;
}

async function logout(){
  await logAuditoria('LOGOUT','sistema','Cierre de sesión: '+(sesionActual?.username||''),{});
  await dbDelete('sesion','sesion_actual');
  sesionActual=null;
  var tui=document.getElementById('topbar-user-info');
  if(tui) tui.style.display='none';
  mostrarLogin();
}

async function cargarSesion(){
  const ses=await dbGet('sesion','sesion_actual');
  if(ses){sesionActual=ses;return true;}
  return false;
}

function mostrarLogin(){
  document.getElementById('app').style.display='none';
  let loginDiv=document.getElementById('login-screen');
  if(!loginDiv){
    loginDiv=document.createElement('div');
    loginDiv.id='login-screen';
    document.body.appendChild(loginDiv);
  }
  loginDiv.innerHTML=`
  <div style="min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center">
    <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;padding:36px 40px;width:360px;box-shadow:0 20px 60px rgba(0,0,0,.6)">
      <div style="text-align:center;margin-bottom:28px">
        <div style="font-size:28px;margin-bottom:6px">\u2699</div>
        <h1 style="font-size:20px;font-weight:700;color:var(--accent)">TallerPro GT</h1>
        <p style="font-size:12px;color:var(--text3);margin-top:4px;font-family:var(--font-mono)">Sistema de Gesti\u00F3n v3.0</p>
      </div>
      <div style="margin-bottom:14px">
        <label style="display:block;font-size:12px;font-weight:500;color:var(--text2);margin-bottom:5px">Usuario</label>
        <input id="login_user" type="text" placeholder="nombre de usuario" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px 12px;color:var(--text);font-size:14px;outline:none" onkeydown="if(event.key==='Enter')doLogin()">
      </div>
      <div style="margin-bottom:20px">
        <label style="display:block;font-size:12px;font-weight:500;color:var(--text2);margin-bottom:5px">Contrase\u00F1a</label>
        <input id="login_pass" type="password" placeholder="contrase\u00F1a" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px 12px;color:var(--text);font-size:14px;outline:none" onkeydown="if(event.key==='Enter')doLogin()">
      </div>
      <button onclick="doLogin()" style="width:100%;background:var(--accent);color:#0f0f0f;border:none;border-radius:6px;padding:11px;font-size:14px;font-weight:700;cursor:pointer">Ingresar</button>
      <div id="login_error" style="color:var(--red);font-size:12px;text-align:center;margin-top:10px;display:none">Usuario o contrase\u00F1a incorrectos</div>
      <div style="text-align:center;margin-top:10px;border-top:1px solid var(--border);padding-top:12px">
        <button onclick="mostrarRecuperarPass()" style="background:none;border:none;color:var(--text3);font-size:11px;cursor:pointer;text-decoration:underline">\u00bfOlvidaste tu contrase\u00f1a?</button>
      </div>
      <div id="login_demo_aviso" style="margin-top:12px;padding:10px 12px;border-radius:6px;background:rgba(232,168,32,.08);border:1px solid rgba(232,168,32,.2);font-size:11px;color:var(--accent);text-align:center;display:none">
        Acceso de prueba: <strong>demo</strong> / <strong>demo123</strong>
      </div>
    </div>
  </div>`;
  loginDiv.style.display='block';
  setTimeout(function() {
    var el = document.getElementById('login_user');
    if (el) el.focus();
    // Mostrar aviso demo solo si no hay licencia activa
    var aviso = document.getElementById('login_demo_aviso');
    if (aviso) aviso.style.display = estaActivo() ? 'none' : 'block';
  }, 100);
}


/* ================================================================
   RECUPERACIÓN DE CONTRASEÑA
   ================================================================ */
