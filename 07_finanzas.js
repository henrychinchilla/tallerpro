/* TallerPro GT — 02_utils_auth.js | 631 líneas */

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
function mostrarRecuperarPass() {
  var loginDiv = document.getElementById('login-screen');
  if (!loginDiv) return;
  loginDiv.innerHTML = `
  <div style="min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center">
    <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;padding:36px 40px;width:360px;box-shadow:0 20px 60px rgba(0,0,0,.6)">
      <div style="text-align:center;margin-bottom:24px">
        <div style="font-size:28px;margin-bottom:6px">🔑</div>
        <h2 style="font-size:18px;font-weight:700;color:var(--accent)">Recuperar acceso</h2>
        <p style="font-size:12px;color:var(--text3);margin-top:4px">Ingresa tu usuario para recibir un c\u00f3digo</p>
      </div>
      <div style="margin-bottom:14px">
        <label style="display:block;font-size:12px;font-weight:500;color:var(--text2);margin-bottom:5px">Tu nombre de usuario</label>
        <input id="rec_user" type="text" placeholder="nombre de usuario" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px 12px;color:var(--text);font-size:14px;outline:none" onkeydown="if(event.key==='Enter')solicitarCodigoRecuperacion()">
      </div>
      <div id="rec_metodo_wrap" style="display:none;margin-bottom:14px">
        <label style="display:block;font-size:12px;font-weight:500;color:var(--text2);margin-bottom:8px">Enviar c\u00f3digo a:</label>
        <div id="rec_opciones" style="display:flex;flex-direction:column;gap:8px"></div>
      </div>
      <div id="rec_codigo_wrap" style="display:none;margin-bottom:14px">
        <label style="display:block;font-size:12px;font-weight:500;color:var(--text2);margin-bottom:5px">C\u00f3digo de verificaci\u00f3n</label>
        <input id="rec_codigo" type="text" placeholder="000000" maxlength="6" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px 12px;color:var(--accent);font-size:20px;outline:none;text-align:center;letter-spacing:6px;font-family:var(--font-mono)" oninput="this.value=this.value.replace(/[^0-9]/g,'')">
        <div style="font-size:11px;color:var(--text3);margin-top:4px;text-align:center">El c\u00f3digo expira en 10 minutos</div>
      </div>
      <div id="rec_nueva_pass_wrap" style="display:none;margin-bottom:14px">
        <div class="form-group">
          <label style="font-size:12px;font-weight:500;color:var(--text2)">Nueva contrase\u00f1a</label>
          <input id="rec_pass1" type="password" placeholder="M\u00ednimo 6 caracteres" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px 12px;color:var(--text);font-size:14px;outline:none;margin-top:5px">
        </div>
        <div class="form-group" style="margin-top:10px">
          <label style="font-size:12px;font-weight:500;color:var(--text2)">Confirmar contrase\u00f1a</label>
          <input id="rec_pass2" type="password" placeholder="Repetir contrase\u00f1a" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px 12px;color:var(--text);font-size:14px;outline:none;margin-top:5px">
        </div>
      </div>
      <div id="rec_msg" style="font-size:12px;text-align:center;margin-bottom:10px;color:var(--text3)"></div>
      <button id="rec_btn_principal" onclick="solicitarCodigoRecuperacion()" style="width:100%;background:var(--accent);color:#0f0f0f;border:none;border-radius:6px;padding:11px;font-size:14px;font-weight:700;cursor:pointer">Buscar usuario</button>
      <div style="text-align:center;margin-top:12px">
        <button onclick="mostrarLogin()" style="background:none;border:none;color:var(--text3);font-size:11px;cursor:pointer;text-decoration:underline">← Volver al login</button>
      </div>
    </div>
  </div>`;
  loginDiv.style.display = 'block';
  setTimeout(function(){ var el=document.getElementById('rec_user'); if(el) el.focus(); }, 100);
}

var _recCodigo = null;
var _recUsuario = null;
var _recExpira = null;

