/* TallerPro GT — js/ui.js
   Módulo independiente — cada archivo tiene funciones específicas
   Para editar: modificar solo este archivo y recargar
*/

function renderNav(badgeCount=0){
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
function aplicarTema(nombreTema) {
  var tema = TEMAS[nombreTema];
  if (!tema) return;
  var root = document.documentElement;
  Object.entries(tema).forEach(function(e) {
    if (e[0].startsWith('--')) root.style.setProperty(e[0], e[1]);
  });
  // Guardar por usuario activo (no afecta a otros usuarios)
  var userId = sesionActual ? sesionActual.userId : 'default';
  localStorage.setItem('tpgt_tema_u' + userId, nombreTema);
  // Marcar activo en los botones
  document.querySelectorAll('[data-tema]').forEach(function(el){
    el.style.border = el.dataset.tema === nombreTema ? '2px solid var(--accent)' : '2px solid var(--border)';
  });
  toast('Tema aplicado: ' + (tema.label||nombreTema));
}

function cargarTemaGuardado() {
  var userId = sesionActual ? sesionActual.userId : 'default';
  var t = localStorage.getItem('tpgt_tema_u' + userId);
  if (t && TEMAS[t]) { aplicarTema(t); return; }
  var custom = localStorage.getItem('tpgt_tema_custom_u' + userId);
  if (custom) {
    try {
      var c = JSON.parse(custom);
      Object.entries(c).forEach(function(e){ document.documentElement.style.setProperty(e[0], e[1]); });
    } catch(e) {}
  }
}

function aplicarColoresCustom() {
  var campos = ['--bg','--bg2','--bg3','--accent','--green','--red','--text'];
  campos.forEach(function(v) {
    var el = document.getElementById('tc_' + v.replace('--',''));
    if (el && el.value) document.documentElement.style.setProperty(v, el.value);
  });
  // Guardar como tema custom
  var custom = {};
  campos.forEach(function(v) {
    var el = document.getElementById('tc_' + v.replace('--',''));
    if (el) custom[v] = el.value || getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  });
  localStorage.setItem('tpgt_tema_custom', JSON.stringify(custom));
  toast('Colores personalizados aplicados');
}



function renderSelectorTema() {
  var actual = localStorage.getItem('tpgt_tema') || 'oscuro';
  var html = '<div class="divider"></div>'
    + '<div class="card-title" style="margin-bottom:10px">Tema y colores</div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">'
    + Object.entries(TEMAS).map(function(e){
      var nombre = e[0]; var tema = e[1];
      return '<div onclick="aplicarTema(\''+nombre+'\')" style="cursor:pointer;padding:10px;border-radius:8px;border:2px solid '+(actual===nombre?'var(--accent)':'var(--border)')+';background:'+tema['--bg2']+'">'
        + '<div style="display:flex;gap:5px;margin-bottom:6px">'
        + '<div style="width:16px;height:16px;border-radius:50%;background:'+tema['--accent']+'"></div>'
        + '<div style="width:16px;height:16px;border-radius:50%;background:'+tema['--green']+'"></div>'
        + '<div style="width:16px;height:16px;border-radius:50%;background:'+tema['--red']+'"></div>'
        + '<div style="width:16px;height:16px;border-radius:50%;background:'+tema['--blue']+'"></div>'
        + '</div>'
        + '<div style="font-size:11px;color:'+tema['--text']+'">'+tema.label+'</div>'
        + '</div>';
    }).join('')
    + '</div>'
    + '<div class="card-title" style="margin-bottom:10px">Colores personalizados</div>'
    + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">'
    + [['--bg','Fondo principal'],['--bg2','Fondo secundario'],['--bg3','Fondo tarjetas'],['--accent','Color acento'],['--green','Verde'],['--red','Rojo'],['--text','Texto principal']].map(function(par){
      var varName = par[0]; var label = par[1];
      var current = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      var colorHex = current;
      // Convertir rgb a hex si es necesario
      return '<div class="form-group">'
        + '<label>'+label+'</label>'
        + '<input type="color" id="tc_'+varName.replace('--','')+'" value="'+(colorHex.startsWith('#')?colorHex:'#1a1a1a')+'" style="width:100%;height:36px;padding:2px;border-radius:6px;cursor:pointer">'
        + '</div>';
    }).join('')
    + '</div>'
    + '<button class="btn btn-primary mt-2" onclick="aplicarColoresCustom()">Aplicar colores personalizados</button>';
  return html;
}


function abrirSelectorTema() {
  var actual = sesionActual ? localStorage.getItem('tpgt_tema_u'+sesionActual.userId)||'oscuro' : 'oscuro';
  openModal('temaModal', 'Tema de la interfaz',
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">'
    + Object.entries(TEMAS).map(function(entry) {
      var nombre = entry[0]; var tema = entry[1];
      return '<div data-tema="'+nombre+'" onclick="aplicarTema(this.dataset.tema)" '
        + 'style="cursor:pointer;padding:10px;border-radius:8px;'
        + 'border:2px solid '+(actual===nombre?'var(--accent)':'var(--border)')+';'
        + 'background:'+tema['--bg2']+';user-select:none">'
        + '<div style="display:flex;gap:4px;margin-bottom:6px">'
        + '<div style="width:14px;height:14px;border-radius:50%;background:'+tema['--accent']+'"></div>'
        + '<div style="width:14px;height:14px;border-radius:50%;background:'+tema['--green']+'"></div>'
        + '<div style="width:14px;height:14px;border-radius:50%;background:'+tema['--red']+'"></div>'
        + '</div><div style="font-size:11px;color:'+tema['--text']+'">'+tema.label+'</div></div>';
    }).join('')
    + '</div>'
    + '<div style="font-size:12px;color:var(--text2);margin-bottom:8px">El tema se aplica solo a tu usuario y se mantiene al volver a entrar.</div>',
    function(){ cerrarModal('temaModal'); }, false);
}

// ================================================================
// MODULO EXTRAS: Voucher, ISR anual, Importacion/Exportacion CSV
// ================================================================

// ---- VOUCHER DE PAGO (imprimible) ----
async function imprimirVoucherPago(pagoId) {
  var pagos = await dbGetAll('historial_pagos');
  var pago = pagos.find(function(p){ return p.id === pagoId; });
  if (!pago) { toast('Pago no encontrado','red'); return; }
  var emp = await dbGet('empleados', pago.empleadoId);
  var cfg = await dbGet('config','taller') || {};
  var w = window.open('','_blank');
  var tipos = {nomina:'Nomina Mensual',bono14:'Bono 14 (Decreto 42-92)',aguinaldo:'Aguinaldo (Decreto 76-78)',vacacion:'Pago de Vacaciones',otro:'Pago Varios'};
  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Voucher</title>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:30px}'
    + '.voucher{border:2px solid #111;border-radius:8px;padding:24px;max-width:500px;margin:0 auto}'
    + '.hdr{text-align:center;border-bottom:2px solid #111;padding-bottom:12px;margin-bottom:14px}'
    + '.empresa{font-size:16px;font-weight:900}.subtitulo{font-size:11px;color:#555;margin-top:3px}'
    + '.titulo-doc{font-size:14px;font-weight:700;text-align:center;margin:10px 0;text-transform:uppercase;letter-spacing:1px}'
    + '.fila{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;font-size:12px}'
    + '.fila .lbl{color:#555;font-weight:600}.fila .val{font-weight:700}'
    + '.monto-box{background:#f0f0f0;border-radius:6px;padding:14px;text-align:center;margin:14px 0}'
    + '.monto-total{font-size:22px;font-weight:900}.letras{font-size:10px;color:#555;margin-top:4px}'
    + '.firmas{display:flex;justify-content:space-between;margin-top:40px;gap:30px}'
    + '.firma{border-top:1px solid #333;padding-top:5px;text-align:center;font-size:10px;color:#555;flex:1}'
    + '@media print{body{padding:10px}button{display:none}}</style></head><body>'
    + '<div class="voucher">'
    + '<div class="hdr"><div class="empresa">' + (cfg.nombre||'EMPRESA') + '</div>'
    + '<div class="subtitulo">NIT: ' + (cfg.nit||'---') + ' | ' + (cfg.telefono||'') + '</div></div>'
    + '<div class="titulo-doc">Comprobante de Pago</div>'
    + '<div style="text-align:right;font-size:10px;color:#888;margin-bottom:10px">No. ' + (pago.id||'---') + ' | ' + new Date().toLocaleString('es-GT') + '</div>'
    + '<div class="fila"><span class="lbl">Empleado:</span><span class="val">' + (emp?emp.nombre:pago.empleadoNombre) + '</span></div>'
    + (emp?'<div class="fila"><span class="lbl">DPI:</span><span class="val">' + (emp.dpi||'---') + '</span></div>':'')
    + (emp?'<div class="fila"><span class="lbl">Cargo:</span><span class="val">' + (emp.cargo||'---') + '</span></div>':'')
    + '<div class="fila"><span class="lbl">Tipo de pago:</span><span class="val">' + (tipos[pago.tipo]||pago.tipo) + '</span></div>'
    + '<div class="fila"><span class="lbl">Fecha de pago:</span><span class="val">' + fechaLegible(pago.fecha) + '</span></div>'
    + (pago.periodo?'<div class="fila"><span class="lbl">Periodo cubierto:</span><span class="val">' + pago.periodo + '</span></div>':'')
    + '<div class="fila"><span class="lbl">Forma de pago:</span><span class="val">' + (pago.formaPago||'Transferencia') + '</span></div>'
    + (emp&&emp.bancoCuenta?'<div class="fila"><span class="lbl">Banco:</span><span class="val">' + (emp.bancoCuenta||'---') + ' - ' + (emp.tipoCuentaBanco||'') + '</span></div>':'')
    + (emp&&emp.cuentaBanco?'<div class="fila"><span class="lbl">No. cuenta:</span><span class="val">' + (emp.cuentaBanco||'---') + '</span></div>':'')
    + (pago.notas?'<div class="fila"><span class="lbl">Notas:</span><span class="val">' + pago.notas + '</span></div>':'')
    + '<div class="monto-box"><div class="monto-total">Q ' + parseFloat(pago.monto||0).toFixed(2) + '</div>'
    + '<div class="letras">' + numLetras(pago.monto||0) + '</div></div>'
    + '<div class="firmas">'
    + '<div class="firma">Elaborado por<br><br>' + (cfg.nombre||'---') + '</div>'
    + '<div class="firma">Recibido conforme<br><br>' + (emp?emp.nombre:pago.empleadoNombre) + '</div>'
    + '</div></div></body></html>';
  w.document.write(html);
  w.document.close();
  setTimeout(function(){ w.print(); }, 400);
}

