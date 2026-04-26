/* TallerPro GT — 01_core_licencias.js | 787 líneas */

/* ================================================================
   SISTEMA DE LICENCIAS v2 - TallerPro GT
   ================================================================ */
var SUPA_URL = "https://voxclbgdoubntqyfupxl.supabase.co";
var SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZveGNsYmdkb3VibnRxeWZ1cHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDU2MzAsImV4cCI6MjA5MjY4MTYzMH0.op5UaDFbogxmgj29VAsTGTbEkcND_CLOqliKvz4flz0";
var DEMO_DIAS = 15;
var DEMO_BLOQUEADOS = ["reportes","fel","configuracion","whatsapp","contabilidad","nomina"];
var licenciaActual = null;

// ── ID único por instalación ─────────────────────────────────────
function getInstallId() {
  var id = localStorage.getItem('tpgt_install_id');
  if (!id) {
    id = 'INST-' + Math.random().toString(36).substr(2,4).toUpperCase()
       + '-' + Math.random().toString(36).substr(2,4).toUpperCase()
       + '-' + Date.now().toString(36).toUpperCase();
    localStorage.setItem('tpgt_install_id', id);
  }
  return id;
}

// ── Control de demo ──────────────────────────────────────────────
function getDemoInfo() {
  var inicio = localStorage.getItem('tpgt_demo_inicio');
  if (!inicio) {
    inicio = new Date().toISOString().split('T')[0];
    localStorage.setItem('tpgt_demo_inicio', inicio);
  }
  var hoy = new Date();
  var dInicio = new Date(inicio + 'T00:00:00');
  var diasUsados = Math.floor((hoy - dInicio) / 86400000);
  var diasRestantes = Math.max(0, DEMO_DIAS - diasUsados);
  return { inicio: inicio, diasUsados: diasUsados, diasRestantes: diasRestantes, vencido: diasRestantes === 0 };
}

// ── Validar código contra Supabase ───────────────────────────────
async function validarLicencia(codigo) {
  try {
    var codigoUpper = codigo.trim().toUpperCase();
    var url = SUPA_URL + "/rest/v1/tp_licencias?codigo=eq." + encodeURIComponent(codigoUpper) + "&select=*";
    var resp = await fetch(url, {
      headers: {
        "apikey": SUPA_KEY,
        "Authorization": "Bearer " + SUPA_KEY,
        "Content-Type": "application/json"
      }
    });
    if (!resp.ok) {
      var errTxt = await resp.text();
      // Si el error es que la tabla no existe, probar con 'licencias'
      if (errTxt.includes('does not exist') || errTxt.includes('relation')) {
        // Intentar tabla sin prefijo tp_
        var resp2 = await fetch(SUPA_URL + "/rest/v1/licencias?codigo=eq." + encodeURIComponent(codigoUpper) + "&select=*", {
          headers: { "apikey": SUPA_KEY, "Authorization": "Bearer " + SUPA_KEY }
        });
        if (resp2.ok) {
          var data2 = await resp2.json();
          if (data2 && data2.length) {
            resp = resp2;
          }
        }
      }
      if (!resp.ok) return { ok: false, msg: "Error conectando con servidor (" + resp.status + "). Verifica tu conexión." };
    }
    var data = await resp.json();
    if (!data || !data.length) return { ok: false, msg: "Código '" + codigoUpper + "' no encontrado en el sistema. Verifica que lo copiaste correctamente." };
    var lic = data[0];
    if (!lic.activa) return { ok: false, msg: "Esta licencia ha sido desactivada. Contacta a soporte." };
    var hoy = new Date().toISOString().split('T')[0];
    if (lic.fecha_vence < hoy) return { ok: false, msg: "Licencia vencida el " + lic.fecha_vence + ". Renueva tu plan." };
    return { ok: true, lic: lic };
  } catch(e) {
    // Sin internet: revisar cache local
    var guardada = localStorage.getItem('tpgt_licencia');
    if (guardada) {
      try {
        var lic2 = JSON.parse(guardada);
        var hoy2 = new Date().toISOString().split('T')[0];
        if (lic2.codigo === codigo.trim().toUpperCase() && lic2.vence >= hoy2) {
          return { ok: true, lic: lic2, offline: true };
        }
      } catch(e2) {}
    }
    return { ok: false, msg: "Sin conexión a internet. Verifica tu red e intenta de nuevo." };
  }
}


