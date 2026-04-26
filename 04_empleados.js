/* TallerPro GT — 10_configuracion.js | 2818 líneas */

async function renderConfiguracion(content, actions) {
  if (!soloAdmin()) { content.innerHTML='<div class="alert alert-red">Solo administradores</div>'; return; }
  var cfg   = await dbGet('config','taller') || {};
  var notif = await dbGet('config','notificaciones') || {};
  var logoData = localStorage.getItem('tpgt_logo') || '';
  actions.innerHTML = '<button class="btn btn-primary" onclick="guardarConfigCompleta()">Guardar todo</button> <button class="btn btn-secondary" onclick="resetearBaseDatos()" style="background:var(--red-dim);color:var(--red);border-color:var(--red)">🗑 Reiniciar DB</button>';

  content.innerHTML =
    '<div class="section-title">Configuracion</div>'

    // DATOS EMPRESA
    + '<div class="card"><div class="card-title" style="margin-bottom:14px">Datos de la empresa</div>'
    + '<div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:14px">'
    // Logo
    + '<div style="text-align:center;flex-shrink:0">'
    +   '<div style="width:90px;height:90px;border-radius:10px;border:2px dashed var(--border2);background:var(--bg3);display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:8px">'
    +     '<img id="logo_preview" src="'+(logoData||'')+'" style="max-width:100%;max-height:100%;object-fit:contain;display:'+(logoData?'block':'none')+'">'
    +     '<span id="logo_placeholder" style="font-size:11px;color:var(--text3);'+(logoData?'display:none':'')+'">'
    +       'Sin logo</span>'
    +   '</div>'
    +   '<button class="btn btn-sm btn-secondary" onclick="cargarLogoEmpresa()" style="display:block;width:90px;margin-bottom:4px">Subir logo</button>'
    +   '<button class="btn btn-sm btn-danger" onclick="borrarLogo()" style="display:block;width:90px">Quitar</button>'
    +   '<div class="form-hint" style="width:90px;margin-top:4px">Max 500KB</div>'
    + '</div>'
    // Campos
    + '<div style="flex:1">'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Nombre del taller / empresa *</label><input id="cfg_nombre" value="'+(cfg.nombre||'')+'" placeholder="Nombre completo"></div>'
    + '<div class="form-group"><label>NIT *</label><input id="cfg_nit" value="'+(cfg.nit||'')+'" placeholder="NIT sin guion"></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Telefono</label><input id="cfg_tel" value="'+(cfg.telefono||'')+'" placeholder="+502 2222-3333" onblur="onTelBlur(this)"></div>'
    + '<div class="form-group"><label>Email</label><input id="cfg_email" value="'+(cfg.email||'')+'" placeholder="info@taller.com"></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Direccion</label><input id="cfg_dir" value="'+(cfg.direccion||'')+'" placeholder="Direccion completa, Guatemala"></div>'
    + '<div class="form-group"><label>Pie de pagina en facturas</label><input id="cfg_pie" value="'+(cfg.piePagina||'')+'" placeholder="Gracias por su preferencia"></div>'
    + '</div>'
    + '</div></div>'
    + '</div>'

    // PARAMETROS OPERATIVOS
    + '<div class="card"><div class="card-title" style="margin-bottom:12px">Parametros operativos</div>'
    + '<div class="form-row form-row-3">'
    + '<div class="form-group"><label>Tarifa hora mano de obra (Q)</label><input id="cfg_tarifa" type="number" value="'+(cfg.tarifaHora||150)+'" min="0"></div>'
    + '<div class="form-group"><label>Margen minimo inventario (%)</label><input id="cfg_margen" type="number" value="'+(cfg.margenMin||20)+'" min="0"></div>'
    + '<div class="form-group"><label>Timeout sesion (minutos)</label><input id="cfg_timeout" type="number" value="'+(cfg.timeoutMinutos||15)+'" min="1" max="480"></div>'
    + '</div></div>'

    // NOTIFICACIONES WA
    + '<div class="card"><div class="card-title" style="margin-bottom:12px">Notificaciones WhatsApp &mdash; Numeros de la empresa</div>'
    + '<div class="alert alert-blue" style="font-size:11px">Las alertas urgentes se enviaran a estos numeros. Todos deben tener CallMeBot activado (+34 644 44 00 05).</div>'
    + '<div class="form-row form-row-3">'
    + '<div class="form-group"><label>Gerente / Propietario</label><input id="cfg_gerente" value="'+(notif.numGerente||'')+'" placeholder="+502 5555-0001"></div>'
    + '<div class="form-group"><label>Administrador</label><input id="cfg_admin" value="'+(notif.numAdmin||'')+'" placeholder="+502 5555-0002"></div>'
    + '<div class="form-group"><label>Jefe de Taller</label><input id="cfg_jefe" value="'+(notif.numJefeTaller||'')+'" placeholder="+502 5555-0003"></div>'
    + '</div>'
    + '<div class="form-group"><label><input type="checkbox" id="cfg_envwa" '+(notif.enviarWA?'checked':'')+' style="width:auto;margin-right:6px"> Enviar alertas automaticas por WhatsApp</label></div>'
    + '</div>'

    // TEMA
    + '<div id="tema_wrap_cfg"></div>';

  // Cargar selector de tema
  var tw = document.getElementById('tema_wrap_cfg');
  if (tw) tw.innerHTML = renderSelectorTema();
  // Mostrar placeholder si no hay logo
  var lph = document.getElementById('logo_placeholder');
  if (lph && logoData) lph.style.display = 'none';
  // Agregar sección zona de peligro
  var cfgContent = document.getElementById('main-content') || document.querySelector('.main-content');
  var dangerCard = document.createElement('div');
  dangerCard.className = 'card';
  dangerCard.style.cssText = 'margin-top:12px;border:1px solid rgba(224,90,78,.35)';
  dangerCard.innerHTML = '<div class="card-title" style="color:var(--red)">⚠ Zona de peligro</div>'
    + '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;line-height:1.7">Reinicia la base de datos eliminando todos los datos del taller. La licencia NO se borra.</div>'
    + '<button onclick="mostrarZonaPeligroCfg()" style="background:var(--red);color:#fff;border:none;border-radius:6px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer">🗑 Reiniciar base de datos</button>';
  if (cfgContent) cfgContent.appendChild(dangerCard);
}




function mostrarZonaPeligroCfg() {
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



function _lRowGlobal(l, i) {
  return '<div class="form-row" style="grid-template-columns:2fr 1fr 1fr 1fr auto;gap:6px;margin-bottom:6px" id="lf_r_'+i+'">'
    +'<input placeholder="Descripcion" value="'+(l.desc||'')+'" id="lf_d_'+i+'" oninput="calcTotFac()">'
    +'<input type="number" value="'+(l.qty||1)+'" id="lf_q_'+i+'" step="0.01" min="0" oninput="calcTotFac()">'
    +'<input type="number" value="'+(l.unit||0)+'" id="lf_u_'+i+'" step="0.01" min="0" oninput="calcTotFac()">'
    +'<input type="number" value="'+(l.desc_pct||0)+'" id="lf_p_'+i+'" min="0" max="100" oninput="calcTotFac()">'
    +'<button class="btn btn-sm btn-danger btn-icon" onclick="document.getElementById(\'lf_r_'+i+'\').remove();calcTotFac()" style="margin-top:0">X</button>'
    +'</div>';
}

function addLF() {
  var list = document.getElementById('lf_list');
  if (!list) return;
  var i = list.children.length;
  var fn = window._lRow || _lRowGlobal;
  list.insertAdjacentHTML('beforeend', fn({desc:'',qty:1,unit:0,desc_pct:0}, i));
  calcTotFac();
}


async function guardarConfigCompleta() {
  var nombre = (document.getElementById("cfg_nombre")||{}).value||"";
  if (!nombre.trim()) { toast("El nombre del taller es requerido","red"); return; }
  var cfg = {
    key: "taller",
    nombre:        nombre.trim(),
    nit:           ((document.getElementById("cfg_nit")||{}).value||"").trim(),
    telefono:      ((document.getElementById("cfg_tel")||{}).value||"").trim(),
    email:         ((document.getElementById("cfg_email")||{}).value||"").trim(),
    direccion:     ((document.getElementById("cfg_dir")||{}).value||"").trim(),
    piePagina:     ((document.getElementById("cfg_pie")||{}).value||"").trim(),
    tarifaHora:    parseFloat((document.getElementById("cfg_tarifa")||{}).value||150),
    margenMin:     parseFloat((document.getElementById("cfg_margen")||{}).value||20),
    timeoutMinutos:parseInt((document.getElementById("cfg_timeout")||{}).value||15),
    updatedAt:     nowTs()
  };
  var notif = {
    key:        "notificaciones",
    numGerente: ((document.getElementById("cfg_gerente")||{}).value||"").trim(),
    numAdmin:   ((document.getElementById("cfg_admin")||{}).value||"").trim(),
    numJefeTaller: ((document.getElementById("cfg_jefe")||{}).value||"").trim(),
    enviarWA:   !!(document.getElementById("cfg_envwa")||{}).checked
  };
  await dbPut("config", cfg);
  await dbPut("config", notif);
  // Actualizar nombre en sidebar
  var el = document.getElementById("sidebar-empresa-nombre");
  if (el) el.textContent = cfg.nombre;
  toast("Configuracion guardada correctamente");
}

// ================================================================

/* ================================================================
   MÓDULO POS - PAGOS CON TARJETA
   Visanet GT / Credomatic BAC / PayWay Banrural
   ================================================================ */

// Config de procesadores (se guardan en IndexedDB config/pos)
var POS_PROCESADORES = {
  visanet: {
    nombre: 'Visanet Guatemala',
    logo: '💳',
    color: '#1a1f71',
    instrucciones: 'Requiere afiliación con Visanet GT. Contacta al 1801-VISANET.',
    campos: ['merchantId','terminalId','apiKey'],
    labels: ['Merchant ID','Terminal ID','API Key (sandbox/producción)'],
    sandbox_url: 'https://api-sandbox.visanet.com.gt/v1/payment',
    prod_url: 'https://api.visanet.com.gt/v1/payment'
  },
  credomatic: {
    nombre: 'Credomatic / BAC',
    logo: '🏦',
    color: '#e31837',
    instrucciones: 'Requiere cuenta empresarial BAC Credomatic. Tel: 1550.',
    campos: ['merchantId','apiKey','secretKey'],
    labels: ['Merchant ID','API Key','Secret Key'],
    sandbox_url: 'https://epayment-uat.baccredomatic.com/api/payment',
    prod_url: 'https://epayment.baccredomatic.com/api/payment'
  },
  payway: {
    nombre: 'PayWay Banrural',
    logo: '🌾',
    color: '#006633',
    instrucciones: 'Requiere cuenta empresarial Banrural. Tel: 1500-RURAL.',
    campos: ['commerceCode','terminalId','apiKey'],
    labels: ['Código de Comercio','Terminal ID','API Key'],
    sandbox_url: 'https://sandbox.payway.com.gt/api/v1/charge',
    prod_url: 'https://api.payway.com.gt/v1/charge'
  }
};

async function getPosConfig() {
  return await dbGet('config','pos') || { procesador: 'visanet', ambiente: 'sandbox' };
}

async function guardarConfigPos() {
  var proc = (document.getElementById('pos_procesador')||{}).value || 'visanet';
  var obj = {
    key: 'pos',
    procesador: proc,
    ambiente: (document.getElementById('pos_ambiente')||{}).value || 'sandbox',
    paypalUser: (document.getElementById('pos_paypalUser')||{value:''}).value.trim(),
    merchantId: (document.getElementById('pos_merchantId')||{value:''}).value.trim(),
    terminalId: (document.getElementById('pos_terminalId')||{value:''}).value.trim(),
    apiKey: (document.getElementById('pos_apiKey')||{value:''}).value.trim(),
    secretKey: (document.getElementById('pos_secretKey')||{value:''}).value.trim(),
    commerceCode: (document.getElementById('pos_commerceCode')||{value:''}).value.trim(),
    updatedAt: nowTs()
  };
  await dbPut('config', obj);
  toast('Configuración POS guardada');
}

// ── Procesar pago con tarjeta ────────────────────────────────────
async function procesarPagoTarjeta(monto, descripcion, onExito, onError) {
  var cfg = await getPosConfig();
  var proc = POS_PROCESADORES[cfg.procesador];
  if (!proc) { onError('Procesador no configurado'); return; }
  if (!cfg.apiKey) { 
    toast('Configura el POS en Configuración → POS / Tarjetas', 'red'); 
    return; 
  }

  var url = cfg.ambiente === 'produccion' ? proc.prod_url : proc.sandbox_url;
  var ref = 'TP-' + Date.now();

  // Mostrar modal de procesando
  var overlay = document.createElement('div');
  overlay.id = 'pos_overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;display:flex;align-items:center;justify-content:center';
  overlay.innerHTML = '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:32px;text-align:center;max-width:340px;width:90%">'
    + '<div style="font-size:40px;margin-bottom:12px">' + proc.logo + '</div>'
    + '<div style="font-size:16px;font-weight:700;margin-bottom:6px">' + proc.nombre + '</div>'
    + '<div style="font-size:24px;font-weight:700;color:var(--green);margin-bottom:16px">Q ' + Number(monto).toFixed(2) + '</div>'
    + '<div id="pos_status" style="font-size:13px;color:var(--text2);margin-bottom:20px">Conectando con terminal...</div>'
    + '<div style="display:flex;gap:10px;justify-content:center">'
    + '<button onclick="cancelarPagoTarjeta()" style="background:var(--red-dim);color:var(--red);border:1px solid rgba(224,90,78,.3);border-radius:6px;padding:8px 20px;cursor:pointer;font-size:13px">Cancelar</button>'
    + '</div></div>';
  document.body.appendChild(overlay);

  try {
    // Construir payload según procesador
    var payload = {};
    if (cfg.procesador === 'visanet') {
      payload = {
        merchantId: cfg.merchantId, terminalId: cfg.terminalId,
        amount: Number(monto).toFixed(2), currency: 'GTQ',
        reference: ref, description: descripcion,
        transactionType: 'SALE'
      };
    } else if (cfg.procesador === 'credomatic') {
      payload = {
        merchant_id: cfg.merchantId, amount: Number(monto).toFixed(2),
        currency: 'GTQ', order_id: ref, description: descripcion,
        transaction_type: 'sale'
      };
    } else if (cfg.procesador === 'payway') {
      payload = {
        commerce_code: cfg.commerceCode, terminal_id: cfg.terminalId,
        amount: Number(monto).toFixed(2), currency: 'GTQ',
        reference: ref, description: descripcion
      };
    }

    var upd = document.getElementById('pos_status');
    if (upd) upd.textContent = 'Enviando a terminal POS...';

    // En sandbox: simular respuesta exitosa (los bancos GT requieren integración presencial)
    if (cfg.ambiente === 'sandbox') {
      await new Promise(r => setTimeout(r, 2000)); // simular latencia
      document.body.removeChild(document.getElementById('pos_overlay'));
      onExito({ ref: ref, autorizacion: 'AUTH-' + Math.floor(Math.random()*999999), procesador: proc.nombre, monto: monto });
      return;
    }

    // Producción: llamada real al API
    var headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.apiKey };
    if (cfg.secretKey) headers['X-Secret-Key'] = cfg.secretKey;

    var resp = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) });
    var data = await resp.json();
    document.body.removeChild(document.getElementById('pos_overlay'));

    if (resp.ok && (data.status === 'approved' || data.approved || data.success)) {
      onExito({ ref: ref, autorizacion: data.authorization_code || data.authCode || data.reference, procesador: proc.nombre, monto: monto });
    } else {
      onError(data.message || data.error || 'Pago rechazado. Intenta de nuevo.');
    }
  } catch(e) {
    if (document.getElementById('pos_overlay')) document.body.removeChild(document.getElementById('pos_overlay'));
    onError('Error de conexión con el procesador: ' + e.message);
  }
}

function cancelarPagoTarjeta() {
  var overlay = document.getElementById('pos_overlay');
  if (overlay) document.body.removeChild(overlay);
  toast('Pago con tarjeta cancelado', 'red');
}

// ── Modal de pago en facturación ─────────────────────────────────
async function abrirModalPago(total, facId, onPagado) {
  var cfg = await getPosConfig();
  var proc = POS_PROCESADORES[cfg.procesador] || POS_PROCESADORES.visanet;
  var montoFmt = 'Q ' + Number(total).toFixed(2);
  var cuerpo = '<div style="text-align:center;margin-bottom:20px">'
    + '<div style="font-size:13px;color:var(--text2);margin-bottom:4px">Total a cobrar</div>'
    + '<div style="font-size:32px;font-weight:700;color:var(--green)">' + montoFmt + '</div>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">'
    + '<button onclick="window._doPago(\'efectivo\')" style="background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:16px;cursor:pointer;font-size:13px;color:var(--text)">'
    + '<div style="font-size:28px;margin-bottom:6px">💵</div><div style="font-weight:600">Efectivo</div></button>'
    + '<button onclick="window._doPago(\'tarjeta\')" style="background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:16px;cursor:pointer;font-size:13px;color:var(--text)">'
    + '<div style="font-size:28px;margin-bottom:6px">' + proc.logo + '</div>'
    + '<div style="font-weight:600">Tarjeta</div>'
    + '<div style="font-size:10px;color:var(--text3);margin-top:2px">' + proc.nombre + '</div></button>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'
    + '<button onclick="window._doPago(\'transferencia\')" style="background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:16px;cursor:pointer;font-size:13px;color:var(--text)">'
    + '<div style="font-size:28px;margin-bottom:6px">🏦</div><div style="font-weight:600">Transferencia</div></button>'
    + '<button onclick="window._doPago(\'cheque\')" style="background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:16px;cursor:pointer;font-size:13px;color:var(--text)">'
    + '<div style="font-size:28px;margin-bottom:6px">📄</div><div style="font-weight:600">Cheque</div></button>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + '<button onclick="window._doPago(\'paypal\')" style="background:#003087;border:1px solid #0070ba;border-radius:10px;padding:16px;cursor:pointer;font-size:13px;color:#fff">'
    + '<div style="font-size:22px;font-weight:700;margin-bottom:4px;font-style:italic">PayPal</div><div style="font-size:11px;opacity:.8">Pago en línea</div></button>'
    + '<button onclick="window._doPago(\'googlepay\')" style="background:#1a1a1a;border:1px solid #333;border-radius:10px;padding:16px;cursor:pointer;font-size:13px;color:#fff">'
    + '<div style="font-size:20px;font-weight:700;margin-bottom:4px"><span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC04">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span> Pay</div><div style="font-size:11px;opacity:.6">Tap to pay</div></button>'
    + '</div>';
  window._doPago = async function(forma) {
    cerrarModal('modal_pago');
    if (forma === 'tarjeta') await pagarTarjeta(total, facId);
    else if (forma === 'paypal') await pagarPayPal(total, facId);
    else if (forma === 'googlepay') await pagarGooglePay(total, facId);
    else await registrarPagoFac(facId, total, forma, null);
  };
  window._facPagoCallback = onPagado;
  openModal('modal_pago', 'Registrar pago', cuerpo, function(){}, false);
}


async function pagarEfectivo(total, facId) {
  cerrarModal('modal_pago');
  await registrarPagoFac(facId, total, 'efectivo', null);
}

async function pagarTransferencia(total, facId) {
  cerrarModal('modal_pago');
  await registrarPagoFac(facId, total, 'transferencia', null);
}

async function pagarCheque(total, facId) {
  cerrarModal('modal_pago');
  await registrarPagoFac(facId, total, 'cheque', null);
}

async function pagarTarjeta(total, facId) {
  cerrarModal('modal_pago');
  await procesarPagoTarjeta(total, 'Pago factura TallerPro',
    async function(resultado) {
      toast('✓ Pago aprobado — Auth: ' + resultado.autorizacion + ' vía ' + resultado.procesador);
      await registrarPagoFac(facId, total, 'tarjeta', resultado);
    },
    function(error) {
      toast(error, 'red');
    }
  );
}


async function pagarPayPal(total, facId) {
  // Abrir PayPal.me o link de pago configurado
  var cfg = await getPosConfig();
  var paypalUser = cfg.paypalUser || '';
  if (!paypalUser) {
    toast('Configura tu usuario de PayPal en POS / Tarjetas', 'amber');
    return;
  }
  var url = 'https://www.paypal.me/' + paypalUser + '/' + Number(total).toFixed(2) + 'GTQ';
  window.open(url, '_blank');
  // Marcar como pendiente de confirmación
  openModal('confirm_paypal', 'Confirmar pago PayPal',
    '<div class="alert alert-blue">Se abrió PayPal. ¿Ya se completó el pago?</div>',
    null, false);
  setTimeout(function() {
    var f = document.querySelector('#confirm_paypal .modal-footer');
    if (f) f.innerHTML = '<button class="btn btn-secondary" onclick="cerrarModal(\'confirm_paypal\')">No, cancelar</button>'
      + '<button class="btn btn-primary" onclick="cerrarModal(\'confirm_paypal\');registrarPagoFac(\''+facId+'\','+total+',\'paypal\',null)">Sí, pago recibido</button>';
  }, 50);
}

async function pagarGooglePay(total, facId) {
  // Google Pay requiere integración con un PSP (Stripe, etc.)
  // Por ahora mostrar instrucciones
  openModal('info_gpay', 'Google Pay', 
    '<div class="alert alert-blue" style="margin-bottom:12px">Google Pay requiere integración con un procesador de pagos (Stripe o PaymentRequest API).</div>'
    + '<div style="font-size:12px;color:var(--text2);line-height:1.8">'
    + '<strong>Para activarlo necesitas:</strong><br>'
    + '1. Cuenta en Stripe (stripe.com) — disponible en GT<br>'
    + '2. API keys de Stripe en configuración POS<br>'
    + '3. Activar Google Pay en tu cuenta Stripe<br><br>'
    + 'Mientras tanto puedes usar Tarjeta o Transferencia.</div>',
    null, false);
}

