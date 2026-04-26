/* TallerPro GT — js/ordenes.js
   Módulo independiente — cada archivo tiene funciones específicas
   Para editar: modificar solo este archivo y recargar
*/

function renderOrdenes(content,actions){
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

async