async function renderLicencia(content, actions) {
  actions.innerHTML = '';
  var installId = getInstallId();
  var demo = getDemoInfo();
  var html = '';

  if (licenciaActual) {
    var dias = diasRestantesLic();
    var vc = dias > 60 ? 'var(--green)' : dias > 15 ? 'var(--accent)' : 'var(--red)';
    var nombreTaller = licenciaActual.taller_nombre || licenciaActual.taller || licenciaActual.codigo;
    var fechaVence = licenciaActual.fecha_vence || licenciaActual.vence || '—';
    var fechaActivo = licenciaActual.activadoEn ? new Date(licenciaActual.activadoEn).toLocaleDateString('es-GT') : '—';
    var plan = (licenciaActual.plan||'anual').toUpperCase();

    html = '<div class="section-title">Mi Licencia</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:820px">'
      // Estado actual
      + '<div class="card">'
      + '<div style="text-align:center;padding:16px 0 10px">'
      + '<div style="font-size:48px;margin-bottom:8px">' + (dias > 0 ? '✅' : '🔴') + '</div>'
      + '<div style="font-size:20px;font-weight:800;margin-bottom:4px">' + nombreTaller + '</div>'
      + '<span class="badge badge-' + (dias>30?'green':dias>7?'amber':'red') + '" style="font-size:13px;padding:4px 14px">'
      + (dias > 0 ? 'ACTIVA' : 'VENCIDA') + '</span>'
      + '</div>'
      + '<div style="display:grid;gap:8px;margin-top:12px">'
      + '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--text2)">Plan</span><strong>' + plan + '</strong></div>'
      + '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--text2)">Codigo</span><span style="font-family:var(--font-mono);font-size:12px">' + (licenciaActual.codigo||'—') + '</span></div>'
      + '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--text2)">Activada</span><span>' + fechaActivo + '</span></div>'
      + '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--text2)">Vence</span><strong style="color:' + vc + '">' + fechaVence + '</strong></div>'
      + '<div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px"><span style="color:var(--text2)">Dias restantes</span><strong style="color:' + vc + '">' + dias + ' dias</strong></div>'
      + '</div>'
      + '</div>'
      // Renovar
      + '<div class="card">'
      + '<div style="font-size:14px;font-weight:700;margin-bottom:16px">Renovar licencia</div>'
      + '<div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:14px;font-size:12px;color:var(--text2);line-height:1.8">'
      + 'Para renovar, adquiere un nuevo codigo de licencia anual y ingresalo abajo.'
      + '</div>'
      + '<input id="lic_codigo_pg" placeholder="NUEVO-CODIGO-GT" autocomplete="off" style="width:100%;background:var(--bg3);border:2px solid var(--border2);border-radius:10px;padding:16px;color:var(--text);font-size:16px;font-family:var(--font-mono);text-align:center;letter-spacing:2px;text-transform:uppercase;outline:none;box-sizing:border-box;margin-bottom:12px">'
      + '<button id="lic_btn_pg" onclick="activarLicenciaPagina()" style="width:100%;background:var(--accent);color:#0f0f0f;border:none;border-radius:8px;padding:14px;font-size:15px;font-weight:700;cursor:pointer">Renovar licencia</button>'
      + '<div id="lic_pg_msg" style="margin-top:10px;font-size:13px;text-align:center;padding:8px;border-radius:6px;display:none"></div>'
      + '</div>'
      + '</div>'
      // Panel inferior: usuarios del taller
      + '<div class="card" style="max-width:820px;margin-top:12px">'
      + '<div class="card-title">Usuarios de este taller</div>'
      + '<div id="lic_usuarios_panel">Cargando...</div>'
      + '</div>';
    content.innerHTML = html;
    setTimeout(function(){ var el=document.getElementById('lic_codigo_pg'); if(el){el.oninput=function(){this.value=this.value.toUpperCase();};}}, 100);
    // Cargar usuarios
    cargarUsuariosLicencia();
    return;
  }

  html = '<div class="section-title">Activar TallerPro GT</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:820px">'
    // Panel izquierdo
    + '<div class="card">'
    + '<div style="font-size:14px;font-weight:700;margin-bottom:12px;color:var(--accent)">'
    + (demo.vencido ? 'Periodo de prueba terminado' : 'DEMO - ' + demo.diasRestantes + ' dias restantes')
    + '</div>'
    + '<div style="font-size:12px;color:var(--text2);margin-bottom:16px;line-height:1.8">'
    + (demo.vencido ? 'Tu prueba gratuita termino. Activa tu licencia.' : 'Modulos bloqueados: Reportes, FEL, WhatsApp, Contabilidad.')
    + '</div>'
    + '<div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:14px">'
    + '<div style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Tu ID de instalacion</div>'
    + '<div id="inst_id_display" style="font-family:var(--font-mono);font-size:13px;color:var(--accent);background:var(--bg2);padding:12px;border-radius:6px;text-align:center;cursor:pointer;user-select:all;word-break:break-all" onclick="copiarInstallId()">'
    + installId + '</div>'
    + '<div style="font-size:11px;color:var(--text3);margin-top:6px;text-align:center">Toca para copiar</div>'
    + '</div>'
    + '<div style="font-size:12px;color:var(--text2);line-height:2">1 - Copia tu ID de instalacion<br>2 - Contactanos por WhatsApp o email<br>3 - Paga tu plan anual<br>4 - Recibe y activa tu codigo</div>'
    + '<button onclick="diagnosticarConexionSupabase()" style="margin-top:14px;background:none;border:1px solid var(--border2);color:var(--text3);font-size:11px;cursor:pointer;padding:6px 12px;border-radius:6px;width:100%">Probar conexion al servidor</button>'
    + '</div>'
    // Panel derecho
    + '<div class="card">'
    + '<div style="font-size:14px;font-weight:700;margin-bottom:16px">Codigo de activacion</div>'
    + '<input id="lic_codigo_pg" placeholder="TALLER-2025-GT" autocomplete="off" style="width:100%;background:var(--bg3);border:2px solid var(--border2);border-radius:10px;padding:18px;color:var(--text);font-size:18px;font-family:var(--font-mono);text-align:center;letter-spacing:3px;text-transform:uppercase;outline:none;box-sizing:border-box;margin-bottom:14px">'
    + '<button id="lic_btn_pg" onclick="activarLicenciaPagina()" style="width:100%;background:var(--accent);color:#0f0f0f;border:none;border-radius:10px;padding:18px;font-size:17px;font-weight:800;cursor:pointer">Activar licencia</button>'
    + '<div id="lic_pg_msg" style="margin-top:14px;font-size:13px;text-align:center;padding:10px;border-radius:8px;display:none"></div>'
    + '<div style="margin-top:16px;font-size:11px;color:var(--text3);text-align:center;line-height:1.8">El codigo distingue mayusculas<br>Sin espacios al inicio o final</div>'
    + '</div>'
    + '</div>';

  content.innerHTML = html;
  setTimeout(function(){ var el=document.getElementById('lic_codigo_pg'); if(el){el.focus(); el.oninput=function(){this.value=this.value.toUpperCase();}; } }, 200);
}


