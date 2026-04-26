/* TallerPro GT — js/init.js
   Módulo independiente — cada archivo tiene funciones específicas
   Para editar: modificar solo este archivo y recargar
*/

function cargarDatosDemostracion(){
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

async document.addEventListener(evt,resetSesTimer,{passive:true});
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
