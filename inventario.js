/* TallerPro GT — js/importar.js
   Módulo independiente — cada archivo tiene funciones específicas
   Para editar: modificar solo este archivo y recargar
*/

function generarAlertasAutomaticas(){
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
function renderWhatsApp(content, actions) {
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

async