function copiarInstallId() {
  var txt = getInstallId();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(txt).then(function(){ toast('\u2713 ID copiado: '+txt); }).catch(function(){
      var t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t);toast('ID copiado');
    });
  } else {
    var t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t);toast('ID copiado: '+txt);
  }
}


function guardarLicenciaLocal(licData, codigoInput) {
  var obj = {
    codigo:     licData.codigo      || codigoInput || '',
    taller:     licData.taller_nombre || licData.taller || licData.codigo || codigoInput || '',
    vence:      licData.fecha_vence  || licData.vence  || '',
    plan:       licData.plan         || 'anual',
    activa:     licData.activa !== false,
    activadoEn: licData.activadoEn  || new Date().toISOString(),
    tallerId:   licData.taller_id   || licData.tallerId || getTallerId()
  };
  var json = JSON.stringify(obj);
  localStorage.setItem('tpgt_licencia', json);
  console.log('[Licencia] Guardada en localStorage:', obj.codigo, obj.vence);
  return obj;
}

async function activarLicenciaPagina() {
  var inp = document.getElementById('lic_codigo_pg');
  var msgEl = document.getElementById('lic_pg_msg');
  var btn = document.getElementById('lic_btn_pg');

  function setMsg(txt, color) {
    if (!msgEl) return;
    msgEl.textContent = txt;
    msgEl.style.display = txt ? 'block' : 'none';
    msgEl.style.background = color === 'red' ? 'rgba(224,90,78,.15)' : color === 'green' ? 'rgba(76,175,125,.15)' : 'rgba(232,168,32,.1)';
    msgEl.style.color = color === 'red' ? 'var(--red)' : color === 'green' ? 'var(--green)' : 'var(--accent)';
    msgEl.style.border = '1px solid ' + (color === 'red' ? 'rgba(224,90,78,.3)' : color === 'green' ? 'rgba(76,175,125,.3)' : 'rgba(232,168,32,.3)');
    msgEl.style.borderRadius = '8px';
    msgEl.style.padding = '10px';
  }

  // Si ya hay licencia activa y no es renovación, avisar
  if (licenciaActual) {
    var dias = diasRestantesLic();
    if (dias > 30) {
      setMsg('✓ Tu licencia está activa y vence en ' + dias + ' días. No necesitas ingresar un nuevo código.', 'green');
      return;
    }
  }

  var codigo = inp ? inp.value.trim().toUpperCase() : '';
  if (!codigo) { setMsg('⚠ Ingresa el código de licencia', 'amber'); if (inp) inp.focus(); return; }

  if (btn) { btn.disabled = true; btn.textContent = '⏳ Verificando...'; btn.style.opacity = '0.7'; }
  setMsg('Conectando con Supabase...', 'amber');

  try {
    var res = await validarLicencia(codigo);
    if (btn) { btn.disabled = false; btn.textContent = licenciaActual ? 'Renovar licencia' : 'Activar licencia'; btn.style.opacity = '1'; }

    if (!res.ok) {
      setMsg('✗ ' + res.msg, 'red');
      if (inp) { inp.style.borderColor = 'var(--red)'; }
      return;
    }

    // ✓ Licencia válida — guardar
    var saved = guardarLicenciaLocal(res.lic, codigo);
    licenciaActual = saved;

    // Asociar taller_id con esta licencia en Supabase (en background)
    var tallerId = getTallerId();
    var installId = getInstallId();
    try {
      await fetch(SUPA_URL + '/rest/v1/tp_licencias?codigo=eq.' + encodeURIComponent(codigo), {
        method: 'PATCH',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': 'Bearer ' + SUPA_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ install_id: installId, taller_id: tallerId, ultimo_acceso: new Date().toISOString() })
      });
    } catch(e) { /* no bloquear si falla */ }

    // Eliminar usuario demo
    try {
      var todos = await dbGetAll('usuarios');
      var demo = todos.find(function(u) { return u.esDemo || u.username === 'demo'; });
      if (demo) await dbDelete('usuarios', demo.id);
    } catch(e) {}

    setMsg('✅ ¡Licencia activada correctamente! Recargando en 2 segundos...', 'green');
    if (inp) inp.style.borderColor = 'var(--green)';
    actualizarBadgeLicencia();
    setTimeout(function() { location.reload(); }, 2000);

  } catch(e) {
    if (btn) { btn.disabled = false; btn.textContent = licenciaActual ? 'Renovar' : 'Activar licencia'; btn.style.opacity = '1'; }
    setMsg('✗ Error de conexión: ' + e.message, 'red');
  }
}

