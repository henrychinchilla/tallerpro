/* TallerPro GT — js/empleados.js
   Módulo independiente — cada archivo tiene funciones específicas
   Para editar: modificar solo este archivo y recargar
*/

function renderEmpleados(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Acceso solo para administradores</div>';return;}
  const empleados=await dbGetAll('empleados');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalEmpleado()">+ Nuevo empleado</button>`;
  const activos=empleados.filter(e=>e.activo!==false);
  const totalNomina=activos.reduce((a,e)=>a+(e.salarioBase||0),0);

  content.innerHTML=`
  <div class="section-title">Gesti\u00F3n de Empleados</div>
  <div class="section-sub">${activos.length} empleados activos \u2014 N\u00F3mina base: <strong class="text-green">${fmt(totalNomina)}/mes</strong></div>

  <div class="stat-grid">
    <div class="stat-card stat-green"><div class="stat-label">Total empleados</div><div class="stat-value">${activos.length}</div></div>
    <div class="stat-card stat-amber"><div class="stat-label">N\u00F3mina base mensual</div><div class="stat-value">${fmt(totalNomina)}</div></div>
    <div class="stat-card"><div class="stat-label">Costo total c/prestaciones</div>
      <div class="stat-value" style="font-size:16px">${fmt(activos.reduce((a,e)=>a+calcCostoEmpleado(e),0))}</div>
      <div class="stat-sub">Incluye IGSS, Irtra, Intecap</div>
    </div>
  </div>

  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>Empleado</th><th>Cargo</th><th>Salario base</th><th>Costo total</th><th>IGSS</th><th>Bonif. ley</th><th>Ingreso</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>
        ${empleados.map(e=>{
          const costo=calcCostoEmpleado(e);
          const igss=e.salarioBase*0.0483;// 4.83% empleado
          const bonif=250;// Bonificaci\u00F3n decreto 78-89 Q250 fija
          return`<tr>
            <td><strong>${e.nombre}</strong><div style="font-size:11px;color:var(--text3)">${e.dpi||'DPI no registrado'}</div></td>
            <td><span class="badge badge-gray">${e.cargo||'\u2014'}</span></td>
            <td class="td-mono">${fmt(e.salarioBase||0)}</td>
            <td class="td-mono text-amber">${fmt(costo)}</td>
            <td class="td-mono" style="font-size:11px;color:var(--red)">-${fmt(igss)}</td>
            <td class="td-mono text-green">+${fmt(bonif)}</td>
            <td style="font-size:11px">${fechaLegible(e.fechaIngreso)}</td>
            <td><span class="badge badge-${e.activo!==false?'green':'gray'}">${e.activo!==false?'Activo':'Inactivo'}</span></td>
            <td><div class="flex gap-1">
              <button class="btn btn-sm btn-secondary" onclick="modalEmpleado(${e.id})">\u270F</button>
              <button class="btn btn-sm btn-blue" onclick="verPrestaciones(${e.id})">\u1F4CB</button>
              <button class="btn btn-sm btn-danger" onclick="toggleEmpleado(${e.id},${e.activo!==false})">\u23F8</button>
            </div></td>
          </tr>`;
        }).join('')||'<tr><td colspan="9" class="text-center text-muted" style="padding:20px">Sin empleados registrados</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}

function calcISREmpleado(salarioMensual) {
  // ISR Guatemala 2024 - Régimen sobre Utilidades (Art. 72 Ley Actualización Tributaria)
  // Renta anual = salario mensual * 12 + bono14 + aguinaldo
  var rentaAnual = salarioMensual * 12 + salarioMensual + salarioMensual; // incluye bono14 y aguinaldo
  var exencion = 48000; // Q48,000 exentos
  var renta = Math.max(0, rentaAnual - exencion);
  var isr = 0;
  if (renta <= 0) return 0;
  if (renta <= 300000) {
    isr = renta * 0.05; // 5% hasta Q300,000
  } else {
    isr = 300000 * 0.05 + (renta - 300000) * 0.07; // 7% sobre el excedente
  }
  return isr / 12; // retención mensual
}

function calcDetalleEmpleado(e) {
  var base    = e.salarioBase || 0;
  var bonifDecr = 250;                    // Bonificación Decreto 78-89 (obligatoria)
  var bonifAd = e.bonificacionAdicional || 0;
  var descAd  = e.descuentoAdicional || 0;
  // Deducciones del empleado
  var igssEmp = base * 0.0483;            // IGSS empleado 4.83%
  var isrEmp  = calcISREmpleado(base);    // ISR estimado mensual
  var neto    = base + bonifDecr + bonifAd - igssEmp - isrEmp - descAd;
  // Carga patronal
  var igssPatrono = base * 0.1267;        // 12.67% patronal
  var irtra       = base * 0.01;          // 1% IRTRA
  var intecap     = base * 0.01;          // 1% INTECAP
  // Provisiones mensuales (lo que se acumula cada mes)
  var provBono14  = base / 12;            // Bono 14 (1/12 mensual)
  var provAguinal = base / 12;            // Aguinaldo (1/12 mensual)
  var provIndem   = base / 12;            // Indemnización (1/12 mensual, Art.82 CT)
  var provVac     = (base * 15/365);      // Provisión vacaciones (15 días/año)
  // Costo total mensual para el empleador
  var costoDirecto = base + bonifDecr + bonifAd + igssPatrono + irtra + intecap;
  var provisiones  = provBono14 + provAguinal + provIndem + provVac;
  var costoTotal   = costoDirecto + provisiones;
  return {
    base, bonifDecr, bonifAd, descAd,
    igssEmp, isrEmp, neto,
    igssPatrono, irtra, intecap,
    provBono14, provAguinal, provIndem, provVac,
    costoDirecto, provisiones, costoTotal
  };
}

function calcCostoEmpleado(e) {
  return calcDetalleEmpleado(e).costoTotal;
}


function modalEmpleado(id=null){
  const e=id?await dbGet('empleados',id):{};
  openModal('modalEmpleado',id?'Editar Empleado':'Nuevo Empleado',`
    <div class="form-row form-row-2">
      <div class="form-group"><label>Nombre completo *</label><input id="em_nom" value="${e.nombre||''}" placeholder="Nombre del empleado"></div>
      <div class="form-group"><label>DPI</label><input id="em_dpi" value="${e.dpi||''}" placeholder="N\u00FAmero de DPI"></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Cargo *</label>
        <select id="em_cargo"><option value="Mec\u00E1nico" ${e.cargo==='Mec\u00E1nico'?'selected':''}>Mec\u00E1nico</option><option value="Mec\u00E1nico senior" ${e.cargo==='Mec\u00E1nico senior'?'selected':''}>Mec\u00E1nico senior</option><option value="Electricista" ${e.cargo==='Electricista'?'selected':''}>Electricista automotriz</option><option value="Auxiliar" ${e.cargo==='Auxiliar'?'selected':''}>Auxiliar mec\u00E1nico</option><option value="Recepcionista" ${e.cargo==='Recepcionista'?'selected':''}>Recepcionista</option><option value="Contador" ${e.cargo==='Contador'?'selected':''}>Contador</option><option value="Administrador" ${e.cargo==='Administrador'?'selected':''}>Administrador</option><option value="Otro" ${e.cargo==='Otro'?'selected':''}>Otro</option></select>
      </div>
      <div class="form-group">
      <label>Salario minimo 2026 — referencia (AG 256-2025)</label>
      <select id="em_salmin" onchange="aplicarSalMin(this,document.getElementById('em_sal'))" style="font-size:12px">
        <option value="">-- Auto-llenar con salario minimo legal --</option>
        <optgroup label="CE1 — Departamento de Guatemala">
          <option value="CE1_noAgricola">No Agricola CE1 — Q4,002.28 base + Q250 = Q4,252.28 (Talleres ✓)</option>
          <option value="CE1_agricola">Agricola CE1 — Q3,791.20 base + Q250 = Q4,041.20</option>
          <option value="CE1_maquila">Maquila/Exportadora CE1 — Q3,409.73 base + Q250 = Q3,659.73</option>
        </optgroup>
        <optgroup label="CE2 — Resto del pais">
          <option value="CE2_noAgricola">No Agricola CE2 — Q3,816.90 base + Q250 = Q4,066.90 (Talleres ✓)</option>
          <option value="CE2_agricola">Agricola CE2 — Q3,625.89 base + Q250 = Q3,875.89</option>
          <option value="CE2_maquila">Maquila/Exportadora CE2 — Q3,321.10 base + Q250 = Q3,571.10</option>
        </optgroup>
      </select>
      <div style="font-size:10px;color:var(--text3);margin-top:2px">Vigente 01-ene-2026. La bonificacion Q250 se registra aparte (Decreto 78-89).</div>
    </div>
<div class="form-group"><label>Salario base (Q) *</label><input id="em_sal" type="number" value="${e.salarioBase||3500}" min="0" step="1" oninput="calcPrestacionesPreview()"></div>
      <div class="form-group"><label>Tipo de contrato</label>
        <select id="em_tipo"><option value="indefinido" ${e.tipoContrato==='indefinido'?'selected':''}>Tiempo indefinido</option><option value="plazo_fijo" ${e.tipoContrato==='plazo_fijo'?'selected':''}>Plazo fijo</option><option value="obra" ${e.tipoContrato==='obra'?'selected':''}>Por obra</option></select>
      </div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Fecha de ingreso</label><input id="em_finicio" type="date" value="${e.fechaIngreso||today()}"></div>
      <div class="form-group"><label>Tel\u00E9fono</label><input id="em_tel" value="${e.telefono||''}" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>
      <div class="form-group"><label>Email</label><input id="em_email" value="${e.email||''}" placeholder="empleado@correo.com"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>N\u00FAmero IGSS</label><input id="em_igss" value="${e.noIGSS||''}" placeholder="Afiliaci\u00F3n IGSS"></div>
      <div class="form-group"><label>Banco</label><select id="em_banco_sel"><option value="" ${!(e.bancoCuenta)?'selected':''}>Seleccionar...</option><option value="Banco Industrial" ${(e.bancoCuenta||'')==="Banco Industrial"?"selected":""}>Banco Industrial</option><option value="Banrural" ${(e.bancoCuenta||'')==="Banrural"?"selected":""}>Banrural</option><option value="BAM" ${(e.bancoCuenta||'')==="BAM"?"selected":""}>BAM</option><option value="G&T Continental" ${(e.bancoCuenta||'')==="G&T Continental"?"selected":""}>G&T Continental</option><option value="Bantrab" ${(e.bancoCuenta||'')==="Bantrab"?"selected":""}>Bantrab</option><option value="BI" ${(e.bancoCuenta||'')==="BI"?"selected":""}>BI</option><option value="Otro" ${(e.bancoCuenta||'')==="Otro"?"selected":""}>Otro</option></select></div></div><div class="form-row form-row-3"><div class="form-group"><label>Tipo de cuenta</label><select id="em_tipo_cta"><option value="Monetaria" ${(e.tipoCuentaBanco||"Monetaria")==="Monetaria"?"selected":""}>Monetaria</option><option value="Ahorro" ${(e.tipoCuentaBanco||"")==="Ahorro"?"selected":""}>Ahorro</option><option value="Cheques" ${(e.tipoCuentaBanco||"")==="Cheques"?"selected":""}>Cheques</option></select></div><div class="form-group"><label>Numero de cuenta</label><input id="em_banco" value="${e.cuentaBanco||''}" placeholder="0000-0000-0000"></div><div class="form-group"><label>Nombre titular</label><input id="em_nom_banco" value="${e.nombreCuentaBanco||''}" placeholder="Como aparece en el banco"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Bonificaci\u00F3n adicional (Q/mes)</label><input id="em_bonus" type="number" value="${e.bonificacionAdicional||0}" min="0"></div>
      <div class="form-group"><label>Descuento adicional (Q/mes)</label><input id="em_desc" type="number" value="${e.descuentoAdicional||0}" min="0"></div>
    </div>
    <div id="prestaciones_preview" style="background:var(--bg3);border-radius:var(--radius);padding:12px 14px;margin-top:4px;font-size:12px"></div>
    
  `,async()=>{
    const nombre=document.getElementById('em_nom').value.trim();
    const salario=parseFloat(document.getElementById('em_sal').value)||0;
    if(!nombre||!salario){toast('Nombre y salario requeridos','red');return;}
    const obj={
      nombre,dpi:document.getElementById('em_dpi').value,
      cargo:document.getElementById('em_cargo').value,
      salarioBase:salario,
      tipoContrato:document.getElementById('em_tipo').value,
      fechaIngreso:document.getElementById('em_finicio').value,
      telefono:document.getElementById('em_tel').value,
      email:document.getElementById('em_email').value,
      noIGSS:document.getElementById('em_igss').value,
      cuentaBanco:document.getElementById('em_banco').value.trim(),bancoCuenta:(document.getElementById('em_banco_sel')||{}).value||'',tipoCuentaBanco:(document.getElementById('em_tipo_cta')||{}).value||'Monetaria',nombreCuentaBanco:(document.getElementById('em_nom_banco')||{}).value.trim(),
      bonificacionAdicional:parseFloat(document.getElementById('em_bonus').value)||0,
      descuentoAdicional:parseFloat(document.getElementById('em_desc').value)||0,
      licenciaNumero:(document.getElementById('em_lic_num')||{value:''}).value.trim(),
      licenciaTipo:(document.getElementById('em_lic_tipo')||{value:''}).value,
      licenciaVence:(document.getElementById('em_lic_venc')||{value:''}).value,
      emergenciaNombre:(document.getElementById('em_emerg_nom')||{value:''}).value.trim(),
      emergenciaTel:(document.getElementById('em_emerg_tel')||{value:''}).value.trim(),
      emergenciaParentesco:(document.getElementById('em_emerg_par')||{value:''}).value.trim(),
      activo:true,updatedAt:nowTs()
    };
    if(id){obj.id=id;await dbPut('empleados',obj);}else{obj.createdAt=nowTs();await dbAdd('empleados',obj);}
    await logAuditoria(id?'EDITAR':'CREAR','empleados',(id?'Empleado editado':'Empleado registrado')+': '+nombre,{cargo:obj.cargo});
    closeModal('modalEmpleado');toast(id?'Empleado actualizado':'Empleado registrado');
    await navTo('empleados');
  },true);
  setTimeout(calcPrestacionesPreview,100);
}

function calcPrestacionesPreview(){
  const sal=parseFloat(document.getElementById('em_sal')?.value)||0;
  if(!sal)return;
  const bonusExtra=parseFloat(document.getElementById('em_bonus')?.value)||0;
  const descExtra=parseFloat(document.getElementById('em_desc')?.value)||0;
  const empSimulado = {salarioBase:sal, bonificacionAdicional:bonusExtra, descuentoAdicional:descExtra};
  const det = calcDetalleEmpleado(empSimulado);
  const igssEmp=sal*0.0483;
  const igssPatrono=sal*0.1267;
  const irtra=sal*0.01;
  const intecap=sal*0.01;
  const bonif=250;
  const bonus=parseFloat(document.getElementById('em_bonus')?.value)||0;
  const desc=parseFloat(document.getElementById('em_desc')?.value)||0;
  const bruto=sal+bonif+bonus;
  const netoPagar=bruto-igssEmp-desc;
  const costoPatrono=sal+igssPatrono+irtra+intecap+bonif+bonus;
  const aguinaldo=sal/12;
  const bono14=sal/12;
  const vacaciones=(sal*15/260);
  const indemnizacion=sal/12;
  const el=document.getElementById('prestaciones_preview');
  if(!el) return;
  const fmtQ2 = n => 'Q ' + Number(n||0).toFixed(2);
  el.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">'
    + '<div style="grid-column:1/-1;font-weight:600;font-size:11px;color:var(--text3);text-transform:uppercase;margin-bottom:2px">Liquidación mensual al empleado</div>'
    + '<div style="font-size:11px;color:var(--text2)">Salario base:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono)">' + fmtQ2(det.base) + '</div>'
    + '<div style="font-size:11px;color:var(--text2)">Bonif. Decreto 78-89:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono)">' + fmtQ2(det.bonifDecr) + '</div>'
    + (det.bonifAd>0?'<div style="font-size:11px;color:var(--text2)">Bonif. adicional:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono)">'+fmtQ2(det.bonifAd)+'</div>':'')
    + '<div style="font-size:11px;color:var(--red)">(-) IGSS empleado 4.83%:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono);color:var(--red)">-' + fmtQ2(det.igssEmp) + '</div>'
    + (det.isrEmp>0?'<div style="font-size:11px;color:var(--red)">(-) ISR estimado:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono);color:var(--red)">-'+fmtQ2(det.isrEmp)+'</div>':'')
    + '<div style="font-size:12px;font-weight:700;color:var(--green);border-top:1px solid var(--border);padding-top:4px;margin-top:2px">Neto a pagar:</div>'
    + '<div style="font-size:12px;font-weight:700;text-align:right;font-family:var(--font-mono);color:var(--green);border-top:1px solid var(--border);padding-top:4px;margin-top:2px">' + fmtQ2(det.neto) + '</div>'
    + '<div style="grid-column:1/-1;font-weight:600;font-size:11px;color:var(--text3);text-transform:uppercase;margin-top:8px;margin-bottom:2px">Carga patronal y provisiones</div>'
    + '<div style="font-size:11px;color:var(--text2)">IGSS patronal 12.67%:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono)">' + fmtQ2(det.igssPatrono) + '</div>'
    + '<div style="font-size:11px;color:var(--text2)">IRTRA 1%:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono)">' + fmtQ2(det.irtra) + '</div>'
    + '<div style="font-size:11px;color:var(--text2)">INTECAP 1%:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono)">' + fmtQ2(det.intecap) + '</div>'
    + '<div style="font-size:11px;color:var(--accent)">Prov. Bono 14 (1/12):</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono);color:var(--accent)">' + fmtQ2(det.provBono14) + '</div>'
    + '<div style="font-size:11px;color:var(--accent)">Prov. Aguinaldo (1/12):</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono);color:var(--accent)">' + fmtQ2(det.provAguinal) + '</div>'
    + '<div style="font-size:11px;color:var(--accent)">Prov. Indemnización (1/12):</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono);color:var(--accent)">' + fmtQ2(det.provIndem) + '</div>'
    + '<div style="font-size:11px;color:var(--accent)">Prov. Vacaciones:</div><div style="font-size:11px;text-align:right;font-family:var(--font-mono);color:var(--accent)">' + fmtQ2(det.provVac) + '</div>'
    + '<div style="font-size:13px;font-weight:700;color:var(--text);border-top:1px solid var(--border);padding-top:4px;margin-top:2px">COSTO TOTAL/mes:</div>'
    + '<div style="font-size:13px;font-weight:700;text-align:right;font-family:var(--font-mono);color:var(--text);border-top:1px solid var(--border);padding-top:4px;margin-top:2px">' + fmtQ2(det.costoTotal) + '</div>'
    + '</div>';
  return;
  // código legacy abajo (no se ejecuta):
  if(el)el.innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-weight:600;color:var(--text2);margin-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:.5px">Salario del empleado</div>
        <div style="display:flex;justify-content:space-between;padding:3px 0"><span>Salario base:</span><span class="td-mono text-green">Q ${fmtNum(sal)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:3px 0"><span>Bonificaci\u00F3n decreto 78-89:</span><span class="td-mono text-green">+Q ${fmtNum(bonif)}</span></div>
        ${bonus>0?`<div style="display:flex;justify-content:space-between;padding:3px 0"><span>Bonif. adicional:</span><span class="td-mono text-green">+Q ${fmtNum(bonus)}</span></div>`:''}
        <div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--red)"><span>IGSS empleado (4.83%):</span><span class="td-mono">-Q ${fmtNum(igssEmp)}</span></div>
        ${desc>0?`<div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--red)"><span>Descuento adicional:</span><span class="td-mono">-Q ${fmtNum(desc)}</span></div>`:''}
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-top:1px solid var(--border);margin-top:4px;font-weight:700"><span>Neto a pagar:</span><span class="td-mono text-green">Q ${fmtNum(netoPagar)}</span></div>
      </div>
      <div>
        <div style="font-weight:600;color:var(--text2);margin-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:.5px">Costo patronal + prestaciones</div>
        <div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--red)"><span>IGSS patronal (12.67%):</span><span class="td-mono">Q ${fmtNum(igssPatrono)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--red)"><span>Irtra (1%):</span><span class="td-mono">Q ${fmtNum(irtra)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:3px 0;color:var(--red)"><span>Intecap (1%):</span><span class="td-mono">Q ${fmtNum(intecap)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-top:1px solid var(--border);margin-top:4px;font-weight:700;color:var(--accent)"><span>Costo total mensual:</span><span class="td-mono">Q ${fmtNum(costoPatrono)}</span></div>
        <div style="font-size:11px;color:var(--text3);margin-top:8px">Provisiones anuales por empleado:<br>Aguinaldo: Q ${fmtNum(aguinaldo)}/mes | Bono 14: Q ${fmtNum(bono14)}/mes<br>Vacaciones: Q ${fmtNum(vacaciones)}/mes | Indemnizaci\u00F3n: Q ${fmtNum(indemnizacion)}/mes</div>
      </div>
    </div>`;
}

async function verPrestaciones(id){
  const e=await dbGet('empleados',id);
  if(!e)return;
  const hoy=new Date();
  const inicio=new Date(e.fechaIngreso+'T00:00:00');
  const meses=Math.floor((hoy-inicio)/(30.4*864e5));
  const anios=Math.floor(meses/12);
  const sal=e.salarioBase||0;
  const liq=(sal/12*meses);
  openModal('prestEmp',`Prestaciones \u2014 ${e.nombre}`,`
    <div style="display:grid;gap:10px">
      <div class="alert alert-blue" style="font-size:12px">Antig\u00FCedad: <strong>${anios} a\u00F1os ${meses%12} meses</strong> (ingreso: ${fechaLegible(e.fechaIngreso)})</div>
      <div class="card" style="margin-bottom:0">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">
          ${[
            ['Salario base',fmt(sal)],
            ['Bonif. Decreto 78-89',fmt(250)],
            ['IGSS empleado (4.83%)',`-${fmt(sal*0.0483)}`],
            ['Neto mensual',fmt(sal+250-sal*0.0483)],
            ['IGSS patronal (12.67%)',fmt(sal*0.1267)],
            ['Irtra (1%)',fmt(sal*0.01)],
            ['Intecap (1%)',fmt(sal*0.01)],
            ['Aguinaldo (1 salario/a\u00F1o)',fmt(sal*Math.min(anios+1,1))],
            ['Bono 14 (1 salario/a\u00F1o)',fmt(sal*Math.min(anios+1,1))],
            [`Vacaciones acumuladas (${meses} meses)`,fmt(sal/12*meses*15/30)],
            ['Indemnizaci\u00F3n acumulada',fmt(liq)],
            ['Liquidaci\u00F3n total estimada',fmt(liq+sal*0.1267*meses+sal+sal)],
          ].map(([k,v])=>`<div style="color:var(--text2)">${k}:</div><div class="td-mono" style="font-weight:600">${v}</div>`).join('')}
        </div>
      </div>
    </div>
  `,()=>closeModal('prestEmp'));
}

async function toggleEmpleado(id,activo){
  const e=await dbGet('empleados',id);e.activo=!activo;
  await dbPut('empleados',e);toast(`Empleado ${e.activo?'activado':'desactivado'}`);
  await navTo('empleados');
}

/* ---- N\u00D3MINA ---- */
async function renderNomina(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Acceso solo para administradores</div>';return;}
  const empleados=await dbGetAll('empleados');
  const nomina=await dbGetAll('nomina');
  const mesActual=today().slice(0,7);
  const nominaMes=nomina.filter(n=>n.mes===mesActual);
  actions.innerHTML=`<button class="btn btn-primary" onclick="generarNominaMes()">\u26A1 Generar n\u00F3mina del mes</button>`;

  content.innerHTML=`
  <div class="section-title">N\u00F3mina Mensual</div>
  <div class="section-sub">Mes: ${mesActual}</div>

  ${nominaMes.length===0?`<div class="alert alert-amber">\u26A0 No se ha generado la n\u00F3mina para este mes. Haz clic en "Generar n\u00F3mina del mes".</div>`:''}

  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>Empleado</th><th>Cargo</th><th>Salario base</th><th>Bonif.</th><th>Bonif. desempe\u00F1o</th><th>IGSS</th><th>Descuentos</th><th>Neto a pagar</th><th>Estado</th></tr></thead>
      <tbody>
        ${nominaMes.map(n=>`<tr>
          <td><strong>${n.empleadoNombre}</strong></td>
          <td>${n.cargo||'\u2014'}</td>
          <td class="td-mono">${fmt(n.salarioBase)}</td>
          <td class="td-mono text-green">+${fmt(n.bonificacion)}</td>
          <td class="td-mono text-green">+${fmt(n.bonifDesempeno||0)}</td>
          <td class="td-mono text-red">-${fmt(n.igss)}</td>
          <td class="td-mono text-red">-${fmt(n.descuentos||0)}</td>
          <td class="td-mono" style="font-weight:700;color:var(--green)">${fmt(n.netoPagar)}</td>
          <td><span class="badge badge-${n.pagada?'green':'amber'}">${n.pagada?'Pagada':'Pendiente'}</span></td>
        </tr>`).join('')||`<tr><td colspan="9" class="text-center text-muted" style="padding:20px">Sin registros de n\u00F3mina este mes</td></tr>`}
      </tbody>
      ${nominaMes.length>0?`<tfoot><tr style="background:var(--bg3)">
        <td colspan="2" style="font-weight:600">TOTALES</td>
        <td class="td-mono">${fmt(nominaMes.reduce((a,n)=>a+n.salarioBase,0))}</td>
        <td class="td-mono">${fmt(nominaMes.reduce((a,n)=>a+n.bonificacion,0))}</td>
        <td class="td-mono">${fmt(nominaMes.reduce((a,n)=>a+(n.bonifDesempeno||0),0))}</td>
        <td class="td-mono">${fmt(nominaMes.reduce((a,n)=>a+n.igss,0))}</td>
        <td class="td-mono">${fmt(nominaMes.reduce((a,n)=>a+(n.descuentos||0),0))}</td>
        <td class="td-mono" style="font-weight:700;color:var(--green)">${fmt(nominaMes.reduce((a,n)=>a+n.netoPagar,0))}</td>
        <td></td>
      </tr></tfoot>`:''}
    </table></div>
  </div>`;
}

async function generarNominaMes(){
  if(!soloAdmin())return;
  if(!confirm('\u00BFGenerar n\u00F3mina para el mes actual? Esto reemplazar\u00E1 la n\u00F3mina existente de este mes.'))return;
  const empleados=await dbGetAll('empleados');
  const mesActual=today().slice(0,7);
  const nomina=await dbGetAll('nomina');
  const kpiData=await dbGetAll('kpi');
  for(const n of nomina.filter(x=>x.mes===mesActual))await dbDelete('nomina',n.id);
  for(const e of empleados.filter(x=>x.activo!==false)){
    const sal=e.salarioBase||0;
    const bonif=250+(e.bonificacionAdicional||0);
    const igss=sal*0.0483;
    const desc=e.descuentoAdicional||0;
    const kpiMes=kpiData.filter(k=>k.empleadoId===e.id&&k.mes===mesActual);
    const bonifDesempeno=kpiMes.reduce((a,k)=>a+(k.bonificacion||0),0);
    const bruto=sal+bonif+bonifDesempeno;
    const neto=bruto-igss-desc;
    await dbAdd('nomina',{
      mes:mesActual,empleadoId:e.id,empleadoNombre:e.nombre,cargo:e.cargo,
      salarioBase:sal,bonificacion:bonif,bonifDesempeno,igss,descuentos:desc,netoPagar:neto,
      pagada:false,createdAt:nowTs()
    });
  }
  toast('N\u00F3mina generada correctamente');
  await navTo('nomina');
}

/* ---- PROVEEDORES ---- */
async function registrarPlanillaMensual() {
  var empleados = await dbGetAll('empleados');
  var activos = empleados.filter(function(e){ return e.activo !== false; });
  if (!activos.length) { toast('No hay empleados activos','amber'); return; }
  var mes = today().slice(0,7);
  var costos = await dbGetAll('costos');
  var yaRegistrado = costos.some(function(c){ return c.categoria==='Planilla' && (c.fecha||'').startsWith(mes); });
  if (yaRegistrado && !confirm('Ya existe planilla para este mes. ¿Registrar de nuevo?')) return;
  var totalSueldos = 0, totalIGSS = 0;
  for (var i=0; i<activos.length; i++) {
    var e = activos[i];
    var sal = e.salarioBase || 0;
    var bonifDecr = 250;
    var descIGSS = sal * 0.0483;
    var neto = sal + bonifDecr + (e.bonificacionAdicional||0) - descIGSS - (e.descuentoAdicional||0);
    totalSueldos += neto;
    totalIGSS += sal * 0.1267;
  }
  var totalProvision = 0, totalIRTRA = 0, totalINTECAP = 0;
  for (var j=0; j<activos.length; j++) {
    var det = calcDetalleEmpleado(activos[j]);
    totalProvision += det.provBono14 + det.provAguinal + det.provIndem + det.provVac;
    totalIRTRA    += det.irtra;
    totalINTECAP  += det.intecap;
  }
  await dbAdd('costos',{fecha:today(),tipo:'Planilla mensual',
    descripcion:'Sueldos netos — '+activos.length+' empleados — '+mes,
    monto:parseFloat(totalSueldos.toFixed(2)),
    categoria:'Planilla', pagado:true, createdAt:nowTs(), updatedAt:nowTs()});
  await dbAdd('costos',{fecha:today(),tipo:'IGSS patronal',
    descripcion:'Cuota patronal IGSS 12.67% — '+mes,
    monto:parseFloat(totalIGSS.toFixed(2)),
    categoria:'Planilla', pagado:false, createdAt:nowTs(), updatedAt:nowTs()});
  await dbAdd('costos',{fecha:today(),tipo:'IRTRA + INTECAP',
    descripcion:'IRTRA 1% + INTECAP 1% — '+mes,
    monto:parseFloat((totalIRTRA+totalINTECAP).toFixed(2)),
    categoria:'Planilla', pagado:false, createdAt:nowTs(), updatedAt:nowTs()});
  await dbAdd('costos',{fecha:today(),tipo:'Provisiones laborales',
    descripcion:'Prov. Bono14 + Aguinaldo + Indem + Vac — '+mes,
    monto:parseFloat(totalProvision.toFixed(2)),
    categoria:'Provisiones', pagado:false, createdAt:nowTs(), updatedAt:nowTs()});
  var costoTotal = totalSueldos + totalIGSS + totalIRTRA + totalINTECAP + totalProvision;
  await logAuditoria('PLANILLA','costos','Planilla completa Q'+costoTotal.toFixed(2),{mes:mes});
  toast('Planilla registrada. Costo total empresa: Q ' + costoTotal.toFixed(2));
  await navTo('costos');
}

async function calcProvisionesMensuales(sal){sal=sal||0;return{bono14:sal/12,aguinaldo:sal/12,vacaciones:(sal/30)*15/12,indemnizacion:sal/12,igssPatronal:sal*0.1267,irtra:sal*0.01,intecap:sal*0.01};}
function provisionTotal(sal){var p=calcProvisionesMensuales(sal);return p.bono14+p.aguinaldo+p.vacaciones+p.indemnizacion+p.igssPatronal+p.irtra+p.intecap;}

async function calcLiquidacion(empleado, fechaSalida, tipoSalida, salarioPendiente, vacacionesTomadas, fechaUltB14, fechaUltAgui) {
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


function modalSrvExterno(id) {
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