async function registrarPagoFac(facId, total, forma, posData) {
  if (!facId) return;
  var fac = await dbGet('facturas', parseInt(facId));
  if (!fac) return;
  fac.pagada = true;
  fac.formaPago = forma;
  fac.fechaPago = today();
  if (posData) {
    fac.posAutorizacion = posData.autorizacion;
    fac.posProcesador = posData.procesador;
    fac.posRef = posData.ref;
  }
  await dbPut('facturas', fac);
  toast('Factura marcada como pagada ✓');
  if (window._facPagoCallback) window._facPagoCallback();
  await navTo('facturacion');
}

// ── Render configuración POS ─────────────────────────────────────
async function renderConfigPos(content, actions) {
  var cfg = await getPosConfig();
  actions.innerHTML = '<button class="btn btn-primary" onclick="guardarConfigPos()">Guardar configuración</button>';
  var proc = cfg.procesador || 'visanet';

  content.innerHTML = '<div class="section-title">POS / Pagos con tarjeta</div>'
    + '<div class="section-sub">Configura tu procesador de pagos para cobrar con tarjeta de crédito o débito</div>'
    + '<div class="card">'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Procesador de pagos</label>'
    + '<select id="pos_procesador" onchange="recargarFormPos()">'
    + Object.entries(POS_PROCESADORES).map(function(e){ return '<option value="'+e[0]+'"'+(proc===e[0]?' selected':'')+'>'+e[1].logo+' '+e[1].nombre+'</option>'; }).join('')
    + '</select></div>'
    + '<div class="form-group"><label>Ambiente</label>'
    + '<select id="pos_ambiente">'
    + '<option value="sandbox"'+(cfg.ambiente==='sandbox'?' selected':'')+'>🧪 Sandbox (pruebas)</option>'
    + '<option value="produccion"'+(cfg.ambiente==='produccion'?' selected':'')+'>🚀 Producción (real)</option>'
    + '</select></div>'
    + '</div>'
    + '<div class="alert alert-blue" style="font-size:11px">' + (POS_PROCESADORES[proc]||POS_PROCESADORES.visanet).instrucciones + '</div>'
    + '<div id="pos_campos_wrap">' + renderCamposPos(proc, cfg) + '</div>'
    + '</div>'
    + '<div class="card"><div class="card-title" style="margin-bottom:10px">¿Cómo funciona?</div>'
    + '<div style="font-size:12px;color:var(--text2);line-height:1.8">'
    + '1. En <strong>Sandbox</strong> los pagos son simulados — úsalo para probar.<br>'
    + '2. En <strong>Producción</strong> se conecta al API real del banco — requiere afiliación activa.<br>'
    + '3. Al registrar una factura aparece el botón <strong>Cobrar</strong> con opción de tarjeta.<br>'
    + '4. El sistema guarda el código de autorización en la factura automáticamente.</div>'
    + '</div>';
}

function renderCamposPos(proc, cfg) {
  var p = POS_PROCESADORES[proc] || POS_PROCESADORES.visanet;
  return p.campos.map(function(campo, i) {
    return '<div class="form-group"><label>'+p.labels[i]+'</label>'
      + '<input id="pos_'+campo+'" value="'+(cfg[campo]||'')+'" placeholder="'+p.labels[i]+'" type="'+(campo.toLowerCase().includes('key')||campo.toLowerCase().includes('secret')?'password':'text')+'">'
      + '</div>';
  }).join('');
}

function recargarFormPos() {
  var proc = (document.getElementById('pos_procesador')||{}).value || 'visanet';
  var wrap = document.getElementById('pos_campos_wrap');
  if (wrap) wrap.innerHTML = renderCamposPos(proc, {});
}

// MODULO A: Creacion inline, Envios, Cotizador, Budget, Flota Dashboard
// ================================================================

// ---- HELPER: MODAL RAPIDO PARA CREAR REGISTRO SIN SALIR ----
// Usado en formularios que necesitan cliente/proveedor/empleado no existente

async function crearClienteInline(onCreado) {
  openModal('cli_inline','Nuevo Cliente (rapido)',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Nombre *</label><input id="ci_nom" placeholder="Nombre completo"></div>'
    +'<div class="form-group"><label>NIT</label><input id="ci_nit" placeholder="CF"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Telefono</label><input id="ci_tel" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>'
    +'<div class="form-group"><label>WhatsApp</label><input id="ci_wa" placeholder="+502 5555-0000"></div>'
    +'</div>'
    +'<div class="form-group"><label>Email</label><input id="ci_email" type="email"></div>',
    async function(){
      var nom=document.getElementById('ci_nom').value.trim();
      if(!nom){toast('Nombre requerido','red');return;}
      var id=await dbAdd('clientes',{nombre:nom,nit:document.getElementById('ci_nit').value.trim()||'CF',
        telefono:document.getElementById('ci_tel').value.trim(),
        whatsapp:document.getElementById('ci_wa').value.trim(),
        email:document.getElementById('ci_email').value.trim(),
        tipo:'persona',createdAt:nowTs()});
      cerrarModal('cli_inline');
      toast('Cliente creado');
      if(onCreado) onCreado({id:id,nombre:nom});
    },true);
}

async function crearProveedorInline(onCreado) {
  openModal('prov_inline','Nuevo Proveedor (rapido)',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Empresa *</label><input id="pi_emp" placeholder="Nombre de la empresa"></div>'
    +'<div class="form-group"><label>NIT</label><input id="pi_nit" placeholder="NIT"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Contacto</label><input id="pi_con" placeholder="Vendedor"></div>'
    +'<div class="form-group"><label>Telefono</label><input id="pi_tel" placeholder="+502 2222-3333" onblur="onTelBlur(this)"></div>'
    +'</div>',
    async function(){
      var emp=document.getElementById('pi_emp').value.trim();
      if(!emp){toast('Nombre requerido','red');return;}
      var id=await dbAdd('proveedores',{empresa:emp,nit:document.getElementById('pi_nit').value.trim(),
        contacto:document.getElementById('pi_con').value.trim(),
        telefono:document.getElementById('pi_tel').value.trim(),
        categoria:'General',calificacion:'0',createdAt:nowTs()});
      cerrarModal('prov_inline');
      toast('Proveedor creado');
      if(onCreado) onCreado({id:id,empresa:emp});
    },true);
}

async function crearEmpleadoInline(onCreado) {
  openModal('emp_inline','Nuevo Empleado (rapido)',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Nombre *</label><input id="ei_nom" placeholder="Nombre completo"></div>'
    +'<div class="form-group"><label>Cargo</label><input id="ei_car" placeholder="Mecanico, Auxiliar..."></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Salario base (Q)</label><input id="ei_sal" type="number" value="4002.28" step="0.01"></div>'
    +'<div class="form-group"><label>Circunscripcion</label>'
    +'<select id="ei_ce"><option value="CE1">CE1 - Depto. Guatemala</option><option value="CE2">CE2 - Resto</option></select>'
    +'</div></div>',
    async function(){
      var nom=document.getElementById('ei_nom').value.trim();
      if(!nom){toast('Nombre requerido','red');return;}
      var id=await dbAdd('empleados',{nombre:nom,cargo:document.getElementById('ei_car').value.trim(),
        salarioBase:parseFloat(document.getElementById('ei_sal').value)||4002.28,
        circunscripcion:document.getElementById('ei_ce').value,
        activo:true,fechaIngreso:today(),createdAt:nowTs()});
      cerrarModal('emp_inline');
      toast('Empleado creado');
      if(onCreado) onCreado({id:id,nombre:nom});
    },true);
}

// Helper para agregar boton "+ Nuevo" junto a un select
function selectConBotonNuevo(selectEl, tipo, callback) {
  if(!selectEl) return;
  var btn=document.createElement('button');
  btn.type='button';
  btn.className='btn btn-sm btn-secondary';
  btn.style.cssText='padding:4px 8px;font-size:11px;margin-top:4px';
  btn.textContent='+ Nuevo '+tipo;
  btn.onclick=function(e){
    e.preventDefault();
    if(tipo==='cliente') crearClienteInline(function(nuevo){
      var opt=document.createElement('option');
      opt.value=nuevo.id;opt.textContent=nuevo.nombre;opt.selected=true;
      selectEl.appendChild(opt);
      if(callback) callback(nuevo);
    });
    else if(tipo==='proveedor') crearProveedorInline(function(nuevo){
      var opt=document.createElement('option');
      opt.value=nuevo.id;opt.textContent=nuevo.empresa;opt.selected=true;
      selectEl.appendChild(opt);
      if(callback) callback(nuevo);
    });
    else if(tipo==='empleado') crearEmpleadoInline(function(nuevo){
      var opt=document.createElement('option');
      opt.value=nuevo.id;opt.textContent=nuevo.nombre;opt.selected=true;
      selectEl.appendChild(opt);
      if(callback) callback(nuevo);
    });
  };
  selectEl.parentNode.appendChild(btn);
}

// Agregar botones inline despues de que el modal se renderiza
function agregarBotonesInline(config) {
  // config = [{selectId:'f_cliente', tipo:'cliente'}, ...]
  setTimeout(function(){
    config.forEach(function(c){
      var sel=document.getElementById(c.selectId);
      if(sel) selectConBotonNuevo(sel,c.tipo,c.callback);
    });
  },150);
}

// ---- INSUMOS: AGREGAR CAMPO PROVEEDOR ----
async function modalInsumo(id) {
  var ins = id ? await dbGet('insumos',id) : {};
  var provs = await dbGetAll('proveedores');
  var cats=['Aceites','Refrigerantes','Quimicos','Consumibles','Limpieza','Lubricantes','Filtros','Otro'];
  var provOpts='<option value="">Sin proveedor</option>'
    +provs.map(function(p){return '<option value="'+p.id+'"'+(ins.proveedorId===p.id?' selected':'')+'>'+p.empresa+'</option>';}).join('');

  openModal('ins_m', id?'Editar Insumo':'Nuevo Insumo',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Nombre *</label><input id="in_n" value="'+(ins.nombre||'')+'" placeholder="Aceite 20W-50 Sintetico"></div>'
    +'<div class="form-group"><label>Categoria</label><select id="in_ca">'+cats.map(function(c){return '<option value="'+c+'"'+(ins.categoria===c?' selected':'')+'>'+c+'</option>';}).join('')+'</select></div>'
    +'</div>'
    +'<div class="form-row form-row-3">'
    +'<div class="form-group"><label>Stock actual</label><input id="in_st" type="number" value="'+(ins.stock||0)+'" min="0"></div>'
    +'<div class="form-group"><label>Stock minimo</label><input id="in_sm" type="number" value="'+(ins.stockMin||5)+'" min="0"></div>'
    +'<div class="form-group"><label>Unidad</label><input id="in_u" value="'+(ins.unidad||'litro')+'" placeholder="litro, galon..."></div>'
    +'</div>'
    +'<div class="form-row form-row-3">'
    +'<div class="form-group"><label>Precio compra (Q)</label><input id="in_co" type="number" value="'+(ins.costo||0)+'" step="0.01" oninput="calcMargIns2()"></div>'
    +'<div class="form-group"><label>Precio venta (Q)</label><input id="in_pr" type="number" value="'+(ins.precio||0)+'" step="0.01" oninput="calcMargIns2()"></div>'
    +'<div class="form-group"><label>Margen</label><input id="in_ma" readonly style="background:var(--bg4)"></div>'
    +'</div>'
    +'<div class="form-group"><label>Proveedor</label>'
    +'<select id="in_pv">'+provOpts+'</select></div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Tiene caducidad</label><select id="in_tc" onchange="togCadI2()"><option value="no"'+(ins.fechaCaducidad?'':' selected')+'>No caduca</option><option value="si"'+(ins.fechaCaducidad?' selected':'')+'>Si</option></select></div>'
    +'<div id="in_cw2" style="display:'+(ins.fechaCaducidad?'block':'none')+'"><div class="form-group"><label>Fecha caducidad</label><input id="in_ca2" type="date" value="'+(ins.fechaCaducidad||'')+'"></div></div>'
    +'</div>',
    async function(){
      var nom=document.getElementById('in_n').value.trim();
      if(!nom){toast('Nombre requerido','red');return;}
      var cos=$n('in_co'),pre=$n('in_pr');
      var mar=pre>0&&cos>0?(pre-cos)/pre:0;
      var pId=parseInt(document.getElementById('in_pv').value)||null;
      var provE=provs.find(function(p){return p.id===pId;});
      var obj={nombre:nom,categoria:$v('in_ca'),stock:parseInt($v('in_st'))||0,stockMin:parseInt($v('in_sm'))||5,
        unidad:$v('in_u'),costo:cos,precio:pre,margen:mar,
        proveedorId:pId,proveedor:provE?provE.empresa:'',
        fechaCaducidad:$v('in_tc')==='si'?$v('in_ca2'):null,tipo:'insumo',updatedAt:nowTs()};
      if(id){obj.id=id;await dbPut('insumos',obj);}else{obj.createdAt=nowTs();await dbAdd('insumos',obj);}
      cerrarModal('ins_m');toast(id?'Actualizado':'Registrado');await navTo('insumos');
    },true);
  setTimeout(function(){
    calcMargIns2();
    var sel=document.getElementById('in_pv');
    if(sel) selectConBotonNuevo(sel,'proveedor');
  },100);
}

function calcMargIns2(){var c=$n('in_co'),p=$n('in_pr'),el=document.getElementById('in_ma');if(!el)return;if(p>0&&c>0){var m=((p-c)/p)*100;el.value=m.toFixed(1)+'%';el.style.color=m<20?'var(--red)':m<35?'var(--accent)':'var(--green)';}else el.value='---';}
function togCadI2(){var v=$v('in_tc'),w=document.getElementById('in_cw2');if(w)w.style.display=v==='si'?'block':'none';}

// ---- MODULO: ENVIOS ----

function toggleMensajeroEnvio() {
  var tipo = (document.getElementById('ev_tip_mens')||{}).value;
  var propio = document.getElementById('env_propio_wrap');
  var externo = document.getElementById('env_externo_wrap');
  if (propio) propio.style.display = tipo === 'propio' ? 'block' : 'none';
  if (externo) externo.style.display = tipo === 'externo' ? 'block' : 'none';
}

async function crearClienteRapidoVeh() {
  var nombre = prompt('Nombre del cliente:');
  if (!nombre || !nombre.trim()) return;
  var nit = prompt('NIT (o CF):') || 'CF';
  var tel = prompt('Teléfono:') || '';
  var id = await dbAdd('clientes', {
    nombre: nombre.trim(), nit: nit.trim(), telefono: tel.trim(),
    tipo: 'persona', createdAt: nowTs(), updatedAt: nowTs()
  });
  await logAuditoria('CREAR','clientes','Cliente creado rápido desde vehículo: '+nombre,{});
  toast('Cliente creado. Selecciónalo en la lista.');
  var sel = document.getElementById('v_cliente');
  if (sel) {
    var opt = document.createElement('option');
    opt.value = id; opt.textContent = nombre.trim(); opt.selected = true;
    sel.appendChild(opt);
  }
}

async function renderEnvios(content, actions) {
  var envios = await dbGetAll('envios');
  envios.sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;});
  actions.innerHTML='<button class="btn btn-primary" onclick="modalEnvio()">+ Nuevo envio</button>';

  var transportistas=[{k:'guatex',l:'Guatex'},{k:'cargo_expreso',l:'Cargo Expreso'},{k:'a_forza',l:'A Forza'},{k:'interrapidisimo',l:'Interrapidisimo'},{k:'propio',l:'Mensajero propio'},{k:'otro',l:'Otro'}];
  var colores={pendiente:'amber',en_transito:'blue',entregado:'green',devuelto:'red'};

  var resumen={pendiente:0,en_transito:0,entregado:0,devuelto:0};
  envios.forEach(function(e){if(resumen[e.estado]!==undefined)resumen[e.estado]++;});

  var rows=envios.map(function(e){
    var tc=transportistas.find(function(t){return t.k===e.transportista;})||{l:e.transportista||'---'};
    return '<tr>'
      +'<td class="td-mono" style="font-size:10px">'+(e.noGuia||'---')+'</td>'
      +'<td>'+fechaLegible(e.fecha)+'</td>'
      +'<td><span class="badge badge-gray">'+tc.l+'</span></td>'
      +'<td>'+(e.tipoEnvio==='domicilio'?'<span class="badge badge-blue">Domicilio</span>':'<span class="badge badge-gray">Bodega</span>')+'</td>'
      +'<td style="font-size:11px">'+(e.destinatario||'---')+'</td>'
      +'<td style="font-size:11px">'+(e.clienteNombre||'---')+'</td>'
      +'<td class="td-mono">Q '+(e.costoEnvio||0).toFixed(2)+'</td>'
      +'<td><span class="badge badge-'+(colores[e.estado]||'gray')+'">'+(e.estado||'pendiente')+'</span></td>'
      +'<td><div class="flex gap-1">'
      +'<button class="btn btn-sm btn-secondary" onclick="modalEnvio('+e.id+')">Ver/Editar</button>'
      +'</div></td></tr>';
  }).join('');

  content.innerHTML='<div class="section-title">Modulo de Envios</div>'
    +'<div class="section-sub">Traslados entre bodegas y envios a domicilio de clientes</div>'
    +'<div class="stat-grid">'
    +'<div class="stat-card stat-amber"><div class="stat-label">Pendientes</div><div class="stat-value">'+resumen.pendiente+'</div></div>'
    +'<div class="stat-card stat-blue"><div class="stat-label">En transito</div><div class="stat-value">'+resumen.en_transito+'</div></div>'
    +'<div class="stat-card stat-green"><div class="stat-label">Entregados</div><div class="stat-value">'+resumen.entregado+'</div></div>'
    +'<div class="stat-card stat-red"><div class="stat-label">Devueltos</div><div class="stat-value">'+resumen.devuelto+'</div></div>'
    +'</div>'
    +'<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    +'<thead><tr><th>No. Guia</th><th>Fecha</th><th>Transportista</th><th>Tipo</th><th>Destinatario</th><th>Cliente</th><th>Costo</th><th>Estado</th><th>Acciones</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="9" class="text-center text-muted" style="padding:16px">Sin envios registrados</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

async function modalEnvio(id) {
  var e = id ? await dbGet('envios',id) : {};
  var clientes = await dbGetAll('clientes');
  var repuestos = await dbGetAll('repuestos');
  var insumos   = await dbGetAll('insumos');
  var productos = repuestos.concat(insumos);
  var cliOpts='<option value="">Sin cliente</option>'+clientes.map(function(c){return '<option value="'+c.id+'"'+(e.clienteId===c.id?' selected':'')+'>'+c.nombre+'</option>';}).join('');
  var transportistas=['guatex','cargo_expreso','a_forza','interrapidisimo','propio','otro'];
  var transportLabels={guatex:'Guatex',cargo_expreso:'Cargo Expreso',a_forza:'A Forza',interrapidisimo:'Interrapidisimo',propio:'Mensajero propio',otro:'Otro'};
  var transOpts=transportistas.map(function(t){return '<option value="'+t+'"'+(e.transportista===t?' selected':'')+'>'+transportLabels[t]+'</option>';}).join('');
  var items=e.items||[{productoId:'',cantidad:1,descripcion:''}];

  openModal('env_m',id?'Editar Envio':'Nuevo Envio',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Tipo de envio *</label>'
    +'<select id="ev_tipo"><option value="domicilio"'+(e.tipoEnvio==='domicilio'||!e.tipoEnvio?' selected':'')+'>Envio a domicilio (cliente)</option>'
    +'<option value="bodega"'+(e.tipoEnvio==='bodega'?' selected':'')+'>Traslado entre bodegas</option></select></div>'
    +'<div class="form-group"><label>Transportista *</label><select id="ev_trans">'+transOpts+'</select></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>No. de guia</label><input id="ev_guia" value="'+(e.noGuia||'')+'" placeholder="Numero de guia del transportista"></div>'
    +'<div class="form-group"><label>Estado</label>'
    +'<select id="ev_est"><option value="pendiente"'+(e.estado==='pendiente'||!e.estado?' selected':'')+'>Pendiente</option>'
    +'<option value="en_transito"'+(e.estado==='en_transito'?' selected':'')+'>En transito</option>'
    +'<option value="entregado"'+(e.estado==='entregado'?' selected':'')+'>Entregado</option>'
    +'<option value="devuelto"'+(e.estado==='devuelto'?' selected':'')+'>Devuelto</option></select></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Fecha de envio *</label><input id="ev_fec" type="date" value="'+(e.fecha||today())+'"></div>'
    +'<div class="form-group"><label>Fecha/hora estimada de entrega</label><input id="ev_fent" type="datetime-local" value="'+(e.fechaEntrega||'')+'"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Quien envia</label><input id="ev_env" value="'+(e.quienEnvia||'')+'" placeholder="Nombre del remitente"></div>'
    +'<div class="form-group"><label>Destinatario *</label><input id="ev_dest" value="'+(e.destinatario||'')+'" placeholder="Nombre completo"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Direccion de entrega</label><input id="ev_dir" value="'+(e.direccionEntrega||'')+'" placeholder="Direccion completa"></div>'
    +'<div class="form-group"><label>Telefono destinatario</label><input id="ev_tel" value="'+(e.telefonoDestinatario||'')+'" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Cliente (si aplica)</label><select id="ev_cli">'+cliOpts+'</select></div>'
    +'<div class="form-group"><label>No. Factura relacionada</label><input id="ev_fac" value="'+(e.noFactura||'')+'" placeholder="FAC-001"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Costo del envio (Q)</label><input id="ev_cost" type="number" value="'+(e.costoEnvio||'')+'" step="0.01" placeholder="0.00"></div>'
    +'<div class="form-group"><label>Tipo de servicio contratado</label>'
    +'<select id="ev_srv"><option value="estandar"'+(e.tipoServicioEnvio==='estandar'?' selected':'')+'>Estandar</option>'
    +'<option value="express"'+(e.tipoServicioEnvio==='express'?' selected':'')+'>Express / Urgente</option>'
    +'<option value="programado"'+(e.tipoServicioEnvio==='programado'?' selected':'')+'>Programado</option>'
    +'<option value="puerta_a_puerta"'+(e.tipoServicioEnvio==='puerta_a_puerta'?' selected':'')+'>Puerta a puerta</option></select></div>'
    +'</div>'
    +'<div class="form-group"><label>Descripcion del contenido</label><textarea id="ev_desc" style="min-height:60px" placeholder="Repuestos, insumos, documentos...">'+(e.descripcion||'')+'</textarea></div>'
    +'<div class="form-group"><label>Observaciones</label><input id="ev_obs" value="'+(e.observaciones||'')+'" placeholder="Instrucciones especiales, fragil, etc."></div>',
    async function(){
      var dest=document.getElementById('ev_dest').value.trim();
      if(!dest){toast('Destinatario requerido','red');return;}
      var cliId=parseInt(document.getElementById('ev_cli').value)||null;
      var cli=clientes.find(function(c){return c.id===cliId;});
      var tipoMens = $v('ev_tip_mens') || 'propio';
      var costoExt = parseFloat((document.getElementById('ev_costo_ext')||{}).value)||0;
      if (tipoMens === 'externo' && costoExt > 0) {
        await dbAdd('costos', {
          fecha: today(), tipo: 'Mensajería externa',
          descripcion: 'Servicio de mensajería: ' + ($v('ev_trans')||'externo'),
          monto: costoExt, categoria: 'Logística', pagado: true,
          createdAt: nowTs(), updatedAt: nowTs()
        });
      }
      var obj={tipoMensajero:tipoMens,
        mensajeroNombre:$v('ev_mens_nom'),mensajeroTel:$v('ev_mens_tel'),
        costoExterno:costoExt,
        tipoEnvio:$v('ev_tipo'),transportista:$v('ev_trans'),noGuia:$v('ev_guia').trim(),
        estado:$v('ev_est'),fecha:$v('ev_fec'),fechaEntrega:$v('ev_fent'),
        quienEnvia:$v('ev_env').trim(),destinatario:dest,direccionEntrega:$v('ev_dir').trim(),
        telefonoDestinatario:$v('ev_tel').trim(),clienteId:cliId,clienteNombre:cli?cli.nombre:'',
        noFactura:$v('ev_fac').trim(),costoEnvio:parseFloat($v('ev_cost'))||0,
        tipoServicioEnvio:$v('ev_srv'),descripcion:$v('ev_desc').trim(),
        observaciones:$v('ev_obs').trim(),updatedAt:nowTs()};
      if(id){obj.id=id;await dbPut('envios',obj);}else{obj.createdAt=nowTs();await dbAdd('envios',obj);}
      cerrarModal('env_m');toast(id?'Envio actualizado':'Envio registrado');await navTo('envios');
    },true);
  agregarBotonesInline([{selectId:'ev_cli',tipo:'cliente'}]);
}