function estaActivo() { return licenciaActual !== null; }

function diasRestantesLic() {
  if (!licenciaActual) return 0;
  var vence = new Date((licenciaActual.vence || licenciaActual.fecha_vence || '') + 'T23:59:59');
  return Math.max(0, Math.ceil((vence - new Date()) / 86400000));
}

function actualizarBadgeLicencia() {
  var badge = document.getElementById('badge_licencia');
  if (!badge) return;
  if (licenciaActual) {
    var dias = diasRestantesLic();
    if (dias > 30) {
      badge.textContent = '✓ Licencia activa';
      badge.style.cssText = 'font-size:11px;font-weight:600;padding:5px 12px;border-radius:6px;cursor:pointer;white-space:nowrap;margin-left:4px;background:var(--green-dim);color:var(--green);border:1px solid rgba(76,175,125,.3)';
    } else {
      badge.textContent = '⚠ Vence en ' + dias + ' días';
      badge.style.cssText = 'font-size:11px;font-weight:600;padding:5px 12px;border-radius:6px;cursor:pointer;white-space:nowrap;margin-left:4px;background:var(--red-dim);color:var(--red);border:1px solid rgba(224,90,78,.3)';
    }
  } else {
    var demo = getDemoInfo();
    if (demo.vencido) {
      badge.textContent = '🔒 DEMO VENCIDO';
      badge.style.cssText = 'font-size:11px;font-weight:600;padding:5px 12px;border-radius:6px;cursor:pointer;white-space:nowrap;margin-left:4px;background:var(--red-dim);color:var(--red);border:1px solid rgba(224,90,78,.5);animation:pulse 2s infinite';
    } else {
      badge.textContent = '⚡ DEMO ' + demo.diasRestantes + 'd — Activar';
      badge.style.cssText = 'font-size:11px;font-weight:600;padding:5px 12px;border-radius:6px;cursor:pointer;white-space:nowrap;margin-left:4px;background:var(--accent-dim);color:var(--accent);border:1px solid rgba(232,168,32,.3)';
    }
  }
  badge.onclick = function(){ abrirModalLicencia(); };
}


async function diagnosticarConexionSupabase() {
  var modal_body = '<div style="font-family:var(--font-mono);font-size:12px;line-height:2;background:var(--bg3);padding:14px;border-radius:8px">Verificando...</div>';
  openModal('diag_supa', '🔧 Diagnóstico Supabase', modal_body, function(){}, false);

  var resultados = [];
  var codigosEncontrados = [];

  try {
    var hdrs = { "apikey": SUPA_KEY, "Authorization": "Bearer " + SUPA_KEY };

    // Leer todos los registros de tp_licencias
    var r2 = await fetch(SUPA_URL + "/rest/v1/tp_licencias?select=codigo,taller_nombre,activa,fecha_vence&limit=20", { headers: hdrs });
    var d2 = await r2.json();
    resultados.push("Tabla tp_licencias: " + (r2.ok ? "✓ (" + r2.status + ")" : "✗ Error " + r2.status));
    if (r2.ok && Array.isArray(d2) && d2.length) {
      d2.forEach(function(lic) { codigosEncontrados.push({tabla:'tp_licencias', lic:lic}); });
    } else if (r2.ok && Array.isArray(d2) && !d2.length) {
      resultados.push("⚠ tp_licencias está VACÍA — debes insertar un registro");
    }

    // Leer todos los registros de licencias
    var r3 = await fetch(SUPA_URL + "/rest/v1/licencias?select=codigo,taller,activa,fecha_vence&limit=20", { headers: hdrs });
    var d3 = await r3.json();
    resultados.push("Tabla licencias: " + (r3.ok ? "✓ (" + r3.status + ")" : "✗ Error " + r3.status));
    if (r3.ok && Array.isArray(d3) && d3.length) {
      d3.forEach(function(lic) { codigosEncontrados.push({tabla:'licencias', lic:lic}); });
    } else if (r3.ok && Array.isArray(d3) && !d3.length) {
      resultados.push("⚠ licencias está VACÍA — debes insertar un registro");
    }

  } catch(e) {
    resultados.push("Error: " + e.message);
  }

  var codigosHTML = '';
  if (codigosEncontrados.length) {
    codigosHTML = '<div style="margin-top:12px"><div style="font-weight:600;font-size:12px;margin-bottom:6px;color:var(--text2)">Códigos en Supabase:</div>'
      + codigosEncontrados.map(function(item) {
          var lic = item.lic;
          var cod = lic.codigo || '—';
          var act = lic.activa ? '✓ activa' : '✗ inactiva';
          var vence = lic.fecha_vence || lic.fecha_vence || '—';
          var nom = lic.taller_nombre || lic.taller || '—';
          return '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px;margin-bottom:6px;font-family:var(--font-mono);font-size:11px">'
            + '<div style="color:var(--accent);font-size:13px;font-weight:700;letter-spacing:1px">' + cod + '</div>'
            + '<div style="color:var(--text3)">' + nom + ' · ' + act + ' · vence: ' + vence + '</div>'
            + '<div style="color:var(--text3);font-size:10px">tabla: ' + item.tabla + '</div>'
            + '<button onclick="document.getElementById(\'lic_codigo_pg\').value=\'' + cod + '\';closeModal(\'diag_supa\');" style="margin-top:6px;background:var(--accent);color:#000;border:none;border-radius:4px;padding:4px 10px;font-size:11px;cursor:pointer">Usar este código</button>'
            + '</div>';
        }).join('')
      + '</div>';
  } else {
    codigosHTML = '<div style="margin-top:12px;padding:12px;background:var(--red-dim);border-radius:6px;font-size:12px;color:var(--red)">'
      + '<strong>No hay códigos de licencia en Supabase.</strong><br>'
      + 'Debes insertar uno en la tabla tp_licencias o licencias.<br><br>'
      + '<strong>SQL para insertar:</strong></div>'
      + '<div style="background:var(--bg3);padding:10px;border-radius:6px;font-family:var(--font-mono);font-size:11px;margin-top:6px;user-select:all">'
      + "INSERT INTO tp_licencias (codigo, taller_nombre, plan, activa, fecha_inicio, fecha_vence)<br>"
      + "VALUES ('TALLER-001-GT', 'Mi Taller', 'anual', true, CURRENT_DATE, CURRENT_DATE + 365);"
      + '</div>';
  }

  var bodyEl = document.querySelector('#modal_diag_supa .modal-body');
  if (bodyEl) {
    bodyEl.innerHTML = '<div style="font-family:var(--font-mono);font-size:12px;line-height:2;background:var(--bg3);padding:14px;border-radius:8px">'
      + resultados.join('<br>')
      + '</div>'
      + '<div style="margin-top:8px;font-size:10px;color:var(--text3)">URL: ' + SUPA_URL + '</div>'
      + codigosHTML;
  }
}


