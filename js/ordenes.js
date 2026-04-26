/* TallerPro GT — ordenes.js */

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