// ---- MODULO: COTIZADOR ----
var SERVICIOS_EXTRA=[
  {id:'alarma',label:'Instalacion de alarma',precioBase:350,horas:3},
  {id:'gps',label:'Instalacion GPS',precioBase:280,horas:2},
  {id:'camaras',label:'Camaras de reversa / 360',precioBase:450,horas:4},
  {id:'central_lock',label:'Central lock',precioBase:200,horas:2},
  {id:'pantalla',label:'Pantalla inteligente / multimedia',precioBase:600,horas:4},
  {id:'neblineras',label:'Neblineras',precioBase:300,horas:2},
  {id:'luces_led',label:'Luces LED (faros, interior)',precioBase:250,horas:2},
  {id:'scaneo',label:'Scaneo / diagnostico electronico',precioBase:150,horas:1},
  {id:'lavado',label:'Lavado y encerado',precioBase:120,horas:2},
  {id:'limpieza',label:'Limpieza general interior',precioBase:180,horas:2},
  {id:'pulido',label:'Pulido de pintura',precioBase:400,horas:4},
  {id:'otro',label:'Servicio personalizado',precioBase:0,horas:1},
];

async function renderCotizador(content, actions) {
  var cotizaciones=await dbGetAll('cotizaciones');
  cotizaciones.sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;});
  actions.innerHTML='<button class="btn btn-primary" onclick="modalCotizacion()">+ Nueva cotizacion</button>';

  var rows=cotizaciones.map(function(c){
    return '<tr>'
      +'<td class="td-mono">'+(c.noCotizacion||'#'+c.id)+'</td>'
      +'<td>'+fechaLegible(c.fecha)+'</td>'
      +'<td>'+(c.clienteNombre||'---')+'</td>'
      +'<td style="font-size:11px">'+(c.placa||'---')+'</td>'
      +'<td style="font-size:11px">'+(c.servicios||[]).length+' servicios</td>'
      +'<td class="td-mono text-green">Q '+(c.totalConIVA||0).toFixed(2)+'</td>'
      +'<td><span class="badge badge-'+(c.estado==='aprobada'?'green':c.estado==='rechazada'?'red':'amber')+'">'+(c.estado||'pendiente')+'</span></td>'
      +'<td><div class="flex gap-1">'
      +'<button class="btn btn-sm btn-secondary" onclick="imprimirCotizacion('+c.id+')">Imprimir</button>'
      +'<button class="btn btn-sm btn-blue" onclick="cotizacionAOrden('+c.id+')">-> OT</button>'
      +'<button class="btn btn-sm btn-secondary" onclick="modalCotizacion('+c.id+')">Editar</button>'
      +'</div></td></tr>';
  }).join('');

  content.innerHTML='<div class="section-title">Cotizador de Servicios</div>'
    +'<div class="section-sub">Genera cotizaciones para servicios extras y accesorios</div>'
    +'<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    +'<thead><tr><th>No.</th><th>Fecha</th><th>Cliente</th><th>Placa</th><th>Servicios</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="8" class="text-center text-muted" style="padding:16px">Sin cotizaciones</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

async function modalCotizacion(id) {
  var cot=id?await dbGet('cotizaciones',id):{};
  var nuevoNoCOT = id ? (cot.noCotizacion||'') : await generarNumeroCOT();
  var clientes=await dbGetAll('clientes');
  var vehiculos=await dbGetAll('vehiculos');
  var cfg=await dbGet('config','taller')||{};
  var tarifaHora=cfg.tarifaHora||150;
  var cliOpts='<option value="">Seleccionar...</option>'+clientes.map(function(c){return '<option value="'+c.id+'"'+(cot.clienteId===c.id?' selected':'')+'>'+c.nombre+'</option>';}).join('');
  var vehOpts='<option value="">Seleccionar...</option>'+vehiculos.map(function(v){return '<option value="'+v.id+'"'+(cot.vehiculoId===v.id?' selected':'')+'>'+v.placa+' - '+v.marca+' '+v.modelo+'</option>';}).join('');
  var serviciosSelec=cot.servicios||[];

  openModal('cot_m',id?'Editar Cotizacion':'Nueva Cotizacion',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>No. cotizacion</label><input id="ct_no" value="'+(cot.noCotizacion||nuevoNoCOT)+'"></div>'
    +'<div class="form-group"><label>Fecha</label><input id="ct_fe" type="date" value="'+(cot.fecha||today())+'"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Cliente *</label><select id="ct_cli">'+cliOpts+'</select></div>'
    +'<div class="form-group"><label>Vehiculo</label><select id="ct_veh">'+vehOpts+'</select></div>'
    +'</div>'
    +'<div class="form-group"><label>Tarifa mano de obra (Q/hr)</label><input id="ct_tar" type="number" value="'+tarifaHora+'" step="0.01" oninput="calcTotCot()"></div>'
    +'<div class="card-title" style="margin-bottom:8px;margin-top:4px">Servicios a cotizar</div>'
    +'<div style="display:grid;gap:6px">'
    +SERVICIOS_EXTRA.map(function(s){
      var sel=serviciosSelec.find(function(x){return x.id===s.id;});
      return '<div style="background:var(--bg3);border-radius:6px;padding:8px 10px;display:flex;align-items:center;gap:10px">'
        +'<input type="checkbox" value="'+s.id+'" class="srv_cb" style="width:auto" onchange="calcTotCot()"'+(sel?' checked':'')+'>'
        +'<span style="flex:1;font-size:12px">'+s.label+'</span>'
        +'<input type="number" id="srv_p_'+s.id+'" value="'+(sel?sel.precio:s.precioBase)+'" step="0.01" min="0" style="width:100px;text-align:right;font-size:12px" placeholder="Precio Q" oninput="calcTotCot()">'
        +'<input type="number" id="srv_h_'+s.id+'" value="'+(sel?sel.horas:s.horas)+'" min="0.5" step="0.5" style="width:60px;text-align:center;font-size:12px" placeholder="Hrs" oninput="calcTotCot()">'
        +'</div>';
    }).join('')
    +'</div>'
    +'<div class="form-group mt-2"><label>Notas adicionales</label><textarea id="ct_obs" style="min-height:50px">'+(cot.notas||'')+'</textarea></div>'
    +'<div id="cot_tots" style="text-align:right;margin-top:10px"></div>',
    async function(){
      var cliId=parseInt($v('ct_cli'));
      if(!cliId){toast('Cliente requerido','red');return;}
      var cli=clientes.find(function(c){return c.id===cliId;});
      var vehId=parseInt($v('ct_veh'))||null;
      var veh=vehiculos.find(function(v){return v.id===vehId;});
      var tar=$n('ct_tar',150);
      var servicios=[];
      document.querySelectorAll('.srv_cb:checked').forEach(function(cb){
        var sid=cb.value;
        var sdef=SERVICIOS_EXTRA.find(function(s){return s.id===sid;})||{};
        var precio=$n('srv_p_'+sid)||0;
        var horas=$n('srv_h_'+sid)||1;
        servicios.push({id:sid,label:sdef.label||sid,precio:precio,horas:horas,
          moLinea:parseFloat((horas*tar).toFixed(2))});
      });
      var subMat=servicios.reduce(function(a,s){return a+(s.precio||0);},0);
      var subMO=servicios.reduce(function(a,s){return a+(s.moLinea||0);},0);
      var sub=parseFloat((subMat+subMO).toFixed(2));
      var iva=parseFloat((sub*0.12).toFixed(2));
      var total=parseFloat((sub+iva).toFixed(2));
      var obj={noCotizacion:$v('ct_no'),fecha:$v('ct_fe'),
        clienteId:cliId,clienteNombre:cli?cli.nombre:'',
        vehiculoId:vehId,placa:veh?veh.placa:'',
        tarifaHora:tar,servicios:servicios,notas:$v('ct_obs').trim(),
        subtotalMateriales:subMat,subtotalMO:subMO,subtotal:sub,iva:iva,totalConIVA:total,
        estado:cot.estado||'pendiente',updatedAt:nowTs()};
      if(id){obj.id=id;await dbPut('cotizaciones',obj);}else{obj.createdAt=nowTs();await dbAdd('cotizaciones',obj);}
      cerrarModal('cot_m');toast(id?'Actualizada':'Cotizacion creada');await navTo('cotizador');
    },true);
  setTimeout(function(){calcTotCot();agregarBotonesInline([{selectId:'ct_cli',tipo:'cliente'}]);},150);
}

function calcTotCot(){
  var tar=$n('ct_tar',150);
  var subMat=0,subMO=0;
  document.querySelectorAll('.srv_cb:checked').forEach(function(cb){
    var sid=cb.value;
    var p=parseFloat((document.getElementById('srv_p_'+sid)||{}).value)||0;
    var h=parseFloat((document.getElementById('srv_h_'+sid)||{}).value)||0;
    subMat+=p;subMO+=h*tar;
  });
  var sub=subMat+subMO;
  var iva=sub*0.12;
  var tot=sub+iva;
  var el=document.getElementById('cot_tots');if(!el)return;
  el.innerHTML='<div style="display:inline-block;min-width:280px;background:var(--bg3);border-radius:6px;padding:12px 16px;border:1px solid var(--border)">'
    +'<div style="display:flex;justify-content:space-between;font-size:13px"><span>Materiales/repuestos:</span><span>Q '+subMat.toFixed(2)+'</span></div>'
    +'<div style="display:flex;justify-content:space-between;font-size:13px"><span>Mano de obra:</span><span>Q '+subMO.toFixed(2)+'</span></div>'
    +'<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--accent)"><span>IVA 12%:</span><span>Q '+iva.toFixed(2)+'</span></div>'
    +'<div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700;color:var(--green);border-top:1px solid var(--border);padding-top:6px;margin-top:4px"><span>TOTAL:</span><span>Q '+tot.toFixed(2)+'</span></div>'
    +'</div>';
}

async function imprimirCotizacion(id){
  var c=await dbGet('cotizaciones',id);
  var cfg=await dbGet('config','taller')||{};
  var logo=localStorage.getItem('tpgt_logo')||'';
  var w=window.open('','_blank');
  var rows=(c.servicios||[]).map(function(s){
    return '<tr><td>'+s.label+'</td><td style="text-align:center">'+s.horas+'h</td>'
      +'<td style="text-align:right">Q '+(s.precio||0).toFixed(2)+'</td>'
      +'<td style="text-align:right">Q '+(s.moLinea||0).toFixed(2)+'</td>'
      +'<td style="text-align:right">Q '+((s.precio||0)+(s.moLinea||0)).toFixed(2)+'</td></tr>';
  }).join('');
  var html='<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cotizacion '+c.noCotizacion+'</title>'
    +'<style>body{font-family:Arial,sans-serif;font-size:12px;padding:28px;max-width:720px;margin:0 auto}'
    +'table{width:100%;border-collapse:collapse;margin:10px 0}td,th{border:1px solid #ddd;padding:6px 8px}'
    +'th{background:#f5f5f5;font-weight:700}.hdr{display:flex;justify-content:space-between;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:12px}'
    +'.total{font-weight:700;font-size:14px;text-align:right}@media print{button{display:none}}</style></head><body>'
    +'<div class="hdr"><div>'+(logo?'<img src="'+logo+'" style="height:50px;margin-bottom:4px"><br>':'')
    +'<strong style="font-size:16px">'+(cfg.nombre||'TALLER')+'</strong><br>'
    +'NIT: '+(cfg.nit||'---')+' | Tel: '+(cfg.telefono||'---')+'</div>'
    +'<div style="text-align:right"><strong style="font-size:16px">COTIZACION</strong><br>'
    +'No. '+(c.noCotizacion||c.id)+'<br>'+fechaLegible(c.fecha)+'</div></div>'
    +'<div style="margin-bottom:10px"><strong>Cliente:</strong> '+c.clienteNombre
    +(c.placa?'<br><strong>Vehiculo:</strong> '+c.placa:'')+'</div>'
    +'<table><thead><tr><th>Servicio</th><th>Horas</th><th>Materiales Q</th><th>Mano de obra Q</th><th>Total Q</th></tr></thead>'
    +'<tbody>'+rows+'</tbody></table>'
    +'<div class="total" style="margin-top:8px">'
    +'<div>Subtotal: Q '+(c.subtotal||0).toFixed(2)+'</div>'
    +'<div>IVA 12%: Q '+(c.iva||0).toFixed(2)+'</div>'
    +'<div style="font-size:16px;border-top:2px solid #111;padding-top:6px">TOTAL: Q '+(c.totalConIVA||0).toFixed(2)+'</div></div>'
    +(c.notas?'<div style="margin-top:10px;font-size:11px;color:#555">Notas: '+c.notas+'</div>':'')
    +'<div style="margin-top:30px;font-size:11px;color:#555">Esta cotizacion tiene validez de 15 dias. '+(cfg.piePagina||'')+'</div>'
    +'</body></html>';
  w.document.write(html);w.document.close();setTimeout(function(){w.print();},400);
}



// ---- MODULO: BUDGET / PRESUPUESTO ----
async function renderBudget(content, actions) {
  var repuestos=await dbGetAll('repuestos');
  var insumos=await dbGetAll('insumos');
  var cfg=await dbGet('config','taller')||{};
  var tarifa=cfg.tarifaHora||150;

  content.innerHTML='<div class="section-title">Budget / Presupuesto de Mantenimiento</div>'
    +'<div class="section-sub">Calcula el costo de servicios para campanas de captacion y publicidad</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">'

    // Panel izquierdo: configuracion
    +'<div>'
    +'<div class="card"><div class="card-title" style="margin-bottom:12px">Parametros del presupuesto</div>'
    +'<div class="form-group"><label>Nombre del paquete / servicio</label><input id="bg_nom" placeholder="Ej: Mantenimiento preventivo basico" value="Mantenimiento preventivo"></div>'
    +'<div class="form-group"><label>Tipo de vehiculo</label>'
    +'<select id="bg_tipo" onchange="recalcBudget()"><option value="sedan">Sedan</option><option value="pickup">Pickup / SUV</option><option value="camion">Camion / Furgon</option></select></div>'
    +'<div class="divider"></div>'
    +'<div class="card-title" style="margin-bottom:8px">Margenes de ganancia</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Margen mano de obra (%)</label>'
    +'<input id="bg_mmo" type="number" value="40" min="20" max="200" oninput="recalcBudget()">'
    +'<div class="form-hint">Minimo recomendado: 20%</div></div>'
    +'<div class="form-group"><label>Margen repuestos/insumos (%)</label>'
    +'<input id="bg_mrep" type="number" value="30" min="20" max="200" oninput="recalcBudget()">'
    +'<div class="form-hint">Minimo legal: 20%</div></div>'
    +'</div>'
    +'<div class="divider"></div>'
    +'<div class="card-title" style="margin-bottom:8px">Mano de obra</div>'
    +'<div id="bg_mo_list">'
    +'<div style="display:grid;grid-template-columns:2fr 1fr;gap:6px;margin-bottom:6px"><input placeholder="Concepto" id="mo1_c" value="Cambio de aceite" style="font-size:12px"><input type="number" placeholder="Horas" id="mo1_h" value="0.5" min="0.25" step="0.25" oninput="recalcBudget()" style="font-size:12px"></div>'
    +'<div style="display:grid;grid-template-columns:2fr 1fr;gap:6px;margin-bottom:6px"><input placeholder="Concepto" id="mo2_c" value="Filtros" style="font-size:12px"><input type="number" placeholder="Horas" id="mo2_h" value="0.25" min="0.25" step="0.25" oninput="recalcBudget()" style="font-size:12px"></div>'
    +'<div style="display:grid;grid-template-columns:2fr 1fr;gap:6px;margin-bottom:6px"><input placeholder="Concepto" id="mo3_c" value="Revision general" style="font-size:12px"><input type="number" placeholder="Horas" id="mo3_h" value="0.5" min="0.25" step="0.25" oninput="recalcBudget()" style="font-size:12px"></div>'
    +'</div>'
    +'<div class="divider"></div>'
    +'<div class="card-title" style="margin-bottom:8px">Repuestos e insumos (costo de compra)</div>'
    +'<div id="bg_rep_list">'
    +'<div style="display:grid;grid-template-columns:2fr 1fr;gap:6px;margin-bottom:6px"><input placeholder="Producto" id="r1_n" value="Aceite motor (4L)" style="font-size:12px"><input type="number" placeholder="Costo Q" id="r1_c" value="120" min="0" step="0.01" oninput="recalcBudget()" style="font-size:12px"></div>'
    +'<div style="display:grid;grid-template-columns:2fr 1fr;gap:6px;margin-bottom:6px"><input placeholder="Producto" id="r2_n" value="Filtro de aceite" style="font-size:12px"><input type="number" placeholder="Costo Q" id="r2_c" value="35" min="0" step="0.01" oninput="recalcBudget()" style="font-size:12px"></div>'
    +'<div style="display:grid;grid-template-columns:2fr 1fr;gap:6px;margin-bottom:6px"><input placeholder="Producto" id="r3_n" value="Filtro de aire" style="font-size:12px"><input type="number" placeholder="Costo Q" id="r3_c" value="45" min="0" step="0.01" oninput="recalcBudget()" style="font-size:12px"></div>'
    +'</div>'
    +'</div></div>'

    // Panel derecho: resultado
    +'<div>'
    +'<div class="card" id="bg_resultado"><div class="text-muted text-center" style="padding:20px">Configura los parametros para ver el presupuesto</div></div>'
    +'<div class="card">'
    +'<div class="card-title" style="margin-bottom:10px">Acciones</div>'
    +'<div style="display:grid;gap:8px">'
    +'<button class="btn btn-primary" onclick="recalcBudget()">Recalcular</button>'
    +'<button class="btn btn-secondary" onclick="imprimirBudget()">Imprimir presupuesto</button>'
    +'<button class="btn btn-green" onclick="imprimirPublicidad()">Generar publicidad / flyer</button>'
    +'</div></div>'
    +'</div>'

    +'</div>';

  setTimeout(recalcBudget, 100);
}