function abrirModalLicencia() {
  // Eliminar modal anterior si existe
  var old = document.getElementById('lic_modal_overlay');
  if (old) old.remove();

  var installId = getInstallId();
  var demo = getDemoInfo();

  var bodyHTML = '';

  if (licenciaActual) {
    var dias = diasRestantesLic();
    var color = dias > 30 ? 'var(--green)' : 'var(--red)';
    bodyHTML = '<div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:14px">'
      + '<div style="font-size:12px;color:var(--text3);margin-bottom:4px">LICENCIA ACTIVA</div>'
      + '<div style="font-size:18px;font-weight:700;margin-bottom:4px">' + (licenciaActual.taller||licenciaActual.taller_nombre||licenciaActual.codigo) + '</div>'
      + '<div style="font-size:13px;color:var(--text2)">Plan: ' + (licenciaActual.plan||'anual') + '</div>'
      + '<div style="font-size:13px;margin-top:8px;font-weight:600;color:'+color+'">Vence: ' + (licenciaActual.fecha_vence||licenciaActual.vence) + ' · ' + dias + ' días restantes</div>'
      + '</div>'
      + '<p style="font-size:12px;color:var(--text3);margin-bottom:12px">Para renovar ingresa tu nuevo código abajo.</p>';
  } else {
    var alertBg = demo.vencido ? 'rgba(224,90,78,.1)' : 'rgba(232,168,32,.1)';
    var alertBorder = demo.vencido ? 'rgba(224,90,78,.4)' : 'rgba(232,168,32,.3)';
    var alertColor = demo.vencido ? 'var(--red)' : 'var(--accent)';
    bodyHTML = '<div style="background:'+alertBg+';border:1px solid '+alertBorder+';border-radius:10px;padding:14px;margin-bottom:14px">'
      + '<div style="font-size:15px;font-weight:700;color:'+alertColor+';margin-bottom:6px">'
      + (demo.vencido ? '🔒 Período de prueba terminado' : '⚡ Modo DEMO — ' + demo.diasRestantes + ' días restantes')
      + '</div><div style="font-size:12px;color:var(--text2);line-height:1.7">'
      + (demo.vencido ? 'Activa tu licencia anual para continuar.' : 'Módulos bloqueados: Reportes, FEL, WhatsApp, Contabilidad.')
      + '</div></div>'
      + '<div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:14px">'
      + '<div style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:8px">📋 Tu ID de instalación (toca para copiar)</div>'
      + '<div style="font-family:var(--font-mono);font-size:13px;color:var(--accent);background:var(--bg2);padding:10px;border-radius:6px;text-align:center;cursor:pointer;user-select:all"'
      + ' onclick="(function(el){if(navigator.clipboard){navigator.clipboard.writeText(el.textContent.trim()).then(function(){alert(\'ID copiado: \' + el.textContent.trim())});}else{var t=document.createElement(\'textarea\');t.value=el.textContent.trim();document.body.appendChild(t);t.select();document.execCommand(\'copy\');document.body.removeChild(t);}})(this)">'
      + installId + '</div>'
      + '<div style="font-size:10px;color:var(--text3);margin-top:4px;text-align:center">Comparte este ID al adquirir tu licencia</div>'
      + '</div>'
      + '<div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:14px">'
      + '<div style="font-size:12px;font-weight:600;color:var(--text2);margin-bottom:8px">🛒 Cómo obtener tu licencia</div>'
      + '<div style="font-size:12px;color:var(--text2);line-height:2">'
      + '1️⃣ Copia tu ID de instalación<br>'
      + '2️⃣ Contáctanos por WhatsApp o email<br>'
      + '3️⃣ Realiza el pago de tu plan anual<br>'
      + '4️⃣ Recibes tu código · Ingrésalo abajo ✓'
      + '</div>'
      + '<div style="text-align:center;margin-top:8px">'
      + '<button onclick="diagnosticarConexionSupabase()" style="background:none;border:none;color:var(--text3);font-size:10px;cursor:pointer;text-decoration:underline">🔧 Probar conexión al servidor</button>'
      + '</div></div>';
  }

  var overlay = document.createElement('div');
  overlay.id = 'lic_modal_overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9998;display:flex;align-items:center;justify-content:center;padding:16px';
  overlay.innerHTML = '<div style="background:var(--bg2);border:1px solid var(--border2);border-radius:14px;padding:28px;width:100%;max-width:440px;max-height:90vh;overflow-y:auto;position:relative">'
    + '<button onclick="document.getElementById(\'lic_modal_overlay\').remove()" style="position:absolute;top:14px;right:14px;background:none;border:none;color:var(--text2);font-size:20px;cursor:pointer;line-height:1">×</button>'
    + '<h2 style="font-size:18px;font-weight:700;margin-bottom:18px;color:var(--accent)">' + (licenciaActual ? '🔑 Mi Licencia' : '⚡ Activar TallerPro GT') + '</h2>'
    + bodyHTML
    + '<div class="form-group">'
    + '<label style="font-weight:600;font-size:13px">Código de licencia</label>'
    + '<input id="lic_codigo_input" placeholder="Ej: TALLER-2025-GT" autocomplete="off" spellcheck="false"'
    + ' style="width:100%;margin-top:6px;background:var(--bg3);border:1px solid var(--border2);border-radius:8px;padding:14px;color:var(--text);font-size:16px;font-family:var(--font-mono);text-align:center;letter-spacing:2px;text-transform:uppercase;outline:none;box-sizing:border-box"'
    + ' oninput="this.value=this.value.toUpperCase()"'
    + ' onkeydown="if(event.key===\'Enter\')activarLicenciaNueva()">'
    + '</div>'
    + '<div id="lic_msg" style="min-height:24px;font-size:12px;text-align:center;margin:8px 0;padding:6px;border-radius:6px;display:none"></div>'
    + '<button id="lic_btn_activar" onclick="activarLicenciaNueva()" style="width:100%;background:var(--accent);color:#0f0f0f;border:none;border-radius:8px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;margin-top:4px">✓ Activar licencia</button>'
    + '<button onclick="document.getElementById(\'lic_modal_overlay\').remove()" style="width:100%;background:none;border:1px solid var(--border2);border-radius:8px;padding:10px;font-size:13px;cursor:pointer;color:var(--text2);margin-top:8px">Cerrar</button>'
    + '</div>';

  // Cerrar al hacer clic en el fondo
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
  setTimeout(function() {
    var inp = document.getElementById('lic_codigo_input');
    if (inp) inp.focus();
  }, 100);
}



