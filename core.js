/* TallerPro GT — js/finanzas.js
   Módulo independiente — cada archivo tiene funciones específicas
   Para editar: modificar solo este archivo y recargar
*/

function renderCostos(content,actions){
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




async function renderBancos(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Solo administradores</div>';return;}
  var cuentas,movs;
  try{cuentas=await dbGetAll('cuentas_bancarias');movs=await dbGetAll('movimientos_bancarios');}catch(e){content.innerHTML='<div class="alert alert-amber">Actualizando base de datos... Recarga la pagina (F5)</div>';return;}
  actions.innerHTML='<button class="btn btn-secondary" onclick="modalMovimiento()">+ Movimiento</button> <button class="btn btn-primary" onclick="modalCuentaBancaria()">+ Nueva cuenta</button>';
  var totalSaldo=cuentas.reduce(function(a,c){return a+(c.saldo||0);},0);
  var tarjetas=cuentas.map(function(c){
    var mC=movs.filter(function(m){return m.cuentaId===c.id;});
    var ing=mC.filter(function(m){return m.tipo==='ingreso';}).reduce(function(a,m){return a+(m.monto||0);},0);
    var egr=mC.filter(function(m){return m.tipo==='egreso';}).reduce(function(a,m){return a+(m.monto||0);},0);
    return '<div class="stat-card" style="border-left:3px solid var(--'+(c.saldo>=0?'green':'red')+')">'
      +'<div class="stat-label">'+c.banco+' &mdash; '+c.tipoCuenta+'</div>'
      +'<div style="font-size:11px;color:var(--text3)">No. '+(c.numeroCuenta||'---')+'</div>'
      +'<div class="stat-value '+(c.saldo>=0?'text-green':'text-red')+'">'+fmt(c.saldo||0)+'</div>'
      +'<div style="display:flex;gap:12px;margin-top:6px;font-size:11px">'
      +'<span class="text-green">IN: '+fmt(ing)+'</span><span class="text-red">OUT: '+fmt(egr)+'</span></div>'
      +'<div style="display:flex;gap:6px;margin-top:8px">'
      +'<button class="btn btn-sm btn-secondary" onclick="modalCuentaBancaria('+c.id+')">Editar</button>'
      +'<button class="btn btn-sm btn-blue" onclick="verMovsCuenta('+c.id+')">Movimientos</button>'
      +'</div></div>';
  }).join('');
  var movRec=movs.slice().reverse().slice(0,25);
  var filasMov=movRec.map(function(m){
    var ct=cuentas.find(function(c){return c.id===m.cuentaId;});
    return '<tr><td>'+fechaLegible(m.fecha)+'</td>'
      +'<td>'+(ct?ct.banco:'---')+'</td>'
      +'<td><span class="badge badge-'+(m.tipo==='ingreso'?'green':'red')+'">'+m.tipo+'</span></td>'
      +'<td>'+(m.concepto||'---')+'</td>'
      +'<td class="td-mono td-right '+(m.tipo==='ingreso'?'text-green':'text-red')+'">'+(m.tipo==='ingreso'?'+':'-')+fmt(m.monto||0)+'</td>'
      +'<td class="td-mono td-right">'+fmt(m.saldoDespues||0)+'</td></tr>';
  }).join('');
  content.innerHTML='<div class="section-title">Cuentas Bancarias</div>'
    +'<div class="section-sub">Saldo total: <strong class="text-green">'+fmt(totalSaldo)+'</strong></div>'
    +'<div class="stat-grid">'+(tarjetas||'<div class="text-muted" style="padding:12px">Sin cuentas. Agregalas en Configuracion.</div>')+'</div>'
    +'<div class="card"><div class="card-header"><span class="card-title">Ultimos movimientos</span><button class="btn btn-sm btn-primary" onclick="modalMovimiento()">+ Nuevo</button></div>'
    +'<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Banco</th><th>Tipo</th><th>Concepto</th><th class="td-right">Monto</th><th class="td-right">Saldo</th></tr></thead>'
    +'<tbody>'+(filasMov||'<tr><td colspan="6" class="text-center text-muted" style="padding:16px">Sin movimientos</td></tr>')+'</tbody></table></div></div>';
}

async function modalCuentaBancaria(id){
  if(!soloAdmin())return;
  var c=id?await dbGet('cuentas_bancarias',id):{};
  var bancos=['Banco Industrial','Banrural','BAM','Bantrab','G&T Continental','Promerica','Ficohsa','BI','Otro'];
  var tipos=['Monetaria','Ahorro','Cheques','Deposito a plazo'];
  openModal('cuentaBanc',id?'Editar Cuenta':'Nueva Cuenta Bancaria',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Banco *</label><select id="cb_ban">'+bancos.map(function(b){return'<option value="'+b+'"'+(c.banco===b?' selected':'')+'>'+b+'</option>';}).join('')+'</select></div>'
    +'<div class="form-group"><label>Tipo de cuenta *</label><select id="cb_tip">'+tipos.map(function(t){return'<option value="'+t+'"'+(c.tipoCuenta===t?' selected':'')+'>'+t+'</option>';}).join('')+'</select></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Numero de cuenta *</label><input id="cb_num" value="'+(c.numeroCuenta||'')+'" placeholder="0000-0000-0000"></div>'
    +'<div class="form-group"><label>Nombre del titular</label><input id="cb_tit" value="'+(c.titular||'')+'" placeholder="Nombre en el banco"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Saldo actual (Q)</label><input id="cb_sal" type="number" value="'+(c.saldo||0)+'" step="0.01"></div>'
    +'<div class="form-group"><label>Moneda</label><select id="cb_mon"><option value="GTQ"'+(c.moneda==='GTQ'||!c.moneda?' selected':'')+'>Quetzales (GTQ)</option><option value="USD"'+(c.moneda==='USD'?' selected':'')+'>Dolares (USD)</option></select></div>'
    +'</div>'
    +'<div class="form-group"><label>Descripcion / Uso</label><input id="cb_des" value="'+(c.descripcion||'')+'" placeholder="Cuenta operativa, nomina, proveedores..."></div>',
    async function(){
      var ban=document.getElementById('cb_ban').value;
      var num=document.getElementById('cb_num').value.trim();
      if(!ban||!num){toast('Banco y numero requeridos','red');return;}
      var obj={banco:ban,tipoCuenta:document.getElementById('cb_tip').value,numeroCuenta:num,
        titular:document.getElementById('cb_tit').value.trim(),
        saldo:parseFloat(document.getElementById('cb_sal').value)||0,
        moneda:document.getElementById('cb_mon').value,
        descripcion:document.getElementById('cb_des').value.trim(),updatedAt:nowTs()};
      if(id){obj.id=id;await dbPut('cuentas_bancarias',obj);}else{obj.createdAt=nowTs();await dbAdd('cuentas_bancarias',obj);}
      closeModal('cuentaBanc');toast(id?'Actualizada':'Cuenta registrada');await navTo('bancos');
    },true);
}

async function modalMovimiento(cuentaPresel){
  var cuentas=await dbGetAll('cuentas_bancarias');
  if(!cuentas.length){toast('Primero registra una cuenta bancaria','amber');return;}
  var opts=cuentas.map(function(c){return'<option value="'+c.id+'"'+(cuentaPresel===c.id?' selected':'')+'>'+c.banco+' - '+c.tipoCuenta+' ('+c.numeroCuenta+')</option>';}).join('');
  var cats=['Cobro de factura','Pago de nomina','Pago a proveedor','Pago de impuestos (SAT)','Ingreso por servicios','Gasto operativo','Compra de repuestos','Pago de servicio fijo','Transferencia entre cuentas','Otro'];
  openModal('movBanc','Registrar Movimiento Bancario',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Cuenta *</label><select id="mv_cta">'+opts+'</select></div>'
    +'<div class="form-group"><label>Fecha *</label><input id="mv_fec" type="date" value="'+today()+'"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Tipo *</label><select id="mv_tip"><option value="ingreso">Ingreso (entrada de dinero)</option><option value="egreso">Egreso (salida de dinero)</option></select></div>'
    +'<div class="form-group"><label>Monto (Q) *</label><input id="mv_mon" type="number" step="0.01" placeholder="0.00" min="0"></div>'
    +'</div>'
    +'<div class="form-group"><label>Concepto *</label><input id="mv_con" placeholder="Ej: Cobro FAC-001, Pago nomina enero, Pago proveedor..."></div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Categoria</label><select id="mv_cat">'+cats.map(function(c){return'<option value="'+c+'">'+c+'</option>';}).join('')+'</select></div>'
    +'<div class="form-group"><label>No. referencia / cheque</label><input id="mv_ref" placeholder="Opcional"></div>'
    +'</div>'
    +'<div class="form-group"><label><input type="checkbox" id="mv_cos" style="width:auto;margin-right:6px"> Registrar tambien en Costos Operativos (si es egreso)</label></div>',
    async function(){
      var cId=parseInt(document.getElementById('mv_cta').value);
      var mon=parseFloat(document.getElementById('mv_mon').value)||0;
      var con=document.getElementById('mv_con').value.trim();
      if(!cId||!mon||!con){toast('Cuenta, monto y concepto requeridos','red');return;}
      var tipo=document.getElementById('mv_tip').value;
      var cuenta=await dbGet('cuentas_bancarias',cId);
      if(!cuenta){toast('Cuenta no encontrada','red');return;}
      var saldoNuevo=parseFloat(((cuenta.saldo||0)+(tipo==='ingreso'?mon:-mon)).toFixed(2));
      cuenta.saldo=saldoNuevo;cuenta.updatedAt=nowTs();
      await dbPut('cuentas_bancarias',cuenta);
      await dbAdd('movimientos_bancarios',{
        cuentaId:cId,fecha:document.getElementById('mv_fec').value,
        tipo:tipo,monto:mon,concepto:con,
        referencia:document.getElementById('mv_ref').value,
        categoria:document.getElementById('mv_cat').value,
        saldoDespues:saldoNuevo,createdAt:nowTs()
      });
      if(tipo==='egreso'&&document.getElementById('mv_cos').checked){
        await dbAdd('costos',{fecha:document.getElementById('mv_fec').value,
          categoria:document.getElementById('mv_cat').value,descripcion:con,
          monto:mon,comprobante:document.getElementById('mv_ref').value,
          recurrente:false,createdAt:nowTs()});
      }
      closeModal('movBanc');
      toast('Movimiento registrado. Saldo: '+fmt(saldoNuevo));
      await navTo('bancos');
    },true);
}

async function verMovsCuenta(cuentaId){
  var cuenta=await dbGet('cuentas_bancarias',cuentaId);
  var movs=await dbGetAll('movimientos_bancarios');
  var mC=movs.filter(function(m){return m.cuentaId===cuentaId;}).reverse();
  openModal('mLst','Movimientos - '+(cuenta?cuenta.banco+' '+cuenta.tipoCuenta:''),
    '<div style="text-align:right;margin-bottom:12px"><strong>Saldo actual: <span class="text-green">'+fmt(cuenta?cuenta.saldo:0)+'</span></strong></div>'
    +'<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Tipo</th><th>Concepto</th><th>Ref.</th><th class="td-right">Monto</th><th class="td-right">Saldo</th></tr></thead>'
    +'<tbody>'+(mC.length?mC.map(function(m){
      return'<tr><td>'+fechaLegible(m.fecha)+'</td>'
        +'<td><span class="badge badge-'+(m.tipo==='ingreso'?'green':'red')+'">'+m.tipo+'</span></td>'
        +'<td>'+(m.concepto||'---')+'</td>'
        +'<td class="td-mono" style="font-size:10px">'+(m.referencia||'---')+'</td>'
        +'<td class="td-mono td-right '+(m.tipo==='ingreso'?'text-green':'text-red')+'">'+(m.tipo==='ingreso'?'+':'-')+fmt(m.monto||0)+'</td>'
        +'<td class="td-mono td-right">'+fmt(m.saldoDespues||0)+'</td></tr>';
    }).join(''):'<tr><td colspan="6" class="text-center text-muted" style="padding:16px">Sin movimientos</td></tr>')
    +'</tbody></table></div>',
    function(){closeModal('mLst');},true);
}

async function renderServicios(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Solo administradores</div>';return;}
  var servicios;
  try{servicios=await dbGetAll('servicios');}catch(e){content.innerHTML='<div class="alert alert-amber">Actualizando base de datos... Recarga la pagina (F5)</div>';return;}
  actions.innerHTML='<button class="btn btn-secondary" onclick="aplicarServiciosMes()">Aplicar al mes</button> <button class="btn btn-primary" onclick="modalServicio()">+ Nuevo servicio</button>';
  var rows=servicios.map(function(s){
    return'<tr><td><strong>'+s.nombre+'</strong></td>'
      +'<td><span class="badge badge-gray">'+(s.categoria||'Otro')+'</span></td>'
      +'<td>'+(s.proveedor||'---')+'</td>'
      +'<td class="td-mono td-right text-red">'+fmt(s.monto||0)+'</td>'
      +'<td><span class="badge badge-'+(s.activo!==false?'green':'gray')+'">'+(s.activo!==false?'Activo':'Inactivo')+'</span></td>'
      +'<td>'+(s.diaPago?'Dia '+s.diaPago+'/mes':'Manual')+'</td>'
      +'<td><div class="flex gap-1">'
      +'<button class="btn btn-sm btn-secondary" onclick="modalServicio('+s.id+')">Editar</button>'
      +'<button class="btn btn-sm btn-danger" onclick="borrarServicio('+s.id+')">X</button>'
      +'</div></td></tr>';
  }).join('');
  var total=servicios.filter(function(s){return s.activo!==false;}).reduce(function(a,s){return a+(s.monto||0);},0);
  content.innerHTML='<div class="section-title">Servicios y Gastos Fijos</div>'
    +'<div class="section-sub">Total mensual activos: <strong class="text-red">'+fmt(total)+'</strong></div>'
    +'<div class="alert alert-blue" style="font-size:12px">"Aplicar al mes" registra estos servicios en Costos Operativos y afecta el dashboard financiero.</div>'
    +'<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    +'<thead><tr><th>Servicio</th><th>Categoria</th><th>Proveedor</th><th class="td-right">Monto/mes</th><th>Estado</th><th>Dia pago</th><th>Acciones</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="7" class="text-center text-muted" style="padding:16px">Sin servicios</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

async function modalServicio(id){
  if(!soloAdmin())return;
  var s=id?await dbGet('servicios',id):{};
  var cats=['Agua y alcantarillado','Energia electrica','Internet y telefono','Extraccion de basura','Seguridad','Alquiler','Gas','Utiles de oficina','Limpieza','Mantenimiento','Otro'];
  openModal('serv',id?'Editar Servicio':'Nuevo Servicio Recurrente',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Nombre del servicio *</label><input id="sv_n" value="'+(s.nombre||'')+'" placeholder="Ej: Agua, Internet, Basura..."></div>'
    +'<div class="form-group"><label>Categoria</label><select id="sv_c">'+cats.map(function(c){return'<option value="'+c+'"'+(s.categoria===c?' selected':'')+'>'+c+'</option>';}).join('')+'</select></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Proveedor / Empresa</label><input id="sv_p" value="'+(s.proveedor||'')+'" placeholder="Nombre de la empresa"></div>'
    +'<div class="form-group"><label>Monto mensual (Q) *</label><input id="sv_m" type="number" value="'+(s.monto||'')+'" step="0.01"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Dia del mes para pago</label><input id="sv_d" type="number" value="'+(s.diaPago||'')+'" min="1" max="31" placeholder="1-31"></div>'
    +'<div class="form-group"><label>Estado</label><select id="sv_a"><option value="1"'+(s.activo!==false?' selected':'')+'>Activo</option><option value="0"'+(s.activo===false?' selected':'')+'>Inactivo</option></select></div>'
    +'</div>',
    async function(){
      var n=document.getElementById('sv_n').value.trim();
      var m=parseFloat(document.getElementById('sv_m').value)||0;
      if(!n||!m){toast('Nombre y monto requeridos','red');return;}
      var obj={nombre:n,categoria:document.getElementById('sv_c').value,
        proveedor:document.getElementById('sv_p').value.trim(),monto:m,
        diaPago:parseInt(document.getElementById('sv_d').value)||null,
        activo:document.getElementById('sv_a').value==='1',updatedAt:nowTs()};
      if(id){obj.id=id;await dbPut('servicios',obj);}else{obj.createdAt=nowTs();await dbAdd('servicios',obj);}
      closeModal('serv');toast(id?'Actualizado':'Registrado');await navTo('servicios');
    },true);
}

async function aplicarServiciosMes(){
  var servicios=await dbGetAll('servicios');
  var act=servicios.filter(function(s){return s.activo!==false;});
  if(!act.length){toast('No hay servicios activos','amber');return;}
  if(!confirm('Registrar '+act.length+' servicios en Costos Operativos del mes actual?'))return;
  for(var i=0;i<act.length;i++){
    var s=act[i];
    await dbAdd('costos',{fecha:today(),categoria:s.categoria||'Servicios',
      descripcion:s.nombre+(s.proveedor?' - '+s.proveedor:''),
      monto:s.monto,proveedor:s.proveedor||'',recurrente:true,createdAt:nowTs()});
  }
  toast(act.length+' servicios aplicados a Costos Operativos');
  await navTo('costos');
}

async function borrarServicio(id){
  if(!soloAdmin())return;
  if(!confirm('Eliminar este servicio?'))return;
  await dbDelete('servicios',id);await navTo('servicios');
}

// ---- SEGURIDAD: TIMEOUT SESION ----
var _sesTimer=null;
var SES_TIMEOUT=15*60*1000; // 15 min default, configurable

function resetSesTimer(){
  if(_sesTimer)clearTimeout(_sesTimer);
  _sesTimer=setTimeout(function(){
    toast('Sesion cerrada por inactividad','amber');
    logout();
  },SES_TIMEOUT);
}

function initSecurity(){
  ['click','keydown','mousemove','touchstart'].forEach(function(evt){
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

function renderIvaIsr(content,actions){
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
