/* TallerPro GT — js/14_init.js */
/* Generado automáticamente — editar este archivo */

document.addEventListener(evt,resetSesTimer,{passive:true});
  });
  window.addEventListener('beforeunload',function(){
    try{var tx=db.transaction('sesion','readwrite');tx.objectStore('sesion').delete('sesion_actual');}catch(e){}
  });
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){
      if(_sesTimer)clearTimeout(_sesTimer);
      _sesTimer=setTimeout(function(){logout();},SES_TIMEOUT);
    }else{resetSesTimer();}
  });
  resetSesTimer();
}

// ---- NOMINA MEJORADA CON PROVISIONES ----
async function renderNomina(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Solo administradores</div>';return;}
  var empleados=await dbGetAll('empleados');
  var nomina=await dbGetAll('nomina');
  var kpiData=await dbGetAll('kpi');
  var mesActual=today().slice(0,7);
  var nominaMes=nomina.filter(function(n){return n.mes===mesActual;});
  var hoy2=new Date();
  var esJulio=hoy2.getMonth()===6;
  var esDic=hoy2.getMonth()===11;
  var activos=empleados.filter(function(e){return e.activo!==false;});
  actions.innerHTML='<button class="btn btn-primary" onclick="generarNominaMes()">Generar nomina</button>';

  var totProv={b14:0,agui:0,vac:0,indem:0,igssP:0};
  activos.forEach(function(e){var p=calcProvisionesMensuales(e.salarioBase||0);totProv.b14+=p.bono14;totProv.agui+=p.aguinaldo;totProv.vac+=p.vacaciones;totProv.indem+=p.indemnizacion;totProv.igssP+=p.igssPatronal;});

  var totalNeto=nominaMes.reduce(function(a,n){return a+(n.netoPagar||0);},0);

  var filas=activos.map(function(e){
    var sal=e.salarioBase||0;
    var igssE=sal*0.0483;
    var isrA=calcISREmpleado(sal*12,igssE*12);
    var isrM=isrA/12;
    var bonif=BONIF_DECRETO+(e.bonificacionAdicional||0);
    var neto=sal+bonif-igssE-isrM-(e.descuentoAdicional||0);
    var p=calcProvisionesMensuales(sal);
    var costoReal=sal+bonif+p.igssPatronal+p.irtra+p.intecap+p.bono14+p.aguinaldo+p.vacaciones+p.indemnizacion;
    var ce=e.circunscripcion||'CE1';
    var salMin=(SAL_MIN[ce]||SAL_MIN.CE1).noAgricola;
    var alerta=sal<salMin?' <span class="badge badge-red">BAJO MINIMO</span>':'';
    return'<tr>'
      +'<td><strong>'+e.nombre+'</strong>'+alerta+'</td>'
      +'<td><span class="badge badge-'+(ce==='CE1'?'blue':'purple')+'">'+ce+'</span></td>'
      +'<td class="td-mono">'+fmt(sal)+'</td>'
      +'<td class="td-mono text-green">+'+fmt(bonif)+'</td>'
      +'<td class="td-mono text-red">-'+fmt(igssE)+'</td>'
      +'<td class="td-mono '+(isrM>0?'text-red':'text-muted')+'">'+(isrM>0?'-'+fmt(isrM):'Exento')+'</td>'
      +'<td class="td-mono" style="font-weight:700;color:var(--green)">'+fmt(neto)+'</td>'
      +'<td class="td-mono text-amber">'+fmt(p.bono14)+'</td>'
      +'<td class="td-mono text-amber">'+fmt(p.aguinaldo)+'</td>'
      +'<td class="td-mono text-blue">'+fmt(p.vacaciones)+'</td>'
      +'<td class="td-mono text-blue">'+fmt(p.indemnizacion)+'</td>'
      +'<td class="td-mono text-red">'+fmt(p.igssPatronal)+'</td>'
      +'<td class="td-mono text-amber" style="font-weight:700">'+fmt(costoReal)+'</td>'
      +'</tr>';
  }).join('');

  content.innerHTML='<div class="section-title">Nomina Mensual &mdash; '+mesActual+'</div>'
    +(esJulio?'<div class="alert alert-amber">Julio: pagar Bono 14 (1 salario base por empleado)</div>':'')
    +(esDic?'<div class="alert alert-amber">Diciembre: pagar Aguinaldo (1 salario base por empleado)</div>':'')
    +(nominaMes.length===0?'<div class="alert alert-amber">Nomina no generada. Haz clic en Generar nomina.</div>':'')
    +'<div class="card"><div class="card-title" style="margin-bottom:12px">Provision mensual de prestaciones (carga laboral real)</div>'
    +'<div class="alert alert-blue" style="font-size:11px">Estos montos NO se pagan al empleado ahora pero son obligaciones futuras. Deben reservarse mensualmente para cumplir con el Codigo de Trabajo y son deducibles del ISR empresarial como gasto.</div>'
    +'<div class="stat-grid">'
    +'<div class="stat-card stat-amber"><div class="stat-label">Prov. Bono 14</div><div class="stat-value">'+fmt(totProv.b14)+'</div><div class="stat-sub">Pago: 15 julio</div></div>'
    +'<div class="stat-card stat-amber"><div class="stat-label">Prov. Aguinaldo</div><div class="stat-value">'+fmt(totProv.agui)+'</div><div class="stat-sub">Pago: 15 diciembre</div></div>'
    +'<div class="stat-card stat-blue"><div class="stat-label">Prov. Vacaciones</div><div class="stat-value">'+fmt(totProv.vac)+'</div><div class="stat-sub">15 dias/anio</div></div>'
    +'<div class="stat-card stat-blue"><div class="stat-label">Prov. Indemnizacion</div><div class="stat-value">'+fmt(totProv.indem)+'</div><div class="stat-sub">1 salario/anio</div></div>'
    +'<div class="stat-card stat-red"><div class="stat-label">IGSS Patronal</div><div class="stat-value">'+fmt(totProv.igssP)+'</div><div class="stat-sub">12.67% mensual</div></div>'
    +'<div class="stat-card"><div class="stat-label">Carga total mes</div><div class="stat-value" style="font-size:16px;color:var(--accent)">'+fmt(totProv.b14+totProv.agui+totProv.vac+totProv.indem+totProv.igssP)+'</div></div>'
    +'</div></div>'
    +'<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    +'<thead><tr><th>Empleado</th><th>CE</th><th>Salario</th><th>Bonif.</th><th>IGSS</th><th>ISR</th><th>Neto</th>'
    +'<th>P.Bono14</th><th>P.Agui.</th><th>P.Vacac.</th><th>P.Indem.</th><th>IGSS P.</th><th>Costo real</th></tr></thead>'
    +'<tbody>'+(filas||'<tr><td colspan="13" class="text-center text-muted" style="padding:16px">Sin empleados activos</td></tr>')+'</tbody>'
    +'</table></div></div>';
}


// \u2550\u2550\u2550\u2550 ACCESO POR DIAS/HORAS + TIMEOUT CONFIGURABLE \u2550\u2550\u2550\u2550

function verificarAccesoHorario(usuario) {
  if (!usuario.restriccionHorario) return true;
  var ahora = new Date();
  var dia = ahora.getDay(); // 0=dom, 1=lun ... 6=sab
  var hora = ahora.getHours() * 60 + ahora.getMinutes();
  var diasPermitidos = usuario.diasAcceso || [1,2,3,4,5]; // lun-vie por defecto
  if (diasPermitidos.indexOf(dia) < 0) return false;
  var horaInicio = usuario.horaInicioMin || 0;
  var horaFin = usuario.horaFinMin || 1440;
  return hora >= horaInicio && hora <= horaFin;
}



// \u2550\u2550\u2550\u2550 VALIDACION NIT SAT (Modulo 11) \u2550\u2550\u2550\u2550
// Algoritmo oficial SAT Guatemala para validar NITs
function validarNIT(nit) {
  if (!nit) return false;
  var s = nit.toString().trim().toUpperCase().replace(/-/g,'');
  if (s === 'CF') return true; // Consumidor final siempre valido
  if (!/^\d+[0-9K]$/.test(s)) return false;
  var verificador = s[s.length - 1];
  var numero = s.slice(0, -1);
  if (!/^\d+$/.test(numero)) return false;
  var factor = numero.length + 1;
  var total = 0;
  for (var i = 0; i < numero.length; i++) {
    total += parseInt(numero[i]) * factor;
    factor--;
  }
  var residuo = (11 - (total % 11)) % 11;
  var dvEsperado = residuo === 10 ? 'K' : residuo.toString();
  return dvEsperado === verificador;
}

// Consulta al portal SAT para verificar NIT (requiere conexion)
// La SAT no tiene API publica - se hace validacion local con modulo 11
// Para FEL real se requiere: certificadora autorizada + firma electronica
async function verificarNITSAT(nit) {
  if (!nit || nit.toUpperCase() === 'CF') {
    return {valido:true, nombre:'Consumidor Final', tipo:'CF'};
  }
  var limpio = nit.toString().trim().replace(/-/g,'').toUpperCase();
  var valido = validarNIT(limpio);
  if (!valido) {
    return {valido:false, error:'NIT invalido segun algoritmo SAT (Modulo 11). Verifica el numero.'};
  }
  // Si el NIT es valido matematicamente, retornar OK
  // Para consulta real necesitas credenciales de certificadora FEL (Infile, Digifact, etc.)
  return {valido:true, nit:limpio, mensaje:'NIT valido segun algoritmo oficial SAT Guatemala'};
}

// Indicador visual de validacion NIT en formularios
async function onNITChange(inputId, resultId) {
  var nit = document.getElementById(inputId) ? document.getElementById(inputId).value.trim() : '';
  var el = document.getElementById(resultId);
  if (!el) return;
  if (!nit || nit.toUpperCase() === 'CF') {
    el.innerHTML = '<span style="color:var(--text3);font-size:10px">Consumidor Final</span>';
    return;
  }
  el.innerHTML = '<span style="color:var(--text3);font-size:10px">Validando...</span>';
  var r = await verificarNITSAT(nit);
  if (r.valido) {
    el.innerHTML = '<span style="color:var(--green);font-size:10px">&#10003; NIT valido' + (r.nombre ? ' - ' + r.nombre : '') + '</span>';
  } else {
    el.innerHTML = '<span style="color:var(--red);font-size:10px">&#10005; ' + (r.error||'NIT invalido') + '</span>';
  }
}

// \u2550\u2550\u2550\u2550 MODAL USUARIO MEJORADO CON ACCESO HORARIO \u2550\u2550\u2550\u2550
async function modalUsuario(id) {
  if (!soloAdmin()) { toast('Solo administradores', 'red'); return; }
  var u = id ? await dbGet('usuarios', id) : {};
  var diasNom = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
  var diasPerm = u.diasAcceso || [1,2,3,4,5];
  var ht2m = function(h,m){ return h*60+(m||0); };
  var m2h = function(min){ return Math.floor(min/60).toString().padStart(2,'0')+':'+((min||0)%60).toString().padStart(2,'0'); };
  var hInicio = u.horaInicioMin!=null ? m2h(u.horaInicioMin) : '07:00';
  var hFin    = u.horaFinMin!=null    ? m2h(u.horaFinMin)    : '18:00';
  var timeoutVal = u.timeoutMinutos || 15;

  openModal('modalUsuario', id ? 'Editar Usuario' : 'Nuevo Usuario',
    '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Nombre completo *</label><input id="u_nom" value="'+(u.nombre||'')+'" placeholder="Nombre del usuario"></div>'
    + '<div class="form-group"><label>Usuario (login) *</label><input id="u_usr" value="'+(u.username||'')+'" placeholder="sin espacios" '+(id&&u.username==='admin'?'readonly':'')+' ></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Perfil *</label>'
    + '<select id="u_perfil" '+(id&&u.username==='admin'?'disabled':'')+' >'
    + '<option value="operador" '+(u.perfil==='operador'?'selected':'')+'>Operador</option>'
    + '<option value="supervisor" '+(u.perfil==='supervisor'?'selected':'')+'>Supervisor</option>'
    + '<option value="admin" '+(u.perfil==='admin'?'selected':'')+'>Administrador</option>'
    + '</select></div>'
    + '<div class="form-group"><label>'+(id?'Nueva contrasena (vacio = sin cambio)':'Contrasena *')+'</label><input id="u_pass" type="password" placeholder="Contrasena"></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Email</label><input id="u_email" type="email" value="'+(u.email||'')+'" placeholder="correo@taller.com"></div>'
    + '<div class="form-group"><label>Cargo</label><input id="u_cargo" value="'+(u.cargo||'')+'" placeholder="Mecanico, Contador..."></div>'
    + '</div>'
    + (id ? '<div class="form-group"><label><input type="checkbox" id="u_activo" '+(u.activo!==false?'checked':'')+' style="width:auto;margin-right:6px"> Usuario activo</label></div>' : '')
    + '<div class="divider"></div>'
    + '<div class="card-title" style="margin-bottom:10px">Control de acceso horario</div>'
    + '<div class="form-group"><label><input type="checkbox" id="u_rest" '+(u.restriccionHorario?'checked':'')+' style="width:auto;margin-right:6px" onchange="toggleHorario()"> Habilitar restriccion de horario</label></div>'
    + '<div id="horario_wrap" style="display:'+(u.restriccionHorario?'block':'none')+'">'
    + '<div class="form-group"><label>Dias de acceso permitidos</label>'
    + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">'
    + diasNom.map(function(d,i){ return '<label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer"><input type="checkbox" value="'+i+'" '+(diasPerm.indexOf(i)>=0?'checked':'')+' class="dia_cb" style="width:auto"> '+d+'</label>'; }).join('')
    + '</div></div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Hora de inicio</label><input id="u_hinicio" type="time" value="'+hInicio+'"></div>'
    + '<div class="form-group"><label>Hora de fin</label><input id="u_hfin" type="time" value="'+hFin+'"></div>'
    + '</div></div>'
    + '<div class="form-group"><label>Timeout de sesion (minutos)</label>'
    + '<div style="display:flex;align-items:center;gap:10px">'
    + '<input id="u_timeout" type="number" value="'+timeoutVal+'" min="1" max="480" style="width:100px">'
    + '<label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer"><input type="checkbox" id="u_timeout_auto" '+(u.timeoutMinutos?'':'checked')+' style="width:auto" onchange="toggleTimeout()"> Automatico (15 min)</label>'
    + '</div><div class="form-hint">1 a 480 minutos. Automatico usa la config global del sistema.</div>'
    + '</div>',
    async function() {
      var nombre = document.getElementById('u_nom').value.trim();
      var username = document.getElementById('u_usr').value.trim().toLowerCase().replace(/\s/g,'');
      var pass = document.getElementById('u_pass').value;
      if (!nombre || !username) { toast('Nombre y usuario requeridos', 'red'); return; }
      if (!id && !pass) { toast('Contrasena requerida para nuevo usuario', 'red'); return; }
      var restriccion = document.getElementById('u_rest').checked;
      var diasSelec = Array.from(document.querySelectorAll('.dia_cb:checked')).map(function(cb){ return parseInt(cb.value); });
      var hinicio = document.getElementById('u_hinicio').value;
      var hfin = document.getElementById('u_hfin').value;
      var toAuto = document.getElementById('u_timeout_auto').checked;
      var toMin = toAuto ? null : (parseInt(document.getElementById('u_timeout').value)||15);
      var obj = {
        nombre:nombre, username:username,
        perfil: document.getElementById('u_perfil').value,
        email: document.getElementById('u_email').value,
        cargo: document.getElementById('u_cargo').value,
        activo: id ? (document.getElementById('u_activo') ? document.getElementById('u_activo').checked : true) : true,
        restriccionHorario: restriccion,
        diasAcceso: restriccion ? diasSelec : null,
        horaInicioMin: restriccion && hinicio ? (parseInt(hinicio.split(':')[0])*60+parseInt(hinicio.split(':')[1]||0)) : null,
        horaFinMin: restriccion && hfin ? (parseInt(hfin.split(':')[0])*60+parseInt(hfin.split(':')[1]||0)) : null,
        timeoutMinutos: toMin,
        updatedAt: nowTs()
      };
      if (pass) obj.passwordHash = hashSimple(pass);
      if (id) {
        obj.id = id;
        if (!obj.passwordHash) { var ex = await dbGet('usuarios',id); obj.passwordHash = ex.passwordHash; }
        await dbPut('usuarios', obj);
      } else {
        obj.createdAt = nowTs();
        await dbAdd('usuarios', obj);
      }
      closeModal('modalUsuario'); toast(id ? 'Usuario actualizado' : 'Usuario creado');
      await navTo('usuarios');
    }, true);
}

function toggleHorario() {
  var cb = document.getElementById('u_rest');
  var wrap = document.getElementById('horario_wrap');
  if (wrap) wrap.style.display = cb && cb.checked ? 'block' : 'none';
}

function toggleTimeout() {
  var auto = document.getElementById('u_timeout_auto');
  var inp  = document.getElementById('u_timeout');
  if (inp) inp.disabled = auto && auto.checked;
}

// \u2550\u2550\u2550\u2550 TIMEOUT CONFIGURABLE EN CONFIGURACION \u2550\u2550\u2550\u2550
async function guardarConfig() {
  var cfg = {
    key: 'taller',
    nombre: document.getElementById('cfg_nombre') ? document.getElementById('cfg_nombre').value.trim() : '',
    nit: document.getElementById('cfg_nit') ? document.getElementById('cfg_nit').value.trim() : '',
    telefono: document.getElementById('cfg_tel') ? document.getElementById('cfg_tel').value.trim() : '',
    email: document.getElementById('cfg_email') ? document.getElementById('cfg_email').value.trim() : '',
    direccion: document.getElementById('cfg_dir') ? document.getElementById('cfg_dir').value.trim() : '',
    tarifaHora: parseFloat(document.getElementById('cfg_tarifa') ? document.getElementById('cfg_tarifa').value : '150') || 150,
    margenMin: parseFloat(document.getElementById('cfg_margen') ? document.getElementById('cfg_margen').value : '20') || 20,
    piePagina: document.getElementById('cfg_pie') ? document.getElementById('cfg_pie').value.trim() : '',
    timeoutMinutos: parseInt(document.getElementById('cfg_timeout') ? document.getElementById('cfg_timeout').value : '15') || 15,
    updatedAt: nowTs()
  };
  await dbPut('config', cfg);
  SES_TIMEOUT = cfg.timeoutMinutos * 60 * 1000;
  resetSesTimer();
  toast('Configuracion guardada');
}

// \u2550\u2550\u2550\u2550 FEL / VALIDACION NIT EN FACTURA \u2550\u2550\u2550\u2550
// Agregar validacion al cargar NIT en modal de factura
async function cargarNITCliente() {
  var sel = document.getElementById('f_cliente');
  if (!sel) return;
  var parts = (sel.value||'::').split(':');
  var nitEl = document.getElementById('f_nit');
  if (nitEl) nitEl.value = parts[1] || 'CF';
  // Validar NIT
  var nit = parts[1] || 'CF';
  var r = await verificarNITSAT(nit);
  var el = document.getElementById('nit_status');
  if (el) {
    el.innerHTML = r.valido
      ? '<span style="color:var(--green);font-size:11px">&#10003; NIT valido</span>'
      : '<span style="color:var(--red);font-size:11px">&#10005; NIT invalido</span>';
  }
}

// \u2550\u2550\u2550\u2550 INFO FEL SAT \u2550\u2550\u2550\u2550
function infoFEL() {
  openModal('infoFEL', 'Facturacion Electronica FEL - SAT Guatemala',
    '<div class="alert alert-blue">Para emitir facturas FEL validas ante la SAT se requiere una certificadora autorizada.</div>'
    + '<div style="font-size:13px;line-height:1.9">'
    + '<strong>Que necesitas:</strong><br>'
    + '1. <strong>NIT habilitado para FEL</strong> en el portal SAT (portal.sat.gob.gt)<br>'
    + '2. <strong>Certificadora autorizada</strong>: Infile, Digifact, G4S, Megaprint o similar<br>'
    + '3. <strong>Firma electronica</strong> y credenciales de la certificadora<br>'
    + '4. Conexion a internet al momento de emitir<br><br>'
    + '<strong>Proceso en TallerPro:</strong><br>'
    + '- El NIT del cliente se valida localmente con el algoritmo Modulo 11 (SAT)<br>'
    + '- Al tener tus credenciales de certificadora, el sistema puede enviar la factura via API<br>'
    + '- La certificadora retorna el UUID y codigo de verificacion SAT<br><br>'
    + '<strong>Configuracion:</strong> Ve a Configuracion y agrega tus credenciales FEL (usuario, token de la certificadora). El NIT del taller configurado se usara como emisor.<br><br>'
    + '<a href="https://portal.sat.gob.gt" target="_blank" style="color:var(--accent)">Portal SAT Guatemala</a> &nbsp;|&nbsp; '
    + '<a href="https://www.infile.com" target="_blank" style="color:var(--accent)">Infile (certificadora)</a>'
    + '</div>',
    function(){ closeModal('infoFEL'); }, true);
}


// ================================================================
// MODULO RRHH COMPLETO v3.1
// Base legal: Codigo de Trabajo Guatemala Decreto 1441
// Decreto 10-2012 ISR | AG 256-2025 Salarios minimos
// ================================================================

// ---- CALCULOS LEGALES LIQUIDACION (Art. 78, 79, 82 CT) ----
// Art. 78: Renuncia voluntaria -> SIN indemnizacion
// Art. 82: Despido injustificado -> CON indemnizacion (1 sal/anio, proporcional)
// Despido justificado -> SIN indemnizacion
// En TODOS los casos: bono14 prop + aguinaldo prop + vacaciones no gozadas + salarios pendientes