function recalcBudget(){
  var mmoMarg=(parseFloat(document.getElementById('bg_mmo').value)||40)/100;
  var repMarg=(parseFloat(document.getElementById('bg_mrep').value)||30)/100;
  var cfg_tar=150;

  // Mano de obra
  var moItems=[];
  for(var i=1;i<=3;i++){
    var con=(document.getElementById('mo'+i+'_c')||{}).value||'';
    var hrs=parseFloat((document.getElementById('mo'+i+'_h')||{}).value)||0;
    if(con&&hrs>0){
      var costoMO=hrs*cfg_tar;
      var precioMO=costoMO*(1+mmoMarg);
      moItems.push({con:con,hrs:hrs,costo:costoMO,precio:precioMO});
    }
  }
  // Repuestos
  var repItems=[];
  for(var j=1;j<=3;j++){
    var nom=(document.getElementById('r'+j+'_n')||{}).value||'';
    var cost=parseFloat((document.getElementById('r'+j+'_c')||{}).value)||0;
    if(nom&&cost>0){
      var precioR=cost*(1+repMarg);
      repItems.push({nom:nom,costo:cost,precio:precioR});
    }
  }

  var totCostoMO=moItems.reduce(function(a,m){return a+m.costo;},0);
  var totPrecioMO=moItems.reduce(function(a,m){return a+m.precio;},0);
  var totCostoRep=repItems.reduce(function(a,r){return a+r.costo;},0);
  var totPrecioRep=repItems.reduce(function(a,r){return a+r.precio;},0);
  var totCosto=totCostoMO+totCostoRep;
  var totPrecio=totPrecioMO+totPrecioRep;
  var iva=totPrecio*0.12;
  var totalFinal=totPrecio+iva;
  var utilidad=totPrecio-totCosto;
  var margenReal=totPrecio>0?((utilidad/totPrecio)*100).toFixed(1):0;

  var alertMarg=(mmoMarg*100)<20||( repMarg*100)<20
    ?'<div class="alert alert-red" style="font-size:11px">Margen por debajo del minimo del 20%</div>':
    '<div class="alert alert-green" style="font-size:11px">Margenes dentro del rango recomendado</div>';

  var moRows=moItems.map(function(m){
    return '<tr><td>'+m.con+'</td><td class="td-mono" style="text-align:right">'+m.hrs+'h</td>'
      +'<td class="td-mono" style="text-align:right;color:var(--text3)">Q '+m.costo.toFixed(2)+'</td>'
      +'<td class="td-mono" style="text-align:right;color:var(--green)">Q '+m.precio.toFixed(2)+'</td></tr>';
  }).join('');
  var repRows=repItems.map(function(r){
    return '<tr><td>'+r.nom+'</td><td></td>'
      +'<td class="td-mono" style="text-align:right;color:var(--text3)">Q '+r.costo.toFixed(2)+'</td>'
      +'<td class="td-mono" style="text-align:right;color:var(--green)">Q '+r.precio.toFixed(2)+'</td></tr>';
  }).join('');

  var el=document.getElementById('bg_resultado');if(!el)return;
  el.innerHTML='<div class="card-title" style="margin-bottom:10px">Presupuesto: '+($v('bg_nom')||'Servicio')+'</div>'
    +alertMarg
    +'<table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:10px">'
    +'<thead><tr><th style="text-align:left;border-bottom:1px solid var(--border);padding:4px 0">Concepto</th>'
    +'<th style="border-bottom:1px solid var(--border);padding:4px 0">Det.</th>'
    +'<th style="text-align:right;border-bottom:1px solid var(--border);padding:4px 0">Costo</th>'
    +'<th style="text-align:right;border-bottom:1px solid var(--border);padding:4px 0">Precio venta</th></tr></thead>'
    +'<tbody>'+moRows+repRows+'</tbody></table>'
    +'<div style="background:var(--bg3);border-radius:6px;padding:12px">'
    +'<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0"><span>Total costo:</span><span class="td-mono text-red">Q '+totCosto.toFixed(2)+'</span></div>'
    +'<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0"><span>Subtotal venta:</span><span class="td-mono">Q '+totPrecio.toFixed(2)+'</span></div>'
    +'<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;color:var(--accent)"><span>IVA 12%:</span><span class="td-mono">Q '+iva.toFixed(2)+'</span></div>'
    +'<div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700;color:var(--green);border-top:1px solid var(--border);padding-top:6px;margin-top:4px"><span>PRECIO FINAL:</span><span class="td-mono">Q '+totalFinal.toFixed(2)+'</span></div>'
    +'<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--blue);padding-top:4px"><span>Utilidad neta:</span><span class="td-mono">Q '+utilidad.toFixed(2)+' ('+margenReal+'%)</span></div>'
    +'</div>'
    +'<div style="margin-top:10px;font-size:11px;color:var(--text3)">'
    +'Margen MO: '+(mmoMarg*100).toFixed(0)+'% | Margen repuestos: '+(repMarg*100).toFixed(0)+'%'
    +'</div>';

  // Guardar en ventana para imprimir
  window._budgetData={
    nombre:$v('bg_nom'),moItems:moItems,repItems:repItems,
    totCosto:totCosto,totPrecio:totPrecio,iva:iva,totalFinal:totalFinal,
    utilidad:utilidad,margenReal:margenReal,
    mmoMarg:(mmoMarg*100).toFixed(0),repMarg:(repMarg*100).toFixed(0)
  };
}

async function imprimirBudget(){
  var d=window._budgetData;if(!d){toast('Recalcula primero','amber');return;}
  var cfg=await dbGet('config','taller')||{};
  var logo=localStorage.getItem('tpgt_logo')||'';
  var w=window.open('','_blank');
  var html='<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Budget</title>'
    +'<style>body{font-family:Arial,sans-serif;font-size:12px;padding:28px;max-width:600px;margin:0 auto}'
    +'table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:5px 8px}'
    +'th{background:#f5f5f5}.total{font-weight:700;font-size:14px}@media print{button{display:none}}</style></head><body>'
    +'<div style="text-align:center;border-bottom:2px solid #111;padding-bottom:12px;margin-bottom:14px">'
    +(logo?'<img src="'+logo+'" style="height:50px;margin-bottom:6px"><br>':'')
    +'<strong style="font-size:18px">'+(cfg.nombre||'TALLER')+'</strong><br>'
    +'<span style="font-size:11px;color:#555">NIT: '+(cfg.nit||'---')+' | Tel: '+(cfg.telefono||'---')+'</span></div>'
    +'<h2 style="text-align:center;margin-bottom:12px">PRESUPUESTO: '+d.nombre+'</h2>'
    +'<table><thead><tr><th>Concepto</th><th>Detalle</th><th style="text-align:right">Precio venta Q</th></tr></thead><tbody>'
    +d.moItems.map(function(m){return '<tr><td>'+m.con+'</td><td style="text-align:center">'+m.hrs+'h</td><td style="text-align:right">'+m.precio.toFixed(2)+'</td></tr>';}).join('')
    +d.repItems.map(function(r){return '<tr><td>'+r.nom+'</td><td></td><td style="text-align:right">'+r.precio.toFixed(2)+'</td></tr>';}).join('')
    +'</tbody></table>'
    +'<div style="text-align:right;margin-top:8px">'
    +'<div>Subtotal: Q '+d.totPrecio.toFixed(2)+'</div>'
    +'<div>IVA 12%: Q '+d.iva.toFixed(2)+'</div>'
    +'<div class="total" style="font-size:16px;border-top:2px solid #111;padding-top:6px">TOTAL: Q '+d.totalFinal.toFixed(2)+'</div></div>'
    +'<div style="margin-top:16px;font-size:11px;color:#555;text-align:center">'+(cfg.piePagina||'')+'</div>'
    +'</body></html>';
  w.document.write(html);w.document.close();setTimeout(function(){w.print();},400);
}

async function imprimirPublicidad(){
  var d=window._budgetData;if(!d){toast('Recalcula primero','amber');return;}
  var cfg=await dbGet('config','taller')||{};
  var logo=localStorage.getItem('tpgt_logo')||'';
  var w=window.open('','_blank');
  var html='<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Publicidad</title>'
    +'<style>body{font-family:Arial,sans-serif;background:#fff;margin:0;padding:0}'
    +'.flyer{max-width:600px;margin:0 auto;border:4px solid #e8a820;border-radius:12px;overflow:hidden}'
    +'.header{background:#111;color:#fff;text-align:center;padding:24px}'
    +'.logo{height:70px;margin-bottom:8px}'
    +'.titulo{font-size:24px;font-weight:900;color:#e8a820;margin-top:6px}'
    +'.precio{background:#e8a820;text-align:center;padding:20px}'
    +'.precio .monto{font-size:48px;font-weight:900;color:#111}'
    +'.precio .label{font-size:14px;color:#333;margin-top:4px}'
    +'.incluye{padding:20px;background:#f9f9f9}'
    +'.incluye h3{font-size:14px;font-weight:700;margin-bottom:10px;color:#333}'
    +'.item{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px;border-bottom:1px solid #eee}'
    +'.check{color:#4caf7d;font-size:16px;font-weight:700}'
    +'.footer{background:#111;color:#e8a820;text-align:center;padding:14px;font-size:12px}'
    +'@media print{body{margin:0}button{display:none}@page{margin:5mm}}</style></head><body>'
    +'<div class="flyer">'
    +'<div class="header">'
    +(logo?'<img src="'+logo+'" class="logo"><br>':'')
    +'<div style="font-size:20px;font-weight:900;color:#fff">'+(cfg.nombre||'TALLER PRO GT')+'</div>'
    +'<div class="titulo">'+d.nombre+'</div>'
    +'</div>'
    +'<div class="precio">'
    +'<div style="font-size:14px;color:#333;margin-bottom:4px">Precio especial</div>'
    +'<div class="monto">Q '+d.totalFinal.toFixed(2)+'</div>'
    +'<div class="label">IVA incluido</div>'
    +'</div>'
    +'<div class="incluye">'
    +'<h3>Incluye:</h3>'
    +d.moItems.map(function(m){return '<div class="item"><span class="check">&#10003;</span>'+m.con+'</div>';}).join('')
    +d.repItems.map(function(r){return '<div class="item"><span class="check">&#10003;</span>'+r.nom+'</div>';}).join('')
    +'</div>'
    +'<div class="footer">'
    +'Tel: '+(cfg.telefono||'---')+' | '+(cfg.direccion||'')+'<br>'
    +'NIT: '+(cfg.nit||'---')
    +'</div>'
    +'</div>'
    +'</body></html>';
  w.document.write(html);w.document.close();setTimeout(function(){w.print();},400);
}

// ---- DASHBOARD FLOTA ----
async function renderFlota(content, actions) {
  var contratos=await dbGetAll('contratos_flota');
  var clientes=await dbGetAll('clientes');
  var vehiculos=await dbGetAll('vehiculos');
  var ordenes=await dbGetAll('ordenes');
  var hoy=new Date();hoy.setHours(0,0,0,0);

  actions.innerHTML='<button class="btn btn-primary" onclick="modalContratoFlota()">+ Nuevo contrato</button>'
    +' <button class="btn btn-secondary" onclick="verListaContratos()">Ver lista</button>';

  var activos=contratos.filter(function(ct){return ct.estado==='activo';});
  var ingresosMes=activos.reduce(function(a,ct){return a+(ct.tarifaMensual||0);},0);
  var totalVehs=activos.reduce(function(a,ct){return a+(ct.vehiculosIds?ct.vehiculosIds.length:0);},0);

  // Vehiculos de flota con alertas
  var todosVehsFlota=[];
  activos.forEach(function(ct){
    (ct.vehiculosIds||[]).forEach(function(vid){
      var v=vehiculos.find(function(x){return x.id===vid;});
      if(v){
        var dias=v.proximoServicio?Math.round((new Date(v.proximoServicio+'T00:00:00')-hoy)/86400000):null;
        todosVehsFlota.push({veh:v,contrato:ct,diasServicio:dias});
      }
    });
  });

  var vencidos=todosVehsFlota.filter(function(x){return x.diasServicio!==null&&x.diasServicio<0;});
  var proximos7=todosVehsFlota.filter(function(x){return x.diasServicio!==null&&x.diasServicio>=0&&x.diasServicio<=7;});
  var otsMes=ordenes.filter(function(o){return o.fecha&&o.fecha.startsWith(today().slice(0,7));});
  var facturacionMes=otsMes.reduce(function(a,o){return a+(o.totalConIVA||0);},0);

  // Tarjetas por contrato
  var cards=activos.map(function(ct){
    var cli=clientes.find(function(c){return c.id===ct.clienteId;});
    var vehs=(ct.vehiculosIds||[]).map(function(vid){return vehiculos.find(function(v){return v.id===vid;});}).filter(Boolean);
    var vVenc=vehs.filter(function(v){return v.proximoServicio&&Math.round((new Date(v.proximoServicio+'T00:00:00')-hoy)/86400000)<0;});
    var vProx=vehs.filter(function(v){return v.proximoServicio&&Math.round((new Date(v.proximoServicio+'T00:00:00')-hoy)/86400000)>=0&&Math.round((new Date(v.proximoServicio+'T00:00:00')-hoy)/86400000)<=7;});
    return '<div class="card" style="border-left:3px solid var(--'+(vVenc.length>0?'red':vProx.length>0?'amber':'green')+')">'
      +'<div class="card-header"><span class="card-title">'+ct.nombre+'</span>'
      +'<span class="badge badge-'+(vVenc.length>0?'red':vProx.length>0?'amber':'green')+'">'
      +(vVenc.length>0?vVenc.length+' vencidos':vProx.length>0?vProx.length+' proximos':'Al dia')+'</span></div>'
      +'<div style="font-size:12px;color:var(--text2);margin-bottom:8px">'+(cli?cli.nombre:'---')+' | '+ct.tipoContrato+'</div>'
      +'<div class="stat-grid" style="grid-template-columns:repeat(3,1fr)">'
      +'<div class="stat-card"><div class="stat-label">Vehiculos</div><div class="stat-value" style="font-size:16px">'+vehs.length+'</div></div>'
      +'<div class="stat-card stat-green"><div class="stat-label">Tarifa/mes</div><div class="stat-value" style="font-size:14px">'+fmt(ct.tarifaMensual||0)+'</div></div>'
      +'<div class="stat-card '+(vVenc.length>0?'stat-red':vProx.length>0?'stat-amber':'')+'"><div class="stat-label">Prox. servicio</div><div class="stat-value" style="font-size:14px">'+(vVenc.length>0?vVenc.length+' venc.':vProx.length>0?vProx.length+' prox.':'OK')+'</div></div>'
      +'</div>'
      +'<div style="display:flex;gap:6px;margin-top:6px">'
      +'<button class="btn btn-sm btn-blue" onclick="verDetalleContrato('+ct.id+')">Detalle</button>'
      +'<button class="btn btn-sm btn-green" onclick="programarMantenimientoFlota('+ct.id+')">Programar</button>'
      +'</div></div>';
  }).join('');

  content.innerHTML='<div class="section-title">Dashboard de Flota</div>'
    +'<div class="stat-grid">'
    +'<div class="stat-card stat-green"><div class="stat-label">Contratos activos</div><div class="stat-value">'+activos.length+'</div></div>'
    +'<div class="stat-card stat-green"><div class="stat-label">Ingreso mensual flota</div><div class="stat-value">'+fmt(ingresosMes)+'</div></div>'
    +'<div class="stat-card stat-blue"><div class="stat-label">Vehiculos en contrato</div><div class="stat-value">'+totalVehs+'</div></div>'
    +'<div class="stat-card stat-red"><div class="stat-label">Servicios vencidos</div><div class="stat-value">'+vencidos.length+'</div></div>'
    +'<div class="stat-card stat-amber"><div class="stat-label">Proximos 7 dias</div><div class="stat-value">'+proximos7.length+'</div></div>'
    +'<div class="stat-card stat-green"><div class="stat-label">Facturacion mes</div><div class="stat-value" style="font-size:14px">'+fmt(facturacionMes)+'</div></div>'
    +'</div>'
    +(vencidos.length?'<div class="alert alert-red" style="font-size:12px"><strong>'+vencidos.length+' vehiculos con servicio vencido:</strong> '+vencidos.map(function(x){return x.veh.placa;}).join(', ')+'</div>':'')
    +(proximos7.length?'<div class="alert alert-amber" style="font-size:12px"><strong>Proximos 7 dias:</strong> '+proximos7.map(function(x){return x.veh.placa+' ('+x.diasServicio+'d)';}).join(', ')+'</div>':'')
    +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px">'
    +(cards||'<div class="text-muted text-center" style="padding:20px">Sin contratos activos. Crea uno con el boton + Nuevo contrato</div>')
    +'</div>';
}

async function verListaContratos(){
  var contratos=await dbGetAll('contratos_flota');
  var clientes=await dbGetAll('clientes');
  var vehiculos=await dbGetAll('vehiculos');
  var rows=contratos.map(function(ct){
    var cli=clientes.find(function(c){return c.id===ct.clienteId;});
    var vn=ct.vehiculosIds?ct.vehiculosIds.length:0;
    return '<tr>'
      +'<td><strong>'+ct.nombre+'</strong></td>'
      +'<td>'+(cli?cli.nombre:'---')+'</td>'
      +'<td><span class="badge badge-gray">'+(ct.tipoContrato||'---')+'</span></td>'
      +'<td class="td-mono">'+vn+' vehs</td>'
      +'<td class="td-mono">'+fmt(ct.tarifaMensual||0)+'</td>'
      +'<td>'+fechaLegible(ct.fechaFin)+'</td>'
      +'<td><span class="badge badge-'+(ct.estado==='activo'?'green':'gray')+'">'+ct.estado+'</span></td>'
      +'<td><div class="flex gap-1">'
      +'<button class="btn btn-sm btn-blue" onclick="cerrarModal(\'lista_ct\');verDetalleContrato('+ct.id+')">Detalle</button>'
      +'<button class="btn btn-sm btn-secondary" onclick="cerrarModal(\'lista_ct\');modalContratoFlota('+ct.id+')">Editar</button>'
      +'</div></td></tr>';
  }).join('');
  openModal('lista_ct','Todos los contratos de flota',
    '<div class="table-wrap"><table><thead><tr><th>Nombre</th><th>Cliente</th><th>Tipo</th><th>Flota</th><th>Tarifa</th><th>Vence</th><th>Estado</th><th>Acciones</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="8" class="text-center text-muted" style="padding:16px">Sin contratos</td></tr>')+'</tbody></table></div>',
    function(){cerrarModal('lista_ct');},false);
}

// ================================================================
// MODULO B v3.3
// 1. Log de auditoria (solo admin)
// 2. Inline creation mejorado (cliente+vehiculo en OT)
// 3. Dashboard Facturas, Cotizaciones, Budget
// 4. Servicios externos (torno, rectificadora, etc.)
// 5. RRHH: capacitacion y aumentos salariales
// ================================================================

// ================================================================
// 1. AUDITORIA LOG
// ================================================================
async function logAuditoria(accion, modulo, descripcion, datos) {
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

async function renderAuditoria(content, actions) {
  if (!soloAdmin()) { content.innerHTML='<div class="alert alert-red">Solo administradores</div>'; return; }
  var logs = await dbGetAll('auditoria');
  logs.sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;});
  actions.innerHTML =
    '<button class="btn btn-secondary" onclick="exportarCSV(\'auditoria\')">Exportar CSV</button>'
    + ' <button class="btn btn-danger btn-sm" onclick="limpiarAuditoria()">Limpiar log</button>';

  var filtroMod = window._audFiltroMod || '';
  var filtroAcc = window._audFiltroAcc || '';

  var modulos = [...new Set(logs.map(function(l){return l.modulo||'';}).filter(Boolean))];
  var acciones = [...new Set(logs.map(function(l){return l.accion||'';}).filter(Boolean))];

  var filtrados = logs.filter(function(l){
    return (!filtroMod || l.modulo===filtroMod) && (!filtroAcc || l.accion===filtroAcc);
  });

  var coloresAcc = {crear:'green', editar:'blue', eliminar:'red', login:'amber', logout:'gray', exportar:'purple', ver:'gray'};

  var rows = filtrados.slice(0,200).map(function(l){
    return '<tr>'
      +'<td style="font-size:10px;font-family:var(--font-mono)">'+fechaLegible(l.fecha)+'</td>'
      +'<td><span class="badge badge-'+(coloresAcc[l.accion]||'gray')+'">'+( l.accion||'---')+'</span></td>'
      +'<td><span class="badge badge-gray">'+(l.modulo||'---')+'</span></td>'
      +'<td>'+(l.usuario||'---')+'</td>'
      +'<td style="font-size:11px">'+(l.descripcion||'---')+'</td>'
      +'<td style="font-size:10px;color:var(--text3);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(l.datos||'')+'</td>'
      +'</tr>';
  }).join('');

  content.innerHTML = '<div class="section-title">Log de Auditoria</div>'
    +'<div class="section-sub">Registro de todos los cambios del sistema. Solo visible para administradores.</div>'
    +'<div class="card">'
    +'<div style="display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap">'
    +'<select onchange="window._audFiltroMod=this.value;navTo(\'auditoria\')" style="width:auto;font-size:12px">'
    +'<option value="">Todos los modulos</option>'
    +modulos.map(function(m){return '<option value="'+m+'"'+(filtroMod===m?' selected':'')+'>'+m+'</option>';}).join('')
    +'</select>'
    +'<select onchange="window._audFiltroAcc=this.value;navTo(\'auditoria\')" style="width:auto;font-size:12px">'
    +'<option value="">Todas las acciones</option>'
    +acciones.map(function(a){return '<option value="'+a+'"'+(filtroAcc===a?' selected':'')+'>'+a+'</option>';}).join('')
    +'</select>'
    +'<span style="font-size:12px;color:var(--text2);align-self:center">'+filtrados.length+' registros</span>'
    +'</div>'
    +'<div class="table-wrap"><table>'
    +'<thead><tr><th>Fecha/Hora</th><th>Accion</th><th>Modulo</th><th>Usuario</th><th>Descripcion</th><th>Datos</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="6" class="text-center text-muted" style="padding:16px">Sin registros</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

async function limpiarAuditoria() {
  if (!confirm('Eliminar TODOS los registros de auditoria? Esta accion no se puede deshacer.')) return;
  var all = await dbGetAll('auditoria');
  for (var i=0;i<all.length;i++) await dbDelete('auditoria',all[i].id);
  toast('Log de auditoria limpiado');
  await navTo('auditoria');
}

// Auditoria: se registra directamente en cada operacion critica (sin hook)

// ================================================================
// 2. CREACION INLINE MEJORADA (cliente+vehiculo en OT/Recepcion)
// ================================================================

// Modal rapido cliente+vehiculo juntos (para OT y Recepciones)
async function crearClienteVehiculoInline(onCreado) {
  openModal('cliveh_inline','Nuevo Cliente y Vehiculo',
    '<div class="alert alert-blue" style="font-size:11px">Registra los datos minimos para continuar. Podras completar el resto despues.</div>'
    +'<div class="card-title" style="margin-bottom:8px">Datos del cliente</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Nombre *</label><input id="cv_cnom" placeholder="Nombre completo"></div>'
    +'<div class="form-group"><label>NIT</label><input id="cv_cnit" placeholder="CF" value="CF"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Telefono</label><input id="cv_ctel" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>'
    +'<div class="form-group"><label>WhatsApp</label><input id="cv_cwa" placeholder="+502 5555-0000"></div>'
    +'</div>'
    +'<div class="divider"></div>'
    +'<div class="card-title" style="margin-bottom:8px">Datos del vehiculo</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Placa *</label><input id="cv_vpl" placeholder="P-123ABC"></div>'
    +'<div class="form-group"><label>Marca</label><input id="cv_vmar" placeholder="Toyota, Nissan..."></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Modelo</label><input id="cv_vmod" placeholder="Hilux, Frontier..."></div>'
    +'<div class="form-group"><label>Anio</label><input id="cv_vani" type="number" placeholder="2020" min="1960" max="2035"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Color</label><input id="cv_vcol" placeholder="Blanco"></div>'
    +'<div class="form-group"><label>Km actual</label><input id="cv_vkm" type="number" placeholder="45000" min="0"></div>'
    +'</div>',
    async function(){
      var cnom = document.getElementById('cv_cnom').value.trim();
      var vpl  = document.getElementById('cv_vpl').value.trim();
      if (!cnom||!vpl){toast('Nombre del cliente y placa son requeridos','red');return;}
      var cliId = await dbAdd('clientes',{nombre:cnom,nit:document.getElementById('cv_cnit').value.trim()||'CF',
        telefono:document.getElementById('cv_ctel').value.trim(),
        whatsapp:document.getElementById('cv_cwa').value.trim(),
        tipo:'persona',createdAt:nowTs()});
      var mar = document.getElementById('cv_vmar').value.trim();
      var mod = document.getElementById('cv_vmod').value.trim();
      var vehId = await dbAdd('vehiculos',{clienteId:cliId,clienteNombre:cnom,
        placa:vpl,marca:mar,modelo:mod,
        anio:parseInt(document.getElementById('cv_vani').value)||null,
        color:document.getElementById('cv_vcol').value.trim(),
        km:parseInt(document.getElementById('cv_vkm').value)||0,
        createdAt:nowTs()});
      cerrarModal('cliveh_inline');
      toast('Cliente y vehiculo creados');
      if (onCreado) onCreado({clienteId:cliId,clienteNombre:cnom,vehiculoId:vehId,placa:vpl,vehiculoDesc:(mar+' '+mod).trim()});
    },true);
}