async function solicitarCodigoRecuperacion() {
  var username = (document.getElementById('rec_user')||{}).value.trim();
  if (!username) { setRecMsg('Ingresa tu nombre de usuario', 'red'); return; }
  var usuarios = await dbGetAll('usuarios');
  var user = usuarios.find(function(u){ return u.username === username && u.activo !== false; });
  if (!user) { setRecMsg('Usuario no encontrado', 'red'); return; }
  if (!user.email && !user.telefono) {
    setRecMsg('Este usuario no tiene email ni tel\u00e9fono registrado.\nContacta al administrador para restablecer tu contrase\u00f1a.', 'red');
    return;
  }
  _recUsuario = user;
  _recCodigo = String(Math.floor(100000 + Math.random() * 900000));
  _recExpira = Date.now() + 10 * 60 * 1000; // 10 minutos
  // Mostrar opciones de envío
  var opciones = document.getElementById('rec_opciones');
  var wrap = document.getElementById('rec_metodo_wrap');
  if (opciones && wrap) {
    opciones.innerHTML = '';
    if (user.email) {
      var btnEmail = document.createElement('button');
      btnEmail.onclick = function(){ enviarCodigoRecuperacion('email'); };
      btnEmail.style.cssText = 'background:var(--bg3);border:1px solid var(--border2);border-radius:8px;padding:10px 14px;cursor:pointer;color:var(--text);text-align:left;font-size:12px';
      btnEmail.innerHTML = '📧 Enviar por email<br><span style="color:var(--text3);font-size:11px">' + ocultarEmail(user.email) + '</span>';
      opciones.appendChild(btnEmail);
    }
    if (user.telefono) {
      var btnTel = document.createElement('button');
      btnTel.onclick = function(){ enviarCodigoRecuperacion('whatsapp'); };
      btnTel.style.cssText = 'background:var(--bg3);border:1px solid var(--border2);border-radius:8px;padding:10px 14px;cursor:pointer;color:var(--text);text-align:left;font-size:12px';
      btnTel.innerHTML = '📱 Enviar por WhatsApp<br><span style="color:var(--text3);font-size:11px">' + ocultarTel(user.telefono) + '</span>';
      opciones.appendChild(btnTel);
    }
    wrap.style.display = 'block';
  }
  var btn = document.getElementById('rec_btn_principal');
  if (btn) { btn.textContent = 'Verificar c\u00f3digo'; btn.onclick = verificarCodigoRecuperacion; }
  setRecMsg('Selecciona c\u00f3mo quieres recibir el c\u00f3digo', 'green');
  document.getElementById('rec_user').disabled = true;
}

function ocultarEmail(email) {
  if (!email) return '';
  var parts = email.split('@');
  var name = parts[0];
  var masked = name[0] + '***' + (name.length > 2 ? name[name.length-1] : '') + '@' + parts[1];
  return masked;
}
function ocultarTel(tel) {
  if (!tel) return '';
  var clean = tel.replace(/\s/g,'');
  return clean.slice(0,4) + '****' + clean.slice(-2);
}

async function enviarCodigoRecuperacion(via) {
  if (!_recCodigo || !_recUsuario) return;
  var waCfg = await dbGet('config','whatsapp') || {};
  // Si no hay config, usar valores por defecto del propietario
  if (!waCfg.apiKey) waCfg = Object.assign({
    apiKey: '4068040',
    numero: '50243935006',
    nombreTaller: 'TallerPro GT',
    diasAnticipacion: 7
  }, waCfg);
  if (via === 'whatsapp') {
    if (!waCfg.apiKey) {
      setRecMsg('WhatsApp no configurado.\nCódigo temporal: ' + _recCodigo + '\n(Configura WhatsApp Bot en Configuración para envío real)', 'amber');
      document.getElementById('rec_metodo_wrap').style.display = 'none';
      document.getElementById('rec_codigo_wrap').style.display = 'block';
      setTimeout(function(){ var el=document.getElementById('rec_codigo'); if(el) el.focus(); }, 100);
      return;
    }
    var tel = normalizarTel(_recUsuario.telefono);
    var msg = 'TallerPro GT - Tu codigo de recuperacion es: ' + _recCodigo + ' (expira en 10 min). Si no solicitaste esto, ignora este mensaje.';
    await enviarWACallMeBot(tel, msg, waCfg.apiKey);
    setRecMsg('C\u00f3digo enviado por WhatsApp a ' + ocultarTel(_recUsuario.telefono), 'green');
  } else {
    // Email - mostrar instrucciones (requiere backend para envío real)
    setRecMsg('Revisa tu email: ' + ocultarEmail(_recUsuario.email) + '\nNota: en modo demo el c\u00f3digo se muestra en pantalla.', 'green');
    if (!estaActivo()) mostrarCodigoEnPantalla();
  }
  document.getElementById('rec_metodo_wrap').style.display = 'none';
  document.getElementById('rec_codigo_wrap').style.display = 'block';
  setTimeout(function(){ var el=document.getElementById('rec_codigo'); if(el) el.focus(); }, 100);
}