async function verificarLicenciaGuardada() {
  // Lee la licencia del localStorage. Si existe y no ha vencido, la activa.
  // NO hace llamada a Supabase (eso es en segundo plano).
  try {
    var raw = localStorage.getItem('tpgt_licencia');
    if (!raw) return false;
    var lic = JSON.parse(raw);
    if (!lic || !lic.codigo) { localStorage.removeItem('tpgt_licencia'); return false; }
    // Verificar vencimiento
    var vence = lic.vence || lic.fecha_vence || '';
    if (vence) {
      var hoy = new Date().toISOString().slice(0,10);
      if (vence < hoy) {
        localStorage.removeItem('tpgt_licencia');
        licenciaActual = null;
        return false;
      }
    }
    // Licencia válida localmente
    licenciaActual = lic;
    console.log('[Licencia] Activa desde localStorage:', lic.codigo, '— vence:', vence);
    // Re-validar en Supabase en background (no bloquea el arranque)
    setTimeout(async function() {
      try {
        var res = await validarLicencia(lic.codigo);
        if (res.ok) {
          licenciaActual = guardarLicenciaLocal(res.lic, lic.codigo);
          actualizarBadgeLicencia();
        } else if (res.offline) {
          console.log('[Licencia] Sin conexión, usando datos locales');
        } else {
          console.warn('[Licencia] Servidor dice inválida:', res.msg);
          // NO borrar — puede ser problema temporal
        }
      } catch(e) {
        console.warn('[Licencia] Error re-validando (sin internet?):', e.message);
      }
    }, 3000);
    return true;
  } catch(e) {
    console.error('[Licencia] Error leyendo localStorage:', e);
    return false;
  }
}

function estaActivo() { return licenciaActual !== null; }

function diasRestantesLic() {
  if (!licenciaActual) return 0;
  var vence = new Date((licenciaActual.fecha_vence || licenciaActual.vence) + 'T23:59:59');
  return Math.max(0, Math.ceil((vence - new Date()) / 86400000));
}

