/* TallerPro GT — finanzas.js */

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