// ================================================================
// 3. DASHBOARDS
// ================================================================

// --- Dashboard Facturas ---
async function renderDashFacturas(content, actions) {
  var facturas = await dbGetAll('facturas');
  var hoy2 = new Date(); hoy2.setHours(0,0,0,0);
  var mesActual = today().slice(0,7);
  var anioActual = today().slice(0,4);

  // Agrupar por mes (ultimos 6 meses)
  var meses = [];
  for (var i=5;i>=0;i--) {
    var d = new Date(hoy2); d.setMonth(d.getMonth()-i);
    var m = d.toISOString().slice(0,7);
    var fMes = facturas.filter(function(f){return f.fecha&&f.fecha.startsWith(m);});
    meses.push({
      mes:m,
      total:fMes.reduce(function(a,f){return a+(f.total||0);},0),
      iva:fMes.reduce(function(a,f){return a+(f.iva||0);},0),
      count:fMes.length,
      pagadas:fMes.filter(function(f){return f.pagada;}).length
    });
  }

  var fMesAct = facturas.filter(function(f){return f.fecha&&f.fecha.startsWith(mesActual);});
  var totMes = fMesAct.reduce(function(a,f){return a+(f.total||0);},0);
  var ivaMes = fMesAct.reduce(function(a,f){return a+(f.iva||0);},0);
  var pagadas = fMesAct.filter(function(f){return f.pagada;}).length;
  var pendientes = fMesAct.filter(function(f){return !f.pagada;});
  var totPend = pendientes.reduce(function(a,f){return a+(f.total||0);},0);
  var fAnio = facturas.filter(function(f){return f.fecha&&f.fecha.startsWith(anioActual);});
  var totAnio = fAnio.reduce(function(a,f){return a+(f.total||0);},0);

  // Top clientes
  var porCliente = {};
  fAnio.forEach(function(f){
    if(!porCliente[f.clienteNombre]) porCliente[f.clienteNombre]=0;
    porCliente[f.clienteNombre]+=(f.total||0);
  });
  var topCli = Object.entries(porCliente).sort(function(a,b){return b[1]-a[1];}).slice(0,5);

  // Barras SVG simples
  var maxVal = Math.max.apply(null, meses.map(function(m){return m.total||1;}));
  var barras = meses.map(function(m,i){
    var h = Math.max(4, Math.round((m.total/maxVal)*80));
    var col = m.mes===mesActual?'var(--accent)':'var(--blue)';
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1">'
      +'<div style="font-size:9px;color:var(--text3)">Q'+(m.total/1000).toFixed(0)+'k</div>'
      +'<div style="height:'+h+'px;background:'+col+';border-radius:3px 3px 0 0;width:100%;min-height:4px"></div>'
      +'<div style="font-size:9px;color:var(--text2)">'+m.mes.slice(5)+'</div>'
      +'</div>';
  }).join('');

  content.innerHTML = '<div class="section-title">Dashboard de Facturacion</div>'
    +'<div class="stat-grid">'
    +'<div class="stat-card stat-green"><div class="stat-label">Facturado este mes</div><div class="stat-value">'+fmt(totMes)+'</div><div class="stat-sub">'+fMesAct.length+' facturas</div></div>'
    +'<div class="stat-card stat-amber"><div class="stat-label">IVA generado mes</div><div class="stat-value">'+fmt(ivaMes)+'</div><div class="stat-sub">Por declarar SAT</div></div>'
    +'<div class="stat-card stat-red"><div class="stat-label">Por cobrar</div><div class="stat-value">'+fmt(totPend)+'</div><div class="stat-sub">'+pendientes.length+' facturas</div></div>'
    +'<div class="stat-card"><div class="stat-label">Facturado '+anioActual+'</div><div class="stat-value" style="font-size:16px">'+fmt(totAnio)+'</div></div>'
    +'</div>'
    +'<div style="display:grid;grid-template-columns:2fr 1fr;gap:14px">'
    +'<div class="card"><div class="card-title" style="margin-bottom:12px">Facturacion ultimos 6 meses</div>'
    +'<div style="display:flex;align-items:flex-end;gap:6px;height:100px;padding-bottom:4px">'+barras+'</div></div>'
    +'<div class="card"><div class="card-title" style="margin-bottom:10px">Top 5 clientes ('+anioActual+')</div>'
    +topCli.map(function(c){
      return '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);font-size:12px">'
        +'<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+c[0]+'</span>'
        +'<span class="td-mono text-green" style="flex-shrink:0;margin-left:8px">'+fmt(c[1])+'</span></div>';
    }).join('')
    +'</div></div>'
    +'<div class="card"><div class="card-title" style="margin-bottom:8px">Facturas pendientes de pago</div>'
    +'<div class="table-wrap"><table><thead><tr><th>No. Factura</th><th>Fecha</th><th>Cliente</th><th class="td-right">Total</th><th>Dias pendiente</th></tr></thead><tbody>'
    +pendientes.slice(0,10).map(function(f){
      var dias=Math.floor((hoy2-new Date(f.fecha+'T00:00:00'))/86400000);
      return '<tr><td class="td-mono">'+(f.noFactura||f.id)+'</td><td>'+fechaLegible(f.fecha)+'</td>'
        +'<td>'+f.clienteNombre+'</td><td class="td-mono td-right">'+fmt(f.total||0)+'</td>'
        +'<td><span class="badge badge-'+(dias>30?'red':dias>15?'amber':'green')+'">'+dias+' dias</span></td></tr>';
    }).join('')
    +(pendientes.length===0?'<tr><td colspan="5" class="text-center text-muted" style="padding:12px">Sin pendientes</td></tr>':'')
    +'</tbody></table></div></div>';
}

// --- Dashboard Cotizaciones ---
async function renderDashCotizaciones(content, actions) {
  var cots = await dbGetAll('cotizaciones');
  var mesActual = today().slice(0,7);
  actions.innerHTML = '<button class="btn btn-primary" onclick="navTo(\'cotizador\')">+ Nueva cotizacion</button>';

  var aprobadas = cots.filter(function(c){return c.estado==='aprobada';});
  var pendientes = cots.filter(function(c){return c.estado==='pendiente';});
  var rechazadas = cots.filter(function(c){return c.estado==='rechazada';});
  var totAprobado = aprobadas.reduce(function(a,c){return a+(c.totalConIVA||0);},0);
  var totPendiente = pendientes.reduce(function(a,c){return a+(c.totalConIVA||0);},0);
  var tasaConv = cots.length>0?((aprobadas.length/cots.length)*100).toFixed(1):0;

  var topServicios = {};
  cots.forEach(function(c){(c.servicios||[]).forEach(function(s){if(!topServicios[s.label])topServicios[s.label]=0;topServicios[s.label]++;});});
  var rankServ = Object.entries(topServicios).sort(function(a,b){return b[1]-a[1];}).slice(0,6);

  content.innerHTML = '<div class="section-title">Dashboard de Cotizaciones</div>'
    +'<div class="stat-grid">'
    +'<div class="stat-card stat-green"><div class="stat-label">Aprobadas</div><div class="stat-value">'+aprobadas.length+'</div><div class="stat-sub">'+fmt(totAprobado)+'</div></div>'
    +'<div class="stat-card stat-amber"><div class="stat-label">Pendientes</div><div class="stat-value">'+pendientes.length+'</div><div class="stat-sub">'+fmt(totPendiente)+'</div></div>'
    +'<div class="stat-card stat-red"><div class="stat-label">Rechazadas</div><div class="stat-value">'+rechazadas.length+'</div></div>'
    +'<div class="stat-card stat-blue"><div class="stat-label">Tasa de conversion</div><div class="stat-value">'+tasaConv+'%</div></div>'
    +'</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">'
    +'<div class="card"><div class="card-title" style="margin-bottom:10px">Servicios mas cotizados</div>'
    +rankServ.map(function(s){
      var max=rankServ[0][1];
      var pct=Math.round((s[1]/max)*100);
      return '<div style="margin-bottom:8px">'
        +'<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px">'
        +'<span>'+s[0]+'</span><span class="td-mono">'+s[1]+'x</span></div>'
        +'<div class="progress-bar"><div class="progress-fill" style="width:'+pct+'%;background:var(--blue)"></div></div>'
        +'</div>';
    }).join('')
    +'</div>'
    +'<div class="card"><div class="card-title" style="margin-bottom:10px">Ultimas cotizaciones</div>'
    +cots.slice().sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;}).slice(0,8).map(function(c){
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">'
        +'<div><div>'+c.clienteNombre+'</div><div style="font-size:10px;color:var(--text3)">'+fechaLegible(c.fecha)+'</div></div>'
        +'<div style="display:flex;align-items:center;gap:6px">'
        +'<span class="td-mono">'+fmt(c.totalConIVA||0)+'</span>'
        +'<span class="badge badge-'+(c.estado==='aprobada'?'green':c.estado==='rechazada'?'red':'amber')+'">'+c.estado+'</span>'
        +'</div></div>';
    }).join('')
    +'</div></div>';
}

// --- Dashboard Budget ---
async function renderDashBudget(content, actions) {
  actions.innerHTML = '<button class="btn btn-primary" onclick="navTo(\'budget\')">Abrir Budget</button>';
  var repuestos = await dbGetAll('repuestos');
  var insumos = await dbGetAll('insumos');
  var cfg = await dbGet('config','taller')||{};
  var tarifa = cfg.tarifaHora||150;

  // Calcular paquetes predefinidos
  var paquetes = [
    {nombre:'Servicio basico sedan',horasMO:1,productos:[{n:'Aceite motor 4L',c:120},{n:'Filtro aceite',c:35}]},
    {nombre:'Servicio completo pickup',horasMO:1.5,productos:[{n:'Aceite motor 6L',c:180},{n:'Filtro aceite',c:45},{n:'Filtro aire',c:55}]},
    {nombre:'Frenos completos',horasMO:3,productos:[{n:'Pastillas delanteras',c:180},{n:'Pastillas traseras',c:160},{n:'Liquido de frenos',c:60}]},
    {nombre:'Cambio de bateria',horasMO:0.5,productos:[{n:'Bateria 70Ah',c:450}]},
  ];

  var margenMO=0.40, margenRep=0.30;
  var tarjetas = paquetes.map(function(p){
    var costoMO=p.horasMO*tarifa;
    var precioMO=costoMO*(1+margenMO);
    var costoRep=p.productos.reduce(function(a,r){return a+r.c;},0);
    var precioRep=costoRep*(1+margenRep);
    var sub=precioMO+precioRep;
    var total=sub*1.12;
    var util=sub-(costoMO+costoRep);
    return '<div class="stat-card">'
      +'<div class="stat-label">'+p.nombre+'</div>'
      +'<div style="font-size:18px;font-weight:700;color:var(--green);margin:6px 0">'+fmt(total)+'</div>'
      +'<div style="font-size:10px;color:var(--text2)">Costo: '+fmt(costoMO+costoRep)+'</div>'
      +'<div style="font-size:10px;color:var(--blue)">Utilidad: '+fmt(util)+' ('+(util/(precioMO+precioRep)*100).toFixed(0)+'%)</div>'
      +'</div>';
  }).join('');

  content.innerHTML = '<div class="section-title">Dashboard Budget</div>'
    +'<div class="section-sub">Precios sugeridos con margen MO '+( margenMO*100).toFixed(0)+'% | Repuestos '+(margenRep*100).toFixed(0)+'% | Tarifa Q'+tarifa+'/hr</div>'
    +'<div class="stat-grid">'+tarjetas+'</div>'
    +'<div class="card"><div class="card-title" style="margin-bottom:10px">Acceso rapido al presupuestador</div>'
    +'<div style="display:flex;gap:10px;flex-wrap:wrap">'
    +'<button class="btn btn-primary" onclick="navTo(\'budget\')">Abrir Budget completo</button>'
    +'<button class="btn btn-secondary" onclick="navTo(\'cotizador\')">Ir al Cotizador</button>'
    +'</div></div>';
}

// ================================================================
// 4. SERVICIOS EXTERNOS (Torno, Rectificadora, etc.)
// ================================================================
async function renderServiciosExternos(content, actions) {
  var srvExt = await dbGetAll('servicios_externos');
  var proveedores = await dbGetAll('proveedores');
  srvExt.sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;});
  actions.innerHTML = '<button class="btn btn-primary" onclick="modalSrvExterno()">+ Nuevo servicio externo</button>';

  var totPend = srvExt.filter(function(s){return s.estado!=='entregado';}).reduce(function(a,s){return a+(s.costoTotal||0);},0);
  var totMes = srvExt.filter(function(s){return s.fecha&&s.fecha.startsWith(today().slice(0,7));}).reduce(function(a,s){return a+(s.costoTotal||0);},0);

  var estados = {pendiente:'amber',enviado:'blue',en_proceso:'amber',listo:'green',entregado:'green',devuelto:'red'};
  var rows = srvExt.map(function(s){
    var prov = proveedores.find(function(p){return p.id===s.proveedorId;});
    return '<tr>'
      +'<td><strong>'+s.tipoServicio+'</strong><div style="font-size:10px;color:var(--text3)">'+(s.descripcion||'')+'</div></td>'
      +'<td>'+(prov?prov.empresa:s.proveedor||'---')+'</td>'
      +'<td style="font-size:11px">'+(s.responsable||'---')+'</td>'
      +'<td style="font-size:11px">'+(s.formaEntrega||'---')+'</td>'
      +'<td style="font-size:11px">'+(s.formaRecogida||'---')+'</td>'
      +'<td class="td-mono">Q '+(s.costo||0).toFixed(2)+'</td>'
      +'<td class="td-mono text-green">Q '+(s.costoTotal||0).toFixed(2)+'</td>'
      +'<td><span class="badge badge-'+(estados[s.estado]||'gray')+'">'+(s.estado||'pendiente')+'</span></td>'
      +'<td style="font-size:11px">'+(s.noOrden||'---')+'</td>'
      +'<td><div class="flex gap-1">'
      +'<button class="btn btn-sm btn-secondary" onclick="modalSrvExterno('+s.id+')">Editar</button>'
      +'</div></td></tr>';
  }).join('');

  content.innerHTML = '<div class="section-title">Servicios Externos</div>'
    +'<div class="section-sub">Torno, rectificadora, soldadura, electronica y otros servicios de terceros</div>'
    +'<div class="stat-grid">'
    +'<div class="stat-card stat-red"><div class="stat-label">En proceso</div><div class="stat-value">'+srvExt.filter(function(s){return s.estado!=='entregado';}).length+'</div><div class="stat-sub">'+fmt(totPend)+' pendiente</div></div>'
    +'<div class="stat-card stat-amber"><div class="stat-label">Costo mes</div><div class="stat-value">'+fmt(totMes)+'</div></div>'
    +'<div class="stat-card"><div class="stat-label">Total registros</div><div class="stat-value">'+srvExt.length+'</div></div>'
    +'</div>'
    +'<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    +'<thead><tr><th>Servicio</th><th>Proveedor</th><th>Responsable</th><th>Como se entrega</th><th>Como se recoge</th><th>Costo</th><th>Total c/ganancia</th><th>Estado</th><th>OT</th><th>Acciones</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="10" class="text-center text-muted" style="padding:16px">Sin servicios externos</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

async function modalSrvExterno(id) {
  var s = id ? await dbGet('servicios_externos',id) : {};
  var proveedores = await dbGetAll('proveedores');
  var ordenes = await dbGetAll('ordenes');
  var provOpts = '<option value="">Sin proveedor</option>'
    +proveedores.map(function(p){return '<option value="'+p.id+'"'+(s.proveedorId===p.id?' selected':'')+'>'+p.empresa+'</option>';}).join('');
  var otOpts = '<option value="">Sin OT</option>'
    +ordenes.filter(function(o){return o.estado!=='entregada';}).map(function(o){
      return '<option value="'+o.noOT+'"'+(s.noOrden===o.noOT?' selected':'')+'>'+o.noOT+' - '+(o.placa||o.clienteNombre||'')+'</option>';
    }).join('');
  var tipos = ['Torno','Rectificadora','Soldadura','Electronica','Pintura','Latoneria','Vulcanizado','Alineacion y balanceo','Otro'];
  var formasEntrega = ['Entregamos en taller del proveedor','Proveedor recoge en nuestro taller','Mensajero propio','Guatex/Cargo Expreso','Otro'];

  openModal('srvext_m', id?'Editar Servicio Externo':'Nuevo Servicio Externo',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Tipo de servicio *</label>'
    +'<select id="se_tipo">'+tipos.map(function(t){return '<option value="'+t+'"'+(s.tipoServicio===t?' selected':'')+'>'+t+'</option>';}).join('')+'</select></div>'
    +'<div class="form-group"><label>Fecha de envio</label><input id="se_fec" type="date" value="'+(s.fecha||today())+'"></div>'
    +'</div>'
    +'<div class="form-group"><label>Descripcion de lo que se envia</label><textarea id="se_desc" style="min-height:60px" placeholder="Disco de freno rayado, bloque de motor, etc.">'+(s.descripcion||'')+'</textarea></div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Proveedor del servicio *</label><select id="se_prov">'+provOpts+'</select></div>'
    +'<div class="form-group"><label>Responsable (nombre)</label><input id="se_resp" value="'+(s.responsable||'')+'" placeholder="Quien atiende en el proveedor"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Forma de entrega al proveedor</label>'
    +'<select id="se_fent">'+formasEntrega.map(function(f){return '<option value="'+f+'"'+(s.formaEntrega===f?' selected':'')+'>'+f+'</option>';}).join('')+'</select></div>'
    +'<div class="form-group"><label>Forma de recogida</label>'
    +'<select id="se_frec">'+formasEntrega.map(function(f){return '<option value="'+f+'"'+(s.formaRecogida===f?' selected':'')+'>'+f+'</option>';}).join('')+'</select></div>'
    +'</div>'
    +'<div class="form-row form-row-3">'
    +'<div class="form-group"><label>Costo del servicio (Q)</label><input id="se_cos" type="number" value="'+(s.costo||'')+'" step="0.01" oninput="calcTotSrvExt()"></div>'
    +'<div class="form-group"><label>% Ganancia al cliente</label><input id="se_gan" type="number" value="'+(s.porcentajeGanancia||20)+'" min="0" max="200" oninput="calcTotSrvExt()"><div class="form-hint">Se cobra al cliente</div></div>'
    +'<div class="form-group"><label>Total a cobrar al cliente (Q)</label><input id="se_tot" type="number" value="'+(s.costoTotal||'')+'" step="0.01" readonly style="background:var(--bg4)"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Fecha estimada de entrega</label><input id="se_fent2" type="date" value="'+(s.fechaEntrega||'')+'"></div>'
    +'<div class="form-group"><label>Estado</label>'
    +'<select id="se_est"><option value="pendiente"'+(s.estado==='pendiente'||!s.estado?' selected':'')+'>Pendiente</option>'
    +'<option value="enviado"'+(s.estado==='enviado'?' selected':'')+'>Enviado al proveedor</option>'
    +'<option value="en_proceso"'+(s.estado==='en_proceso'?' selected':'')+'>En proceso</option>'
    +'<option value="listo"'+(s.estado==='listo'?' selected':'')+'>Listo para recoger</option>'
    +'<option value="entregado"'+(s.estado==='entregado'?' selected':'')+'>Entregado/Completado</option></select></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>OT relacionada</label><select id="se_ot">'+otOpts+'</select></div>'
    +'<div class="form-group"><label>Notas</label><input id="se_not" value="'+(s.notas||'')+'" placeholder="Observaciones"></div>'
    +'</div>',
    async function(){
      var tipo=document.getElementById('se_tipo').value;
      var costo=parseFloat(document.getElementById('se_cos').value)||0;
      if(!tipo||!costo){toast('Tipo y costo son requeridos','red');return;}
      var pId=parseInt(document.getElementById('se_prov').value)||null;
      var prov=proveedores.find(function(p){return p.id===pId;});
      var obj={tipoServicio:tipo,descripcion:$v('se_desc').trim(),
        proveedorId:pId,proveedor:prov?prov.empresa:'',
        responsable:$v('se_resp').trim(),
        formaEntrega:$v('se_fent'),formaRecogida:$v('se_frec'),
        fecha:$v('se_fec'),fechaEntrega:$v('se_fent2'),
        costo:costo,porcentajeGanancia:parseFloat($v('se_gan'))||20,
        costoTotal:parseFloat(document.getElementById('se_tot').value)||costo,
        estado:$v('se_est'),noOrden:$v('se_ot'),
        notas:$v('se_not').trim(),updatedAt:nowTs()};
      if(id){obj.id=id;await dbPut('servicios_externos',obj);}
      else{obj.createdAt=nowTs();await dbAdd('servicios_externos',obj);
        await dbAdd('costos',{fecha:obj.fecha,categoria:'Servicio externo - '+obj.tipoServicio,
          descripcion:obj.descripcion,monto:costo,proveedor:obj.proveedor,recurrente:false,createdAt:nowTs()});
      }
      cerrarModal('srvext_m');toast(id?'Actualizado':'Registrado');await navTo('servicios_externos');
    },true);
  setTimeout(function(){
    calcTotSrvExt();
    agregarBotonesInline([{selectId:'se_prov',tipo:'proveedor'}]);
  },100);
}