async function enviarEmailRecuperacion(email, codigo, nombre) {
  // EmailJS - servicio gratuito para enviar emails desde el navegador
  // Para activar: crea cuenta en emailjs.com, configura tu servicio y template
  // Luego reemplaza los valores de abajo con los tuyos
  var EMAILJS_PUBLIC_KEY  = localStorage.getItem('tpgt_emailjs_key') || '';
  var EMAILJS_SERVICE_ID  = localStorage.getItem('tpgt_emailjs_service') || '';
  var EMAILJS_TEMPLATE_ID = localStorage.getItem('tpgt_emailjs_template') || '';

  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    return false; // EmailJS no configurado
  }
  try {
    // Cargar EmailJS si no está cargado
    if (!window.emailjs) {
      await new Promise(function(res, rej) {
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
    }
    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: email,
      to_name: nombre || 'Usuario',
      codigo: codigo,
      sistema: 'TallerPro GT',
      expiracion: '10 minutos'
    });
    return true;
  } catch(e) {
    console.error('EmailJS error:', e);
    return false;
  }
}

function mostrarCodigoEnPantalla() {
  // Solo en modo demo/sin licencia activa
  setRecMsg('C\u00f3digo (solo demo): ' + _recCodigo, 'amber');
}

function verificarCodigoRecuperacion() {
  var codigo = (document.getElementById('rec_codigo')||{}).value.trim();
  if (!codigo) { setRecMsg('Ingresa el c\u00f3digo', 'red'); return; }
  if (Date.now() > _recExpira) { setRecMsg('El c\u00f3digo expir\u00f3. Solicita uno nuevo.', 'red'); return; }
  if (codigo !== _recCodigo) { setRecMsg('C\u00f3digo incorrecto', 'red'); return; }
  // Código correcto - mostrar formulario de nueva contraseña
  document.getElementById('rec_codigo_wrap').style.display = 'none';
  document.getElementById('rec_nueva_pass_wrap').style.display = 'block';
  var btn = document.getElementById('rec_btn_principal');
  if (btn) { btn.textContent = 'Cambiar contrase\u00f1a'; btn.onclick = guardarNuevaPassRecuperacion; }
  setRecMsg('C\u00f3digo correcto. Ingresa tu nueva contrase\u00f1a.', 'green');
}

async function guardarNuevaPassRecuperacion() {
  var p1 = (document.getElementById('rec_pass1')||{}).value;
  var p2 = (document.getElementById('rec_pass2')||{}).value;
  if (!p1 || p1.length < 6) { setRecMsg('La contrase\u00f1a debe tener al menos 6 caracteres', 'red'); return; }
  if (p1 !== p2) { setRecMsg('Las contrase\u00f1as no coinciden', 'red'); return; }
  if (!_recUsuario) return;
  _recUsuario.passwordHash = hashSimple(p1);
  _recUsuario.updatedAt = nowTs();
  await dbPut('usuarios', _recUsuario);
  await logAuditoria('CAMBIO_PASS','usuarios','Contraseña recuperada por: '+_recUsuario.username,{});
  _recCodigo = null; _recUsuario = null; _recExpira = null;
  setRecMsg('\u00a1Contrase\u00f1a actualizada! Inicia sesi\u00f3n.', 'green');
  setTimeout(mostrarLogin, 1500);
}

function setRecMsg(msg, tipo) {
  var el = document.getElementById('rec_msg');
  if (!el) return;
  el.textContent = msg;
  el.style.color = tipo === 'red' ? 'var(--red)' : tipo === 'green' ? 'var(--green)' : 'var(--accent)';
}