// ---- HISTORIAL DE PAGOS MEJORADO (edicion admin + voucher) ----
async function renderHistorialPagos(content, actions) {
  if (!soloAdmin()) { content.innerHTML='<div class="alert alert-red">Solo administradores</div>'; return; }
  var empleados = await dbGetAll('empleados');
  var pagos = await dbGetAll('historial_pagos');
  var activos = empleados.filter(function(e){ return e.activo !== false; });
  actions.innerHTML = '<button class="btn btn-secondary" onclick="generarPagosMes()">Generar nomina mes</button>'
    + ' <button class="btn btn-primary" onclick="modalRegistrarPago()">+ Registrar pago</button>';

  // Resumen por empleado
  var filas = activos.map(function(e) {
    var pagosEmp = pagos.filter(function(p){ return p.empleadoId === e.id; });
    var ultNomina = pagosEmp.filter(function(p){return p.tipo==='nomina';}).sort(function(a,b){return a.fecha<b.fecha?1:-1;})[0];
    var ultB14    = pagosEmp.filter(function(p){return p.tipo==='bono14';}).sort(function(a,b){return a.fecha<b.fecha?1:-1;})[0];
    var ultAgui   = pagosEmp.filter(function(p){return p.tipo==='aguinaldo';}).sort(function(a,b){return a.fecha<b.fecha?1:-1;})[0];
    var totalPagado = pagosEmp.reduce(function(a,p){return a+(p.monto||0);},0);
    return '<tr>'
      + '<td><strong>'+e.nombre+'</strong><div style="font-size:10px;color:var(--text3)">'+(e.cargo||'')+'</div></td>'
      + '<td class="td-mono">'+fmt(e.salarioBase||0)+'</td>'
      + '<td style="font-size:11px">'+(ultNomina?fechaLegible(ultNomina.fecha)+' Q'+(ultNomina.monto||0).toFixed(0):'<span class="text-muted">---</span>')+'</td>'
      + '<td style="font-size:11px">'+(ultB14?fechaLegible(ultB14.fecha)+' Q'+(ultB14.monto||0).toFixed(0):'<span class="text-muted">---</span>')+'</td>'
      + '<td style="font-size:11px">'+(ultAgui?fechaLegible(ultAgui.fecha)+' Q'+(ultAgui.monto||0).toFixed(0):'<span class="text-muted">---</span>')+'</td>'
      + '<td class="td-mono">'+fmt(totalPagado)+'</td>'
      + '<td><div class="flex gap-1">'
      + '<button class="btn btn-sm btn-blue" onclick="verHistorialEmp('+e.id+')">Historial</button>'
      + '<button class="btn btn-sm btn-green" onclick="modalRegistrarPago('+e.id+')">+ Pago</button>'
      + '</div></td>'
      + '</tr>';
  }).join('');

  // Ultimos pagos con opcion de editar y voucher
  var ultimos = pagos.slice().sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;}).slice(0,30);
  var tipoIcons = {nomina:'$',bono14:'B',aguinaldo:'A',vacacion:'V',otro:'+'};
  var colores = {nomina:'green',bono14:'amber',aguinaldo:'amber',vacacion:'blue',otro:'gray'};
  var filasRecientes = ultimos.map(function(p){
    return '<tr>'
      + '<td>'+fechaLegible(p.fecha)+'</td>'
      + '<td><span class="badge badge-'+(colores[p.tipo]||'gray')+'">'+(tipoIcons[p.tipo]||p.tipo)+'</span> '+(p.descripcion||p.tipo)+'</td>'
      + '<td>'+(p.empleadoNombre||'---')+'</td>'
      + '<td class="td-mono td-right text-green">Q '+(p.monto||0).toFixed(2)+'</td>'
      + '<td style="font-size:10px;color:var(--text3)">'+(p.periodo||'---')+'</td>'
      + '<td><div class="flex gap-1">'
      + '<button class="btn btn-sm btn-secondary" onclick="imprimirVoucherPago('+p.id+')">Voucher</button>'
      + '<button class="btn btn-sm btn-blue" onclick="editarPago('+p.id+')">Editar</button>'
      + '<button class="btn btn-sm btn-danger" onclick="borrarPago('+p.id+')">X</button>'
      + '</div></td>'
      + '</tr>';
  }).join('');

  content.innerHTML = '<div class="section-title">Historial de Pagos</div>'
    + '<div class="section-sub">Nomina, Bono 14 y Aguinaldo | Ciclos segun Decreto 42-92 y 76-78</div>'
    + '<div class="alert alert-blue" style="font-size:11px">'
    + '<strong>Bono 14:</strong> Ciclo 1-jul a 30-jun. Pago: 1-15 julio | '
    + '<strong>Aguinaldo:</strong> Ciclo 1-dic a 30-nov. Pago: 15 diciembre'
    + '</div>'
    + '<div class="card" style="padding:10px"><div class="card-title" style="margin-bottom:8px">Resumen por empleado</div>'
    + '<div class="table-wrap"><table>'
    + '<thead><tr><th>Empleado</th><th>Salario</th><th>Ultima nomina</th><th>Ultimo B14</th><th>Ultimo Agui.</th><th>Total pagado</th><th>Acciones</th></tr></thead>'
    + '<tbody>'+(filas||'<tr><td colspan="7" class="text-center text-muted" style="padding:16px">Sin empleados</td></tr>')+'</tbody></table></div></div>'
    + '<div class="card" style="padding:10px"><div class="card-title" style="margin-bottom:8px">Ultimos 30 pagos registrados</div>'
    + '<div class="table-wrap"><table>'
    + '<thead><tr><th>Fecha</th><th>Tipo</th><th>Empleado</th><th class="td-right">Monto</th><th>Periodo</th><th>Acciones</th></tr></thead>'
    + '<tbody>'+(filasRecientes||'<tr><td colspan="6" class="text-center text-muted" style="padding:16px">Sin pagos</td></tr>')+'</tbody></table></div></div>';
}

