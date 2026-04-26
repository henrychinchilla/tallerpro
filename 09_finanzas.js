/* TallerPro GT — js/05_licencia.js */
/* Generado automáticamente — editar este archivo */

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
const FABRICANTES_DB={
  Toyota:{
    modelos:['Hilux','Corolla','RAV4','Fortuner','Land Cruiser','Yaris','Camry','Prius'],
    intervalos:{aceite:5000,filtroAire:20000,filtroCombustible:40000,bujias:40000,correa:90000,frenos:30000,refrigerante:40000},
    aceiteRecomendado:'5W-30 o 10W-30 sint\u00E9tico (API SN/SP)',
    filtroAceite:'Toyota Part 90915-YZZD1 o equivalente',
    observaciones:'Revisar nivel de fluido de transmisi\u00F3n cada 40,000 km. Calibrar v\u00E1lvulas cada 60,000 km en motores 2TR.'
  },
  Nissan:{
    modelos:['Frontier','Pathfinder','Sentra','Versa','Altima','NP300','Urvan'],
    intervalos:{aceite:5000,filtroAire:15000,filtroCombustible:30000,bujias:30000,correa:80000,frenos:25000,refrigerante:40000},
    aceiteRecomendado:'5W-30 o 5W-40 (API SN)',
    filtroAceite:'Nissan 15208-65F0E o equivalente Fram PH6607',
    observaciones:'Verificar sensor MAF cada 30,000 km. Aceite CVT Nissan NS-3 solo en transmisiones autom\u00E1ticas.'
  },
  Chevrolet:{
    modelos:['Silverado','Colorado','Suburban','Traverse','Cruze','Spark','Captiva','D-MAX'],
    intervalos:{aceite:5000,filtroAire:20000,filtroCombustible:40000,bujias:40000,correa:100000,frenos:30000,refrigerante:50000},
    aceiteRecomendado:'Dexos 1 Gen2 5W-30 (obligatorio en motores Ecotec)',
    filtroAceite:'AC Delco PF48E o equivalente',
    observaciones:'No mezclar refrigerante Dex-Cool con refrigerante verde. Revisar m\u00F3dulo de admisi\u00F3n de aire cada 40,000 km.'
  },
  Ford:{
    modelos:['F-150','F-350','Explorer','Ranger','Escape','EcoSport','Fusion','Transit'],
    intervalos:{aceite:8000,filtroAire:20000,filtroCombustible:50000,bujias:60000,correa:150000,frenos:30000,refrigerante:80000},
    aceiteRecomendado:'5W-20 o 5W-30 Motorcraft (API SP)',
    filtroAceite:'Motorcraft FL-500S o equivalente',
    observaciones:'Motor EcoBoost requiere atenci\u00F3n especial a refrigeraci\u00F3n. Revisar turbocargador cada 60,000 km.'
  },
  Honda:{
    modelos:['CRV','Civic','Pilot','Accord','Fit','HRV','Odyssey','Ridgeline'],
    intervalos:{aceite:5000,filtroAire:30000,filtroCombustible:45000,bujias:45000,correa:105000,frenos:30000,refrigerante:50000},
    aceiteRecomendado:'0W-20 o 5W-20 (Honda Genuine o API SN PLUS)',
    filtroAceite:'Honda 15400-PLM-A02 o equivalente Fram CH9018',
    observaciones:'El aceite 0W-20 es mandatorio en modelos i-VTEC recientes. No usar aceite mineral en motores de alta compresi\u00F3n Honda.'
  },
  Hyundai:{
    modelos:['Tucson','Santa Fe','Accent','Elantra','Creta','H350','Porter','Sonata'],
    intervalos:{aceite:5000,filtroAire:30000,filtroCombustible:40000,bujias:40000,correa:90000,frenos:30000,refrigerante:40000},
    aceiteRecomendado:'5W-30 o 5W-40 (API SN/SP)',
    filtroAceite:'Hyundai 26300-35503 o equivalente',
    observaciones:'Revisar tensador de cadena de distribuci\u00F3n en motores Theta II. Inspecci\u00F3n de frenos de mano electr\u00F3nico cada 20,000 km.'
  },
  Kia:{
    modelos:['Sportage','Sorento','Rio','Cerato','Picanto','Carnival','Stinger','Seltos'],
    intervalos:{aceite:5000,filtroAire:30000,filtroCombustible:40000,bujias:40000,correa:90000,frenos:30000,refrigerante:40000},
    aceiteRecomendado:'5W-30 sint\u00E9tico (API SN)',
    filtroAceite:'Kia 26300-3X300 o equivalente',
    observaciones:'Compartir plataforma con Hyundai. Inspecci\u00F3n de sistema GDI (inyecci\u00F3n directa) cada 50,000 km para dep\u00F3sitos de carb\u00F3n.'
  },
  Mitsubishi:{
    modelos:['L200','Montero','Outlander','ASX','Lancer','Eclipse Cross','Galant'],
    intervalos:{aceite:5000,filtroAire:25000,filtroCombustible:40000,bujias:30000,correa:90000,frenos:30000,refrigerante:40000},
    aceiteRecomendado:'5W-30 o 10W-40 (API SN)',
    filtroAceite:'Mitsubishi MD069782 o equivalente Purolator PL14610',
    observaciones:'Sistema 4WD Super Select requiere aceite diferencial especial cada 30,000 km. Verificar embrague de transferencia.'
  },
  Isuzu:{
    modelos:['D-Max','MU-X','Trooper','Elf','NHR','NPR','FRR','FVR'],
    intervalos:{aceite:5000,filtroAire:20000,filtroCombustible:30000,bujias:40000,correa:100000,frenos:25000,refrigerante:40000},
    aceiteRecomendado:'15W-40 diesel (API CI-4) o 5W-30 en motores gasolina',
    filtroAceite:'Isuzu 8972381880 o equivalente Baldwin B7188',
    observaciones:'Motor diesel 4JJ1 requiere revisi\u00F3n de inyectores cada 80,000 km. DPF (filtro de part\u00EDculas) en modelos Euro V.'
  },
  Kenworth:{
    modelos:['T680','T880','W900','T370','T470','C500'],
    intervalos:{aceite:10000,filtroAire:50000,filtroCombustible:20000,bujias:null,correa:250000,frenos:20000,refrigerante:100000},
    aceiteRecomendado:'15W-40 o 10W-30 heavy duty (API CK-4/FA-4)',
    filtroAceite:'Fleetguard LF3000 o equivalente Wix 51515',
    observaciones:'Motores PACCAR MX requieren aceite API CK-4. Revisar sistema de frenos de aire cada 20,000 km. Lubricaci\u00F3n de quinta rueda mensual.'
  },
  Freightliner:{
    modelos:['Cascadia','Columbia','M2','FL50','FL60','FL80'],
    intervalos:{aceite:10000,filtroAire:50000,filtroCombustible:20000,bujias:null,correa:250000,frenos:20000,refrigerante:100000},
    aceiteRecomendado:'15W-40 Shell Rotella T6 o equivalente (API CK-4)',
    filtroAceite:'Fleetguard LF9009 o equivalente',
    observaciones:'Motor Detroit DD13/DD15 requiere aceite de viscosidad alta. Verificar sistema EGR y DPF cada 50,000 km. Revisi\u00F3n de suspensi\u00F3n neum\u00E1tica.'
  },
  Mack:{
    modelos:['Pinnacle','Granite','Anthem','LR Electric','TerraPro'],
    intervalos:{aceite:10000,filtroAire:50000,filtroCombustible:20000,bujias:null,correa:250000,frenos:20000,refrigerante:100000},
    aceiteRecomendado:'15W-40 heavy duty (API CK-4) Mack EO-O PP',
    filtroAceite:'Fleetguard LF14000NN o equivalente',
    observaciones:'Usar solo aceites aprobados Mack EO-O PP para garant\u00EDa. Revisi\u00F3n de caja Mack T318 cada 120,000 km.'
  },
  Volvo:{
    modelos:['FH','FM','FMX','FE','FL','VNL','VNR'],
    intervalos:{aceite:10000,filtroAire:50000,filtroCombustible:15000,bujias:null,correa:300000,frenos:20000,refrigerante:100000},
    aceiteRecomendado:'Volvo VDS-4 15W-40 o equivalente aprobado',
    filtroAceite:'Volvo 466634 o equivalente Fleetguard LF3000',
    observaciones:'Sistema I-Shift requiere aceite Volvo 97307. Revisi\u00F3n de AdBlue/DEF cada llenado. Diagn\u00F3stico con herramienta VCADS Pro.'
  },
  'Mercedes-Benz':{
    modelos:['Sprinter','Actros','Atego','Axor','Vito','GLE','GLC','C-Class'],
    intervalos:{aceite:10000,filtroAire:40000,filtroCombustible:20000,bujias:40000,correa:200000,frenos:30000,refrigerante:60000},
    aceiteRecomendado:'5W-30 MB 229.52 o 229.51 (solo aprobados Mercedes)',
    filtroAceite:'Mercedes A0001801209 o equivalente Mann W71280',
    observaciones:'Los motores OM651 y OM642 solo admiten aceites con aprobaci\u00F3n MB 229.51/52. Revisar actuador de swirl cada 60,000 km.'
  },
  Hino:{
    modelos:['300','500','700','Ranger','Dutro','FC','FG','FM','GH'],
    intervalos:{aceite:5000,filtroAire:25000,filtroCombustible:20000,bujias:null,correa:120000,frenos:20000,refrigerante:50000},
    aceiteRecomendado:'15W-40 diesel (API CH-4/CI-4) Hino Genuine',
    filtroAceite:'Hino 15600-E0010 o equivalente',
    observaciones:'Motor J05D/J08E requiere revisi\u00F3n de inyectores cada 80,000 km. Sistema DPD (diesel particulate diffuser) en modelos recientes.'
  },
  Otro:{
    modelos:['Otro modelo'],
    intervalos:{aceite:5000,filtroAire:20000,filtroCombustible:30000,bujias:30000,correa:90000,frenos:30000,refrigerante:40000},
    aceiteRecomendado:'Consultar manual del fabricante',
    filtroAceite:'Consultar manual del fabricante',
    observaciones:'Seguir especificaciones del fabricante para este modelo.'
  }
};

const TIPOS_VEHICULO=['Sedan','Pickup','Camioneta/SUV','Bus','Cami\u00F3n','Cabezal','Microbus','Furgoneta'];
const CATEGORIAS_REPUESTO=['Filtros','Aceites y Lubricantes','Frenos','Motor','Suspensi\u00F3n','Transmisi\u00F3n','El\u00E9ctrico','Refrigeraci\u00F3n','Direcci\u00F3n','Neum\u00E1ticos','Carrocer\u00EDa','General'];

/* ---- NAVIGATION ---- */
const NAV_CONFIG=[
  {section:'Dashboard'},
  {id:'dashboard',label:'Dashboard',icon:'',perfil:'all'},
  {id:'dashboard_mecanicos',label:'KPI Mec\u00E1nicos',icon:'',perfil:'admin'},
  {id:'dashboard_financiero',label:'Financiero',icon:'',perfil:'admin'},
  {id:'dash_facturas',label:'Dashboard Facturas',icon:'',perfil:'supervisor'},
  {id:'dash_cotizaciones',label:'Dashboard Cotizaciones',icon:'',perfil:'supervisor'},
  {id:'dash_budget',label:'Dashboard Budget',icon:'',perfil:'supervisor'},
  {section:'Taller'},
  {id:'alertas',label:'Alertas',icon:'',badge:true,perfil:'all'},
  {id:'recepciones',label:'Recepci\u00F3n',icon:'',perfil:'all'},
  {id:'ordenes',label:'\u00D3rdenes de Trabajo',icon:'',perfil:'all'},
  {id:'facturas',label:'Facturaci\u00F3n',icon:'',perfil:'supervisor'},
  {id:'cotizador',label:'Cotizador',icon:'',perfil:'supervisor'},
  {id:'budget',label:'Budget / Presupuesto',icon:'',perfil:'supervisor'},
  {section:'Inventario'},
  {id:'repuestos',label:'Repuestos',icon:'🔩',perfil:'all'},
  {id:'insumos',label:'Insumos',icon:'🧴',perfil:'all'},
  {id:'proveedores',label:'Proveedores',icon:'🚚',perfil:'supervisor'},
  {id:'bodegas',label:'Bodegas',icon:'🏭',perfil:'admin'},
  {id:'envios',label:'Envios',icon:'📦',perfil:'supervisor'},
  {id:'servicios_externos',label:'Servicios Externos',icon:'',perfil:'supervisor'},
  {section:'Clientes'},
  {id:'clientes',label:'Clientes',icon:'👤',perfil:'all'},
  {id:'vehiculos',label:'Veh\u00EDculos',icon:'',perfil:'all'},
  {id:'flota',label:'Flota Empresarial',icon:'',perfil:'supervisor'},
  {section:'RRHH'},
  {id:'historial_pagos',label:'Historial de Pagos',icon:'',perfil:'admin'},
  {id:'gestion_rrhh',label:'Gestion RRHH',icon:'',perfil:'admin'},
  {id:'liquidacion',label:'Liquidacion',icon:'📝',perfil:'admin'},
  {id:'reporte_general',label:'Reporte General',icon:'',perfil:'admin'},
  {id:'empleados',label:'Empleados',icon:'👥',perfil:'admin'},
  {id:'nomina',label:'N\u00F3mina',icon:'',perfil:'admin'},
  {id:'capacitacion',label:'Capacitacion',icon:'',perfil:'admin'},
  {id:'aumentos',label:'Aumentos Salariales',icon:'',perfil:'admin'},
  {section:'Finanzas'},
  {id:'bancos',label:'Bancos',icon:'🏦',perfil:'admin'},
  {id:'servicios',label:'Servicios Fijos',icon:'📌',perfil:'admin'},
  {id:'viaticos',label:'Viaticos y Gastos',icon:'🧾',perfil:'supervisor'},
  {id:'importar_sat',label:'Facturas SAT',icon:'📥',perfil:'admin'},
  {id:'costos',label:'Costos Operativos',icon:'💰',perfil:'supervisor'},
  {id:'activos',label:'Activos/Depreciaci\u00F3n',icon:'',perfil:'admin'},
  {id:'rentabilidad',label:'Rentabilidad',icon:'📈',perfil:'admin'},
  {id:'impuestos',label:'IVA / ISR',icon:'',perfil:'admin'},
  {id:'contabilidad',label:'Contabilidad',icon:'📒',perfil:'admin'},
  {section:'Sistema'},
  {id:'licencia',label:'\uD83D\uDD11 Mi Licencia',icon:'\uD83D\uDD11',perfil:'admin'},
  {id:'whatsapp',label:'WhatsApp Bot',icon:'💬',perfil:'admin'},
  {id:'fel',label:'Facturacion FEL',icon:'',perfil:'admin'},
  {id:'auditoria',label:'Log de Auditoria',icon:'🔎',perfil:'admin'},

  {id:'import_export',label:'Importar/Exportar',icon:'',perfil:'admin'},
  {id:'usuarios',label:'Usuarios',icon:'👤',perfil:'admin'},
  {id:'pos',label:'POS / Tarjetas',icon:'💳',perfil:'admin'},
  {id:'configuracion',label:'Configuraci\u00F3n',icon:'',perfil:'admin'},
];

let currentPage='dashboard';

async function renderNav(badgeCount=0){
  const el=document.getElementById('nav-menu');
  if(!el)return;
  const nivel=PERFILES[sesionActual?.perfil]?.nivel||0;
  el.innerHTML=NAV_CONFIG.map(n=>{
    if(n.section)return`<div class="nav-section">${n.section}</div>`;
    const perfilNivel=n.perfil==='all'?1:n.perfil==='supervisor'?2:3;
    if(perfilNivel>nivel)return'';
    const active=currentPage===n.id?'active':'';
    const badge=n.badge&&badgeCount>0?`<span class="nav-badge">${badgeCount}</span>`:'';
    return`<div class="nav-item ${active}" onclick="navTo('${n.id}')"><span class="icon">${n.icon}</span>${n.label}${badge}</div>`;
  }).join('');
}

async function navTo(page){
  if(!sesionActual){mostrarLogin();return;}
  const item=NAV_CONFIG.find(n=>n.id===page);
  if(item){
    const nivel=PERFILES[sesionActual.perfil]?.nivel||0;
    const perfilNivel=item.perfil==='all'?1:item.perfil==='supervisor'?2:3;
    if(perfilNivel>nivel){toast('Acceso denegado para tu perfil','red');return;}
  }
  currentPage=page;
  const alerts=await dbGetAll('alertas');
  const pending=alerts.filter(a=>!a.vista).length;
  await renderNav(pending);
  await renderPage(page);
}

/* ---- MODAL SYSTEM ---- */
function openModal(id,title,body,onSave,wide=false){
  const ex=document.getElementById('modal_'+id);if(ex)ex.remove();
  const m=document.createElement('div');m.id='modal_'+id;m.className='modal-overlay open';
  m.innerHTML=`<div class="modal" style="${wide?'max-width:860px':''}">
    <div class="modal-header"><span class="modal-title">${title}</span><button class="modal-close" onclick="closeModal('${id}')">\u2715</button></div>
    <div class="modal-body">${body}</div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('${id}')">Cancelar</button>
      <button class="btn btn-primary" onclick="window._ms_${id}()">Guardar</button>
    </div></div>`;
  document.body.appendChild(m);
  m.addEventListener('click',e=>{if(e.target===m)closeModal(id);});
  window[`_ms_${id}`]=onSave;
}
function closeModal(id){const el=document.getElementById('modal_'+id);if(el)el.remove();}
function cerrarModal(id){closeModal(id);}  // alias para compatibilidad

