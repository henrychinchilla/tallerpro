/* TallerPro GT — auth.js */

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
  operador:{label:'Operador',color:'blue',nivel:1,permisos:['ordenes','clientes','vehiculos','recepciones','repuestos','insumos','alertas']}-
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

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert('Error de login: ' + error.message);
    return;
  }

  console.log('Login exitoso', data.user);

  // aquí puedes redirigir
  window.location.href = 'dashboard.html';
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
async function login() {
  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert('Error: ' + error.message);
    return;
  }

  // Obtener perfil del usuario
  const user = data.user;

  const { data: perfil, error: errPerfil } = await supabase
    .from('tp_usuarios')
    .select('*')
    .eq('id', user.id)
    .single();

  if (errPerfil) {
    alert('No se pudo cargar perfil');
    return;
  }

  console.log('Usuario logueado:', perfil);

  // guarda sesión local
  localStorage.setItem('usuario', JSON.stringify(perfil));

  // redirigir
  window.location.href = 'dashboard.html';
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