async function editarPago(pagoId) {
  if (!soloAdmin()) { toast('Solo administradores','red'); return; }
  var pagos = await dbGetAll('historial_pagos');
  var p = pagos.find(function(x){ return x.id === pagoId; });
  if (!p) return;
  openModal('editPago', 'Editar Pago (solo Admin)',
    '<div class="alert alert-amber" style="font-size:11px">Solo administradores pueden editar registros de pagos.</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Fecha</label><input id="ep_fecha" type="date" value="'+(p.fecha||today())+'"></div>'
    + '<div class="form-group"><label>Monto (Q)</label><input id="ep_monto" type="number" value="'+(p.monto||0)+'" step="0.01"></div>'
    + '</div>'
    + '<div class="form-group"><label>Descripcion</label><input id="ep_desc" value="'+(p.descripcion||'')+'"></div>'
    + '<div class="form-group"><label>Periodo</label><input id="ep_periodo" value="'+(p.periodo||'')+'"></div>'
    + '<div class="form-group"><label>Notas</label><textarea id="ep_notas" style="min-height:50px">'+(p.notas||'')+'</textarea></div>',
    async function() {
      p.fecha = document.getElementById('ep_fecha').value;
      p.monto = parseFloat(document.getElementById('ep_monto').value)||0;
      p.descripcion = document.getElementById('ep_desc').value.trim();
      p.periodo = document.getElementById('ep_periodo').value.trim();
      p.notas = document.getElementById('ep_notas').value.trim();
      p.updatedAt = nowTs(); p.editadoPor = sesionActual?sesionActual.username:'admin';
      await dbPut('historial_pagos', p);
      cerrarModal('editPago'); toast('Pago actualizado');
      await navTo('historial_pagos');
    }, true);
}

async function borrarPago(pagoId) {
  if (!soloAdmin()) { toast('Solo administradores','red'); return; }
  if (!confirm('Eliminar este registro de pago? Esta accion no se puede deshacer.')) return;
  await dbDelete('historial_pagos', pagoId);
  toast('Registro eliminado');
  await navTo('historial_pagos');
}

// ---- ISR EMPRESARIAL ANUAL (Regimen 25%) ----
// Decreto 10-2012, Art. 38: 25% sobre utilidad imponible
// La utilidad imponible = Ingresos - Costos deducibles
// Costos deducibles incluyen: salarios, IGSS patronal, Bono14, Aguinaldo, todos los costos operativos
// Se paga en cuotas trimestrales (Art. 38): abril, julio, octubre, enero



/* ================================================================
   IMPORTAR FACTURAS SAT - CSV del Portal SAT Guatemala
   ================================================================ */

/* ── Helpers para importación de archivos ───────────────────────────────── */
function crearEmpleadoInline(onCreado) {
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

async function abrirMenuUsuario() {
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

async function formEnableGuard() {
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

async