/* ---- USUARIOS ---- */
async function renderUsuarios(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Acceso solo para administradores</div>';return;}
  const usuarios=await dbGetAll('usuarios');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalUsuario()">+ Nuevo usuario</button>`;
  content.innerHTML=`
  <div class="section-title">Control de Usuarios y Accesos</div>
  <div class="section-sub">Gesti\u00F3n de perfiles y permisos del sistema</div>

  <div class="stat-grid" style="grid-template-columns:repeat(3,1fr)">
    ${Object.entries(PERFILES).map(([k,v])=>`<div class="stat-card">
      <div class="stat-label">${v.label}</div>
      <div class="stat-value" style="color:var(--${v.color==='amber'?'accent':v.color})">${usuarios.filter(u=>u.perfil===k&&u.activo).length}</div>
      <div class="stat-sub">usuarios activos</div>
    </div>`).join('')}
  </div>

  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>Usuario</th><th>Nombre</th><th>Perfil</th><th>Email</th><th>\u00DAltimo acceso</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>
        ${usuarios.map(u=>`<tr>
          <td class="td-mono" style="font-weight:600">${u.username}</td>
          <td>${u.nombre}</td>
          <td><span class="badge badge-${u.perfil==='admin'?'red':u.perfil==='supervisor'?'amber':'blue'}">${PERFILES[u.perfil]?.label||u.perfil}</span></td>
          <td class="text-muted">${u.email||'\u2014'}</td>
          <td style="font-size:11px;color:var(--text3)">${fechaLegible(u.ultimoAcceso)}</td>
          <td><span class="badge badge-${u.activo?'green':'gray'}">${u.activo?'Activo':'Inactivo'}</span></td>
          <td><div class="flex gap-1">
            <button class="btn btn-sm btn-secondary" onclick="modalUsuario(${u.id})">\u270F</button>
            <button class="btn btn-sm btn-secondary" onclick="resetPassword(${u.id})">\u1F511</button>
            ${u.username!=='admin'?`<button class="btn btn-sm btn-danger" onclick="toggleUsuario(${u.id},${u.activo})">\u23F8</button>`:''}
          </div></td>
        </tr>`).join('')||'<tr><td colspan="7" class="text-center text-muted" style="padding:20px">Sin usuarios</td></tr>'}
      </tbody>
    </table></div>
  </div>

  <div class="card">
    <div class="card-title" style="margin-bottom:12px">Permisos por perfil</div>
    <div class="table-wrap"><table>
      <thead><tr><th>M\u00F3dulo</th><th>Administrador</th><th>Supervisor</th><th>Operador</th></tr></thead>
      <tbody>
        ${[
          ['Dashboard general','\u2705','\u2705','\u2705'],
          ['Recepciones y OT','\u2705','\u2705','\u2705'],
          ['Inventario','\u2705','\u2705','Solo lectura'],
          ['Clientes y veh\u00EDculos','\u2705','\u2705','\u2705'],
          ['Facturaci\u00F3n','\u2705','\u2705','\u274C'],
          ['Empleados y n\u00F3mina','\u2705','\u274C','\u274C'],
          ['Costos y finanzas','\u2705','\u2705','\u274C'],
          ['Rentabilidad e impuestos','\u2705','\u274C','\u274C'],
          ['KPI y bonificaciones','\u2705','\u274C','\u274C'],
          ['Usuarios y configuraci\u00F3n','\u2705','\u274C','\u274C'],
          ['Eliminar registros','\u2705','\u274C','\u274C'],
        ].map(r=>`<tr>${r.map((c,i)=>`<td ${i>0?'style="text-align:center"':''}>${c}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table></div>
    </div>
  </div>
  `;
}

async function modalUsuario(id=null){
  if(!soloAdmin()){toast('Solo administradores','red');return;}
  const u=id?await dbGet('usuarios',id):{};
  openModal('modalUsuario',id?'Editar Usuario':'Nuevo Usuario',`
    <div class="form-row form-row-2">
      <div class="form-group"><label>Nombre completo *</label><input id="u_nom" value="${u.nombre||''}" placeholder="Nombre del usuario"></div>
      <div class="form-group"><label>Usuario (login) *</label><input id="u_usr" value="${u.username||''}" placeholder="sin espacios" ${id&&u.username==='admin'?'readonly':''}></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Email</label><input id="u_email" type="email" value="${u.email||''}" placeholder="correo@taller.com"></div>
      <div class="form-group"><label>Tel\u00E9fono</label><input id="u_tel" value="${u.telefono||''}" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Perfil *</label>
        <select id="u_perfil" ${id&&u.username==='admin'?'disabled':''}>
          <option value="operador" ${u.perfil==='operador'?'selected':''}>Operador \u2014 Ingreso de datos b\u00E1sico</option>
          <option value="supervisor" ${u.perfil==='supervisor'?'selected':''}>Supervisor \u2014 Gesti\u00F3n intermedia</option>
          <option value="admin" ${u.perfil==='admin'?'selected':''}>Administrador \u2014 Acceso total</option>
        </select>
      </div>
      <div class="form-group"><label>${id?'Nueva contrase\u00F1a (dejar vac\u00EDo = sin cambio)':'Contrase\u00F1a *'}</label>
        <input id="u_pass" type="password" placeholder="${id?'Nueva contrase\u00F1a':'Contrase\u00F1a inicial'}">
      </div>
    </div>
    ${id?`<div class="form-group"><label><input type="checkbox" id="u_activo" ${u.activo!==false?'checked':''} style="width:auto;margin-right:6px">Usuario activo</label></div>`:''}
    <div class="form-group"><label>Cargo / Puesto</label><input id="u_cargo" value="${u.cargo||''}" placeholder="Mec\u00E1nico, Contador, Gerente..."></div>
  `,async()=>{
    const nombre=document.getElementById('u_nom').value.trim();
    const username=document.getElementById('u_usr').value.trim().toLowerCase().replace(/\s/g,'');
    const pass=document.getElementById('u_pass').value;
    if(!nombre||!username){toast('Nombre y usuario requeridos','red');return;}
    if(!id&&!pass){toast('Contrase\u00F1a requerida para nuevo usuario','red');return;}
    const obj={
      nombre,username,
      perfil:document.getElementById('u_perfil').value,
      email:document.getElementById('u_email').value,
      telefono:document.getElementById('u_tel').value,
      cargo:document.getElementById('u_cargo').value,
      activo:id?(document.getElementById('u_activo')?.checked!==false):true,
      updatedAt:nowTs()
    };
    if(pass)obj.passwordHash=hashSimple(pass);
    if(id){obj.id=id;if(!obj.passwordHash)delete obj.passwordHash;
      const ex=await dbGet('usuarios',id);obj.passwordHash=obj.passwordHash||ex.passwordHash;
      await dbPut('usuarios',obj);
    }else{obj.createdAt=nowTs();await dbAdd('usuarios',obj);}
    closeModal('modalUsuario');toast(id?'Usuario actualizado':'Usuario creado');
    await navTo('usuarios');
  });
}

async function resetPassword(id){
  if(!soloAdmin())return;
  const nueva=prompt('Nueva contrase\u00F1a para este usuario:');
  if(!nueva)return;
  const u=await dbGet('usuarios',id);
  u.passwordHash=hashSimple(nueva);u.updatedAt=nowTs();
  await dbPut('usuarios',u);toast('Contrase\u00F1a restablecida');
}

async function toggleUsuario(id,activo){
  if(!soloAdmin())return;
  const u=await dbGet('usuarios',id);u.activo=!activo;
  await dbPut('usuarios',u);toast(`Usuario ${u.activo?'activado':'desactivado'}`);
  await navTo('usuarios');
}

/* ---- EMPLEADOS ---- */
async function renderEmpleados(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Acceso solo para administradores</div>';return;}
  const empleados=await dbGetAll('empleados');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalEmpleado()">+ Nuevo empleado</button>`;
  const activos=empleados.filter(e=>e.activo!==false);
  const totalNomina=activos.reduce((a,e)=>a+(e.salarioBase||0),0);

  content.innerHTML=`
  <div class="section-title">Gesti\u00F3n de Empleados</div>
  <div class="section-sub">${activos.length} empleados activos \u2014 N\u00F3mina base: <strong class="text-green">${fmt(totalNomina)}/mes</strong></div>

  <div class="stat-grid">
    <div class="stat-card stat-green"><div class="stat-label">Total empleados</div><div class="stat-value">${activos.length}</div></div>
    <div class="stat-card stat-amber"><div class="stat-label">N\u00F3mina base mensual</div><div class="stat-value">${fmt(totalNomina)}</div></div>
    <div class="stat-card"><div class="stat-label">Costo total c/prestaciones</div>
      <div class="stat-value" style="font-size:16px">${fmt(activos.reduce((a,e)=>a+calcCostoEmpleado(e),0))}</div>
      <div class="stat-sub">Incluye IGSS, Irtra, Intecap</div>
    </div>
  </div>

  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>Empleado</th><th>Cargo</th><th>Salario base</th><th>Costo total</th><th>IGSS</th><th>Bonif. ley</th><th>Ingreso</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>
        ${empleados.map(e=>{
          const costo=calcCostoEmpleado(e);
          const igss=e.salarioBase*0.0483;// 4.83% empleado
          const bonif=250;// Bonificaci\u00F3n decreto 78-89 Q250 fija
          return`<tr>
            <td><strong>${e.nombre}</strong><div style="font-size:11px;color:var(--text3)">${e.dpi||'DPI no registrado'}</div></td>
            <td><span class="badge badge-gray">${e.cargo||'\u2014'}</span></td>
            <td class="td-mono">${fmt(e.salarioBase||0)}</td>
            <td class="td-mono text-amber">${fmt(costo)}</td>
            <td class="td-mono" style="font-size:11px;color:var(--red)">-${fmt(igss)}</td>
            <td class="td-mono text-green">+${fmt(bonif)}</td>
            <td style="font-size:11px">${fechaLegible(e.fechaIngreso)}</td>
            <td><span class="badge badge-${e.activo!==false?'green':'gray'}">${e.activo!==false?'Activo':'Inactivo'}</span></td>
            <td><div class="flex gap-1">
              <button class="btn btn-sm btn-secondary" onclick="modalEmpleado(${e.id})">\u270F</button>
              <button class="btn btn-sm btn-blue" onclick="verPrestaciones(${e.id})">\u1F4CB</button>
              <button class="btn btn-sm btn-danger" onclick="toggleEmpleado(${e.id},${e.activo!==false})">\u23F8</button>
            </div></td>
          </tr>`;
        }).join('')||'<tr><td colspan="9" class="text-center text-muted" style="padding:20px">Sin empleados registrados</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}

function calcISREmpleado(salarioMensual) {
  // ISR Guatemala 2024 - Régimen sobre Utilidades (Art. 72 Ley Actualización Tributaria)
  // Renta anual = salario mensual * 12 + bono14 + aguinaldo
  var rentaAnual = salarioMensual * 12 + salarioMensual + salarioMensual; // incluye bono14 y aguinaldo
  var exencion = 48000; // Q48,000 exentos
  var renta = Math.max(0, rentaAnual - exencion);
  var isr = 0;
  if (renta <= 0) return 0;
  if (renta <= 300000) {
    isr = renta * 0.05; // 5% hasta Q300,000
  } else {
    isr = 300000 * 0.05 + (renta - 300000) * 0.07; // 7% sobre el excedente
  }
  return isr / 12; // retención mensual
}

function calcDetalleEmpleado(e) {
  var base    = e.salarioBase || 0;
  var bonifDecr = 250;                    // Bonificación Decreto 78-89 (obligatoria)
  var bonifAd = e.bonificacionAdicional || 0;
  var descAd  = e.descuentoAdicional || 0;
  // Deducciones del empleado
  var igssEmp = base * 0.0483;            // IGSS empleado 4.83%
  var isrEmp  = calcISREmpleado(base);    // ISR estimado mensual
  var neto    = base + bonifDecr + bonifAd - igssEmp - isrEmp - descAd;
  // Carga patronal
  var igssPatrono = base * 0.1267;        // 12.67% patronal
  var irtra       = base * 0.01;          // 1% IRTRA
  var intecap     = base * 0.01;          // 1% INTECAP
  // Provisiones mensuales (lo que se acumula cada mes)
  var provBono14  = base / 12;            // Bono 14 (1/12 mensual)
  var provAguinal = base / 12;            // Aguinaldo (1/12 mensual)
  var provIndem   = base / 12;            // Indemnización (1/12 mensual, Art.82 CT)
  var provVac     = (base * 15/365);      // Provisión vacaciones (15 días/año)
  // Costo total mensual para el empleador
  var costoDirecto = base + bonifDecr + bonifAd + igssPatrono + irtra + intecap;
  var provisiones  = provBono14 + provAguinal + provIndem + provVac;
  var costoTotal   = costoDirecto + provisiones;
  return {
    base, bonifDecr, bonifAd, descAd,
    igssEmp, isrEmp, neto,
    igssPatrono, irtra, intecap,
    provBono14, provAguinal, provIndem, provVac,
    costoDirecto, provisiones, costoTotal
  };
}

function calcCostoEmpleado(e) {
  return calcDetalleEmpleado(e).costoTotal;
}


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

async function modalEmpleado(id=null){
  const e=id?await dbGet('empleados',id):{};
  openModal('modalEmpleado',id?'Editar Empleado':'Nuevo Empleado',`
    <div class="form-row form-row-2">
      <div class="form-group"><label>Nombre completo *</label><input id="em_nom" value="${e.nombre||''}" placeholder="Nombre del empleado"></div>
      <div class="form-group"><label>DPI</label><input id="em_dpi" value="${e.dpi||''}" placeholder="N\u00FAmero de DPI"></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Cargo *</label>
        <select id="em_cargo"><option value="Mec\u00E1nico" ${e.cargo==='Mec\u00E1nico'?'selected':''}>Mec\u00E1nico</option><option value="Mec\u00E1nico senior" ${e.cargo==='Mec\u00E1nico senior'?'selected':''}>Mec\u00E1nico senior</option><option value="Electricista" ${e.cargo==='Electricista'?'selected':''}>Electricista automotriz</option><option value="Auxiliar" ${e.cargo==='Auxiliar'?'selected':''}>Auxiliar mec\u00E1nico</option><option value="Recepcionista" ${e.cargo==='Recepcionista'?'selected':''}>Recepcionista</option><option value="Contador" ${e.cargo==='Contador'?'selected':''}>Contador</option><option value="Administrador" ${e.cargo==='Administrador'?'selected':''}>Administrador</option><option value="Otro" ${e.cargo==='Otro'?'selected':''}>Otro</option></select>
      </div>
      <div class="form-group">
      <label>Salario minimo 2026 — referencia (AG 256-2025)</label>
      <select id="em_salmin" onchange="aplicarSalMin(this,document.getElementById('em_sal'))" style="font-size:12px">
        <option value="">-- Auto-llenar con salario minimo legal --</option>
        <optgroup label="CE1 — Departamento de Guatemala">
          <option value="CE1_noAgricola">No Agricola CE1 — Q4,002.28 base + Q250 = Q4,252.28 (Talleres ✓)</option>
          <option value="CE1_agricola">Agricola CE1 — Q3,791.20 base + Q250 = Q4,041.20</option>
          <option value="CE1_maquila">Maquila/Exportadora CE1 — Q3,409.73 base + Q250 = Q3,659.73</option>
        </optgroup>
        <optgroup label="CE2 — Resto del pais">
          <option value="CE2_noAgricola">No Agricola CE2 — Q3,816.90 base + Q250 = Q4,066.90 (Talleres ✓)</option>
          <option value="CE2_agricola">Agricola CE2 — Q3,625.89 base + Q250 = Q3,875.89</option>
          <option value="CE2_maquila">Maquila/Exportadora CE2 — Q3,321.10 base + Q250 = Q3,571.10</option>
        </optgroup>
      </select>
      <div style="font-size:10px;color:var(--text3);margin-top:2px">Vigente 01-ene-2026. La bonificacion Q250 se registra aparte (Decreto 78-89).</div>
    </div>
<div class="form-group"><label>Salario base (Q) *</label><input id="em_sal" type="number" value="${e.salarioBase||3500}" min="0" step="1" oninput="calcPrestacionesPreview()"></div>
      <div class="form-group"><label>Tipo de contrato</label>
        <select id="em_tipo"><option value="indefinido" ${e.tipoContrato==='indefinido'?'selected':''}>Tiempo indefinido</option><option value="plazo_fijo" ${e.tipoContrato==='plazo_fijo'?'selected':''}>Plazo fijo</option><option value="obra" ${e.tipoContrato==='obra'?'selected':''}>Por obra</option></select>
      </div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Fecha de ingreso</label><input id="em_finicio" type="date" value="${e.fechaIngreso||today()}"></div>
      <div class="form-group"><label>Tel\u00E9fono</label><input id="em_tel" value="${e.telefono||''}" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>
      <div class="form-group"><label>Email</label><input id="em_email" value="${e.email||''}" placeholder="empleado@correo.com"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>N\u00FAmero IGSS</label><input id="em_igss" value="${e.noIGSS||''}" placeholder="Afiliaci\u00F3n IGSS"></div>
      <div class="form-group"><label>Banco</label><select id="em_banco_sel"><option value="" ${!(e.bancoCuenta)?'selected':''}>Seleccionar...</option><option value="Banco Industrial" ${(e.bancoCuenta||'')==="Banco Industrial"?"selected":""}>Banco Industrial</option><option value="Banrural" ${(e.bancoCuenta||'')==="Banrural"?"selected":""}>Banrural</option><option value="BAM" ${(e.bancoCuenta||'')==="BAM"?"selected":""}>BAM</option><option value="G&T Continental" ${(e.bancoCuenta||'')==="G&T Continental"?"selected":""}>G&T Continental</option><option value="Bantrab" ${(e.bancoCuenta||'')==="Bantrab"?"selected":""}>Bantrab</option><option value="BI" ${(e.bancoCuenta||'')==="BI"?"selected":""}>BI</option><option value="Otro" ${(e.bancoCuenta||'')==="Otro"?"selected":""}>Otro</option></select></div></div><div class="form-row form-row-3"><div class="form-group"><label>Tipo de cuenta</label><select id="em_tipo_cta"><option value="Monetaria" ${(e.tipoCuentaBanco||"Monetaria")==="Monetaria"?"selected":""}>Monetaria</option><option value="Ahorro" ${(e.tipoCuentaBanco||"")==="Ahorro"?"selected":""}>Ahorro</option><option value="Cheques" ${(e.tipoCuentaBanco||"")==="Cheques"?"selected":""}>Cheques</option></select></div><div class="form-group"><label>Numero de cuenta</label><input id="em_banco" value="${e.cuentaBanco||''}" placeholder="0000-0000-0000"></div><div class="form-group"><label>Nombre titular</label><input id="em_nom_banco" value="${e.nombreCuentaBanco||''}" placeholder="Como aparece en el banco"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Bonificaci\u00F3n adicional (Q/mes)</label><input id="em_bonus" type="number" value="${e.bonificacionAdicional||0}" min="0"></div>
      <div class="form-group"><label>Descuento adicional (Q/mes)</label><input id="em_desc" type="number" value="${e.descuentoAdicional||0}" min="0"></div>
    </div>
    <div id="prestaciones_preview" style="background:var(--bg3);border-radius:var(--radius);padding:12px 14px;margin-top:4px;font-size:12px"></div>
    
  `,async()=>{
    const nombre=document.getElementById('em_nom').value.trim();
    const salario=parseFloat(document.getElementById('em_sal').value)||0;
    if(!nombre||!salario){toast('Nombre y salario requeridos','red');return;}
    const obj={
      nombre,dpi:document.getElementById('em_dpi').value,
      cargo:document.getElementById('em_cargo').value,
      salarioBase:salario,
      tipoContrato:document.getElementById('em_tipo').value,
      fechaIngreso:document.getElementById('em_finicio').value,
      telefono:document.getElementById('em_tel').value,
      email:document.getElementById('em_email').value,
      noIGSS:document.getElementById('em_igss').value,
      cuentaBanco:document.getElementById('em_banco').value.trim(),bancoCuenta:(document.getElementById('em_banco_sel')||{}).value||'',tipoCuentaBanco:(document.getElementById('em_tipo_cta')||{}).value||'Monetaria',nombreCuentaBanco:(document.getElementById('em_nom_banco')||{}).value.trim(),
      bonificacionAdicional:parseFloat(document.getElementById('em_bonus').value)||0,
      descuentoAdicional:parseFloat(document.getElementById('em_desc').value)||0,
      licenciaNumero:(document.getElementById('em_lic_num')||{value:''}).value.trim(),
      licenciaTipo:(document.getElementById('em_lic_tipo')||{value:''}).value,
      licenciaVence:(document.getElementById('em_lic_venc')||{value:''}).value,
      emergenciaNombre:(document.getElementById('em_emerg_nom')||{value:''}).value.trim(),
      emergenciaTel:(document.getElementById('em_emerg_tel')||{value:''}).value.trim(),
      emergenciaParentesco:(document.getElementById('em_emerg_par')||{value:''}).value.trim(),
      activo:true,updatedAt:nowTs()
    };
    if(id){obj.id=id;await dbPut('empleados',obj);}else{obj.createdAt=nowTs();await dbAdd('empleados',obj);}
    await logAuditoria(id?'EDITAR':'CREAR','empleados',(id?'Empleado editado':'Empleado registrado')+': '+nombre,{cargo:obj.cargo});
    closeModal('modalEmpleado');toast(id?'Empleado actualizado':'Empleado registrado');
    await navTo('empleados');
  },true);
  setTimeout(calcPrestacionesPreview,100);
}

function calcPrestacionesPreview(){
  const sal=parseFloat(document.getElementById('em_sal')?.value)||0;
  if(!sal)return;
  const bonusExtra=parseFloat(document.getElementById('em_bonus')?.value)||0;
  const descExtra=parseFloat(document.getElementById('em_desc')?.value)||0;
  const empSimulado = {salarioBase:sal, bonificacionAdicional:bonusExtra, descuentoAdicional:descExtra};
  const det = calcDetalleEmpleado(empSimulado);
  const igssEmp=sal*0.0483;
  const igssPatrono=sal*0.1267;
  const irtra=sal*0.01;
  const intecap=sal*0.01;
  const bonif=250;
  const bonus=parseFloat(document.getElementById('em_bonus')?.value)||0;
  const desc=parseFloat(document.getElementById('em_desc')?.value)||0;
  const bruto=sal+bonif+bonus;
  const netoPagar=bruto-igssEmp-desc;
  const costoPatrono=sal+igssPatrono+irtra+intecap+bonif+bonus;
  const aguinaldo=sal/12;
  const bono14=sal/12;
  const vacaciones=(sal*15/260);
  const indemnizacion=sal/12;
  const el=document.getElementById('prestaciones_preview');
  if(!el) return;
  const fmtQ2 = n => 'Q ' + Number(n||0).toFixed(2);
  el.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">'
    + '<div style="grid-column:1/-1;font-weight:600;font-size:11px;color:var(--text3);text-transform:uppercase;margin-bottom:2px">Liquidación mensual al empleado</div>'
    + '<div style="font-size:11px;color:var(--text2)">Salario base:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono)">' + fmtQ2(det.base) + '</div>'
    + '<div style="font-size:11px;color:var(--text2)">Bonif. Decreto 78-89:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono)">' + fmtQ2(det.bonifDecr) + '</div>'
    + (det.bonifAd>0?'<div style="font-size:11px;color:var(--text2)">Bonif. adicional:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono)">'+fmtQ2(det.bonifAd)+'</div>':'')
    + '<div style="font-size:11px;color:var(--red)">(-) IGSS empleado 4.83%:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono);color:var(--red)">-' + fmtQ2(det.igssEmp) + '</div>'
    + (det.isrEmp>0?'<div style="font-size:11px;color:var(--red)">(-) ISR estimado:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono);color:var(--red)">-'+fmtQ2(det.isrEmp)+'</div>':'')
    + '<div style="font-size:12px;font-weight:700;color:var(--green);border-top:1px solid var(--border);padding-top:4px;margin-top:2px">Neto a pagar:</div>'
    + '<div style="font-size:12px;font-weight:700;text-align:right;font-family:var(--font-mono);color:var(--green);border-top:1px solid var(--border);padding-top:4px;margin-top:2px">' + fmtQ2(det.neto) + '</div>'
    + '<div style="grid-column:1/-1;font-weight:600;font-size:11px;color:var(--text3);text-transform:uppercase;margin-top:8px;margin-bottom:2px">Carga patronal y provisiones</div>'
    + '<div style="font-size:11px;color:var(--text2)">IGSS patronal 12.67%:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono)">' + fmtQ2(det.igssPatrono) + '</div>'
    + '<div style="font-size:11px;color:var(--text2)">IRTRA 1%:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono)">' + fmtQ2(det.irtra) + '</div>'
    + '<div style="font-size:11px;color:var(--text2)">INTECAP 1%:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono)">' + fmtQ2(det.intecap) + '</div>'
    + '<div style="font-size:11px;color:var(--accent)">Prov. Bono 14 (1/12):</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono);color:var(--accent)">' + fmtQ2(det.provBono14) + '</div>'
    + '<div style="font-size:11px;color:var(--accent)">Prov. Aguinaldo (1/12):</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono);color:var(--accent)">' + fmtQ2(det.provAguinal) + '</div>'
    + '<div style="font-size:11px;color:var(--accent)">Prov. Indemnización (1/12):</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono);color:var(--accent)">' + fmtQ2(det.provIndem) + '</div>'
    + '<div style="font-size:11px;color:var(--accent)">Prov. Vacaciones:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono);color:var(--accent)">' + fmtQ2(det.provVac) + '</div>'
    + '<div style="font-size:13px;font-weight:700;color:var(--text);border-top:1px solid var(--border);padding-top:4px;margin-top:2px">COSTO TOTAL/mes:</div>'
    + '<div style="font-size:13px;font-weight:700;text-align:right;font-family:var(--font-mono);color:var(--text);border-top:1px solid var(--border);padding-top:4px;margin-top:2px">' + fmtQ2(det.costoTotal) + '</div>'
    + '</div>';
  return;
  // código legacy abajo (no se ejecuta):
  if(el)el.innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-weight:600;color:var(--text2);margin-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:.5px">Salario del empleado</div>
        <div style="display:flex;justify-content:space-between;padding:3px 0"><span>Salario base:</span><span class="td-mono text-green">Q ${fmtNum(sal)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:3px 0"><span>Bonificaci\u00F3n decreto 78-89:</span><span class="td-mono text-green">+Q ${fmtNum(bonif)}</span></div>
        ${bonus>0?`<div style="display:flex;justify-content:space-between;padding:3px 0"><span>Bonif. adicional:</span><span class="td-mono text-green">+Q ${fmtNum(bonus)}</span></div>`:''}
        <div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--red)"><span>IGSS empleado (4.83%):</span><span class="td-mono">-Q ${fmtNum(igssEmp)}</span></div>
        ${desc>0?`<div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--red)"><span>Descuento adicional:</span><span class="td-mono">-Q ${fmtNum(desc)}</span></div>`:''}
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-top:1px solid var(--border);margin-top:4px;font-weight:700"><span>Neto a pagar:</span><span class="td-mono text-green">Q ${fmtNum(netoPagar)}</span></div>
      </div>
      <div>
        <div style="font-weight:600;color:var(--text2);margin-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:.5px">Costo patronal + prestaciones</div>
        <div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--red)"><span>IGSS patronal (12.67%):</span><span class="td-mono">Q ${fmtNum(igssPatrono)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--red)"><span>Irtra (1%):</span><span class="td-mono">Q ${fmtNum(irtra)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--red)"><span>Intecap (1%):</span><span class="td-mono">Q ${fmtNum(intecap)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-top:1px solid var(--border);margin-top:4px;font-weight:700;color:var(--accent)"><span>Costo total mensual:</span><span class="td-mono">Q ${fmtNum(costoPatrono)}</span></div>
        <div style="font-size:11px;color:var(--text3);margin-top:8px">Provisiones anuales por empleado:<br>Aguinaldo: Q ${fmtNum(aguinaldo)}/mes | Bono 14: Q ${fmtNum(bono14)}/mes<br>Vacaciones: Q ${fmtNum(vacaciones)}/mes | Indemnizaci\u00F3n: Q ${fmtNum(indemnizacion)}/mes</div>
      </div>
    </div>`;
}

async function verPrestaciones(id){
  const e=await dbGet('empleados',id);
  if(!e)return;
  const hoy=new Date();
  const inicio=new Date(e.fechaIngreso+'T00:00:00');
  const meses=Math.floor((hoy-inicio)/(30.4*864e5));
  const anios=Math.floor(meses/12);
  const sal=e.salarioBase||0;
  const liq=(sal/12*meses);
  openModal('prestEmp',`Prestaciones \u2014 ${e.nombre}`,`
    <div style="display:grid;gap:10px">
      <div class="alert alert-blue" style="font-size:12px">Antig\u00FCedad: <strong>${anios} a\u00F1os ${meses%12} meses</strong> (ingreso: ${fechaLegible(e.fechaIngreso)})</div>
      <div class="card" style="margin-bottom:0">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">
          ${[
            ['Salario base',fmt(sal)],
            ['Bonif. Decreto 78-89',fmt(250)],
            ['IGSS empleado (4.83%)',`-${fmt(sal*0.0483)}`],
            ['Neto mensual',fmt(sal+250-sal*0.0483)],
            ['IGSS patronal (12.67%)',fmt(sal*0.1267)],
            ['Irtra (1%)',fmt(sal*0.01)],
            ['Intecap (1%)',fmt(sal*0.01)],
            ['Aguinaldo (1 salario/a\u00F1o)',fmt(sal*Math.min(anios+1,1))],
            ['Bono 14 (1 salario/a\u00F1o)',fmt(sal*Math.min(anios+1,1))],
            [`Vacaciones acumuladas (${meses} meses)`,fmt(sal/12*meses*15/30)],
            ['Indemnizaci\u00F3n acumulada',fmt(liq)],
            ['Liquidaci\u00F3n total estimada',fmt(liq+sal*0.1267*meses+sal+sal)],
          ].map(([k,v])=>`<div style="color:var(--text2)">${k}:</div><div class="td-mono" style="font-weight:600">${v}</div>`).join('')}
        </div>
      </div>
    </div>
  `,()=>closeModal('prestEmp'));
}

async function toggleEmpleado(id,activo){
  const e=await dbGet('empleados',id);e.activo=!activo;
  await dbPut('empleados',e);toast(`Empleado ${e.activo?'activado':'desactivado'}`);
  await navTo('empleados');
}

/* ---- N\u00D3MINA ---- */
async function renderNomina(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Acceso solo para administradores</div>';return;}
  const empleados=await dbGetAll('empleados');
  const nomina=await dbGetAll('nomina');
  const mesActual=today().slice(0,7);
  const nominaMes=nomina.filter(n=>n.mes===mesActual);
  actions.innerHTML=`<button class="btn btn-primary" onclick="generarNominaMes()">\u26A1 Generar n\u00F3mina del mes</button>`;

  content.innerHTML=`
  <div class="section-title">N\u00F3mina Mensual</div>
  <div class="section-sub">Mes: ${mesActual}</div>

  ${nominaMes.length===0?`<div class="alert alert-amber">\u26A0 No se ha generado la n\u00F3mina para este mes. Haz clic en "Generar n\u00F3mina del mes".</div>`:''}

  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>Empleado</th><th>Cargo</th><th>Salario base</th><th>Bonif.</th><th>Bonif. desempe\u00F1o</th><th>IGSS</th><th>Descuentos</th><th>Neto a pagar</th><th>Estado</th></tr></thead>
      <tbody>
        ${nominaMes.map(n=>`<tr>
          <td><strong>${n.empleadoNombre}</strong></td>
          <td>${n.cargo||'\u2014'}</td>
          <td class="td-mono">${fmt(n.salarioBase)}</td>
          <td class="td-mono text-green">+${fmt(n.bonificacion)}</td>
          <td class="td-mono text-green">+${fmt(n.bonifDesempeno||0)}</td>
          <td class="td-mono text-red">-${fmt(n.igss)}</td>
          <td class="td-mono text-red">-${fmt(n.descuentos||0)}</td>
          <td class="td-mono" style="font-weight:700;color:var(--green)">${fmt(n.netoPagar)}</td>
          <td><span class="badge badge-${n.pagada?'green':'amber'}">${n.pagada?'Pagada':'Pendiente'}</span></td>
        </tr>`).join('')||`<tr><td colspan="9" class="text-center text-muted" style="padding:20px">Sin registros de n\u00F3mina este mes</td></tr>`}
      </tbody>
      ${nominaMes.length>0?`<tfoot><tr style="background:var(--bg3)">
        <td colspan="2" style="font-weight:600">TOTALES</td>
        <td class="td-mono">${fmt(nominaMes.reduce((a,n)=>a+n.salarioBase,0))}</td>
        <td class="td-mono">${fmt(nominaMes.reduce((a,n)=>a+n.bonificacion,0))}</td>
        <td class="td-mono">${fmt(nominaMes.reduce((a,n)=>a+(n.bonifDesempeno||0),0))}</td>
        <td class="td-mono">${fmt(nominaMes.reduce((a,n)=>a+n.igss,0))}</td>
        <td class="td-mono">${fmt(nominaMes.reduce((a,n)=>a+(n.descuentos||0),0))}</td>
        <td class="td-mono" style="font-weight:700;color:var(--green)">${fmt(nominaMes.reduce((a,n)=>a+n.netoPagar,0))}</td>
        <td></td>
      </tr></tfoot>`:''}
    </table></div>
  </div>`;
}

async function generarNominaMes(){
  if(!soloAdmin())return;
  if(!confirm('\u00BFGenerar n\u00F3mina para el mes actual? Esto reemplazar\u00E1 la n\u00F3mina existente de este mes.'))return;
  const empleados=await dbGetAll('empleados');
  const mesActual=today().slice(0,7);
  const nomina=await dbGetAll('nomina');
  const kpiData=await dbGetAll('kpi');
  for(const n of nomina.filter(x=>x.mes===mesActual))await dbDelete('nomina',n.id);
  for(const e of empleados.filter(x=>x.activo!==false)){
    const sal=e.salarioBase||0;
    const bonif=250+(e.bonificacionAdicional||0);
    const igss=sal*0.0483;
    const desc=e.descuentoAdicional||0;
    const kpiMes=kpiData.filter(k=>k.empleadoId===e.id&&k.mes===mesActual);
    const bonifDesempeno=kpiMes.reduce((a,k)=>a+(k.bonificacion||0),0);
    const bruto=sal+bonif+bonifDesempeno;
    const neto=bruto-igss-desc;
    await dbAdd('nomina',{
      mes:mesActual,empleadoId:e.id,empleadoNombre:e.nombre,cargo:e.cargo,
      salarioBase:sal,bonificacion:bonif,bonifDesempeno,igss,descuentos:desc,netoPagar:neto,
      pagada:false,createdAt:nowTs()
    });
  }
  toast('N\u00F3mina generada correctamente');
  await navTo('nomina');
}

/* ---- PROVEEDORES ---- */
async function renderProveedores(content,actions){
  const proveedores=await dbGetAll('proveedores');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalProveedor()">+ Nuevo proveedor</button>`;
  content.innerHTML=`
  <div class="section-title">Base de Datos de Proveedores</div>
  <div class="section-sub">${proveedores.length} proveedores registrados</div>
  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>Empresa</th><th>NIT</th><th>Contacto</th><th>Tel\u00E9fono</th><th>Categor\u00EDa</th><th>Plazo cr\u00E9dito</th><th>Calificaci\u00F3n</th><th>Acciones</th></tr></thead>
      <tbody>
        ${proveedores.map(p=>`<tr>
          <td><strong>${p.empresa}</strong><div style="font-size:11px;color:var(--text3)">${p.sitioWeb||''}</div></td>
          <td class="td-mono">${p.nit||'\u2014'}</td>
          <td>${p.contacto||'\u2014'}</td>
          <td>${p.telefono||'\u2014'}</td>
          <td><span class="badge badge-gray">${p.categoria||'General'}</span></td>
          <td class="td-mono">${p.plazoCredito||0} d\u00EDas</td>
          <td>${'\u2B50'.repeat(Math.min(parseInt(p.calificacion)||0,5))}</td>
          <td><div class="flex gap-1">
            <button class="btn btn-sm btn-secondary" onclick="modalProveedor(${p.id})">\u270F</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarProveedor(${p.id})">\u2715</button>
          </div></td>
        </tr>`).join('')||'<tr><td colspan="8" class="text-center text-muted" style="padding:20px">Sin proveedores</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}

async function modalProveedor(id=null){
  const p=id?await dbGet('proveedores',id):{};
  openModal('modalProveedor',id?'Editar Proveedor':'Nuevo Proveedor',`
    <div class="form-row form-row-2">
      <div class="form-group"><label>Nombre de la empresa *</label><input id="pv_emp" value="${p.empresa||''}" placeholder="Distribuidora XYZ S.A."></div>
      <div class="form-group"><label>NIT</label><input id="pv_nit" value="${p.nit||''}" placeholder="NIT de la empresa"></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Categor\u00EDa</label>
        <select id="pv_cat"><option value="Repuestos">Repuestos automotrices</option><option value="Aceites y Lubricantes">Aceites y lubricantes</option><option value="Llantas">Llantas y neum\u00E1ticos</option><option value="Herramientas">Herramientas y equipos</option><option value="El\u00E9ctrico">Material el\u00E9ctrico</option><option value="General">General</option></select>
      </div>
      <div class="form-group"><label>Contacto principal</label><input id="pv_contacto" value="${p.contacto||''}" placeholder="Nombre del vendedor"></div>
      <div class="form-group"><label>Tel\u00E9fono</label><input id="pv_tel" value="${p.telefono||''}" placeholder="+502 2222-3333" onblur="onTelBlur(this)"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Email</label><input id="pv_email" type="email" value="${p.email||''}" placeholder="ventas@proveedor.com"></div>
      <div class="form-group"><label>Sitio web</label><input id="pv_web" value="${p.sitioWeb||''}" placeholder="www.proveedor.com"></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Direcci\u00F3n</label><input id="pv_dir" value="${p.direccion||''}" placeholder="Direcci\u00F3n f\u00EDsica"></div>
      <div class="form-group"><label>Plazo de cr\u00E9dito (d\u00EDas)</label><input id="pv_plazo" type="number" value="${p.plazoCredito||0}" min="0"></div>
      <div class="form-group"><label>Calificaci\u00F3n (1-5)</label>
        <select id="pv_cal"><option value="0">Sin calificar</option><option value="1" ${p.calificacion==='1'?'selected':''}>\u2B50 1</option><option value="2" ${p.calificacion==='2'?'selected':''}>\u2B50\u2B50 2</option><option value="3" ${p.calificacion==='3'?'selected':''}>\u2B50\u2B50\u2B50 3</option><option value="4" ${p.calificacion==='4'?'selected':''}>\u2B50\u2B50\u2B50\u2B50 4</option><option value="5" ${p.calificacion==='5'?'selected':''}>\u2B50\u2B50\u2B50\u2B50\u2B50 5</option></select>
      </div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Cuenta bancaria / Beneficiario</label><input id="pv_banco" value="${p.cuentaBanco||''}" placeholder="Para pagos"></div>
      <div class="form-group"><label>Condiciones de pago</label><input id="pv_condiciones" value="${p.condiciones||''}" placeholder="Contado, 30 d\u00EDas, etc."></div>
    </div>
    <div class="form-group"><label>Notas / Productos principales</label><textarea id="pv_notas">${p.notas||''}</textarea></div>
  `,async()=>{
    const emp=document.getElementById('pv_emp').value.trim();
    if(!emp){toast('Nombre requerido','red');return;}
    const obj={
      empresa:emp,nit:document.getElementById('pv_nit').value,
      categoria:document.getElementById('pv_cat').value,
      contacto:document.getElementById('pv_contacto').value,
      telefono:document.getElementById('pv_tel').value,
      email:document.getElementById('pv_email').value,
      sitioWeb:document.getElementById('pv_web').value,
      direccion:document.getElementById('pv_dir').value,
      plazoCredito:parseInt(document.getElementById('pv_plazo').value)||0,
      calificacion:document.getElementById('pv_cal').value,
      bancoNombre:(document.getElementById('pv_banco_sel')||{value:''}).value,
      bancoCuentaTipo:(document.getElementById('pv_tipo_cta')||{value:'Monetaria'}).value,
      bancoNumeroCuenta:(document.getElementById('pv_num_cta')||{value:''}).value,
      bancoNombreTitular:(document.getElementById('pv_nom_cta')||{value:''}).value,
      formasPago:Array.from(document.querySelectorAll('.pv_fpago:checked')).map(function(c){return c.value;}),
      condiciones:document.getElementById('pv_condiciones').value,
      notas:document.getElementById('pv_notas').value,
      updatedAt:nowTs()
    };
    if(id){obj.id=id;await dbPut('proveedores',obj);}else{obj.createdAt=nowTs();await dbAdd('proveedores',obj);}
    await logAuditoria(id?'EDITAR':'CREAR','proveedores',(id?'Proveedor editado':'Proveedor creado')+': '+emp,{nit:obj.nit});
    closeModal('modalProveedor');toast(id?'Proveedor actualizado':'Proveedor registrado');
    await navTo('proveedores');
  },true);
}

async function eliminarProveedor(id){
  if(!soloAdmin()){toast('Solo admin puede eliminar','red');return;}
  if(!confirm('\u00BFEliminar proveedor?'))return;
  await dbDelete('proveedores',id);await navTo('proveedores');
}

/* ---- REPUESTOS MEJORADO ---- */
async function renderRepuestos(content,actions){
  const repuestos=await dbGetAll('repuestos');
  const proveedores=await dbGetAll('proveedores');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalRepuesto()">+ Nuevo repuesto</button>`;
  const stockBajo=repuestos.filter(r=>(r.stock||0)<=(r.stockMin||5));
  const sinMargen=repuestos.filter(r=>r.costo>0&&r.precio>0&&((r.precio-r.costo)/r.precio)<MARGEN_MIN);

  content.innerHTML=`
  <div class="section-title">Inventario de Repuestos</div>
  ${stockBajo.length?`<div class="alert alert-red">\u26A0 ${stockBajo.length} repuesto(s) con stock bajo</div>`:''}
  ${sinMargen.length?`<div class="alert alert-amber">\u26A0 ${sinMargen.length} repuesto(s) con margen menor a 20%</div>`:''}
  <div class="card" style="padding:10px">
    <div class="search-bar" style="margin-bottom:10px;position:relative">
      <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3)">\u1F50D</span>
      <input id="buscar_rep" type="text" placeholder="Buscar por nombre, c\u00F3digo, categor\u00EDa..." oninput="filtrarTabla('buscar_rep','tbody_rep')" style="padding-left:32px;background:var(--bg3);width:100%;border:1px solid var(--border2);border-radius:6px;padding:8px 10px 8px 32px;color:var(--text);outline:none">
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>C\u00F3digo</th><th>Nombre</th><th>Categor\u00EDa</th><th>Tipo veh\u00EDculo</th><th>Stock</th><th>Compra</th><th>Venta</th><th>Margen</th><th>Vence</th><th>Proveedor</th><th>Acciones</th></tr></thead>
      <tbody id="tbody_rep">
        ${repuestos.map(r=>{
          const margen=r.costo>0&&r.precio>0?((r.precio-r.costo)/r.precio):0;
          const bajoMargen=margen<MARGEN_MIN&&r.costo>0;
          const stockBajo=(r.stock||0)<=(r.stockMin||5);
          const vencido=r.fechaCaducidad&&diasRestantes(r.fechaCaducidad)<30;
          const prov=proveedores.find(p=>p.id===r.proveedorId);
          return`<tr>
            <td class="td-mono" style="font-size:11px">${r.codigo||'\u2014'}</td>
            <td><strong>${r.nombre}</strong></td>
            <td><span class="badge badge-gray">${r.categoria||'General'}</span></td>
            <td style="font-size:11px;color:var(--text2)">${(r.tiposVehiculo||[]).join(', ')||'Todos'}</td>
            <td><span class="${stockBajo?'text-red':'text-green'} td-mono">${r.stock||0}</span><span style="color:var(--text3);font-size:11px"> /${r.stockMin||5}</span></td>
            <td class="td-mono">Q ${fmtNum(r.costo||0)}</td>
            <td class="td-mono ${bajoMargen?'text-red':''}" style="font-weight:${bajoMargen?'700':'400'}">Q ${fmtNum(r.precio||0)}</td>
            <td><span class="badge badge-${bajoMargen?'red':margen>=0.4?'green':'amber'}">${(margen*100).toFixed(1)}%</span></td>
            <td class="${vencido?'text-red':''}" style="font-size:11px">${r.fechaCaducidad?fechaLegible(r.fechaCaducidad):'\u2014'}</td>
            <td style="font-size:11px;color:var(--text2)">${prov?.empresa||r.proveedor||'\u2014'}</td>
            <td><div class="flex gap-1">
              <button class="btn btn-sm btn-secondary" onclick="modalRepuesto(${r.id})">\u270F</button>
              ${soloAdmin()?`<button class="btn btn-sm btn-danger" onclick="eliminarRepuesto(${r.id})">\u2715</button>`:''}
            </div></td>
          </tr>`;
        }).join('')||'<tr><td colspan="11" class="text-center text-muted" style="padding:20px">Sin repuestos</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}

function filtrarTabla(inputId,tbodyId){
  const q=document.getElementById(inputId)?.value?.toLowerCase()||'';
  document.querySelectorAll(`#${tbodyId} tr`).forEach(tr=>{tr.style.display=tr.textContent.toLowerCase().includes(q)?'':'none';});
}