function calcLiquidacion(empleado, fechaSalida, tipoSalida, salarioPendiente, vacacionesTomadas, fechaUltB14, fechaUltAgui) {
  var fi   = new Date(empleado.fechaIngreso + 'T00:00:00');
  var fs   = new Date(fechaSalida + 'T00:00:00');
  var diasTotales = Math.floor((fs - fi) / 86400000);
  var anios = diasTotales / 365.25;
  var mesesTotal = anios * 12;
  var sal  = empleado.salarioBase || 0;

  // Promedio ultimos 6 salarios (Art. 82): si no hay historial, usar sal base
  var promSal = sal;

  // BONO14 (Decreto 42-92): ciclo 1-jul → 30-jun, formula: sal_anual/365 * dias_ciclo
  var _fsal  = new Date(fechaSalida+"T00:00:00");
  var _anio  = _fsal.getFullYear();
  var _iniB14 = (_fsal >= new Date(_anio,6,1)) ? new Date(_anio,6,1) : new Date(_anio-1,6,1);
  var _fb14_d = fechaUltB14 ? new Date(fechaUltB14+"T00:00:00") : null;
  if (_fb14_d && _fb14_d >= _iniB14) _iniB14 = new Date(_fb14_d.getTime()+86400000);
  var diasB14 = Math.max(0, Math.floor((_fsal - _iniB14)/86400000));
  var b14Prop = parseFloat(((promSal*12/365)*diasB14).toFixed(2));

  // AGUINALDO (Decreto 76-78): ciclo 1-dic → 30-nov
  var _iniAgui = (_fsal >= new Date(_anio,11,1)) ? new Date(_anio,11,1) : new Date(_anio-1,11,1);
  var _fagui_d = fechaUltAgui ? new Date(fechaUltAgui+"T00:00:00") : null;
  if (_fagui_d && _fagui_d >= _iniAgui) _iniAgui = new Date(_fagui_d.getTime()+86400000);
  var diasAgui = Math.max(0, Math.floor((_fsal - _iniAgui)/86400000));
  var aguiProp = parseFloat(((promSal*12/365)*diasAgui).toFixed(2));

  // Vacaciones no gozadas (Art. 130 CT): 15 dias habiles / anio
  // Solo aplica si > 150 dias laborados
  var vacPend = 0;
  if (diasTotales >= 150) {
    var diasVacGanados = (diasTotales / 365) * 15;
    var diasVacTomados = vacacionesTomadas || 0;
    var diasVacPend    = Math.max(0, diasVacGanados - diasVacTomados);
    vacPend = (promSal / 30) * diasVacPend;
  }

  // Indemnizacion (Art. 82 CT): SOLO en despido injustificado
  // = 1 salario ordinario por anio trabajado, proporcional
  // No hay tope en sector privado (el tope 10 meses es solo sector publico Art.110 CPRG)
  var indem = 0;
  if (tipoSalida === 'despido_injustificado') {
    indem = promSal * anios; // proporcional completo
  }

  var salPend = salarioPendiente || 0;
  var total   = b14Prop + aguiProp + vacPend + indem + salPend;

  return {
    diasTotales: Math.floor(diasTotales),
    anios: anios,
    meses: Math.floor(mesesTotal),
    promSal: promSal,
    b14Prop: parseFloat(b14Prop.toFixed(2)),
    aguiProp: parseFloat(aguiProp.toFixed(2)),
    vacPend: parseFloat(vacPend.toFixed(2)),
    diasVacPend: diasTotales >= 150 ? parseFloat(((diasTotales/365)*15 - (vacacionesTomadas||0)).toFixed(1)) : 0,
    indem: parseFloat(indem.toFixed(2)),
    salPend: parseFloat(salPend.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    tieneIndem: tipoSalida === 'despido_injustificado'
  };
}

// ---- PANTALLA PRINCIPAL GESTION RRHH ----
async function renderGestionRRHH(content, actions) {
  if (!soloAdmin()) { content.innerHTML = '<div class="alert alert-red">Solo administradores</div>'; return; }
  var empleados = await dbGetAll('empleados');
  var llamadas  = await dbGetAll('llamadas_atencion');
  var vacEmp    = await dbGetAll('vacaciones_emp');
  var docs      = await dbGetAll('documentos_emp');

  actions.innerHTML = '<button class="btn btn-primary" onclick="navTo(\'liquidacion\')">Calcular liquidacion</button>';

  var activos = empleados.filter(function(e){ return e.activo !== false; });

  var filas = activos.map(function(e) {
    var llamEmp = llamadas.filter(function(l){ return l.empleadoId === e.id; });
    var vacEmpList = vacEmp.filter(function(v){ return v.empleadoId === e.id && !v.cancelado; });
    var diasTomados = vacEmpList.reduce(function(a,v){ return a + (v.dias||0); }, 0);
    // Dias ganados segun antiguedad
    var fi = new Date((e.fechaIngreso||'2020-01-01')+'T00:00:00');
    var hoy = new Date(); hoy.setHours(0,0,0,0);
    var diasAnt = Math.floor((hoy - fi) / 86400000);
    var anios = diasAnt / 365.25;
    var diasGanados = anios >= 1 ? Math.floor(anios) * 15 : (diasAnt >= 150 ? Math.floor((diasAnt/365)*15) : 0);
    var diasPend = Math.max(0, diasGanados - diasTomados);
    var docsEmp = docs.filter(function(d){ return d.empleadoId === e.id; });
    var alertaVac = diasPend > 10 ? 'badge-amber' : 'badge-green';
    var alertaLL  = llamEmp.filter(function(l){ return !l.resuelta; }).length;

    return '<tr>'
      + '<td><strong>' + e.nombre + '</strong><div style="font-size:10px;color:var(--text3)">' + (e.cargo||'') + '</div></td>'
      + '<td style="font-size:11px">' + (e.fechaIngreso ? fechaLegible(e.fechaIngreso) : '---') + '</td>'
      + '<td><span class="badge ' + alertaVac + '">' + diasPend + ' dias pend.</span></td>'
      + '<td>' + (alertaLL > 0 ? '<span class="badge badge-red">' + alertaLL + ' pendiente(s)</span>' : '<span class="badge badge-gray">' + llamEmp.length + ' total</span>') + '</td>'
      + '<td>' + docsEmp.length + ' doc(s)</td>'
      + '<td><div class="flex gap-1">'
      + '<button class="btn btn-sm btn-secondary" onclick="verExpedienteEmp(' + e.id + ')">Expediente</button>'
      + '<button class="btn btn-sm btn-blue" onclick="modalRegistrarVacacion(' + e.id + ')">+ Vacacion</button>'
      + '<button class="btn btn-sm btn-amber" onclick="modalLlamadaAtencion(' + e.id + ')">+ L.Atencion</button>'
      + '</div></td>'
      + '</tr>';
  }).join('');

  content.innerHTML = '<div class="section-title">Gestion de Empleados</div>'
    + '<div class="section-sub">Control de expedientes, vacaciones y documentos</div>'
    + '<div class="alert alert-blue" style="font-size:11px">Las vacaciones se renuevan a 15 dias habiles al cumplir cada anio de servicio (Art. 130 CT). Aplica si se han laborado mas de 150 dias continuos.</div>'
    + '<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    + '<thead><tr><th>Empleado</th><th>Fecha ingreso</th><th>Vacaciones</th><th>Llamadas atencion</th><th>Documentos</th><th>Acciones</th></tr></thead>'
    + '<tbody>' + (filas || '<tr><td colspan="6" class="text-center text-muted" style="padding:16px">Sin empleados activos</td></tr>') + '</tbody>'
    + '</table></div></div>';
}

// ---- EXPEDIENTE COMPLETO DE UN EMPLEADO ----
async function verExpedienteEmp(empId) {
  var e       = await dbGet('empleados', empId);
  var llamadas = await dbGetAll('llamadas_atencion');
  var vacList  = await dbGetAll('vacaciones_emp');
  var docs     = await dbGetAll('documentos_emp');
  if (!e) return;

  var llamEmp = llamadas.filter(function(l){ return l.empleadoId === empId; }).sort(function(a,b){ return (a.fecha||'')<(b.fecha||'')?1:-1; });
  var vacEmp  = vacList.filter(function(v){ return v.empleadoId === empId; }).sort(function(a,b){ return (a.fechaInicio||'')<(b.fechaInicio||'')?1:-1; });
  var docsEmp = docs.filter(function(d){ return d.empleadoId === empId; }).sort(function(a,b){ return (a.fecha||'')<(b.fecha||'')?1:-1; });

  var fi = new Date((e.fechaIngreso||'2020-01-01')+'T00:00:00');
  var hoy = new Date(); hoy.setHours(0,0,0,0);
  var diasAnt = Math.floor((hoy-fi)/86400000);
  var aniosComp = Math.floor(diasAnt/365.25);
  var mesesResto = Math.floor((diasAnt - aniosComp*365.25)/30.44);
  var diasGanados = aniosComp * 15 + (diasAnt >= 150 && aniosComp===0 ? Math.floor((diasAnt/365)*15) : 0);
  var diasTomados = vacEmp.filter(function(v){return !v.cancelado;}).reduce(function(a,v){return a+(v.dias||0);},0);
  var diasPend    = Math.max(0, diasGanados - diasTomados);

  var secVac = vacEmp.length ? vacEmp.map(function(v){
    return '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">'
      + '<span>' + fechaLegible(v.fechaInicio) + ' al ' + fechaLegible(v.fechaFin) + '</span>'
      + '<span>' + (v.dias||0) + ' dias</span>'
      + '<span>' + (v.tipo||'Ordinarias') + '</span>'
      + '<span class="badge badge-' + (v.cancelado?'gray':'green') + '">' + (v.cancelado?'Cancelada':'Tomada') + '</span>'
      + '<button class="btn btn-sm btn-danger" style="padding:1px 6px" onclick="cancelarVacacion(' + v.id + ',' + empId + ')">X</button>'
      + '</div>';
  }).join('') : '<div class="text-muted" style="font-size:12px">Sin vacaciones registradas</div>';

  var secLL = llamEmp.length ? llamEmp.map(function(l){
    return '<div style="background:var(--bg3);border-radius:6px;padding:10px;margin-bottom:8px;border-left:3px solid var(--' + (l.tipo==='grave'?'red':'amber') + ')">'
      + '<div style="display:flex;justify-content:space-between"><strong style="font-size:12px">' + fechaLegible(l.fecha) + '</strong>'
      + '<span class="badge badge-' + (l.tipo==='grave'?'red':l.tipo==='leve'?'amber':'gray') + '">' + (l.tipo||'verbal') + '</span>'
      + '<span class="badge badge-' + (l.resuelta?'green':'red') + '">' + (l.resuelta?'Resuelta':'Pendiente') + '</span>'
      + '<button class="btn btn-sm btn-secondary" style="padding:1px 6px" onclick="toggleLlamada(' + l.id + ',' + empId + ')">' + (l.resuelta?'Reabrir':'Resolver') + '</button>'
      + '</div>'
      + '<div style="font-size:12px;margin-top:6px">' + (l.descripcion||'Sin descripcion') + '</div>'
      + (l.medida ? '<div style="font-size:11px;color:var(--text2);margin-top:3px">Medida: ' + l.medida + '</div>' : '')
      + '</div>';
  }).join('') : '<div class="text-muted" style="font-size:12px">Sin llamadas de atencion</div>';

  var secDocs = docsEmp.length ? docsEmp.map(function(d){
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">'
      + '<span>' + fechaLegible(d.fecha) + '</span>'
      + '<span class="badge badge-gray">' + (d.tipo||'Documento') + '</span>'
      + '<span>' + (d.descripcion||'---') + '</span>'
      + '</div>';
  }).join('') : '<div class="text-muted" style="font-size:12px">Sin documentos</div>';

  openModal('expediente', 'Expediente: ' + e.nombre,
    '<div class="stat-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:12px">'
    + '<div class="stat-card"><div class="stat-label">Antiguedad</div><div class="stat-value" style="font-size:15px">' + aniosComp + 'a ' + mesesResto + 'm</div></div>'
    + '<div class="stat-card stat-green"><div class="stat-label">Vac. pendientes</div><div class="stat-value" style="font-size:15px">' + diasPend + ' dias</div></div>'
    + '<div class="stat-card"><div class="stat-label">Vac. tomadas</div><div class="stat-value" style="font-size:15px">' + diasTomados + ' dias</div></div>'
    + '<div class="stat-card ' + (llamEmp.filter(function(l){return !l.resuelta;}).length>0?'stat-red':'') + '"><div class="stat-label">L. Atencion</div><div class="stat-value" style="font-size:15px">' + llamEmp.length + '</div></div>'
    + '</div>'
    + '<div style="display:flex;gap:8px;margin-bottom:12px">'
    + '<button class="btn btn-sm btn-blue" onclick="modalRegistrarVacacion(' + empId + ')">+ Vacacion</button>'
    + '<button class="btn btn-sm btn-amber" onclick="modalLlamadaAtencion(' + empId + ')">+ Llamada atencion</button>'
    + '<button class="btn btn-sm btn-secondary" onclick="modalDocumentoEmp(' + empId + ')">+ Documento</button>'
    + '<button class="btn btn-sm btn-primary" onclick="cerrarModal(\'expediente\');navTo(\'liquidacion\')">Calcular liquidacion</button>'
    + '</div>'
    + '<div class="divider"></div>'
    + '<div style="font-weight:600;font-size:12px;margin-bottom:8px">Historial de vacaciones</div>' + secVac
    + '<div class="divider"></div>'
    + '<div style="font-weight:600;font-size:12px;margin-bottom:8px">Llamadas de atencion</div>' + secLL
    + '<div class="divider"></div>'
    + '<div style="font-weight:600;font-size:12px;margin-bottom:8px">Documentos</div>' + secDocs,
    function(){ cerrarModal('expediente'); }, false);
}

// ---- MODAL VACACION ----
async function modalRegistrarVacacion(empId) {
  var e = await dbGet('empleados', empId);
  if (!e) return;
  openModal('vacEmp', 'Registrar Vacacion: ' + e.nombre,
    '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Fecha inicio *</label><input id="ve_ini" type="date" value="' + today() + '"></div>'
    + '<div class="form-group"><label>Fecha fin *</label><input id="ve_fin" type="date" value="' + today() + '" oninput="calcDiasVac()"></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Dias habiles</label><input id="ve_dias" type="number" value="0" readonly style="background:var(--bg4)"><div class="form-hint">Se calculan automaticamente</div></div>'
    + '<div class="form-group"><label>Tipo</label><select id="ve_tipo"><option value="Ordinarias">Ordinarias (15 dias/anio)</option><option value="Compensacion">Compensacion por dias</option></select></div>'
    + '</div>'
    + '<div class="form-group"><label>Observaciones</label><textarea id="ve_obs" style="min-height:50px"></textarea></div>',
    async function() {
      var ini = document.getElementById('ve_ini').value;
      var fin = document.getElementById('ve_fin').value;
      if (!ini || !fin || ini > fin) { toast('Fechas invalidas', 'red'); return; }
      var dias = parseInt(document.getElementById('ve_dias').value) || 0;
      if (dias <= 0) { toast('Ingresa fechas validas', 'red'); return; }
      await dbAdd('vacaciones_emp', { empleadoId:empId, empleadoNombre:e.nombre,
        fechaInicio:ini, fechaFin:fin, dias:dias, tipo:document.getElementById('ve_tipo').value,
        observaciones:document.getElementById('ve_obs').value.trim(), cancelado:false, createdAt:nowTs() });
      cerrarModal('vacEmp'); toast('Vacacion registrada');
      verExpedienteEmp(empId);
    }, true);
  setTimeout(calcDiasVac, 100);
}

function calcDiasVac() {
  var ini = document.getElementById('ve_ini');
  var fin = document.getElementById('ve_fin');
  var dias = document.getElementById('ve_dias');
  if (!ini || !fin || !dias) return;
  if (!ini.value || !fin.value || ini.value > fin.value) { dias.value = 0; return; }
  // Contar dias habiles (lun-sab, excluir dom)
  var d = new Date(ini.value + 'T00:00:00');
  var f = new Date(fin.value + 'T00:00:00');
  var count = 0;
  while (d <= f) { if (d.getDay() !== 0) count++; d.setDate(d.getDate()+1); }
  dias.value = count;
}

async function cancelarVacacion(vacId, empId) {
  if (!confirm('Cancelar este registro de vacacion?')) return;
  var v = await dbGet('vacaciones_emp', vacId);
  if (v) { v.cancelado = true; await dbPut('vacaciones_emp', v); }
  verExpedienteEmp(empId);
}

// ---- MODAL LLAMADA DE ATENCION ----
async function modalLlamadaAtencion(empId) {
  var e = await dbGet('empleados', empId);
  if (!e) return;
  openModal('llamadaAt', 'Llamada de Atencion: ' + e.nombre,
    '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Fecha *</label><input id="la_fec" type="date" value="' + today() + '"></div>'
    + '<div class="form-group"><label>Tipo *</label><select id="la_tipo"><option value="verbal">Verbal</option><option value="escrita_leve">Escrita leve</option><option value="escrita_grave">Escrita grave</option><option value="grave">Grave (potencial despido)</option></select></div>'
    + '</div>'
    + '<div class="form-group"><label>Descripcion de la falta *</label><textarea id="la_desc" placeholder="Describir la situacion, hora, lugar, testigos..."></textarea></div>'
    + '<div class="form-group"><label>Medida adoptada</label><input id="la_med" placeholder="Apercibimiento verbal, suspension de X dias..."></div>'
    + '<div class="form-group"><label>Testigos presentes</label><input id="la_test" placeholder="Nombres de testigos"></div>'
    + '<div class="form-group"><label><input type="checkbox" id="la_res" style="width:auto;margin-right:6px"> Marcar como resuelta</label></div>',
    async function() {
      var desc = document.getElementById('la_desc').value.trim();
      if (!desc) { toast('La descripcion es obligatoria', 'red'); return; }
      await dbAdd('llamadas_atencion', { empleadoId:empId, empleadoNombre:e.nombre,
        fecha:document.getElementById('la_fec').value,
        tipo:document.getElementById('la_tipo').value,
        descripcion:desc,
        medida:document.getElementById('la_med').value.trim(),
        testigos:document.getElementById('la_test').value.trim(),
        resuelta:document.getElementById('la_res').checked,
        createdAt:nowTs() });
      cerrarModal('llamadaAt'); toast('Llamada de atencion registrada');
      verExpedienteEmp(empId);
    }, true);
}

async function toggleLlamada(id, empId) {
  var l = await dbGet('llamadas_atencion', id);
  if (l) { l.resuelta = !l.resuelta; await dbPut('llamadas_atencion', l); }
  verExpedienteEmp(empId);
}

// ---- MODAL DOCUMENTO ----
async function modalDocumentoEmp(empId) {
  var e = await dbGet('empleados', empId);
  if (!e) return;
  var tipos = ['Contrato de trabajo','Adendum contractual','Constancia medica','Certificado de estudios','Evaluacion de desempeno','Nota informativa','Otro'];
  openModal('docEmp', 'Agregar Documento: ' + e.nombre,
    '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Fecha *</label><input id="de_fec" type="date" value="' + today() + '"></div>'
    + '<div class="form-group"><label>Tipo de documento</label><select id="de_tipo">' + tipos.map(function(t){return '<option>'+t+'</option>';}).join('') + '</select></div>'
    + '</div>'
    + '<div class="form-group"><label>Descripcion *</label><input id="de_desc" placeholder="Descripcion del documento"></div>'
    + '<div class="form-group"><label>Notas adicionales</label><textarea id="de_not" style="min-height:50px"></textarea></div>',
    async function() {
      var desc = document.getElementById('de_desc').value.trim();
      if (!desc) { toast('Descripcion requerida', 'red'); return; }
      await dbAdd('documentos_emp', { empleadoId:empId, empleadoNombre:e.nombre,
        fecha:document.getElementById('de_fec').value, tipo:document.getElementById('de_tipo').value,
        descripcion:desc, notas:document.getElementById('de_not').value.trim(), createdAt:nowTs() });
      cerrarModal('docEmp'); toast('Documento registrado');
      verExpedienteEmp(empId);
    }, true);
}

// ---- PANTALLA LIQUIDACION ----
async function renderLiquidacion(content, actions) {
  if (!soloAdmin()) { content.innerHTML = '<div class="alert alert-red">Solo administradores</div>'; return; }
  var empleados = await dbGetAll('empleados');
  var vacList   = await dbGetAll('vacaciones_emp');
  var activos   = empleados.filter(function(e){ return e.activo !== false; });

  var opts = activos.map(function(e){
    return '<option value="' + e.id + '">' + e.nombre + ' (' + (e.cargo||'') + ')</option>';
  }).join('');

  actions.innerHTML = '';

  content.innerHTML = '<div class="section-title">Calculo de Liquidacion</div>'
    + '<div class="section-sub">Segun Codigo de Trabajo Guatemala (Decreto 1441)</div>'
    + '<div class="alert alert-amber" style="font-size:11px">Art. 78 CT: Renuncia voluntaria = SIN indemnizacion. Art. 82 CT: Despido injustificado = CON indemnizacion (1 salario/anio, proporcional). Despido justificado = SIN indemnizacion. En TODOS los casos: Bono14 + Aguinaldo + Vacaciones no gozadas + Salarios pendientes.</div>'
    + '<div class="card"><div class="form-row form-row-2">'
    + '<div class="form-group"><label>Empleado *</label><select id="liq_emp" onchange="actualizarDatosLiq()">' + opts + '</select></div>'
    + '<div class="form-group"><label>\u00daltimo d\u00eda de trabajo *</label><input id="liq_fsal" type="date" value="' + today() + '" onchange="calcularSalPendienteLiq()"></div>'
    + '</div>'
    + '<div class="form-row form-row-3">'
    + '<div class="form-group"><label>Motivo de salida *</label>'
    + '<select id="liq_tipo" onchange="actualizarDatosLiq()">'
    + '<option value="renuncia">Renuncia voluntaria (Art. 78 CT) - SIN indemnizaci\u00f3n</option>'
    + '<option value="despido_injustificado">Despido injustificado (Art. 82 CT) - CON indemnizaci\u00f3n</option>'
    + '<option value="despido_justificado">Despido justificado - SIN indemnizaci\u00f3n</option>'
    + '<option value="mutuo_acuerdo">Mutuo acuerdo - SIN indemnizaci\u00f3n</option>'
    + '</select></div>'
    + '<div class="form-group"><label>\u00dalt. fecha pago de salario <span style="font-size:10px;color:var(--text3)">(para calcular d\u00edas pendientes)</span></label>'
    + '<input id="liq_fultpago" type="date" value="' + today().slice(0,8) + '01" onchange="calcularSalPendienteLiq()"></div>'
    + '<div class="form-group" id="liq_datos_emp" style="background:var(--bg3);border-radius:6px;padding:10px;font-size:11px;color:var(--text2)">Selecciona un empleado...</div>'
    + '</div>'
    + '<div class="form-row form-row-3">'
    + '<div class="form-group"><label>D\u00edas sin pagar <span style="font-size:10px;color:var(--text3)">(calculado)</span></label>'
    + '<input id="liq_dias_pend" type="number" value="0" min="0" readonly style="background:var(--bg3);color:var(--text3)"></div>'
    + '<div class="form-group"><label>Salario pendiente (Q) <span style="font-size:10px;color:var(--text3)">(editable)</span></label>'
    + '<input id="liq_salpend" type="number" value="0" step="0.01" min="0"></div>'
    + '<div class="form-group"><label>Vacaciones ya tomadas (d\u00edas h\u00e1biles)</label>'
    + '<input id="liq_vactom" type="number" value="0" min="0" step="1"></div>'
    + '</div>'
    + '<div style="margin-top:10px;padding:10px 12px;background:rgba(76,175,125,.07);border:1px solid rgba(76,175,125,.3);border-radius:8px">'
    + '<div style="font-size:11px;font-weight:700;margin-bottom:8px">Fechas de ultimo pago — Bono14 y Aguinaldo:</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label style="font-size:11px">Ultimo pago Bono14 (ciclo jul-jun · Decreto 42-92)</label>'
    + '<input id="liq_fb14" type="date" style="font-size:13px">'
    + '<div style="font-size:10px;color:var(--text3)">Deja en blanco si no ha cobrado en este ciclo</div></div>'
    + '<div class="form-group"><label style="font-size:11px">Ultimo pago Aguinaldo (ciclo dic-nov · Decreto 76-78)</label>'
    + '<input id="liq_fagui" type="date" style="font-size:13px">'
    + '<div style="font-size:10px;color:var(--text3)">Deja en blanco si no ha cobrado en este ciclo</div></div>'
    + '</div></div>'
    + '<button class="btn btn-primary mt-2" onclick="calcularLiquidacionUI()">&#128203; Calcular liquidaci\u00f3n</button>'
    + '</div>'
    + '<div id="liq_resultado"></div>';

  setTimeout(actualizarDatosLiq, 100);
}


async function calcularSalPendienteLiq() {
  var empId = parseInt((document.getElementById('liq_emp')||{}).value);
  var fsal  = (document.getElementById('liq_fsal')||{}).value;
  var fult  = (document.getElementById('liq_fultpago')||{}).value;
  if (!empId || !fsal || !fult) return;
  var e = await dbGet('empleados', empId);
  if (!e) return;
  var sal = e.salarioBase || 0;
  var salDiario = sal / 30; // Ministerio de Trabajo: salario diario = mensual/30
  var dtFsal = new Date(fsal + 'T00:00:00');
  var dtFult = new Date(fult + 'T00:00:00');
  var diasSinPagar = Math.max(0, Math.floor((dtFsal - dtFult) / 86400000));
  var salPend = parseFloat((diasSinPagar * salDiario).toFixed(2));
  var elDias = document.getElementById('liq_dias_pend');
  var elSal  = document.getElementById('liq_salpend');
  if (elDias) elDias.value = diasSinPagar;
  if (elSal)  elSal.value  = salPend;
}

async function actualizarDatosLiq() {
  var sel = document.getElementById('liq_emp');
  if (!sel) return;
  var empId = parseInt(sel.value);
  var e = await dbGet('empleados', empId);
  if (!e) return;
  await calcularSalPendienteLiq();
  var vacList = await dbGetAll('vacaciones_emp');
  var vacTom = vacList.filter(function(v){ return v.empleadoId===empId && !v.cancelado; }).reduce(function(a,v){return a+(v.dias||0);},0);
  var el = document.getElementById('liq_vactom');
  if (el) el.value = vacTom;
  var info = document.getElementById('liq_datos_emp');
  if (info) {
    var fi = new Date((e.fechaIngreso||'2020-01-01')+'T00:00:00');
    var hoy = new Date(); hoy.setHours(0,0,0,0);
    var dias = Math.floor((hoy-fi)/86400000);
    var anios = Math.floor(dias/365.25);
    var meses = Math.floor((dias - anios*365.25)/30.44);
    info.innerHTML = '<strong>' + e.nombre + '</strong><br>'
      + 'Salario base: <strong>Q ' + (e.salarioBase||0).toFixed(2) + '</strong><br>'
      + 'Ingreso: ' + fechaLegible(e.fechaIngreso) + '<br>'
      + 'Antiguedad: <strong>' + anios + ' anio(s) ' + meses + ' mes(es)</strong><br>'
      + 'Vac. tomadas: <strong>' + vacTom + ' dias</strong>';
  }
}

async function calcularLiquidacionUI() {
  var empId = parseInt(document.getElementById('liq_emp').value);
  var fsal  = document.getElementById('liq_fsal').value;
  var tipo  = document.getElementById('liq_tipo').value;
  var salPend = parseFloat(document.getElementById('liq_salpend').value)||0;
  var vacTom  = parseFloat(document.getElementById('liq_vactom').value)||0;

  if (!empId || !fsal) { toast('Selecciona empleado y fecha de salida', 'red'); return; }
  var e = await dbGet('empleados', empId);
  if (!e) return;

  var r = calcLiquidacion(e, fsal, tipo, salPend, vacTom);
  var tipoLabel = {renuncia:'Renuncia voluntaria',despido_injustificado:'Despido injustificado',despido_justificado:'Despido justificado',mutuo_acuerdo:'Mutuo acuerdo'}[tipo] || tipo;
  var alertColor = tipo === 'renuncia' ? 'amber' : tipo === 'despido_injustificado' ? 'red' : 'blue';

  var html = '<div class="card mt-2">'
    + '<div class="card-header"><span class="card-title">Resultado: ' + e.nombre + '</span>'
    + '<div class="flex gap-1">'
    + '<button class="btn btn-sm btn-secondary" onclick="imprimirFiniquito(' + empId + ',\'' + fsal + '\',\'' + tipo + '\',' + salPend + ',' + vacTom + ')">Imprimir finiquito</button>'
    + (tipo === 'despido_injustificado' || tipo === 'despido_justificado' ? '<button class="btn btn-sm btn-danger" onclick="imprimirCartaFinalizacion(' + empId + ',\'' + fsal + '\',\'' + tipo + '\')">📄 Carta de finalización</button>' : '')
    + '</div></div>'
    + '<div class="alert alert-' + alertColor + '" style="font-size:12px"><strong>' + tipoLabel + '</strong>'
    + (r.tieneIndem ? ' &mdash; Aplica indemnizacion (Art. 82 CT)' : ' &mdash; Sin indemnizacion (Art. 78 CT)') + '</div>'
    + '<div class="stat-grid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr))">'
    + '<div class="stat-card"><div class="stat-label">Dias laborados</div><div class="stat-value" style="font-size:16px">' + r.diasTotales + '</div><div class="stat-sub">' + Math.floor(r.anios) + 'a ' + (Math.floor(r.meses%12)) + 'm</div></div>'
    + '<div class="stat-card stat-amber"><div class="stat-label">Bono 14 prop.</div><div class="stat-value" style="font-size:16px">Q ' + r.b14Prop.toFixed(2) + '</div><div class="stat-sub">Proporcional</div></div>'
    + '<div class="stat-card stat-amber"><div class="stat-label">Aguinaldo prop.</div><div class="stat-value" style="font-size:16px">Q ' + r.aguiProp.toFixed(2) + '</div><div class="stat-sub">Proporcional</div></div>'
    + '<div class="stat-card stat-blue"><div class="stat-label">Vacac. no gozadas</div><div class="stat-value" style="font-size:16px">Q ' + r.vacPend.toFixed(2) + '</div><div class="stat-sub">' + r.diasVacPend + ' dias pend.</div></div>'
    + (r.salPend > 0 ? '<div class="stat-card stat-green"><div class="stat-label">Salario pendiente</div><div class="stat-value" style="font-size:16px">Q ' + r.salPend.toFixed(2) + '</div></div>' : '')
    + (r.tieneIndem ? '<div class="stat-card stat-red"><div class="stat-label">Indemnizacion</div><div class="stat-value" style="font-size:14px">Q ' + r.indem.toFixed(2) + '</div><div class="stat-sub">1 sal/anio (Art.82)</div></div>' : '<div class="stat-card"><div class="stat-label">Indemnizacion</div><div class="stat-value" style="font-size:13px;color:var(--text3)">No aplica</div><div class="stat-sub">' + (tipo==='renuncia'?'Renuncia voluntaria':'Sin causa legal') + '</div></div>')
    + '</div>'
    + '<div style="text-align:right;padding:10px 0;border-top:1px solid var(--border);margin-top:8px">'
    + '<span style="font-size:18px;font-weight:700;color:var(--green)">TOTAL A PAGAR: Q ' + r.total.toFixed(2) + '</span>'
    + '</div>'
    + '<div class="alert alert-blue" style="font-size:11px">Base legal: salario promedio ultimos 6 meses Q ' + r.promSal.toFixed(2) + '/mes. Para el calculo de indemnizacion se aplica el Art. 82 CT (sector privado, sin tope de meses).</div>'
    + '</div>';

  window._liqData = {empId: empId, total: r.total, label: tipoLabel};
  html += '<div style="text-align:center;margin-top:10px">'
    + '<button class="btn btn-primary" onclick="registrarLiquidacionEnCostosActual()">💾 Registrar en costos operativos</button>'
    + '</div>';
  document.getElementById('liq_resultado').innerHTML = html;
}


async function registrarLiquidacionEnCostosActual() {
  if (!window._liqData) return;
  await registrarLiquidacionEnCostos(window._liqData.empId, window._liqData.total, window._liqData.label);
}

async function registrarLiquidacionEnCostos(empId, total, tipoLabel) {
  var e = await dbGet('empleados', empId);
  if (!e) return;
  await dbAdd('costos', {
    fecha: today(), tipo: 'Liquidación laboral',
    descripcion: 'Liquidación: ' + e.nombre + ' (' + tipoLabel + ')',
    monto: total, categoria: 'Planilla', pagado: true,
    empleadoId: empId, createdAt: nowTs(), updatedAt: nowTs()
  });
  await logAuditoria('LIQUIDACION', 'empleados', 'Liquidación registrada para ' + e.nombre, {total: total});
  toast('Liquidación registrada en costos operativos ✓');
}


async function imprimirCartaFinalizacion(empId, fsal, tipo) {
  var e   = await dbGet('empleados', empId);
  var cfg = await dbGet('config','taller') || {};
  if (!e) return;
  var tipoLabel = {
    renuncia:'Renuncia voluntaria',
    despido_injustificado:'Rescisión de contrato sin justa causa',
    despido_justificado:'Rescisión de contrato con justa causa',
    mutuo_acuerdo:'Terminación por mutuo acuerdo'
  }[tipo] || tipo;
  var causas = tipo === 'despido_justificado'
    ? 'Por haber incurrido en causa justificada de acuerdo al Artículo 77 del Código de Trabajo de Guatemala.'
    : tipo === 'renuncia'
    ? 'A solicitud del trabajador, quien presentó renuncia voluntaria.'
    : tipo === 'mutuo_acuerdo'
    ? 'Por mutuo acuerdo entre las partes, conforme al Artículo 83 del Código de Trabajo.'
    : 'Por decisión unilateral del empleador, con derecho a indemnización conforme al Artículo 82 del Código de Trabajo.';

  var w = window.open('','_blank');
  w.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Carta Finalización</title>
  <style>
    body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:48px;max-width:700px;margin:0 auto;line-height:1.7}
    .header{text-align:center;margin-bottom:32px;border-bottom:2px solid #111;padding-bottom:16px}
    .empresa{font-size:18px;font-weight:900}
    .titulo{font-size:15px;font-weight:700;text-align:center;margin:24px 0;text-transform:uppercase;letter-spacing:1px}
    .dato{margin:6px 0}
    .firma-section{display:flex;justify-content:space-between;margin-top:60px}
    .firma-box{text-align:center;width:45%}
    .firma-line{border-top:1px solid #111;margin-bottom:6px}
    @media print{button{display:none}}
  </style>
  </head><body>
  <div class="header">
    <div class="empresa">${cfg.nombre||'TALLER MECÁNICO'}</div>
    <div style="font-size:11px;color:#555">NIT: ${cfg.nit||'CF'} | ${cfg.direccion||''} | ${cfg.telefono||''}</div>
  </div>
  <div class="titulo">Carta de Finalización de Relación Laboral</div>
  <p>Guatemala, ${new Date(fsal+'T00:00:00').toLocaleDateString('es-GT',{day:'numeric',month:'long',year:'numeric'})}</p>
  <br>
  <p>Estimado(a) <strong>${e.nombre}</strong>,</p>
  <p>Por medio de la presente, le comunicamos formalmente que la relación laboral que nos unía con usted 
  en calidad de <strong>${e.cargo||'empleado/a'}</strong>, queda terminada a partir del día 
  <strong>${new Date(fsal+'T00:00:00').toLocaleDateString('es-GT',{day:'numeric',month:'long',year:'numeric'})}</strong>.</p>
  <p><strong>Motivo:</strong> ${tipoLabel}</p>
  <p>${causas}</p>
  <p>La fecha de inicio de la relación laboral fue el <strong>${new Date((e.fechaIngreso||fsal)+'T00:00:00').toLocaleDateString('es-GT',{day:'numeric',month:'long',year:'numeric'})}</strong>, 
  habiendo laborado un total de <strong>${Math.floor((new Date(fsal)-new Date(e.fechaIngreso||fsal))/86400000)} días</strong>.</p>
  <p>Las prestaciones laborales a que tiene derecho serán calculadas y pagadas de conformidad con el 
  Código de Trabajo de Guatemala (Decreto 1441 y sus reformas).</p>
  <p>Le agradecemos los servicios prestados durante el tiempo que formó parte de nuestro equipo de trabajo.</p>
  <br>
  <div class="firma-section">
    <div class="firma-box">
      <div class="firma-line"></div>
      <div><strong>${cfg.nombre||'Empleador'}</strong></div>
      <div style="font-size:10px;color:#555">NIT: ${cfg.nit||''}</div>
      <div style="font-size:10px;color:#555">Representante legal</div>
    </div>
    <div class="firma-box">
      <div class="firma-line"></div>
      <div><strong>${e.nombre}</strong></div>
      <div style="font-size:10px;color:#555">DPI: ${e.dpi||'_______________'}</div>
      <div style="font-size:10px;color:#555">Trabajador(a)</div>
    </div>
  </div>
  <div style="margin-top:40px;font-size:10px;color:#888;text-align:center;border-top:1px solid #eee;padding-top:10px">
    Base legal: Código de Trabajo de Guatemala, Decreto 1441 del Congreso de la República y sus reformas
  </div>
  <br><button onclick="window.print()" style="padding:8px 20px;background:#111;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px">🖨 Imprimir</button>
  </body></html>`);
  w.document.close();
}

// ---- IMPRESION FINIQUITO ----
async function imprimirFiniquito(empId, fsal, tipo, salPend, vacTom) {
  var e   = await dbGet('empleados', empId);
  var cfg = await dbGet('config', 'taller') || {};
  if (!e) return;
  var r = calcLiquidacion(e, fsal, tipo, salPend, vacTom);
  var tipoLabel = {renuncia:'Renuncia voluntaria',despido_injustificado:'Despido injustificado',despido_justificado:'Despido justificado',mutuo_acuerdo:'Mutuo acuerdo'}[tipo] || tipo;
  var w = window.open('','_blank');
  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Finiquito</title>'
    + '<style>body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:32px;max-width:700px;margin:0 auto}'
    + 'h1{font-size:18px;text-align:center}h2{font-size:14px;margin:14px 0 6px}'
    + '.tbl{width:100%;border-collapse:collapse;margin:10px 0}.tbl td,.tbl th{border:1px solid #ccc;padding:6px 10px;font-size:11px}'
    + '.tbl th{background:#f0f0f0;font-weight:700}.total{font-size:14px;font-weight:700;text-align:right;padding:8px 0;border-top:2px solid #333}'
    + '.firma{border-top:1px solid #333;margin-top:50px;padding-top:6px;text-align:center;min-width:200px;display:inline-block}'
    + '@media print{button{display:none}}</style></head><body>'
    + '<h1>' + (cfg.nombre||'EMPRESA') + '</h1>'
    + '<p style="text-align:center;font-size:11px;color:#555">NIT: ' + (cfg.nit||'---') + ' | ' + (cfg.direccion||'') + ' | Tel: ' + (cfg.telefono||'') + '</p>'
    + '<h1 style="margin-top:14px">FINIQUITO LABORAL</h1>'
    + '<p style="text-align:center;font-size:11px">Guatemala, ' + fechaLegible(today()) + '</p>'
    + '<h2>Datos de la relacion laboral</h2>'
    + '<table class="tbl"><tbody>'
    + '<tr><td><strong>Empleado</strong></td><td>' + e.nombre + '</td><td><strong>DPI</strong></td><td>' + (e.dpi||'---') + '</td></tr>'
    + '<tr><td><strong>Cargo</strong></td><td>' + (e.cargo||'---') + '</td><td><strong>Motivo de salida</strong></td><td>' + tipoLabel + '</td></tr>'
    + '<tr><td><strong>Fecha de ingreso</strong></td><td>' + fechaLegible(e.fechaIngreso) + '</td><td><strong>Fecha de salida</strong></td><td>' + fechaLegible(fsal) + '</td></tr>'
    + '<tr><td><strong>Dias laborados</strong></td><td>' + r.diasTotales + ' dias (' + Math.floor(r.anios) + ' anio(s))</td><td><strong>Salario base</strong></td><td>Q ' + r.promSal.toFixed(2) + '/mes</td></tr>'
    + '</tbody></table>'
    + '<h2>Desglose de prestaciones</h2>'
    + '<table class="tbl"><thead><tr><th>Concepto</th><th>Base legal</th><th style="text-align:right">Monto (Q)</th></tr></thead><tbody>'
    + '<tr><td>Bono 14 proporcional</td><td>Decreto 42-92</td><td style="text-align:right">' + r.b14Prop.toFixed(2) + '</td></tr>'
    + '<tr><td>Aguinaldo proporcional</td><td>Decreto 76-78</td><td style="text-align:right">' + r.aguiProp.toFixed(2) + '</td></tr>'
    + '<tr><td>Vacaciones no gozadas (' + r.diasVacPend + ' dias hab.)</td><td>Art. 130 CT</td><td style="text-align:right">' + r.vacPend.toFixed(2) + '</td></tr>'
    + (r.salPend > 0 ? '<tr><td>Salario pendiente de pago</td><td>Art. 88 CT</td><td style="text-align:right">' + r.salPend.toFixed(2) + '</td></tr>' : '')
    + (r.tieneIndem ? '<tr style="background:#fff3f3"><td><strong>Indemnizacion por despido injustificado</strong></td><td>Art. 82 CT</td><td style="text-align:right"><strong>' + r.indem.toFixed(2) + '</strong></td></tr>' : '<tr><td colspan="2" style="color:#888">Indemnizacion: No aplica (' + tipoLabel + ')</td><td style="text-align:right">0.00</td></tr>')
    + '</tbody></table>'
    + '<div class="total">TOTAL A RECIBIR: Q ' + r.total.toFixed(2) + ' (' + numLetras(r.total) + ')</div>'
    + '<p style="font-size:11px;margin-top:12px">El trabajador declara haber recibido conforme las prestaciones laborales detalladas anteriormente, renunciando a cualquier reclamo posterior relacionado con la presente relacion laboral, salvo los derechos irrenunciables establecidos en el Art. 106 de la Constitucion de la Republica de Guatemala.</p>'
    + '<div style="display:flex;justify-content:space-around;margin-top:40px">'
    + '<div style="text-align:center"><div class="firma">' + (cfg.nombre||'EMPLEADOR') + '<br><small>Nombre y firma</small></div></div>'
    + '<div style="text-align:center"><div class="firma">' + e.nombre + '<br><small>Trabajador / DPI: ' + (e.dpi||'---') + '</small></div></div>'
    + '</div>'
    + '<p style="text-align:center;font-size:10px;color:#aaa;margin-top:24px">Documento generado con TallerPro GT | ' + new Date().toLocaleString('es-GT') + '</p>'
    + '</body></html>';
  w.document.write(html);
  w.document.close();
  setTimeout(function(){ w.print(); }, 400);
}

// ---- IMPRESION CARTA DE DESPIDO ----
async function imprimirCartaDespido(empId, fsal, tipo) {
  var e   = await dbGet('empleados', empId);
  var cfg = await dbGet('config', 'taller') || {};
  if (!e) return;
  var esJust = tipo === 'despido_justificado';
  var w = window.open('','_blank');
  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Carta de Despido</title>'
    + '<style>body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:40px;max-width:650px;margin:0 auto;line-height:1.8}'
    + 'h1{font-size:16px}p{margin:10px 0}.firma{border-top:1px solid #333;margin-top:60px;padding-top:6px;min-width:200px;display:inline-block;text-align:center}'
    + '@media print{button{display:none}}</style></head><body>'
    + '<p style="text-align:right">' + (cfg.nombre||'EMPRESA') + '<br>' + (cfg.direccion||'') + '<br>' + fechaLegible(today()) + '</p>'
    + '<p><strong>' + e.nombre + '</strong><br>Cargo: ' + (e.cargo||'---') + '<br>Presente.</p>'
    + '<p>Por este medio se le notifica que ' + (cfg.nombre||'la empresa') + ', con NIT ' + (cfg.nit||'---') + ', ha tomado la decision de dar por terminada la relacion laboral que nos une a partir del dia <strong>' + fechaLegible(fsal) + '</strong>.</p>'
    + (esJust
      ? '<p>Dicha decision se fundamenta en <strong>causa justificada</strong> de conformidad con el Articulo 77 del Codigo de Trabajo de Guatemala (Decreto 1441), especificamente por: _______________________________________________.</p>'
        + '<p>En virtud de lo anterior, la terminacion del contrato de trabajo es por justa causa, por lo que no procede el pago de indemnizacion conforme al Articulo 82 del Codigo de Trabajo. Sin embargo, se le cancelaran las prestaciones proporcionales de ley correspondientes (Bono 14, Aguinaldo, Vacaciones no gozadas y salarios pendientes).</p>'
      : '<p>Esta decision no obedece a causa imputable a su persona, por lo que se configura un despido injustificado en los terminos del Articulo 82 del Codigo de Trabajo de Guatemala. En consecuencia, tendra derecho a percibir la indemnizacion equivalente a un salario ordinario por cada ano de servicios prestados, de manera proporcional, ademas de todas las prestaciones de ley.</p>')
    + '<p>Se le solicita su presencia en las instalaciones de la empresa el dia <strong>_______________</strong> para formalizar su liquidacion y entrega de documentos. Favor traer su DPI y numero de cuenta bancaria.</p>'
    + '<p>Sin otro particular, nos despedimos.</p>'
    + '<div style="display:flex;justify-content:space-around;margin-top:50px">'
    + '<div style="text-align:center"><div class="firma">' + (cfg.nombre||'EMPLEADOR') + '<br><small>Representante legal</small></div></div>'
    + '<div style="text-align:center"><div class="firma">Recibido conforme<br><small>' + e.nombre + ' | Fecha: ______</small></div></div>'
    + '</div>'
    + '<p style="font-size:10px;color:#aaa;text-align:center;margin-top:24px">Machote generado con TallerPro GT | Art. ' + (esJust?'77':'82') + ' Codigo de Trabajo Guatemala | ' + new Date().toLocaleString('es-GT') + '</p>'
    + '</body></html>';
  w.document.write(html);
  w.document.close();
  setTimeout(function(){ w.print(); }, 400);
}

// ---- REPORTE GENERAL ----


function toggleTodosRubros(val) {
  document.querySelectorAll('.rubro_cb').forEach(function(cb){ cb.checked = val; });
}

async function generarReporteSeleccion() {
  var sel = Array.from(document.querySelectorAll('.rubro_cb:checked')).map(function(cb){ return cb.value; });
  if (!sel.length) { toast('Selecciona al menos un rubro', 'red'); return; }
  var periodo = document.getElementById('rep_periodo') ? document.getElementById('rep_periodo').value : today().slice(0,7);
  var titulo  = document.getElementById('rep_titulo')  ? document.getElementById('rep_titulo').value : 'Reporte General';
  var cfg     = await dbGet('config','taller') || {};

  // Cargar datos necesarios
  var [empleados, nomina, vacList, llamadas, facturas, ordenes, repuestos,
       insumos, costos, servicios, cuentas, activos, alertas, clientes,
       proveedores] = await Promise.all([
    dbGetAll('empleados'), dbGetAll('nomina'), dbGetAll('vacaciones_emp'),
    dbGetAll('llamadas_atencion'), dbGetAll('facturas'), dbGetAll('ordenes'),
    dbGetAll('repuestos'), dbGetAll('insumos'), dbGetAll('costos'),
    dbGetAll('servicios'), dbGetAll('cuentas_bancarias'), dbGetAll('activos'),
    dbGetAll('alertas'), dbGetAll('clientes'), dbGetAll('proveedores')
  ]);

  var activos2 = empleados.filter(function(e){ return e.activo !== false; });
  var nominaMes = nomina.filter(function(n){ return n.mes === periodo; });
  var factMes   = facturas.filter(function(f){ return f.fecha && f.fecha.startsWith(periodo); });
  var costosMes = costos.filter(function(c){ return c.fecha && c.fecha.startsWith(periodo); });

  var secHtml = '';
  var numSec  = 1;

  function sec(titulo, tabla) {
    return '<div style="margin-bottom:24px;page-break-inside:avoid">'
      + '<h2 style="font-size:13px;font-weight:700;background:#111;color:#fff;padding:6px 10px;margin:0">'
      + numSec++ + '. ' + titulo + '</h2>' + tabla + '</div>';
  }
  function tbl(headers, rows) {
    return '<table style="width:100%;border-collapse:collapse;font-size:11px">'
      + '<thead><tr>' + headers.map(function(h){ return '<th style="border:1px solid #ccc;background:#f5f5f5;padding:5px 8px;text-align:left;font-size:10px">' + h + '</th>'; }).join('') + '</tr></thead>'
      + '<tbody>' + (rows.length ? rows.join('') : '<tr><td colspan="' + headers.length + '" style="text-align:center;color:#888;padding:8px">Sin datos</td></tr>') + '</tbody>'
      + '</table>';
  }
  function tr(celdas, bold) {
    return '<tr' + (bold?' style="font-weight:700"':'') + '>' + celdas.map(function(c){ return '<td style="border:1px solid #ddd;padding:4px 8px">' + (c||'---') + '</td>'; }).join('') + '</tr>';
  }
  function fmt2(n){ return 'Q ' + parseFloat(n||0).toFixed(2); }

  if (sel.indexOf('empleados') >= 0) {
    secHtml += sec('Empleados activos (' + activos2.length + ')',
      tbl(['Nombre','Cargo','CE','Salario base','Ingreso'],
        activos2.map(function(e){ return tr([e.nombre, e.cargo, e.circunscripcion||'CE1', fmt2(e.salarioBase), fechaLegible(e.fechaIngreso)]); })));
  }

  if (sel.indexOf('provisiones') >= 0) {
    var totProv = {b14:0,agui:0,vac:0,indem:0,igssP:0};
    var provFilas = activos2.map(function(e){
      var sal=e.salarioBase||0;
      var b14=sal/12,agui=sal/12,vac=(sal/30)*15/12,ind=sal/12,igssP=sal*0.1267;
      totProv.b14+=b14;totProv.agui+=agui;totProv.vac+=vac;totProv.indem+=ind;totProv.igssP+=igssP;
      return tr([e.nombre, fmt2(sal), fmt2(b14), fmt2(agui), fmt2(vac), fmt2(ind), fmt2(igssP), fmt2(sal+b14+agui+vac+ind+igssP)]);
    });
    provFilas.push(tr(['TOTALES','',fmt2(totProv.b14),fmt2(totProv.agui),fmt2(totProv.vac),fmt2(totProv.indem),fmt2(totProv.igssP),fmt2(totProv.b14+totProv.agui+totProv.vac+totProv.indem+totProv.igssP)], true));
    secHtml += sec('Provisiones laborales mensuales',
      tbl(['Empleado','Salario','P.Bono14','P.Aguinaldo','P.Vacaciones','P.Indem.','IGSS Patronal','Total carga'],provFilas));
  }

  if (sel.indexOf('vacaciones') >= 0) {
    var vacFilas = activos2.map(function(e){
      var vac = vacList.filter(function(v){return v.empleadoId===e.id&&!v.cancelado;});
      var tom = vac.reduce(function(a,v){return a+(v.dias||0);},0);
      var fi = new Date((e.fechaIngreso||'2020-01-01')+'T00:00:00');
      var dias = Math.floor((new Date()-fi)/86400000);
      var gan = dias >= 150 ? parseFloat(((dias/365)*15).toFixed(1)) : 0;
      return tr([e.nombre, String(gan) + ' dias ganados', String(tom) + ' tomados', String(Math.max(0,gan-tom).toFixed(1)) + ' pendientes']);
    });
    secHtml += sec('Vacaciones por empleado', tbl(['Empleado','Ganadas','Tomadas','Pendientes'], vacFilas));
  }

  if (sel.indexOf('llamadas') >= 0) {
    var llFilas = llamadas.slice().reverse().map(function(l){
      return tr([l.empleadoNombre, fechaLegible(l.fecha), l.tipo, l.descripcion ? l.descripcion.slice(0,60) : '---', l.resuelta?'Resuelta':'Pendiente']);
    });
    secHtml += sec('Llamadas de atencion (' + llamadas.length + ')', tbl(['Empleado','Fecha','Tipo','Descripcion','Estado'], llFilas));
  }

  if (sel.indexOf('facturas') >= 0) {
    var totFac = factMes.reduce(function(a,f){return a+(f.total||0);},0);
    var facFilas = factMes.map(function(f){ return tr([f.noFactura, fechaLegible(f.fecha), f.clienteNombre, f.nit||'CF', fmt2(f.subtotal), fmt2(f.iva), fmt2(f.total), f.pagada?'Pagada':'Pendiente']); });
    facFilas.push(tr(['','','','','','TOTAL',fmt2(totFac),''], true));
    secHtml += sec('Facturacion ' + periodo + ' (' + factMes.length + ' facturas)', tbl(['No.Factura','Fecha','Cliente','NIT','Subtotal','IVA','Total','Estado'], facFilas));
  }

  if (sel.indexOf('costos') >= 0) {
    var totCos = costosMes.reduce(function(a,c){return a+(c.monto||0);},0);
    var cosFilas = costosMes.map(function(c){ return tr([fechaLegible(c.fecha), c.categoria, c.descripcion, fmt2(c.monto)]); });
    cosFilas.push(tr(['','','TOTAL',fmt2(totCos)], true));
    secHtml += sec('Costos operativos ' + periodo, tbl(['Fecha','Categoria','Descripcion','Monto'], cosFilas));
  }

  if (sel.indexOf('bancos') >= 0) {
    var totBan = cuentas.reduce(function(a,c){return a+(c.saldo||0);},0);
    var banFilas = cuentas.map(function(c){ return tr([c.banco, c.tipoCuenta, c.numeroCuenta, fmt2(c.saldo), c.moneda]); });
    banFilas.push(tr(['','','SALDO TOTAL',fmt2(totBan),''], true));
    secHtml += sec('Cuentas bancarias', tbl(['Banco','Tipo','Numero','Saldo','Moneda'], banFilas));
  }

  if (sel.indexOf('repuestos') >= 0) {
    var repFilas = repuestos.filter(function(r){return (r.stock||0)<=(r.stockMin||5);}).map(function(r){ return tr([r.nombre, r.categoria, String(r.stock), String(r.stockMin||5), fmt2(r.precio)]); });
    secHtml += sec('Repuestos con stock bajo (' + repFilas.length + ')', tbl(['Nombre','Categoria','Stock','Minimo','Precio'], repFilas));
  }

  if (sel.indexOf('alertas') >= 0) {
    var altPend = alertas.filter(function(a){return !a.vista;});
    var altFilas = altPend.map(function(a){ return tr([a.tipo, a.titulo, a.descripcion ? a.descripcion.slice(0,60):'---', a.prioridad||'normal', fechaLegible(a.fecha)]); });
    secHtml += sec('Alertas pendientes (' + altPend.length + ')', tbl(['Tipo','Titulo','Descripcion','Prioridad','Fecha'], altFilas));
  }

  if (sel.indexOf('impuestos') >= 0) {
    var ivaTot = factMes.reduce(function(a,f){return a+(f.iva||0);},0);
    var subTot = factMes.reduce(function(a,f){return a+(f.subtotal||0);},0);
    var isrEst = subTot * 0.25;
    secHtml += sec('IVA / ISR estimado ' + periodo,
      tbl(['Concepto','Monto'],[
        tr(['Subtotal neto facturado', fmt2(subTot)]),
        tr(['IVA generado (12%)', fmt2(ivaTot)]),
        tr(['ISR estimado (25% utilidad bruta)', fmt2(isrEst)]),
        tr(['IGSS patronal total', fmt2(activos2.reduce(function(a,e){return a+(e.salarioBase||0)*0.1267;},0))]),
      ]));
  }

  var w = window.open('','_blank');
  var htmlDoc = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>' + titulo + '</title>'
    + '<style>body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:28px;max-width:900px;margin:0 auto}'
    + 'h1{font-size:18px;text-align:center;margin-bottom:4px}h2{font-size:13px}'
    + '.hdr{text-align:center;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:18px}'
    + '@media print{@page{margin:12mm}button{display:none}}</style></head><body>'
    + '<div class="hdr"><h1>' + (cfg.nombre||'EMPRESA') + '</h1>'
    + '<div style="font-size:11px;color:#555">' + titulo + ' &mdash; Periodo: ' + periodo + ' &mdash; Generado: ' + new Date().toLocaleString('es-GT') + '</div></div>'
    + secHtml
    + '</body></html>';
  w.document.write(htmlDoc);
  w.document.close();
  setTimeout(function(){ w.print(); }, 400);
}

function cerrarModal(id){closeModal(id);}

// ================================================================
// MODULO: HISTORIAL DE PAGOS + CALCULOS CORRECTOS BONO14/AGUINALDO
// Base legal confirmada:
// Bono 14 (Dto 42-92): ciclo 1-jul al 30-jun, pago 1-15 julio
//   Formula: (salario / 365) * dias_trabajados_en_ciclo
// Aguinaldo (Dto 76-78): ciclo 1-dic al 30-nov, pago 15 diciembre
//   Formula: (salario / 365) * dias_trabajados_en_ciclo
// Vacaciones (Art 130 CT): 15 dias habiles/anio
//   Contador se reinicia al cumplir cada anio (acumula pendientes)
// ================================================================

// ---- CALCULOS DE CICLOS SEGUN LEY ----

// Calcula dias trabajados dentro de un ciclo (fechaInicio..fechaFin)
function diasEnCiclo(fechaIngreso, fechaSalida, cicloInicio, cicloFin) {
  var fi = new Date(fechaIngreso + 'T00:00:00');
  var fs = new Date(fechaSalida  + 'T00:00:00');
  var ci = new Date(cicloInicio  + 'T00:00:00');
  var cf = new Date(cicloFin     + 'T00:00:00');
  var inicio = fi > ci ? fi : ci;
  var fin    = fs < cf ? fs : cf;
  if (fin < inicio) return 0;
  return Math.floor((fin - inicio) / 86400000) + 1;
}

// Bono 14: ciclo va del 1 de julio del anio anterior al 30 de junio del anio de pago
// Pago: 15 de julio del anio de pago
function calcBono14(salario, fechaIngreso, fechaCorte) {
  var fc = new Date(fechaCorte + 'T00:00:00');
  var anio = fc.getFullYear();
  // El ciclo que se paga en julio de "anio" es: 1-jul-(anio-1) al 30-jun-anio
  var cicloIni = (anio - 1) + '-07-01';
  var cicloFin = anio + '-06-30';
  var fechaPago = anio + '-07-15';
  var dias = diasEnCiclo(fechaIngreso, fechaCorte, cicloIni, cicloFin);
  if (dias <= 0) return {monto:0, dias:0, cicloIni:cicloIni, cicloFin:cicloFin, fechaPago:fechaPago};
  var monto = parseFloat(((salario / 365) * dias).toFixed(2));
  return {monto:monto, dias:dias, cicloIni:cicloIni, cicloFin:cicloFin, fechaPago:fechaPago};
}

// Aguinaldo: ciclo del 1 de diciembre del anio anterior al 30 de noviembre del anio de pago
// Pago: 15 de diciembre del anio de pago
function calcAguinaldo(salario, fechaIngreso, fechaCorte) {
  var fc = new Date(fechaCorte + 'T00:00:00');
  var anio = fc.getFullYear();
  // El ciclo que se paga en diciembre de "anio" es: 1-dic-(anio-1) al 30-nov-anio
  var cicloIni = (anio - 1) + '-12-01';
  var cicloFin = anio + '-11-30';
  var fechaPago = anio + '-12-15';
  var dias = diasEnCiclo(fechaIngreso, fechaCorte, cicloIni, cicloFin);
  if (dias <= 0) return {monto:0, dias:0, cicloIni:cicloIni, cicloFin:cicloFin, fechaPago:fechaPago};
  var monto = parseFloat(((salario / 365) * dias).toFixed(2));
  return {monto:monto, dias:dias, cicloIni:cicloIni, cicloFin:cicloFin, fechaPago:fechaPago};
}

// Calcula el estado de vacaciones con acumulacion correcta
// Regla: Al cumplir 1 anio se ganan 15 dias. Al cumplir 2 anios otros 15, etc.
// Los dias pendientes de anios anteriores se acumulan (no se pierden)
function calcEstadoVacaciones(fechaIngreso, diasTomados) {
  var fi = new Date(fechaIngreso + 'T00:00:00');
  var hoy = new Date(); hoy.setHours(0,0,0,0);
  var diasAnt = Math.floor((hoy - fi) / 86400000);
  var aniosComp = Math.floor(diasAnt / 365.25);
  // Dias ganados = 15 dias por cada anio COMPLETADO
  var diasGanados = aniosComp * 15;
  // Si tiene al menos 150 dias (aprox 5 meses) dentro del primer anio,
  // se incluye proporcional del primer anio en curso
  var diasPendientes = Math.max(0, diasGanados - (diasTomados || 0));
  var proximoAnio = new Date(fi.getTime());
  proximoAnio.setFullYear(fi.getFullYear() + aniosComp + 1);
  var diasParaProximo = Math.floor((proximoAnio - hoy) / 86400000);
  return {
    aniosCompletos: aniosComp,
    diasGanados: diasGanados,
    diasTomados: diasTomados || 0,
    diasPendientes: diasPendientes,
    diasParaProximo: diasParaProximo > 0 ? diasParaProximo : 0,
    fechaProximoAnio: proximoAnio.toISOString().slice(0,10)
  };
}

// ---- HISTORIAL DE PAGOS ----
async function renderHistorialPagos(content, actions) {
  if (!soloAdmin()) { content.innerHTML='<div class="alert alert-red">Solo administradores</div>'; return; }
  var empleados = await dbGetAll('empleados');
  var pagos = await dbGetAll('historial_pagos');
  var activos = empleados.filter(function(e){ return e.activo !== false; });
  actions.innerHTML = '<button class="btn btn-primary" onclick="modalRegistrarPago()">+ Registrar pago</button>'
    + ' <button class="btn btn-secondary" onclick="generarPagosMes()">Generar pagos del mes</button>';

  var opts = activos.map(function(e){
    return '<option value="'+e.id+'">'+e.nombre+'</option>';
  }).join('');

  // Resumen por empleado
  var filas = activos.map(function(e) {
    var pagosEmp = pagos.filter(function(p){ return p.empleadoId === e.id; });
    var ultNomina = pagosEmp.filter(function(p){return p.tipo==='nomina';}).slice(-1)[0];
    var ultB14 = pagosEmp.filter(function(p){return p.tipo==='bono14';}).slice(-1)[0];
    var ultAgui = pagosEmp.filter(function(p){return p.tipo==='aguinaldo';}).slice(-1)[0];
    return '<tr>'
      + '<td><strong>'+e.nombre+'</strong><div style="font-size:10px;color:var(--text3)">'+( e.cargo||'')+'</div></td>'
      + '<td class="td-mono">'+fmt(e.salarioBase||0)+'</td>'
      + '<td style="font-size:11px">'+(ultNomina?fechaLegible(ultNomina.fecha):'Sin registro')+'</td>'
      + '<td style="font-size:11px">'+(ultB14?fechaLegible(ultB14.fecha)+' <span class="badge badge-amber">Q'+( ultB14.monto||0).toFixed(0)+'</span>':'Sin registro')+'</td>'
      + '<td style="font-size:11px">'+(ultAgui?fechaLegible(ultAgui.fecha)+' <span class="badge badge-amber">Q'+(ultAgui.monto||0).toFixed(0)+'</span>':'Sin registro')+'</td>'
      + '<td><div class="flex gap-1">'
      + '<button class="btn btn-sm btn-blue" onclick="verHistorialEmp('+e.id+')">Ver historial</button>'
      + '<button class="btn btn-sm btn-green" onclick="modalRegistrarPago('+e.id+')">+ Pago</button>'
      + '</div></td>'
      + '</tr>';
  }).join('');

  content.innerHTML = '<div class="section-title">Historial de Pagos</div>'
    + '<div class="section-sub">Nomina, Bono 14 y Aguinaldo por empleado segun Decreto 42-92 y 76-78</div>'
    + '<div class="alert alert-blue" style="font-size:11px">'
    + '<strong>Bono 14 (Dto 42-92):</strong> Ciclo 1-jul al 30-jun. Pago: 1-15 julio. Formula: (salario / 365) x dias en ciclo<br>'
    + '<strong>Aguinaldo (Dto 76-78):</strong> Ciclo 1-dic al 30-nov. Pago: 15 diciembre. Misma formula.'
    + '</div>'
    + '<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    + '<thead><tr><th>Empleado</th><th>Salario</th><th>Ultima nomina</th><th>Ultimo Bono 14</th><th>Ultimo Aguinaldo</th><th>Acciones</th></tr></thead>'
    + '<tbody>'+(filas||'<tr><td colspan="6" class="text-center text-muted" style="padding:16px">Sin empleados</td></tr>')+'</tbody>'
    + '</table></div></div>';
}

async function verHistorialEmp(empId) {
  var e = await dbGet('empleados', empId);
  var pagos = await dbGetAll('historial_pagos');
  var vacList = await dbGetAll('vacaciones_emp');
  if (!e) return;
  var pagosEmp = pagos.filter(function(p){return p.empleadoId===empId;}).sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;});
  var diasTom = vacList.filter(function(v){return v.empleadoId===empId&&!v.cancelado;}).reduce(function(a,v){return a+(v.dias||0);},0);
  var vac = calcEstadoVacaciones(e.fechaIngreso||today(), diasTom);

  // Calcular proximo Bono 14 y Aguinaldo
  var b14 = calcBono14(e.salarioBase||0, e.fechaIngreso||today(), today());
  var agui = calcAguinaldo(e.salarioBase||0, e.fechaIngreso||today(), today());

  var icons = {nomina:'$',bono14:'B14',aguinaldo:'AGU',vacacion:'VAC',otro:'+'};
  var badgeColor = {nomina:'green',bono14:'amber',aguinaldo:'amber',vacacion:'blue',otro:'gray'};
  var filasPag = pagosEmp.map(function(p){
    return '<tr>'
      + '<td>'+fechaLegible(p.fecha)+'</td>'
      + '<td><span class="badge badge-'+(badgeColor[p.tipo]||'gray')+'">'+(icons[p.tipo]||p.tipo)+'</span> '+(p.descripcion||p.tipo)+'</td>'
      + '<td class="td-mono td-right text-green">Q '+( p.monto||0).toFixed(2)+'</td>'
      + '<td style="font-size:10px;color:var(--text3)">'+(p.periodo||'')+'</td>'
      + '<td style="font-size:10px;color:var(--text2)">'+(p.notas||'')+'</td>'
      + '</tr>';
  }).join('');

  openModal('histEmp', 'Historial: '+e.nombre,
    '<div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">'
    + '<div class="stat-card stat-green"><div class="stat-label">Vac. pendientes</div><div class="stat-value" style="font-size:15px">'+vac.diasPendientes+' dias</div><div class="stat-sub">'+vac.aniosCompletos+' anio(s) comp.</div></div>'
    + '<div class="stat-card stat-amber"><div class="stat-label">B14 acumulado</div><div class="stat-value" style="font-size:15px">Q '+b14.monto.toFixed(0)+'</div><div class="stat-sub">'+b14.dias+' dias en ciclo</div></div>'
    + '<div class="stat-card stat-amber"><div class="stat-label">Agui. acumulado</div><div class="stat-value" style="font-size:15px">Q '+agui.monto.toFixed(0)+'</div><div class="stat-sub">'+agui.dias+' dias en ciclo</div></div>'
    + '<div class="stat-card"><div class="stat-label">Prox. renovacion vac.</div><div class="stat-value" style="font-size:12px">'+vac.diasParaProximo+' dias</div><div class="stat-sub">'+fechaLegible(vac.fechaProximoAnio)+'</div></div>'
    + '</div>'
    + '<div class="alert alert-blue" style="font-size:11px">'
    + '<strong>Ciclo B14 actual:</strong> '+b14.cicloIni+' al '+b14.cicloFin+' | Pago: '+b14.fechaPago+'<br>'
    + '<strong>Ciclo Aguinaldo actual:</strong> '+agui.cicloIni+' al '+agui.cicloFin+' | Pago: '+agui.fechaPago
    + '</div>'
    + '<div class="form-row form-row-2" style="margin-bottom:10px">'
    + '<button class="btn btn-sm btn-green" onclick="cerrarModal(\'histEmp\');modalRegistrarPago('+empId+')">+ Registrar pago</button>'
    + '</div>'
    + '<div class="table-wrap"><table>'
    + '<thead><tr><th>Fecha</th><th>Tipo / Concepto</th><th class="td-right">Monto</th><th>Periodo</th><th>Notas</th></tr></thead>'
    + '<tbody>'+(filasPag||'<tr><td colspan="5" class="text-center text-muted" style="padding:16px">Sin registros de pago</td></tr>')+'</tbody>'
    + '</table></div>',
    function(){ cerrarModal('histEmp'); }, false);
}

async function modalRegistrarPago(empId) {
  var empleados = await dbGetAll('empleados');
  var activos = empleados.filter(function(e){ return e.activo !== false; });
  var opts = activos.map(function(e){
    return '<option value="'+e.id+'"'+(empId===e.id?' selected':'')+'>'+e.nombre+'</option>';
  }).join('');

  openModal('regPago', 'Registrar Pago',
    '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Empleado *</label><select id="rp_emp" onchange="calcPagoAuto()">'+opts+'</select></div>'
    + '<div class="form-group"><label>Tipo de pago *</label>'
    + '<select id="rp_tipo" onchange="calcPagoAuto()">'
    + '<option value="nomina">Nomina mensual</option>'
    + '<option value="bono14">Bono 14 (Decreto 42-92)</option>'
    + '<option value="aguinaldo">Aguinaldo (Decreto 76-78)</option>'
    + '<option value="vacacion">Vacaciones pagadas</option>'
    + '<option value="otro">Otro pago</option>'
    + '</select></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Fecha de pago *</label><input id="rp_fecha" type="date" value="'+today()+'" oninput="calcPagoAuto()"></div>'
    + '<div class="form-group"><label>Monto (Q) *</label><input id="rp_monto" type="number" step="0.01" min="0"></div>'
    + '</div>'
    + '<div id="rp_calculo" style="background:var(--bg3);border-radius:6px;padding:10px;margin-bottom:10px;font-size:12px;display:none"></div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Periodo cubierto</label><input id="rp_periodo" placeholder="Ej: 2026-07, Jul 2024 - Jun 2025"></div>'
    + '<div class="form-group"><label>Forma de pago</label><select id="rp_forma"><option value="transferencia">Transferencia bancaria</option><option value="efectivo">Efectivo</option><option value="cheque">Cheque</option></select></div>'
    + '</div>'
    + '<div class="form-group"><label>Notas</label><textarea id="rp_notas" style="min-height:50px" placeholder="Detalles, numero de transaccion..."></textarea></div>',
    async function() {
      var empId2 = parseInt(document.getElementById('rp_emp').value);
      var monto  = parseFloat(document.getElementById('rp_monto').value)||0;
      var fecha  = document.getElementById('rp_fecha').value;
      if (!empId2 || !monto || !fecha) { toast('Empleado, monto y fecha requeridos','red'); return; }
      var e2 = await dbGet('empleados', empId2);
      await dbAdd('historial_pagos', {
        empleadoId:empId2, empleadoNombre:e2?e2.nombre:'',
        tipo:document.getElementById('rp_tipo').value,
        fecha:fecha, monto:monto,
        periodo:document.getElementById('rp_periodo').value,
        formaPago:document.getElementById('rp_forma').value,
        notas:document.getElementById('rp_notas').value.trim(),
        descripcion:document.getElementById('rp_tipo').options[document.getElementById('rp_tipo').selectedIndex].text,
        createdAt:nowTs()
      });
      // Si es nomina, tambien registrar en costos
      await dbAdd('costos',{
        fecha:fecha, categoria:'Salarios',
        descripcion:'Nomina: '+(e2?e2.nombre:''),
        monto:monto, recurrente:false, createdAt:nowTs()
      });
      cerrarModal('regPago'); toast('Pago registrado');
    }, true);

  setTimeout(calcPagoAuto, 200);
}

async function calcPagoAuto() {
  var empEl   = document.getElementById('rp_emp');
  var tipoEl  = document.getElementById('rp_tipo');
  var fechaEl = document.getElementById('rp_fecha');
  var montoEl = document.getElementById('rp_monto');
  var calcEl  = document.getElementById('rp_calculo');
  var periEl  = document.getElementById('rp_periodo');
  if (!empEl || !tipoEl || !fechaEl) return;

  var empId = parseInt(empEl.value);
  var tipo  = tipoEl.value;
  var fecha = fechaEl.value;
  if (!empId || !fecha) return;

  var e = await dbGet('empleados', empId);
  if (!e) return;
  var sal = e.salarioBase || 0;
  var fi  = e.fechaIngreso || today();

  if (tipo === 'nomina') {
    if (montoEl) montoEl.value = sal.toFixed(2);
    if (periEl)  periEl.value  = fecha.slice(0,7);
    if (calcEl)  { calcEl.style.display='block'; calcEl.innerHTML = 'Nomina mensual: <strong>Q '+sal.toFixed(2)+'</strong> (salario base)'; }

  } else if (tipo === 'bono14') {
    var r = calcBono14(sal, fi, fecha);
    if (montoEl) montoEl.value = r.monto.toFixed(2);
    if (periEl)  periEl.value  = r.cicloIni+' al '+r.cicloFin;
    if (calcEl)  {
      calcEl.style.display = 'block';
      calcEl.innerHTML = '<strong>Calculo Bono 14 (Decreto 42-92):</strong><br>'
        + 'Ciclo: '+r.cicloIni+' al '+r.cicloFin+'<br>'
        + 'Dias en ciclo: '+r.dias+' dias<br>'
        + 'Formula: (Q'+sal.toFixed(2)+' / 365) x '+r.dias+' = <strong>Q '+r.monto.toFixed(2)+'</strong><br>'
        + '<span style="color:var(--text3);font-size:10px">Fecha de pago legal: '+r.fechaPago+'</span>';
    }

  } else if (tipo === 'aguinaldo') {
    var r2 = calcAguinaldo(sal, fi, fecha);
    if (montoEl) montoEl.value = r2.monto.toFixed(2);
    if (periEl)  periEl.value  = r2.cicloIni+' al '+r2.cicloFin;
    if (calcEl)  {
      calcEl.style.display = 'block';
      calcEl.innerHTML = '<strong>Calculo Aguinaldo (Decreto 76-78):</strong><br>'
        + 'Ciclo: '+r2.cicloIni+' al '+r2.cicloFin+'<br>'
        + 'Dias en ciclo: '+r2.dias+' dias<br>'
        + 'Formula: (Q'+sal.toFixed(2)+' / 365) x '+r2.dias+' = <strong>Q '+r2.monto.toFixed(2)+'</strong><br>'
        + '<span style="color:var(--text3);font-size:10px">Fecha de pago legal: '+r2.fechaPago+'</span>';
    }
  } else {
    if (calcEl) calcEl.style.display = 'none';
  }
}

async function generarPagosMes() {
  var empleados = await dbGetAll('empleados');
  var activos = empleados.filter(function(e){ return e.activo !== false; });
  if (!activos.length) { toast('Sin empleados activos','amber'); return; }
  if (!confirm('Registrar pago de nomina de '+today().slice(0,7)+' para '+activos.length+' empleados?')) return;
  var mesActual = today().slice(0,7);
  var pagos = await dbGetAll('historial_pagos');
  var yaRegistrados = pagos.filter(function(p){return p.tipo==='nomina'&&p.periodo===mesActual;}).map(function(p){return p.empleadoId;});
  var count = 0;
  for (var i=0; i<activos.length; i++) {
    var e = activos[i];
    if (yaRegistrados.indexOf(e.id) >= 0) continue; // ya se pago este mes
    await dbAdd('historial_pagos',{
      empleadoId:e.id, empleadoNombre:e.nombre, tipo:'nomina',
      fecha:today(), monto:e.salarioBase||0, periodo:mesActual,
      descripcion:'Nomina mensual', formaPago:'transferencia', createdAt:nowTs()
    });
    await dbAdd('costos',{fecha:today(),categoria:'Salarios',descripcion:'Nomina: '+e.nombre,monto:e.salarioBase||0,recurrente:false,createdAt:nowTs()});
    count++;
  }
  toast(count+' pagos de nomina registrados');
  await navTo('historial_pagos');
}

// ---- CAMBIADOR DE TEMA (COLORES) ----
var TEMAS = {
  oscuro: {
    '--bg':'#0f0f0f','--bg2':'#1a1a1a','--bg3':'#242424','--bg4':'#2e2e2e',
    '--border':'#333','--border2':'#444','--text':'#e8e4dc','--text2':'#9a9690','--text3':'#5a5650',
    '--accent':'#e8a820','--accent2':'#f0c050','--green':'#4caf7d','--red':'#e05a4e',
    '--blue':'#4a9eff','--purple':'#9b7fff',
    label:'Oscuro (defecto)'
  },
  claro: {
    '--bg':'#f5f5f0','--bg2':'#ffffff','--bg3':'#f0ede8','--bg4':'#e8e4de',
    '--border':'#d0ccc8','--border2':'#b8b4b0','--text':'#1a1814','--text2':'#5a5650','--text3':'#9a9690',
    '--accent':'#c97a10','--accent2':'#e8a820','--green':'#2e7d52','--red':'#c0392b',
    '--blue':'#1565c0','--purple':'#6a3fc0',
    label:'Claro'
  },
  verde: {
    '--bg':'#0a0f0a','--bg2':'#111911','--bg3':'#1a241a','--bg4':'#222e22',
    '--border':'#2a3a2a','--border2':'#3a4e3a','--text':'#d8f0d0','--text2':'#7a9870','--text3':'#4a6440',
    '--accent':'#4caf7d','--accent2':'#6fcf97','--green':'#27ae60','--red':'#e05a4e',
    '--blue':'#4a9eff','--purple':'#9b7fff',
    label:'Verde noche'
  },
  azul: {
    '--bg':'#0a0d14','--bg2':'#111520','--bg3':'#181e2e','--bg4':'#202840',
    '--border':'#2a3050','--border2':'#3a4068','--text':'#d0d8f0','--text2':'#7080b8','--text3':'#4050a0',
    '--accent':'#4a9eff','--accent2':'#6bb8ff','--green':'#4caf7d','--red':'#e05a4e',
    '--blue':'#7ab8ff','--purple':'#b89fff',
    label:'Azul noche'
  },
  alto_contraste: {
    '--bg':'#000000','--bg2':'#0a0a0a','--bg3':'#141414','--bg4':'#1e1e1e',
    '--border':'#444','--border2':'#666','--text':'#ffffff','--text2':'#cccccc','--text3':'#888888',
    '--accent':'#ffdd00','--accent2':'#ffee44','--green':'#00ff88','--red':'#ff4444',
    '--blue':'#44aaff','--purple':'#cc88ff',
    label:'Alto contraste'
  },
  cafe: {
    '--bg':'#1a1208','--bg2':'#231a0e','--bg3':'#2e2214','--bg4':'#3c2e1e',
    '--border':'#4a3826','--border2':'#5e4a32','--text':'#f0e0c8','--text2':'#b89870','--text3':'#806040',
    '--accent':'#d4843c','--accent2':'#e8a050','--green':'#7ab864','--red':'#e05a4e',
    '--blue':'#6090c8','--purple':'#9870c8',
    label:'Cafe (calido)'
  }
};

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
function leerArchivoTexto(file) {
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

async function renderImportarSAT(content, actions) {
  actions.innerHTML = '<button class="btn btn-secondary" onclick="registrarTotalSATEnCostos()">💰 Registrar total del mes en costos</button>';

  var costos = await dbGetAll('costos');
  var satCosts = costos.filter(function(c){ return c.fuenteSAT; });

  // Agrupar por mes
  var porMes = {};
  satCosts.forEach(function(c) {
    var mes = (c.fechaMes || c.fecha || '').slice(0,7);
    if (!mes) return;
    if (!porMes[mes]) porMes[mes] = { facturas: [], total: 0 };
    porMes[mes].facturas.push(c);
    porMes[mes].total += c.monto || 0;
  });
  var meses = Object.keys(porMes).sort().reverse();

  var histHTML = '';
  if (!meses.length) {
    histHTML = '<div style="text-align:center;padding:24px;color:var(--text3)">No hay facturas SAT cargadas aún</div>';
  } else {
    meses.forEach(function(mes) {
      var data = porMes[mes];
      var d = new Date(mes + '-01T12:00:00');
      var label = d.toLocaleDateString('es-GT', {month:'long', year:'numeric'});
      var yaEnCostos = costos.some(function(c){ return c.categoriasSAT && c.fechaMes === mes; });
      histHTML += '<div class="card" style="margin-bottom:10px">'
        + '<div class="card-header">'
        + '<span class="card-title" style="text-transform:capitalize">📅 ' + label + '</span>'
        + '<div style="display:flex;align-items:center;gap:8px">'
        + '<span style="font-family:var(--font-mono);font-weight:700;color:var(--green)">Q ' + data.total.toFixed(2) + '</span>'
        + '<span style="font-size:11px;color:var(--text3)">' + data.facturas.length + ' facturas</span>'
        + (yaEnCostos
            ? '<span class="badge badge-green">✓ En costos</span>'
            : '<button class="btn btn-sm btn-primary" onclick="_regSAT(this)" data-mes="' + mes + '">→ Registrar en costos</button>')
        + '</div></div>'
        + '<div style="max-height:160px;overflow-y:auto">'
        + '<table class="table"><thead><tr><th>Fecha</th><th>Emisor</th><th>NIT</th><th>Total</th><th>Serie</th></tr></thead>'
        + '<tbody>' + data.facturas.map(function(c){
            return '<tr><td>' + fechaLegible(c.fecha) + '</td>'
              + '<td style="font-size:11px">' + (c.descripcion||'') + '</td>'
              + '<td style="font-family:var(--font-mono);font-size:11px">' + (c.nitEmisor||'') + '</td>'
              + '<td style="font-family:var(--font-mono)">Q ' + (c.monto||0).toFixed(2) + '</td>'
              + '<td style="font-size:10px;color:var(--text3)">' + (c.serieFEL||'') + '</td></tr>';
          }).join('') + '</tbody></table>'
        + '</div></div>';
    });
  }

  content.innerHTML = '<div class="section-title">📥 Facturas recibidas del Portal SAT</div>'
    + '<div class="section-sub">Las facturas se agrupan por mes. Solo el total mensual se registra en Costos Operativos.</div>'
    + '<div class="card" style="margin-bottom:16px">'
    + '<div class="alert alert-blue" style="font-size:11px;margin-bottom:14px">'
    + '<strong>Cómo obtener el CSV del SAT:</strong><br>'
    + '1. Entra a <strong>portal.sat.gob.gt</strong> → Servicios → Facturas Electrónicas → Documentos recibidos<br>'
    + '2. Filtra por mes → clic en <strong>Descargar CSV</strong><br>'
    + '3. Sube ese archivo aquí para guardarlo. Al final del mes presiona "Registrar en costos".</div>'
    + '<div style="margin-bottom:12px">'
    + '<label style="display:block;font-size:12px;font-weight:600;color:var(--text2);margin-bottom:6px">Seleccionar archivo CSV del SAT:</label>'
    + '<input id="sat_file_inp" type="file" accept=".csv,.txt,.CSV" style="font-size:13px;color:var(--text2);padding:8px;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;width:100%">'
    + '</div>'
    + '<button class="btn btn-primary" onclick="procesarCSVSAT()">Cargar y guardar facturas</button>'
    + '<div id="sat_preview" style="margin-top:12px"></div>'
    + '</div>'
    + '<div class="section-title" style="font-size:15px;margin-bottom:8px">Historial por mes</div>'
    + histHTML;
}


function _regSAT(btn) {
  var mes = btn.getAttribute('data-mes');
  if (mes) registrarMesSATEnCostos(mes);
}
async function registrarMesSATEnCostos(mes) {
  var costos = await dbGetAll('costos');
  var satCosts = costos.filter(function(c){ return c.fuenteSAT && (c.fechaMes||c.fecha||'').slice(0,7) === mes; });
  if (!satCosts.length) { toast('No hay facturas SAT para este mes', 'amber'); return; }
  // Verificar si ya está registrado
  var yaExiste = costos.some(function(c){ return c.categoriasSAT && c.fechaMes === mes; });
  if (yaExiste) { if (!confirm('Ya hay un registro SAT para ' + mes + '. ¿Reemplazar?')) return; }
  var total = satCosts.reduce(function(a,c){ return a + (c.monto||0); }, 0);
  var d = new Date(mes + '-01T12:00:00');
  var label = d.toLocaleDateString('es-GT', {month:'long', year:'numeric'});
  await dbAdd('costos', {
    fecha: mes + '-01',
    fechaMes: mes,
    tipo: 'Facturas SAT',
    descripcion: 'Total facturas recibidas SAT — ' + label,
    monto: parseFloat(total.toFixed(2)),
    categoria: 'Gastos con factura SAT',
    categoriasSAT: true,
    pagado: true,
    createdAt: nowTs(), updatedAt: nowTs()
  });
  await logAuditoria('REGISTRAR','costos','Total SAT ' + mes + ' registrado en costos: Q' + total.toFixed(2), {mes:mes});
  toast('✓ Q ' + total.toFixed(2) + ' registrado en Costos Operativos para ' + label);
  await navTo('importar_sat');
}

async function registrarTotalSATEnCostos() {
  var mes = today().slice(0,7);
  await registrarMesSATEnCostos(mes);
}


async function procesarCSVSAT() {
  var input = document.getElementById('sat_file_inp');
  if (!input || !input.files || !input.files[0]) {
    toast('Primero selecciona un archivo CSV', 'amber');
    return;
  }
  var file = input.files[0];
  var preview = document.getElementById('sat_preview');
  preview.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3)">⏳ Procesando archivo...</div>';

  try {
    var texto = await leerArchivoTexto(file);
    var lineas = texto.trim().split(/\r?\n/).filter(function(l){ return l.trim(); });
    if (lineas.length < 2) {
      preview.innerHTML = '<div class="alert alert-red">El archivo está vacío o no tiene datos</div>';
      return;
    }

    // Detectar separador (coma, punto y coma o tab)
    var sep = lineas[0].includes(';') ? ';' : lineas[0].includes('\t') ? '\t' : ',';
    var header = lineas[0].split(sep).map(function(h){
      return h.trim().replace(/"/g,'').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'') // quitar tildes
        .replace(/\s+/g,'_');
    });

    // Columnas del SAT Guatemala (nombres en español)
    var col = {
      fecha:  buscarCol(header, ['fecha_emision','fecha','date','fecha_autorizacion']),
      nit:    buscarCol(header, ['nit_emisor','nit','vendedor_nit','emisor_nit']),
      nombre: buscarCol(header, ['nombre_emisor','razon_social','emisor','vendedor','nombre']),
      total:  buscarCol(header, ['total','monto','importe','valor_total','gran_total']),
      serie:  buscarCol(header, ['serie','autorizacion','uuid','no_documento','numero']),
      tipo:   buscarCol(header, ['tipo_documento','tipo','clase_documento']),
    };

    var rows = [];
    for (var i = 1; i < lineas.length; i++) {
      var cols = parsearLinea(lineas[i], sep);
      var total = parseFloat((get(cols, col.total)||'0').replace(/[Q\s,]/g,'')) || 0;
      if (total <= 0) continue;
      var fecha = normalFecha(get(cols, col.fecha));
      rows.push({
        fecha: fecha,
        nitEmisor: get(cols, col.nit),
        descripcion: get(cols, col.nombre) || 'Proveedor SAT',
        monto: total,
        serieFEL: get(cols, col.serie),
        tipo: get(cols, col.tipo) || 'FACT'
      });
    }

    if (!rows.length) {
      preview.innerHTML = '<div class="alert alert-red">No se encontraron facturas válidas. Verifica que el archivo sea el CSV correcto del SAT.</div>'
        + '<div style="font-size:11px;color:var(--text3);margin-top:8px">Columnas detectadas: ' + header.join(', ') + '</div>';
      return;
    }

    var totalQ = rows.reduce(function(a,r){ return a+r.monto; }, 0);
    preview.innerHTML = '<div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px">'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:center">'
      + '<div><div style="font-size:22px;font-weight:700;color:var(--green)">' + rows.length + '</div><div style="font-size:11px;color:var(--text3)">Facturas encontradas</div></div>'
      + '<div><div style="font-size:18px;font-weight:700;color:var(--accent)">Q ' + totalQ.toFixed(2) + '</div><div style="font-size:11px;color:var(--text3)">Total</div></div>'
      + '</div></div>'
      + '<div style="max-height:200px;overflow-y:auto;margin-bottom:12px">'
      + '<table class="table"><thead><tr><th>Fecha</th><th>Emisor</th><th>NIT</th><th>Total</th></tr></thead><tbody>'
      + rows.slice(0,10).map(function(r){
          return '<tr><td>'+(r.fecha||'')+'</td><td style="font-size:11px">'+r.descripcion+'</td>'
            +'<td style="font-family:var(--font-mono);font-size:11px">'+r.nitEmisor+'</td>'
            +'<td style="font-family:var(--font-mono)">Q '+r.monto.toFixed(2)+'</td></tr>';
        }).join('')
      + (rows.length>10?'<tr><td colspan="4" style="text-align:center;color:var(--text3);font-size:11px">...y '+(rows.length-10)+' más</td></tr>':'')
      + '</tbody></table></div>'
      + '<button class="btn btn-primary" style="width:100%" onclick="importarFacturasSAT()">✓ Guardar ' + rows.length + ' facturas del SAT</button>';
    window._satRows = rows;
  } catch(e) {
    preview.innerHTML = '<div class="alert alert-red">Error: ' + e.message + '</div>';
  }
}

async function importarFacturasSAT(rows) {
  if (!rows || !rows.length) rows = window._satRows;
  if (!rows || !rows.length) { toast('No hay facturas para guardar. Vuelve a cargar el archivo.', 'red'); return; }
  var importados = 0;
  for (var i=0; i<rows.length; i++) {
    var r = rows[i];
    // Guardar cada factura individualmente (sin tocar costos operativos)
    await dbAdd('costos', {
      fecha: r.fecha,
      fechaMes: (r.fecha||today()).slice(0,7),
      tipo: 'Factura SAT',
      descripcion: r.descripcion,
      monto: r.monto,
      categoria: 'Factura SAT',
      nitEmisor: r.nitEmisor,
      serieFEL: r.serieFEL || '',
      fuenteSAT: true,
      pagado: true,
      createdAt: nowTs(), updatedAt: nowTs()
    });
    importados++;
  }
  await logAuditoria('IMPORTAR','sat','Facturas SAT guardadas: '+importados,{total:importados});
  toast('✓ ' + importados + ' facturas guardadas. Presiona "Registrar en costos" al cierre del mes.');
  window._satRows = null;
  await navTo('importar_sat');
}


/* ================================================================
   MÓDULO DE BODEGAS / SUCURSALES
   ================================================================ */

/* ================================================================
   MÓDULO BODEGAS - Sub-módulo de Inventario con traslados
   ================================================================ */
async function renderBodegas(content, actions) {
  var bodegas = await dbGetAll('bodegas');
  var repuestos = await dbGetAll('repuestos');
  var insumos = await dbGetAll('insumos');

  actions.innerHTML = '<button class="btn btn-primary" onclick="modalBodega()">+ Nueva bodega</button>'
    + ' <button class="btn btn-secondary" onclick="modalTraslado()">⇄ Traslado entre bodegas</button>';

  var html = '<div class="section-title">🏭 Bodegas y Sucursales</div>'
    + '<div class="section-sub">Inventario de repuestos e insumos por bodega. Controla traslados entre ubicaciones.</div>';

  if (!bodegas.length) {
    html += '<div class="empty-state"><div class="empty-icon">🏭</div>'
      + '<div class="empty-title">Sin bodegas registradas</div>'
      + '<div class="empty-sub">Agrega tus sucursales y bodegas para controlar inventario por ubicación</div>'
      + '<button class="btn btn-primary" onclick="modalBodega()">+ Agregar bodega</button></div>';
    content.innerHTML = html; return;
  }

  // Tabs: Resumen | Repuestos | Insumos | Traslados
  html += '<div style="display:flex;gap:4px;margin-bottom:16px;flex-wrap:wrap">'
    + ['resumen','repuestos','insumos','traslados'].map(function(t,i){
        var labels = ['📊 Resumen','🔧 Repuestos','🧴 Insumos','⇄ Traslados'];
        return '<button onclick="mostrarTabBodega(\'' + t + '\')" id="tab_bod_' + t + '" class="btn ' + (i===0?'btn-primary':'btn-secondary') + '" style="font-size:12px">' + labels[i] + '</button>';
      }).join('')
    + '</div>';

  // Panel resumen
  html += '<div id="panel_bod_resumen">';
  bodegas.forEach(function(b) {
    var reps = repuestos.filter(function(r){ return r.bodegaId === b.id; });
    var inss = insumos.filter(function(s){ return s.bodegaId === b.id; });
    var bajoRep = reps.filter(function(r){ return r.stock <= (r.stockMin||0); }).length;
    var bajoIns = inss.filter(function(s){ return s.stock <= (s.stockMin||0); }).length;
    var valorRep = reps.reduce(function(a,r){ return a+(r.stock*(r.costo||0)); }, 0);
    html += '<div class="card" style="margin-bottom:10px">'
      + '<div class="card-header"><span class="card-title">🏭 ' + b.nombre + '</span>'
      + '<div class="flex gap-1">'
      + '<button class="btn btn-sm btn-secondary" onclick="mostrarTabBodega(\'repuestos\')">Ver repuestos</button>'
      + '<button class="btn btn-sm btn-secondary" onclick="mostrarTabBodega(\'insumos\')">Ver insumos</button>'
      + '<button class="btn btn-sm btn-secondary" onclick="modalBodega(' + b.id + ')">✏️</button>'
      + '</div></div>'
      + '<div class="stat-grid" style="grid-template-columns:repeat(4,1fr);margin-top:8px">'
      + '<div class="stat-card"><div class="stat-label">Ubicación</div><div style="font-size:12px">' + (b.direccion||'—') + '</div></div>'
      + '<div class="stat-card stat-blue"><div class="stat-label">Repuestos</div><div class="stat-value" style="font-size:18px">' + reps.length + '</div></div>'
      + '<div class="stat-card stat-green"><div class="stat-label">Insumos</div><div class="stat-value" style="font-size:18px">' + inss.length + '</div></div>'
      + '<div class="stat-card ' + ((bajoRep+bajoIns)>0?'stat-red':'stat-green') + '"><div class="stat-label">Bajo stock</div><div class="stat-value" style="font-size:18px">' + (bajoRep+bajoIns) + '</div></div>'
      + '</div>'
      + '<div style="font-size:11px;color:var(--text3);margin-top:6px">Valor en repuestos: ' + fmt(valorRep) + ' · Tipo: ' + (b.tipo||'—') + ' · Resp: ' + (b.responsable||'—') + '</div>'
      + '</div>';
  });
  html += '</div>';

  // Panel repuestos por bodega
  html += '<div id="panel_bod_repuestos" style="display:none">';
  html += '<table class="table"><thead><tr><th>Item</th><th>Bodega</th><th>Stock</th><th>Mín.</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
  var repsBodega = repuestos.filter(function(r){ return r.bodegaId; });
  if (!repsBodega.length) html += '<tr><td colspan="6" class="text-center text-muted">Sin repuestos asignados a bodegas</td></tr>';
  repsBodega.forEach(function(r) {
    var b = bodegas.find(function(x){ return x.id===r.bodegaId; });
    var bajo = r.stock <= (r.stockMin||0);
    html += '<tr><td>' + r.nombre + '</td><td>' + (b?b.nombre:'—') + '</td>'
      + '<td class="td-mono">' + r.stock + '</td><td class="td-mono">' + (r.stockMin||0) + '</td>'
      + '<td><span class="badge badge-' + (bajo?'red':'green') + '">' + (bajo?'⚠ Bajo':'OK') + '</span></td>'
      + '<td><button class="btn btn-sm btn-secondary" onclick="modalTrasladoItem(' + r.id + ',\'repuesto\')">⇄ Trasladar</button></td>'
      + '</tr>';
  });
  html += '</tbody></table></div>';

  // Panel insumos por bodega
  html += '<div id="panel_bod_insumos" style="display:none">';
  html += '<table class="table"><thead><tr><th>Insumo</th><th>Bodega</th><th>Stock</th><th>Unidad</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
  var inssBodega = insumos.filter(function(s){ return s.bodegaId; });
  if (!inssBodega.length) html += '<tr><td colspan="6" class="text-center text-muted">Sin insumos asignados a bodegas</td></tr>';
  inssBodega.forEach(function(s) {
    var b = bodegas.find(function(x){ return x.id===s.bodegaId; });
    var bajo = s.stock <= (s.stockMin||0);
    html += '<tr><td>' + s.nombre + '</td><td>' + (b?b.nombre:'—') + '</td>'
      + '<td class="td-mono">' + s.stock + '</td><td>' + (s.unidad||'un') + '</td>'
      + '<td><span class="badge badge-' + (bajo?'red':'green') + '">' + (bajo?'⚠ Bajo':'OK') + '</span></td>'
      + '<td><button class="btn btn-sm btn-secondary" onclick="modalTrasladoItem(' + s.id + ',\'insumo\')">⇄ Trasladar</button></td>'
      + '</tr>';
  });
  html += '</tbody></table></div>';

  // Panel traslados
  html += '<div id="panel_bod_traslados" style="display:none">';
  var traslados = await dbGetAll('traslados');
  if (!traslados.length) {
    html += '<div class="empty-state">Sin traslados registrados aún.</div>';
  } else {
    traslados.sort(function(a,b){ return (a.fecha||'')<(b.fecha||'')?1:-1; });
    html += '<table class="table"><thead><tr><th>Fecha</th><th>Item</th><th>De</th><th>A</th><th>Qty</th><th>Solicitó</th></tr></thead><tbody>';
    traslados.slice(0,50).forEach(function(t) {
      var bOrig = bodegas.find(function(x){ return x.id===t.bodegaOrigenId; });
      var bDest = bodegas.find(function(x){ return x.id===t.bodegaDestinoId; });
      html += '<tr><td>' + fechaLegible(t.fecha) + '</td><td>' + (t.itemNombre||'—') + '</td>'
        + '<td>' + (bOrig?bOrig.nombre:'—') + '</td><td>' + (bDest?bDest.nombre:'—') + '</td>'
        + '<td class="td-mono">' + t.cantidad + '</td><td>' + (t.usuario||'—') + '</td></tr>';
    });
    html += '</tbody></table>';
  }
  html += '</div>';

  content.innerHTML = html;
}

function mostrarTabBodega(tab) {
  ['resumen','repuestos','insumos','traslados'].forEach(function(t) {
    var panel = document.getElementById('panel_bod_'+t);
    var btn = document.getElementById('tab_bod_'+t);
    if (panel) panel.style.display = t===tab ? '' : 'none';
    if (btn) { btn.className = 'btn ' + (t===tab?'btn-primary':'btn-secondary'); btn.style.fontSize='12px'; }
  });
}

async function mostrarInvBodega(bodegaId, tipo) {
  mostrarTabBodega(tipo === 'repuesto' ? 'repuestos' : tipo);
}

async function modalTraslado() {
  var bodegas = await dbGetAll('bodegas');
  if (bodegas.length < 2) { toast('Necesitas al menos 2 bodegas para hacer traslados', 'amber'); return; }
  var repuestos = await dbGetAll('repuestos');
  var insumos   = await dbGetAll('insumos');
  var optsB = bodegas.map(function(b){ return '<option value="' + b.id + '">' + b.nombre + '</option>'; }).join('');
  var optsItems = '<optgroup label="Repuestos">'
    + repuestos.map(function(r){ return '<option value="rep_' + r.id + '">' + r.nombre + ' (stock: ' + r.stock + ')</option>'; }).join('')
    + '</optgroup><optgroup label="Insumos">'
    + insumos.map(function(s){ return '<option value="ins_' + s.id + '">' + s.nombre + ' (stock: ' + s.stock + ')</option>'; }).join('')
    + '</optgroup>';

  openModal('modalTraslado', '⇄ Traslado entre bodegas',
    '<div class="form-group"><label>Item a trasladar *</label><select id="tras_item">' + optsItems + '</select></div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Bodega origen *</label><select id="tras_origen">' + optsB + '</select></div>'
    + '<div class="form-group"><label>Bodega destino *</label><select id="tras_destino">' + optsB + '</select></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Cantidad *</label><input id="tras_qty" type="number" value="1" min="1" step="1"></div>'
    + '<div class="form-group"><label>Fecha</label><input id="tras_fecha" type="date" value="' + today() + '"></div>'
    + '</div>'
    + '<div class="form-group"><label>Motivo</label><input id="tras_motivo" placeholder="Reabastecimiento, devolución..."></div>',
    async function() {
      var itemVal  = (document.getElementById('tras_item')||{}).value;
      var origenId = parseInt((document.getElementById('tras_origen')||{}).value);
      var destId   = parseInt((document.getElementById('tras_destino')||{}).value);
      var qty      = parseInt((document.getElementById('tras_qty')||{}).value) || 0;
      var fecha    = (document.getElementById('tras_fecha')||{}).value;
      var motivo   = (document.getElementById('tras_motivo')||{}).value;
      if (!itemVal || !qty || qty <= 0) { toast('Completa todos los campos', 'red'); return; }
      if (origenId === destId) { toast('Origen y destino deben ser diferentes', 'red'); return; }
      var tipo = itemVal.startsWith('rep_') ? 'repuesto' : 'insumo';
      var itemId = parseInt(itemVal.split('_')[1]);
      var store = tipo === 'repuesto' ? 'repuestos' : 'insumos';
      // Actualizar stocks
      var itemOrig = await dbGet(store, itemId);
      if (!itemOrig) { toast('Item no encontrado', 'red'); return; }
      if (itemOrig.stock < qty) { toast('Stock insuficiente en bodega origen: ' + itemOrig.stock, 'red'); return; }
      // Descontar de origen
      itemOrig.stock -= qty;
      itemOrig.bodegaId = origenId;
      await dbPut(store, itemOrig);
      // Buscar si ya existe el item en bodega destino
      var todos = await dbGetAll(store);
      var itemDest = todos.find(function(x){ return x.bodegaId===destId && x.nombre===itemOrig.nombre; });
      if (itemDest) {
        itemDest.stock += qty;
        await dbPut(store, itemDest);
      } else {
        var nuevoItem = Object.assign({}, itemOrig);
        delete nuevoItem.id;
        nuevoItem.stock = qty;
        nuevoItem.bodegaId = destId;
        await dbAdd(store, nuevoItem);
      }
      // Registrar traslado
      var bods = await dbGetAll('bodegas');
      var bOrig = bods.find(function(b){ return b.id===origenId; });
      var bDest = bods.find(function(b){ return b.id===destId; });
      await dbAdd('traslados', {
        fecha: fecha, tipo: tipo, itemId: itemId, itemNombre: itemOrig.nombre,
        bodegaOrigenId: origenId, bodegaOrigenNombre: bOrig?bOrig.nombre:'',
        bodegaDestinoId: destId, bodegaDestinoNombre: bDest?bDest.nombre:'',
        cantidad: qty, motivo: motivo,
        usuario: sesionActual ? sesionActual.nombre : '—',
        createdAt: nowTs()
      });
      await logAuditoria('TRASLADO','bodegas','Traslado: '+qty+'x '+itemOrig.nombre+' → '+(bDest?bDest.nombre:''), {qty:qty});
      closeModal('modalTraslado');
      toast('✓ Traslado registrado');
      await navTo('bodegas');
    }, false);
}

async function modalTrasladoItem(itemId, tipo) {
  // Pre-seleccionar el item
  await modalTraslado();
  setTimeout(function(){
    var sel = document.getElementById('tras_item');
    if (sel) sel.value = tipo + '_' + itemId;
  }, 100);
}

async function modalBodega(id) {
  var b = id ? await dbGet('bodegas', id) : {};
  openModal('modalBodega', id ? 'Editar Bodega' : 'Nueva Bodega',
    '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Nombre *</label><input id="bod_nom" value="' + (b.nombre||'') + '" placeholder="Bodega Central, Sucursal Norte..."></div>'
    + '<div class="form-group"><label>Responsable</label><input id="bod_resp" value="' + (b.responsable||'') + '" placeholder="Nombre del encargado"></div>'
    + '</div>'
    + '<div class="form-group"><label>Dirección</label><input id="bod_dir" value="' + (b.direccion||'') + '" placeholder="Zona, municipio..."></div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Teléfono</label><input id="bod_tel" value="' + (b.telefono||'') + '"></div>'
    + '<div class="form-group"><label>Tipo</label><select id="bod_tipo">'
    + ['Bodega principal','Sucursal','Bodega satélite','Taller asociado'].map(function(t){
        return '<option value="' + t + '"' + (b.tipo===t?' selected':'') + '>' + t + '</option>';
      }).join('') + '</select></div>'
    + '</div>'
    + '<div class="form-group"><label>Notas</label><textarea id="bod_notas">' + (b.notas||'') + '</textarea></div>',
    async function() {
      var nom = (document.getElementById('bod_nom')||{}).value.trim();
      if (!nom) { toast('Nombre requerido','red'); return; }
      var obj = {
        nombre: nom,
        responsable: (document.getElementById('bod_resp')||{}).value.trim(),
        direccion: (document.getElementById('bod_dir')||{}).value.trim(),
        telefono: (document.getElementById('bod_tel')||{}).value.trim(),
        tipo: (document.getElementById('bod_tipo')||{}).value,
        notas: (document.getElementById('bod_notas')||{}).value.trim(),
        updatedAt: nowTs()
      };
      if (id) { obj.id = id; await dbPut('bodegas', obj); }
      else { obj.createdAt = nowTs(); await dbAdd('bodegas', obj); }
      await logAuditoria(id?'EDITAR':'CREAR','bodegas','Bodega '+(id?'editada':'creada')+': '+nom, {});
      closeModal('modalBodega');
      toast(id ? 'Bodega actualizada' : 'Bodega registrada');
      await navTo('bodegas');
    }, false);
}




async function mostrarImportarRepuestos() {
  openModal('impRep', '📦 Importar repuestos masivo',
    '<div class="alert alert-blue" style="font-size:11px;margin-bottom:10px">'
    +'<strong>Columnas requeridas:</strong> nombre, stock, precio_venta<br>'
    +'<strong>Columnas opcionales:</strong> codigo, marca, modelo_aplicable, ubicacion, stock_min, costo, unidad</div>'
    +'<div style="display:flex;gap:8px;margin-bottom:12px">'
    +'<button onclick="descargarPlantillaRepuestos()" class="btn btn-secondary">📋 Plantilla CSV</button></div>'
    +'<label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px">Seleccionar archivo (.csv o .xlsx):</label>'
    +'<input id="rep_file_inp" type="file" accept=".csv,.xlsx,.xls" style="width:100%;padding:6px;background:var(--bg3);border:1px solid var(--border2);border-radius:6px">'
    +'<button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="procesarImportRepuestos()">Cargar archivo</button>'
    +'<div id="rep_import_preview" style="margin-top:10px"></div>',
    function(){}, false);
}

function descargarPlantillaRepuestos() {
  var filas = [
    ["nombre","codigo","marca","modelo_aplicable","stock","stock_min","precio_venta","costo","ubicacion","unidad"],
    ["Filtro de aceite","FO-001","Toyota","Corolla 2010-2020","10","2","85.00","42.00","A-01","unidad"],
    ["Aceite 20W50","AC-001","Mobil","Universal","50","10","95.00","55.00","B-02","litro"]
  ];
  var csv = filas.map(function(f){return f.join(",");}).join("\n");
  var blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="plantilla_repuestos.csv"; a.click();
  toast("Plantilla descargada");
}

async function procesarImportRepuestos() {
  var inp=document.getElementById('rep_file_inp');
  if(!inp||!inp.files||!inp.files[0]){toast('Selecciona un archivo','amber');return;}
  var file=inp.files[0]; var esXlsx=file.name.match(/\.xlsx?$/i);
  var preview=document.getElementById('rep_import_preview');
  preview.innerHTML='<div style="color:var(--text3);padding:10px">Procesando...</div>';
  try {
    var rows=[];
    if(esXlsx){
      await cargarSheetJS();
      var buf=await leerArchivoBuffer(file);
      var wb=XLSX.read(buf,{type:'array'});
      var ws=wb.Sheets[wb.SheetNames[0]];
      var data=XLSX.utils.sheet_to_json(ws,{header:1,raw:false,defval:''});
      var header=data[0].map(function(h){return String(h).trim().toLowerCase().replace(/\s+/g,'_');});
      rows=data.slice(1).map(function(r){
        var o={}; header.forEach(function(h,i){o[h]=String(r[i]||'').trim();}); return o;
      });
    } else {
      var txt=await leerArchivoTexto(file);
      var sep=txt.includes(';')?';':',';
      var lineas=txt.trim().split(/\r?\n/);
      var header=parsearLinea(lineas[0],sep).map(function(h){return h.toLowerCase().replace(/\s+/g,'_');});
      rows=lineas.slice(1).map(function(l){
        var cols=parsearLinea(l,sep); var o={};
        header.forEach(function(h,i){o[h]=cols[i]||'';}); return o;
      });
    }
    rows=rows.filter(function(r){return r.nombre||r.Nombre;});
    if(!rows.length){preview.innerHTML='<div class="alert alert-red">Sin datos válidos</div>';return;}
    window._repImportRows=rows;
    var total=rows.reduce(function(a,r){return a+parseFloat(r.precio_venta||0);},0);
    preview.innerHTML='<div class="alert alert-blue" style="margin-bottom:10px">'+rows.length+' repuestos listos para importar</div>'
      +'<div style="max-height:160px;overflow-y:auto"><table class="table"><thead><tr><th>Nombre</th><th>Stock</th><th>Precio</th></tr></thead><tbody>'
      +rows.slice(0,8).map(function(r){return '<tr><td>'+r.nombre+'</td><td>'+r.stock+'</td><td>'+fmt(parseFloat(r.precio_venta||0))+'</td></tr>';}).join('')
      +(rows.length>8?'<tr><td colspan="3" style="text-align:center;color:var(--text3)">...y '+(rows.length-8)+' más</td></tr>':'')
      +'</tbody></table></div>'
      +'<button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="confirmarImportRepuestos()">✓ Importar '+rows.length+' repuestos</button>';
  } catch(e){preview.innerHTML='<div class="alert alert-red">Error: '+e.message+'</div>';}
}

async function confirmarImportRepuestos() {
  var rows=window._repImportRows||[];
  if(!rows.length){toast('Sin datos','red');return;}
  var count=0;
  for(var i=0;i<rows.length;i++){
    var r=rows[i];
    await dbAdd('repuestos',{
      nombre:r.nombre||r.Nombre,codigo:r.codigo||'',marca:r.marca||'',
      modeloAplicable:r.modelo_aplicable||r.modelo||'',
      stock:parseFloat(r.stock||0),stockMin:parseFloat(r.stock_min||0),
      precioVenta:parseFloat(r.precio_venta||0),costo:parseFloat(r.costo||0),
      ubicacion:r.ubicacion||'',unidad:r.unidad||'unidad',
      createdAt:nowTs(),updatedAt:nowTs()
    });
    count++;
  }
  await logAuditoria('IMPORTAR','repuestos','Importación masiva: '+count+' repuestos',{});
  window._repImportRows=null;
  closeModal('impRep');
  toast('✓ '+count+' repuestos importados');
  await navTo('repuestos');
}

async function renderImportExport(content, actions) {
  if (!soloAdmin()) { content.innerHTML='<div class="alert alert-red">Solo administradores</div>'; return; }
  actions.innerHTML = '';
  content.innerHTML = '<div class="section-title">Importar / Exportar Datos</div>'
    + '<div class="section-sub">Migracion desde otras plataformas | Formato CSV compatible con Excel</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">'

    // EXPORTAR
    + '<div class="card"><div class="card-title" style="margin-bottom:12px">Exportar datos</div>'
    + '<div style="display:grid;gap:8px">'
    + ['empleados','clientes','vehiculos','repuestos','facturas','ordenes','costos','proveedores','nomina'].map(function(store){
      var labels = {empleados:'Empleados',clientes:'Clientes',vehiculos:'Vehiculos',repuestos:'Repuestos',
        facturas:'Facturas',ordenes:'Ordenes de trabajo',costos:'Costos operativos',proveedores:'Proveedores',nomina:'Nomina'};
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:var(--bg3);border-radius:6px">'
        + '<span style="font-size:13px">' + (labels[store]||store) + '</span>'
        + '<div class="flex gap-1">'
        + '<button class="btn btn-sm btn-secondary" onclick="exportarCSV(\''+store+'\')">CSV</button>'
        + '<button class="btn btn-sm btn-green" onclick="exportarExcel(\''+store+'\')">Excel</button>'
        + '</div></div>';
    }).join('')
    + '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:var(--bg3);border-radius:6px">'
    + '<span style="font-size:13px;font-weight:600">TODO (backup completo)</span>'
    + '<button class="btn btn-sm btn-primary" onclick="exportarBackup()">JSON completo</button></div>'
    + '</div></div>'

    // IMPORTAR
    + '<div class="card"><div class="card-title" style="margin-bottom:12px">Importar desde CSV</div>'
    + '<div class="alert alert-amber" style="font-size:11px;margin-bottom:12px">Los datos importados se AGREGAN a los existentes (no reemplazan). Usa el mismo formato que el exportado.</div>'
    + '<div style="display:grid;gap:8px">'
    + ['empleados','clientes','vehiculos','repuestos','costos','proveedores'].map(function(store){
      var labels = {empleados:'Empleados',clientes:'Clientes',vehiculos:'Vehiculos',repuestos:'Repuestos',costos:'Costos operativos',proveedores:'Proveedores'};
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:var(--bg3);border-radius:6px">'
        + '<span style="font-size:13px">' + (labels[store]||store) + '</span>'
        + '<div class="flex gap-1">'
        + '<button class="btn btn-sm btn-secondary" onclick="descargarPlantillaCSV(\''+store+'\')">Plantilla</button>'
        + '<button class="btn btn-sm btn-blue" onclick="importarCSV(\''+store+'\')">Importar CSV</button>'
        + '</div></div>';
    }).join('')
    + '</div>'
    + '<div class="divider"></div>'
    + '<div style="font-size:12px;color:var(--text2)">'
    + '<strong>Pasos para migrar desde otra plataforma:</strong><br>'
    + '1. Descarga la plantilla CSV del modulo a importar<br>'
    + '2. Rellena la plantilla con tus datos (respeta el formato de columnas)<br>'
    + '3. Guarda como CSV (UTF-8) desde Excel<br>'
    + '4. Usa el boton "Importar CSV" para cargar los datos<br>'
    + '5. Verifica los datos importados en el modulo correspondiente'
    + '</div></div>'
    + '</div>';
}

// Exportar store a CSV
async function exportarCSV(storeName) {
  var data = await dbGetAll(storeName);
  if (!data.length) { toast('Sin datos para exportar','amber'); return; }
  var keys = Object.keys(data[0]).filter(function(k){ return k !== 'passwordHash'; });
  var csv = keys.join(',') + '\n';
  data.forEach(function(row) {
    csv += keys.map(function(k){
      var v = row[k];
      if (v === null || v === undefined) return '';
      var s = String(v).replace(/"/g, '""');
      return s.includes(',') || s.includes('\n') || s.includes('"') ? '"'+s+'"' : s;
    }).join(',') + '\n';
  });
  var blob = new Blob(['\ufeff'+csv], {type:'text/csv;charset=utf-8'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download=storeName+'_'+today()+'.csv'; a.click();
  toast('CSV exportado: ' + storeName);
}

// Exportar a Excel (HTML table que Excel abre)
async function exportarExcel(storeName) {
  var data = await dbGetAll(storeName);
  if (!data.length) { toast('Sin datos para exportar','amber'); return; }
  var keys = Object.keys(data[0]).filter(function(k){ return k !== 'passwordHash'; });
  var html = '<table border="1"><thead><tr>' + keys.map(function(k){return '<th>'+k+'</th>';}).join('') + '</tr></thead><tbody>';
  data.forEach(function(row){
    html += '<tr>' + keys.map(function(k){ return '<td>'+(row[k]!=null?String(row[k]):'')+'</td>'; }).join('') + '</tr>';
  });
  html += '</tbody></table>';
  var blob = new Blob(['\ufeff'+html], {type:'application/vnd.ms-excel;charset=utf-8'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download=storeName+'_'+today()+'.xls'; a.click();
  toast('Excel exportado: ' + storeName);
}

// Descargar plantilla CSV vacia con encabezados
function descargarPlantillaCSV(storeName) {
  var plantillas = {
    empleados:'nombre,dpi,cargo,tipoContrato,fechaIngreso,circunscripcion,salarioBase,telefono,email,noIGSS,cuentaBanco,bancoCuenta,tipoCuentaBanco,nombreCuentaBanco,bonificacionAdicional,descuentoAdicional,activo',
    clientes:'nombre,nit,empresa,tipo,telefono,whatsapp,email,direccion,notas',
    vehiculos:'clienteNombre,placa,tipoVehiculo,marca,modelo,anio,color,cilindros,cilindraje,combustibleTipo,km,vin,tipoServicio,proximoServicio,kmProximo,observaciones',
    repuestos:'codigo,nombre,categoria,stock,stockMin,unidad,costo,precio,proveedor,fechaCaducidad,descripcion',
    costos:'fecha,categoria,descripcion,monto,proveedor,recurrente',
    proveedores:'empresa,nit,categoria,contacto,telefono,email,sitioWeb,direccion,plazoCredito,calificacion,notas'
  };
  var csv = (plantillas[storeName]||'id,nombre') + '\n';
  var blob = new Blob(['\ufeff'+csv], {type:'text/csv;charset=utf-8'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download='plantilla_'+storeName+'.csv'; a.click();
  toast('Plantilla descargada: ' + storeName);
}

// Importar CSV al store
function importarCSV(storeName) {
  var input = document.createElement('input');
  input.type = 'file'; input.accept = '.csv';
  input.onchange = async function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var text = await file.text();
    // Detectar BOM
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    var lineas = text.split('\n').filter(function(l){return l.trim();});
    if (lineas.length < 2) { toast('Archivo vacio o sin datos','red'); return; }
    var keys = lineas[0].split(',').map(function(k){return k.trim().replace(/^"|"$/g,'');});
    var rows = [];
    for (var i=1; i<lineas.length; i++) {
      var vals = parseCSVLine(lineas[i]);
      if (vals.length < 2) continue;
      var obj = {createdAt:nowTs()};
      keys.forEach(function(k,idx){ if(k && k!=='id') obj[k] = vals[idx]||''; });
      // Convertir tipos
      if (obj.salarioBase) obj.salarioBase = parseFloat(obj.salarioBase)||0;
      if (obj.monto) obj.monto = parseFloat(obj.monto)||0;
      if (obj.stock) obj.stock = parseInt(obj.stock)||0;
      if (obj.costo) obj.costo = parseFloat(obj.costo)||0;
      if (obj.precio) obj.precio = parseFloat(obj.precio)||0;
      if (obj.activo !== undefined) obj.activo = obj.activo !== 'false' && obj.activo !== '0';
      rows.push(obj);
    }
    if (!rows.length) { toast('No se encontraron filas validas','red'); return; }
    if (!confirm('Importar '+rows.length+' registros a '+storeName+'? Se agregaran a los datos existentes.')) return;
    var ok = 0;
    for (var j=0; j<rows.length; j++) {
      try { await dbAdd(storeName, rows[j]); ok++; } catch(err) {}
    }
    toast(ok + ' registros importados a ' + storeName);
    await navTo(storeName);
  };
  input.click();
}

function parseCSVLine(line) {
  var result = []; var cur = ''; var inQ = false;
  for (var i=0; i<line.length; i++) {
    var c = line[i];
    if (c==='"' && !inQ) { inQ=true; }
    else if (c==='"' && inQ && line[i+1]==='"') { cur+='"'; i++; }
    else if (c==='"' && inQ) { inQ=false; }
    else if (c===',' && !inQ) { result.push(cur.trim()); cur=''; }
    else { cur+=c; }
  }
  result.push(cur.trim());
  return result;
}

// ================================================================

/* ================================================================
   ENVÍO WHATSAPP VIA CALLMEBOT - Función centralizada
   ================================================================ */
async function enviarWACallMeBot(telefono, mensaje, apiKey) {
  var tel = String(telefono||'').replace(/[^\d]/g,'');
  if (!tel) return { ok: false, error: 'N\u00FAmero vac\u00EDo' };
  if (!apiKey) return { ok: false, error: 'API Key no configurada en WhatsApp Bot' };
  var url = 'https://api.callmebot.com/whatsapp.php?phone='+tel+'&text='+encodeURIComponent(mensaje)+'&apikey='+String(apiKey).trim();
  return new Promise(function(resolve) {
    var img = new Image();
    var done = false;
    function finish() { if(done)return; done=true; resolve({ok:true}); }
    img.onload = finish; img.onerror = finish; // error de imagen = servidor respondió = enviado
    img.src = url + '&_cb=' + Date.now();
    setTimeout(finish, 7000);
  });
}

// MODULO WHATSAPP - CallMeBot API (gratuito, pre-aprobado)
// CallMeBot: envio de mensajes a numeros pre-aprobados
// Para activar: el receptor debe enviar "I allow callmebot to send me messages"
//               al numero +34 644 44 00 05 en WhatsApp
// Documentacion: https://www.callmebot.com/blog/free-api-whatsapp-messages/
// ================================================================



async function guardarConfigWA() {
  var obj = {
    key:'whatsapp',
    apiKey: (document.getElementById('wa_apikey')||{value:''}).value.trim(),
    numero: (document.getElementById('wa_numero')||{value:''}).value.trim(),
    diasAnticipacion: parseInt((document.getElementById('wa_dias')||{value:'7'}).value)||7,
    nombreTaller: (document.getElementById('wa_nombre')||{value:''}).value.trim(),
    template: (document.getElementById('wa_template')||{value:''}).value.trim(),
    template2: (document.getElementById('wa_template2')||{value:''}).value.trim(),
    updatedAt: nowTs()
  };
  await dbPut('config', obj);
  toast('Configuracion WhatsApp guardada');
}



async function previewMsg(clienteId, vehiculoId) {
  var data = await construirMensaje(clienteId, vehiculoId);
  if (!data) { toast('No se pudo construir el mensaje','red'); return; }
  openModal('prevWA','Preview del mensaje WhatsApp',
    '<div class="alert alert-blue" style="font-size:12px">Vista previa del mensaje que se enviara a <strong>'+(data.clienteNombre)+'</strong></div>'
    + '<div style="background:var(--bg3);border-radius:8px;padding:14px;font-size:13px;line-height:1.7;white-space:pre-wrap">'
    + data.msg.replace(/\*/g,'<strong>').replace(/\*/g,'</strong>')
    + '</div>'
    + '<div style="margin-top:10px;font-size:12px;color:var(--text2)">Numero destino: <strong>'+(data.tel||'Sin numero')+'</strong></div>'
    + (data.tel?'<button class="btn btn-green mt-2" onclick="cerrarModal(\'prevWA\');enviarMsgServicio('+clienteId+','+vehiculoId+')">Enviar ahora</button>':'<div class="alert alert-red" style="margin-top:8px;font-size:11px">Este cliente no tiene numero de WhatsApp registrado</div>'),
    function(){cerrarModal('prevWA');}, false);
}


async function probarWADirecto() {
  var waCfg = await dbGet('config','whatsapp') || { apiKey:'4068040', numero:'50243935006' };
  var tel = (waCfg.numero || '').replace(/[^\d]/g,'');
  if (!tel) { toast('Configura tu número de WhatsApp primero','red'); return; }
  var msg = 'TallerPro GT - Prueba de conexión WhatsApp. Si recibes este mensaje, el sistema está funcionando correctamente. ' + new Date().toLocaleString('es-GT');
  toast('Enviando mensaje de prueba a +' + tel + '...', 'amber');
  var res = await enviarWACallMeBot(tel, msg, waCfg.apiKey || '4068040');
  setTimeout(function(){
    toast(res.ok ? '✓ Mensaje enviado. Revisa tu WhatsApp.' : '✗ Error: ' + (res.error||''), res.ok ? 'green' : 'red');
  }, 1000);
}

async function enviarMsgServicio(clienteId, vehiculoId) {
  var waCfg = await dbGet('config','whatsapp') || {};
  if (!waCfg.apiKey) { toast('Configura tu API Key de CallMeBot primero','red'); await navTo('whatsapp'); return; }
  var data = await construirMensaje(clienteId, vehiculoId);
  if (!data) { toast('Error construyendo mensaje','red'); return; }
  if (!data.tel) { toast('El cliente no tiene numero de WhatsApp','amber'); return; }
  // Limpiar numero: solo digitos y +
  var tel = normalizarTel(data.tel);
  var resultado = await enviarWACallMeBot(tel, data.msg, waCfg.apiKey);
  var ok = resultado.ok;
  var txt = resultado.error || '';
  if (ok) {
    // El envío con no-cors no puede verificar respuesta, asumir éxito
    await dbAdd('whatsapp_logs',{
      fecha:nowTs(), destinatario:data.clienteNombre,
      telefono:tel, mensaje:data.msg,
      estado: ok ? 'enviado' : 'error',
      respuesta: txt.slice(0,200), createdAt:nowTs()
    });
    toast(ok ? 'Mensaje enviado a '+data.clienteNombre : 'Error al enviar. Verifica que el cliente activo CallMeBot', ok?'green':'red');
  } else {
    await dbAdd('whatsapp_logs',{fecha:nowTs(),destinatario:data.clienteNombre||'',telefono:tel,mensaje:data.msg,estado:'error',respuesta:txt,createdAt:nowTs()});
    toast('Error al enviar: '+txt,'red');
  }
  await navTo('whatsapp');
}

async function enviarAlertasAutomaticas() {
  var waCfg = await dbGet('config','whatsapp') || {};
  if (!waCfg.apiKey) { toast('Configura CallMeBot primero','amber'); return; }
  var vehiculos = await dbGetAll('vehiculos');
  var clientes  = await dbGetAll('clientes');
  var hoy2 = new Date(); hoy2.setHours(0,0,0,0);
  var dias = waCfg.diasAnticipacion || 7;
  var pendientes = vehiculos.filter(function(v){
    if (!v.proximoServicio) return false;
    var d = Math.round((new Date(v.proximoServicio+'T00:00:00')-hoy2)/86400000);
    return d >= 0 && d <= dias;
  });
  if (!pendientes.length) { toast('No hay servicios proximos en los proximos '+dias+' dias','amber'); return; }
  if (!confirm('Enviar '+pendientes.length+' mensajes de alerta?')) return;
  var count = 0;
  for (var i=0; i<pendientes.length; i++) {
    var v = pendientes[i];
    var cli = clientes.find(function(c){return c.id===v.clienteId;});
    if (cli && (cli.whatsapp||cli.telefono)) {
      await enviarMsgServicio(v.clienteId, v.id);
      count++;
      await new Promise(function(r){setTimeout(r,1200);}); // pausa entre mensajes
    }
  }
  toast('Alertas enviadas: '+count+' de '+pendientes.length);
}

async function modalReagendarServicio(vehiculoId) {
  var v = await dbGet('vehiculos', vehiculoId);
  var cli = await dbGet('clientes', v?v.clienteId:0);
  if (!v) return;
  openModal('reagendarWA','Reagendar servicio: '+v.placa,
    '<div class="form-group"><label>Nueva fecha de servicio</label><input id="ra_fecha" type="date" value="'+(v.proximoServicio||today())+'"></div>'
    + '<div class="form-group"><label>Motivo del reagendado</label><input id="ra_motivo" placeholder="Ejemplo: Cliente solicito cambio de fecha"></div>',
    async function(){
      var nuevaFecha = document.getElementById('ra_fecha').value;
      if (!nuevaFecha) { toast('Selecciona una fecha','red'); return; }
      v.proximoServicio = nuevaFecha; v.updatedAt = nowTs();
      await dbPut('vehiculos', v);
      // Enviar mensaje de confirmacion
      var waCfg = await dbGet('config','whatsapp') || {};
      var cfg = await dbGet('config','taller') || {};
      if (cli && (cli.whatsapp||cli.telefono) && waCfg.apiKey) {
        var tel = (cli.whatsapp||cli.telefono).replace(/[\s\-()]/g,'');
        if (!tel.startsWith('+')) tel = '+502'+tel;
        var msg = (waCfg.template2||'Hola {cliente}! Su cita para {placa} fue reagendada al {fecha_nueva}.')
          .replace(/{cliente}/g, cli.nombre)
          .replace(/{placa}/g, v.placa)
          .replace(/{modelo}/g, (v.marca||'')+' '+(v.modelo||''))
          .replace(/{fecha_nueva}/g, nuevaFecha)
          .replace(/{servicio}/g, v.tipoServicio||'mantenimiento')
          .replace(/{taller}/g, waCfg.nombreTaller||cfg.nombre||'el taller');
        await enviarWACallMeBot(tel, msg, waCfg.apiKey);
      }
      cerrarModal('reagendarWA'); toast('Servicio reagendado para '+nuevaFecha);
      await navTo('whatsapp');
    }, true);
}

// ================================================================
// MODULO FLOTA - Contratos empresariales y mantenimiento de flota
// Clientes corporativos con multiples vehiculos contratados
// ================================================================


async function modalContratoFlota(id) {
  var ct = id ? await dbGet('contratos_flota', id) : {};
  var clientes  = await dbGetAll('clientes');
  var vehiculos = await dbGetAll('vehiculos');

  var cliOpts = clientes.map(function(c){
    return '<option value="'+c.id+'"'+(ct.clienteId===c.id?' selected':'')+'>'+c.nombre+(c.empresa?' ('+c.empresa+')':'')+'</option>';
  }).join('');

  var vehsSelec = ct.vehiculosIds || [];
  var vehsCheck = vehiculos.map(function(v){
    return '<label style="display:flex;align-items:center;gap:6px;padding:4px 0;cursor:pointer;font-size:12px">'
      + '<input type="checkbox" value="'+v.id+'" class="veh_fl_cb"'+(vehsSelec.indexOf(v.id)>=0?' checked':'')+' style="width:auto"> '
      + v.placa+' - '+v.marca+' '+v.modelo+(v.clienteNombre?' ('+v.clienteNombre+')':'')
      + '</label>';
  }).join('');

  var tiposContrato = ['Mantenimiento preventivo','Mantenimiento correctivo','Contrato integral (preventivo+correctivo)','Revision periodica','Combo llantas y alineacion','Servicio express'];
  var periodicidades = ['Mensual','Bimestral','Trimestral','Semestral','Anual'];

  openModal('ctFlota', id?'Editar Contrato de Flota':'Nuevo Contrato de Flota',
    '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Nombre del contrato *</label><input id="cf_nom" value="'+(ct.nombre||'')+'" placeholder="Ej: Mantenimiento flota Empresa XYZ"></div>'
    + '<div class="form-group"><label>Cliente / Empresa *</label><select id="cf_cli">'+cliOpts+'</select></div>'
    + '</div>'
    + '<div class="form-row form-row-3">'
    + '<div class="form-group"><label>Tipo de contrato</label><select id="cf_tipo">'+tiposContrato.map(function(t){return '<option value="'+t+'"'+(ct.tipoContrato===t?' selected':'')+'>'+t+'</option>';}).join('')+'</select></div>'
    + '<div class="form-group"><label>Periodicidad</label><select id="cf_per">'+periodicidades.map(function(p){return '<option value="'+p+'"'+(ct.periodicidad===p?' selected':'')+'>'+p+'</option>';}).join('')+'</select></div>'
    + '<div class="form-group"><label>Estado</label><select id="cf_est"><option value="activo"'+(ct.estado==='activo'||!ct.estado?' selected':'')+'>Activo</option><option value="suspendido"'+(ct.estado==='suspendido'?' selected':'')+'>Suspendido</option><option value="vencido"'+(ct.estado==='vencido'?' selected':'')+'>Vencido</option></select></div>'
    + '</div>'
    + '<div class="form-row form-row-3">'
    + '<div class="form-group"><label>Tarifa mensual (Q)</label><input id="cf_tar" type="number" value="'+(ct.tarifaMensual||'')+'" step="0.01" placeholder="0.00"></div>'
    + '<div class="form-group"><label>Fecha inicio</label><input id="cf_fini" type="date" value="'+(ct.fechaInicio||today())+'"></div>'
    + '<div class="form-group"><label>Fecha fin</label><input id="cf_ffin" type="date" value="'+(ct.fechaFin||'')+'"></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Servicios incluidos</label><textarea id="cf_srv" style="min-height:60px" placeholder="Cambio de aceite, filtros, revision general...">'+(ct.serviciosIncluidos||'')+'</textarea></div>'
    + '<div class="form-group"><label>Condiciones especiales</label><textarea id="cf_cond" style="min-height:60px" placeholder="Descuento 15% en repuestos, prioridad de atencion...">'+(ct.condiciones||'')+'</textarea></div>'
    + '</div>'
    + '<div class="form-group"><label>Vehiculos incluidos en la flota</label>'
    + '<div style="max-height:180px;overflow-y:auto;background:var(--bg3);border-radius:6px;padding:10px;border:1px solid var(--border2)">'
    + (vehsCheck||'<div class="text-muted" style="font-size:12px">No hay vehiculos registrados</div>')
    + '</div></div>',
    async function(){
      var nom = document.getElementById('cf_nom').value.trim();
      var cliId = parseInt(document.getElementById('cf_cli').value);
      if (!nom || !cliId) { toast('Nombre y cliente requeridos','red'); return; }
      var cli = await dbGet('clientes', cliId);
      var vehIds = Array.from(document.querySelectorAll('.veh_fl_cb:checked')).map(function(cb){return parseInt(cb.value);});
      var obj = {
        nombre:nom, clienteId:cliId, clienteNombre:cli?cli.nombre:'',
        tipoContrato:document.getElementById('cf_tipo').value,
        periodicidad:document.getElementById('cf_per').value,
        estado:document.getElementById('cf_est').value,
        tarifaMensual:parseFloat(document.getElementById('cf_tar').value)||0,
        fechaInicio:document.getElementById('cf_fini').value,
        fechaFin:document.getElementById('cf_ffin').value,
        serviciosIncluidos:document.getElementById('cf_srv').value.trim(),
        condiciones:document.getElementById('cf_cond').value.trim(),
        vehiculosIds:vehIds, updatedAt:nowTs()
      };
      if (id) { obj.id=id; await dbPut('contratos_flota', obj); }
      else { obj.createdAt=nowTs(); await dbAdd('contratos_flota', obj); }
      cerrarModal('ctFlota'); toast(id?'Contrato actualizado':'Contrato creado');
      await navTo('flota');
    }, true);
}

async function verDetalleContrato(ctId) {
  var ct       = await dbGet('contratos_flota', ctId);
  var vehiculos = await dbGetAll('vehiculos');
  var ordenes   = await dbGetAll('ordenes');
  var clientes  = await dbGetAll('clientes');
  if (!ct) return;

  var vehs = vehiculos.filter(function(v){return ct.vehiculosIds&&ct.vehiculosIds.indexOf(v.id)>=0;});
  var cli  = clientes.find(function(c){return c.id===ct.clienteId;});
  var hoy2 = new Date(); hoy2.setHours(0,0,0,0);

  var filaVehs = vehs.map(function(v){
    var otVeh = ordenes.filter(function(o){return o.vehiculoId===v.id;});
    var ultimaOT = otVeh.sort(function(a,b){return a.fecha<b.fecha?1:-1;})[0];
    var dias = v.proximoServicio ? Math.round((new Date(v.proximoServicio+'T00:00:00')-hoy2)/86400000) : null;
    var colorD = dias===null?'gray':dias<0?'red':dias<=7?'amber':'green';
    return '<tr>'
      + '<td class="td-mono">'+v.placa+'</td>'
      + '<td>'+v.marca+' '+v.modelo+' '+(v.anio||'')+'</td>'
      + '<td>'+(v.tipoServicio||'---')+'</td>'
      + '<td><span class="badge badge-'+colorD+'">'+(dias===null?'Sin fecha':dias<0?'Vencido':dias===0?'Hoy':'En '+dias+'d')+'</span> '+(v.proximoServicio||'')+'</td>'
      + '<td>'+(ultimaOT?fechaLegible(ultimaOT.fecha)+' '+( ultimaOT.noOT||''):'Sin OT')+'</td>'
      + '<td><button class="btn btn-sm btn-green" onclick="cerrarModal(\'detCtrato\');modalReagendarServicio('+v.id+')">Reagendar</button></td>'
      + '</tr>';
  }).join('');

  var totFacturado = ordenes.filter(function(o){return ct.vehiculosIds&&ct.vehiculosIds.indexOf(o.vehiculoId)>=0;}).reduce(function(a,o){return a+(o.totalConIVA||0);},0);

  openModal('detCtrato', 'Contrato: '+ct.nombre,
    '<div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">'
    + '<div class="stat-card"><div class="stat-label">Vehiculos</div><div class="stat-value">'+vehs.length+'</div></div>'
    + '<div class="stat-card stat-green"><div class="stat-label">Tarifa mensual</div><div class="stat-value" style="font-size:15px">'+fmt(ct.tarifaMensual||0)+'</div></div>'
    + '<div class="stat-card stat-green"><div class="stat-label">Total facturado</div><div class="stat-value" style="font-size:15px">'+fmt(totFacturado)+'</div></div>'
    + '<div class="stat-card"><div class="stat-label">Vigencia</div><div class="stat-value" style="font-size:12px">'+fechaLegible(ct.fechaFin)+'</div></div>'
    + '</div>'
    + '<div style="font-size:12px;color:var(--text2);margin-bottom:10px">'
    + '<strong>Cliente:</strong> '+(cli?cli.nombre:'---')+' | <strong>Tipo:</strong> '+(ct.tipoContrato||'---')+' | <strong>Periodicidad:</strong> '+(ct.periodicidad||'---')
    + (ct.serviciosIncluidos?'<br><strong>Servicios:</strong> '+ct.serviciosIncluidos:'')
    + '</div>'
    + '<div class="table-wrap"><table>'
    + '<thead><tr><th>Placa</th><th>Vehiculo</th><th>Tipo servicio</th><th>Proximo servicio</th><th>Ultima OT</th><th>Accion</th></tr></thead>'
    + '<tbody>'+(filaVehs||'<tr><td colspan="6" class="text-center text-muted" style="padding:12px">Sin vehiculos</td></tr>')+'</tbody>'
    + '</table></div>',
    function(){ cerrarModal('detCtrato'); }, false);
}

async function programarMantenimientoFlota(ctId) {
  var ct = await dbGet('contratos_flota', ctId);
  var vehiculos = await dbGetAll('vehiculos');
  if (!ct) return;
  var vehs = vehiculos.filter(function(v){return ct.vehiculosIds&&ct.vehiculosIds.indexOf(v.id)>=0;});

  openModal('progFlota','Programar mantenimiento: '+ct.nombre,
    '<div class="alert alert-blue" style="font-size:11px">Se actualizara la fecha de proximo servicio para todos los vehiculos de esta flota.</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Nueva fecha de servicio *</label><input id="pf_fecha" type="date" value="'+sumarDias(today(),7)+'"></div>'
    + '<div class="form-group"><label>Tipo de servicio</label><input id="pf_tipo" value="'+(ct.tipoContrato||'Mantenimiento preventivo')+'"></div>'
    + '</div>'
    + '<div class="form-group"><label>Vehiculos a programar</label>'
    + '<div style="max-height:150px;overflow-y:auto;background:var(--bg3);border-radius:6px;padding:10px">'
    + vehs.map(function(v){
      return '<label style="display:flex;align-items:center;gap:6px;padding:3px 0;cursor:pointer;font-size:12px">'
        + '<input type="checkbox" value="'+v.id+'" class="pf_veh_cb" checked style="width:auto"> '
        + v.placa+' - '+v.marca+' '+v.modelo+'</label>';
    }).join('')
    + '</div></div>',
    async function(){
      var fecha = document.getElementById('pf_fecha').value;
      var tipo  = document.getElementById('pf_tipo').value;
      if (!fecha) { toast('Selecciona una fecha','red'); return; }
      var selIds = Array.from(document.querySelectorAll('.pf_veh_cb:checked')).map(function(cb){return parseInt(cb.value);});
      var count = 0;
      for (var i=0; i<vehiculos.length; i++) {
        if (selIds.indexOf(vehiculos[i].id)>=0) {
          vehiculos[i].proximoServicio = fecha;
          vehiculos[i].tipoServicio = tipo;
          vehiculos[i].updatedAt = nowTs();
          await dbPut('vehiculos', vehiculos[i]);
          count++;
        }
      }
      cerrarModal('progFlota');
      toast(count+' vehiculos programados para '+fecha);
      await navTo('flota');
    }, true);
}

// ================================================================
// MODULO FEL - Facturacion Electronica Guatemala
// Certificadoras soportadas: Infile, Digifact
// Verificacion NIT via SAT (Modulo 11 + portal publico)
// ================================================================

async function renderFEL(content, actions) {
  var cfg    = await dbGet('config','taller') || {};
  var felCfg = await dbGet('config','fel') || {};
  actions.innerHTML = '<button class="btn btn-primary" onclick="testConexionFEL()">Probar conexion</button>';

  content.innerHTML = '<div class="section-title">Facturacion Electronica FEL</div>'
    + '<div class="section-sub">Configuracion para emision de facturas ante la SAT Guatemala</div>'

    // Estado actual
    + '<div class="stat-grid">'
    + '<div class="stat-card '+(felCfg.habilitado?'stat-green':'')+'"><div class="stat-label">Estado FEL</div><div class="stat-value" style="font-size:14px">'+(felCfg.habilitado?'Activo':'Inactivo')+'</div><div class="stat-sub">'+(felCfg.certificadora||'Sin configurar')+'</div></div>'
    + '<div class="stat-card"><div class="stat-label">NIT emisor</div><div class="stat-value" style="font-size:14px">'+(cfg.nit||'Sin NIT')+'</div><div class="stat-sub">Configurado en ajustes</div></div>'
    + '<div class="stat-card"><div class="stat-label">Regimen</div><div class="stat-value" style="font-size:13px">IVA General</div><div class="stat-sub">12% Decreto 27-92</div></div>'
    + '</div>'

    // Selector de certificadora
    + '<div class="card"><div class="card-title" style="margin-bottom:12px">Configurar certificadora FEL</div>'
    + '<div class="form-group"><label>Certificadora SAT autorizada *</label>'
    + '<select id="fel_cert" onchange="cambiarCertificadora()">'
    + '<option value="">Seleccionar certificadora...</option>'
    + '<option value="infile"'+(felCfg.certificadora==='infile'?' selected':'')+'>Infile (www.infile.com)</option>'
    + '<option value="digifact"'+(felCfg.certificadora==='digifact'?' selected':'')+'>Digifact (www.digifact.com.gt)</option>'
    + '<option value="g4s"'+(felCfg.certificadora==='g4s'?' selected':'')+'>G4S Technology</option>'
    + '<option value="megaprint"'+(felCfg.certificadora==='megaprint'?' selected':'')+'>Megaprint</option>'
    + '</select>'
    + '<div class="form-hint">Debes tener contrato activo con la certificadora para obtener las credenciales</div>'
    + '</div>'

    + '<div id="fel_campos_cert" style="'+(felCfg.certificadora?'':'display:none')+'">'
    + '<div class="alert alert-amber" style="font-size:11px">Ingresa las credenciales que te proporciono la certificadora. Estos datos son confidenciales.</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Usuario / Alias *</label><input id="fel_usuario" value="'+(felCfg.usuario||'')+'" placeholder="Usuario de la certificadora"></div>'
    + '<div class="form-group"><label>Clave / Token / API Key *</label><input id="fel_clave" type="password" value="'+(felCfg.clave||'')+'" placeholder="Clave o token de API"></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>NIT del emisor (tu empresa)</label><input id="fel_nit" value="'+(felCfg.nitEmisor||cfg.nit||'')+'" placeholder="NIT sin guion"></div>'
    + '<div class="form-group"><label>Ambiente</label><select id="fel_amb"><option value="pruebas"'+(felCfg.ambiente==='pruebas'||!felCfg.ambiente?' selected':'')+'>Pruebas (testing)</option><option value="produccion"'+(felCfg.ambiente==='produccion'?' selected':'')+'>Produccion (real)</option></select></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Tipo de establecimiento</label><input id="fel_estab" value="'+(felCfg.establecimiento||'1')+'" placeholder="1"></div>'
    + '<div class="form-group"><label>Serie de factura</label><input id="fel_serie" value="'+(felCfg.serie||'A')+'" placeholder="A"></div>'
    + '</div>'
    + '<button class="btn btn-primary" onclick="guardarConfigFEL()" style="margin-top:4px">Guardar configuracion FEL</button>'
    + '</div>'
    + '</div>'

    // Instrucciones
    + '<div class="card"><div class="card-title" style="margin-bottom:12px">Pasos para activar FEL</div>'
    + '<div style="font-size:13px;line-height:2;color:var(--text2)">'
    + '<strong style="color:var(--accent)">1.</strong> Ingresar al Portal SAT: <a href="https://portal.sat.gob.gt" target="_blank" style="color:var(--blue)">portal.sat.gob.gt</a> y habilitar tu NIT para FEL<br>'
    + '<strong style="color:var(--accent)">2.</strong> Contratar una certificadora autorizada (Infile o Digifact son las mas usadas en Guatemala)<br>'
    + '<strong style="color:var(--accent)">3.</strong> La certificadora te dara: usuario, clave y NIT habilitado<br>'
    + '<strong style="color:var(--accent)">4.</strong> Ingresa esas credenciales arriba y selecciona "Produccion"<br>'
    + '<strong style="color:var(--accent)">5.</strong> Al emitir facturas, el sistema enviara la DTE a la SAT via la certificadora y obtendra el UUID de verificacion<br><br>'
    + '<strong>Costos aproximados (2026):</strong><br>'
    + '- Infile: desde Q200-400/mes segun volumen<br>'
    + '- Digifact: desde Q150-300/mes<br>'
    + '- La SAT no cobra por la habilitacion FEL<br>'
    + '</div>'
    + '<div style="display:flex;gap:10px;margin-top:12px">'
    + '<a href="https://portal.sat.gob.gt" target="_blank" class="btn btn-secondary">Portal SAT</a>'
    + '<a href="https://www.infile.com" target="_blank" class="btn btn-secondary">Infile</a>'
    + '<a href="https://www.digifact.com.gt" target="_blank" class="btn btn-secondary">Digifact</a>'
    + '</div></div>'

    // Verificador NIT SAT
    + '<div class="card"><div class="card-title" style="margin-bottom:12px">Verificador de NIT SAT</div>'
    + '<div class="alert alert-blue" style="font-size:11px">Verificacion con algoritmo oficial SAT Guatemala (Modulo 11). Para verificacion en tiempo real con el registro de la SAT, se requieren credenciales FEL activas.</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>NIT a verificar</label>'
    + '<div style="display:flex;gap:8px">'
    + '<input id="ver_nit" placeholder="Ej: 12345678-9 o CF" style="flex:1" oninput="verificarNITUI()">'
    + '<button class="btn btn-primary" onclick="verificarNITUI()">Verificar</button>'
    + '</div></div>'
    + '<div id="ver_resultado" style="display:flex;align-items:center;padding:8px;font-size:13px;background:var(--bg3);border-radius:6px"></div>'
    + '</div>'
    + '<div id="ver_detalle"></div>'
    + '</div>';
}

function cambiarCertificadora() {
  var v = document.getElementById('fel_cert').value;
  var wrap = document.getElementById('fel_campos_cert');
  if (wrap) wrap.style.display = v ? 'block' : 'none';
}

async function guardarConfigFEL() {
  var obj = {
    key:'fel',
    certificadora: document.getElementById('fel_cert').value,
    usuario: document.getElementById('fel_usuario').value.trim(),
    clave: document.getElementById('fel_clave').value,
    nitEmisor: document.getElementById('fel_nit').value.trim().replace(/-/g,''),
    ambiente: document.getElementById('fel_amb').value,
    establecimiento: document.getElementById('fel_estab').value.trim()||'1',
    serie: document.getElementById('fel_serie').value.trim()||'A',
    habilitado: true, updatedAt: nowTs()
  };
  if (!obj.certificadora || !obj.usuario || !obj.clave) {
    toast('Certificadora, usuario y clave son requeridos','red'); return;
  }
  await dbPut('config', obj);
  toast('Configuracion FEL guardada. Usa "Probar conexion" para verificar.');
}

async function testConexionFEL() {
  var felCfg = await dbGet('config','fel') || {};
  if (!felCfg.habilitado || !felCfg.certificadora) {
    toast('Configura las credenciales FEL primero','amber'); return;
  }
  // Mostrar estado sin hacer llamada real (las APIs FEL requieren DTE firmado)
  var endpointInfo = {
    infile: 'https://api.infile.com.gt (requiere certificado SSL)',
    digifact: 'https://api.digifact.com.gt/api',
    g4s: 'https://g4sapi.sat.gob.gt',
    megaprint: 'https://megaprint.com.gt/api'
  };
  openModal('testFEL','Estado de conexion FEL',
    '<div class="alert alert-blue" style="font-size:12px">Las certificadoras FEL requieren un DTE (Documento Tributario Electronico) firmado con tu certificado digital para autenticarse. No es posible probar la conexion sin un documento real.</div>'
    + '<div style="font-size:13px;line-height:2">'
    + '<div><strong>Certificadora:</strong> ' + felCfg.certificadora + '</div>'
    + '<div><strong>Ambiente:</strong> ' + (felCfg.ambiente||'pruebas') + '</div>'
    + '<div><strong>Endpoint:</strong> ' + (endpointInfo[felCfg.certificadora]||'---') + '</div>'
    + '<div><strong>NIT emisor:</strong> ' + (felCfg.nitEmisor||'---') + '</div>'
    + '<div><strong>Estado:</strong> <span class="badge badge-amber">Credenciales guardadas - pendiente activacion</span></div>'
    + '</div>'
    + '<div class="alert alert-green" style="font-size:11px;margin-top:10px">Cuando tengas las credenciales activas de la certificadora, al emitir una factura el sistema la enviara automaticamente y obtendra el UUID SAT.</div>',
    function(){ cerrarModal('testFEL'); }, false);
}

// ---- VERIFICACION NIT MEJORADA ----
// Algoritmo Modulo 11 oficial SAT Guatemala
function validarNITCompleto(nit) {
  if (!nit) return {valido:false, error:'NIT vacio'};
  var s = nit.toString().trim().toUpperCase().replace(/[.\- ]/g,'');
  if (s === 'CF') return {valido:true, tipo:'CF', mensaje:'Consumidor Final - siempre valido'};
  if (!/^[0-9]+[0-9K]$/.test(s)) return {valido:false, error:'Formato invalido. Debe ser numeros con digito verificador (0-9 o K)'};
  var numero = s.slice(0,-1);
  var dv = s.slice(-1);
  if (numero.length < 1) return {valido:false, error:'NIT demasiado corto'};
  var factor = numero.length + 1;
  var suma = 0;
  for (var i=0; i<numero.length; i++) {
    suma += parseInt(numero[i]) * factor;
    factor--;
  }
  var residuo = (11 - (suma % 11)) % 11;
  var dvEsperado = residuo === 10 ? 'K' : String(residuo);
  if (dvEsperado !== dv) {
    return {valido:false, error:'Digito verificador incorrecto. Esperado: '+dvEsperado+', recibido: '+dv};
  }
  return {valido:true, nit:s, numero:numero, dv:dv, mensaje:'NIT valido segun algoritmo Modulo 11 SAT Guatemala'};
}

async function verificarNITUI() {
  var nit = document.getElementById('ver_nit').value.trim();
  var resEl = document.getElementById('ver_resultado');
  var detEl = document.getElementById('ver_detalle');
  if (!resEl) return;
  if (!nit) { resEl.innerHTML = ''; return; }
  var r = validarNITCompleto(nit);
  if (r.valido) {
    resEl.innerHTML = '<span style="color:var(--green);font-size:20px">&#10003;</span> <span style="color:var(--green)">' + r.mensaje + '</span>';
    if (detEl) {
      detEl.innerHTML = '<div class="alert alert-green" style="font-size:12px;margin-top:8px">'
        + '<strong>NIT verificado:</strong> ' + (r.nit||'CF') + '<br>'
        + (r.numero ? '<strong>Numero:</strong> ' + r.numero + ' | <strong>DV:</strong> ' + r.dv : '')
        + '<br><span style="font-size:10px;color:var(--text2)">Nota: Esta verificacion usa el algoritmo oficial Modulo 11 de la SAT. Para consultar el nombre del contribuyente en tiempo real se requieren credenciales FEL activas.</span>'
        + '</div>';
    }
  } else {
    resEl.innerHTML = '<span style="color:var(--red);font-size:20px">&#10005;</span> <span style="color:var(--red)">' + r.error + '</span>';
    if (detEl) {
      detEl.innerHTML = '<div class="alert alert-red" style="font-size:12px;margin-top:8px">'
        + 'El NIT <strong>' + nit + '</strong> no es valido segun el algoritmo SAT Guatemala.<br>'
        + 'Verifica el numero e intenta de nuevo. El digito verificador puede ser 0-9 o K.'
        + '</div>';
    }
  }
}

// Verificacion en linea cuando hay credenciales FEL activas
async function verificarNITEnLinea(nit) {
  var r = validarNITCompleto(nit);
  if (!r.valido) return r;
  var felCfg = await dbGet('config','fel') || {};
  if (!felCfg.habilitado || !felCfg.usuario) {
    return Object.assign(r, {enLinea:false, nota:'Verificacion local unicamente. Configura FEL para verificacion en linea.'});
  }
  // Con credenciales FEL Infile se puede consultar el registro del contribuyente
  // Endpoint Infile: POST https://api.infile.com.gt/nit/verificar
  // Por ahora retornar verificacion local + nota
  return Object.assign(r, {enLinea:false, nota:'FEL configurado pero la verificacion en linea requiere activacion con '+felCfg.certificadora});
}

// Hook para facturacion: verificar NIT antes de guardar factura
async function validarNITEnFactura(nit) {
  var el = document.getElementById('nit_status_fac');
  if (!el) return true;
  if (!nit || nit.toUpperCase() === 'CF') {
    el.innerHTML = '<span style="color:var(--text3);font-size:10px">Consumidor Final</span>';
    return true;
  }
  var r = validarNITCompleto(nit);
  if (r.valido) {
    el.innerHTML = '<span style="color:var(--green);font-size:10px">&#10003; NIT valido (Mod. 11 SAT)</span>';
  } else {
    el.innerHTML = '<span style="color:var(--red);font-size:10px">&#10005; ' + r.error + '</span>';
  }
  return r.valido;
}

// ================================================================
// MODULO FINAL v3.2
// 1. Alertas con notificacion WA a numeros de empresa
// 2. Facturas correlacionadas con FEL
// 3. Regimen fiscal configurable (IVA/ISR)
// 4. Viaticos y gastos deducibles
// ================================================================

// ---- REGIMENES FISCALES SAT GUATEMALA ----
var REGIMENES_FISCAL = {
  iva_general: {
    label: 'Regimen General IVA (Dto 27-92)',
    iva: 0.12,
    isr: 0.25,
    isrTipo: 'utilidades',
    descripcion: 'IVA 12% en ventas. ISR 25% sobre utilidades trimestrales.',
    deducibles: ['costos_operativos','salarios','viaticos_documentados','compras_con_iva','depreciacion'],
    creditoIVA: true
  },
  pequeno_contribuyente: {
    label: 'Pequeno Contribuyente (Dto 27-92 Art.47)',
    iva: 0.05,
    isr: 0,
    isrTipo: 'ninguno',
    descripcion: 'IVA 5% incluido en ventas. Sin ISR. Solo si ingresos < Q150,000/anio.',
    deducibles: [],
    creditoIVA: false
  },
  opcional_simplificado: {
    label: 'Opcional Simplificado (Dto 10-2012 Art.44)',
    iva: 0.12,
    isr: 0.07,
    isrTipo: 'bruto_mensual',
    descripcion: 'IVA 12%. ISR 7% sobre ingresos brutos mensuales (sin deducciones).',
    deducibles: [],
    creditoIVA: true
  },
  regimen_utilidades: {
    label: 'Sobre Utilidades (Dto 10-2012 Art.38)',
    iva: 0.12,
    isr: 0.25,
    isrTipo: 'utilidades',
    descripcion: 'IVA 12%. ISR 25% sobre utilidad neta. Permite deducciones.',
    deducibles: ['costos_operativos','salarios','viaticos_documentados','compras_con_iva','depreciacion','intereses'],
    creditoIVA: true
  }
};

function getRegimen() {
  var r = window._regimenFiscal || 'regimen_utilidades';
  return REGIMENES_FISCAL[r] || REGIMENES_FISCAL.regimen_utilidades;
}

async function cargarRegimen() {
  var cfg = await dbGet('config','taller') || {};
  window._regimenFiscal = cfg.regimenFiscal || 'regimen_utilidades';
  window._IVA = getRegimen().iva;
  // Sobreescribir la constante global
  if (typeof IVA !== 'undefined') {
    window.IVA_ACTUAL = window._IVA;
  }
}

// ---- ALERTAS CON WHATSAPP A NUMEROS DE EMPRESA ----
async function enviarAlertasEmpresa(alertas_list) {
  var waCfg = await dbGet('config','whatsapp') || {};
  var notifCfg = await dbGet('config','notificaciones') || {};
  if (!waCfg.apiKey) return;

  var numeros = [];
  if (notifCfg.numGerente)  numeros.push({tel:notifCfg.numGerente,  rol:'Gerente'});
  if (notifCfg.numAdmin)    numeros.push({tel:notifCfg.numAdmin,    rol:'Administrador'});
  if (notifCfg.numJefeTaller) numeros.push({tel:notifCfg.numJefeTaller, rol:'Jefe de Taller'});
  numeros = numeros.filter(function(n){return n.tel && n.tel.length > 5;});
  if (!numeros.length) return;

  var resumen = alertas_list.slice(0,10).map(function(a,i){
    return (i+1)+'. '+a.titulo+(a.prioridad==='alta'?' [URGENTE]':'');
  }).join('\n');

  var msg = (cfg.nombre||'TallerPro GT')+' | Tel: '+(cfg.telefono||'---')+'\n'
    + new Date().toLocaleString('es-GT') + '\n\n'
    + resumen
    + (alertas_list.length > 10 ? '\n...y '+(alertas_list.length-10)+' alertas mas.' : '');

  for (var i=0; i<numeros.length; i++) {
    var tel = numeros[i].tel.replace(/[\s\-()]/g,'');
    if (!tel.startsWith('+')) tel = '+502'+tel;
    try {
      await enviarWACallMeBot(tel, msg, waCfg.apiKey);
      await dbAdd('whatsapp_logs',{fecha:nowTs(),destinatario:numeros[i].rol+': '+tel,
        mensaje:msg.slice(0,100),estado:'enviado',createdAt:nowTs()});
    } catch(e) {}
    await new Promise(function(r){setTimeout(r,1000);});
  }
}

async function generarAlertas_v2() {
  var [vehiculos,repuestos,insumos,existentes,facturas,ordenes] = await Promise.all([
    dbGetAll('vehiculos'),dbGetAll('repuestos'),dbGetAll('insumos'),
    dbGetAll('alertas'),dbGetAll('facturas'),dbGetAll('ordenes')
  ]);
  function existe(ref){ return existentes.some(function(a){return a.ref===ref;}); }
  var nuevas = [];
  var hoy = new Date(); hoy.setHours(0,0,0,0);

  vehiculos.forEach(function(v){
    if(!v.proximoServicio)return;
    var dias = Math.round((new Date(v.proximoServicio+'T00:00:00')-hoy)/86400000);
    if(dias<=15&&dias>=-30){
      var ref='serv_'+v.id+'_'+v.proximoServicio;
      if(!existe(ref))nuevas.push({tipo:'mantenimiento',ref:ref,vista:false,
        prioridad:dias<0?'alta':'media',
        titulo:'Mantenimiento: '+v.placa+' '+(v.modelo||''),
        descripcion:(dias>=0?'En '+dias+' dias':'VENCIDO hace '+Math.abs(dias)+' dias'),
        fecha:today(),vehiculoId:v.id,createdAt:nowTs()});
    }
  });
  repuestos.concat(insumos).forEach(function(r){
    if((r.stock||0)<=(r.stockMin||5)){
      var ref='stock_'+r.id;
      if(!existe(ref))nuevas.push({tipo:'stock',ref:ref,vista:false,
        prioridad:(r.stock||0)===0?'alta':'media',
        titulo:'Stock bajo: '+r.nombre,
        descripcion:'Stock: '+(r.stock||0)+' / Minimo: '+(r.stockMin||5),
        fecha:today(),createdAt:nowTs()});
    }
  });
  facturas.filter(function(f){return !f.pagada&&f.fecha;}).forEach(function(f){
    var dias=Math.floor((new Date()-new Date(f.fecha+'T00:00:00'))/86400000);
    if(dias>30){var ref='cobro_'+f.id;if(!existe(ref))nuevas.push({tipo:'cobro',ref:ref,vista:false,
      prioridad:'alta',titulo:'Factura sin cobrar: '+(f.noFactura||f.id),
      descripcion:'Cliente: '+f.clienteNombre+' Q'+(f.total||0).toFixed(0)+' - '+dias+' dias',
      fecha:today(),createdAt:nowTs()});}
  });

  for(var i=0;i<nuevas.length;i++) await dbAdd('alertas',nuevas[i]);

  // Enviar alertas de alta prioridad a numeros de empresa
  var notifCfg = await dbGet('config','notificaciones') || {};
  var alta = nuevas.filter(function(a){return a.prioridad==='alta';});
  if(alta.length && notifCfg.enviarWA) {
    await enviarAlertasEmpresa(alta);
  }
  return nuevas.length;
}

// ---- GASTOS DE EMPLEADOS / VIATICOS ----

/* ================================================================
   IMPORTAR VIÁTICOS/GASTOS MASIVO - CSV o Excel
   ================================================================ */
function mostrarImportarViaticos() {
  openModal('impViaticos', '📥 Importar gastos masivos',
    '<div class="alert alert-blue" style="font-size:11px;margin-bottom:12px">'
    + '<strong>Columnas requeridas:</strong> fecha, empleado, categoria, descripcion, monto<br>'
    + '<strong>Columnas opcionales:</strong> deducible (si/no), tiene_factura (si/no), iva_acreditado, notas<br>'
    + 'Categorías: almuerzo, combustible, hospedaje, transporte, peaje, herramientas, comunicaciones, otro</div>'
    + '<div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap">'
    + '<button onclick="descargarPlantillaViaticos()" class="btn btn-secondary">📋 Descargar plantilla CSV</button>'
    + '</div>'
    + '<div style="margin-bottom:12px">'
    + '<label style="display:block;font-size:12px;font-weight:600;color:var(--text2);margin-bottom:6px">Seleccionar archivo (.csv o .xlsx):</label>'
    + '<input id="viat_file_inp" type="file" accept=".csv,.xlsx,.xls,.CSV" style="font-size:13px;color:var(--text);padding:6px;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;width:100%">'
    + '</div>'
    + '<button class="btn btn-primary" style="width:100%;margin-bottom:12px" onclick="procesarArchivoViaticos()">📂 Cargar y procesar archivo</button>'
    + '<div id="imp_viat_preview"></div>',
    function(){}, false
  );
}

function descargarPlantillaViaticos() {
  var csv = 'fecha,empleado,categoria,descripcion,monto,deducible,tiene_factura,iva_acreditado,notas\n'
    + '2025-01-15,Juan Pérez,almuerzo,Almuerzo con cliente,85.00,si,si,10.20,Reunión zona 10\n'
    + '2025-01-15,Mario García,combustible,Gasolina visita cliente,150.00,si,si,18.00,Recorrido zona sur\n'
    + '2025-01-16,Juan Pérez,transporte,Taxi aeropuerto,200.00,si,no,0,Viaje a Quetzaltenango\n';
  var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = 'plantilla_viaticos.csv';
  a.click(); URL.revokeObjectURL(url);
  toast('Plantilla descargada');
}

async function procesarArchivoViaticos() {
  var input = document.getElementById('viat_file_inp');
  if (!input || !input.files || !input.files[0]) {
    toast('Primero selecciona un archivo', 'amber');
    return;
  }
  var file = input.files[0];
  var esExcel = file.name.match(/\.xlsx?$/i);
  var preview = document.getElementById('imp_viat_preview');
  preview.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3)">⏳ Procesando archivo...</div>';

  try {
    var rows = [];
    if (esExcel) {
      rows = await leerExcelViaticos(file);
    } else {
      rows = await leerCSVViaticos(file);
    }
    if (!rows.length) {
      preview.innerHTML = '<div class="alert alert-red">No se encontraron datos válidos. Verifica el formato del archivo.</div>';
      return;
    }
    mostrarPreviewViaticos(rows, preview);
  } catch(e) {
    preview.innerHTML = '<div class="alert alert-red">Error al leer: ' + e.message + '</div>';
  }
}

async function leerCSVViaticos(file) {
  var texto = await leerArchivoTexto(file);
  var sep = texto.includes(';') ? ';' : texto.includes('\t') ? '\t' : ',';
  var lineas = texto.trim().split(/\r?\n/).filter(function(l){ return l.trim(); });
  if (lineas.length < 2) return [];
  var header = parsearLinea(lineas[0], sep).map(function(h){
    return h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_');
  });
  return parsearFilasViaticos(lineas.slice(1), header, sep);
}

async function leerExcelViaticos(file) {
  await cargarSheetJS();
  var buf = await leerArchivoBuffer(file);
  var wb = XLSX.read(buf, {type:'array'});
  var ws = wb.Sheets[wb.SheetNames[0]];
  var data = XLSX.utils.sheet_to_json(ws, {header:1, raw:false, defval:''});
  if (data.length < 2) return [];
  var header = data[0].map(function(h){
    return String(h||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_');
  });
  return parsearFilasViaticos(data.slice(1), header, null);
}

function parsearFilasViaticos(lineas, header, sep) {
  var colFecha = buscarCol(header, ['fecha','date']);
  var colEmp   = buscarCol(header, ['empleado','nombre','trabajador','employee']);
  var colCat   = buscarCol(header, ['categoria','category','tipo','type']);
  var colDesc  = buscarCol(header, ['descripcion','description','concepto','detalle']);
  var colMonto = buscarCol(header, ['monto','importe','total','amount','valor']);
  var colDed   = buscarCol(header, ['deducible','deductible']);
  var colFac   = buscarCol(header, ['tiene_factura','factura','factura','invoice']);
  var colIVA   = buscarCol(header, ['iva_acreditado','iva','tax']);
  var colNotas = buscarCol(header, ['notas','nota','note','observacion']);

  if (colMonto < 0) return [];

  var catMap = {almuerzo:'almuerzo',desayuno:'desayuno',cena:'cena',comida:'almuerzo',
    combustible:'combustible',gasolina:'combustible',diesel:'combustible',
    hospedaje:'hospedaje',hotel:'hospedaje',alojamiento:'hospedaje',
    transporte:'transporte',taxi:'transporte',bus:'transporte',flete:'transporte',
    peaje:'peaje',parqueo:'peaje',parking:'peaje',
    herramientas:'herramientas',herramienta:'herramientas',
    comunicaciones:'comunicaciones',telefono:'comunicaciones',celular:'comunicaciones',
    otro:'otro',otros:'otro',miscelaneo:'otro'};

  var rows = [];
  lineas.forEach(function(linea) {
    var cols = sep ? parsearLinea(linea, sep) : linea;
    if (!cols || !cols.length) return;
    var monto = parseFloat((get(cols, colMonto)||'0').replace(/[Q\s,]/g,'')) || 0;
    if (monto <= 0) return;
    var catRaw = (get(cols, colCat)||'otro').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    var cat = catMap[catRaw] || 'otro';
    var dedRaw = get(cols, colDed).toLowerCase();
    var ded = !dedRaw || dedRaw === 'si' || dedRaw === 'sí' || dedRaw === 'yes' || dedRaw === '1' || dedRaw === 'true';
    var facRaw = get(cols, colFac).toLowerCase();
    var conFac = facRaw === 'si' || facRaw === 'sí' || facRaw === 'yes' || facRaw === '1';
    var ivaRaw = parseFloat((get(cols, colIVA)||'0').replace(/[Q,]/g,'')) || (conFac ? monto / 13 : 0);
    rows.push({
      fecha: normalFecha(get(cols, colFecha)),
      empleadoNombre: get(cols, colEmp) || 'Sin asignar',
      categoria: cat,
      descripcion: get(cols, colDesc) || cat,
      monto: monto,
      deducible: ded,
      tieneFactura: conFac,
      ivaAcreditado: parseFloat(ivaRaw.toFixed(2)),
      notas: get(cols, colNotas)
    });
  });
  return rows;
}

function mostrarPreviewViaticos(rows, container) {
  var total = rows.reduce(function(a,r){ return a+r.monto; }, 0);
  var errores = rows.filter(function(r){ return !r.fecha || !r.monto; }).length;
  container.innerHTML = '<div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px">'
    + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center">'
    + '<div><div style="font-size:20px;font-weight:700;color:var(--green)">' + rows.length + '</div><div style="font-size:11px;color:var(--text3)">Registros</div></div>'
    + '<div><div style="font-size:18px;font-weight:700;color:var(--accent)">Q ' + total.toFixed(2) + '</div><div style="font-size:11px;color:var(--text3)">Total</div></div>'
    + '<div><div style="font-size:20px;font-weight:700;color:'+(errores>0?'var(--red)':'var(--green)')+'">'+errores+'</div><div style="font-size:11px;color:var(--text3)">Errores</div></div>'
    + '</div></div>'
    + '<div style="max-height:180px;overflow-y:auto;margin-bottom:12px"><table class="table"><thead><tr><th>Fecha</th><th>Empleado</th><th>Categoría</th><th>Monto</th><th>Factura</th></tr></thead>'
    + '<tbody>' + rows.slice(0,8).map(function(r){
        return '<tr><td>'+r.fecha+'</td><td>'+r.empleadoNombre+'</td><td>'+r.categoria+'</td>'
          +'<td style="font-family:var(--font-mono)">Q '+r.monto.toFixed(2)+'</td>'
          +'<td><span class="badge badge-'+(r.tieneFactura?'green':'amber')+'">'+(r.tieneFactura?'Sí':'No')+'</span></td></tr>';
      }).join('')
    + (rows.length>8?'<tr><td colspan="5" style="text-align:center;color:var(--text3);font-size:11px">...y '+(rows.length-8)+' más</td></tr>':'')
    + '</tbody></table></div>'
    + '<button class="btn btn-primary" style="width:100%" onclick="importarViaticosConfirmar(window._viatRows)">✓ Importar ' + rows.length + ' registros</button>';
  window._viatRows = rows;
}

async function importarViaticosConfirmar(rows) {
  // Si no se pasaron rows, intentar obtener de window
  if (!rows || !rows.length) rows = window._viatRows;
  if (!rows || !rows.length) { toast('No hay datos para importar. Vuelve a cargar el archivo.', 'red'); return; }
  var empleados = await dbGetAll('empleados');
  var count = 0;
  for (var i=0; i<rows.length; i++) {
    var r = rows[i];
    // Intentar encontrar el empleado por nombre
    var emp = empleados.find(function(e){
      return e.nombre.toLowerCase().includes(r.empleadoNombre.toLowerCase()) ||
             r.empleadoNombre.toLowerCase().includes(e.nombre.toLowerCase().split(' ')[0]);
    });
    await dbAdd('viaticos', {
      fecha: r.fecha,
      empleadoId: emp ? emp.id : null,
      empleadoNombre: emp ? emp.nombre : r.empleadoNombre,
      categoria: r.categoria,
      descripcion: r.descripcion,
      monto: r.monto,
      deducible: r.deducible,
      tieneFactura: r.tieneFactura,
      ivaAcreditado: r.ivaAcreditado,
      notas: r.notas,
      importadoMasivo: true,
      createdAt: nowTs()
    });
    // NO registrar individualmente en costos (se registran como total mensual)
    count++;
  }
  await logAuditoria('IMPORTAR','viaticos','Viáticos importados masivo: '+count,{total:count});
  window._viatRows = null;
  closeModal('impViaticos');
  cerrarModal('impViaticos'); // compatibilidad
  toast('✓ ' + count + ' gastos importados correctamente');
  await navTo('viaticos');
}


async function registrarTotalViaticosMes() {
  var mes = today().slice(0,7);
  var viaticos = await dbGetAll('viaticos');
  var delMes = viaticos.filter(function(v){ return (v.fecha||'').startsWith(mes); });
  if (!delMes.length) { toast('No hay viáticos registrados para '+mes, 'amber'); return; }
  var total = delMes.reduce(function(a,v){ return a+(v.monto||0); }, 0);
  var costos = await dbGetAll('costos');
  var yaExiste = costos.some(function(c){ return c.tipoViaticos && c.fechaMes===mes; });
  if (yaExiste && !confirm('Ya existe un registro de viáticos para '+mes+'. ¿Reemplazar?')) return;
  var d = new Date(mes+'-01T12:00:00');
  var label = d.toLocaleDateString('es-GT',{month:'long',year:'numeric'});
  // Agrupar por categoría para la descripción
  var porCat = {};
  delMes.forEach(function(v){ var c=v.categoria||'otro'; porCat[c]=(porCat[c]||0)+(v.monto||0); });
  var detalle = Object.entries(porCat).map(function(e){ return e[0]+': Q'+e[1].toFixed(0); }).join(', ');
  await dbAdd('costos', {
    fecha: mes+'-01', fechaMes: mes,
    tipo: 'Viáticos y Gastos',
    descripcion: 'Total viáticos '+label+' ('+delMes.length+' registros) — '+detalle,
    monto: parseFloat(total.toFixed(2)),
    categoria: 'Viáticos y gastos',
    tipoViaticos: true, pagado: true,
    createdAt: nowTs(), updatedAt: nowTs()
  });
  await logAuditoria('REGISTRAR','costos','Total viáticos '+mes+': Q'+total.toFixed(2),{});
  toast('✓ Q '+total.toFixed(2)+' registrado en Costos Operativos para '+label);
}

async function renderViaticos(content, actions) {
  if(!soloAdmin()&&!esSup()){content.innerHTML='<div class="alert alert-red">Sin acceso</div>';return;}
  var viaticos = await dbGetAll('viaticos');
  var empleados = await dbGetAll('empleados');
  viaticos.sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;});
  actions.innerHTML='<button class="btn btn-primary" onclick="modalViatico()">+ Registrar gasto</button>'
    +' <button class="btn btn-secondary" onclick="mostrarImportarViaticos()">📥 Importar CSV/Excel</button>'
    +' <button class="btn btn-secondary" onclick="registrarTotalViaticosMes()">💰 Registrar total en costos</button>'
    +' <button class="btn btn-secondary" onclick="exportarCSV(\'viaticos\')">Exportar CSV</button>';

  var regimen = getRegimen();
  var mes = today().slice(0,7);
  var totMes = viaticos.filter(function(v){return v.fecha&&v.fecha.startsWith(mes);}).reduce(function(a,v){return a+(v.monto||0);},0);
  var totDed = viaticos.filter(function(v){return v.fecha&&v.fecha.startsWith(mes)&&v.deducible;}).reduce(function(a,v){return a+(v.monto||0);},0);
  var totIVAcred = regimen.creditoIVA
    ? viaticos.filter(function(v){return v.fecha&&v.fecha.startsWith(mes)&&v.deducible&&v.tieneFactura;}).reduce(function(a,v){return a+(v.ivaAcreditado||0);},0)
    : 0;

  var CATS = {
    almuerzo:{label:'Almuerzo',icono:'A',color:'green',deducible:true},
    desayuno:{label:'Desayuno',icono:'D',color:'green',deducible:true},
    cena:{label:'Cena',icono:'C',color:'green',deducible:true},
    combustible:{label:'Combustible',icono:'G',color:'blue',deducible:true},
    hospedaje:{label:'Hospedaje',icono:'H',color:'blue',deducible:true},
    transporte:{label:'Transporte',icono:'T',color:'blue',deducible:true},
    peaje:{label:'Peaje/Parqueo',icono:'P',color:'gray',deducible:true},
    herramientas:{label:'Herramientas',icono:'HE',color:'amber',deducible:true},
    comunicaciones:{label:'Comunicaciones',icono:'COM',color:'purple',deducible:true},
    otro:{label:'Otro gasto',icono:'OT',color:'gray',deducible:false}
  };

  var rows = viaticos.slice(0,50).map(function(v){
    var emp = empleados.find(function(e){return e.id===v.empleadoId;});
    var cat = CATS[v.categoria]||CATS.otro;
    return '<tr>'
      +'<td>'+fechaLegible(v.fecha)+'</td>'
      +'<td><span class="badge badge-'+cat.color+'">'+cat.icono+'</span> '+cat.label+'</td>'
      +'<td>'+(emp?emp.nombre:v.empleadoNombre||'---')+'</td>'
      +'<td style="font-size:11px">'+(v.descripcion||'---')+'</td>'
      +'<td class="td-mono td-right text-red">Q '+(v.monto||0).toFixed(2)+'</td>'
      +'<td class="td-mono td-right text-amber">'+(v.ivaAcreditado>0?'Q '+v.ivaAcreditado.toFixed(2):'---')+'</td>'
      +'<td><span class="badge badge-'+(v.deducible?'green':'gray')+'">'+(v.deducible?'Deducible':'No ded.')+'</span></td>'
      +'<td><span class="badge badge-'+(v.tieneFactura?'green':'amber')+'">'+(v.tieneFactura?'Con factura':'Sin factura')+'</span></td>'
      +'<td><div class="flex gap-1">'
      +'<button class="btn btn-sm btn-secondary" onclick="modalViatico('+v.id+')">Editar</button>'
      +'<button class="btn btn-sm btn-danger" onclick="borrarViatico('+v.id+')">X</button>'
      +'</div></td></tr>';
  }).join('');

  content.innerHTML='<div class="section-title">Viaticos y Gastos de Empleados</div>'
    +'<div class="section-sub">Gastos operativos deducibles segun regimen fiscal: <strong>'+regimen.label+'</strong></div>'
    +(regimen.creditoIVA
      ?'<div class="alert alert-blue" style="font-size:11px">Con tu regimen puedes acreditar el IVA de compras con factura contra el IVA de tus ventas. Solo gastos con factura legal son deducibles.</div>'
      :'<div class="alert alert-amber" style="font-size:11px">En Pequeno Contribuyente no aplica credito fiscal de IVA en compras.</div>')
    +'<div class="stat-grid">'
    +'<div class="stat-card stat-red"><div class="stat-label">Total viaticos mes</div><div class="stat-value">Q '+totMes.toFixed(2)+'</div></div>'
    +'<div class="stat-card stat-green"><div class="stat-label">Monto deducible mes</div><div class="stat-value">Q '+totDed.toFixed(2)+'</div><div class="stat-sub">Reduce utilidad imponible</div></div>'
    +(regimen.creditoIVA?'<div class="stat-card stat-amber"><div class="stat-label">IVA acreditable mes</div><div class="stat-value">Q '+totIVAcred.toFixed(2)+'</div><div class="stat-sub">Solo con factura legal</div></div>':'')
    +'</div>'
    +'<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    +'<thead><tr><th>Fecha</th><th>Categoria</th><th>Empleado</th><th>Descripcion</th><th class="td-right">Monto</th><th class="td-right">IVA acred.</th><th>Deducible</th><th>Factura</th><th>Acciones</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="9" class="text-center text-muted" style="padding:16px">Sin registros</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

async function modalViatico(id) {
  var empleados = await dbGetAll('empleados');
  var v = id ? await dbGetAll('viaticos').then(function(all){return all.find(function(x){return x.id===id;});}) : {};
  v = v || {};
  var regimen = getRegimen();
  var empOpts = empleados.filter(function(e){return e.activo!==false;}).map(function(e){
    return '<option value="'+e.id+'"'+(v.empleadoId===e.id?' selected':'')+'>'+e.nombre+'</option>';
  }).join('');
  var cats = [
    ['almuerzo','Almuerzo'],['desayuno','Desayuno'],['cena','Cena'],
    ['combustible','Combustible'],['hospedaje','Hospedaje'],['transporte','Transporte'],
    ['peaje','Peaje / Parqueo'],['herramientas','Herramientas'],
    ['comunicaciones','Comunicaciones (telefono, internet)'],['otro','Otro gasto']
  ];
  openModal('viat', id?'Editar Gasto':'Registrar Viatico / Gasto',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Empleado *</label><select id="vt_emp">'+empOpts+'</select></div>'
    +'<div class="form-group"><label>Fecha *</label><input id="vt_fec" type="date" value="'+(v.fecha||today())+'"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Categoria *</label><select id="vt_cat" onchange="calcIVAViatico()">'+cats.map(function(c){return '<option value="'+c[0]+'"'+(v.categoria===c[0]?' selected':'')+'>'+c[1]+'</option>';}).join('')+'</select></div>'
    +'<div class="form-group"><label>Descripcion</label><input id="vt_des" value="'+(v.descripcion||'')+'" placeholder="Detalle del gasto"></div>'
    +'</div>'
    +'<div class="form-row form-row-3">'
    +'<div class="form-group"><label>Monto total (Q) *</label><input id="vt_mon" type="number" value="'+(v.monto||'')+'" step="0.01" min="0" oninput="calcIVAViatico()"></div>'
    +'<div class="form-group"><label>IVA incluido en el monto</label><input id="vt_iva" type="number" value="'+(v.ivaAcreditado||'')+'" step="0.01" min="0" readonly style="background:var(--bg4)"><div class="form-hint">Se calcula automaticamente si tiene factura</div></div>'
    +'<div class="form-group"><label>No. Factura / Recibo</label><input id="vt_fac" value="'+(v.noFactura||'')+'" placeholder="No. de documento"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>NIT del proveedor</label><input id="vt_nit" value="'+(v.nitProveedor||'')+'" placeholder="NIT del restaurant, gasolinera..."></div>'
    +'<div class="form-group"><label>Nombre del proveedor</label><input id="vt_prov" value="'+(v.proveedor||'')+'" placeholder="Nombre del lugar"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label><input type="checkbox" id="vt_tiene_fac" style="width:auto;margin-right:6px"'+(v.tieneFactura?' checked':'')+' onchange="calcIVAViatico()"> Tiene factura legal (habilita IVA acreditable)</label></div>'
    +'<div class="form-group"><label><input type="checkbox" id="vt_ded" style="width:auto;margin-right:6px"'+(v.deducible!==false?' checked':'')+' '+(regimen.creditoIVA?'':'disabled')+'>Gasto deducible del ISR</label></div>'
    +'</div>'
    +(regimen.creditoIVA?'<div class="alert alert-green" style="font-size:11px">Con factura: el IVA de este gasto se puede acreditar contra el IVA de tus ventas.</div>':'<div class="alert alert-amber" style="font-size:11px">En tu regimen fiscal no aplica credito de IVA en compras.</div>'),
    async function(){
      var empId = parseInt(document.getElementById('vt_emp').value);
      var monto = parseFloat(document.getElementById('vt_mon').value)||0;
      if(!empId||!monto){toast('Empleado y monto requeridos','red');return;}
      var emp = empleados.find(function(e){return e.id===empId;});
      var tieneFac = document.getElementById('vt_tiene_fac').checked;
      var iva = tieneFac ? parseFloat(document.getElementById('vt_iva').value)||0 : 0;
      var obj={
        empleadoId:empId, empleadoNombre:emp?emp.nombre:'',
        fecha:document.getElementById('vt_fec').value,
        categoria:document.getElementById('vt_cat').value,
        descripcion:document.getElementById('vt_des').value.trim(),
        monto:monto, ivaAcreditado:iva,
        noFactura:document.getElementById('vt_fac').value.trim(),
        nitProveedor:document.getElementById('vt_nit').value.trim(),
        proveedor:document.getElementById('vt_prov').value.trim(),
        tieneFactura:tieneFac,
        deducible:document.getElementById('vt_ded').checked,
        updatedAt:nowTs()
      };
      if(id){obj.id=id;await dbPut('viaticos',obj);}else{obj.createdAt=nowTs();await dbAdd('viaticos',obj);}
      // Registrar en costos operativos
      await dbAdd('costos',{fecha:obj.fecha,categoria:'Viaticos - '+obj.categoria,
        descripcion:(emp?emp.nombre+': ':'')+obj.descripcion,monto:monto,
        proveedor:obj.proveedor,recurrente:false,createdAt:nowTs()});
      cerrarModal('viat');toast(id?'Gasto actualizado':'Gasto registrado');
      await navTo('viaticos');
    },true);
  setTimeout(calcIVAViatico,100);
}

function calcIVAViatico(){
  var tieneFac=document.getElementById('vt_tiene_fac');
  var mon=parseFloat(document.getElementById('vt_mon').value)||0;
  var ivaEl=document.getElementById('vt_iva');
  if(!ivaEl)return;
  var regimen=getRegimen();
  if(tieneFac&&tieneFac.checked&&regimen.creditoIVA&&mon>0){
    // El IVA esta incluido en el monto: IVA = monto * 12/112
    var iva=parseFloat((mon*regimen.iva/(1+regimen.iva)).toFixed(2));
    ivaEl.value=iva;
    ivaEl.style.color='var(--green)';
  }else{
    ivaEl.value='0';
    ivaEl.style.color='var(--text3)';
  }
}

async function borrarViatico(id){
  if(!confirm('Eliminar este gasto?'))return;
  await dbDelete('viaticos',id);
  await navTo('viaticos');
}

// ---- SIDEBAR DINAMICO CON NOMBRE DE EMPRESA ----


// ---- IVA/ISR SEGUN REGIMEN CONFIGURABLE ----
async function renderImpuestos(content, actions) {
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Solo administradores</div>';return;}
  var cfg = await dbGet('config','taller') || {};
  var regimen = getRegimen();
  var regimenKey = window._regimenFiscal || 'regimen_utilidades';
  var facturas = await dbGetAll('facturas');
  var costos   = await dbGetAll('costos');
  var viaticos = await dbGetAll('viaticos');
  var empleados = await dbGetAll('empleados');
  var anio = new Date().getFullYear();
  var activos = empleados.filter(function(e){return e.activo!==false;});

  var cargaLabMensual = activos.reduce(function(a,e){
    var sal=e.salarioBase||0;
    return a+sal+sal*0.1267+sal*0.01+sal*0.01+250+sal/12+sal/12+(sal/30)*15/12+sal/12;
  },0);

  // Selector de regimen
  var regOpts = Object.entries(REGIMENES_FISCAL).map(function(entry){
    return '<option value="'+entry[0]+'"'+(regimenKey===entry[0]?' selected':'')+'>'+entry[1].label+'</option>';
  }).join('');

  var trimestres = [
    {label:'1er Trimestre (Ene-Mar)',meses:['01','02','03'],vence:anio+'-04-30'},
    {label:'2do Trimestre (Abr-Jun)',meses:['04','05','06'],vence:anio+'-07-31'},
    {label:'3er Trimestre (Jul-Sep)',meses:['07','08','09'],vence:anio+'-10-31'},
    {label:'4to Trimestre (Oct-Dic)',meses:['10','11','12'],vence:(anio+1)+'-01-31'}
  ];

  var tarjetas = trimestres.map(function(tri){
    var ingBruto=0,costosT=0,viaticosT=0,ivaCompras=0;
    tri.meses.forEach(function(m){
      var pre=anio+'-'+m;
      ingBruto+=facturas.filter(function(f){return f.fecha&&f.fecha.startsWith(pre);}).reduce(function(a,f){return a+(f.subtotal||0);},0);
      costosT+=costos.filter(function(c){return c.fecha&&c.fecha.startsWith(pre);}).reduce(function(a,c){return a+(c.monto||0);},0);
      viaticosT+=viaticos.filter(function(v){return v.fecha&&v.fecha.startsWith(pre)&&v.deducible;}).reduce(function(a,v){return a+(v.monto||0);},0);
      ivaCompras+=viaticos.filter(function(v){return v.fecha&&v.fecha.startsWith(pre)&&v.tieneFactura&&v.deducible;}).reduce(function(a,v){return a+(v.ivaAcreditado||0);},0);
    });
    var cargaLab=cargaLabMensual*3;
    var ivaDeb=facturas.filter(function(f){
      return f.fecha&&tri.meses.some(function(m){return f.fecha.startsWith(anio+'-'+m);});
    }).reduce(function(a,f){return a+(f.iva||0);},0);
    var ivaNet=ivaDeb-ivaCompras;
    var isr=0,utilidad=0,base=0;
    if(regimen.isrTipo==='utilidades'){
      var deducibles=regimen.deducibles.length>0?(costosT+cargaLab+viaticosT):0;
      utilidad=Math.max(0,ingBruto-deducibles);
      isr=utilidad*regimen.isr;
      base=utilidad;
    }else if(regimen.isrTipo==='bruto_mensual'){
      base=ingBruto;
      isr=base*regimen.isr;
    }
    var dias=Math.round((new Date(tri.vence+'T00:00:00')-new Date())/86400000);
    var colorV=dias<15?'var(--red)':dias<45?'var(--accent)':'var(--green)';
    return '<div class="card">'
      +'<div class="card-header"><span class="card-title">'+tri.label+'</span>'
      +'<span style="font-size:11px;color:'+colorV+'">Vence: '+fechaLegible(tri.vence)+(dias>0?' ('+dias+'d)':' (VENCIDO)')+'</span></div>'
      +'<div class="stat-grid" style="grid-template-columns:repeat('+(regimen.creditoIVA?5:4)+',1fr)">'
      +'<div class="stat-card stat-green"><div class="stat-label">Ingresos netos</div><div class="stat-value" style="font-size:14px">'+fmt(ingBruto)+'</div></div>'
      +(regimen.deducibles.length>0?'<div class="stat-card stat-red"><div class="stat-label">Costos+Nomina+Viaticos</div><div class="stat-value" style="font-size:14px">'+fmt(costosT+cargaLab+viaticosT)+'</div><div class="stat-sub">Deducibles ISR</div></div>':'')
      +'<div class="stat-card stat-amber"><div class="stat-label">Base imponible</div><div class="stat-value" style="font-size:14px">'+fmt(base)+'</div></div>'
      +'<div class="stat-card stat-red"><div class="stat-label">ISR a pagar ('+( regimen.isr*100).toFixed(0)+'%)</div><div class="stat-value" style="font-size:14px">'+fmt(isr)+'</div></div>'
      +(regimen.creditoIVA?'<div class="stat-card stat-amber"><div class="stat-label">IVA neto SAT</div><div class="stat-value" style="font-size:14px">'+fmt(ivaNet)+'</div><div class="stat-sub">Debito Q'+ivaDeb.toFixed(0)+' - Credito Q'+ivaCompras.toFixed(0)+'</div></div>':'')
      +'</div></div>';
  }).join('');

  content.innerHTML='<div class="section-title">IVA / ISR - '+anio+'</div>'
    +'<div class="section-sub">'+regimen.descripcion+'</div>'
    +'<div class="card"><div class="card-title" style="margin-bottom:10px">Regimen fiscal activo</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Seleccionar regimen SAT</label>'
    +'<select id="sel_regimen" onchange="cambiarRegimen()">'+regOpts+'</select></div>'
    +'<div class="form-group" style="display:flex;align-items:flex-end"><button class="btn btn-primary" onclick="guardarRegimen()">Aplicar regimen</button></div>'
    +'</div>'
    +'<div id="regimen_info" style="font-size:12px;color:var(--text2);padding:8px;background:var(--bg3);border-radius:6px">'+regimen.descripcion+'</div>'
    +'</div>'
    +tarjetas;
}

function cambiarRegimen(){
  var sel=document.getElementById('sel_regimen');
  var info=document.getElementById('regimen_info');
  if(!sel||!info)return;
  var r=REGIMENES_FISCAL[sel.value];
  if(r)info.innerHTML=r.descripcion;
}

async function guardarRegimen(){
  var sel=document.getElementById('sel_regimen');
  if(!sel)return;
  var cfg=await dbGet('config','taller')||{};
  cfg.regimenFiscal=sel.value;
  cfg.updatedAt=nowTs();
  await dbPut('config',cfg);
  window._regimenFiscal=sel.value;
  window._IVA=getRegimen().iva;
  toast('Regimen fiscal actualizado: '+getRegimen().label);
  await navTo('impuestos');
}

// ---- CONFIGURACION DE NOTIFICACIONES WA EMPRESA ----




// ================================================================
// v3.2 - WA filtros/acciones, Alertas envio por demanda,
//        Logo empresa en config, Telefono en mensaje WA
// ================================================================

// ---- WHATSAPP: MENSAJE CON TELEFONO DE EMPRESA ----
async function construirMensaje(clienteId, vehiculoId, template) {
  var cli = await dbGet('clientes', clienteId);
  var veh = await dbGet('vehiculos', vehiculoId);
  var cfg = await dbGet('config','taller') || {};
  var waCfg = await dbGet('config','whatsapp') || {};
  if (!cli || !veh) return null;
  var tplBase = template || waCfg.template
    || 'Hola {cliente}! Le recordamos que su vehiculo {placa} ({modelo}) tiene programado su *{servicio}* el *{fecha}*. Para reagendar llame a {taller} al {telefono}. Gracias!';
  var msg = tplBase
    .replace(/{cliente}/g, cli.nombre)
    .replace(/{placa}/g, veh.placa)
    .replace(/{modelo}/g, (veh.marca||'')+' '+(veh.modelo||''))
    .replace(/{fecha}/g, veh.proximoServicio||'proxima semana')
    .replace(/{servicio}/g, veh.tipoServicio||'mantenimiento preventivo')
    .replace(/{taller}/g, waCfg.nombreTaller||cfg.nombre||'el taller')
    .replace(/{telefono}/g, cfg.telefono||waCfg.numero||'---');
  return {msg:msg, tel:cli.whatsapp||cli.telefono||'', clienteNombre:cli.nombre};
}

// ---- ALERTAS: ENVIO POR DEMANDA + FILTROS ----
async function renderAlertas(content, actions) {
  await generarAlertas_v2();
  var alertas = await dbGetAll('alertas');
  var waCfg   = await dbGet('config','whatsapp') || {};
  var notif   = await dbGet('config','notificaciones') || {};

  alertas.sort(function(a,b){
    var p={alta:0,media:1,baja:2};
    return ((p[a.prioridad]||1)-(p[b.prioridad]||1)) || ((a.fecha||'')<(b.fecha||'')?1:-1);
  });

  var filtroActivo = window._alertaFiltro || 'todas';
  var pendientes = alertas.filter(function(a){return !a.vista;});
  var leidas     = alertas.filter(function(a){return a.vista;});
  var noEnviadas = alertas.filter(function(a){return !a.vista && !a.enviadaWA;});

  actions.innerHTML =
    '<button class="btn btn-secondary" onclick="marcarTodasLeidas()">Todas leidas</button>'
    + (waCfg.apiKey && notif.enviarWA
      ? ' <button class="btn btn-green" onclick="enviarAlertasPorDemanda()">Enviar por WA ('+(noEnviadas.length)+')</button>'
      : '')
    + ' <button class="btn btn-danger btn-sm" onclick="borrarAlertasLeidas()">Borrar leidas</button>';

  // Filtros
  var filtros = [
    {k:'todas', label:'Todas ('+alertas.length+')'},
    {k:'pendientes', label:'Pendientes ('+pendientes.length+')'},
    {k:'alta', label:'Urgentes ('+alertas.filter(function(a){return a.prioridad==='alta'&&!a.vista;}).length+')'},
    {k:'enviadas', label:'Enviadas WA'},
    {k:'leidas', label:'Leidas'},
  ];
  var filtroHTML = '<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">'
    + filtros.map(function(f){
      return '<button class="btn btn-sm '+(filtroActivo===f.k?'btn-primary':'btn-secondary')+'" onclick="filtrarAlertas(\''+f.k+'\')">'+f.label+'</button>';
    }).join('')+'</div>';

  var icons = {mantenimiento:'[M]',stock:'[S]',vencimiento:'[V]',cobro:'[C]',correctivo:'[!]',margen:'[%]'};

  function alertaItem(a, dim) {
    var enviadaBadge = a.enviadaWA
      ? ' <span class="badge badge-blue" style="font-size:9px">WA enviado</span>'
      : '';
    return '<div class="alert-item" style="'+(dim?'opacity:.5':'')+'" id="alrt_'+a.id+'">'
      + '<span style="font-size:14px;font-family:var(--font-mono);color:var(--text3)">'+(icons[a.tipo]||'[*]')+'</span>'
      + '<div style="flex:1">'
      +   '<div style="font-weight:600;font-size:13px">'+a.titulo
      +     (a.prioridad==='alta'?' <span class="badge badge-red">Urgente</span>':a.prioridad==='media'?' <span class="badge badge-amber">Media</span>':'')
      +     enviadaBadge+'</div>'
      +   '<div style="font-size:12px;color:var(--text2);margin-top:2px">'+(a.descripcion||'')+'</div>'
      +   '<div style="font-size:10px;color:var(--text3);margin-top:2px">'+fechaLegible(a.fecha)+'</div>'
      + '</div>'
      + '<div style="display:flex;gap:5px;flex-shrink:0">'
      +   (waCfg.apiKey && !a.enviadaWA ? '<button class="btn btn-sm btn-green" onclick="enviarAlertaWA('+a.id+')">WA</button>' : '')
      +   (!a.vista ? '<button class="btn btn-sm btn-secondary" onclick="marcarLeida('+a.id+')">Leido</button>' : '')
      +   '<button class="btn btn-sm btn-danger" onclick="borrarAlertaItem('+a.id+')">X</button>'
      + '</div>'
      + '</div>';
  }

  var lista = alertas.filter(function(a){
    if(filtroActivo==='pendientes') return !a.vista;
    if(filtroActivo==='alta') return a.prioridad==='alta'&&!a.vista;
    if(filtroActivo==='enviadas') return a.enviadaWA;
    if(filtroActivo==='leidas') return a.vista;
    return true;
  });

  var htmlLista = lista.length
    ? lista.map(function(a){ return alertaItem(a, a.vista); }).join('')
    : '<div class="alert alert-green">Sin alertas en este filtro</div>';

  content.innerHTML = '<div class="section-title">Centro de Alertas</div>'
    + '<div class="section-sub">'+pendientes.length+' pendientes &mdash; '+noEnviadas.length+' sin enviar por WA</div>'
    + filtroHTML
    + htmlLista;
}

function filtrarAlertas(filtro) {
  window._alertaFiltro = filtro;
  navTo('alertas');
}

async function enviarAlertaWA(alertaId) {
  var a = await dbGet('alertas', alertaId);
  if (!a) return;
  var waCfg   = await dbGet('config','whatsapp') || {};
  var notif   = await dbGet('config','notificaciones') || {};
  var cfg     = await dbGet('config','taller') || {};
  if (!waCfg.apiKey) { toast('Configura CallMeBot en WhatsApp Bot','amber'); return; }
  var numeros = [];
  if (notif.numGerente) numeros.push(notif.numGerente);
  if (notif.numAdmin)   numeros.push(notif.numAdmin);
  if (notif.numJefeTaller) numeros.push(notif.numJefeTaller);
  if (!numeros.length) { toast('Configura numeros de empresa en Configuracion','amber'); return; }
  var msg = 'ALERTA '+(a.prioridad==='alta'?'URGENTE':a.prioridad||'').toUpperCase()+'\n'
    + a.titulo + '\n' + (a.descripcion||'') + '\n'
    + (cfg.nombre||'TallerPro GT') + ' | Tel: '+(cfg.telefono||'---') + '\n'
    + fechaLegible(a.fecha);
  var ok = false;
  for (var i=0; i<numeros.length; i++) {
    var tel = numeros[i].replace(/[\s\-()]/g,'');
    if (!tel.startsWith('+')) tel = '+502'+tel;
    try { var _r = await enviarWACallMeBot(tel, msg, waCfg.apiKey); ok = _r.ok || true; } catch(e) {}
    await new Promise(function(r){setTimeout(r,900);});
  }
  if (ok) {
    a.enviadaWA = true; a.fechaEnvioWA = nowTs();
    await dbPut('alertas', a);
    toast('Alerta enviada por WhatsApp');
    navTo('alertas');
  } else {
    toast('Error al enviar. Verifica conexion y CallMeBot','red');
  }
}

async function enviarAlertasPorDemanda() {
  var alertas  = await dbGetAll('alertas');
  var waCfg    = await dbGet('config','whatsapp') || {};
  var notif    = await dbGet('config','notificaciones') || {};
  var cfg      = await dbGet('config','taller') || {};
  var noEnv    = alertas.filter(function(a){return !a.vista && !a.enviadaWA;});
  if (!noEnv.length) { toast('Todas las alertas ya fueron enviadas','amber'); return; }
  if (!waCfg.apiKey) { toast('Configura CallMeBot primero','amber'); return; }
  var numeros = [notif.numGerente,notif.numAdmin,notif.numJefeTaller].filter(Boolean);
  if (!numeros.length) { toast('Agrega numeros de empresa en Configuracion','amber'); return; }
  if (!confirm('Enviar '+noEnv.length+' alertas a '+numeros.length+' numero(s)?')) return;

  var resumen = '['+( cfg.nombre||'TALLER')+'] '+new Date().toLocaleString('es-GT')+'\n\n'
    + noEnv.slice(0,8).map(function(a,i){
      return (i+1)+'. '+(a.prioridad==='alta'?'[URGENTE] ':'')+a.titulo;
    }).join('\n')
    + (noEnv.length>8?'\n...y '+(noEnv.length-8)+' alertas mas.':'')
    + '\n\nTel: '+(cfg.telefono||'---');

  var ok = false;
  for (var i=0; i<numeros.length; i++) {
    var tel = numeros[i].replace(/[\s\-()]/g,'');
    if (!tel.startsWith('+')) tel = '+502'+tel;
    try { var _r2 = await enviarWACallMeBot(tel, resumen, waCfg.apiKey); ok = _r2.ok || true; } catch(e) {}
    await new Promise(function(r){setTimeout(r,900);});
  }
  if (ok) {
    for (var j=0; j<noEnv.length; j++) {
      noEnv[j].enviadaWA=true; noEnv[j].fechaEnvioWA=nowTs();
      await dbPut('alertas',noEnv[j]);
    }
    toast('Alertas enviadas: '+noEnv.length);
  } else {
    toast('Error de red','red');
  }
  navTo('alertas');
}

async function marcarLeida(id) {
  var a = await dbGet('alertas',id); if(a){a.vista=true;await dbPut('alertas',a);}
  navTo('alertas');
}
async function marcarTodasLeidas() {
  var all = await dbGetAll('alertas');
  for(var i=0;i<all.length;i++){all[i].vista=true;await dbPut('alertas',all[i]);}
  toast('Todas marcadas como leidas');
  navTo('alertas');
}
async function borrarAlertaItem(id) {
  await dbDelete('alertas',id);
  navTo('alertas');
}
async function borrarAlertasLeidas() {
  if (!confirm('Eliminar todas las alertas ya leidas?')) return;
  var all = await dbGetAll('alertas');
  var leidas = all.filter(function(a){return a.vista;});
  for(var i=0;i<leidas.length;i++) await dbDelete('alertas',leidas[i].id);
  toast(leidas.length+' alertas eliminadas');
  navTo('alertas');
}

// ---- LOGO EN SIDEBAR Y MODULO CONFIG ----
async function actualizarSidebarEmpresa() {
  var cfg = await dbGet('config','taller') || {};
  var eEl = document.getElementById('sidebar-empresa');
  var nEl = document.getElementById('sidebar-nit');
  var logoImg = document.getElementById('sidebar-logo-img');
  if (eEl) eEl.textContent = cfg.nombre || 'Mi Empresa';
  if (nEl) nEl.textContent = 'NIT: '+(cfg.nit||'---');
  // Cargar logo si existe
  if (logoImg) {
    var logoData = localStorage.getItem('tpgt_logo');
    if (logoData) {
      logoImg.src = logoData;
      logoImg.style.display = 'block';
    } else {
      logoImg.style.display = 'none';
    }
  }
  // Actualizar logo en topbar si existe
  var topLogo = document.getElementById('topbar-logo-img');
  if (topLogo) {
    var ld2 = localStorage.getItem('tpgt_logo');
    topLogo.src = ld2||''; topLogo.style.display = ld2?'inline-block':'none';
  }
}

function cargarLogoEmpresa() {
  var input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    if (file.size > 500*1024) { toast('Imagen demasiado grande. Max 500KB','red'); return; }
    var rd = new FileReader();
    rd.onload = function(ev) {
      localStorage.setItem('tpgt_logo', ev.target.result);
      actualizarSidebarEmpresa();
      // Mostrar preview en config
      var prev = document.getElementById('logo_preview');
      if (prev) { prev.src=ev.target.result; prev.style.display='block'; }
      toast('Logo cargado correctamente');
    };
    rd.readAsDataURL(file);
  };
  input.click();
}

function borrarLogo() {
  localStorage.removeItem('tpgt_logo');
  actualizarSidebarEmpresa();
  var prev = document.getElementById('logo_preview');
  if (prev) { prev.src=''; prev.style.display='none'; }
  toast('Logo eliminado');
}

// ---- CONFIGURACION COMPLETA REESCRITA ----

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
