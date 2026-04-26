/* TallerPro GT — js/03_auth.js */
/* Generado automáticamente — editar este archivo */

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

async