function calcTotSrvExt(){
  var c=parseFloat((document.getElementById('se_cos')||{}).value)||0;
  var g=parseFloat((document.getElementById('se_gan')||{}).value)||20;
  var el=document.getElementById('se_tot');
  if(el) el.value=(c*(1+g/100)).toFixed(2);
}

// ================================================================
// 5. RRHH: CAPACITACION Y AUMENTOS SALARIALES
// ================================================================
async function renderCapacitacion(content, actions) {
  var caps = await dbGetAll('capacitaciones');
  var empleados = await dbGetAll('empleados');
  actions.innerHTML = '<button class="btn btn-primary" onclick="modalCapacitacion()">+ Registrar capacitacion</button>';

  var rows = caps.sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;}).map(function(c){
    var emp = empleados.find(function(e){return e.id===c.empleadoId;});
    return '<tr>'
      +'<td>'+(emp?emp.nombre:c.empleadoNombre||'---')+'</td>'
      +'<td><strong>'+c.curso+'</strong></td>'
      +'<td><span class="badge badge-gray">'+(c.tipo||'Interna')+'</span></td>'
      +'<td>'+fechaLegible(c.fecha)+'</td>'
      +'<td>'+( c.duracion||'---')+'</td>'
      +'<td>'+(c.grado||'---')+'</td>'
      +'<td>'+(c.institucion||'---')+'</td>'
      +'<td class="td-mono text-red">'+(c.costo>0?fmt(c.costo):'---')+'</td>'
      +'<td><div class="flex gap-1">'
      +'<button class="btn btn-sm btn-secondary" onclick="modalCapacitacion('+c.id+')">Editar</button>'
      +'<button class="btn btn-sm btn-danger" onclick="borrarCap('+c.id+')">X</button>'
      +'</div></td></tr>';
  }).join('');

  // Resumen por empleado
  var resumen = {};
  caps.forEach(function(c){
    if(!resumen[c.empleadoNombre]) resumen[c.empleadoNombre]=0;
    resumen[c.empleadoNombre]++;
  });

  content.innerHTML = '<div class="section-title">Capacitaciones y Entrenamientos</div>'
    +'<div class="section-sub">Seguimiento del desarrollo profesional del equipo</div>'
    +'<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    +'<thead><tr><th>Empleado</th><th>Curso</th><th>Tipo</th><th>Fecha</th><th>Duracion</th><th>Grado</th><th>Institucion</th><th>Costo</th><th>Acciones</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="9" class="text-center text-muted" style="padding:16px">Sin capacitaciones registradas</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

async function modalCapacitacion(id) {
  var empleados = await dbGetAll('empleados');
  var c = id ? await dbGet('capacitaciones',id) : {};
  var empOpts = empleados.filter(function(e){return e.activo!==false;}).map(function(e){
    return '<option value="'+e.id+'"'+(c.empleadoId===e.id?' selected':'')+'>'+e.nombre+'</option>';
  }).join('');
  var tipos=['Interna','Externa','En linea','Certificacion','Taller','Seminario'];
  var grados=['Aprobado','Reprobado','En progreso','Certificado obtenido','Menccion de honor'];

  openModal('cap_m', id?'Editar Capacitacion':'Nueva Capacitacion',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Empleado *</label><select id="ca_emp">'+empOpts+'</select></div>'
    +'<div class="form-group"><label>Nombre del curso *</label><input id="ca_cur" value="'+(c.curso||'')+'" placeholder="Nombre del curso o entrenamiento"></div>'
    +'</div>'
    +'<div class="form-row form-row-3">'
    +'<div class="form-group"><label>Tipo</label><select id="ca_tip">'+tipos.map(function(t){return '<option value="'+t+'"'+(c.tipo===t?' selected':'')+'>'+t+'</option>';}).join('')+'</select></div>'
    +'<div class="form-group"><label>Fecha de inicio</label><input id="ca_fec" type="date" value="'+(c.fecha||today())+'"></div>'
    +'<div class="form-group"><label>Duracion</label><input id="ca_dur" value="'+(c.duracion||'')+'" placeholder="8 horas, 3 dias, 1 semana..."></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Institucion / Instructor</label><input id="ca_ins" value="'+(c.institucion||'')+'" placeholder="Nombre de la institucion"></div>'
    +'<div class="form-group"><label>Grado obtenido</label><select id="ca_gra">'+grados.map(function(g){return '<option value="'+g+'"'+(c.grado===g?' selected':'')+'>'+g+'</option>';}).join('')+'</select></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Costo de la capacitacion (Q)</label><input id="ca_cos" type="number" value="'+(c.costo||0)+'" step="0.01" min="0"></div>'
    +'<div class="form-group"><label>Numero de diploma/certificado</label><input id="ca_cert" value="'+(c.noCertificado||'')+'" placeholder="No. de certificado si aplica"></div>'
    +'</div>'
    +'<div class="form-group"><label>Temas cubiertos / Descripcion</label><textarea id="ca_tem" style="min-height:60px">'+(c.temas||'')+'</textarea></div>',
    async function(){
      var empId=parseInt($v('ca_emp'));
      var cur=$v('ca_cur').trim();
      if(!empId||!cur){toast('Empleado y curso requeridos','red');return;}
      var emp=empleados.find(function(e){return e.id===empId;});
      var obj={empleadoId:empId,empleadoNombre:emp?emp.nombre:'',curso:cur,
        tipo:$v('ca_tip'),fecha:$v('ca_fec'),duracion:$v('ca_dur').trim(),
        institucion:$v('ca_ins').trim(),grado:$v('ca_gra'),
        costo:$n('ca_cos'),noCertificado:$v('ca_cert').trim(),
        temas:$v('ca_tem').trim(),updatedAt:nowTs()};
      if(id){obj.id=id;await dbPut('capacitaciones',obj);}else{obj.createdAt=nowTs();await dbAdd('capacitaciones',obj);}
      cerrarModal('cap_m');toast(id?'Actualizada':'Registrada');await navTo('capacitacion');
    },true);
}
async function borrarCap(id){if(!confirm('Eliminar?'))return;await dbDelete('capacitaciones',id);await navTo('capacitacion');}

