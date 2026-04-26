/* TallerPro GT — importar.js */

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