async function abrirCambiarPassword() {
  openModal('modal_cambiar_pass', '🔒 Cambiar contraseña',
    '<div class="form-group"><label>Contraseña actual</label><input id="cp_actual" type="password" placeholder="Tu contraseña actual"></div>'
    + '<div class="form-group"><label>Nueva contraseña</label><input id="cp_nueva" type="password" placeholder="Mínimo 6 caracteres"></div>'
    + '<div class="form-group"><label>Confirmar nueva</label><input id="cp_confirm" type="password" placeholder="Repetir nueva contraseña"></div>',
    async function() {
      var actual = (document.getElementById('cp_actual')||{}).value;
      var nueva  = (document.getElementById('cp_nueva')||{}).value;
      var conf   = (document.getElementById('cp_confirm')||{}).value;
      if (!actual || !nueva) { toast('Completa todos los campos','red'); return; }
      if (nueva.length < 6) { toast('Mínimo 6 caracteres','red'); return; }
      if (nueva !== conf) { toast('Las contraseñas no coinciden','red'); return; }
      var user = await dbGet('usuarios', sesionActual.userId);
      if (!user || user.passwordHash !== hashSimple(actual)) { toast('Contraseña actual incorrecta','red'); return; }
      user.passwordHash = hashSimple(nueva);
      user.updatedAt = nowTs();
      await dbPut('usuarios', user);
      await logAuditoria('CAMBIO_PASS','usuarios','Contraseña cambiada por: '+user.username,{});
      toast('Contraseña actualizada ✓');
    }, true
  );
}


/* ================================================================
   ONBOARDING - Primera conexión
   ================================================================ */

/* ================================================================
   SISTEMA MULTI-TALLER - Aislamiento por taller_id
   ================================================================ */

// taller_id: identifica de forma única este taller en este dispositivo
function getTallerId() {
  var id = localStorage.getItem('tpgt_taller_id');
  if (!id) {
    // Generar un ID único basado en el install ID + timestamp
    id = 'T' + getInstallId().replace(/[^A-Z0-9]/g,'').slice(0,8) + Date.now().toString(36).toUpperCase();
    localStorage.setItem('tpgt_taller_id', id);
  }
  return id;
}

// Nombre de la base de datos depende del taller_id → aislamiento total
function getDBName() {
  var tid = localStorage.getItem('tpgt_taller_id');
  return tid ? ('TallerProDB_' + tid) : 'TallerProDB';
}

// Info del taller activo (desde licencia o perfil local)
function getInfoTaller() {
  var lic = licenciaActual;
  var perfil = obtenerPerfilTaller();
  return {
    nombre: (lic && (lic.taller_nombre || lic.taller)) || (perfil && perfil.nombre) || 'Mi Taller',
    nit:    (perfil && perfil.nit)    || '—',
    plan:   (lic && lic.plan)         || 'demo',
    tallerId: getTallerId(),
    licenciaCodigo: lic ? lic.codigo  : null,
    // Corporación: sub_talleres en la licencia
    esCorporacion: lic && lic.sub_talleres && lic.sub_talleres.length > 0,
    subTalleres:   lic && lic.sub_talleres ? lic.sub_talleres : []
  };
}

var TALLER_PROFILE_KEY = 'tpgt_taller_profile';

function obtenerPerfilTaller() {
  try { return JSON.parse(localStorage.getItem(TALLER_PROFILE_KEY)) || null; }
  catch(e) { return null; }
}

function guardarPerfilTaller(perfil) {
  localStorage.setItem(TALLER_PROFILE_KEY, JSON.stringify(perfil));
}