// --- Aumentos Salariales ---
async function renderAumentos(content, actions) {
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Solo administradores</div>';return;}
  var empleados = await dbGetAll('empleados');
  var aumentos  = await dbGetAll('aumentos_salariales');
  actions.innerHTML = '<button class="btn btn-primary" onclick="modalAumento()">+ Proponer aumento</button>'
    +' <button class="btn btn-secondary" onclick="aplicarAumentosAprobados()">Aplicar aprobados</button>';

  var activos = empleados.filter(function(e){return e.activo!==false;});
  var hoy2 = new Date(); hoy2.setHours(0,0,0,0);

  var rows = activos.map(function(e){
    var fi = new Date((e.fechaIngreso||today())+'T00:00:00');
    var aniosComp = Math.floor((hoy2-fi)/(365.25*86400000));
    var ultimoAum = aumentos.filter(function(a){return a.empleadoId===e.id&&a.aplicado;}).sort(function(a,b){return a.fecha<b.fecha?1:-1;})[0];
    var pendAum = aumentos.find(function(a){return a.empleadoId===e.id&&!a.aplicado&&a.estado==='aprobado';});
    return '<tr>'
      +'<td><strong>'+e.nombre+'</strong><div style="font-size:10px;color:var(--text3)">'+(e.cargo||'')+'</div></td>'
      +'<td class="td-mono">'+fmt(e.salarioBase||0)+'</td>'
      +'<td>'+aniosComp+' anio(s)</td>'
      +'<td>'+(ultimoAum?fechaLegible(ultimoAum.fecha)+' (+'+( ultimoAum.porcentaje||0).toFixed(1)+'%)':'Sin aumentos')+'</td>'
      +'<td>'+(pendAum?'<span class="badge badge-green">Aprobado: +'+( pendAum.porcentaje||0).toFixed(1)+'% = '+fmt((e.salarioBase||0)*(1+(pendAum.porcentaje||0)/100))+'</span>':'<span class="badge badge-gray">Sin pendiente</span>')+'</td>'
      +'<td><button class="btn btn-sm btn-primary" onclick="modalAumento('+e.id+')">Proponer aumento</button></td>'
      +'</tr>';
  }).join('');

  content.innerHTML = '<div class="section-title">Aumentos Salariales</div>'
    +'<div class="section-sub">Control de incrementos salariales. Solo el administrador puede aprobar y aplicar.</div>'
    +'<div class="alert alert-blue" style="font-size:11px">El aumento salarial NO es una obligacion legal pero es una herramienta de retencion de talento. Se aplica cuando el administrador lo autoriza.</div>'
    +'<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    +'<thead><tr><th>Empleado</th><th>Salario actual</th><th>Antiguedad</th><th>Ultimo aumento</th><th>Aumento pendiente</th><th>Accion</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="6" class="text-center text-muted" style="padding:16px">Sin empleados</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

async function modalAumento(empId) {
  var empleados = await dbGetAll('empleados');
  var activos = empleados.filter(function(e){return e.activo!==false;});
  var opts = activos.map(function(e){return '<option value="'+e.id+'"'+(empId===e.id?' selected':'')+'>'+e.nombre+' - '+fmt(e.salarioBase||0)+'</option>';}).join('');

  openModal('aum_m','Proponer Aumento Salarial',
    '<div class="alert alert-amber" style="font-size:11px">Solo el administrador puede aprobar y aplicar aumentos. El cambio no afecta el salario hasta que se aplique.</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Empleado *</label><select id="au_emp" onchange="calcPreviewAum()">'+opts+'</select></div>'
    +'<div class="form-group"><label>Porcentaje de aumento (%) *</label><input id="au_pct" type="number" value="5" min="0.1" max="100" step="0.1" oninput="calcPreviewAum()"></div>'
    +'</div>'
    +'<div id="au_preview" style="background:var(--bg3);border-radius:6px;padding:12px;margin-bottom:10px"></div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Fecha efectiva</label><input id="au_fec" type="date" value="'+today()+'"></div>'
    +'<div class="form-group"><label>Motivo del aumento</label><input id="au_mot" placeholder="Aniversario, evaluacion, ajuste..."></div>'
    +'</div>'
    +'<div class="form-group"><label>Estado</label>'
    +'<select id="au_est"><option value="aprobado">Aprobado (se aplicara al confirmar)</option>'
    +'<option value="propuesto">Solo propuesta (requiere aprobacion posterior)</option></select></div>',
    async function(){
      var empId2=parseInt($v('au_emp'));
      var pct=parseFloat($v('au_pct'))||0;
      if(!empId2||!pct){toast('Empleado y porcentaje requeridos','red');return;}
      var emp=empleados.find(function(e){return e.id===empId2;});
      var salNuevo=parseFloat(((emp.salarioBase||0)*(1+pct/100)).toFixed(2));
      var obj={empleadoId:empId2,empleadoNombre:emp?emp.nombre:'',
        salarioAnterior:emp.salarioBase||0,porcentaje:pct,salarioNuevo:salNuevo,
        fecha:$v('au_fec'),motivo:$v('au_mot').trim(),
        estado:$v('au_est'),aplicado:false,
        autorizadoPor:sesionActual?sesionActual.username:'admin',
        createdAt:nowTs()};
      await dbAdd('aumentos_salariales',obj);
      cerrarModal('aum_m');
      toast('Aumento registrado. Usa "Aplicar aprobados" para hacerlo efectivo.');
      await navTo('aumentos');
    },true);
  setTimeout(calcPreviewAum,100);
}

async function calcPreviewAum(){
  var empId=parseInt($v('au_emp'));
  var pct=parseFloat($v('au_pct'))||0;
  var el=document.getElementById('au_preview');if(!el)return;
  if(!empId||!pct){el.innerHTML='';return;}
  var emp=await dbGet('empleados',empId);
  if(!emp){el.innerHTML='';return;}
  var salAnt=emp.salarioBase||0;
  var salNuevo=parseFloat((salAnt*(1+pct/100)).toFixed(2));
  var diff=salNuevo-salAnt;
  el.innerHTML='<div style="font-size:13px">'
    +'<div style="display:flex;justify-content:space-between;padding:3px 0"><span>Salario actual:</span><span class="td-mono">'+fmt(salAnt)+'</span></div>'
    +'<div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--green)"><span>Incremento ('+pct.toFixed(1)+'%):</span><span class="td-mono">+ '+fmt(diff)+'</span></div>'
    +'<div style="display:flex;justify-content:space-between;padding:5px 0;font-weight:700;font-size:14px;border-top:1px solid var(--border);margin-top:4px"><span>Nuevo salario:</span><span class="td-mono text-green">'+fmt(salNuevo)+'</span></div>'
    +'</div>';
}

async function aplicarAumentosAprobados(){
  if(!soloAdmin()){toast('Solo administradores','red');return;}
  var aumentos=await dbGetAll('aumentos_salariales');
  var pendientes=aumentos.filter(function(a){return a.estado==='aprobado'&&!a.aplicado;});
  if(!pendientes.length){toast('Sin aumentos aprobados pendientes de aplicar','amber');return;}
  if(!confirm('Aplicar '+pendientes.length+' aumento(s) salarial(es)? Esta accion modifica los salarios.'))return;
  var count=0;
  for(var i=0;i<pendientes.length;i++){
    var a=pendientes[i];
    var emp=await dbGet('empleados',a.empleadoId);
    if(emp){
      emp.salarioBase=a.salarioNuevo;
      emp.updatedAt=nowTs();
      await dbPut('empleados',emp);
      a.aplicado=true;a.fechaAplicacion=nowTs();
      await dbPut('aumentos_salariales',a);
      count++;
    }
  }
  toast(count+' aumentos aplicados correctamente');
  await navTo('aumentos');
}


function actualizarTopbarUsuario() {
  var tui = document.getElementById('topbar-user-info');
  var tun = document.getElementById('topbar-username');
  if (!sesionActual) return;
  if (tui) tui.style.display = 'flex';
  var perfilLabels = {admin:'Admin',supervisor:'Supervisor',operador:'Operador'};
  if (tun) tun.textContent = (sesionActual.nombre||sesionActual.username) + ' (' + (perfilLabels[sesionActual.perfil]||sesionActual.perfil) + ')';
}

function abrirMenuUsuario() {
  if (!sesionActual) return;
  var perfilLabels = {admin:'Administrador',supervisor:'Supervisor',operador:'Operador'};
  openModal('menuUsr', 'Mi cuenta: '+sesionActual.nombre,
    '<div style="text-align:center;padding:10px 0 16px">'
    + '<div style="font-size:28px;background:var(--bg3);width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;border:2px solid var(--border2)">&#128100;</div>'
    + '<div style="font-size:16px;font-weight:700">'+sesionActual.nombre+'</div>'
    + '<div style="font-size:12px;color:var(--text2)">@'+sesionActual.username+' &mdash; <span class="badge badge-'+(sesionActual.perfil==='admin'?'red':sesionActual.perfil==='supervisor'?'amber':'blue')+'">'+( perfilLabels[sesionActual.perfil]||sesionActual.perfil)+'</span></div>'
    + '</div>'
    + '<div style="display:grid;gap:8px">'
    + '<button class="btn btn-secondary" onclick="irConfigDesdeMenu()" style="width:100%">&#9881; Configuracion del sistema</button>'
    + '<button class="btn btn-secondary" onclick="temaDesdeMenu()" style="width:100%">Cambiar tema</button>'
    + '<button class="btn btn-secondary" onclick="cerrarModal(\'menuUsr\');abrirCambiarPassword()" style="width:100%;background:var(--bg3)">🔒 Cambiar contrase\u00f1a</button>'
    + '<button class="btn btn-danger" onclick="cerrarModal(\'menuUsr\');logout()" style="width:100%">&#128275; Cerrar sesion</button>'
    + '</div>',
    function(){cerrarModal('menuUsr');}, false);
}


function irConfigDesdeMenu() { cerrarModal('menuUsr'); navTo('config'); }
function temaDesdeMenu() { cerrarModal('menuUsr'); abrirSelectorTema(); }

// ================================================================
// MOD C - 5 mejoras correlacionadas
// 1. Facturas FEL - validacion NIT + numero correlativo
// 2. WhatsApp logs - filtros y acciones
// 3. Recepciones - inline cliente+vehiculo
// 4. Cotizaciones -> OT directo
// 5. Reporte general - seleccion de rubros
// ================================================================

// ================================================================
// 1. FACTURAS: FEL correlativo + validacion NIT en tiempo real
// ================================================================

async function modalFactura(id, otData) {
  var clientes = await dbGetAll('clientes');
  var facturasCfg = await dbGet('config','facturas_cfg') || {};
  var cfg = await dbGet('config','taller') || {};
  var felCfg = await dbGet('config','fel') || {};
  var f = id ? await dbGet('facturas', id) : {};
  var od = otData || {};

  // Calcular siguiente numero correlativo FEL
  var todasFacs = await dbGetAll('facturas');
  var prefijo = facturasCfg.serie || 'A';
  var ultimoNum = todasFacs.reduce(function(max, fac) {
    if (fac.serieNumero && fac.serie === prefijo) {
      return Math.max(max, fac.serieNumero || 0);
    }
    return max;
  }, 0);
  var sigNumero = ultimoNum + 1;
  var noFelSugerido = id ? (f.noFactura || '') : (prefijo + '-' + String(sigNumero).padStart(6, '0'));

  // Lineas desde OT si viene de ahi
  var lineasOT = [];
  if (!id && od.manoObra) {
    (od.manoObra||[]).forEach(function(m){ lineasOT.push({desc:'Mano de obra: '+m.concepto, qty:m.horas, unit:m.tarifa, desc_pct:m.descuento||0, tipo:'mo'}); });
    (od.items||[]).forEach(function(i){ lineasOT.push({desc:i.nombre, qty:i.cantidad, unit:i.precio, desc_pct:i.descuento||0, tipo:'rep'}); });
    (od.otrosCargos||[]).forEach(function(oc){ lineasOT.push({desc:oc.concepto, qty:1, unit:oc.monto, desc_pct:oc.descuento||0, tipo:'otro'}); });
  }
  var lineasExist = f.lineas || lineasOT;
  if (!lineasExist.length) lineasExist = [{desc:'', qty:1, unit:0, desc_pct:0}];

  var cliOpts = '<option value="">Seleccionar cliente...</option>' +
    clientes.map(function(c){
      return '<option value="'+c.id+'|'+encodeURIComponent(c.nit||'CF')+'|'+encodeURIComponent(c.nombre)+'|'+encodeURIComponent(c.direccion||'')+'"'
        +((f.clienteId||od.clienteId)===c.id?' selected':'')+'>'
        +c.nombre+' - '+(c.nit||'CF')+'</option>';
    }).join('');

  function lRow(l, i) {
    var tot = ((l.qty||1)*(l.unit||0)*(1-(l.desc_pct||0)/100)).toFixed(2);
    return '<div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr 80px auto;gap:6px;margin-bottom:6px;align-items:center" id="lr'+i+'">'
      +'<input placeholder="Descripcion" value="'+(l.desc||'')+'" id="ld'+i+'" oninput="calcTotFac();calcLFTotal('+i+')" style="font-size:13px">'
      +'<input type="number" value="'+(l.qty||1)+'" id="lq'+i+'" step="0.01" min="0" oninput="calcTotFac();calcLFTotal('+i+')" style="font-size:13px">'
      +'<input type="number" value="'+(l.unit||0)+'" id="lu'+i+'" step="0.01" min="0" oninput="calcTotFac();calcLFTotal('+i+')" style="font-size:13px">'
      +'<input type="number" value="'+(l.desc_pct||0)+'" id="lp'+i+'" min="0" max="100" oninput="calcTotFac();calcLFTotal('+i+')" style="font-size:13px">'
      +'<div id="lt'+i+'" style="font-family:var(--font-mono);font-size:12px;font-weight:700;color:var(--green);text-align:right;padding:7px 4px">Q '+tot+'</div>'
      +'<button class="btn btn-sm btn-danger btn-icon" onclick="document.getElementById(\'lr'+i+'\').remove();calcTotFac()" style="margin-top:0">X</button>'
      +'</div>';
  }
  window._lRow = lRow;

  openModal('fac', id ? 'Editar Factura' : 'Nueva Factura FEL', 
    // Cabecera FEL
    '<div class="alert alert-blue" style="font-size:11px">'
    +(felCfg.habilitado ? '<strong>FEL activo:</strong> '+felCfg.certificadora+' | Ambiente: '+felCfg.ambiente : '<strong>FEL no configurado.</strong> <a onclick="cerrarModal(\'fac\');navTo(\'fel\')" style="cursor:pointer;color:var(--accent)">Configurar FEL</a>')
    +'</div>'
    +'<div class="form-row form-row-3">'
    +'<div class="form-group"><label>No. Factura / Serie FEL *</label>'
    +'<input id="f_no" value="'+noFelSugerido+'" placeholder="A-000001">'
    +'<div class="form-hint">Serie: '+prefijo+' | Correlativo: '+sigNumero+'</div></div>'
    +'<div class="form-group"><label>Fecha *</label>'
    +'<input id="f_fe" type="date" value="'+(f.fecha||today())+'"></div>'
    +'<div class="form-group"><label>Forma de pago</label>'
    +'<select id="f_pa">'
    +'<option value="efectivo"'+((!f.formaPago||f.formaPago==='efectivo')?' selected':'')+'>Efectivo</option>'
    +'<option value="transferencia"'+(f.formaPago==='transferencia'?' selected':'')+'>Transferencia</option>'
    +'<option value="tarjeta"'+(f.formaPago==='tarjeta'?' selected':'')+'>Tarjeta</option>'
    +'<option value="cheque"'+(f.formaPago==='cheque'?' selected':'')+'>Cheque</option>'
    +'<option value="credito"'+(f.formaPago==='credito'?' selected':'')+'>Credito</option>'
    +'</select></div></div>'
    // Seccion cliente con validacion NIT
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Cliente *</label>'
    +'<select id="f_cl" onchange="onClienteFacChange()">'+cliOpts+'</select></div>'
    +'<div class="form-group"><label>NIT del cliente *</label>'
    +'<div style="display:flex;gap:6px">'
    +'<input id="f_ni" value="'+(f.nit||od.nit||'CF')+'" placeholder="NIT o CF" oninput="validarNITFacInput()">'
    +'<button class="btn btn-sm btn-secondary" onclick="validarNITFacInput()" style="white-space:nowrap">Validar</button>'
    +'</div>'
    +'<div id="nit_fac_status" style="margin-top:4px;font-size:11px"></div>'
    +'</div></div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Nombre en factura</label>'
    +'<input id="f_nombre_fac" value="'+(f.clienteNombreFac||f.clienteNombre||od.clienteNombre||'')+'" placeholder="Nombre como aparece en factura"></div>'
    +'<div class="form-group"><label>Referencia / OT</label>'
    +'<input id="f_re" value="'+(f.descripcion||od.noOT||od.descripcion||'')+'" placeholder="No. OT o referencia"></div>'
    +'</div>'
    // Lineas
    +'<div class="divider"></div>'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'
    +'<span class="card-title">Lineas de la factura</span>'
    +'<button class="btn btn-sm btn-secondary" onclick="addLF()">+ Agregar linea</button>'
    +'</div>'
    +'<div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr 80px auto;gap:6px;margin-bottom:4px">'
    +'<small class="text-muted">Descripcion</small>'
    +'<small class="text-muted">Cant.</small>'
    +'<small class="text-muted">Precio unit. Q</small>'
    +'<small class="text-muted">Desc.%</small>'
    +'<small class="text-muted" style="text-align:right">Total Q</small>'
    +'<span></span></div>'
    +'<div id="lf_list">'+lineasExist.map(function(l,i){return lRow(l,i);}).join('')+'</div>'
    +'<div id="fac_tots" style="text-align:right;margin-top:12px"></div>'
    +(id?'<div class="form-group mt-2"><label><input type="checkbox" id="f_pg"'+(f.pagada?' checked':'')+' style="width:auto;margin-right:6px"> Marcar como pagada</label></div>':''),
    async function(){
      // Validar NIT antes de guardar
      var nit = $v('f_ni').trim() || 'CF';
      var nitOk = validarNITCompleto ? validarNITCompleto(nit) : {valido:true};
      if (!nitOk.valido) {
        var cont = confirm('El NIT "'+nit+'" no paso la validacion SAT (Modulo 11). Guardar de todas formas?');
        if (!cont) return;
      }
      var parts = ($v('f_cl')||'').split('|');
      var cId = parseInt(parts[0]);
      var cli = clientes.find(function(c){return c.id===cId;});
      var lineas = getLF();
      if (!lineas.length) { toast('Agrega al menos una linea','red'); return; }
      var subB = lineas.reduce(function(a,l){return a+l.qty*l.unit;},0);
      var descT = lineas.reduce(function(a,l){return a+l.qty*l.unit*(l.desc_pct||0)/100;},0);
      var sub = parseFloat((subB-descT).toFixed(2));
      var iva = parseFloat((sub*0.12).toFixed(2));
      var tot = parseFloat((sub+iva).toFixed(2));
      var obj = {
        noFactura: $v('f_no').trim(),
        serie: prefijo,
        serieNumero: sigNumero,
        fecha: $v('f_fe'),
        formaPago: $v('f_pa'),
        clienteId: cId,
        clienteNombre: cli ? cli.nombre : '',
        clienteNombreFac: $v('f_nombre_fac').trim() || (cli ? cli.nombre : ''),
        clienteDireccion: cli ? (cli.direccion||'') : '',
        nit: nit,
        descripcion: $v('f_re').trim(),
        lineas: lineas,
        subtotalBruto: subB,
        descuentoTotal: descT,
        subtotal: sub,
        iva: iva,
        total: tot,
        felHabilitado: felCfg.habilitado || false,
        felCertificadora: felCfg.certificadora || '',
        pagada: id ? $c('f_pg') : false,
        updatedAt: nowTs()
      };
      if (!obj.noFactura) { toast('Numero de factura requerido','red'); return; }
      if (id) { obj.id=id; await dbPut('facturas',obj); }
      else { obj.createdAt=nowTs(); await dbAdd('facturas',obj); }
      await logAuditoria(id?'EDITAR':'CREAR','facturas',(id?'Factura editada':'Factura emitida')+': '+(obj.noFactura||''),{total:obj.total});
      cerrarModal('fac');
      toast(id ? 'Factura actualizada' : 'Factura emitida');
      await navTo('facturas');
    }, true);
  setTimeout(function(){
    calcTotFac();
    agregarBotonesInline([{selectId:'f_cl',tipo:'cliente'}]);
    // Pre-validar NIT si ya hay uno
    var nitEl = document.getElementById('f_ni');
    if (nitEl && nitEl.value && nitEl.value !== 'CF') validarNITFacInput();
  }, 150);
}

function onClienteFacChange() {
  var parts = ($v('f_cl')||'').split('|');
  var nitEl = document.getElementById('f_ni');
  var nomEl = document.getElementById('f_nombre_fac');
  if (nitEl) { nitEl.value = decodeURIComponent(parts[1]||'CF'); validarNITFacInput(); }
  if (nomEl) nomEl.value = decodeURIComponent(parts[2]||'');
}

function validarNITFacInput() {
  var nit = $v('f_ni').trim();
  var el = document.getElementById('nit_fac_status');
  if (!el) return;
  if (!nit || nit.toUpperCase()==='CF') {
    el.innerHTML = '<span style="color:var(--text3)">Consumidor Final - siempre valido</span>';
    el.style.background='';
    return;
  }
  var r = validarNITCompleto ? validarNITCompleto(nit) : {valido:true,mensaje:'OK'};
  if (r.valido) {
    el.innerHTML = '<span style="color:var(--green)">&#10003; NIT valido (Modulo 11 SAT)</span>';
  } else {
    el.innerHTML = '<span style="color:var(--red)">&#10005; ' + (r.error||'NIT invalido') + '</span>';
  }
}

// ================================================================
// 2. WHATSAPP: LOGS CON FILTROS Y ACCIONES
// ================================================================

async function renderWhatsApp(content, actions) {
  var cfg      = await dbGet('config','taller') || {};
  var waCfg    = await dbGet('config','whatsapp') || {};
  var notif    = await dbGet('config','notificaciones') || {};
  var clientes  = await dbGetAll('clientes');
  var vehiculos = await dbGetAll('vehiculos');
  var hoy2     = new Date(); hoy2.setHours(0,0,0,0);
  var histMsgs = await dbGetAll('whatsapp_logs');
  var filtroWA = window._waFiltro || 'todos';

  actions.innerHTML = '<button class="btn btn-primary" onclick="enviarAlertasAutomaticas()">Enviar alertas pendientes</button>';

  // Vehiculos proximos al servicio
  var diasAlert = waCfg.diasAnticipacion || 7;
  var proximos = vehiculos.filter(function(v){
    if (!v.proximoServicio) return false;
    var d = Math.round((new Date(v.proximoServicio+'T00:00:00')-hoy2)/86400000);
    return d >= -3 && d <= diasAlert;
  }).map(function(v){
    var cli = clientes.find(function(c){return c.id===v.clienteId;});
    return Object.assign({},v,{clienteObj:cli, diasR:Math.round((new Date(v.proximoServicio+'T00:00:00')-hoy2)/86400000)});
  });

  // Filtros para logs
  var filtros = [
    {k:'todos', label:'Todos ('+histMsgs.length+')'},
    {k:'enviado', label:'Enviados ('+histMsgs.filter(function(m){return m.estado==='enviado';}).length+')'},
    {k:'error', label:'Errores ('+histMsgs.filter(function(m){return m.estado==='error';}).length+')'},
    {k:'leido', label:'Leidos ('+histMsgs.filter(function(m){return m.leido;}).length+')'},
    {k:'no_leido', label:'No leidos ('+histMsgs.filter(function(m){return !m.leido&&m.estado==='enviado';}).length+')'},
  ];
  var filtroHtml = '<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">'
    + filtros.map(function(f){
      return '<button class="btn btn-sm '+(filtroWA===f.k?'btn-primary':'btn-secondary')+'" onclick="filtrarWA(\''+f.k+'\')">'+f.label+'</button>';
    }).join('') + '</div>';

  var msgsFiltrados = histMsgs.filter(function(m){
    if (filtroWA==='enviado') return m.estado==='enviado';
    if (filtroWA==='error') return m.estado==='error';
    if (filtroWA==='leido') return m.leido;
    if (filtroWA==='no_leido') return !m.leido && m.estado==='enviado';
    return true;
  }).sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;});

  var filasLogs = msgsFiltrados.slice(0,50).map(function(m){
    return '<tr style="'+(m.leido?'opacity:.6':'')+'"><td style="font-size:10px">'+fechaLegible(m.fecha)+'</td>'
      +'<td>'+m.destinatario+'</td>'
      +'<td style="font-size:11px;max-width:200px">'+(m.mensaje||'').slice(0,60)+'...</td>'
      +'<td><span class="badge badge-'+(m.estado==='enviado'?'green':'red')+'">'+m.estado+'</span></td>'
      +'<td><div class="flex gap-1">'
      +(!m.leido?'<button class="btn btn-sm btn-secondary" onclick="marcarMsgLeido('+m.id+')">Leido</button>':'')
      +'<button class="btn btn-sm btn-danger" onclick="borrarMsgWA('+m.id+')">X</button>'
      +'</div></td></tr>';
  }).join('');

  var filasPendientes = proximos.map(function(v){
    var cli = v.clienteObj;
    var tel = cli ? (cli.whatsapp||cli.telefono||'') : '';
    var col = v.diasR<0?'red':v.diasR<=3?'red':v.diasR<=7?'amber':'green';
    var label = v.diasR<0?'Vencido':v.diasR===0?'Hoy':'En '+v.diasR+'d';
    return '<tr>'
      +'<td>'+(cli?cli.nombre:'---')+'</td>'
      +'<td class="td-mono">'+v.placa+'</td>'
      +'<td style="font-size:11px">'+v.marca+' '+v.modelo+'</td>'
      +'<td>'+(v.tipoServicio||'Servicio')+'</td>'
      +'<td>'+fechaLegible(v.proximoServicio)+'</td>'
      +'<td><span class="badge badge-'+col+'">'+label+'</span></td>'
      +'<td style="font-size:11px">'+(tel||'Sin tel.')+'</td>'
      +'<td><div class="flex gap-1">'
      +(tel?'<button class="btn btn-sm btn-green" onclick="enviarMsgServicio('+v.clienteId+','+v.id+')">Enviar</button>':'')
      +'<button class="btn btn-sm btn-secondary" onclick="previewMsg('+v.clienteId+','+v.id+')">Preview</button>'
      +'</div></td></tr>';
  }).join('');

  content.innerHTML = '<div class="section-title">WhatsApp Bot</div>'
    +'<div class="section-sub">Notificaciones automaticas via CallMeBot</div>'

    // Config
    +'<div class="card"><div class="card-header"><span class="card-title">Configuracion CallMeBot</span>'
    +'<button class="btn btn-sm btn-primary" onclick="guardarConfigWA()">Guardar</button></div>'
    +'<div class="alert alert-amber" style="font-size:11px">Cada destinatario debe enviar <strong>"I allow callmebot to send me messages"</strong> al <strong>+34 644 44 00 05</strong> en WhatsApp para activarse.'
    +' <a href="https://www.callmebot.com" target="_blank" style="color:var(--accent)">Ver doc.</a></div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>API Key CallMeBot</label><input id="wa_apikey" value="'+(waCfg.apiKey||'')+'" placeholder="Tu API key"></div>'
    +'<div class="form-group"><label>Tu numero (+502XXXXXXXX)</label><input id="wa_numero" value="'+(waCfg.numero||'')+'" placeholder="+50212345678" onblur="onTelBlur(this)"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Dias de anticipacion</label><input id="wa_dias" type="number" value="'+(waCfg.diasAnticipacion||7)+'" min="1" max="30"></div>'
    +'<div class="form-group"><label>Nombre del taller en mensajes</label><input id="wa_nombre" value="'+(waCfg.nombreTaller||cfg.nombre||'')+'" placeholder="Nombre del taller"></div>'
    +'</div>'
    +'<div class="form-group"><label>Plantilla (usa {cliente}, {placa}, {modelo}, {fecha}, {servicio}, {taller}, {telefono})</label>'
    +'<textarea id="wa_template" style="min-height:70px">'+(waCfg.template||'Hola {cliente}! Le recordamos que su vehiculo {placa} ({modelo}) tiene programado su *{servicio}* el *{fecha}*. Para reagendar llame a {taller} al {telefono}. Gracias!')+'</textarea></div>'
    +'</div>'

    // Servicios proximos
    +'<div class="card"><div class="card-header"><span class="card-title">Servicios proximos ('+proximos.length+')</span></div>'
    +'<div class="table-wrap"><table>'
    +'<thead><tr><th>Cliente</th><th>Placa</th><th>Vehiculo</th><th>Servicio</th><th>Fecha</th><th>Estado</th><th>WhatsApp</th><th>Accion</th></tr></thead>'
    +'<tbody>'+(filasPendientes||'<tr><td colspan="8" class="text-center text-muted" style="padding:12px">Sin servicios proximos</td></tr>')+'</tbody>'
    +'</table></div></div>'

    // Logs con filtros
    +'<div class="card"><div class="card-header"><span class="card-title">Historial de mensajes</span>'
    +'<div class="flex gap-1">'
    +'<button class="btn btn-sm btn-secondary" onclick="marcarTodosMsgsLeidos()">Todos leidos</button>'
    +'<button class="btn btn-sm btn-danger" onclick="borrarMsgsLeidos()">Borrar leidos</button>'
    +'</div></div>'
    + filtroHtml
    +'<div class="table-wrap"><table>'
    +'<thead><tr><th>Fecha</th><th>Destinatario</th><th>Mensaje</th><th>Estado</th><th>Acciones</th></tr></thead>'
    +'<tbody>'+(filasLogs||'<tr><td colspan="5" class="text-center text-muted" style="padding:12px">Sin mensajes</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

function filtrarWA(filtro) { window._waFiltro=filtro; navTo('whatsapp'); }

async function marcarMsgLeido(id) {
  var m = await dbGet('whatsapp_logs',id);
  if (m) { m.leido=true; await dbPut('whatsapp_logs',m); }
  navTo('whatsapp');
}

async function borrarMsgWA(id) {
  await dbDelete('whatsapp_logs',id);
  navTo('whatsapp');
}

async function marcarTodosMsgsLeidos() {
  var all = await dbGetAll('whatsapp_logs');
  for (var i=0;i<all.length;i++) { all[i].leido=true; await dbPut('whatsapp_logs',all[i]); }
  toast('Todos marcados como leidos');
  navTo('whatsapp');
}

async function borrarMsgsLeidos() {
  if (!confirm('Eliminar todos los mensajes leidos?')) return;
  var all = await dbGetAll('whatsapp_logs');
  var leidos = all.filter(function(m){return m.leido;});
  for (var i=0;i<leidos.length;i++) await dbDelete('whatsapp_logs',leidos[i].id);
  toast(leidos.length+' mensajes eliminados');
  navTo('whatsapp');
}

// ================================================================
// 3. RECEPCIONES: INLINE CLIENTE+VEHICULO
// ================================================================

async function modalRecepcion(id) {
  var clientes  = await dbGetAll('clientes');
  var vehiculos = await dbGetAll('vehiculos');
  var empleados = await dbGetAll('empleados');
  var r = id ? await dbGet('recepciones',id) : {};
  var nuevoNoREC = id ? (r.noRecepcion||'') : await generarNumeroREC();

  var cliOpts = '<option value="">Seleccionar cliente...</option>'
    + clientes.map(function(c){
      return '<option value="'+c.id+'"'+(r.clienteId===c.id?' selected':'')+'>'+c.nombre+'</option>';
    }).join('');

  var vehOpts = '<option value="">Seleccionar vehiculo...</option>'
    + vehiculos.map(function(v){
      return '<option value="'+v.id+'"'+(r.vehiculoId===v.id?' selected':'')+'>'+v.placa+' - '+v.marca+' '+v.modelo+'</option>';
    }).join('');

  var tecOpts = '<option value="">Seleccionar...</option>'
    + empleados.filter(function(e){return e.activo!==false;}).map(function(e){
      return '<option value="'+e.nombre+'"'+(r.tecnico===e.nombre?' selected':'')+'>'+e.nombre+'</option>';
    }).join('');

  var horaActual = new Date().toTimeString().slice(0,5);

  openModal('rec', id ? 'Editar Recepcion' : 'Recepcion de Vehiculo',
    '<div class="alert alert-amber" style="font-size:11px">FORMATO DE INGRESO AL TALLER</div>'
    +'<div class="form-row form-row-3">'
    +'<div class="form-group"><label>No. Recepcion</label><input id="r_no" value="'+(r.noRecepcion||('REC-'+Date.now().toString(36).toUpperCase()))+'"></div>'
    +'<div class="form-group"><label>Fecha *</label><input id="r_fec" type="date" value="'+(r.fecha||today())+'"></div>'
    +'<div class="form-group"><label>Hora</label><input id="r_hor" type="time" value="'+(r.hora||horaActual)+'"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Cliente *</label>'
    +'<select id="r_cli" onchange="filtrarVehPorCli()">'+cliOpts+'</select>'
    +'</div>'
    +'<div class="form-group"><label>Vehiculo *</label>'
    +'<select id="r_veh">'+vehOpts+'</select>'
    +'</div>'
    +'</div>'
    +'<div class="form-row form-row-3">'
    +'<div class="form-group"><label>Km entrada</label><input id="r_km" type="number" value="'+(r.kmEntrada||'')+'" placeholder="45000"></div>'
    +'<div class="form-group"><label>Combustible</label>'
    +'<select id="r_com">'
    +'<option value="E">E - Vacio</option><option value="1/4">1/4</option>'
    +'<option value="1/2"'+((!r.combustible||r.combustible==='1/2')?' selected':'')+'>1/2</option>'
    +'<option value="3/4">3/4</option><option value="F">F - Lleno</option>'
    +'</select></div>'
    +'<div class="form-group"><label>Tipo servicio</label>'
    +'<select id="r_tip">'
    +'<option value="preventivo"'+(r.tipoServicio==='preventivo'?' selected':'')+'>Preventivo</option>'
    +'<option value="correctivo"'+(r.tipoServicio==='correctivo'?' selected':'')+'>Correctivo</option>'
    +'<option value="diagnostico"'+(r.tipoServicio==='diagnostico'?' selected':'')+'>Diagnostico</option>'
    +'<option value="garantia"'+(r.tipoServicio==='garantia'?' selected':'')+'>Garantia</option>'
    +'</select></div>'
    +'</div>'
    +'<div class="form-group"><label>Motivo / Sintomas</label>'
    +'<textarea id="r_mot" placeholder="Describir el problema o servicio solicitado...">'+(r.motivo||'')+'</textarea></div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Danos preexistentes</label>'
    +'<textarea id="r_dan" style="min-height:55px" placeholder="Rayones, abolladuras...">'+(r.danosPreexistentes||'')+'</textarea></div>'
    +'<div class="form-group"><label>Accesorios entregados</label>'
    +'<textarea id="r_acc" style="min-height:55px">'+(r.accesorios||'')+'</textarea></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Quien entrega el vehiculo</label>'
    +'<input id="r_ent" value="'+(r.nombreEntrega||'')+'" placeholder="Nombre del propietario o representante"></div>'
    +'<div class="form-group"><label>Tecnico asignado</label>'
    +'<select id="r_tec">'+tecOpts+'</select></div>'
    +'</div>',
    async function(){
      var cliId = parseInt($v('r_cli'));
      var vehId = parseInt($v('r_veh'));
      if (!cliId || !vehId) { toast('Cliente y vehiculo requeridos','red'); return; }
      var cli = clientes.find(function(c){return c.id===cliId;});
      var veh = vehiculos.find(function(v){return v.id===vehId;});
      var obj = {
        noRecepcion:$v('r_no').trim(),
        fecha:$v('r_fec'), hora:$v('r_hor'),
        clienteId:cliId, clienteNombre:cli?cli.nombre:'',
        vehiculoId:vehId, placa:veh?veh.placa:'',
        vehiculoDesc:veh?(veh.marca+' '+veh.modelo+' '+(veh.anio||'')).trim():'',
        kmEntrada:parseInt($v('r_km'))||0,
        combustible:$v('r_com'),
        tipoServicio:$v('r_tip'),
        motivo:$v('r_mot').trim(),
        danosPreexistentes:$v('r_dan').trim(),
        accesorios:$v('r_acc').trim(),
        nombreEntrega:$v('r_ent').trim(),
        tecnico:$v('r_tec'),
        estado:r.estado||'recibido',
        updatedAt:nowTs()
      };
      if (id) { obj.id=id; await dbPut('recepciones',obj); }
      else { obj.createdAt=nowTs(); await dbAdd('recepciones',obj); }
      cerrarModal('rec');
      toast(id?'Recepcion actualizada':'Vehiculo recibido');
      await navTo('recepciones');
    }, true);

  // Agregar botones inline + filtrar vehiculos por cliente
  setTimeout(function(){
    agregarBotonesInline([{selectId:'r_cli',tipo:'cliente'}]);
    // Boton para crear cliente+vehiculo juntos
    var cliSel = document.getElementById('r_cli');
    if (cliSel) {
      var btn = document.createElement('button');
      btn.type='button';
      btn.className='btn btn-sm btn-primary';
      btn.style.cssText='margin-top:4px;font-size:11px';
      btn.textContent='+ Nuevo cliente + vehiculo juntos';
      btn.onclick = function(){
        crearClienteVehiculoInline(function(nuevo){
          // Agregar cliente al select
          var optC = document.createElement('option');
          optC.value=nuevo.clienteId; optC.textContent=nuevo.clienteNombre; optC.selected=true;
          cliSel.appendChild(optC);
          // Agregar vehiculo al select de vehiculos
          var vehSel = document.getElementById('r_veh');
          if (vehSel) {
            var optV = document.createElement('option');
            optV.value=nuevo.vehiculoId;
            optV.textContent=nuevo.placa+(nuevo.vehiculoDesc?' - '+nuevo.vehiculoDesc:'');
            optV.selected=true;
            vehSel.appendChild(optV);
          }
        });
      };
      cliSel.parentNode.appendChild(btn);
    }
    if (r.clienteId) filtrarVehPorCli();
  }, 150);
}

function filtrarVehPorCli() {
  var cliId = parseInt($v('r_cli'));
  if (!cliId) return;
  dbGetAll('vehiculos').then(function(vehs){
    var sel = document.getElementById('r_veh');
    if (!sel) return;
    var filtrados = vehs.filter(function(v){return v.clienteId===cliId;});
    var opts = '<option value="">Seleccionar vehiculo...</option>'
      + filtrados.map(function(v){
          return '<option value="'+v.id+'">'+v.placa+' - '+v.marca+' '+v.modelo+'</option>';
        }).join('');
    sel.innerHTML = opts;
  });
}

// ================================================================
// 4. COTIZACIONES -> OT DIRECTO
// ================================================================

async function cotizacionAOrden(cotId) {
  var c = await dbGet('cotizaciones', cotId);
  if (!c) return;

  var clientes  = await dbGetAll('clientes');
  var vehiculos = await dbGetAll('vehiculos');
  var empleados = await dbGetAll('empleados');
  var cfg       = await dbGet('config','taller') || {};

  // Marcar cotizacion como aprobada
  c.estado = 'aprobada';
  await dbPut('cotizaciones', c);

  // Construir lineas de OT desde la cotizacion
  var moItems = (c.servicios||[]).map(function(s){
    return {concepto:s.label, horas:s.horas||1, tarifa:c.tarifaHora||cfg.tarifaHora||150, descuento:0};
  });
  var noOT = 'OT-'+Date.now().toString(36).toUpperCase();

  var cliOpts = clientes.map(function(cl){
    return '<option value="'+cl.id+'"'+(c.clienteId===cl.id?' selected':'')+'>'+cl.nombre+'</option>';
  }).join('');
  var vehOpts = vehiculos.filter(function(v){return v.clienteId===c.clienteId;}).map(function(v){
    return '<option value="'+v.id+'"'+(c.vehiculoId===v.id?' selected':'')+'>'+v.placa+' - '+v.marca+' '+v.modelo+'</option>';
  }).join('');
  var tecOpts = '<option value="">Seleccionar...</option>'
    + empleados.filter(function(e){return e.activo!==false;}).map(function(e){
        return '<option value="'+e.nombre+'">'+e.nombre+'</option>';
      }).join('');

  openModal('cot2ot','Crear OT desde Cotizacion: '+c.noCotizacion,
    '<div class="alert alert-green" style="font-size:11px">Cotizacion aprobada. Se creara una OT con los servicios cotizados.</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>No. OT</label><input id="c2o_no" value="'+noOT+'"></div>'
    +'<div class="form-group"><label>Fecha</label><input id="c2o_fe" type="date" value="'+today()+'"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Cliente</label><select id="c2o_cli">'+cliOpts+'</select></div>'
    +'<div class="form-group"><label>Vehiculo</label><select id="c2o_veh">'+vehOpts+'</select></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Tecnico asignado</label><select id="c2o_tec">'+tecOpts+'</select></div>'
    +'<div class="form-group"><label>Prioridad</label>'
    +'<select id="c2o_pri"><option value="normal">Normal</option><option value="urgente">Urgente</option></select>'
    +'</div></div>'
    +'<div class="form-group"><label>Descripcion del trabajo</label>'
    +'<textarea id="c2o_desc">'+(c.servicios||[]).map(function(s){return s.label;}).join(', ')+'</textarea></div>'
    +'<div class="card" style="padding:10px;margin-top:4px">'
    +'<div class="card-title" style="margin-bottom:6px">Servicios de la cotizacion</div>'
    +(c.servicios||[]).map(function(s){
      return '<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;border-bottom:1px solid var(--border)">'
        +'<span>'+s.label+'</span><span class="td-mono">'+s.horas+'h | Q'+( (s.precio||0)+(s.moLinea||0)).toFixed(2)+'</span></div>';
    }).join('')
    +'<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;padding:6px 0;border-top:2px solid var(--border);margin-top:4px">'
    +'<span>Total cotizado:</span><span class="td-mono text-green">Q '+(c.totalConIVA||0).toFixed(2)+'</span></div>'
    +'</div>',
    async function(){
      var cliId = parseInt($v('c2o_cli'));
      var vehId = parseInt($v('c2o_veh'));
      var cli = clientes.find(function(cl){return cl.id===cliId;});
      var veh = vehiculos.find(function(v){return v.id===vehId;});
      var desc = $v('c2o_desc').trim();
      var tec  = $v('c2o_tec');
      var noOT2 = $v('c2o_no').trim();
      var tar = c.tarifaHora||cfg.tarifaHora||150;

      // Calcular totales
      var subMO = moItems.reduce(function(a,m){return a+m.horas*m.tarifa;},0);
      var subIT = (c.servicios||[]).reduce(function(a,s){return a+(s.precio||0);},0);
      var sub = parseFloat((subMO+subIT).toFixed(2));
      var iva = parseFloat((sub*0.12).toFixed(2));
      var tot = parseFloat((sub+iva).toFixed(2));

      var otObj = {
        noOT:noOT2, fecha:$v('c2o_fe'),
        tipoServicio:'correctivo',
        clienteId:cliId, clienteNombre:cli?cli.nombre:'',
        vehiculoId:vehId, placa:veh?veh.placa:'',
        tecnico:tec, estado:'nuevo',
        prioridad:$v('c2o_pri'),
        descripcion:desc,
        manoObra:moItems,
        items:[], otrosCargos:[],
        cotizacionId:cotId, noCotizacion:c.noCotizacion,
        subtotalMO:subMO, subtotalIT:subIT,
        subtotal:sub, iva:iva, totalConIVA:tot,
        createdAt:nowTs(), updatedAt:nowTs()
      };
      await dbAdd('ordenes', otObj);
      cerrarModal('cot2ot');
      toast('OT '+noOT2+' creada desde cotizacion '+c.noCotizacion,'green');
      await navTo('ordenes');
    }, true);
}

// ================================================================
// 5. REPORTE GENERAL - SELECCION DE RUBROS MEJORADA
// ================================================================

async function renderReporteGeneral(content, actions) {
  if (!soloAdmin()) { content.innerHTML='<div class="alert alert-red">Solo administradores</div>'; return; }
  actions.innerHTML = '<button class="btn btn-primary" onclick="generarReporteSeleccion()">Generar e imprimir</button>'
    + ' <button class="btn btn-secondary" onclick="exportarReporteCSV()">Exportar CSV</button>';

  var rubros = [
    {id:'resumen',    label:'Resumen ejecutivo', grupo:'Financiero', checked:true},
    {id:'facturas',   label:'Facturacion del mes', grupo:'Financiero', checked:true},
    {id:'impuestos',  label:'IVA / ISR estimado', grupo:'Financiero', checked:true},
    {id:'costos',     label:'Costos operativos del mes', grupo:'Financiero', checked:true},
    {id:'bancos',     label:'Saldo cuentas bancarias', grupo:'Financiero', checked:false},
    {id:'activos',    label:'Activos y depreciacion', grupo:'Financiero', checked:false},
    {id:'empleados',  label:'Nomina y empleados activos', grupo:'RRHH', checked:true},
    {id:'provisiones',label:'Provisiones laborales (B14/Agui/Vac/Indem)', grupo:'RRHH', checked:true},
    {id:'vacaciones', label:'Vacaciones pendientes', grupo:'RRHH', checked:false},
    {id:'llamadas',   label:'Llamadas de atencion', grupo:'RRHH', checked:false},
    {id:'capacitacion',label:'Capacitaciones', grupo:'RRHH', checked:false},
    {id:'ordenes',    label:'Ordenes de trabajo del mes', grupo:'Taller', checked:true},
    {id:'cotizaciones',label:'Cotizaciones pendientes', grupo:'Taller', checked:true},
    {id:'recepciones',label:'Recepciones del mes', grupo:'Taller', checked:false},
    {id:'repuestos',  label:'Inventario repuestos (stock bajo)', grupo:'Inventario', checked:true},
    {id:'insumos',    label:'Inventario insumos', grupo:'Inventario', checked:false},
    {id:'proveedores',label:'Proveedores activos', grupo:'Inventario', checked:false},
    {id:'clientes',   label:'Clientes registrados', grupo:'Clientes', checked:false},
    {id:'flota',      label:'Contratos de flota activos', grupo:'Clientes', checked:true},
    {id:'envios',     label:'Envios en proceso', grupo:'Clientes', checked:false},
    {id:'srvexternos',label:'Servicios externos en proceso', grupo:'Operativo', checked:true},
    {id:'alertas',    label:'Alertas pendientes', grupo:'Operativo', checked:true},
    {id:'viaticos',   label:'Viaticos del mes', grupo:'Operativo', checked:false},
    {id:'whatsapp',   label:'Mensajes WhatsApp enviados', grupo:'Operativo', checked:false},
  ];

  // Agrupar
  var grupos = {};
  rubros.forEach(function(r){
    if (!grupos[r.grupo]) grupos[r.grupo]=[];
    grupos[r.grupo].push(r);
  });

  var gruposHTML = Object.entries(grupos).map(function(entry){
    var nombre=entry[0]; var items=entry[1];
    return '<div class="card" style="margin-bottom:10px">'
      +'<div class="card-header"><span class="card-title">'+nombre+'</span>'
      +'<div class="flex gap-1">'
      +'<button class="btn btn-sm btn-secondary" onclick="toggleGrupoRubros(\''+nombre+'\',true)">Todos</button>'
      +'<button class="btn btn-sm btn-secondary" onclick="toggleGrupoRubros(\''+nombre+'\',false)">Ninguno</button>'
      +'</div></div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">'
      +items.map(function(r){
        return '<label style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:var(--bg3);border-radius:6px;cursor:pointer;font-size:12px">'
          +'<input type="checkbox" value="'+r.id+'" data-grupo="'+r.grupo+'" class="rubro_cb"'+(r.checked?' checked':'')+' style="width:auto"> '
          +r.label+'</label>';
      }).join('')
      +'</div></div>';
  }).join('');

  content.innerHTML = '<div class="section-title">Reporte General</div>'
    +'<div class="section-sub">Selecciona los rubros a incluir en el reporte imprimible</div>'
    +'<div class="card">'
    +'<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">'
    +'<button class="btn btn-sm btn-secondary" onclick="toggleTodosRubros(true)">Seleccionar todos</button>'
    +'<button class="btn btn-sm btn-secondary" onclick="toggleTodosRubros(false)">Deseleccionar todos</button>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Periodo del reporte</label><input id="rep_periodo" value="'+today().slice(0,7)+'" placeholder="YYYY-MM"></div>'
    +'<div class="form-group"><label>Titulo del reporte</label><input id="rep_titulo" value="Reporte General '+today().slice(0,7)+'"></div>'
    +'</div></div>'
    + gruposHTML;
}

function toggleGrupoRubros(grupo, val) {
  document.querySelectorAll('.rubro_cb[data-grupo="'+grupo+'"]').forEach(function(cb){cb.checked=val;});
}

function toggleTodosRubros(val) {
  document.querySelectorAll('.rubro_cb').forEach(function(cb){cb.checked=val;});
}

async function exportarReporteCSV() {
  var sel = Array.from(document.querySelectorAll('.rubro_cb:checked')).map(function(cb){return cb.value;});
  var periodo = (document.getElementById('rep_periodo')||{}).value || today().slice(0,7);
  var cfg = await dbGet('config','taller')||{};
  var csv = 'Reporte '+cfg.nombre+' | '+periodo+'\n\n';

  if (sel.indexOf('facturas') >= 0) {
    var facs = (await dbGetAll('facturas')).filter(function(f){return f.fecha&&f.fecha.startsWith(periodo);});
    csv += 'FACTURACION\nNo.,Fecha,Cliente,NIT,Subtotal,IVA,Total,Estado\n';
    facs.forEach(function(f){csv+=(f.noFactura||f.id)+','+f.fecha+','+f.clienteNombre+','+(f.nit||'CF')+','+( f.subtotal||0).toFixed(2)+','+(f.iva||0).toFixed(2)+','+(f.total||0).toFixed(2)+','+(f.pagada?'Pagada':'Pendiente')+'\n';});
    csv += '\n';
  }
  if (sel.indexOf('empleados') >= 0) {
    var emps = (await dbGetAll('empleados')).filter(function(e){return e.activo!==false;});
    csv += 'EMPLEADOS\nNombre,Cargo,CE,Salario\n';
    emps.forEach(function(e){csv+=e.nombre+','+( e.cargo||'')+','+(e.circunscripcion||'CE1')+','+(e.salarioBase||0).toFixed(2)+'\n';});
    csv += '\n';
  }

  var blob = new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download='reporte_'+periodo+'.csv'; a.click();
  toast('CSV exportado');
}

async function init(){
  try {
    await initDB();
    // Leer licencia del localStorage ANTES de cualquier otra cosa
    await verificarLicenciaGuardada();
    await cargarDatosDemostracion();
    actualizarBadgeLicencia();
    const sesionOk=await cargarSesion();
    if(sesionOk){
      document.getElementById('app').style.display='flex';
      await iniciarApp();
    }else{
      document.getElementById('app').style.display='none';
      // Primera vez: mostrar onboarding si no hay perfil de taller configurado
      var perfilTaller = obtenerPerfilTaller();
      var usuariosExist = await dbGetAll('usuarios');
      var tieneAdminReal = usuariosExist.some(function(u){ return !u.esDemo && u.activo; });
      if (!perfilTaller && !tieneAdminReal) {
        mostrarOnboarding();
      } else {
        mostrarLogin();
      }
    }
  } catch(err) {
    document.body.innerHTML='<div style="background:#1a1a1a;color:#e05a4e;padding:30px;font-family:monospace;font-size:13px;min-height:100vh">'
      +'<h2 style="color:#e8a820;margin-bottom:16px">TallerPro GT - Error de inicio</h2>'
      +'<div style="margin-bottom:8px"><b>Error:</b> '+(err&&err.message?err.message:String(err))+'</div>'
      +'<div style="margin-bottom:8px"><b>Stack:</b> <pre style="font-size:10px;color:#9a9690;white-space:pre-wrap">'+(err&&err.stack?err.stack.slice(0,500):'')+'</pre></div>'
      +'<button onclick="resetDB()" '
      +'style="margin-top:20px;background:#e8a820;color:#000;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-size:14px">'
      +'Reiniciar y recargar</button></div>';
  }
}

document.addEventListener("DOMContentLoaded", function(){ init(); });



/* ── GUARDIA DE FORMULARIO ────────────────────────────────────── */
var _formDirty = false;
var _formGuardEnabled = false;

function formEnableGuard() {
  _formGuardEnabled = true; _formDirty = false;
  setTimeout(function() {
    document.querySelectorAll('.modal input,.modal textarea,.modal select').forEach(function(el) {
      el.addEventListener('input', function(){ _formDirty = true; });
      el.addEventListener('change', function(){ _formDirty = true; });
    });
  }, 300);
}
function formDisableGuard() { _formGuardEnabled = false; _formDirty = false; }

// Badge clickeable siempre
document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('click', function(e) {
    // badge_licencia: solo informativo, ver menú lateral
  });
});