function actualizarBadgeLicencia() {
  var badge = document.getElementById('badge_licencia');
  if (!badge) return;
  if (licenciaActual) {
    var dias = diasRestantesLic();
    if (dias > 30) {
      badge.textContent = '✓ Licencia activa';
      badge.style.cssText = 'font-size:11px;font-weight:600;padding:5px 12px;border-radius:6px;cursor:pointer;white-space:nowrap;background:rgba(76,175,125,.15);color:var(--green);border:1px solid rgba(76,175,125,.3)';
    } else if (dias > 7) {
      badge.textContent = '⚠ Vence en ' + dias + ' días';
      badge.style.cssText = 'font-size:11px;font-weight:600;padding:5px 12px;border-radius:6px;cursor:pointer;white-space:nowrap;background:rgba(232,168,32,.15);color:var(--accent);border:1px solid rgba(232,168,32,.3)';
    } else {
      badge.textContent = '🔴 Vence en ' + dias + ' días';
      badge.style.cssText = 'font-size:11px;font-weight:600;padding:5px 12px;border-radius:6px;cursor:pointer;white-space:nowrap;background:var(--red-dim);color:var(--red);border:1px solid rgba(224,90,78,.4);animation:pulse 1.5s infinite';
    }
    badge.onclick = function(){ navTo('licencia'); };
    // Mostrar banner de aviso si vence pronto
    mostrarBannerVencimiento(dias);
  } else {
    var demo = getDemoInfo();
    if (demo.vencido) {
      badge.textContent = '🔒 DEMO vencido';
      badge.style.cssText = 'font-size:11px;font-weight:700;padding:5px 12px;border-radius:6px;cursor:pointer;white-space:nowrap;background:var(--red-dim);color:var(--red);border:1px solid rgba(224,90,78,.5)';
    } else {
      badge.textContent = '⚡ DEMO · ' + demo.diasRestantes + 'd';
      badge.style.cssText = 'font-size:11px;font-weight:600;padding:5px 12px;border-radius:6px;cursor:pointer;white-space:nowrap;background:rgba(232,168,32,.15);color:var(--accent);border:1px solid rgba(232,168,32,.3)';
    }
    badge.onclick = function(){ navTo('licencia'); };
  }
}

function mostrarBannerVencimiento(dias) {
  var old = document.getElementById('lic_banner');
  if (old) old.remove();
  if (dias > 30) return; // No mostrar si quedan más de 30 días

  var banner = document.createElement('div');
  banner.id = 'lic_banner';
  var color = dias > 7 ? '#e8a820' : '#e05a4e';
  var bg = dias > 7 ? 'rgba(232,168,32,.12)' : 'rgba(224,90,78,.12)';
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:1000;background:'+bg+';border-top:2px solid '+color+';padding:10px 20px;display:flex;align-items:center;justify-content:space-between;font-size:13px';
  banner.innerHTML = '<span style="color:'+color+';font-weight:600">'
    + (dias <= 0 ? '🔴 Tu licencia venció. Renueva para continuar.' : '⚠ Tu licencia vence en <strong>'+dias+' días</strong>. Renueva a tiempo.')
    + '</span>'
    + '<div style="display:flex;gap:10px;align-items:center">'
    + '<button onclick="navTo(\'licencia\')" style="background:'+color+';color:#000;border:none;border-radius:6px;padding:6px 16px;font-size:12px;font-weight:700;cursor:pointer">Renovar ahora</button>'
    + '<button onclick="document.getElementById(\'lic_banner\').remove()" style="background:none;border:none;color:'+color+';font-size:18px;cursor:pointer;line-height:1">×</button>'
    + '</div>';
  document.body.appendChild(banner);
}