async function crearProveedorRapido() {
  var nombre = prompt('Nombre del proveedor:');
  if (!nombre || !nombre.trim()) return;
  var nit = prompt('NIT del proveedor (o CF):') || 'CF';
  var tel = prompt('Teléfono:') || '';
  var id = await dbAdd('proveedores', {
    empresa: nombre.trim(), nit: nit.trim(), telefono: tel.trim(),
    categoria: 'General', createdAt: nowTs(), updatedAt: nowTs()
  });
  await logAuditoria('CREAR','proveedores','Proveedor creado rápido: '+nombre,{});
  toast('Proveedor creado. Selecciónalo en la lista.');
  // Recargar el select
  var sel = document.getElementById('rp_prov');
  if (sel) {
    var opt = document.createElement('option');
    opt.value = id; opt.textContent = nombre.trim(); opt.selected = true;
    sel.appendChild(opt);
  }
}

async function modalRepuesto(id=null){
  const r=id?await dbGet('repuestos',id):{};
  const proveedores=await dbGetAll('proveedores');
  const tiposVeh=r.tiposVehiculo||[];
  openModal('modalRepuesto',id?'Editar Repuesto':'Nuevo Repuesto',`
    <div class="form-row form-row-3">
      <div class="form-group"><label>C\u00F3digo</label><input id="rp_cod" value="${r.codigo||''}" placeholder="REP-001"></div>
      <div class="form-group"><label>Nombre *</label><input id="rp_nom" value="${r.nombre||''}" placeholder="Filtro de aceite Toyota"></div>
      <div class="form-group"><label>Categor\u00EDa</label>
        <select id="rp_cat">${CATEGORIAS_REPUESTO.map(c=>`<option value="${c}" ${r.categoria===c?'selected':''}>${c}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-group"><label>Tipos de veh\u00EDculo compatibles</label>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px">
        ${TIPOS_VEHICULO.map(t=>`<label style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text);cursor:pointer"><input type="checkbox" value="${t}" ${tiposVeh.includes(t)?'checked':''} class="rep_tipo_veh" style="width:auto"> ${t}</label>`).join('')}
      </div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>No. cilindros</label>
        <select id="rp_cil"><option value="">Cualquiera</option>${[3,4,5,6,8,10,12,16].map(c=>`<option value="${c}" ${r.cilindros==c?'selected':''}>${c} cil.</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Cilindraje (cc)</label><input id="rp_cc" value="${r.cilindraje||''}" placeholder="1600, 2000, 3000..."></div>
      <div class="form-group"><label>Marca del repuesto</label><input id="rp_marca" value="${r.marca||''}" placeholder="Toyota, Bosch, NGK..."></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Stock actual *</label><input id="rp_stock" type="number" value="${r.stock||0}" min="0"></div>
      <div class="form-group"><label>Stock m\u00EDnimo</label><input id="rp_min" type="number" value="${r.stockMin||5}" min="0"></div>
      <div class="form-group"><label>Unidad</label><input id="rp_uni" value="${r.unidad||'unidad'}" placeholder="unidad, litro..."></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Precio compra (Q)</label>
        <div style="position:relative"><span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3);font-family:var(--font-mono);font-size:11px">Q</span>
        <input id="rp_costo" type="number" value="${r.costo||0}" step="0.01" oninput="calcMargenRep()" style="padding-left:22px"></div>
      </div>
      <div class="form-group"><label>Precio venta (Q)</label>
        <div style="position:relative"><span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3);font-family:var(--font-mono);font-size:11px">Q</span>
        <input id="rp_precio" type="number" value="${r.precio||0}" step="0.01" oninput="calcMargenRep()" style="padding-left:22px"></div>
      </div>
      <div class="form-group"><label>Margen calculado</label><input id="rp_margen" readonly placeholder="0%" style="background:var(--bg4);color:var(--text3)"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Proveedor 
        <button type="button" onclick="crearProveedorRapido()" style="font-size:10px;padding:2px 8px;margin-left:6px;background:var(--bg3);border:1px solid var(--border2);border-radius:4px;cursor:pointer;color:var(--accent)">+ Nuevo</button>
      </label>
        <select id="rp_prov"><option value="">Sin proveedor</option>${proveedores.map(p=>`<option value="${p.id}" ${r.proveedorId===p.id?'selected':''}>${p.empresa}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>\u00BFTiene caducidad?</label>
        <select id="rp_tiene_cad" onchange="toggleCaducidad()"><option value="no" ${!r.fechaCaducidad?'selected':''}>No caduca</option><option value="si" ${r.fechaCaducidad?'selected':''}>S\u00ED, tiene fecha de caducidad</option></select>
      </div>
    </div>
    <div id="rp_cad_wrap" style="display:${r.fechaCaducidad?'block':'none'}">
      <div class="form-group"><label>Fecha de caducidad</label><input id="rp_cad" type="date" value="${r.fechaCaducidad||''}"></div>
    </div>
    <div class="form-group"><label>Descripci\u00F3n / Uso</label><textarea id="rp_desc" style="min-height:60px">${r.descripcion||''}</textarea></div>
    
  `,async()=>{
    const nombre=document.getElementById('rp_nom').value.trim();
    if(!nombre){toast('Nombre requerido','red');return;}
    const tiposSelec=Array.from(document.querySelectorAll('.rep_tipo_veh:checked')).map(cb=>cb.value);
    const costo=parseFloat(document.getElementById('rp_costo').value)||0;
    const precio=parseFloat(document.getElementById('rp_precio').value)||0;
    const margen=precio>0&&costo>0?(precio-costo)/precio:0;
    if(margen<MARGEN_MIN&&costo>0&&precio>0){
      if(!confirm(`\u26A0 Margen ${(margen*100).toFixed(1)}% est\u00E1 por debajo del 20% m\u00EDnimo. \u00BFGuardar de todas formas?`))return;
    }
    const tieneCad=document.getElementById('rp_tiene_cad').value==='si';
    const obj={
      codigo:document.getElementById('rp_cod').value,nombre,
      categoria:document.getElementById('rp_cat').value,
      tiposVehiculo:tiposSelec,
      cilindros:document.getElementById('rp_cil').value||null,
      cilindraje:document.getElementById('rp_cc').value,
      marca:document.getElementById('rp_marca').value,
      stock:parseInt(document.getElementById('rp_stock').value)||0,
      stockMin:parseInt(document.getElementById('rp_min').value)||5,
      unidad:document.getElementById('rp_uni').value,
      costo,precio,margen,
      proveedorId:parseInt(document.getElementById('rp_prov').value)||null,
      fechaCaducidad:tieneCad?document.getElementById('rp_cad').value:null,
      descripcion:document.getElementById('rp_desc').value,
      tipo:'repuesto',updatedAt:nowTs()
    };
    if(id){obj.id=id;await dbPut('repuestos',obj);}else{obj.createdAt=nowTs();await dbAdd('repuestos',obj);}
    await logAuditoria(id?'EDITAR':'CREAR','repuestos',(id?'Repuesto editado':'Repuesto creado')+': '+nombre,{stock:obj.stock});
    closeModal('modalRepuesto');toast(id?'Repuesto actualizado':'Repuesto registrado');
    await navTo('repuestos');
  },true);
  setTimeout(()=>{calcMargenRep();},100);
}

function toggleCaducidad(){
  const val=document.getElementById('rp_tiene_cad')?.value;
  const wrap=document.getElementById('rp_cad_wrap');
  if(wrap)wrap.style.display=val==='si'?'block':'none';
}
function calcMargenRep(){
  const c=parseFloat(document.getElementById('rp_costo')?.value)||0;
  const p=parseFloat(document.getElementById('rp_precio')?.value)||0;
  const el=document.getElementById('rp_margen');
  if(!el)return;
  if(p>0&&c>0){
    const m=((p-c)/p)*100;
    el.value=m.toFixed(1)+'%';
    el.style.color=m<20?'var(--red)':m<35?'var(--accent)':'var(--green)';
  }else{el.value='\u2014';}
}

async function eliminarRepuesto(id){
  if(!soloAdmin()){toast('Solo admin','red');return;}
  if(!confirm('\u00BFEliminar repuesto?'))return;
  await dbDelete('repuestos',id);await navTo('repuestos');
}

/* ---- INSUMOS MEJORADO ---- */
async function renderInsumos(content,actions){
  const insumos=await dbGetAll('insumos');
  const proveedores=await dbGetAll('proveedores');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalInsumo()">+ Nuevo insumo</button>`;
  content.innerHTML=`
  <div class="section-title">Inventario de Insumos</div>
  <div class="section-sub">Aceites, lubricantes, qu\u00EDmicos y consumibles</div>
  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>Nombre</th><th>Tipo</th><th>Tipo veh\u00EDculo</th><th>Stock</th><th>Compra</th><th>Venta</th><th>Margen</th><th>Caducidad</th><th>Acciones</th></tr></thead>
      <tbody>
        ${insumos.map(i=>{
          const margen=i.costo>0&&i.precio>0?((i.precio-i.costo)/i.precio):0;
          const bajoMargen=margen<MARGEN_MIN&&i.costo>0;
          const vencido=i.fechaCaducidad&&diasRestantes(i.fechaCaducidad)<30;
          return`<tr>
            <td><strong>${i.nombre}</strong></td>
            <td><span class="badge badge-blue">${i.categoria||'Insumo'}</span></td>
            <td style="font-size:11px;color:var(--text2)">${(i.tiposVehiculo||[]).join(', ')||'Todos'}</td>
            <td><span class="${(i.stock||0)<=(i.stockMin||5)?'text-red':'text-green'} td-mono">${i.stock||0}</span> ${i.unidad||''}</td>
            <td class="td-mono">Q ${fmtNum(i.costo||0)}</td>
            <td class="td-mono ${bajoMargen?'text-red':''}">Q ${fmtNum(i.precio||0)}</td>
            <td><span class="badge badge-${bajoMargen?'red':margen>=0.4?'green':'amber'}">${(margen*100).toFixed(1)}%</span></td>
            <td class="${vencido?'text-red':''}" style="font-size:11px">${i.fechaCaducidad?fechaLegible(i.fechaCaducidad):'No caduca'}</td>
            <td><div class="flex gap-1">
              <button class="btn btn-sm btn-secondary" onclick="modalInsumo(${i.id})">\u270F</button>
              ${soloAdmin()?`<button class="btn btn-sm btn-danger" onclick="eliminarInsumo(${i.id})">\u2715</button>`:''}
            </div></td>
          </tr>`;
        }).join('')||'<tr><td colspan="9" class="text-center text-muted" style="padding:20px">Sin insumos</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}


async function eliminarInsumo(id){if(!soloAdmin())return;if(!confirm('\u00BFEliminar?'))return;await dbDelete('insumos',id);await navTo('insumos');}

/* ---- CLIENTES MEJORADO (agrupaci\u00F3n multi-veh\u00EDculo) ---- */
async function renderClientes(content,actions){
  const clientes=await dbGetAll('clientes');
  const vehiculos=await dbGetAll('vehiculos');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalCliente()">+ Nuevo cliente</button>`;
  content.innerHTML=`
  <div class="section-title">Clientes</div>
  <div class="section-sub">${clientes.length} clientes registrados</div>
  <div class="card" style="padding:10px">
    <div style="margin-bottom:10px;position:relative">
      <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3)">\u1F50D</span>
      <input id="buscar_cli" type="text" placeholder="Buscar por nombre, NIT o tel\u00E9fono..." oninput="filtrarTabla('buscar_cli','tbody_cli')" style="padding-left:32px;background:var(--bg3);width:100%;border:1px solid var(--border2);border-radius:6px;padding:8px 10px 8px 32px;color:var(--text);outline:none">
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Nombre / Empresa</th><th>NIT</th><th>Tel\u00E9fono</th><th>Email</th><th>Veh\u00EDculos</th><th>Tipo</th><th>Acciones</th></tr></thead>
      <tbody id="tbody_cli">
        ${clientes.map(c=>{
          const vehs=vehiculos.filter(v=>v.clienteId===c.id);
          return`<tr>
            <td><strong>${c.nombre}</strong>${c.empresa?`<div style="font-size:11px;color:var(--text3)">${c.empresa}</div>`:''}</td>
            <td class="td-mono">${c.nit||'CF'}</td>
            <td>${c.telefono||'\u2014'}</td>
            <td style="color:var(--blue);font-size:12px">${c.email||'\u2014'}</td>
            <td>
              ${vehs.length===0?'<span class="text-muted">Sin veh\u00EDculos</span>':
                vehs.map(v=>`<span class="badge badge-gray" style="margin:1px">${v.placa}</span>`).join('')}
              <button class="btn btn-sm btn-secondary" style="margin-left:4px;padding:2px 8px;font-size:11px" onclick="modalVehiculo(null,${c.id})">+</button>
            </td>
            <td><span class="badge badge-${c.tipo==='empresa'?'blue':'gray'}">${c.tipo||'persona'}</span></td>
            <td><div class="flex gap-1">
              <button class="btn btn-sm btn-secondary" onclick="modalCliente(${c.id})">\u270F</button>
              <button class="btn btn-sm btn-secondary" onclick="verHistorialCliente(${c.id})">\u1F4CB</button>
              ${soloAdmin()?`<button class="btn btn-sm btn-danger" onclick="eliminarCliente(${c.id})">\u2715</button>`:''}
            </div></td>
          </tr>`;
        }).join('')||'<tr><td colspan="7" class="text-center text-muted" style="padding:20px">Sin clientes</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}

async function modalCliente(id=null){
  const c=id?await dbGet('clientes',id):{};
  openModal('modalCliente',id?'Editar Cliente':'Nuevo Cliente',`
    <div class="form-row form-row-2">
      <div class="form-group"><label>Nombre completo *</label><input id="c_nombre" value="${c.nombre||''}" placeholder="Juan P\u00E9rez Garc\u00EDa"></div>
      <div class="form-group"><label>NIT</label><input id="c_nit" value="${c.nit||''}" placeholder="CF o n\u00FAmero de NIT"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Empresa / Raz\u00F3n social</label><input id="c_empresa" value="${c.empresa||''}" placeholder="Nombre de la empresa (opcional)"></div>
      <div class="form-group"><label>Tipo</label>
        <select id="c_tipo"><option value="persona" ${c.tipo==='persona'?'selected':''}>Persona natural</option><option value="empresa" ${c.tipo==='empresa'?'selected':''}>Empresa</option></select>
      </div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Tel\u00E9fono principal *</label><input id="c_tel" value="${c.telefono||''}" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>
      <div class="form-group"><label>Tel\u00E9fono secundario</label><input id="c_tel2" value="${c.telefono2||''}" placeholder="+502 4444-0000" onblur="onTelBlur(this)"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Email</label><input id="c_email" type="email" value="${c.email||''}" placeholder="correo@ejemplo.com"></div>
      <div class="form-group"><label>WhatsApp</label><input id="c_wa" value="${c.whatsapp||''}" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>
    </div>
    <div class="form-group"><label>Direcci\u00F3n</label><input id="c_dir" value="${c.direccion||''}" placeholder="Direcci\u00F3n completa"></div>
    <div class="form-group"><label>Notas</label><textarea id="c_notas" style="min-height:60px">${c.notas||''}</textarea></div>
  `,async()=>{
    const nombre=document.getElementById('c_nombre').value.trim();
    if(!nombre){toast('Nombre requerido','red');return;}
    const obj={
      nombre,nit:document.getElementById('c_nit').value.trim(),
      empresa:document.getElementById('c_empresa').value.trim(),
      tipo:document.getElementById('c_tipo').value,
      telefono:document.getElementById('c_tel').value.trim(),
      telefono2:document.getElementById('c_tel2').value.trim(),
      email:document.getElementById('c_email').value.trim(),
      whatsapp:document.getElementById('c_wa').value.trim(),
      direccion:document.getElementById('c_dir').value.trim(),
      notas:document.getElementById('c_notas').value.trim(),
      updatedAt:nowTs()
    };
    if(id){obj.id=id;await dbPut('clientes',obj);}else{obj.createdAt=nowTs();await dbAdd('clientes',obj);}
    await logAuditoria(id?'EDITAR':'CREAR','clientes',(id?'Cliente editado':'Cliente creado')+': '+obj.nombre,{nit:obj.nit});
    closeModal('modalCliente');toast(id?'Cliente actualizado':'Cliente registrado');
    await navTo('clientes');
  },true);
}

async function verHistorialCliente(clienteId){
  const c=await dbGet('clientes',clienteId);
  const vehiculos=await dbGetAll('vehiculos');
  const ordenes=await dbGetAll('ordenes');
  const facturas=await dbGetAll('facturas');
  const vehs=vehiculos.filter(v=>v.clienteId===clienteId);
  const ords=ordenes.filter(o=>o.clienteId===clienteId);
  const facts=facturas.filter(f=>f.clienteId===clienteId);
  const totalFacturado=facts.reduce((a,f)=>a+(f.total||0),0);
  openModal('histCli',`Historial \u2014 ${c.nombre}`,`
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-label">Veh\u00EDculos</div><div class="stat-value">${vehs.length}</div></div>
      <div class="stat-card"><div class="stat-label">\u00D3rdenes</div><div class="stat-value">${ords.length}</div></div>
      <div class="stat-card stat-green"><div class="stat-label">Total facturado</div><div class="stat-value" style="font-size:16px">${fmt(totalFacturado)}</div></div>
    </div>
    <div style="margin-top:8px;font-weight:600;font-size:13px;margin-bottom:6px">Veh\u00EDculos registrados:</div>
    ${vehs.map(v=>`<div class="alert-item" style="margin-bottom:6px">
      <div><strong>${v.placa}</strong> \u2014 ${v.marca} ${v.modelo} ${v.anio||''} (${v.color||'\u2014'})</div>
      <div style="font-size:11px;color:var(--text2)">Km: ${v.km?.toLocaleString()||'\u2014'} | Pr\u00F3ximo servicio: ${fechaLegible(v.proximoServicio)}</div>
    </div>`).join('')||'<div class="text-muted">Sin veh\u00EDculos registrados</div>'}
    <div style="margin-top:12px;font-weight:600;font-size:13px;margin-bottom:6px">\u00DAltimas \u00F3rdenes:</div>
    ${ords.slice(-5).reverse().map(o=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px">
      <span>${o.noOT} \u2014 ${o.descripcion?.slice(0,40)||'OT'}</span>
      <span class="badge badge-${o.estado==='entregada'?'green':'amber'}">${o.estado}</span>
    </div>`).join('')||'<div class="text-muted">Sin \u00F3rdenes</div>'}
  `,()=>closeModal('histCli'),true);
}

async function eliminarCliente(id){
  if(!soloAdmin()){toast('Solo admin','red');return;}
  if(!confirm('\u00BFEliminar cliente y todos sus datos?'))return;
  await dbDelete('clientes',id);await navTo('clientes');
}

/* ---- VEH\u00CDCULOS MEJORADO ---- */
async function renderVehiculos(content,actions){
  const vehiculos=await dbGetAll('vehiculos');
  const clientes=await dbGetAll('clientes');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalVehiculo()">+ Nuevo veh\u00EDculo</button>`;
  content.innerHTML=`
  <div class="section-title">Veh\u00EDculos</div>
  <div class="section-sub">${vehiculos.length} veh\u00EDculos registrados</div>
  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>Placa</th><th>Veh\u00EDculo</th><th>Tipo</th><th>Motor</th><th>Km</th><th>Cliente</th><th>Pr\u00F3x. servicio</th><th>Fabricante info</th><th>Acciones</th></tr></thead>
      <tbody>
        ${vehiculos.map(v=>{
          const c=clientes.find(x=>x.id===v.clienteId);
          const dias=v.proximoServicio?diasRestantes(v.proximoServicio):null;
          const fab=FABRICANTES_DB[v.marca];
          const badge=dias!==null?(dias<0?'<span class="badge badge-red">Vencido</span>':dias<=7?`<span class="badge badge-red">${dias}d</span>`:dias<=15?`<span class="badge badge-amber">${dias}d</span>`:`<span class="badge badge-green">${dias}d</span>`):'<span class="text-muted">\u2014</span>';
          return`<tr>
            <td class="td-mono" style="font-weight:700">${v.placa||'\u2014'}</td>
            <td>${v.marca||''} ${v.modelo||''} ${v.anio?`(${v.anio})`:''}</td>
            <td><span class="badge badge-gray">${v.tipoVehiculo||'\u2014'}</span></td>
            <td style="font-size:11px;color:var(--text2)">${v.cilindros?v.cilindros+' cil.':''} ${v.cilindraje?v.cilindraje+'cc':''}</td>
            <td class="td-mono">${v.km?.toLocaleString()||'\u2014'}</td>
            <td>${c?.nombre||'\u2014'}</td>
            <td>${badge} <span style="font-size:10px;color:var(--text3)">${fechaLegible(v.proximoServicio)}</span></td>
            <td>${fab?`<button class="btn btn-sm btn-secondary" onclick="verRecomFabricante('${v.marca}','${v.modelo}')">\u1F4CB Recom.</button>`:'\u2014'}</td>
            <td><div class="flex gap-1">
              <button class="btn btn-sm btn-secondary" onclick="modalVehiculo(${v.id})">\u270F</button>
              <button class="btn btn-sm btn-green" onclick="nuevaOrdenVehiculo(${v.id})">+OT</button><button class="btn btn-sm btn-blue" onclick="sugerirMantenimiento(${v.id})">\u1F50D Km</button>
              ${soloAdmin()?`<button class="btn btn-sm btn-danger" onclick="eliminarVehiculo(${v.id})">\u2715</button>`:''}
            </div></td>
          </tr>`;
        }).join('')||'<tr><td colspan="9" class="text-center text-muted" style="padding:20px">Sin veh\u00EDculos</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}

function verRecomFabricante(marca,modelo){
  const fab=FABRICANTES_DB[marca]||FABRICANTES_DB['Otro'];
  openModal('recomFab',`Recomendaciones \u2014 ${marca} ${modelo}`,`
    <div class="alert alert-blue" style="font-size:12px">Datos basados en especificaciones del fabricante. Consultar manual para su modelo espec\u00EDfico.</div>
    <div class="form-row form-row-2" style="margin-top:12px">
      <div>
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--text2)">Intervalos de mantenimiento</div>
        ${Object.entries(fab.intervalos).filter(([,v])=>v).map(([k,v])=>`
          <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
            <span>${{aceite:'Cambio de aceite',filtroAire:'Filtro de aire',filtroCombustible:'Filtro de combustible',bujias:'Buj\u00EDas',correa:'Correa/cadena distribuci\u00F3n',frenos:'Revisi\u00F3n de frenos',refrigerante:'Refrigerante'}[k]||k}</span>
            <span class="td-mono text-amber">${v?.toLocaleString()} km</span>
          </div>`).join('')}
      </div>
      <div>
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--text2)">Especificaciones de fluidos</div>
        <div style="font-size:12px;padding:8px;background:var(--bg3);border-radius:6px;margin-bottom:8px">
          <div style="color:var(--text2);margin-bottom:4px">Aceite recomendado:</div>
          <div style="color:var(--green)">${fab.aceiteRecomendado}</div>
        </div>
        <div style="font-size:12px;padding:8px;background:var(--bg3);border-radius:6px;margin-bottom:8px">
          <div style="color:var(--text2);margin-bottom:4px">Filtro de aceite:</div>
          <div>${fab.filtroAceite}</div>
        </div>
        <div style="font-size:12px;padding:8px;background:var(--bg3);border-radius:6px">
          <div style="color:var(--text2);margin-bottom:4px">Observaciones:</div>
          <div style="color:var(--text2)">${fab.observaciones}</div>
        </div>
      </div>
    </div>
  `,()=>closeModal('recomFab'),true);
}

async function modalVehiculo(id=null,clientePresel=null){
  const clientes=await dbGetAll('clientes');
  const v=id?await dbGet('vehiculos',id):{};
  openModal('modalVehiculo',id?'Editar Veh\u00EDculo':'Nuevo Veh\u00EDculo',`
    <div class="form-row form-row-2">
      <div class="form-group"><label>Cliente * 
          <button type="button" onclick="crearClienteRapidoVeh()" style="font-size:10px;padding:2px 8px;margin-left:6px;background:var(--bg3);border:1px solid var(--border2);border-radius:4px;cursor:pointer;color:var(--accent)">+ Nuevo</button>
        </label>
        <select id="v_cliente"><option value="">Seleccionar cliente...</option>${clientes.map(c=>`<option value="${c.id}" ${(v.clienteId||clientePresel)===c.id?'selected':''}>${c.nombre}${c.empresa?' ('+c.empresa+')':''}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Placa *</label><input id="v_placa" value="${v.placa||''}" placeholder="P-123ABC"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Tipo de veh\u00EDculo</label>
        <select id="v_tipo">${TIPOS_VEHICULO.map(t=>`<option value="${t}" ${v.tipoVehiculo===t?'selected':''}>${t}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Marca</label>
        <select id="v_marca" onchange="cargarModelosMarca()">${Object.keys(FABRICANTES_DB).map(m=>`<option value="${m}" ${v.marca===m?'selected':''}>${m}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Modelo</label><input id="v_modelo" value="${v.modelo||''}" placeholder="Modelo del veh\u00EDculo"></div>
      <div class="form-group"><label>A\u00F1o</label><input id="v_anio" type="number" value="${v.anio||''}" placeholder="2020" min="1960" max="2030"></div>
      <div class="form-group"><label>Color</label><input id="v_color" value="${v.color||''}" placeholder="Blanco"></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>No. cilindros</label>
        <select id="v_cil"><option value="">\u2014</option>${[3,4,5,6,8,10,12,16].map(c=>`<option value="${c}" ${v.cilindros==c?'selected':''}>${c} cilindros</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Cilindraje (cc)</label><input id="v_cc" type="number" value="${v.cilindraje||''}" placeholder="2000"></div>
      <div class="form-group"><label>Tipo combustible</label>
        <select id="v_comb"><option value="gasolina" ${v.combustibleTipo==='gasolina'?'selected':''}>Gasolina</option><option value="diesel" ${v.combustibleTipo==='diesel'?'selected':''}>Diesel</option><option value="hibrido" ${v.combustibleTipo==='hibrido'?'selected':''}>H\u00EDbrido</option><option value="electrico" ${v.combustibleTipo==='electrico'?'selected':''}>El\u00E9ctrico</option></select>
      </div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Km actual</label><input id="v_km" type="number" value="${v.km||''}" placeholder="45000"></div>
      <div class="form-group"><label>VIN / No. motor / No. chasis</label><input id="v_vin" value="${v.vin||''}" placeholder="VIN o No. motor"></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Tipo servicio pr\u00F3ximo</label>
        <select id="v_tipoServ"><option value="Cambio de aceite">Cambio de aceite</option><option value="Mantenimiento preventivo">Mantenimiento preventivo</option><option value="Revisi\u00F3n general">Revisi\u00F3n general</option><option value="Frenos">Frenos</option><option value="Otro">Otro</option></select>
      </div>
      <div class="form-group"><label>Fecha pr\u00F3ximo servicio</label><input id="v_prox" type="date" value="${v.proximoServicio||''}"></div>
      <div class="form-group"><label>Km pr\u00F3ximo servicio</label><input id="v_kmprox" type="number" value="${v.kmProximo||''}" placeholder="50000"></div>
    </div>
    <div class="form-group"><label>Observaciones generales</label><textarea id="v_obs" style="min-height:60px">${v.observaciones||''}</textarea></div>
    <div id="recom_fab_preview"></div>
  `,async()=>{
    const placa=document.getElementById('v_placa').value.trim();
    const clienteId=parseInt(document.getElementById('v_cliente').value);
    if(!placa||!clienteId){toast('Placa y cliente requeridos','red');return;}
    const cliente=clientes.find(c=>c.id===clienteId);
    const obj={
      clienteId,clienteNombre:cliente?.nombre,placa,
      tipoVehiculo:document.getElementById('v_tipo').value,
      marca:document.getElementById('v_marca').value,
      modelo:document.getElementById('v_modelo').value.trim(),
      anio:parseInt(document.getElementById('v_anio').value)||null,
      color:document.getElementById('v_color').value.trim(),
      cilindros:parseInt(document.getElementById('v_cil').value)||null,
      cilindraje:parseInt(document.getElementById('v_cc').value)||null,
      combustibleTipo:document.getElementById('v_comb').value,
      km:parseInt(document.getElementById('v_km').value)||0,
      vin:document.getElementById('v_vin').value.trim(),
      tipoServicio:document.getElementById('v_tipoServ').value,
      proximoServicio:document.getElementById('v_prox').value,
      kmProximo:parseInt(document.getElementById('v_kmprox').value)||null,
      observaciones:document.getElementById('v_obs').value.trim(),
      updatedAt:nowTs()
    };
    if(id){obj.id=id;await dbPut('vehiculos',obj);}else{obj.createdAt=nowTs();await dbAdd('vehiculos',obj);}
    await logAuditoria(id?'EDITAR':'CREAR','vehiculos',(id?'Veh\u00edculo editado':'Veh\u00edculo creado')+': '+(obj.placa||''),{marca:obj.marca});
    closeModal('modalVehiculo');toast(id?'Veh\u00EDculo actualizado':'Veh\u00EDculo registrado');
    await navTo('vehiculos');
  },true);
}

async function eliminarVehiculo(id){if(!soloAdmin())return;if(!confirm('\u00BFEliminar?'))return;await dbDelete('vehiculos',id);await navTo('vehiculos');}
async function nuevaOrdenVehiculo(vehiculoId){await navTo('recepciones');setTimeout(()=>modalRecepcion(null,vehiculoId),300);}

/* ---- RECEPCIONES CON FOTOS ---- */
async function renderRecepciones(content,actions){
  const recepciones=await dbGetAll('recepciones');
  recepciones.sort((a,b)=>(a.fecha||'')<(b.fecha||'')?1:-1);
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalRecepcion()">+ Nueva recepci\u00F3n</button>`;
  content.innerHTML=`
  <div class="section-title">Recepci\u00F3n de Veh\u00EDculos</div>
  <div class="section-sub">Registro de ingreso \u2014 ${recepciones.length} recepciones</div>
  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>No.</th><th>Fecha/Hora</th><th>Placa</th><th>Cliente</th><th>Tipo</th><th>T\u00E9cnico</th><th>Fotos</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>
        ${recepciones.map(r=>`<tr>
          <td class="td-mono" style="font-weight:600">${r.noRecepcion||('#'+r.id)}</td>
          <td style="font-size:11px">${fechaLegible(r.fecha)} ${r.hora||''}</td>
          <td class="td-mono">${r.placa||'\u2014'}</td>
          <td>${r.clienteNombre||'\u2014'}</td>
          <td><span class="badge badge-${r.tipoServicio==='preventivo'?'green':'amber'}">${r.tipoServicio||'\u2014'}</span></td>
          <td>${r.tecnico||'\u2014'}</td>
          <td>${r.nFotos>0?`<span class="badge badge-blue">\u1F4F7 ${r.nFotos}</span>`:'<span class="text-muted" style="font-size:11px">Sin fotos</span>'}</td>
          <td><span class="badge badge-${r.estado==='entregado'?'green':r.estado==='en_taller'?'blue':'amber'}">${r.estado||'recibido'}</span></td>
          <td><div class="flex gap-1">
            <button class="btn btn-sm btn-secondary" onclick="imprimirRecepcion(${r.id})">\u1F5A8</button>
            <button class="btn btn-sm btn-secondary" onclick="verFotosRecepcion(${r.id})">\u1F4F7</button>
            <button class="btn btn-sm btn-green" onclick="crearOTdesdeRecepcion(${r.id})">\u2192OT</button>
            ${soloAdmin()||adminOSupervisor()?`<button class="btn btn-sm btn-danger" onclick="eliminarRecepcion(${r.id})">\u2715</button>`:''}
          </div></td>
        </tr>`).join('')||'<tr><td colspan="9" class="text-center text-muted" style="padding:20px">Sin recepciones</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}



function fileToBase64(file){
  return new Promise((res,rej)=>{
    const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=rej;r.readAsDataURL(file);
  });
}

async function verFotosRecepcion(id){
  const rec=await dbGet('recepciones',id);
  const fotos=await dbGetAll('fotos');
  const fotosRec=fotos.filter(f=>f.recepcionId===id);
  openModal('verFotos',`Fotograf\u00EDas \u2014 ${rec?.noRecepcion||'REC'} | ${rec?.placa||''}`,`
    ${fotosRec.length===0?'<div class="alert alert-amber">No hay fotograf\u00EDas para esta recepci\u00F3n. Edita la recepci\u00F3n para agregar fotos.</div>':
      `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px">
        ${fotosRec.map(f=>`<div style="border:1px solid var(--border);border-radius:8px;overflow:hidden">
          <img src="${f.datos}" style="width:100%;height:140px;object-fit:cover;display:block">
          <div style="padding:6px 8px;font-size:11px;color:var(--text2)">${f.nombre||'foto'}<br>${fechaLegible(f.fecha)}</div>
        </div>`).join('')}
      </div>`}
    <div style="margin-top:12px;font-size:12px;color:var(--text3)">Las fotograf\u00EDas se guardan en la base de datos local del navegador.</div>
  `,()=>closeModal('verFotos'),true);
}

async function imprimirRecepcion(id){
  const r=await dbGet('recepciones',id);
  const cfg=await dbGet('config','taller')||{};
  const w=window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Recepci\u00F3n ${r.noRecepcion}</title>
  <style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:12px;padding:24px;max-width:700px;margin:0 auto;color:#111}
  h1{font-size:16px;margin:0}h2{font-size:12px;color:#555;font-weight:normal;margin:0}
  .header{display:flex;justify-content:space-between;border-bottom:2px solid #333;padding-bottom:10px;margin-bottom:14px}
  .row{display:flex;gap:20px;margin-bottom:6px}.label{color:#777;min-width:150px;font-weight:600}
  .box{border:1px solid #ccc;border-radius:4px;padding:8px 12px;margin-bottom:10px}
  .firma{margin-top:36px;display:flex;gap:60px}.firma-line{border-top:1px solid #333;padding-top:6px;min-width:200px;text-align:center;font-size:11px;color:#555}
  @media print{button{display:none}}</style></head><body>
  <div class="header">
    <div><h1>\u2699 ${cfg.nombre||'TALLER PRO GT'}</h1><h2>NIT: ${cfg.nit||'\u2014'} | ${cfg.telefono||'\u2014'}</h2><h2>${cfg.direccion||''}</h2></div>
    <div style="text-align:right"><h1>RECEPCI\u00D3N DE VEH\u00CDCULO</h1><h2>No. ${r.noRecepcion||r.id}</h2><h2>${r.fecha} \u2014 ${r.hora||''}</h2></div>
  </div>
  <div class="box">
    <div class="row"><span class="label">Cliente:</span><strong>${r.clienteNombre}</strong></div>
    <div class="row"><span class="label">Placa / Veh\u00EDculo:</span>${r.placa} \u2014 ${r.vehiculoDesc||''}</div>
    <div class="row"><span class="label">Km entrada:</span>${(r.kmEntrada||0).toLocaleString()} km</div>
    <div class="row"><span class="label">Combustible:</span>${r.combustible||'\u2014'}</div>
    <div class="row"><span class="label">Tipo de servicio:</span>${r.tipoServicio||'\u2014'}</div>
    <div class="row"><span class="label">T\u00E9cnico asignado:</span>${r.tecnico||'\u2014'}</div>
  </div>
  <div class="box"><div class="label">Motivo de ingreso / S\u00EDntomas:</div><div style="margin-top:4px">${r.motivo||'\u2014'}</div></div>
  <div class="box"><div class="label">Da\u00F1os preexistentes:</div><div style="margin-top:4px">${r.danosPreexistentes||'Ninguno reportado'}</div></div>
  <div class="box"><div class="label">Accesorios entregados:</div><div style="margin-top:4px">${r.accesorios||'Ninguno'}</div></div>
  ${r.observaciones?`<div class="box"><div class="label">Observaciones:</div><div style="margin-top:4px">${r.observaciones}</div></div>`:''}
  <div class="firma">
    <div class="firma-line">Firma de quien entrega<br><br>${r.nombreEntrega||'_______________________'}</div>
    <div class="firma-line">Firma de recepci\u00F3n<br><br>${r.tecnico||'_______________________'}</div>
  </div>
  <div style="margin-top:20px;font-size:10px;color:#aaa;text-align:center">TallerPro GT \u2014 ${new Date().toLocaleString('es-GT')}</div>
  </body></html>`);
  w.document.close(); setTimeout(function(){w.print();},400);
}

async function crearOTdesdeRecepcion(recepcionId){
  const r=await dbGet('recepciones',recepcionId);
  await navTo('ordenes');setTimeout(()=>modalOrden(null,r),300);
}
async function eliminarRecepcion(id){if(!adminOSupervisor())return;if(!confirm('\u00BFEliminar recepci\u00F3n?'))return;await dbDelete('recepciones',id);await navTo('recepciones');}

/* ---- \u00D3RDENES DE TRABAJO MEJORADAS ---- */
async function renderOrdenes(content,actions){
  const ordenes=await dbGetAll('ordenes');
  ordenes.sort((a,b)=>(a.fecha||'')<(b.fecha||'')?1:-1);
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalOrden()">+ Nueva OT</button>`;
  content.innerHTML=`
  <div class="section-title">\u00D3rdenes de Trabajo</div>
  <div class="section-sub">${ordenes.length} \u00F3rdenes registradas</div>
  <div class="card" style="padding:10px">
    <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
      ${['','nuevo','en_proceso','completada','entregada'].map(s=>`<button class="btn btn-sm btn-secondary" onclick="filtrarOrdenes('${s}')">${s||'Todas'}</button>`).join('')}
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>No. OT</th><th>Fecha</th><th>Veh\u00EDculo</th><th>Cliente</th><th>Tipo</th><th>T\u00E9cnico</th><th>Entrega</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody id="tbody_ot">
        ${ordenes.map(o=>`<tr data-estado="${o.estado||'nuevo'}">
          <td class="td-mono" style="font-weight:600">${o.noOT||('#'+o.id)}</td>
          <td style="font-size:11px">${fechaLegible(o.fecha)}</td>
          <td class="td-mono">${o.placa||'\u2014'}</td>
          <td>${o.clienteNombre||'\u2014'}</td>
          <td><span class="badge badge-${o.tipoServicio==='preventivo'?'green':'amber'}">${o.tipoServicio||'\u2014'}</span></td>
          <td style="font-size:12px">${o.tecnico||'\u2014'}</td>
          <td style="font-size:11px;color:${o.fechaEntregaEstimada&&diasRestantes(o.fechaEntregaEstimada)<0?'var(--red)':o.fechaEntregaEstimada?'var(--accent)':'var(--text3)'}">
            ${o.fechaEntregaEstimada?`\u1F4C5 ${fechaLegible(o.fechaEntregaEstimada)} ${o.horaEntregaEstimada||''}`:o.fechaEntregaReal?`\u2705 ${fechaLegible(o.fechaEntregaReal)}`:'\u2014'}
          </td>
          <td class="td-mono td-right">${fmt(o.totalConIVA||o.total||0)}</td>
          <td><span class="badge badge-${o.estado==='entregada'?'green':o.estado==='completada'?'blue':o.estado==='en_proceso'?'amber':'gray'}">${o.estado||'nuevo'}</span></td>
          <td><div class="flex gap-1">
            <button class="btn btn-sm btn-secondary" onclick="modalOrden(${o.id})">\u270F</button>
            <button class="btn btn-sm btn-secondary" onclick="imprimirOrden(${o.id})">\u1F5A8</button>
            ${adminOSupervisor()?`<button class="btn btn-sm btn-green" onclick="facturarOrden(${o.id})">\u1F9FE</button>`:''}
            ${soloAdmin()?`<button class="btn btn-sm btn-danger" onclick="eliminarOrden(${o.id})">\u2715</button>`:''}
          </div></td>
        </tr>`).join('')||'<tr><td colspan="10" class="text-center text-muted" style="padding:20px">Sin \u00F3rdenes</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}

function filtrarOrdenes(estado){
  document.querySelectorAll('#tbody_ot tr').forEach(tr=>{
    tr.style.display=(!estado||tr.dataset.estado===estado)?'':'none';
  });
}



/* ================================================================
   NUMERACIÓN CORRELATIVA ANUAL — OT, REC, COT, REP, INS
   ================================================================ */
async function genNumAnual(store, campo, prefijo) {
  var anio = new Date().getFullYear();
  var todos = await dbGetAll(store);
  var pat = new RegExp('^' + prefijo + '-' + anio + '-');
  var deEsteAnio = todos.filter(function(o){ return o[campo] && pat.test(o[campo]); });
  var max = 0;
  deEsteAnio.forEach(function(o) {
    var partes = (o[campo]||'').split('-');
    var num = parseInt(partes[partes.length-1]) || 0;
    if (num > max) max = num;
  });
  return prefijo + '-' + anio + '-' + String(max + 1).padStart(6, '0');
}

async function genNumSecuencial(store, campo, prefijo) {
  // Sin año — REP-00000001, INS-00000001
  var todos = await dbGetAll(store);
  var pat = new RegExp('^' + prefijo + '-\\d+$');
  var max = 0;
  todos.forEach(function(o) {
    if (o[campo] && pat.test(o[campo])) {
      var num = parseInt((o[campo]||'').split('-')[1]) || 0;
      if (num > max) max = num;
    }
  });
  return prefijo + '-' + String(max + 1).padStart(8, '0');
}

async function generarNumeroOT()  { return genNumAnual('ordenes', 'noOT', 'OT'); }
async function generarNumeroREC() { return genNumAnual('recepciones', 'noRecepcion', 'REC'); }
async function generarNumeroCOT() { return genNumAnual('cotizaciones', 'noCotizacion', 'COT'); }
async function generarNumeroREP() { return genNumSecuencial('repuestos', 'codigo', 'REP'); }
async function generarNumeroINS() { return genNumSecuencial('insumos', 'codigo', 'INS'); }



async function modalOrden(id=null,recepcionData=null){
  const clientes=await dbGetAll('clientes');
  const vehiculos=await dbGetAll('vehiculos');
  const repuestos=await dbGetAll('repuestos');
  const insumos=await dbGetAll('insumos');
  const empleados=(await dbGetAll('empleados')).filter(e=>e.activo!==false);
  const o=id?await dbGet('ordenes',id):{};
  const nuevoNoOT = id ? (o.noOT||'') : await generarNumeroOT();
  const rData=recepcionData||{};
  const allProductos=[...repuestos.map(r=>({...r,tipo:'repuesto'})),...insumos.map(i=>({...i,tipo:'insumo'}))];
  const cfg=await dbGet('config','taller')||{};
  const tarifaDefault=cfg.tarifaHora||150;

  openModal('modalOrden',id?'Editar Orden de Trabajo':'Nueva Orden de Trabajo',`
    <div class="form-row form-row-3">
      <div class="form-group"><label>No. OT</label><input id="ot_no" value="${o.noOT||nuevoNoOT}"></div>
      <div class="form-group"><label>Fecha *</label><input id="ot_fecha" type="date" value="${o.fecha||today()}"></div>
      <div class="form-group"><label>Tipo servicio</label>
        <select id="ot_tipo"><option value="preventivo" ${o.tipoServicio==='preventivo'?'selected':''}>Preventivo</option><option value="correctivo" ${o.tipoServicio==='correctivo'?'selected':''}>Correctivo</option><option value="diagnostico">Diagn\u00F3stico</option></select>
      </div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Cliente</label>
        <select id="ot_cliente">${clientes.map(c=>`<option value="${c.id}" ${(o.clienteId||rData.clienteId)===c.id?'selected':''}>${c.nombre}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Veh\u00EDculo</label>
        <select id="ot_vehiculo">${vehiculos.map(v=>`<option value="${v.id}" ${(o.vehiculoId||rData.vehiculoId)===v.id?'selected':''}>${v.placa} \u2014 ${v.marca} ${v.modelo}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>T\u00E9cnico responsable</label>
        <select id="ot_tecnico">${empleados.filter(e=>['Mec\u00E1nico','Mec\u00E1nico senior','Electricista','Auxiliar'].includes(e.cargo)).map(e=>`<option value="${e.nombre}" ${(o.tecnico||rData.tecnico)===e.nombre?'selected':''}>${e.nombre} \u2014 ${e.cargo}</option>`).join('')}<option value="otro">Otro</option></select>
      </div>
      <div class="form-group"><label>Estado</label>
        <select id="ot_estado"><option value="nuevo" ${o.estado==='nuevo'?'selected':''}>Nuevo</option><option value="en_proceso" ${o.estado==='en_proceso'?'selected':''}>En proceso</option><option value="completada" ${o.estado==='completada'?'selected':''}>Completada</option><option value="entregada" ${o.estado==='entregada'?'selected':''}>Entregada</option></select>
      </div>
      <div class="form-group"><label>Prioridad</label>
        <select id="ot_prioridad"><option value="normal" ${o.prioridad==='normal'?'selected':''}>Normal</option><option value="urgente" ${o.prioridad==='urgente'?'selected':''}>Urgente</option><option value="programada" ${o.prioridad==='programada'?'selected':''}>Programada</option></select>
      </div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>\u1F4C5 Fecha estimada de entrega</label><input id="ot_fentrega" type="date" value="${o.fechaEntregaEstimada||''}"></div>
      <div class="form-group"><label>\u23F0 Hora estimada de entrega</label><input id="ot_hentrega" type="time" value="${o.horaEntregaEstimada||''}"></div>
    </div>
    <div class="form-group"><label>Descripci\u00F3n del trabajo solicitado</label>
      <textarea id="ot_desc" placeholder="Trabajos a realizar, fallas reportadas...">${o.descripcion||rData.motivo||''}</textarea>
    </div>

    <div class="divider"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <span class="card-title">Mano de Obra</span>
      <small class="text-muted">Tarifa base: Q ${tarifaDefault}/hora</small>
    </div>
    <div id="mano-obra-list">
      ${(o.manoObra||[{concepto:'',horas:1,tarifa:tarifaDefault,descuento:0}]).map((m,i)=>manoObraRow(m,i,tarifaDefault)).join('')}
    </div>
    <button class="btn btn-sm btn-secondary mt-1" onclick="addManoObra(${tarifaDefault})">+ Agregar trabajo</button>

    <div class="divider"></div>
    <div class="card-title" style="margin-bottom:10px">Repuestos e Insumos</div>
    <div id="items-list">
      ${(o.items||[]).map((item,i)=>itemRow(item,i,allProductos)).join('')}
    </div>
    <button class="btn btn-sm btn-secondary mt-1" onclick="addItem(${JSON.stringify(allProductos).replace(/"/g,'&quot;')})">+ Agregar repuesto/insumo</button>

    <div class="divider"></div>
    <div class="card-title" style="margin-bottom:10px">Otros cargos</div>
    <div id="otros-list">
      ${(o.otrosCargos||[]).map((oc,i)=>otroCargoRow(oc,i)).join('')}
    </div>
    <button class="btn btn-sm btn-secondary mt-1" onclick="addOtroCargo()">+ Agregar otro cargo</button>

    <div class="divider"></div>
    <div class="form-group" style="border:1px solid rgba(224,90,78,0.3);background:var(--red-dim);border-radius:8px;padding:12px">
      <label style="color:var(--red);font-weight:600">\u1F512 Comentarios internos del t\u00E9cnico (NO aparece en reporte al cliente)</label>
      <textarea id="ot_comentarios" placeholder="Documentar: m\u00E9todos usados, problemas encontrados, piezas revisadas, observaciones t\u00E9cnicas..." style="min-height:100px;margin-top:6px">${o.comentariosInternos||''}</textarea>
    </div>

    <div class="divider"></div>
    <div id="ot_totales"></div>
    
  `,async()=>{
    const clienteId=parseInt(document.getElementById('ot_cliente').value);
    const vehiculoId=parseInt(document.getElementById('ot_vehiculo').value);
    const cliente=clientes.find(c=>c.id===clienteId);
    const vehiculo=vehiculos.find(v=>v.id===vehiculoId);
    const manoObra=getManoObra();
    const items2=getItems();
    const otrosCargos=getOtrosCargos();
    const subtotalMO=manoObra.reduce((a,m)=>a+(m.horas*m.tarifa*(1-(m.descuento||0)/100)),0);
    const subtotalItems=items2.reduce((a,i)=>a+(i.cantidad*i.precio*(1-(i.descuento||0)/100)),0);
    const subtotalOtros=otrosCargos.reduce((a,oc)=>a+(oc.monto*(1-(oc.descuento||0)/100)),0);
    const subtotal=subtotalMO+subtotalItems+subtotalOtros;
    const iva=parseFloat((subtotal*IVA).toFixed(2));
    const total=parseFloat((subtotal+iva).toFixed(2));
    const obj={
      noOT:document.getElementById('ot_no').value,
      fecha:document.getElementById('ot_fecha').value,
      tipoServicio:document.getElementById('ot_tipo').value,
      clienteId,clienteNombre:cliente?.nombre,
      vehiculoId,placa:vehiculo?.placa,
      tecnico:document.getElementById('ot_tecnico').value,
      estado:document.getElementById('ot_estado').value,
      prioridad:document.getElementById('ot_prioridad').value,
      fechaEntregaEstimada:document.getElementById('ot_fentrega').value,
      horaEntregaEstimada:document.getElementById('ot_hentrega').value,
      descripcion:document.getElementById('ot_desc').value,
      comentariosInternos:document.getElementById('ot_comentarios').value,
      manoObra,items:items2,otrosCargos,
      subtotalMO,subtotalItems,subtotalOtros,subtotal,iva,totalConIVA:total,total,
      updatedAt:nowTs()
    };
    if(id){obj.id=id;await dbPut('ordenes',obj);}
    else{obj.createdAt=nowTs();const newId=await dbAdd('ordenes',obj);
      // Descontar inventario solo en nueva OT
      for(const item of items2){
        if(item.productoId){
          const storeN=item.tipo==='insumo'?'insumos':'repuestos';
          const rep=await dbGet(storeN,item.productoId);
          if(rep){rep.stock=Math.max(0,(rep.stock||0)-item.cantidad);await dbPut(storeN,rep);}
        }
      }
      // Registrar KPI para el t\u00E9cnico
      const emp=empleados.find(e=>e.nombre===obj.tecnico);
      if(emp){
        await dbAdd('kpi',{empleadoId:emp.id,empleadoNombre:emp.nombre,mes:today().slice(0,7),
          otId:newId,tipoServicio:obj.tipoServicio,totalFacturado:total,fecha:today(),createdAt:nowTs()});
      }
    }
    await logAuditoria(id?'EDITAR':'CREAR','ordenes',(id?'Orden editada':'Orden creada')+': #'+(obj.noOrden||''),{estado:obj.estado});
    closeModal('modalOrden');toast(id?'Orden actualizada':'Orden creada');
    await navTo('ordenes');
  },true);
  setTimeout(calcOTTotales,100);
}

function manoObraRow(m={},i=0,tarifa=150){
  return`<div class="form-row" style="grid-template-columns:2fr 1fr 1fr 1fr auto;gap:8px;align-items:end;margin-bottom:8px" id="mo_row_${i}">
    <div><label style="font-size:11px;color:var(--text3)">Concepto</label><input placeholder="Ej: Cambio de aceite" value="${m.concepto||''}" id="mo_c_${i}" oninput="calcOTTotales()"></div>
    <div><label style="font-size:11px;color:var(--text3)">Horas</label><input type="number" placeholder="Hrs" value="${m.horas||1}" id="mo_h_${i}" min="0.25" step="0.25" oninput="calcOTTotales()"></div>
    <div><label style="font-size:11px;color:var(--text3)">Q/hora</label><input type="number" placeholder="Tarifa" value="${m.tarifa||tarifa}" id="mo_t_${i}" oninput="calcOTTotales()"></div>
    <div><label style="font-size:11px;color:var(--text3)">Desc.%</label><input type="number" placeholder="0" value="${m.descuento||0}" id="mo_d_${i}" min="0" max="100" oninput="calcOTTotales()"></div>
    <button class="btn btn-sm btn-danger btn-icon" onclick="document.getElementById('mo_row_${i}').remove();calcOTTotales()" style="margin-top:18px">\u2715</button>
  </div>`;
}

function addManoObra(tarifa=150){
  const list=document.getElementById('mano-obra-list');
  const i=Date.now();const div=document.createElement('div');
  div.innerHTML=manoObraRow({},i,tarifa);list.appendChild(div.firstChild);
}

function getManoObra(){
  return Array.from(document.querySelectorAll('[id^="mo_row_"]')).map(r=>{
    const i=r.id.split('_').pop();
    return{concepto:document.getElementById('mo_c_'+i)?.value||'',
      horas:parseFloat(document.getElementById('mo_h_'+i)?.value)||0,
      tarifa:parseFloat(document.getElementById('mo_t_'+i)?.value)||0,
      descuento:parseFloat(document.getElementById('mo_d_'+i)?.value)||0};
  }).filter(m=>m.concepto&&m.horas>0);
}

function itemRow(item={},i=0,productos=[]){
  const margenAlerta=item.productoId&&item.precio>0&&item.costo>0&&((item.precio-item.costo)/item.precio)<MARGEN_MIN;
  return`<div class="form-row" style="grid-template-columns:2fr 1fr 1fr 1fr auto;gap:8px;align-items:end;margin-bottom:8px" id="item_row_${i}">
    <div><label style="font-size:11px;color:var(--text3)">Repuesto/Insumo</label>
      <select id="item_p_${i}" onchange="fillItemPrecio(${i})" style="background:var(--bg3)">
        <option value="">\u2014 Seleccionar \u2014</option>
        ${productos.map(p=>{const m=p.precio>0&&p.costo>0?((p.precio-p.costo)/p.precio):0;return`<option value="${p.id}:${p.tipo}:${p.precio}:${p.costo}" ${item.productoId===p.id?'selected':''}>${p.nombre} (${p.stock||0}) ${m<MARGEN_MIN&&p.costo>0?'\u26A0':''}`;}).join('')}
      </select>
    </div>
    <div><label style="font-size:11px;color:var(--text3)">Cant.</label><input type="number" placeholder="1" value="${item.cantidad||1}" id="item_q_${i}" min="1" oninput="calcOTTotales()"></div>
    <div><label style="font-size:11px;color:var(--text3)">Precio Q</label>
      <input type="number" placeholder="0" value="${item.precio||0}" id="item_pr_${i}" oninput="calcOTTotales()" style="${margenAlerta?'color:var(--red);font-weight:700':''}">
    </div>
    <div><label style="font-size:11px;color:var(--text3)">Desc.%</label><input type="number" placeholder="0" value="${item.descuento||0}" id="item_d_${i}" min="0" max="80" oninput="calcOTTotales()"></div>
    <button class="btn btn-sm btn-danger btn-icon" onclick="document.getElementById('item_row_${i}').remove();calcOTTotales()" style="margin-top:18px">\u2715</button>
  </div>`;
}

function addItem(productos){
  const list=document.getElementById('items-list');
  const i=Date.now();const div=document.createElement('div');
  div.innerHTML=itemRow({},i,productos);list.appendChild(div.firstChild);
}

function fillItemPrecio(i){
  const sel=document.getElementById('item_p_'+i);
  const parts=(sel.value||':::').split(':');
  const pr=document.getElementById('item_pr_'+i);
  if(pr&&parts[2])pr.value=parts[2];
  calcOTTotales();
}

function getItems(){
  return Array.from(document.querySelectorAll('[id^="item_row_"]')).map(r=>{
    const i=r.id.split('_').pop();
    const sel=document.getElementById('item_p_'+i);
    const parts=(sel?.value||':::').split(':');
    return{productoId:parseInt(parts[0])||null,tipo:parts[1],
      costo:parseFloat(parts[3])||0,
      nombre:sel?.options[sel.selectedIndex]?.text?.replace(/\(.*\)/g,'').replace('\u26A0','').trim()||'',
      cantidad:parseFloat(document.getElementById('item_q_'+i)?.value)||0,
      precio:parseFloat(document.getElementById('item_pr_'+i)?.value)||0,
      descuento:parseFloat(document.getElementById('item_d_'+i)?.value)||0};
  }).filter(it=>it.cantidad>0&&it.productoId);
}

function otroCargoRow(oc={},i=0){
  return`<div class="form-row" style="grid-template-columns:2fr 1fr 1fr auto;gap:8px;align-items:end;margin-bottom:8px" id="oc_row_${i}">
    <div><label style="font-size:11px;color:var(--text3)">Concepto</label><input placeholder="Ej: Lavado de motor" value="${oc.concepto||''}" id="oc_c_${i}" oninput="calcOTTotales()"></div>
    <div><label style="font-size:11px;color:var(--text3)">Monto Q</label><input type="number" value="${oc.monto||0}" id="oc_m_${i}" oninput="calcOTTotales()"></div>
    <div><label style="font-size:11px;color:var(--text3)">Desc.%</label><input type="number" value="${oc.descuento||0}" id="oc_d_${i}" min="0" max="100" oninput="calcOTTotales()"></div>
    <button class="btn btn-sm btn-danger btn-icon" onclick="document.getElementById('oc_row_${i}').remove();calcOTTotales()" style="margin-top:18px">\u2715</button>
  </div>`;
}

function addOtroCargo(){
  const list=document.getElementById('otros-list');
  const i=Date.now();const div=document.createElement('div');
  div.innerHTML=otroCargoRow({},i);list.appendChild(div.firstChild);
}

function getOtrosCargos(){
  return Array.from(document.querySelectorAll('[id^="oc_row_"]')).map(r=>{
    const i=r.id.split('_').pop();
    return{concepto:document.getElementById('oc_c_'+i)?.value||'',
      monto:parseFloat(document.getElementById('oc_m_'+i)?.value)||0,
      descuento:parseFloat(document.getElementById('oc_d_'+i)?.value)||0};
  }).filter(oc=>oc.concepto&&oc.monto>0);
}

function calcOTTotales(){
  try{
    const mo=getManoObra();const items=getItems();const ocs=getOtrosCargos();
    const subtotalMO=mo.reduce((a,m)=>a+(m.horas*m.tarifa*(1-(m.descuento||0)/100)),0);
    const descMO=mo.reduce((a,m)=>a+(m.horas*m.tarifa*(m.descuento||0)/100),0);
    const subtotalItems=items.reduce((a,i)=>a+(i.cantidad*i.precio*(1-(i.descuento||0)/100)),0);
    const descItems=items.reduce((a,i)=>a+(i.cantidad*i.precio*(i.descuento||0)/100),0);
    const subtotalOtros=ocs.reduce((a,oc)=>a+(oc.monto*(1-(oc.descuento||0)/100)),0);
    const descOtros=ocs.reduce((a,oc)=>a+(oc.monto*(oc.descuento||0)/100),0);
    const subtotal=subtotalMO+subtotalItems+subtotalOtros;
    const totalDescuentos=descMO+descItems+descOtros;
    const iva=parseFloat((subtotal*IVA).toFixed(2));
    const total=parseFloat((subtotal+iva).toFixed(2));
    const el=document.getElementById('ot_totales');
    if(!el)return;
    const row=(label,val,cls='',bold=false)=>`<div style="display:flex;justify-content:space-between;gap:20px;font-size:${bold?'14':'13'}px;${bold?'font-weight:700;':''}color:${cls?`var(--${cls})`:'var(--text2)'};${bold?'border-top:1px solid var(--border);padding-top:8px;margin-top:4px':''}"><span>${label}</span><span style="font-family:var(--font-mono)">Q&nbsp;${fmtNum(val)}</span></div>`;
    el.innerHTML=`<div style="text-align:right"><div style="display:inline-block;text-align:right;min-width:280px;background:var(--bg3);border-radius:var(--radius);padding:14px 16px;border:1px solid var(--border)">
      ${mo.length?row('Mano de obra (bruto):',mo.reduce((a,m)=>a+(m.horas*m.tarifa),0)):''}
      ${items.length?row('Repuestos/Insumos (bruto):',items.reduce((a,i)=>a+(i.cantidad*i.precio),0)):''}
      ${ocs.length?row('Otros cargos (bruto):',ocs.reduce((a,oc)=>a+oc.monto,0)):''}
      ${totalDescuentos>0?row('(-) Descuentos totales:',totalDescuentos,'red'):''}
      ${row('Subtotal:',subtotal)}
      ${row('IVA (12%):',iva,'accent')}
      ${row('TOTAL A PAGAR:',total,'green',true)}
    </div></div>`;
  }catch(e){}
}

async function imprimirOrden(id){
  const o=await dbGet('ordenes',id);
  const cfg=await dbGet('config','taller')||{};
  const w=window.open('','_blank');
  const moRows=(o.manoObra||[]).map(m=>{
    const bruto=m.horas*m.tarifa;const desc=bruto*(m.descuento||0)/100;const neto=bruto-desc;
    return`<tr><td>Mano de obra: ${m.concepto}</td><td style="text-align:center">${m.horas} hrs</td><td style="text-align:right">Q ${fmtNum(m.tarifa)}/hr</td><td style="text-align:right;color:#c00">${m.descuento||0}%</td><td style="text-align:right">Q ${fmtNum(neto)}</td></tr>`;
  }).join('');
  const itemRows=(o.items||[]).map(i=>{
    const bruto=i.cantidad*i.precio;const desc=bruto*(i.descuento||0)/100;const neto=bruto-desc;
    return`<tr><td>${i.nombre||'Repuesto'}</td><td style="text-align:center">${i.cantidad}</td><td style="text-align:right">Q ${fmtNum(i.precio)}</td><td style="text-align:right;color:#c00">${i.descuento||0}%</td><td style="text-align:right">Q ${fmtNum(neto)}</td></tr>`;
  }).join('');
  const ocRows=(o.otrosCargos||[]).map(oc=>{
    const neto=oc.monto*(1-(oc.descuento||0)/100);
    return`<tr><td>${oc.concepto}</td><td style="text-align:center">1</td><td style="text-align:right">Q ${fmtNum(oc.monto)}</td><td style="text-align:right;color:#c00">${oc.descuento||0}%</td><td style="text-align:right">Q ${fmtNum(neto)}</td></tr>`;
  }).join('');
  const totalDesc=(o.manoObra||[]).reduce((a,m)=>a+m.horas*m.tarifa*(m.descuento||0)/100,0)+
    (o.items||[]).reduce((a,i)=>a+i.cantidad*i.precio*(i.descuento||0)/100,0)+
    (o.otrosCargos||[]).reduce((a,oc)=>a+oc.monto*(oc.descuento||0)/100,0);
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>OT ${o.noOT}</title>
  <style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:11.5px;padding:24px;max-width:750px;margin:0 auto;color:#111}
  h1{font-size:15px;margin:0}.header{display:flex;justify-content:space-between;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:12px}
  table{width:100%;border-collapse:collapse;margin:10px 0}td,th{border:1px solid #ddd;padding:5px 8px;font-size:11px}th{background:#f0f0f0;font-weight:700}
  .row{display:flex;justify-content:space-between;padding:3px 0;font-size:12px}.total{font-weight:bold;font-size:13px;border-top:2px solid #333;padding-top:6px}
  .firma-area{display:flex;gap:60px;margin-top:36px}.firma{border-top:1px solid #333;padding-top:6px;min-width:180px;text-align:center;font-size:10.5px;color:#555}
  @media print{button{display:none}}</style></head><body>
  <div class="header">
    <div><h1>\u2699 ${cfg.nombre||'TALLER PRO GT'}</h1><div style="font-size:11px;color:#555">NIT: ${cfg.nit||'\u2014'} | ${cfg.telefono||'\u2014'}</div><div style="font-size:11px;color:#555">${cfg.direccion||''}</div></div>
    <div style="text-align:right"><h1>ORDEN DE TRABAJO</h1><div>No. ${o.noOT||o.id}</div><div>${o.fecha} | ${o.estado||'nuevo'}</div></div>
  </div>
  <div style="display:flex;gap:20px;margin-bottom:10px;font-size:12px">
    <div><strong>Cliente:</strong> ${o.clienteNombre}</div><div><strong>Placa:</strong> ${o.placa}</div>
    <div><strong>T\u00E9cnico:</strong> ${o.tecnico||'\u2014'}</div><div><strong>Tipo:</strong> ${o.tipoServicio}</div>
  </div>
  ${o.fechaEntregaEstimada?`<div style="font-size:12px;margin-bottom:8px"><strong>Entrega estimada:</strong> ${o.fechaEntregaEstimada} ${o.horaEntregaEstimada||''}</div>`:''}
  <div style="border:1px solid #ddd;padding:8px;margin-bottom:10px;font-size:12px"><strong>Descripci\u00F3n del trabajo:</strong> ${o.descripcion||'\u2014'}</div>
  <table><thead><tr><th>Concepto</th><th>Cant./Hrs</th><th>P. Unit. Q</th><th>Desc.</th><th>Total Q</th></tr></thead>
  <tbody>${moRows}${itemRows}${ocRows}</tbody></table>
  <div style="text-align:right">
    ${totalDesc>0?`<div class="row"><span>(-) Descuentos totales:</span><span style="color:#c00">Q ${fmtNum(totalDesc)}</span></div>`:''}
    <div class="row"><span>Subtotal:</span><span>Q ${fmtNum(o.subtotal||0)}</span></div>
    <div class="row"><span>IVA (12%):</span><span>Q ${fmtNum(o.iva||0)}</span></div>
    <div class="row total"><span>TOTAL A PAGAR:</span><span>Q ${fmtNum(o.totalConIVA||0)}</span></div>
  </div>
  <div class="firma-area">
    <div class="firma">Firma del t\u00E9cnico<br><br>${o.tecnico||'_______________'}</div>
    <div class="firma">Firma del cliente<br><br>${o.clienteNombre||'_______________'}</div>
  </div>
  </body></html>`);
  w.document.close(); setTimeout(function(){w.print();},400);
}

async function facturarOrden(id){
  if(!adminOSupervisor()){toast('Sin permiso','red');return;}
  const o=await dbGet('ordenes',id);
  await navTo('facturas');setTimeout(()=>modalFactura(null,o),300);
}
async function eliminarOrden(id){if(!soloAdmin())return;if(!confirm('\u00BFEliminar?'))return;await dbDelete('ordenes',id);await navTo('ordenes');}

/* ---- FACTURACI\u00D3N MEJORADA CON DETALLE COMPLETO ---- */
async function renderFacturas(content,actions){
  if(!adminOSupervisor()){content.innerHTML='<div class="alert alert-red">Acceso: Supervisor o Admin</div>';return;}
  const facturas=await dbGetAll('facturas');
  facturas.sort((a,b)=>(a.fecha||'')<(b.fecha||'')?1:-1);
  const mesActual=today().slice(0,7);
  const totalMes=facturas.filter(f=>f.fecha?.startsWith(mesActual)).reduce((a,f)=>a+(f.total||0),0);
  const ivaMes=facturas.filter(f=>f.fecha?.startsWith(mesActual)).reduce((a,f)=>a+(f.iva||0),0);
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalFactura()">+ Nueva factura</button>`;
  content.innerHTML=`
  <div class="section-title">Facturaci\u00F3n</div>
  <div class="stat-grid">
    <div class="stat-card stat-green"><div class="stat-label">Total facturado mes</div><div class="stat-value">${fmt(totalMes)}</div></div>
    <div class="stat-card stat-amber"><div class="stat-label">IVA generado mes</div><div class="stat-value">${fmt(ivaMes)}</div></div>
    <div class="stat-card"><div class="stat-label">Facturas emitidas</div><div class="stat-value">${facturas.filter(f=>f.fecha?.startsWith(mesActual)).length}</div></div>
  </div>
  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>No. Factura</th><th>Fecha</th><th>Cliente / NIT</th><th>Subtotal</th><th>Desc.</th><th>IVA 12%</th><th>Total</th><th>Pago</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>
        ${facturas.map(f=>`<tr>
          <td class="td-mono" style="font-weight:600">${f.noFactura||f.id}</td>
          <td>${fechaLegible(f.fecha)}</td>
          <td>${f.clienteNombre||'\u2014'} <span class="text-muted td-mono" style="font-size:11px">${f.nit||'CF'}</span></td>
          <td class="td-mono td-right">${fmt(f.subtotalBruto||f.subtotal)}</td>
          <td class="td-mono td-right text-red">${f.descuentoTotal>0?`-${fmt(f.descuentoTotal)}`:'\u2014'}</td>
          <td class="td-mono td-right text-amber">${fmt(f.iva)}</td>
          <td class="td-mono td-right text-green" style="font-weight:700">${fmt(f.total)}</td>
          <td><span class="badge badge-gray">${f.formaPago||'efectivo'}</span></td>
          <td><span class="badge badge-${f.pagada?'green':'amber'}">${f.pagada?'Pagada':'Pendiente'}</span></td>
          <td><div class="flex gap-1">
            <button class="btn btn-sm btn-secondary" onclick="modalFactura(${f.id})">\u270F</button>
            <button class="btn btn-sm btn-secondary" onclick="imprimirFactura(${f.id})">\u1F5A8</button>
            <button class="btn btn-sm btn-green" onclick="marcarPagada(${f.id},${f.pagada})">\u1F4B0</button>
            ${soloAdmin()?`<button class="btn btn-sm btn-danger" onclick="eliminarFactura(${f.id})">\u2715</button>`:''}
          </div></td>
        </tr>`).join('')||'<tr><td colspan="10" class="text-center text-muted" style="padding:20px">Sin facturas</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}



function lineaFacturaRow(l={},i=0){
  return`<div class="form-row" style="grid-template-columns:2fr 1fr 1fr 1fr auto;gap:6px;align-items:center;margin-bottom:6px" id="lf_row_${i}">
    <input placeholder="Descripci\u00F3n del servicio/producto" value="${l.desc||''}" id="lf_d_${i}" oninput="calcFacTotales()">
    <input type="number" value="${l.qty||1}" id="lf_q_${i}" min="0.01" step="0.01" oninput="calcFacTotales()">
    <input type="number" value="${l.unit||0}" id="lf_u_${i}" step="0.01" oninput="calcFacTotales()">
    <input type="number" value="${l.desc_pct||0}" id="lf_p_${i}" min="0" max="100" oninput="calcFacTotales()">
    <button class="btn btn-sm btn-danger btn-icon" onclick="document.getElementById('lf_row_${i}').remove();calcFacTotales()">\u2715</button>
  </div>`;
}

function addLineaFactura(){
  const list=document.getElementById('lineas_fac');
  const i=Date.now();const div=document.createElement('div');
  div.innerHTML=lineaFacturaRow({},i);list.appendChild(div.firstChild);calcFacTotales();
}

function getLineasFactura(){
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

function cargarNITCliente(){
  const parts=(document.getElementById('f_cliente')?.value||'::').split(':');
  const el=document.getElementById('f_nit');if(el)el.value=parts[1]||'CF';
}

async function imprimirFactura(id){
  const f=await dbGet('facturas',id);
  const cfg=await dbGet('config','taller')||{};
  const w=window.open('','_blank');
  const lineas=f.lineas||[];
  const filasHTML=lineas.map(l=>{
    const bruto=l.qty*l.unit;const desc=bruto*(l.desc_pct||0)/100;const neto=bruto-desc;
    return`<tr>
      <td>${l.desc}</td>
      <td style="text-align:center">${parseFloat(l.qty).toFixed(l.qty%1===0?0:2)}</td>
      <td style="text-align:right">Q&nbsp;${fmtNum(l.unit)}</td>
      <td style="text-align:center;color:#c00">${l.desc_pct||0}%</td>
      <td style="text-align:right;color:#c00">${desc>0?`-Q&nbsp;${fmtNum(desc)}`:'\u2014'}</td>
      <td style="text-align:right;font-weight:600">Q&nbsp;${fmtNum(neto)}</td>
    </tr>`;
  }).join('');
  w.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Factura ${f.noFactura}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:11.5px;color:#111;background:#fff;padding:28px 32px;max-width:720px;margin:0 auto}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #111;padding-bottom:12px;margin-bottom:14px}
  .taller{font-size:19px;font-weight:900;letter-spacing:-.5px}.sub{font-size:10.5px;color:#555;margin-top:3px;line-height:1.6}
  .doc-tipo{font-size:21px;font-weight:900;text-align:right}.doc-info{font-size:11px;color:#555;text-align:right;margin-top:2px}
  .bloque{background:#f8f8f8;border:1px solid #ddd;border-radius:4px;padding:8px 12px;margin-bottom:12px}
  .bloque table{width:100%;border-collapse:collapse}.bloque td{padding:3px 6px;font-size:11px}
  .bloque td:first-child{color:#666;width:120px;font-weight:600}
  table.items{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:0}
  table.items thead tr{background:#111;color:#fff}
  table.items th{padding:7px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.3px}
  table.items td{padding:6px 8px;border-bottom:1px solid #e8e8e8}
  table.items tbody tr:nth-child(even){background:#fafafa}
  .wrap{border:1px solid #ddd;border-radius:4px;overflow:hidden}
  .totales{width:280px;border:1px solid #ddd;border-top:none;margin-left:auto;overflow:hidden}
  .totales td{padding:5px 10px;font-size:12px;border-bottom:1px solid #eee}
  .totales td:last-child{text-align:right;font-family:'Courier New',monospace;font-weight:600}
  .totales td:first-child{color:#555}.fila-iva td{background:#fff8e8}
  .fila-desc td{background:#fff0f0}.fila-total td{background:#111!important;color:#fff!important;font-size:13px;font-weight:900}
  .fila-total td:last-child{font-size:14px}
  .letras{background:#f0f0f0;border:1px solid #ddd;border-radius:4px;padding:7px 10px;margin-top:12px;font-size:10.5px}
  .firmas{display:flex;gap:40px;margin-top:32px}
  .firma{flex:1;border-top:1px solid #888;padding-top:5px;text-align:center;font-size:10.5px;color:#666}
  .pie{margin-top:16px;display:flex;justify-content:space-between;font-size:10px;color:#aaa;border-top:1px solid #ddd;padding-top:8px}
  .pagada-badge{background:#e8f5e9;color:#2e7d32;border:1px solid #a5d6a7;border-radius:3px;padding:2px 8px;font-size:10px;font-weight:700;margin-left:8px}
  @media print{body{padding:12px 14px}button,.no-print{display:none!important}@page{margin:10mm}}
  </style></head><body>
  <div class="header">
    <div><div class="taller">\u2699 ${cfg.nombre||'TALLER PRO GT'}</div>
      <div class="sub">NIT: ${cfg.nit||'\u2014'}<br>${cfg.direccion||'Guatemala'}<br>Tel: ${cfg.telefono||'\u2014'} | ${cfg.email||'\u2014'}</div>
    </div>
    <div><div class="doc-tipo">FACTURA${f.pagada?' <span class="pagada-badge">PAGADA</span>':''}</div>
      <div class="doc-info">No. ${f.noFactura||f.id}</div>
      <div class="doc-info">Fecha: ${fechaLegible(f.fecha)}</div>
      <div class="doc-info">Pago: ${(f.formaPago||'Efectivo').charAt(0).toUpperCase()+(f.formaPago||'efectivo').slice(1)}</div>
    </div>
  </div>
  <div class="bloque"><table><tbody>
    <tr><td>Cliente:</td><td><strong>${f.clienteNombre||'\u2014'}</strong></td><td style="width:70px;color:#666;font-weight:600">NIT:</td><td><strong>${f.nit||'CF'}</strong></td></tr>
    ${f.clienteDireccion?`<tr><td>Direcci\u00F3n:</td><td colspan="3">${f.clienteDireccion}</td></tr>`:''}
    ${f.descripcion?`<tr><td>Referencia:</td><td colspan="3">${f.descripcion}</td></tr>`:''}
  </tbody></table></div>
  <div class="wrap">
    <table class="items">
      <thead><tr><th>Descripci\u00F3n del servicio / producto</th><th style="text-align:center;width:60px">Cant.</th><th style="text-align:right;width:100px">P. Unit. Q</th><th style="text-align:center;width:60px">Desc.</th><th style="text-align:right;width:90px">Desc. Q</th><th style="text-align:right;width:100px">Total Q</th></tr></thead>
      <tbody>${filasHTML||'<tr><td colspan="6" style="text-align:center;color:#999;padding:12px">Sin detalle</td></tr>'}</tbody>
    </table>
    <table class="totales">
      ${f.descuentoTotal>0?`<tr class="fila-desc"><td>(-) Descuentos</td><td>-Q&nbsp;${fmtNum(f.descuentoTotal)}</td></tr>`:''}
      <tr><td>Subtotal</td><td>Q&nbsp;${fmtNum(f.subtotal||0)}</td></tr>
      <tr class="fila-iva"><td>IVA (12%)</td><td>Q&nbsp;${fmtNum(f.iva||0)}</td></tr>
      <tr class="fila-total"><td>TOTAL A PAGAR</td><td>Q&nbsp;${fmtNum(f.total||0)}</td></tr>
    </table>
  </div>
  <div class="letras"><strong>SON:</strong> ${numLetras(f.total||0)}</div>
  ${cfg.piePagina?`<div style="margin-top:10px;font-size:10.5px;color:#666;text-align:center">${cfg.piePagina}</div>`:''}
  <div class="firmas">
    <div class="firma">Autorizado por<br><br>${cfg.nombre||'Taller Pro GT'}</div>
    <div class="firma">Recib\u00ED conforme<br><br>${f.clienteNombre||''}</div>
  </div>
  <div class="pie"><span>R\u00E9gimen IVA \u2014 Decreto 27-92 Guatemala</span><span>${new Date().toLocaleString('es-GT')}</span></div>
  <div class="no-print" style="margin-top:18px;text-align:center">
    <button onclick="window.print()" style="padding:9px 22px;background:#111;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px">\u1F5A8 Imprimir / Guardar PDF</button>
  </div>
  
  </body></html>`);
  w.document.close(); setTimeout(function(){w.print();},400);
}

async function marcarPagada(id,actual){
  const f=await dbGet('facturas',id);f.pagada=!actual;
  await dbPut('facturas',f);toast(f.pagada?'Marcada como pagada':'Marcada como pendiente');
  await navTo('facturas');
}
async function eliminarFactura(id){if(!soloAdmin())return;if(!confirm('\u00BFEliminar factura?'))return;await dbDelete('facturas',id);await navTo('facturas');}

/* ---- ALERTAS AMPLIADAS ---- */
async function generarAlertasAutomaticas(){
  const [vehiculos,repuestos,insumos,alertasEx,facturas,ordenes]=await Promise.all([
    dbGetAll('vehiculos'),dbGetAll('repuestos'),dbGetAll('insumos'),
    dbGetAll('alertas'),dbGetAll('facturas'),dbGetAll('ordenes')
  ]);

  const nuevas=[];
  const existe=(ref)=>alertasEx.some(a=>a.ref===ref);

  // 1. Mantenimiento pr\u00F3ximo
  for(const v of vehiculos){
    if(!v.proximoServicio)continue;
    const dias=diasRestantes(v.proximoServicio);
    if(dias<=15&&dias>=-30){
      const ref=`serv_${v.id}_${v.proximoServicio}`;
      if(!existe(ref))nuevas.push({tipo:'mantenimiento',ref,vista:false,
        titulo:`Mantenimiento pr\u00F3ximo: ${v.placa} \u2014 ${v.modelo||''}`,
        descripcion:`${dias>=0?`En ${dias} d\u00EDas`:`VENCIDO hace ${Math.abs(dias)} d\u00EDas`} \u2014 ${v.tipoServicio||'Servicio preventivo'}. Cliente: ${v.clienteNombre||''}`,
        fecha:today(),vehiculoId:v.id,prioridad:dias<0?'alta':dias<=5?'alta':'media'});
    }
  }

  // 2. Stock bajo en repuestos e insumos
  for(const r of [...repuestos,...insumos]){
    if((r.stock||0)<=(r.stockMin||5)){
      const ref=`stock_${r.id}_${r.tipo||'rep'}`;
      if(!existe(ref))nuevas.push({tipo:'stock',ref,vista:false,
        titulo:`Stock bajo: ${r.nombre}`,
        descripcion:`Stock: ${r.stock||0} uds. M\u00EDnimo: ${r.stockMin||5}. Proveedor: ${r.proveedor||'N/A'}`,
        fecha:today(),prioridad:(r.stock||0)===0?'alta':'media'});
    }
  }

  // 3. Caducidad de productos (< 30 d\u00EDas)
  for(const r of [...repuestos,...insumos]){
    if(!r.fechaCaducidad)continue;
    const dias=diasRestantes(r.fechaCaducidad);
    if(dias<=30){
      const ref=`cad_${r.id}_${r.fechaCaducidad}`;
      if(!existe(ref))nuevas.push({tipo:'vencimiento',ref,vista:false,
        titulo:`Caducidad pr\u00F3xima: ${r.nombre}`,
        descripcion:`${dias>=0?`Vence en ${dias} d\u00EDas (${fechaLegible(r.fechaCaducidad)})`:`VENCIDO el ${fechaLegible(r.fechaCaducidad)}`}. Stock: ${r.stock||0} uds.`,
        fecha:today(),prioridad:dias<0?'alta':'media'});
    }
  }

  // 4. M\u00E1rgenes por debajo del 20%
  for(const r of [...repuestos,...insumos]){
    if(r.costo>0&&r.precio>0){
      const m=(r.precio-r.costo)/r.precio;
      if(m<MARGEN_MIN){
        const ref=`margen_${r.id}`;
        if(!existe(ref))nuevas.push({tipo:'margen',ref,vista:false,
          titulo:`Margen bajo: ${r.nombre}`,
          descripcion:`Margen actual: ${(m*100).toFixed(1)}% (m\u00EDnimo 20%). Compra: Q${r.costo.toFixed(2)} | Venta: Q${r.precio.toFixed(2)}`,
          fecha:today(),prioridad:'media'});
      }
    }
  }

  // 5. Facturas pendientes de pago (>30 d\u00EDas)
  const hoy=new Date();
  for(const f of facturas.filter(x=>!x.pagada&&x.fecha)){
    const diasPend=Math.floor((hoy-new Date(f.fecha+'T00:00:00'))/(864e5));
    if(diasPend>30){
      const ref=`cobro_${f.id}`;
      if(!existe(ref))nuevas.push({tipo:'cobro',ref,vista:false,
        titulo:`Factura sin cobrar: ${f.noFactura}`,
        descripcion:`Cliente: ${f.clienteNombre} | Total: Q${(f.total||0).toFixed(2)} | ${diasPend} d\u00EDas pendiente`,
        fecha:today(),prioridad:'alta'});
    }
  }

  // 6. \u00D3rdenes abiertas sin actualizar (>7 d\u00EDas en mismo estado)
  for(const o of ordenes.filter(x=>x.estado==='en_proceso'&&x.updatedAt)){
    const diasSinMov=Math.floor((hoy-new Date(o.updatedAt))/(864e5));
    if(diasSinMov>7){
      const ref=`ot_stale_${o.id}`;
      if(!existe(ref))nuevas.push({tipo:'correctivo',ref,vista:false,
        titulo:`OT sin actualizar: ${o.noOT}`,
        descripcion:`Placa ${o.placa} \u2014 ${diasSinMov} d\u00EDas en estado "en proceso". T\u00E9cnico: ${o.tecnico||'N/A'}`,
        fecha:today(),prioridad:'media'});
    }
  }

  for(const a of nuevas)await dbAdd('alertas',a);
}





async function eliminarAlerta(id){await dbDelete('alertas',id);await navTo('alertas');}
async function exportarAlertas(){
  const alertas=await dbGetAll('alertas');
  const vehiculos=await dbGetAll('vehiculos');
  const clientes=await dbGetAll('clientes');
  const cfg=await dbGet('config','taller')||{};
  let txt='MENSAJES WHATSAPP \u2014 '+( cfg.nombre||'TALLER PRO GT')+'\n'+'='.repeat(50)+'\n\n';
  for(const a of alertas.filter(x=>!x.vista&&x.tipo==='mantenimiento')){
    const v=vehiculos.find(x=>x.id===a.vehiculoId);
    const c=v?clientes.find(x=>x.id===v?.clienteId):null;
    txt+=`PARA: ${c?.whatsapp||c?.telefono||'\u2014'}\nMENSAJE:\nEstimado/a ${c?.nombre||'cliente'}, le recordamos que su veh\u00EDculo *${v?.placa||''} ${v?.modelo||''}* tiene programado su servicio de *${v?.tipoServicio||'mantenimiento'}* pr\u00F3ximamente.\n\nComun\u00EDquese con nosotros para confirmar su cita.\n\n${cfg.nombre||'TallerPro GT'}\n${cfg.telefono||''}\n\n${'-'.repeat(40)}\n\n`;
  }
  const blob=new Blob([txt],{type:'text/plain'});
  const url=URL.createObjectURL(blob);
  const a2=document.createElement('a');a2.href=url;a2.download='alertas_whatsapp.txt';a2.click();
}

/* ---- DASHBOARD PRINCIPAL ---- */
async function renderDashboard(content,actions){
  const [facturas,ordenes,repuestos,insumos,clientes,alertas,costos,empleados]=await Promise.all([
    dbGetAll('facturas'),dbGetAll('ordenes'),dbGetAll('repuestos'),dbGetAll('insumos'),
    dbGetAll('clientes'),dbGetAll('alertas'),dbGetAll('costos'),dbGetAll('empleados')
  ]);
  const mes=today().slice(0,7);
  const fMes=facturas.filter(f=>f.fecha?.startsWith(mes));
  const ingBrutos=fMes.reduce((a,f)=>a+(f.total||0),0);
  const ivaCob=fMes.reduce((a,f)=>a+(f.iva||0),0);
  const ingNetos=fMes.reduce((a,f)=>a+(f.subtotal||0),0);
  const costMes=costos.filter(c=>c.fecha?.startsWith(mes)).reduce((a,c)=>a+(c.monto||0),0);
  const utilidad=ingNetos-costMes;
  const pendAlerts=alertas.filter(a=>!a.vista).length;
  const stockBajo=[...repuestos,...insumos].filter(i=>(i.stock||0)<=(i.stockMin||5)).length;
  const otsAbiertas=ordenes.filter(o=>o.estado!=='completada'&&o.estado!=='entregada').length;
  const margen=ingNetos>0?(utilidad/ingNetos*100).toFixed(1):0;

  content.innerHTML=`
  <div class="section-title">Dashboard General</div>
  <div class="section-sub">${fechaLegible(today())} \u2014 Usuario: <strong>${sesionActual?.nombre}</strong> <span class="badge badge-${sesionActual?.perfil==='admin'?'red':sesionActual?.perfil==='supervisor'?'amber':'blue'}">${PERFILES[sesionActual?.perfil]?.label||''}</span></div>
  <div class="stat-grid">
    <div class="stat-card stat-green"><div class="stat-label">Facturaci\u00F3n bruta mes</div><div class="stat-value">${fmt(ingBrutos)}</div><div class="stat-sub">${fMes.length} facturas</div></div>
    <div class="stat-card stat-blue"><div class="stat-label">Utilidad neta mes</div><div class="stat-value">${fmt(utilidad)}</div><div class="stat-sub">Margen: ${margen}%</div></div>
    <div class="stat-card stat-amber"><div class="stat-label">IVA generado mes</div><div class="stat-value">${fmt(ivaCob)}</div><div class="stat-sub">Por declarar a SAT</div></div>
    <div class="stat-card ${utilidad>=0?'stat-green':'stat-red'}"><div class="stat-label">Resultado mes</div><div class="stat-value" style="font-size:18px">${utilidad>=0?'\u2713 GANANCIA':'\u2717 P\u00C9RDIDA'}</div></div>
  </div>
  <div class="stat-grid">
    <div class="stat-card ${otsAbiertas>0?'stat-amber':''}"><div class="stat-label">OT abiertas</div><div class="stat-value">${otsAbiertas}</div></div>
    <div class="stat-card ${pendAlerts>0?'stat-red':''}"><div class="stat-label">Alertas</div><div class="stat-value">${pendAlerts}</div></div>
    <div class="stat-card ${stockBajo>0?'stat-red':''}"><div class="stat-label">Stock bajo</div><div class="stat-value">${stockBajo} items</div></div>
    <div class="stat-card"><div class="stat-label">Clientes</div><div class="stat-value" style="color:var(--purple)">${clientes.length}</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div class="card">
      <div class="card-header"><span class="card-title">\u00DAltimas \u00F3rdenes</span><button class="btn btn-sm btn-secondary" onclick="navTo('ordenes')">Ver todas</button></div>
      ${ordenes.slice(-6).reverse().map(o=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)">
        <div><div style="font-size:13px;font-weight:500">${o.noOT||'OT'} \u2014 ${o.placa||''}</div><div style="font-size:11px;color:var(--text2)">${o.tecnico||'\u2014'} | ${fechaLegible(o.fecha)}</div></div>
        <span class="badge badge-${o.estado==='entregada'?'green':o.estado==='completada'?'blue':o.estado==='en_proceso'?'amber':'gray'}">${o.estado||'nuevo'}</span>
      </div>`).join('')||'<div class="text-muted text-center" style="padding:12px;font-size:13px">Sin \u00F3rdenes</div>'}
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Stock cr\u00EDtico</span></div>
      ${[...repuestos,...insumos].filter(i=>(i.stock||0)<=(i.stockMin||5)).slice(0,6).map(i=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)">
          <div style="font-size:13px">${i.nombre}</div>
          <span class="badge badge-red">${i.stock||0}/${i.stockMin||5}</span>
        </div>`).join('')||'<div class="text-muted text-center" style="padding:12px;font-size:13px">Stock OK \u2713</div>'}
    </div>
  </div>`;
}

/* ---- DASHBOARD KPI MEC\u00C1NICOS ---- */
async function renderDashboard_mecanicos(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Solo administradores</div>';return;}
  const empleados=await dbGetAll('empleados');
  const kpiData=await dbGetAll('kpi');
  const ordenes=await dbGetAll('ordenes');
  const mes=today().slice(0,7);
  const mec\u00E1nicos=empleados.filter(e=>['Mec\u00E1nico','Mec\u00E1nico senior','Electricista','Auxiliar'].includes(e.cargo)&&e.activo!==false);

  const metricas=mec\u00E1nicos.map(e=>{
    const kpiMes=kpiData.filter(k=>k.empleadoId===e.id&&k.mes===mes);
    const otsMes=ordenes.filter(o=>o.tecnico===e.nombre&&o.fecha?.startsWith(mes));
    const totalFact=kpiMes.reduce((a,k)=>a+(k.totalFacturado||0),0);
    const otsEntregadas=otsMes.filter(o=>o.estado==='entregada').length;
    const otsTotales=otsMes.length;
    const tasaEfect=otsTotales>0?(otsEntregadas/otsTotales*100).toFixed(0):0;
    const horasTrab=otsMes.reduce((a,o)=>(o.manoObra||[]).reduce((b,m)=>b+(m.horas||0),0)+a,0);
    const salario=e.salarioBase||0;
    const metaFact=salario*3;// Meta: 3x el salario
    const pctMeta=metaFact>0?(totalFact/metaFact*100).toFixed(0):0;
    const bonus=totalFact>metaFact?(totalFact-metaFact)*0.05:0;// 5% sobre excedente
    return{...e,kpiMes,otsMes,totalFact,otsEntregadas,otsTotales,tasaEfect,horasTrab,metaFact,pctMeta,bonus};
  });

  content.innerHTML=`
  <div class="section-title">Dashboard KPI \u2014 Mec\u00E1nicos</div>
  <div class="section-sub">Mes: ${mes} \u2014 Evaluaci\u00F3n de desempe\u00F1o y bonificaciones</div>
  <div class="stat-grid">
    <div class="stat-card"><div class="stat-label">Mec\u00E1nicos activos</div><div class="stat-value" style="color:var(--purple)">${mec\u00E1nicos.length}</div></div>
    <div class="stat-card stat-green"><div class="stat-label">Total facturado (equipo)</div><div class="stat-value">${fmt(metricas.reduce((a,m)=>a+m.totalFact,0))}</div></div>
    <div class="stat-card stat-amber"><div class="stat-label">Bonificaciones a pagar</div><div class="stat-value">${fmt(metricas.reduce((a,m)=>a+m.bonus,0))}</div></div>
    <div class="stat-card"><div class="stat-label">OTs completadas</div><div class="stat-value">${metricas.reduce((a,m)=>a+m.otsEntregadas,0)}</div></div>
  </div>

  ${metricas.map(m=>`
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
      <div>
        <div style="font-size:15px;font-weight:700">${m.nombre}</div>
        <div style="font-size:12px;color:var(--text2)">${m.cargo} \u2014 Salario: ${fmt(m.salarioBase)}/mes</div>
      </div>
      ${m.bonus>0?`<div style="text-align:right"><div style="font-size:11px;color:var(--text3)">Bono desempe\u00F1o</div><div style="font-size:18px;font-weight:700;color:var(--green)">${fmt(m.bonus)}</div></div>`:'<span class="badge badge-gray">Sin bono este mes</span>'}
    </div>
    <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card"><div class="stat-label">Facturado</div><div class="stat-value" style="font-size:16px;color:var(--green)">${fmt(m.totalFact)}</div><div class="stat-sub">Meta: ${fmt(m.metaFact)}</div></div>
      <div class="stat-card"><div class="stat-label">OTs totales</div><div class="stat-value" style="font-size:16px">${m.otsTotales}</div><div class="stat-sub">${m.otsEntregadas} entregadas</div></div>
      <div class="stat-card"><div class="stat-label">Tasa efectividad</div><div class="stat-value" style="font-size:16px;color:var(--${parseInt(m.tasaEfect)>=80?'green':parseInt(m.tasaEfect)>=60?'accent':'red'})">${m.tasaEfect}%</div></div>
      <div class="stat-card"><div class="stat-label">Horas trabajadas</div><div class="stat-value" style="font-size:16px">${m.horasTrab.toFixed(1)}</div><div class="stat-sub">hrs en OTs</div></div>
    </div>
    <div style="margin-top:10px">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span>Progreso meta de facturaci\u00F3n</span><span class="td-mono">${m.pctMeta}%</span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(parseInt(m.pctMeta),100)}%;background:var(--${parseInt(m.pctMeta)>=100?'green':parseInt(m.pctMeta)>=70?'accent':'red'})"></div></div>
    </div>
    ${m.otsMes.slice(-3).length?`<div style="margin-top:10px;font-size:12px;color:var(--text2)">\u00DAltimas OT: ${m.otsMes.slice(-3).map(o=>`<span class="badge badge-gray">${o.noOT}</span>`).join(' ')}</div>`:''}
  </div>`).join('')||'<div class="card text-center text-muted">No hay mec\u00E1nicos registrados</div>'}

  <div class="card">
    <div class="card-title" style="margin-bottom:10px">Criterios de bonificaci\u00F3n</div>
    <div style="font-size:13px;color:var(--text2);line-height:2">
      \u2022 Meta mensual por t\u00E9cnico: <strong>3x el salario base</strong><br>
      \u2022 Bono por excedente: <strong>5% sobre la facturaci\u00F3n que supere la meta</strong><br>
      \u2022 Efectividad m\u00EDnima requerida: <strong>80% de OTs entregadas</strong><br>
      \u2022 Las bonificaciones se incluyen autom\u00E1ticamente en la n\u00F3mina del mes
    </div>
  </div>`;
}