// Hook de navTo: advertir cambios sin guardar
(function(){
  var _navOrig = navTo;
  navTo = async function(page, extra) {
    if (_formGuardEnabled && _formDirty) {
      if (!confirm('Tienes cambios sin guardar.\n¿Descartar y continuar?')) return;
      formDisableGuard();
    }
    return _navOrig(page, extra);
  };
  // Hook openModal: activar guardia automáticamente
  var _omOrig = openModal;
  openModal = function(id, tit, cont, onG, mosG) {
    _omOrig(id, tit, cont, onG, mosG);
    var skip = ['modal_licencia','modal_pago','confirm_paypal','info_gpay'];
    if (skip.indexOf(id) < 0) formEnableGuard();
  };
  // Hook cerrarModal: limpiar guardia
  var _cmOrig = cerrarModal;
  cerrarModal = function(id) {
    formDisableGuard();
    _cmOrig(id);
  };
})();

async function renderIvaIsr(content,actions){
  if(!adminOSupervisor()){content.innerHTML='<div class="alert alert-red">Sin acceso</div>';return;}
  actions.innerHTML='<button class="btn btn-primary" onclick="generarDeclaracionIVA()">Generar declaración</button>';
  var facturas=await dbGetAll('facturas');
  var costos=await dbGetAll('costos');
  var anio=new Date().getFullYear();
  var mesActual=new Date().getMonth()+1; // 1-12
  var trimestreActual=Math.ceil(mesActual/3); // 1-4

  // Calcular por mes solo hasta el mes actual
  function datosMes(m){
    var pfx=anio+'-'+String(m).padStart(2,'0');
    var ventas=facturas.filter(f=>f.fecha&&f.fecha.startsWith(pfx)&&f.estado!=='anulada');
    var ivaVentas=ventas.reduce(function(a,f){return a+(f.iva||0);},0);
    var compras=costos.filter(c=>c.fecha&&c.fecha.startsWith(pfx));
    var ivaCred=compras.reduce(function(a,c){return a+(c.ivaAcreditado||0);},0);
    var totalVentas=ventas.reduce(function(a,f){return a+(f.total||0);},0);
    return {ventas:totalVentas, ivaVentas:ivaVentas, ivaCred:ivaCred, ivaPagar:Math.max(0,ivaVentas-ivaCred), n:ventas.length};
  }

  var trimestres=[
    {label:'1er Trimestre',meses:[1,2,3],num:1},
    {label:'2do Trimestre',meses:[4,5,6],num:2},
    {label:'3er Trimestre',meses:[7,8,9],num:3},
    {label:'4to Trimestre',meses:[10,11,12],num:4},
  ];

  var mesesNombres=['','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  var htmlTrims='';
  var totalAnualVentas=0,totalAnualIvaV=0,totalAnualIvaC=0,totalAnualIvaP=0;

  trimestres.forEach(function(t){
    // Solo mostrar trimestres ya iniciados (trimestre actual o anteriores)
    if(t.num>trimestreActual) return;
    var trVentas=0,trIvaV=0,trIvaC=0,trIvaP=0;
    var mesesHTML='';
    t.meses.forEach(function(m){
      // Solo mostrar meses ya pasados o el actual
      if(m>mesActual) return;
      var d=datosMes(m);
      trVentas+=d.ventas; trIvaV+=d.ivaVentas; trIvaC+=d.ivaCred; trIvaP+=d.ivaPagar;
      totalAnualVentas+=d.ventas; totalAnualIvaV+=d.ivaVentas; totalAnualIvaC+=d.ivaCred; totalAnualIvaP+=d.ivaPagar;
      mesesHTML+='<tr><td style="padding-left:16px;font-size:12px">'+mesesNombres[m]+'</td>'
        +'<td class="td-mono td-right">'+fmt(d.ventas)+'</td>'
        +'<td class="td-mono td-right text-green">'+fmt(d.ivaVentas)+'</td>'
        +'<td class="td-mono td-right text-amber">'+fmt(d.ivaCred)+'</td>'
        +'<td class="td-mono td-right '+(d.ivaPagar>0?'text-red':'text-green')+'">'+fmt(d.ivaPagar)+'</td>'
        +'<td><span class="badge badge-'+(d.n>0?'green':'gray')+'">'+d.n+' facts</span></td></tr>';
    });
    if(!mesesHTML) return;
    htmlTrims+='<tr style="background:var(--bg3);font-weight:700"><td>'+t.label+'</td>'
      +'<td class="td-mono td-right">'+fmt(trVentas)+'</td>'
      +'<td class="td-mono td-right text-green">'+fmt(trIvaV)+'</td>'
      +'<td class="td-mono td-right text-amber">'+fmt(trIvaC)+'</td>'
      +'<td class="td-mono td-right '+(trIvaP>0?'text-red':'text-green')+'">'+fmt(trIvaP)+'</td>'
      +'<td></td></tr>'+mesesHTML;
  });

  content.innerHTML='<div class="section-title">📊 IVA / ISR — '+anio+'</div>'
    +'<div class="section-sub">Hasta el mes de '+mesesNombres[mesActual]+' (Trimestre '+trimestreActual+'). Los trimestres futuros no se proyectan.</div>'
    +'<div class="stat-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px">'
    +'<div class="stat-card stat-blue"><div class="stat-label">Ventas acumuladas</div><div class="stat-value">'+fmt(totalAnualVentas)+'</div><div class="stat-sub">'+anio+'</div></div>'
    +'<div class="stat-card stat-green"><div class="stat-label">IVA débito (cobrado)</div><div class="stat-value">'+fmt(totalAnualIvaV)+'</div></div>'
    +'<div class="stat-card stat-amber"><div class="stat-label">IVA crédito (pagado)</div><div class="stat-value">'+fmt(totalAnualIvaC)+'</div></div>'
    +'<div class="stat-card '+(totalAnualIvaP>0?'stat-red':'stat-green')+'"><div class="stat-label">IVA a pagar acumulado</div><div class="stat-value">'+fmt(totalAnualIvaP)+'</div></div>'
    +'</div>'
    +'<div class="card"><div class="table-wrap"><table class="table">'
    +'<thead><tr><th>Período</th><th class="td-right">Ventas</th><th class="td-right">IVA Débito</th><th class="td-right">IVA Crédito</th><th class="td-right">A Pagar</th><th>Docs</th></tr></thead>'
    +'<tbody>'+htmlTrims+'</tbody>'
    +'</table></div>'
    +'<div style="background:var(--bg3);border-radius:8px;padding:12px 16px;margin-top:12px;display:flex;justify-content:space-between;align-items:center">'
    +'<div style="font-size:13px;font-weight:700">Total acumulado '+anio+' a pagar al SAT:</div>'
    +'<div style="font-size:18px;font-weight:800;font-family:var(--font-mono);color:var('+(totalAnualIvaP>0?'--red':'--green')+')">'+fmt(totalAnualIvaP)+'</div>'
    +'</div></div>';
}