async function diagnosticarConexionSupabase() {
  var modal_body = '<div style="font-family:var(--font-mono);font-size:12px;line-height:2;background:var(--bg3);padding:14px;border-radius:8px">Verificando...</div>';
  openModal('diag_supa', '🔧 Diagnóstico Supabase', modal_body, function(){}, false);

  var resultados = [];
  var codigosEncontrados = [];

  try {
    var hdrs = { "apikey": SUPA_KEY, "Authorization": "Bearer " + SUPA_KEY };

    // Leer todos los registros de tp_licencias
    var r2 = await fetch(SUPA_URL + "/rest/v1/tp_licencias?select=codigo,taller_nombre,activa,fecha_vence&limit=20", { headers: hdrs });
    var d2 = await r2.json();
    resultados.push("Tabla tp_licencias: " + (r2.ok ? "✓ (" + r2.status + ")" : "✗ Error " + r2.status));
    if (r2.ok && Array.isArray(d2) && d2.length) {
      d2.forEach(function(lic) { codigosEncontrados.push({tabla:'tp_licencias', lic:lic}); });
    } else if (r2.ok && Array.isArray(d2) && !d2.length) {
      resultados.push("⚠ tp_licencias está VACÍA — debes insertar un registro");
    }

    // Leer todos los registros de licencias
    var r3 = await fetch(SUPA_URL + "/rest/v1/licencias?select=codigo,taller,activa,fecha_vence&limit=20", { headers: hdrs });
    var d3 = await r3.json();
    resultados.push("Tabla licencias: " + (r3.ok ? "✓ (" + r3.status + ")" : "✗ Error " + r3.status));
    if (r3.ok && Array.isArray(d3) && d3.length) {
      d3.forEach(function(lic) { codigosEncontrados.push({tabla:'licencias', lic:lic}); });
    } else if (r3.ok && Array.isArray(d3) && !d3.length) {
      resultados.push("⚠ licencias está VACÍA — debes insertar un registro");
    }

  } catch(e) {
    resultados.push("Error: " + e.message);
  }

  var codigosHTML = '';
  if (codigosEncontrados.length) {
    codigosHTML = '<div style="margin-top:12px"><div style="font-weight:600;font-size:12px;margin-bottom:6px;color:var(--text2)">Códigos en Supabase:</div>'
      + codigosEncontrados.map(function(item) {
          var lic = item.lic;
          var cod = lic.codigo || '—';
          var act = lic.activa ? '✓ activa' : '✗ inactiva';
          var vence = lic.fecha_vence || lic.fecha_vence || '—';
          var nom = lic.taller_nombre || lic.taller || '—';
          return '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px;margin-bottom:6px;font-family:var(--font-mono);font-size:11px">'
            + '<div style="color:var(--accent);font-size:13px;font-weight:700;letter-spacing:1px">' + cod + '</div>'
            + '<div style="color:var(--text3)">' + nom + ' · ' + act + ' · vence: ' + vence + '</div>'
            + '<div style="color:var(--text3);font-size:10px">tabla: ' + item.tabla + '</div>'
            + '<button onclick="document.getElementById(\'lic_codigo_pg\').value=\'' + cod + '\';closeModal(\'diag_supa\');" style="margin-top:6px;background:var(--accent);color:#000;border:none;border-radius:4px;padding:4px 10px;font-size:11px;cursor:pointer">Usar este código</button>'
            + '</div>';
        }).join('')
      + '</div>';
  } else {
    codigosHTML = '<div style="margin-top:12px;padding:12px;background:var(--red-dim);border-radius:6px;font-size:12px;color:var(--red)">'
      + '<strong>No hay códigos de licencia en Supabase.</strong><br>'
      + 'Debes insertar uno en la tabla tp_licencias o licencias.<br><br>'
      + '<strong>SQL para insertar:</strong></div>'
      + '<div style="background:var(--bg3);padding:10px;border-radius:6px;font-family:var(--font-mono);font-size:11px;margin-top:6px;user-select:all">'
      + "INSERT INTO tp_licencias (codigo, taller_nombre, plan, activa, fecha_inicio, fecha_vence)<br>"
      + "VALUES ('TALLER-001-GT', 'Mi Taller', 'anual', true, CURRENT_DATE, CURRENT_DATE + 365);"
      + '</div>';
  }

  var bodyEl = document.querySelector('#modal_diag_supa .modal-body');
  if (bodyEl) {
    bodyEl.innerHTML = '<div style="font-family:var(--font-mono);font-size:12px;line-height:2;background:var(--bg3);padding:14px;border-radius:8px">'
      + resultados.join('<br>')
      + '</div>'
      + '<div style="margin-top:8px;font-size:10px;color:var(--text3)">URL: ' + SUPA_URL + '</div>'
      + codigosHTML;
  }
}


function mostrarPantallaDemo() {
  var demo = getDemoInfo();
  if (estaActivo() || !demo.vencido) return;
  // Demo vencido: mostrar overlay bloqueante
  var overlay = document.createElement('div');
  overlay.id = 'demo_overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,15,15,.97);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:24px;text-align:center';
  overlay.innerHTML = '<div style="max-width:420px">'
    + '<div style="font-size:48px;margin-bottom:12px">🔒</div>'
    + '<div style="font-size:22px;font-weight:700;color:var(--accent);margin-bottom:8px">Período de prueba terminado</div>'
    + '<div style="font-size:14px;color:var(--text2);margin-bottom:24px;line-height:1.6">Tu demo gratuito de ' + DEMO_DIAS + ' días ha finalizado. Activa tu licencia anual para continuar usando TallerPro GT sin límites.</div>'
    + '<div style="background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:16px;margin-bottom:20px">'
    + '<div style="font-size:11px;color:var(--text3);margin-bottom:4px">TU ID DE INSTALACIÓN</div>'
    + '<div style="font-family:var(--font-mono);font-size:16px;color:var(--accent);letter-spacing:2px;user-select:all">' + getInstallId() + '</div>'
    + '</div>'
    + '<button onclick="navTo(\'licencia\')" style="background:var(--accent);color:#0f0f0f;border:none;border-radius:8px;padding:14px 32px;font-size:15px;font-weight:700;cursor:pointer;width:100%;margin-bottom:10px">Activar licencia ahora</button>'
    + '<div style="font-size:11px;color:var(--text3)">¿Ya tienes tu código? Escríbelo directamente en el campo que aparecerá.</div>'
    + '</div>';
  document.body.appendChild(overlay);
}

function bloqueadoEnDemo(modulo) {
  if (estaActivo()) return false;
  var demo = getDemoInfo();
  if (demo.vencido) return true; // todo bloqueado si venció
  return DEMO_BLOQUEADOS.includes(modulo);
}

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