async function mostrarOnboarding() {
  var loginDiv = document.getElementById('login-screen');
  if (!loginDiv) { loginDiv = document.createElement('div'); loginDiv.id='login-screen'; document.body.appendChild(loginDiv); }
  loginDiv.style.display = 'block';
  document.getElementById('app').style.display = 'none';

  loginDiv.innerHTML = `
  <div style="min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:20px">
    <div style="max-width:480px;width:100%">
      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:48px;margin-bottom:12px">⚙️</div>
        <h1 style="font-size:24px;font-weight:800;color:var(--accent)">TallerPro GT</h1>
        <p style="font-size:14px;color:var(--text3);margin-top:6px">Sistema de Gestión para Talleres</p>
      </div>
      <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;padding:28px">
        <div style="font-size:15px;font-weight:600;text-align:center;margin-bottom:20px">¿Es tu primera vez?</div>
        <div style="display:grid;gap:12px">
          <button onclick="mostrarFormNuevoTaller()" style="background:var(--accent);color:#0f0f0f;border:none;border-radius:8px;padding:16px;font-size:15px;font-weight:700;cursor:pointer;text-align:left">
            🏗️ Configurar mi taller nuevo<br>
            <span style="font-size:12px;font-weight:400;opacity:.7">Primera vez usando TallerPro GT</span>
          </button>
          <button onclick="mostrarLogin()" style="background:var(--bg3);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:16px;font-size:15px;font-weight:600;cursor:pointer;text-align:left">
            🔑 Ya tengo cuenta<br>
            <span style="font-size:12px;font-weight:400;opacity:.7">Ingresar a mi taller existente</span>
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function mostrarFormNuevoTaller() {
  var loginDiv = document.getElementById('login-screen');
  loginDiv.innerHTML = `
  <div style="min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:20px">
    <div style="max-width:500px;width:100%">
      <div style="text-align:center;margin-bottom:24px">
        <h2 style="font-size:20px;font-weight:700;color:var(--accent)">🏗️ Configura tu taller</h2>
        <p style="font-size:12px;color:var(--text3);margin-top:4px">Esta información aparecerá en tus facturas y documentos</p>
      </div>
      <div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;padding:28px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div style="grid-column:1/-1"><label style="font-size:12px;color:var(--text2);font-weight:500">Nombre del taller *</label>
            <input id="nt_nombre" placeholder="Taller Mecánico San José" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px;color:var(--text);font-size:14px;outline:none;margin-top:4px"></div>
          <div><label style="font-size:12px;color:var(--text2);font-weight:500">NIT *</label>
            <input id="nt_nit" placeholder="1234567-8" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px;color:var(--text);font-size:14px;outline:none;margin-top:4px"></div>
          <div><label style="font-size:12px;color:var(--text2);font-weight:500">Teléfono</label>
            <input id="nt_tel" placeholder="+502 2222-0000" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px;color:var(--text);font-size:14px;outline:none;margin-top:4px"></div>
          <div style="grid-column:1/-1"><label style="font-size:12px;color:var(--text2);font-weight:500">Dirección</label>
            <input id="nt_dir" placeholder="Zona 1, Ciudad de Guatemala" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px;color:var(--text);font-size:14px;outline:none;margin-top:4px"></div>
          <div><label style="font-size:12px;color:var(--text2);font-weight:500">Email</label>
            <input id="nt_email" type="email" placeholder="taller@email.com" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px;color:var(--text);font-size:14px;outline:none;margin-top:4px"></div>
          <div><label style="font-size:12px;color:var(--text2);font-weight:500">Tipo de taller</label>
            <select id="nt_tipo" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px;color:var(--text);font-size:14px;outline:none;margin-top:4px">
              <option>General / Mecánica</option><option>Especialista diésel</option>
              <option>Electro-mecánica</option><option>Carrocería y pintura</option>
              <option>Llantas y alineación</option><option>Otro</option>
            </select></div>
        </div>
        <div style="border-top:1px solid var(--border);padding-top:16px;margin-top:4px">
          <div style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:10px">👤 Tu usuario administrador</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div><label style="font-size:12px;color:var(--text2)">Tu nombre *</label>
              <input id="nt_admin_nom" placeholder="Tu nombre completo" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px;color:var(--text);font-size:14px;outline:none;margin-top:4px"></div>
            <div><label style="font-size:12px;color:var(--text2)">Usuario *</label>
              <input id="nt_admin_usr" placeholder="admin" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px;color:var(--text);font-size:14px;outline:none;margin-top:4px"></div>
            <div><label style="font-size:12px;color:var(--text2)">Contraseña *</label>
              <input id="nt_admin_pass" type="password" placeholder="Mínimo 6 caracteres" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px;color:var(--text);font-size:14px;outline:none;margin-top:4px"></div>
            <div><label style="font-size:12px;color:var(--text2)">Email del admin</label>
              <input id="nt_admin_email" type="email" placeholder="tu@email.com" style="width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:10px;color:var(--text);font-size:14px;outline:none;margin-top:4px"></div>
          </div>
        </div>
        <div id="nt_error" style="color:var(--red);font-size:12px;text-align:center;margin-top:10px;display:none"></div>
        <button onclick="registrarNuevoTaller()" style="width:100%;background:var(--accent);color:#0f0f0f;border:none;border-radius:8px;padding:13px;font-size:15px;font-weight:700;cursor:pointer;margin-top:16px">
          ✓ Crear mi taller
        </button>
        <div style="text-align:center;margin-top:10px">
          <button onclick="mostrarOnboarding()" style="background:none;border:none;color:var(--text3);font-size:11px;cursor:pointer;text-decoration:underline">← Volver</button>
        </div>
      </div>
    </div>
  </div>`;
}

async function registrarNuevoTaller() {
  var nombre = (document.getElementById('nt_nombre')||{}).value.trim();
  var nit    = (document.getElementById('nt_nit')||{}).value.trim();
  var adminNom = (document.getElementById('nt_admin_nom')||{}).value.trim();
  var adminUsr = (document.getElementById('nt_admin_usr')||{}).value.trim();
  var adminPass= (document.getElementById('nt_admin_pass')||{}).value;
  var errEl = document.getElementById('nt_error');

  if (!nombre || !nit) { errEl.style.display='block'; errEl.textContent='Nombre y NIT del taller son requeridos'; return; }
  if (!adminNom || !adminUsr || !adminPass) { errEl.style.display='block'; errEl.textContent='Completa los datos del administrador'; return; }
  if (adminPass.length < 6) { errEl.style.display='block'; errEl.textContent='La contraseña debe tener al menos 6 caracteres'; return; }

  // Guardar perfil del taller
  var tallerProfile = {
    nombre: nombre,
    nit: nit,
    telefono: (document.getElementById('nt_tel')||{}).value.trim(),
    direccion: (document.getElementById('nt_dir')||{}).value.trim(),
    email: (document.getElementById('nt_email')||{}).value.trim(),
    tipo: (document.getElementById('nt_tipo')||{}).value,
    creadoEn: new Date().toISOString(),
    tallerId: 'taller_' + Date.now()
  };
  guardarPerfilTaller(tallerProfile);
  localStorage.setItem('tpgt_taller_id', tallerProfile.tallerId);
  // Actualizar DB_NAME para usar la nueva DB del taller
  DB_NAME = 'TallerProDB_' + tallerProfile.tallerId;

  // Guardar config del taller en DB
  await dbPut('config', { key:'taller', nombre:nombre, nit:nit,
    telefono:tallerProfile.telefono, direccion:tallerProfile.direccion,
    email:tallerProfile.email, updatedAt:nowTs() });

  // Crear usuario administrador real (no demo)
  await dbAdd('usuarios', {
    nombre: adminNom, username: adminUsr,
    passwordHash: hashSimple(adminPass),
    perfil: 'admin', esDemo: false,
    email: (document.getElementById('nt_admin_email')||{}).value.trim(),
    activo: true, createdAt: nowTs()
  });

  // Eliminar usuario demo si existe
  var todos = await dbGetAll('usuarios');
  var demo = todos.find(function(u){ return u.esDemo && u.username==='demo'; });
  if (demo) await dbDelete('usuarios', demo.id);

  await logAuditoria('CREAR','sistema','Taller registrado: '+nombre,{nit:nit});
  toast('¡Taller creado! Iniciando sesión...');

  // Auto-login con el nuevo admin
  setTimeout(async function() {
    var ses = await loginUsuario(adminUsr, adminPass);
    if (ses) {
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('app').style.display = 'flex';
      await iniciarApp();
    }
  }, 800);
}

async function doLogin(){
  const u=document.getElementById('login_user').value.trim();
  const p=document.getElementById('login_pass').value;
  if(!u||!p){document.getElementById('login_error').style.display='block';return;}
  const ses=await loginUsuario(u,p);
  if(ses&&!ses.error){
    document.getElementById('login-screen').style.display='none';
    document.getElementById('app').style.display='flex';
    await iniciarApp();
    await logAuditoria('LOGIN','sistema','Inicio de sesión: '+u,{});
  }else{
    var errEl=document.getElementById('login_error');
    if(errEl){errEl.textContent=ses&&ses.error?ses.error:'Usuario o contrasena incorrectos';errEl.style.display='block';}
  }
}

/* ---- DATOS DE FABRICANTES Y RECOMENDACIONES ---- */