/* ---- DASHBOARD FINANCIERO ---- */
async function renderDashboard_financiero(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Solo administradores</div>';return;}
  const [facturas,costos,activos,empleados,nomina]=await Promise.all([
    dbGetAll('facturas'),dbGetAll('costos'),dbGetAll('activos'),dbGetAll('empleados'),dbGetAll('nomina')
  ]);
  const meses=[];
  for(let i=5;i>=0;i--){const d=new Date();d.setMonth(d.getMonth()-i);meses.push(d.toISOString().slice(0,7));}
  const depMen=activos.reduce((a,ac)=>a+(ac.valorOriginal-(ac.valorResidual||0))/(ac.vidaUtil||5)/12,0);
  const nominaMen=nomina.filter(n=>n.mes===today().slice(0,7)).reduce((a,n)=>a+n.netoPagar,0);

  const datos=meses.map(mes=>{
    const ing=facturas.filter(f=>f.fecha?.startsWith(mes)).reduce((a,f)=>a+(f.subtotal||0),0);
    const ivaCob=facturas.filter(f=>f.fecha?.startsWith(mes)).reduce((a,f)=>a+(f.iva||0),0);
    const costOp=costos.filter(c=>c.fecha?.startsWith(mes)).reduce((a,c)=>a+(c.monto||0),0);
    const nomM=nomina.filter(n=>n.mes===mes).reduce((a,n)=>a+(n.netoPagar||0),0);
    const util=ing-costOp-nomM-depMen;
    const isr=Math.max(util*ISR,0);
    return{mes,ing,ivaCob,costOp,nomM,depMen,util,isr,utilNeta:util-isr};
  });

  const curr=datos[datos.length-1];
  const acumulado=datos.reduce((a,d)=>({ing:a.ing+d.ing,costOp:a.costOp+d.costOp,util:a.util+d.util,utilNeta:a.utilNeta+d.utilNeta}),{ing:0,costOp:0,util:0,utilNeta:0});

  content.innerHTML=`
  <div class="section-title">Dashboard Financiero</div>
  <div class="section-sub">Estado financiero integral \u2014 \u00FAltimos 6 meses</div>

  <div class="stat-grid">
    <div class="stat-card stat-green"><div class="stat-label">Ingresos netos mes</div><div class="stat-value">${fmt(curr.ing)}</div></div>
    <div class="stat-card stat-red"><div class="stat-label">Costos operativos</div><div class="stat-value">${fmt(curr.costOp+curr.nomM+curr.depMen)}</div><div class="stat-sub">Op + N\u00F3mina + Dep.</div></div>
    <div class="stat-card ${curr.util>=0?'stat-green':'stat-red'}"><div class="stat-label">Utilidad antes ISR</div><div class="stat-value">${fmt(curr.util)}</div></div>
    <div class="stat-card stat-amber"><div class="stat-label">ISR estimado mes</div><div class="stat-value">${fmt(curr.isr)}</div><div class="stat-sub">25% s/utilidad</div></div>
  </div>

  <div class="card">
    <div class="card-title" style="margin-bottom:12px">Estado de Resultados \u2014 6 meses</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Mes</th><th class="td-right">Ingresos netos</th><th class="td-right">Costos op.</th><th class="td-right">N\u00F3mina</th><th class="td-right">Depreciaci\u00F3n</th><th class="td-right">Util. bruta</th><th class="td-right">ISR 25%</th><th class="td-right">Util. neta</th><th class="td-right">Margen</th></tr></thead>
      <tbody>
        ${datos.map(d=>`<tr>
          <td class="td-mono">${d.mes}</td>
          <td class="td-mono td-right text-green">${fmt(d.ing)}</td>
          <td class="td-mono td-right text-red">${fmt(d.costOp)}</td>
          <td class="td-mono td-right text-red">${fmt(d.nomM)}</td>
          <td class="td-mono td-right text-amber">${fmt(d.depMen)}</td>
          <td class="td-mono td-right">${fmt(d.util)}</td>
          <td class="td-mono td-right">${fmt(d.isr)}</td>
          <td class="td-mono td-right" style="font-weight:700;color:var(--${d.utilNeta>=0?'green':'red'})">${fmt(d.utilNeta)}</td>
          <td class="td-mono td-right">${d.ing>0?((d.utilNeta/d.ing)*100).toFixed(1):0}%</td>
        </tr>`).join('')}
        <tr style="background:var(--bg3);font-weight:700">
          <td>ACUMULADO</td>
          <td class="td-mono td-right text-green">${fmt(acumulado.ing)}</td>
          <td class="td-mono td-right" colspan="3"></td>
          <td class="td-mono td-right">${fmt(acumulado.util)}</td>
          <td class="td-mono td-right"></td>
          <td class="td-mono td-right" style="color:var(--${acumulado.utilNeta>=0?'green':'red'})">${fmt(acumulado.utilNeta)}</td>
          <td class="td-mono td-right">${acumulado.ing>0?((acumulado.utilNeta/acumulado.ing)*100).toFixed(1):0}%</td>
        </tr>
      </tbody>
    </table></div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div class="card">
      <div class="card-title" style="margin-bottom:12px">Estructura de costos (mes actual)</div>
      ${[['Costos operativos',curr.costOp],['N\u00F3mina',curr.nomM],['Depreciaci\u00F3n activos',curr.depMen],['ISR estimado',curr.isr]].map(([k,v])=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);font-size:13px">
          <span>${k}</span><span class="td-mono text-red">${fmt(v)}</span>
        </div>`).join('')}
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-weight:700;font-size:14px">
        <span>Total costos:</span><span class="td-mono text-red">${fmt(curr.costOp+curr.nomM+curr.depMen+curr.isr)}</span>
      </div>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:12px">ISR Trimestral proyectado</div>
      ${[0,1,2,3].map(t=>{
        const tDatos=datos.slice(Math.max(0,t*1),Math.max(0,t*1)+3);
        const utilTrim=tDatos.reduce((a,d)=>a+d.util,0);
        const isrTrim=Math.max(utilTrim*ISR,0);
        return`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:13px">Trimestre ${t+1}</span>
          <div style="text-align:right"><div class="td-mono text-amber">${fmt(isrTrim)}</div><div style="font-size:11px;color:var(--text3)">Base: ${fmt(utilTrim)}</div></div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

/* ---- M\u00D3DULOS FINANCIEROS RESTANTES ---- */

async function registrarPlanillaMensual() {
  var empleados = await dbGetAll('empleados');
  var activos = empleados.filter(function(e){ return e.activo !== false; });
  if (!activos.length) { toast('No hay empleados activos','amber'); return; }
  var mes = today().slice(0,7);
  var costos = await dbGetAll('costos');
  var yaRegistrado = costos.some(function(c){ return c.categoria==='Planilla' && (c.fecha||'').startsWith(mes); });
  if (yaRegistrado && !confirm('Ya existe planilla para este mes. ¿Registrar de nuevo?')) return;
  var totalSueldos = 0, totalIGSS = 0;
  for (var i=0; i<activos.length; i++) {
    var e = activos[i];
    var sal = e.salarioBase || 0;
    var bonifDecr = 250;
    var descIGSS = sal * 0.0483;
    var neto = sal + bonifDecr + (e.bonificacionAdicional||0) - descIGSS - (e.descuentoAdicional||0);
    totalSueldos += neto;
    totalIGSS += sal * 0.1267;
  }
  var totalProvision = 0, totalIRTRA = 0, totalINTECAP = 0;
  for (var j=0; j<activos.length; j++) {
    var det = calcDetalleEmpleado(activos[j]);
    totalProvision += det.provBono14 + det.provAguinal + det.provIndem + det.provVac;
    totalIRTRA    += det.irtra;
    totalINTECAP  += det.intecap;
  }
  await dbAdd('costos',{fecha:today(),tipo:'Planilla mensual',
    descripcion:'Sueldos netos — '+activos.length+' empleados — '+mes,
    monto:parseFloat(totalSueldos.toFixed(2)),
    categoria:'Planilla', pagado:true, createdAt:nowTs(), updatedAt:nowTs()});
  await dbAdd('costos',{fecha:today(),tipo:'IGSS patronal',
    descripcion:'Cuota patronal IGSS 12.67% — '+mes,
    monto:parseFloat(totalIGSS.toFixed(2)),
    categoria:'Planilla', pagado:false, createdAt:nowTs(), updatedAt:nowTs()});
  await dbAdd('costos',{fecha:today(),tipo:'IRTRA + INTECAP',
    descripcion:'IRTRA 1% + INTECAP 1% — '+mes,
    monto:parseFloat((totalIRTRA+totalINTECAP).toFixed(2)),
    categoria:'Planilla', pagado:false, createdAt:nowTs(), updatedAt:nowTs()});
  await dbAdd('costos',{fecha:today(),tipo:'Provisiones laborales',
    descripcion:'Prov. Bono14 + Aguinaldo + Indem + Vac — '+mes,
    monto:parseFloat(totalProvision.toFixed(2)),
    categoria:'Provisiones', pagado:false, createdAt:nowTs(), updatedAt:nowTs()});
  var costoTotal = totalSueldos + totalIGSS + totalIRTRA + totalINTECAP + totalProvision;
  await logAuditoria('PLANILLA','costos','Planilla completa Q'+costoTotal.toFixed(2),{mes:mes});
  toast('Planilla registrada. Costo total empresa: Q ' + costoTotal.toFixed(2));
  await navTo('costos');
}

async function renderCostos(content,actions){
  if(!adminOSupervisor()){content.innerHTML='<div class="alert alert-red">Sin acceso</div>';return;}
  const costos=await dbGetAll('costos');
  const empleados=await dbGetAll('empleados');
  costos.sort((a,b)=>(a.fecha||'')<(b.fecha||'')?1:-1);
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalCosto()">+ Registrar costo</button><button class="btn btn-secondary" onclick="registrarPlanillaMensual()" style="margin-left:6px">💰 Registrar planilla</button>`;
  const mes=today().slice(0,7);
  const cosMes=costos.filter(c=>c.fecha?.startsWith(mes));
  const totalMes=cosMes.reduce((a,c)=>a+(c.monto||0),0);

  // Calcular nómina real del mes
  const activos=empleados.filter(e=>e.activo!==false);
  let totalNetoEmpleados=0, totalIGSSPatrono=0, totalIRTRA=0, totalINTECAP=0, totalProvisiones=0;
  activos.forEach(e=>{
    const det=calcDetalleEmpleado(e);
    totalNetoEmpleados+=det.neto;
    totalIGSSPatrono+=det.igssPatrono;
    totalIRTRA+=det.irtra;
    totalINTECAP+=det.intecap;
    totalProvisiones+=det.provBono14+det.provAguinal+det.provIndem+det.provVac;
  });
  const costoTotalNomina=totalNetoEmpleados+totalIGSSPatrono+totalIRTRA+totalINTECAP+totalProvisiones;

  // Desglose por categoría del mes
  const porCategoria={};
  cosMes.forEach(c=>{
    const cat=c.categoria||'Otro';
    porCategoria[cat]=(porCategoria[cat]||0)+(c.monto||0);
  });

  const catRows=Object.entries(porCategoria).sort((a,b)=>b[1]-a[1]).map(([cat,monto])=>
    `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px">
      <span style="color:var(--text2)">${cat}</span>
      <span style="font-family:var(--font-mono);font-weight:600">${fmt(monto)}</span>
    </div>`).join('');

  content.innerHTML=`
  <div class="section-title">Costos Operativos y Administrativos</div>
  <div class="section-sub">Resumen del mes: <strong class="text-red">${mes}</strong></div>

  <!-- KPIs costos del mes -->
  <div class="stat-grid" style="grid-template-columns:repeat(auto-fit,minmax(155px,1fr));margin-bottom:16px">
    <div class="stat-card stat-red"><div class="stat-label">Total gastos del mes</div><div class="stat-value">${fmt(totalMes)}</div><div class="stat-sub">${mes}</div></div>
    <div class="stat-card stat-amber"><div class="stat-label">Nómina (${activos.length} empleados)</div><div class="stat-value">${fmt(totalNetoEmpleados)}</div><div class="stat-sub">Neto a pagar + bonif.</div></div>
    <div class="stat-card stat-red"><div class="stat-label">IGSS Patronal 12.67%</div><div class="stat-value">${fmt(totalIGSSPatrono)}</div><div class="stat-sub">Cuota patronal</div></div>
    <div class="stat-card"><div class="stat-label">IRTRA + INTECAP 2%</div><div class="stat-value">${fmt(totalIRTRA+totalINTECAP)}</div><div class="stat-sub">Aportaciones obligatorias</div></div>
    <div class="stat-card stat-blue"><div class="stat-label">Provisiones laborales</div><div class="stat-value">${fmt(totalProvisiones)}</div><div class="stat-sub">Bono14·Aguinaldo·Indem·Vac</div></div>
    <div class="stat-card" style="background:var(--bg2);border:2px solid var(--accent)"><div class="stat-label" style="color:var(--accent)">Costo real empresa/mes</div><div class="stat-value" style="font-size:16px;color:var(--accent)">${fmt(costoTotalNomina)}</div><div class="stat-sub">Nómina + cargas + provisiones</div></div>
  </div>

  <!-- Desglose por categoría + tabla -->
  <div style="display:grid;grid-template-columns:280px 1fr;gap:16px">
    <div class="card" style="padding:14px">
      <div class="card-title" style="margin-bottom:10px;font-size:12px">Gastos del mes por categoría</div>
      ${catRows||'<div style="color:var(--text3);font-size:12px">Sin gastos registrados</div>'}
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;font-weight:700;margin-top:4px;color:var(--red)">
        <span>TOTAL</span><span style="font-family:var(--font-mono)">${fmt(totalMes)}</span>
      </div>
    </div>
    <div class="card" style="padding:10px">
      <div class="table-wrap"><table>
      <thead><tr><th>Fecha</th><th>Categor\u00EDa</th><th>Descripci\u00F3n</th><th class="td-right">Monto</th><th>Acciones</th></tr></thead>
      <tbody>
        ${costos.filter(c=>(!c.fuenteSAT||c.categoriasSAT)&&!c.esViaticoDuplicado).map(c=>`<tr>
          <td style="font-size:12px">${fechaLegible(c.fecha)}</td>
          <td><span class="badge badge-gray" style="font-size:10px">${c.categoria||'\u2014'}</span>${c.recurrente?'<span class="badge badge-blue" style="font-size:10px;margin-left:2px">R</span>':''}</td>
          <td style="font-size:12px">${c.descripcion||'\u2014'}</td>
          <td class="td-mono td-right text-red" style="font-weight:600">${fmt(c.monto)}</td>
          <td><div class="flex gap-1">
            <button class="btn btn-sm btn-secondary" onclick="modalCosto(${c.id})">\u270F</button>
            ${soloAdmin()?`<button class="btn btn-sm btn-danger" onclick="eliminarCosto(${c.id})">\u2715</button>`:''}
          </div></td>
        </tr>`).join('')||'<tr><td colspan="5" class="text-center text-muted" style="padding:20px">Sin costos registrados</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}

async function modalCosto(id=null){
  const c=id?await dbGet('costos',id):{};
  const cats=['Salarios','Alquiler','Servicios p\u00FAblicos','Herramientas','Repuestos (compra)','Marketing','Combustible','Seguros','Administrativo','Capacitaci\u00F3n','Mantenimiento local','Otro'];
  openModal('modalCosto',id?'Editar Costo':'Registrar Costo',`
    <div class="form-row form-row-2">
      <div class="form-group"><label>Fecha *</label><input id="co_fecha" type="date" value="${c.fecha||today()}"></div>
      <div class="form-group"><label>Categor\u00EDa *</label><select id="co_cat">${cats.map(cat=>`<option value="${cat}" ${c.categoria===cat?'selected':''}>${cat}</option>`).join('')}</select></div>
    </div>
    <div class="form-group"><label>Descripci\u00F3n *</label><input id="co_desc" value="${c.descripcion||''}" placeholder="Descripci\u00F3n del gasto"></div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Monto (Q) *</label><input id="co_monto" type="number" value="${c.monto||''}" step="0.01"></div>
      <div class="form-group"><label>Proveedor / Beneficiario</label><input id="co_prov" value="${c.proveedor||''}"></div>
      <div class="form-group"><label>No. comprobante / factura</label><input id="co_comp" value="${c.comprobante||''}"></div>
    </div>
    <div class="form-group"><label><input type="checkbox" id="co_rec" ${c.recurrente?'checked':''} style="width:auto;margin-right:6px"> Gasto recurrente mensual</label></div>
  `,async()=>{
    const monto=parseFloat(document.getElementById('co_monto').value)||0;
    if(!monto){toast('Monto requerido','red');return;}
    const obj={fecha:document.getElementById('co_fecha').value,categoria:document.getElementById('co_cat').value,
      descripcion:document.getElementById('co_desc').value,monto,
      proveedor:document.getElementById('co_prov').value,
      comprobante:document.getElementById('co_comp').value,
      recurrente:document.getElementById('co_rec').checked,updatedAt:nowTs()};
    if(id){obj.id=id;await dbPut('costos',obj);}else{obj.createdAt=nowTs();await dbAdd('costos',obj);}
    closeModal('modalCosto');toast(id?'Actualizado':'Registrado');await navTo('costos');
  });
}
async function eliminarCosto(id){if(!soloAdmin())return;if(!confirm('\u00BFEliminar?'))return;await dbDelete('costos',id);await navTo('costos');}

async function renderActivos(content,actions){
  const activos=await dbGetAll('activos');
  actions.innerHTML=soloAdmin()?`<button class="btn btn-primary" onclick="modalActivo()">+ Nuevo activo</button>`:'';
  const depTotal=activos.reduce((a,ac)=>a+(ac.valorOriginal-(ac.valorResidual||0))/(ac.vidaUtil||5)/12,0);
  content.innerHTML=`
  <div class="section-title">Activos & Depreciaci\u00F3n</div>
  <div class="section-sub">Depreciaci\u00F3n mensual total: <strong class="text-amber">${fmt(depTotal)}</strong></div>
  <div class="card" style="padding:10px"><div class="table-wrap"><table>
    <thead><tr><th>Activo</th><th>Tipo</th><th>Adquisici\u00F3n</th><th>Valor orig.</th><th>Vida \u00FAtil</th><th>Dep. anual</th><th>Valor actual</th><th>Depreciado</th>${soloAdmin()?'<th>Acciones</th>':''}</tr></thead>
    <tbody>
      ${activos.map(a=>{
        const anos=a.fechaAdquisicion?Math.floor((new Date()-new Date(a.fechaAdquisicion+'T00:00:00'))/(365.25*864e5)):0;
        const depAno=(a.valorOriginal-(a.valorResidual||0))/(a.vidaUtil||5);
        const depAcum=Math.min(depAno*anos,a.valorOriginal-(a.valorResidual||0));
        const valAct=Math.max(a.valorOriginal-depAcum,a.valorResidual||0);
        const pct=a.valorOriginal>0?((depAcum/a.valorOriginal)*100).toFixed(0):0;
        return`<tr>
          <td><strong>${a.nombre}</strong><div style="font-size:11px;color:var(--text3)">${a.serie||''}</div></td>
          <td><span class="badge badge-${a.tipo==='vehiculo'?'blue':a.tipo==='maquina'?'amber':'gray'}">${a.tipo}</span></td>
          <td style="font-size:11px">${fechaLegible(a.fechaAdquisicion)}</td>
          <td class="td-mono">${fmt(a.valorOriginal)}</td>
          <td class="td-mono">${a.vidaUtil} a\u00F1os</td>
          <td class="td-mono text-amber">${fmt(depAno)}</td>
          <td class="td-mono ${valAct<a.valorOriginal*0.2?'text-red':'text-green'}">${fmt(valAct)}</td>
          <td><div class="dep-bar" style="width:70px"><div class="dep-fill" style="width:${pct}%;background:var(--${parseInt(pct)>80?'red':'accent'})"></div></div> <span style="font-size:10px;font-family:var(--font-mono)">${pct}%</span></td>
          ${soloAdmin()?`<td><div class="flex gap-1"><button class="btn btn-sm btn-secondary" onclick="modalActivo(${a.id})">\u270F</button><button class="btn btn-sm btn-danger" onclick="eliminarActivo(${a.id})">\u2715</button></div></td>`:''}
        </tr>`;
      }).join('')||'<tr><td colspan="9" class="text-center text-muted" style="padding:20px">Sin activos</td></tr>'}
    </tbody>
  </table></div></div>`;
}

async function modalActivo(id=null){
  const a=id?await dbGet('activos',id):{};
  openModal('modalActivo',id?'Editar Activo':'Registrar Activo',`
    <div class="form-row form-row-2">
      <div class="form-group"><label>Nombre *</label><input id="ac_nom" value="${a.nombre||''}" placeholder="Elevador hidr\u00E1ulico, Esc\u00E1ner OBD2..."></div>
      <div class="form-group"><label>Tipo</label>
        <select id="ac_tipo"><option value="herramienta" ${a.tipo==='herramienta'?'selected':''}>Herramienta</option><option value="maquina" ${a.tipo==='maquina'?'selected':''}>M\u00E1quina/Equipo</option><option value="vehiculo" ${a.tipo==='vehiculo'?'selected':''}>Veh\u00EDculo</option><option value="mobiliario">Mobiliario</option><option value="electronico">Electr\u00F3nico</option></select>
      </div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Fecha adquisici\u00F3n</label><input id="ac_fecha" type="date" value="${a.fechaAdquisicion||today()}"></div>
      <div class="form-group"><label>Vida \u00FAtil (a\u00F1os)</label><input id="ac_vida" type="number" value="${a.vidaUtil||5}" min="1" max="50" oninput="calcDepreciacion()"></div>
      <div class="form-group"><label>No. serie</label><input id="ac_serie" value="${a.serie||''}"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Valor original (Q) *</label><input id="ac_valor" type="number" value="${a.valorOriginal||''}" step="0.01" oninput="calcDepreciacion()"></div>
      <div class="form-group"><label>Valor residual (Q)</label><input id="ac_residual" type="number" value="${a.valorResidual||0}" step="0.01" oninput="calcDepreciacion()"></div>
    </div>
    <div id="dep_preview" style="background:var(--bg3);border-radius:6px;padding:10px;margin-top:4px"></div>
    
  `,async()=>{
    const nom=document.getElementById('ac_nom').value.trim();
    const val=parseFloat(document.getElementById('ac_valor').value)||0;
    if(!nom||!val){toast('Nombre y valor requeridos','red');return;}
    const obj={nombre:nom,tipo:document.getElementById('ac_tipo').value,
      fechaAdquisicion:document.getElementById('ac_fecha').value,
      vidaUtil:parseInt(document.getElementById('ac_vida').value)||5,
      valorOriginal:val,valorResidual:parseFloat(document.getElementById('ac_residual').value)||0,
      serie:document.getElementById('ac_serie').value,updatedAt:nowTs()};
    if(id){obj.id=id;await dbPut('activos',obj);}else{obj.createdAt=nowTs();await dbAdd('activos',obj);}
    closeModal('modalActivo');toast('Activo registrado');await navTo('activos');
  });
  setTimeout(calcDepreciacion,50);
}

function calcDepreciacion(){
  const v=parseFloat(document.getElementById('ac_valor')?.value)||0;
  const r=parseFloat(document.getElementById('ac_residual')?.value)||0;
  const vida=parseInt(document.getElementById('ac_vida')?.value)||5;
  const da=(v-r)/vida;const el=document.getElementById('dep_preview');
  if(el&&v>0)el.innerHTML=`<div style="display:flex;gap:20px;font-size:13px"><span>Dep. anual: <strong class="text-amber">${fmt(da)}</strong></span><span>Mensual: <strong>${fmt(da/12)}</strong></span><span>Diaria: <strong>${fmt(da/365)}</strong></span></div>`;
}
async function eliminarActivo(id){if(!soloAdmin())return;if(!confirm('\u00BFEliminar?'))return;await dbDelete('activos',id);await navTo('activos');}

async function renderRentabilidad(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Solo administradores</div>';return;}
  await renderDashboard_financiero(content,actions);
}




async function exportarBackup(){
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

async function cargarUsuariosLicencia() {
  var panel = document.getElementById('lic_usuarios_panel');
  if (!panel) return;
  var usuarios = await dbGetAll('usuarios');
  var activos = usuarios.filter(function(u){ return u.activo !== false && !u.esDemo; });
  var tallerInfo = getInfoTaller();
  if (!activos.length) {
    panel.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:8px">No hay usuarios registrados.</div>';
    return;
  }
  var perfilLabel = {admin:'Administrador', supervisor:'Supervisor', operador:'Operador'};
  panel.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">'
    + activos.map(function(u) {
        return '<div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;display:flex;align-items:center;gap:10px">'
          + '<div style="width:36px;height:36px;border-radius:50%;background:var(--accent-dim);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">&#128100;</div>'
          + '<div><div style="font-weight:600;font-size:13px">' + u.nombre + '</div>'
          + '<div style="font-size:11px;color:var(--text3)">@' + u.username + '</div>'
          + '<span class="badge badge-' + (u.perfil==='admin'?'red':u.perfil==='supervisor'?'amber':'blue') + '" style="font-size:10px">' + (perfilLabel[u.perfil]||u.perfil) + '</span>'
          + '</div></div>';
      }).join('')
    + '</div>'
    + '<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;color:var(--text3)">'
    + 'ID de taller: <span style="font-family:var(--font-mono)">' + tallerInfo.tallerId + '</span>'
    + ' &nbsp;|&nbsp; ' + activos.length + ' usuario(s) activos'
    + '</div>';
}

async function mostrarInfoTallerModal() {
  var tallerInfo = getInfoTaller();
  var usuarios = await dbGetAll('usuarios');
  var activos = usuarios.filter(function(u){ return u.activo !== false && !u.esDemo; });
  openModal('infoTaller', 'Informacion del taller',
    '<div style="font-size:13px;line-height:2.2">'
    + '<div style="display:grid;grid-template-columns:1fr 2fr;gap:4px">'
    + '<span style="color:var(--text3)">Taller:</span><strong>' + tallerInfo.nombre + '</strong>'
    + '<span style="color:var(--text3)">NIT:</span><span>' + tallerInfo.nit + '</span>'
    + '<span style="color:var(--text3)">Plan:</span><span class="badge badge-green">' + tallerInfo.plan.toUpperCase() + '</span>'
    + '<span style="color:var(--text3)">ID instalacion:</span><span style="font-family:var(--font-mono);font-size:11px">' + getInstallId() + '</span>'
    + '<span style="color:var(--text3)">ID taller:</span><span style="font-family:var(--font-mono);font-size:11px">' + tallerInfo.tallerId + '</span>'
    + '<span style="color:var(--text3)">Base de datos:</span><span style="font-family:var(--font-mono);font-size:11px">' + getDBName() + '</span>'
    + '<span style="color:var(--text3)">Usuarios activos:</span><strong>' + activos.length + '</strong>'
    + (tallerInfo.esCorporacion ? '<span style="color:var(--text3)">Sub-talleres:</span><strong>' + tallerInfo.subTalleres.length + '</strong>' : '')
    + '</div>'
    + '<div style="margin-top:14px;font-size:11px;color:var(--text3);background:var(--bg3);padding:10px;border-radius:6px">'
    + 'Cada taller tiene su propia base de datos aislada. Comparte el ID de instalacion al adquirir usuarios adicionales.'
    + '</div>'
    + '</div>',
    function(){}, false
  );
}

async function cargarDatosDemostracion(){
  const u=await dbGetAll('usuarios');
  // Garantizar que el usuario demo exista cuando no hay licencia activa
  if(!estaActivo()){
    const demoExiste=u.find(function(x){return x.username==='demo';});
    if(!demoExiste){
      await dbAdd('usuarios',{nombre:'Demo Admin',username:'demo',passwordHash:hashSimple('demo123'),
        esDemo:true,perfil:'admin',email:'admin@taller.com',activo:true,createdAt:nowTs()});
    }
  }
  if(u.length>0)return;
  // Primera vez: crear usuarios de ejemplo adicionales
  await dbAdd('usuarios',{nombre:'Supervisor Taller',username:'supervisor',passwordHash:hashSimple('super123'),
    perfil:'supervisor',email:'supervisor@taller.com',activo:true,createdAt:nowTs()});
  await dbAdd('usuarios',{nombre:'Operador 1',username:'operador',passwordHash:hashSimple('oper123'),
    perfil:'operador',email:'operador@taller.com',activo:true,createdAt:nowTs()});
  // Empleados demo
  await dbAdd('empleados',{nombre:'Carlos M\u00E9ndez L\u00F3pez',cargo:'Mec\u00E1nico senior',salarioBase:5500,dpi:'1234567890101',fechaIngreso:'2021-03-15',telefono:'+502 5555-1111',activo:true,tipoContrato:'indefinido',createdAt:nowTs()});
  await dbAdd('empleados',{nombre:'Mario Ju\u00E1rez Garc\u00EDa',cargo:'Mec\u00E1nico',salarioBase:4200,dpi:'2345678901012',fechaIngreso:'2022-06-01',telefono:'+502 5555-2222',activo:true,tipoContrato:'indefinido',createdAt:nowTs()});
  // Clientes demo
  await dbAdd('clientes',{nombre:'Juan Carlos P\u00E9rez',nit:'1234567-8',telefono:'+502 5555-1234',email:'jcperez@email.com',whatsapp:'+502 5555-1234',tipo:'persona',createdAt:nowTs()});
  await dbAdd('clientes',{nombre:'Transportes Garc\u00EDa S.A.',nit:'9876543-2',telefono:'+502 4444-5678',email:'admin@tgarcia.com.gt',tipo:'empresa',empresa:'Transportes Garc\u00EDa S.A.',createdAt:nowTs()});
  // Veh\u00EDculos demo
  await dbAdd('vehiculos',{clienteId:1,clienteNombre:'Juan Carlos P\u00E9rez',placa:'P-123ABC',marca:'Toyota',modelo:'Hilux',anio:2018,tipoVehiculo:'Pickup',cilindros:4,cilindraje:2700,combustibleTipo:'gasolina',km:85000,tipoServicio:'Cambio de aceite',proximoServicio:addDays(today(),8),color:'Blanco',createdAt:nowTs()});
  await dbAdd('vehiculos',{clienteId:2,clienteNombre:'Transportes Garc\u00EDa S.A.',placa:'C-456XYZ',marca:'Kenworth',modelo:'T680',anio:2020,tipoVehiculo:'Cabezal',cilindros:6,cilindraje:12900,combustibleTipo:'diesel',km:210000,tipoServicio:'Mantenimiento preventivo',proximoServicio:addDays(today(),3),color:'Azul',createdAt:nowTs()});
  // Repuestos demo
  await dbAdd('repuestos',{codigo:'FLT-001',nombre:'Filtro de aceite Toyota Hilux',categoria:'Filtros',tiposVehiculo:['Pickup'],stock:8,stockMin:5,costo:45,precio:85,margen:(85-45)/85,proveedor:'SERVIREPUESTOS',tipo:'repuesto',createdAt:nowTs()});
  await dbAdd('repuestos',{codigo:'FRN-002',nombre:'Pastillas de freno delanteras',categoria:'Frenos',tiposVehiculo:['Sedan','Pickup','Camioneta/SUV'],stock:3,stockMin:5,costo:180,precio:320,margen:(320-180)/320,tipo:'repuesto',createdAt:nowTs()});
  // Insumos demo
  await dbAdd('insumos',{nombre:'Aceite 20W-50 Sint\u00E9tico',categoria:'Aceites',tiposVehiculo:['Pickup','Sedan','Camioneta/SUV'],stock:12,stockMin:10,costo:68,precio:120,margen:(120-68)/120,unidad:'litro',proveedor:'LUBRICANTES CENTRAL',tipo:'insumo',createdAt:nowTs()});
  await dbAdd('insumos',{nombre:'Aceite 15W-40 Heavy Duty Diesel',categoria:'Aceites',tiposVehiculo:['Cami\u00F3n','Cabezal','Bus'],stock:20,stockMin:10,costo:82,precio:150,margen:(150-82)/150,unidad:'litro',proveedor:'LUBRICANTES CENTRAL',tipo:'insumo',createdAt:nowTs()});
  // Proveedor demo
  await dbAdd('proveedores',{empresa:'SERVIREPUESTOS Guatemala S.A.',nit:'5432100-1',categoria:'Repuestos',contacto:'Roberto Lemus',telefono:'+502 2222-5555',email:'ventas@servirepuestos.com.gt',calificacion:'5',plazoCredito:30,createdAt:nowTs()});
  // Costos demo
  await dbAdd('costos',{fecha:today(),categoria:'Salarios',descripcion:'N\u00F3mina mensual mec\u00E1nicos',monto:9700,recurrente:true,createdAt:nowTs()});
  await dbAdd('costos',{fecha:today(),categoria:'Alquiler',descripcion:'Alquiler del local',monto:3500,recurrente:true,createdAt:nowTs()});
  // Activos demo
  await dbAdd('activos',{nombre:'Elevador hidr\u00E1ulico 4 toneladas',tipo:'maquina',fechaAdquisicion:'2021-01-15',vidaUtil:10,valorOriginal:45000,valorResidual:5000,createdAt:nowTs()});
  await dbAdd('activos',{nombre:'Esc\u00E1ner OBD2 profesional Launch',tipo:'electronico',fechaAdquisicion:'2022-06-01',vidaUtil:5,valorOriginal:12000,valorResidual:1000,createdAt:nowTs()});
  await dbAdd('activos',{nombre:'Compresor de aire 60 galones',tipo:'maquina',fechaAdquisicion:'2020-03-10',vidaUtil:8,valorOriginal:8500,valorResidual:500,createdAt:nowTs()});
  // Config
  await dbPut('config',{key:'taller',nombre:'TallerPro GT',nit:'1234567-8',telefono:'+502 2222-3333',email:'info@tallerpro.com.gt',direccion:'Zona 12, Guatemala, Guatemala',tarifaHora:150,margenMin:20,piePagina:'Gracias por elegirnos. Garant\u00EDa sobre mano de obra: 30 d\u00EDas.',updatedAt:nowTs()});
}

async function iniciarApp(){
  cargarTemaGuardado();
  initSecurity();
  await cargarRegimen();
  await actualizarSidebarEmpresa();
  actualizarTopbarUsuario();
  // Cargar logo guardado
  (function(){var ld=localStorage.getItem('tpgt_logo');var img=document.getElementById('sidebar-logo-img');if(img&&ld){img.src=ld;img.style.display='block';}})();
  const alertas=await dbGetAll('alertas');
  const pending=alertas.filter(a=>!a.vista).length;
  await renderNav(pending);
  // Topbar usuario info
  var tui = document.getElementById('topbar-user-info');
  var tun = document.getElementById('topbar-username');
  if (tui && sesionActual) {
    tui.style.display = 'flex';
    var perfilLabels2 = {admin:'Admin',supervisor:'Supervisor',operador:'Operador'};
    if (tun) tun.textContent = (sesionActual.nombre||sesionActual.username) + ' (' + (perfilLabels2[sesionActual.perfil]||sesionActual.perfil) + ')';
  }
  await navTo('dashboard');
}


/* ================================================================
   M\u00D3DULO CONTABILIDAD / ASIENTOS CONTABLES
   ================================================================ */
