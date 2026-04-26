/* ============================================================
   TallerPro GT — 08_empleados.js
   Módulo independiente — no modificar estructura de archivos
============================================================ */

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


var SAL_MIN_2026 = {
  vigencia: '01 enero 2026', acuerdo: 'AG 256-2025', bonificacion: 250,
  CE1: {
    noAgricola: { diario: 131.58, base: 4002.28, total: 4252.28, label: 'CE1 No Agricola (Talleres/Mecanica/Servicios) — Dto. Guatemala' },
    agricola:   { diario: 124.64, base: 3791.20, total: 4041.20, label: 'CE1 Agricola — Dto. Guatemala' },
    maquila:    { diario: 112.10, base: 3409.73, total: 3659.73, label: 'CE1 Exportadora/Maquila — Dto. Guatemala' }
  },
  CE2: {
    noAgricola: { diario: 125.49, base: 3816.90, total: 4066.90, label: 'CE2 No Agricola (Talleres/Mecanica/Servicios) — Resto pais' },
    agricola:   { diario: 119.21, base: 3625.89, total: 3875.89, label: 'CE2 Agricola — Resto pais' },
    maquila:    { diario: 105.90, base: 3321.10, total: 3571.10, label: 'CE2 Exportadora/Maquila — Resto pais' }
  }
};
function aplicarSalMin(sel, inp) {
  if (!sel||!inp||!sel.value) return;
  var p=sel.value.split('_'); var ce=p[0],tipo=p[1];
  if (SAL_MIN_2026[ce]&&SAL_MIN_2026[ce][tipo]) {
    var s=SAL_MIN_2026[ce][tipo];
    inp.value=s.base.toFixed(2); inp.style.borderColor='var(--green)';
    inp.title=s.label+' | Base: Q'+s.base.toFixed(2)+' + Q250 bonif = Q'+s.total.toFixed(2);
    inp.dispatchEvent(new Event('change'));
  }
}

async function modalEmpleado(id=null){
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
async function renderProveedores(content,actions){
  const proveedores=await dbGetAll('proveedores');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalProveedor()">+ Nuevo proveedor</button>`;
  content.innerHTML=`
  <div class="section-title">Base de Datos de Proveedores</div>
  <div class="section-sub">${proveedores.length} proveedores registrados</div>
  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>Empresa</th><th>NIT</th><th>Contacto</th><th>Tel\u00E9fono</th><th>Categor\u00EDa</th><th>Plazo cr\u00E9dito</th><th>Calificaci\u00F3n</th><th>Acciones</th></tr></thead>
      <tbody>
        ${proveedores.map(p=>`<tr>
          <td><strong>${p.empresa}</strong><div style="font-size:11px;color:var(--text3)">${p.sitioWeb||''}</div></td>
          <td class="td-mono">${p.nit||'\u2014'}</td>
          <td>${p.contacto||'\u2014'}</td>
          <td>${p.telefono||'\u2014'}</td>
          <td><span class="badge badge-gray">${p.categoria||'General'}</span></td>
          <td class="td-mono">${p.plazoCredito||0} d\u00EDas</td>
          <td>${'\u2B50'.repeat(Math.min(parseInt(p.calificacion)||0,5))}</td>
          <td><div class="flex gap-1">
            <button class="btn btn-sm btn-secondary" onclick="modalProveedor(${p.id})">\u270F</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarProveedor(${p.id})">\u2715</button>
          </div></td>
        </tr>`).join('')||'<tr><td colspan="8" class="text-center text-muted" style="padding:20px">Sin proveedores</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}

async function modalProveedor(id=null){
  const p=id?await dbGet('proveedores',id):{};
  openModal('modalProveedor',id?'Editar Proveedor':'Nuevo Proveedor',`
    <div class="form-row form-row-2">
      <div class="form-group"><label>Nombre de la empresa *</label><input id="pv_emp" value="${p.empresa||''}" placeholder="Distribuidora XYZ S.A."></div>
      <div class="form-group"><label>NIT</label><input id="pv_nit" value="${p.nit||''}" placeholder="NIT de la empresa"></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Categor\u00EDa</label>
        <select id="pv_cat"><option value="Repuestos">Repuestos automotrices</option><option value="Aceites y Lubricantes">Aceites y lubricantes</option><option value="Llantas">Llantas y neum\u00E1ticos</option><option value="Herramientas">Herramientas y equipos</option><option value="El\u00E9ctrico">Material el\u00E9ctrico</option><option value="General">General</option></select>
      </div>
      <div class="form-group"><label>Contacto principal</label><input id="pv_contacto" value="${p.contacto||''}" placeholder="Nombre del vendedor"></div>
      <div class="form-group"><label>Tel\u00E9fono</label><input id="pv_tel" value="${p.telefono||''}" placeholder="+502 2222-3333" onblur="onTelBlur(this)"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Email</label><input id="pv_email" type="email" value="${p.email||''}" placeholder="ventas@proveedor.com"></div>
      <div class="form-group"><label>Sitio web</label><input id="pv_web" value="${p.sitioWeb||''}" placeholder="www.proveedor.com"></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Direcci\u00F3n</label><input id="pv_dir" value="${p.direccion||''}" placeholder="Direcci\u00F3n f\u00EDsica"></div>
      <div class="form-group"><label>Plazo de cr\u00E9dito (d\u00EDas)</label><input id="pv_plazo" type="number" value="${p.plazoCredito||0}" min="0"></div>
      <div class="form-group"><label>Calificaci\u00F3n (1-5)</label>
        <select id="pv_cal"><option value="0">Sin calificar</option><option value="1" ${p.calificacion==='1'?'selected':''}>\u2B50 1</option><option value="2" ${p.calificacion==='2'?'selected':''}>\u2B50\u2B50 2</option><option value="3" ${p.calificacion==='3'?'selected':''}>\u2B50\u2B50\u2B50 3</option><option value="4" ${p.calificacion==='4'?'selected':''}>\u2B50\u2B50\u2B50\u2B50 4</option><option value="5" ${p.calificacion==='5'?'selected':''}>\u2B50\u2B50\u2B50\u2B50\u2B50 5</option></select>
      </div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Cuenta bancaria / Beneficiario</label><input id="pv_banco" value="${p.cuentaBanco||''}" placeholder="Para pagos"></div>
      <div class="form-group"><label>Condiciones de pago</label><input id="pv_condiciones" value="${p.condiciones||''}" placeholder="Contado, 30 d\u00EDas, etc."></div>
    </div>
    <div class="form-group"><label>Notas / Productos principales</label><textarea id="pv_notas">${p.notas||''}</textarea></div>
  `,async()=>{
    const emp=document.getElementById('pv_emp').value.trim();
    if(!emp){toast('Nombre requerido','red');return;}
    const obj={
      empresa:emp,nit:document.getElementById('pv_nit').value,
      categoria:document.getElementById('pv_cat').value,
      contacto:document.getElementById('pv_contacto').value,
      telefono:document.getElementById('pv_tel').value,
      email:document.getElementById('pv_email').value,
      sitioWeb:document.getElementById('pv_web').value,
      direccion:document.getElementById('pv_dir').value,
      plazoCredito:parseInt(document.getElementById('pv_plazo').value)||0,
      calificacion:document.getElementById('pv_cal').value,
      bancoNombre:(document.getElementById('pv_banco_sel')||{value:''}).value,
      bancoCuentaTipo:(document.getElementById('pv_tipo_cta')||{value:'Monetaria'}).value,
      bancoNumeroCuenta:(document.getElementById('pv_num_cta')||{value:''}).value,
      bancoNombreTitular:(document.getElementById('pv_nom_cta')||{value:''}).value,
      formasPago:Array.from(document.querySelectorAll('.pv_fpago:checked')).map(function(c){return c.value;}),
      condiciones:document.getElementById('pv_condiciones').value,
      notas:document.getElementById('pv_notas').value,
      updatedAt:nowTs()
    };
    if(id){obj.id=id;await dbPut('proveedores',obj);}else{obj.createdAt=nowTs();await dbAdd('proveedores',obj);}
    await logAuditoria(id?'EDITAR':'CREAR','proveedores',(id?'Proveedor editado':'Proveedor creado')+': '+emp,{nit:obj.nit});
    closeModal('modalProveedor');toast(id?'Proveedor actualizado':'Proveedor registrado');
    await navTo('proveedores');
  },true);
}

async function eliminarProveedor(id){
  if(!soloAdmin()){toast('Solo admin puede eliminar','red');return;}
  if(!confirm('\u00BFEliminar proveedor?'))return;
  await dbDelete('proveedores',id);await navTo('proveedores');
}

/* ---- REPUESTOS MEJORADO ---- */
async function renderRepuestos(content,actions){
  const repuestos=await dbGetAll('repuestos');
  const proveedores=await dbGetAll('proveedores');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalRepuesto()">+ Nuevo repuesto</button>`;
  const stockBajo=repuestos.filter(r=>(r.stock||0)<=(r.stockMin||5));
  const sinMargen=repuestos.filter(r=>r.costo>0&&r.precio>0&&((r.precio-r.costo)/r.precio)<MARGEN_MIN);

  content.innerHTML=`
  <div class="section-title">Inventario de Repuestos</div>
  ${stockBajo.length?`<div class="alert alert-red">\u26A0 ${stockBajo.length} repuesto(s) con stock bajo</div>`:''}
  ${sinMargen.length?`<div class="alert alert-amber">\u26A0 ${sinMargen.length} repuesto(s) con margen menor a 20%</div>`:''}
  <div class="card" style="padding:10px">
    <div class="search-bar" style="margin-bottom:10px;position:relative">
      <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3)">\u1F50D</span>
      <input id="buscar_rep" type="text" placeholder="Buscar por nombre, c\u00F3digo, categor\u00EDa..." oninput="filtrarTabla('buscar_rep','tbody_rep')" style="padding-left:32px;background:var(--bg3);width:100%;border:1px solid var(--border2);border-radius:6px;padding:8px 10px 8px 32px;color:var(--text);outline:none">
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>C\u00F3digo</th><th>Nombre</th><th>Categor\u00EDa</th><th>Tipo veh\u00EDculo</th><th>Stock</th><th>Compra</th><th>Venta</th><th>Margen</th><th>Vence</th><th>Proveedor</th><th>Acciones</th></tr></thead>
      <tbody id="tbody_rep">
        ${repuestos.map(r=>{
          const margen=r.costo>0&&r.precio>0?((r.precio-r.costo)/r.precio):0;
          const bajoMargen=margen<MARGEN_MIN&&r.costo>0;
          const stockBajo=(r.stock||0)<=(r.stockMin||5);
          const vencido=r.fechaCaducidad&&diasRestantes(r.fechaCaducidad)<30;
          const prov=proveedores.find(p=>p.id===r.proveedorId);
          return`<tr>
            <td class="td-mono" style="font-size:11px">${r.codigo||'\u2014'}</td>
            <td><strong>${r.nombre}</strong></td>
            <td><span class="badge badge-gray">${r.categoria||'General'}</span></td>
            <td style="font-size:11px;color:var(--text2)">${(r.tiposVehiculo||[]).join(', ')||'Todos'}</td>
            <td><span class="${stockBajo?'text-red':'text-green'} td-mono">${r.stock||0}</span><span style="color:var(--text3);font-size:11px"> /${r.stockMin||5}</span></td>
            <td class="td-mono">Q ${fmtNum(r.costo||0)}</td>
            <td class="td-mono ${bajoMargen?'text-red':''}" style="font-weight:${bajoMargen?'700':'400'}">Q ${fmtNum(r.precio||0)}</td>
            <td><span class="badge badge-${bajoMargen?'red':margen>=0.4?'green':'amber'}">${(margen*100).toFixed(1)}%</span></td>
            <td class="${vencido?'text-red':''}" style="font-size:11px">${r.fechaCaducidad?fechaLegible(r.fechaCaducidad):'\u2014'}</td>
            <td style="font-size:11px;color:var(--text2)">${prov?.empresa||r.proveedor||'\u2014'}</td>
            <td><div class="flex gap-1">
              <button class="btn btn-sm btn-secondary" onclick="modalRepuesto(${r.id})">\u270F</button>
              ${soloAdmin()?`<button class="btn btn-sm btn-danger" onclick="eliminarRepuesto(${r.id})">\u2715</button>`:''}
            </div></td>
          </tr>`;
        }).join('')||'<tr><td colspan="11" class="text-center text-muted" style="padding:20px">Sin repuestos</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}

function filtrarTabla(inputId,tbodyId){
  const q=document.getElementById(inputId)?.value?.toLowerCase()||'';
  document.querySelectorAll(`#${tbodyId} tr`).forEach(tr=>{tr.style.display=tr.textContent.toLowerCase().includes(q)?'':'none';});
}


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

async function modalRepuesto(id=null){
  const r=id?await dbGet('repuestos',id):{};
  const proveedores=await dbGetAll('proveedores');
  const tiposVeh=r.tiposVehiculo||[];
  openModal('modalRepuesto',id?'Editar Repuesto':'Nuevo Repuesto',`
    <div class="form-row form-row-3">
      <div class="form-group"><label>C\u00F3digo</label><input id="rp_cod" value="${r.codigo||''}" placeholder="REP-001"></div>
      <div class="form-group"><label>Nombre *</label><input id="rp_nom" value="${r.nombre||''}" placeholder="Filtro de aceite Toyota"></div>
      <div class="form-group"><label>Categor\u00EDa</label>
        <select id="rp_cat">${CATEGORIAS_REPUESTO.map(c=>`<option value="${c}" ${r.categoria===c?'selected':''}>${c}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-group"><label>Tipos de veh\u00EDculo compatibles</label>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px">
        ${TIPOS_VEHICULO.map(t=>`<label style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text);cursor:pointer"><input type="checkbox" value="${t}" ${tiposVeh.includes(t)?'checked':''} class="rep_tipo_veh" style="width:auto"> ${t}</label>`).join('')}
      </div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>No. cilindros</label>
        <select id="rp_cil"><option value="">Cualquiera</option>${[3,4,5,6,8,10,12,16].map(c=>`<option value="${c}" ${r.cilindros==c?'selected':''}>${c} cil.</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Cilindraje (cc)</label><input id="rp_cc" value="${r.cilindraje||''}" placeholder="1600, 2000, 3000..."></div>
      <div class="form-group"><label>Marca del repuesto</label><input id="rp_marca" value="${r.marca||''}" placeholder="Toyota, Bosch, NGK..."></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Stock actual *</label><input id="rp_stock" type="number" value="${r.stock||0}" min="0"></div>
      <div class="form-group"><label>Stock m\u00EDnimo</label><input id="rp_min" type="number" value="${r.stockMin||5}" min="0"></div>
      <div class="form-group"><label>Unidad</label><input id="rp_uni" value="${r.unidad||'unidad'}" placeholder="unidad, litro..."></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Precio compra (Q)</label>
        <div style="position:relative"><span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3);font-family:var(--font-mono);font-size:11px">Q</span>
        <input id="rp_costo" type="number" value="${r.costo||0}" step="0.01" oninput="calcMargenRep()" style="padding-left:22px"></div>
      </div>
      <div class="form-group"><label>Precio venta (Q)</label>
        <div style="position:relative"><span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3);font-family:var(--font-mono);font-size:11px">Q</span>
        <input id="rp_precio" type="number" value="${r.precio||0}" step="0.01" oninput="calcMargenRep()" style="padding-left:22px"></div>
      </div>
      <div class="form-group"><label>Margen calculado</label><input id="rp_margen" readonly placeholder="0%" style="background:var(--bg4);color:var(--text3)"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Proveedor 
        <button type="button" onclick="crearProveedorRapido()" style="font-size:10px;padding:2px 8px;margin-left:6px;background:var(--bg3);border:1px solid var(--border2);border-radius:4px;cursor:pointer;color:var(--accent)">+ Nuevo</button>
      </label>
        <select id="rp_prov"><option value="">Sin proveedor</option>${proveedores.map(p=>`<option value="${p.id}" ${r.proveedorId===p.id?'selected':''}>${p.empresa}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>\u00BFTiene caducidad?</label>
        <select id="rp_tiene_cad" onchange="toggleCaducidad()"><option value="no" ${!r.fechaCaducidad?'selected':''}>No caduca</option><option value="si" ${r.fechaCaducidad?'selected':''}>S\u00ED, tiene fecha de caducidad</option></select>
      </div>
    </div>
    <div id="rp_cad_wrap" style="display:${r.fechaCaducidad?'block':'none'}">
      <div class="form-group"><label>Fecha de caducidad</label><input id="rp_cad" type="date" value="${r.fechaCaducidad||''}"></div>
    </div>
    <div class="form-group"><label>Descripci\u00F3n / Uso</label><textarea id="rp_desc" style="min-height:60px">${r.descripcion||''}</textarea></div>
    
  `,async()=>{
    const nombre=document.getElementById('rp_nom').value.trim();
    if(!nombre){toast('Nombre requerido','red');return;}
    const tiposSelec=Array.from(document.querySelectorAll('.rep_tipo_veh:checked')).map(cb=>cb.value);
    const costo=parseFloat(document.getElementById('rp_costo').value)||0;
    const precio=parseFloat(document.getElementById('rp_precio').value)||0;
    const margen=precio>0&&costo>0?(precio-costo)/precio:0;
    if(margen<MARGEN_MIN&&costo>0&&precio>0){
      if(!confirm(`\u26A0 Margen ${(margen*100).toFixed(1)}% est\u00E1 por debajo del 20% m\u00EDnimo. \u00BFGuardar de todas formas?`))return;
    }
    const tieneCad=document.getElementById('rp_tiene_cad').value==='si';
    const obj={
      codigo:document.getElementById('rp_cod').value,nombre,
      categoria:document.getElementById('rp_cat').value,
      tiposVehiculo:tiposSelec,
      cilindros:document.getElementById('rp_cil').value||null,
      cilindraje:document.getElementById('rp_cc').value,
      marca:document.getElementById('rp_marca').value,
      stock:parseInt(document.getElementById('rp_stock').value)||0,
      stockMin:parseInt(document.getElementById('rp_min').value)||5,
      unidad:document.getElementById('rp_uni').value,
      costo,precio,margen,
      proveedorId:parseInt(document.getElementById('rp_prov').value)||null,
      fechaCaducidad:tieneCad?document.getElementById('rp_cad').value:null,
      descripcion:document.getElementById('rp_desc').value,
      tipo:'repuesto',updatedAt:nowTs()
    };
    if(id){obj.id=id;await dbPut('repuestos',obj);}else{obj.createdAt=nowTs();await dbAdd('repuestos',obj);}
    await logAuditoria(id?'EDITAR':'CREAR','repuestos',(id?'Repuesto editado':'Repuesto creado')+': '+nombre,{stock:obj.stock});
    closeModal('modalRepuesto');toast(id?'Repuesto actualizado':'Repuesto registrado');
    await navTo('repuestos');
  },true);
  setTimeout(()=>{calcMargenRep();},100);
}

function toggleCaducidad(){
  const val=document.getElementById('rp_tiene_cad')?.value;
  const wrap=document.getElementById('rp_cad_wrap');
  if(wrap)wrap.style.display=val==='si'?'block':'none';
}
function calcMargenRep(){
  const c=parseFloat(document.getElementById('rp_costo')?.value)||0;
  const p=parseFloat(document.getElementById('rp_precio')?.value)||0;
  const el=document.getElementById('rp_margen');
  if(!el)return;
  if(p>0&&c>0){
    const m=((p-c)/p)*100;
    el.value=m.toFixed(1)+'%';
    el.style.color=m<20?'var(--red)':m<35?'var(--accent)':'var(--green)';
  }else{el.value='\u2014';}
}

async function eliminarRepuesto(id){
  if(!soloAdmin()){toast('Solo admin','red');return;}
  if(!confirm('\u00BFEliminar repuesto?'))return;
  await dbDelete('repuestos',id);await navTo('repuestos');
}

/* ---- INSUMOS MEJORADO ---- */
async function renderInsumos(content,actions){
  const insumos=await dbGetAll('insumos');
  const proveedores=await dbGetAll('proveedores');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalInsumo()">+ Nuevo insumo</button>`;
  content.innerHTML=`
  <div class="section-title">Inventario de Insumos</div>
  <div class="section-sub">Aceites, lubricantes, qu\u00EDmicos y consumibles</div>
  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>Nombre</th><th>Tipo</th><th>Tipo veh\u00EDculo</th><th>Stock</th><th>Compra</th><th>Venta</th><th>Margen</th><th>Caducidad</th><th>Acciones</th></tr></thead>
      <tbody>
        ${insumos.map(i=>{
          const margen=i.costo>0&&i.precio>0?((i.precio-i.costo)/i.precio):0;
          const bajoMargen=margen<MARGEN_MIN&&i.costo>0;
          const vencido=i.fechaCaducidad&&diasRestantes(i.fechaCaducidad)<30;
          return`<tr>
            <td><strong>${i.nombre}</strong></td>
            <td><span class="badge badge-blue">${i.categoria||'Insumo'}</span></td>
            <td style="font-size:11px;color:var(--text2)">${(i.tiposVehiculo||[]).join(', ')||'Todos'}</td>
            <td><span class="${(i.stock||0)<=(i.stockMin||5)?'text-red':'text-green'} td-mono">${i.stock||0}</span> ${i.unidad||''}</td>
            <td class="td-mono">Q ${fmtNum(i.costo||0)}</td>
            <td class="td-mono ${bajoMargen?'text-red':''}">Q ${fmtNum(i.precio||0)}</td>
            <td><span class="badge badge-${bajoMargen?'red':margen>=0.4?'green':'amber'}">${(margen*100).toFixed(1)}%</span></td>
            <td class="${vencido?'text-red':''}" style="font-size:11px">${i.fechaCaducidad?fechaLegible(i.fechaCaducidad):'No caduca'}</td>
            <td><div class="flex gap-1">
              <button class="btn btn-sm btn-secondary" onclick="modalInsumo(${i.id})">\u270F</button>
              ${soloAdmin()?`<button class="btn btn-sm btn-danger" onclick="eliminarInsumo(${i.id})">\u2715</button>`:''}
            </div></td>
          </tr>`;
        }).join('')||'<tr><td colspan="9" class="text-center text-muted" style="padding:20px">Sin insumos</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}


async function eliminarInsumo(id){if(!soloAdmin())return;if(!confirm('\u00BFEliminar?'))return;await dbDelete('insumos',id);await navTo('insumos');}

/* ---- CLIENTES MEJORADO (agrupaci\u00F3n multi-veh\u00EDculo) ---- */
async function renderClientes(content,actions){
  const clientes=await dbGetAll('clientes');
  const vehiculos=await dbGetAll('vehiculos');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalCliente()">+ Nuevo cliente</button>`;
  content.innerHTML=`
  <div class="section-title">Clientes</div>
  <div class="section-sub">${clientes.length} clientes registrados</div>
  <div class="card" style="padding:10px">
    <div style="margin-bottom:10px;position:relative">
      <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3)">\u1F50D</span>
      <input id="buscar_cli" type="text" placeholder="Buscar por nombre, NIT o tel\u00E9fono..." oninput="filtrarTabla('buscar_cli','tbody_cli')" style="padding-left:32px;background:var(--bg3);width:100%;border:1px solid var(--border2);border-radius:6px;padding:8px 10px 8px 32px;color:var(--text);outline:none">
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Nombre / Empresa</th><th>NIT</th><th>Tel\u00E9fono</th><th>Email</th><th>Veh\u00EDculos</th><th>Tipo</th><th>Acciones</th></tr></thead>
      <tbody id="tbody_cli">
        ${clientes.map(c=>{
          const vehs=vehiculos.filter(v=>v.clienteId===c.id);
          return`<tr>
            <td><strong>${c.nombre}</strong>${c.empresa?`<div style="font-size:11px;color:var(--text3)">${c.empresa}</div>`:''}</td>
            <td class="td-mono">${c.nit||'CF'}</td>
            <td>${c.telefono||'\u2014'}</td>
            <td style="color:var(--blue);font-size:12px">${c.email||'\u2014'}</td>
            <td>
              ${vehs.length===0?'<span class="text-muted">Sin veh\u00EDculos</span>':
                vehs.map(v=>`<span class="badge badge-gray" style="margin:1px">${v.placa}</span>`).join('')}
              <button class="btn btn-sm btn-secondary" style="margin-left:4px;padding:2px 8px;font-size:11px" onclick="modalVehiculo(null,${c.id})">+</button>
            </td>
            <td><span class="badge badge-${c.tipo==='empresa'?'blue':'gray'}">${c.tipo||'persona'}</span></td>
            <td><div class="flex gap-1">
              <button class="btn btn-sm btn-secondary" onclick="modalCliente(${c.id})">\u270F</button>
              <button class="btn btn-sm btn-secondary" onclick="verHistorialCliente(${c.id})">\u1F4CB</button>
              ${soloAdmin()?`<button class="btn btn-sm btn-danger" onclick="eliminarCliente(${c.id})">\u2715</button>`:''}
            </div></td>
          </tr>`;
        }).join('')||'<tr><td colspan="7" class="text-center text-muted" style="padding:20px">Sin clientes</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}

async function modalCliente(id=null){
  const c=id?await dbGet('clientes',id):{};
  openModal('modalCliente',id?'Editar Cliente':'Nuevo Cliente',`
    <div class="form-row form-row-2">
      <div class="form-group"><label>Nombre completo *</label><input id="c_nombre" value="${c.nombre||''}" placeholder="Juan P\u00E9rez Garc\u00EDa"></div>
      <div class="form-group"><label>NIT</label><input id="c_nit" value="${c.nit||''}" placeholder="CF o n\u00FAmero de NIT"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Empresa / Raz\u00F3n social</label><input id="c_empresa" value="${c.empresa||''}" placeholder="Nombre de la empresa (opcional)"></div>
      <div class="form-group"><label>Tipo</label>
        <select id="c_tipo"><option value="persona" ${c.tipo==='persona'?'selected':''}>Persona natural</option><option value="empresa" ${c.tipo==='empresa'?'selected':''}>Empresa</option></select>
      </div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Tel\u00E9fono principal *</label><input id="c_tel" value="${c.telefono||''}" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>
      <div class="form-group"><label>Tel\u00E9fono secundario</label><input id="c_tel2" value="${c.telefono2||''}" placeholder="+502 4444-0000" onblur="onTelBlur(this)"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Email</label><input id="c_email" type="email" value="${c.email||''}" placeholder="correo@ejemplo.com"></div>
      <div class="form-group"><label>WhatsApp</label><input id="c_wa" value="${c.whatsapp||''}" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>
    </div>
    <div class="form-group"><label>Direcci\u00F3n</label><input id="c_dir" value="${c.direccion||''}" placeholder="Direcci\u00F3n completa"></div>
    <div class="form-group"><label>Notas</label><textarea id="c_notas" style="min-height:60px">${c.notas||''}</textarea></div>
  `,async()=>{
    const nombre=document.getElementById('c_nombre').value.trim();
    if(!nombre){toast('Nombre requerido','red');return;}
    const obj={
      nombre,nit:document.getElementById('c_nit').value.trim(),
      empresa:document.getElementById('c_empresa').value.trim(),
      tipo:document.getElementById('c_tipo').value,
      telefono:document.getElementById('c_tel').value.trim(),
      telefono2:document.getElementById('c_tel2').value.trim(),
      email:document.getElementById('c_email').value.trim(),
      whatsapp:document.getElementById('c_wa').value.trim(),
      direccion:document.getElementById('c_dir').value.trim(),
      notas:document.getElementById('c_notas').value.trim(),
      updatedAt:nowTs()
    };
    if(id){obj.id=id;await dbPut('clientes',obj);}else{obj.createdAt=nowTs();await dbAdd('clientes',obj);}
    await logAuditoria(id?'EDITAR':'CREAR','clientes',(id?'Cliente editado':'Cliente creado')+': '+obj.nombre,{nit:obj.nit});
    closeModal('modalCliente');toast(id?'Cliente actualizado':'Cliente registrado');
    await navTo('clientes');
  },true);
}

async function verHistorialCliente(clienteId){
  const c=await dbGet('clientes',clienteId);
  const vehiculos=await dbGetAll('vehiculos');
  const ordenes=await dbGetAll('ordenes');
  const facturas=await dbGetAll('facturas');
  const vehs=vehiculos.filter(v=>v.clienteId===clienteId);
  const ords=ordenes.filter(o=>o.clienteId===clienteId);
  const facts=facturas.filter(f=>f.clienteId===clienteId);
  const totalFacturado=facts.reduce((a,f)=>a+(f.total||0),0);
  openModal('histCli',`Historial \u2014 ${c.nombre}`,`
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-label">Veh\u00EDculos</div><div class="stat-value">${vehs.length}</div></div>
      <div class="stat-card"><div class="stat-label">\u00D3rdenes</div><div class="stat-value">${ords.length}</div></div>
      <div class="stat-card stat-green"><div class="stat-label">Total facturado</div><div class="stat-value" style="font-size:16px">${fmt(totalFacturado)}</div></div>
    </div>
    <div style="margin-top:8px;font-weight:600;font-size:13px;margin-bottom:6px">Veh\u00EDculos registrados:</div>
    ${vehs.map(v=>`<div class="alert-item" style="margin-bottom:6px">
      <div><strong>${v.placa}</strong> \u2014 ${v.marca} ${v.modelo} ${v.anio||''} (${v.color||'\u2014'})</div>
      <div style="font-size:11px;color:var(--text2)">Km: ${v.km?.toLocaleString()||'\u2014'} | Pr\u00F3ximo servicio: ${fechaLegible(v.proximoServicio)}</div>
    </div>`).join('')||'<div class="text-muted">Sin veh\u00EDculos registrados</div>'}
    <div style="margin-top:12px;font-weight:600;font-size:13px;margin-bottom:6px">\u00DAltimas \u00F3rdenes:</div>
    ${ords.slice(-5).reverse().map(o=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px">
      <span>${o.noOT} \u2014 ${o.descripcion?.slice(0,40)||'OT'}</span>
      <span class="badge badge-${o.estado==='entregada'?'green':'amber'}">${o.estado}</span>
    </div>`).join('')||'<div class="text-muted">Sin \u00F3rdenes</div>'}
  `,()=>closeModal('histCli'),true);
}

async function eliminarCliente(id){
  if(!soloAdmin()){toast('Solo admin','red');return;}
  if(!confirm('\u00BFEliminar cliente y todos sus datos?'))return;
  await dbDelete('clientes',id);await navTo('clientes');
}

/* ---- VEH\u00CDCULOS MEJORADO ---- */
async function renderVehiculos(content,actions){
  const vehiculos=await dbGetAll('vehiculos');
  const clientes=await dbGetAll('clientes');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalVehiculo()">+ Nuevo veh\u00EDculo</button>`;
  content.innerHTML=`
  <div class="section-title">Veh\u00EDculos</div>
  <div class="section-sub">${vehiculos.length} veh\u00EDculos registrados</div>
  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>Placa</th><th>Veh\u00EDculo</th><th>Tipo</th><th>Motor</th><th>Km</th><th>Cliente</th><th>Pr\u00F3x. servicio</th><th>Fabricante info</th><th>Acciones</th></tr></thead>
      <tbody>
        ${vehiculos.map(v=>{
          const c=clientes.find(x=>x.id===v.clienteId);
          const dias=v.proximoServicio?diasRestantes(v.proximoServicio):null;
          const fab=FABRICANTES_DB[v.marca];
          const badge=dias!==null?(dias<0?'<span class="badge badge-red">Vencido</span>':dias<=7?`<span class="badge badge-red">${dias}d</span>`:dias<=15?`<span class="badge badge-amber">${dias}d</span>`:`<span class="badge badge-green">${dias}d</span>`):'<span class="text-muted">\u2014</span>';
          return`<tr>
            <td class="td-mono" style="font-weight:700">${v.placa||'\u2014'}</td>
            <td>${v.marca||''} ${v.modelo||''} ${v.anio?`(${v.anio})`:''}</td>
            <td><span class="badge badge-gray">${v.tipoVehiculo||'\u2014'}</span></td>
            <td style="font-size:11px;color:var(--text2)">${v.cilindros?v.cilindros+' cil.':''} ${v.cilindraje?v.cilindraje+'cc':''}</td>
            <td class="td-mono">${v.km?.toLocaleString()||'\u2014'}</td>
            <td>${c?.nombre||'\u2014'}</td>
            <td>${badge} <span style="font-size:10px;color:var(--text3)">${fechaLegible(v.proximoServicio)}</span></td>
            <td>${fab?`<button class="btn btn-sm btn-secondary" onclick="verRecomFabricante('${v.marca}','${v.modelo}')">\u1F4CB Recom.</button>`:'\u2014'}</td>
            <td><div class="flex gap-1">
              <button class="btn btn-sm btn-secondary" onclick="modalVehiculo(${v.id})">\u270F</button>
              <button class="btn btn-sm btn-green" onclick="nuevaOrdenVehiculo(${v.id})">+OT</button><button class="btn btn-sm btn-blue" onclick="sugerirMantenimiento(${v.id})">\u1F50D Km</button>
              ${soloAdmin()?`<button class="btn btn-sm btn-danger" onclick="eliminarVehiculo(${v.id})">\u2715</button>`:''}
            </div></td>
          </tr>`;
        }).join('')||'<tr><td colspan="9" class="text-center text-muted" style="padding:20px">Sin veh\u00EDculos</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}

function verRecomFabricante(marca,modelo){
  const fab=FABRICANTES_DB[marca]||FABRICANTES_DB['Otro'];
  openModal('recomFab',`Recomendaciones \u2014 ${marca} ${modelo}`,`
    <div class="alert alert-blue" style="font-size:12px">Datos basados en especificaciones del fabricante. Consultar manual para su modelo espec\u00EDfico.</div>
    <div class="form-row form-row-2" style="margin-top:12px">
      <div>
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--text2)">Intervalos de mantenimiento</div>
        ${Object.entries(fab.intervalos).filter(([,v])=>v).map(([k,v])=>`
          <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
            <span>${{aceite:'Cambio de aceite',filtroAire:'Filtro de aire',filtroCombustible:'Filtro de combustible',bujias:'Buj\u00EDas',correa:'Correa/cadena distribuci\u00F3n',frenos:'Revisi\u00F3n de frenos',refrigerante:'Refrigerante'}[k]||k}</span>
            <span class="td-mono text-amber">${v?.toLocaleString()} km</span>
          </div>`).join('')}
      </div>
      <div>
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--text2)">Especificaciones de fluidos</div>
        <div style="font-size:12px;padding:8px;background:var(--bg3);border-radius:6px;margin-bottom:8px">
          <div style="color:var(--text2);margin-bottom:4px">Aceite recomendado:</div>
          <div style="color:var(--green)">${fab.aceiteRecomendado}</div>
        </div>
        <div style="font-size:12px;padding:8px;background:var(--bg3);border-radius:6px;margin-bottom:8px">
          <div style="color:var(--text2);margin-bottom:4px">Filtro de aceite:</div>
          <div>${fab.filtroAceite}</div>
        </div>
        <div style="font-size:12px;padding:8px;background:var(--bg3);border-radius:6px">
          <div style="color:var(--text2);margin-bottom:4px">Observaciones:</div>
          <div style="color:var(--text2)">${fab.observaciones}</div>
        </div>
      </div>
    </div>
  `,()=>closeModal('recomFab'),true);
}

async function modalVehiculo(id=null,clientePresel=null){
  const clientes=await dbGetAll('clientes');
  const v=id?await dbGet('vehiculos',id):{};
  openModal('modalVehiculo',id?'Editar Veh\u00EDculo':'Nuevo Veh\u00EDculo',`
    <div class="form-row form-row-2">
      <div class="form-group"><label>Cliente * 
          <button type="button" onclick="crearClienteRapidoVeh()" style="font-size:10px;padding:2px 8px;margin-left:6px;background:var(--bg3);border:1px solid var(--border2);border-radius:4px;cursor:pointer;color:var(--accent)">+ Nuevo</button>
        </label>
        <select id="v_cliente"><option value="">Seleccionar cliente...</option>${clientes.map(c=>`<option value="${c.id}" ${(v.clienteId||clientePresel)===c.id?'selected':''}>${c.nombre}${c.empresa?' ('+c.empresa+')':''}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Placa *</label><input id="v_placa" value="${v.placa||''}" placeholder="P-123ABC"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Tipo de veh\u00EDculo</label>
        <select id="v_tipo">${TIPOS_VEHICULO.map(t=>`<option value="${t}" ${v.tipoVehiculo===t?'selected':''}>${t}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Marca</label>
        <select id="v_marca" onchange="cargarModelosMarca()">${Object.keys(FABRICANTES_DB).map(m=>`<option value="${m}" ${v.marca===m?'selected':''}>${m}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Modelo</label><input id="v_modelo" value="${v.modelo||''}" placeholder="Modelo del veh\u00EDculo"></div>
      <div class="form-group"><label>A\u00F1o</label><input id="v_anio" type="number" value="${v.anio||''}" placeholder="2020" min="1960" max="2030"></div>
      <div class="form-group"><label>Color</label><input id="v_color" value="${v.color||''}" placeholder="Blanco"></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>No. cilindros</label>
        <select id="v_cil"><option value="">\u2014</option>${[3,4,5,6,8,10,12,16].map(c=>`<option value="${c}" ${v.cilindros==c?'selected':''}>${c} cilindros</option>`).join('')}</select>
      </div>
      <div class="form-group"><label>Cilindraje (cc)</label><input id="v_cc" type="number" value="${v.cilindraje||''}" placeholder="2000"></div>
      <div class="form-group"><label>Tipo combustible</label>
        <select id="v_comb"><option value="gasolina" ${v.combustibleTipo==='gasolina'?'selected':''}>Gasolina</option><option value="diesel" ${v.combustibleTipo==='diesel'?'selected':''}>Diesel</option><option value="hibrido" ${v.combustibleTipo==='hibrido'?'selected':''}>H\u00EDbrido</option><option value="electrico" ${v.combustibleTipo==='electrico'?'selected':''}>El\u00E9ctrico</option></select>
      </div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Km actual</label><input id="v_km" type="number" value="${v.km||''}" placeholder="45000"></div>
      <div class="form-group"><label>VIN / No. motor / No. chasis</label><input id="v_vin" value="${v.vin||''}" placeholder="VIN o No. motor"></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label>Tipo servicio pr\u00F3ximo</label>
        <select id="v_tipoServ"><option value="Cambio de aceite">Cambio de aceite</option><option value="Mantenimiento preventivo">Mantenimiento preventivo</option><option value="Revisi\u00F3n general">Revisi\u00F3n general</option><option value="Frenos">Frenos</option><option value="Otro">Otro</option></select>
      </div>
      <div class="form-group"><label>Fecha pr\u00F3ximo servicio</label><input id="v_prox" type="date" value="${v.proximoServicio||''}"></div>
      <div class="form-group"><label>Km pr\u00F3ximo servicio</label><input id="v_kmprox" type="number" value="${v.kmProximo||''}" placeholder="50000"></div>
    </div>
    <div class="form-group"><label>Observaciones generales</label><textarea id="v_obs" style="min-height:60px">${v.observaciones||''}</textarea></div>
    <div id="recom_fab_preview"></div>
  `,async()=>{
    const placa=document.getElementById('v_placa').value.trim();
    const clienteId=parseInt(document.getElementById('v_cliente').value);
    if(!placa||!clienteId){toast('Placa y cliente requeridos','red');return;}
    const cliente=clientes.find(c=>c.id===clienteId);
    const obj={
      clienteId,clienteNombre:cliente?.nombre,placa,
      tipoVehiculo:document.getElementById('v_tipo').value,
      marca:document.getElementById('v_marca').value,
      modelo:document.getElementById('v_modelo').value.trim(),
      anio:parseInt(document.getElementById('v_anio').value)||null,
      color:document.getElementById('v_color').value.trim(),
      cilindros:parseInt(document.getElementById('v_cil').value)||null,
      cilindraje:parseInt(document.getElementById('v_cc').value)||null,
      combustibleTipo:document.getElementById('v_comb').value,
      km:parseInt(document.getElementById('v_km').value)||0,
      vin:document.getElementById('v_vin').value.trim(),
      tipoServicio:document.getElementById('v_tipoServ').value,
      proximoServicio:document.getElementById('v_prox').value,
      kmProximo:parseInt(document.getElementById('v_kmprox').value)||null,
      observaciones:document.getElementById('v_obs').value.trim(),
      updatedAt:nowTs()
    };
    if(id){obj.id=id;await dbPut('vehiculos',obj);}else{obj.createdAt=nowTs();await dbAdd('vehiculos',obj);}
    await logAuditoria(id?'EDITAR':'CREAR','vehiculos',(id?'Veh\u00edculo editado':'Veh\u00edculo creado')+': '+(obj.placa||''),{marca:obj.marca});
    closeModal('modalVehiculo');toast(id?'Veh\u00EDculo actualizado':'Veh\u00EDculo registrado');
    await navTo('vehiculos');
  },true);
}

async function eliminarVehiculo(id){if(!soloAdmin())return;if(!confirm('\u00BFEliminar?'))return;await dbDelete('vehiculos',id);await navTo('vehiculos');}
async function nuevaOrdenVehiculo(vehiculoId){await navTo('recepciones');setTimeout(()=>modalRecepcion(null,vehiculoId),300);}

/* ---- RECEPCIONES CON FOTOS ---- */
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
async function renderFacturas(content,actions){
  if(!adminOSupervisor()){content.innerHTML='<div class="alert alert-red">Acceso: Supervisor o Admin</div>';return;}
  const facturas=await dbGetAll('facturas');
  facturas.sort((a,b)=>(a.fecha||'')<(b.fecha||'')?1:-1);
  const mesActual=today().slice(0,7);
  const totalMes=facturas.filter(f=>f.fecha?.startsWith(mesActual)).reduce((a,f)=>a+(f.total||0),0);
  const ivaMes=facturas.filter(f=>f.fecha?.startsWith(mesActual)).reduce((a,f)=>a+(f.iva||0),0);
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalFactura()">+ Nueva factura</button>`;
  content.innerHTML=`
  <div class="section-title">Facturaci\u00F3n</div>
  <div class="stat-grid">
    <div class="stat-card stat-green"><div class="stat-label">Total facturado mes</div><div class="stat-value">${fmt(totalMes)}</div></div>
    <div class="stat-card stat-amber"><div class="stat-label">IVA generado mes</div><div class="stat-value">${fmt(ivaMes)}</div></div>
    <div class="stat-card"><div class="stat-label">Facturas emitidas</div><div class="stat-value">${facturas.filter(f=>f.fecha?.startsWith(mesActual)).length}</div></div>
  </div>
  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>No. Factura</th><th>Fecha</th><th>Cliente / NIT</th><th>Subtotal</th><th>Desc.</th><th>IVA 12%</th><th>Total</th><th>Pago</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>
        ${facturas.map(f=>`<tr>
          <td class="td-mono" style="font-weight:600">${f.noFactura||f.id}</td>
          <td>${fechaLegible(f.fecha)}</td>
          <td>${f.clienteNombre||'\u2014'} <span class="text-muted td-mono" style="font-size:11px">${f.nit||'CF'}</span></td>
          <td class="td-mono td-right">${fmt(f.subtotalBruto||f.subtotal)}</td>
          <td class="td-mono td-right text-red">${f.descuentoTotal>0?`-${fmt(f.descuentoTotal)}`:'\u2014'}</td>
          <td class="td-mono td-right text-amber">${fmt(f.iva)}</td>
          <td class="td-mono td-right text-green" style="font-weight:700">${fmt(f.total)}</td>
          <td><span class="badge badge-gray">${f.formaPago||'efectivo'}</span></td>
          <td><span class="badge badge-${f.pagada?'green':'amber'}">${f.pagada?'Pagada':'Pendiente'}</span></td>
          <td><div class="flex gap-1">
            <button class="btn btn-sm btn-secondary" onclick="modalFactura(${f.id})">\u270F</button>
            <button class="btn btn-sm btn-secondary" onclick="imprimirFactura(${f.id})">\u1F5A8</button>
            <button class="btn btn-sm btn-green" onclick="marcarPagada(${f.id},${f.pagada})">\u1F4B0</button>
            ${soloAdmin()?`<button class="btn btn-sm btn-danger" onclick="eliminarFactura(${f.id})">\u2715</button>`:''}
          </div></td>
        </tr>`).join('')||'<tr><td colspan="10" class="text-center text-muted" style="padding:20px">Sin facturas</td></tr>'}
      </tbody>
    </table></div>
  </div>`;
}



function lineaFacturaRow(l={},i=0){
  return`<div class="form-row" style="grid-template-columns:2fr 1fr 1fr 1fr auto;gap:6px;align-items:center;margin-bottom:6px" id="lf_row_${i}">
    <input placeholder="Descripci\u00F3n del servicio/producto" value="${l.desc||''}" id="lf_d_${i}" oninput="calcFacTotales()">
    <input type="number" value="${l.qty||1}" id="lf_q_${i}" min="0.01" step="0.01" oninput="calcFacTotales()">
    <input type="number" value="${l.unit||0}" id="lf_u_${i}" step="0.01" oninput="calcFacTotales()">
    <input type="number" value="${l.desc_pct||0}" id="lf_p_${i}" min="0" max="100" oninput="calcFacTotales()">
    <button class="btn btn-sm btn-danger btn-icon" onclick="document.getElementById('lf_row_${i}').remove();calcFacTotales()">\u2715</button>
  </div>`;
}

function addLineaFactura(){
  const list=document.getElementById('lineas_fac');
  const i=Date.now();const div=document.createElement('div');
  div.innerHTML=lineaFacturaRow({},i);list.appendChild(div.firstChild);calcFacTotales();
}

function getLineasFactura(){
  // Formato nuevo: lr0, ld0, lq0, lu0, lp0
  var rowsNew = Array.from(document.querySelectorAll('div[id]')).filter(function(r){
    return /^lr\d+$/.test(r.id);
  });
  if (rowsNew.length) {
    return rowsNew.map(function(r) {
      var ix = r.id.replace('lr','');
      return {
        desc: (document.getElementById('ld'+ix)||{}).value||'',
        qty:  parseFloat((document.getElementById('lq'+ix)||{}).value)||1,
        unit: parseFloat((document.getElementById('lu'+ix)||{}).value)||0,
        desc_pct: parseFloat((document.getElementById('lp'+ix)||{}).value)||0
      };
    }).filter(function(l){ return l.desc||l.unit>0; });
  }
  // Formato legacy: lf_row_X
  return Array.from(document.querySelectorAll('[id^="lf_row_"]')).map(function(r) {
    var ix = r.id.split('_').pop();
    return {
      desc: (document.getElementById('lf_d_'+ix)||{}).value||'',
      qty:  parseFloat((document.getElementById('lf_q_'+ix)||{}).value)||1,
      unit: parseFloat((document.getElementById('lf_u_'+ix)||{}).value)||0,
      desc_pct: parseFloat((document.getElementById('lf_p_'+ix)||{}).value)||0
    };
  }).filter(function(l){ return l.desc||l.unit>0; });
}
function getLF() { return getLineasFactura(); }



function calcLFTotal(i) {
  var qty  = parseFloat((document.getElementById('lq'+i)||{}).value)||0;
  var unit = parseFloat((document.getElementById('lu'+i)||{}).value)||0;
  var desc = parseFloat((document.getElementById('lp'+i)||{}).value)||0;
  var tot  = qty * unit * (1 - desc/100);
  var el   = document.getElementById('lt'+i);
  if (el) el.textContent = 'Q ' + tot.toFixed(2);
}

var calcTotFac = function(){ if(typeof calcFacTotales==="function") calcFacTotales(); };
function calcFacTotales(){
  try{
    // Leer TODAS las líneas (incluso vacías) para mostrar totales en tiempo real
    var rowsNew = Array.from(document.querySelectorAll('div[id]')).filter(function(r){
      return /^lr\d+$/.test(r.id);
    });
    var lineasAll = rowsNew.length ? rowsNew.map(function(r){
      var ix = r.id.replace('lr','');
      return {
        qty:  parseFloat((document.getElementById('lq'+ix)||{}).value)||0,
        unit: parseFloat((document.getElementById('lu'+ix)||{}).value)||0,
        desc_pct: parseFloat((document.getElementById('lp'+ix)||{}).value)||0
      };
    }) : getLineasFactura();
    const bruto=lineasAll.reduce((a,l)=>a+(l.qty*l.unit),0);
    const desc=lineasAll.reduce((a,l)=>a+(l.qty*l.unit*(l.desc_pct||0)/100),0);
    const sub=parseFloat((bruto-desc).toFixed(2));
    const iva=parseFloat((sub*IVA).toFixed(2));
    const total=parseFloat((sub+iva).toFixed(2));
    const el=document.getElementById('fac_tots')||document.getElementById('fac_totales');if(!el)return;
    const row=(label,val,cls='',bold=false)=>`<div style="display:flex;justify-content:space-between;gap:24px;font-size:${bold?'14':'13'}px;${bold?'font-weight:700;':''}color:${cls?`var(--${cls})`:'var(--text2)'};${bold?'border-top:1px solid var(--border);padding-top:8px;margin-top:4px':''}"><span>${label}</span><span style="font-family:var(--font-mono)">Q&nbsp;${fmtNum(val)}</span></div>`;
    el.innerHTML=`<div style="display:inline-block;text-align:right;min-width:280px;background:var(--bg3);border-radius:var(--radius);padding:14px 16px;border:1px solid var(--border)">
      ${row('Subtotal bruto:',bruto)}
      ${desc>0?row('(-) Descuentos:',desc,'red'):''}
      ${row('Subtotal neto:',sub)}
      ${row('IVA (12%):',iva,'accent')}
      ${row('TOTAL A PAGAR:',total,'green',true)}
    </div>`;
  }catch(e){}
}

function cargarNITCliente(){
  const parts=(document.getElementById('f_cliente')?.value||'::').split(':');
  const el=document.getElementById('f_nit');if(el)el.value=parts[1]||'CF';
}

async function imprimirFactura(id){
  const f=await dbGet('facturas',id);
  const cfg=await dbGet('config','taller')||{};
  const w=window.open('','_blank');
  const lineas=f.lineas||[];
  const filasHTML=lineas.map(l=>{
    const bruto=l.qty*l.unit;const desc=bruto*(l.desc_pct||0)/100;const neto=bruto-desc;
    return`<tr>
      <td>${l.desc}</td>
      <td style="text-align:center">${parseFloat(l.qty).toFixed(l.qty%1===0?0:2)}</td>
      <td style="text-align:right">Q&nbsp;${fmtNum(l.unit)}</td>
      <td style="text-align:center;color:#c00">${l.desc_pct||0}%</td>
      <td style="text-align:right;color:#c00">${desc>0?`-Q&nbsp;${fmtNum(desc)}`:'\u2014'}</td>
      <td style="text-align:right;font-weight:600">Q&nbsp;${fmtNum(neto)}</td>
    </tr>`;
  }).join('');
  w.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Factura ${f.noFactura}</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;font-size:11.5px;color:#111;background:#fff;padding:28px 32px;max-width:720px;margin:0 auto}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #111;padding-bottom:12px;margin-bottom:14px}
  .taller{font-size:19px;font-weight:900;letter-spacing:-.5px}.sub{font-size:10.5px;color:#555;margin-top:3px;line-height:1.6}
  .doc-tipo{font-size:21px;font-weight:900;text-align:right}.doc-info{font-size:11px;color:#555;text-align:right;margin-top:2px}
  .bloque{background:#f8f8f8;border:1px solid #ddd;border-radius:4px;padding:8px 12px;margin-bottom:12px}
  .bloque table{width:100%;border-collapse:collapse}.bloque td{padding:3px 6px;font-size:11px}
  .bloque td:first-child{color:#666;width:120px;font-weight:600}
  table.items{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:0}
  table.items thead tr{background:#111;color:#fff}
  table.items th{padding:7px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.3px}
  table.items td{padding:6px 8px;border-bottom:1px solid #e8e8e8}
  table.items tbody tr:nth-child(even){background:#fafafa}
  .wrap{border:1px solid #ddd;border-radius:4px;overflow:hidden}
  .totales{width:280px;border:1px solid #ddd;border-top:none;margin-left:auto;overflow:hidden}
  .totales td{padding:5px 10px;font-size:12px;border-bottom:1px solid #eee}
  .totales td:last-child{text-align:right;font-family:'Courier New',monospace;font-weight:600}
  .totales td:first-child{color:#555}.fila-iva td{background:#fff8e8}
  .fila-desc td{background:#fff0f0}.fila-total td{background:#111!important;color:#fff!important;font-size:13px;font-weight:900}
  .fila-total td:last-child{font-size:14px}
  .letras{background:#f0f0f0;border:1px solid #ddd;border-radius:4px;padding:7px 10px;margin-top:12px;font-size:10.5px}
  .firmas{display:flex;gap:40px;margin-top:32px}
  .firma{flex:1;border-top:1px solid #888;padding-top:5px;text-align:center;font-size:10.5px;color:#666}
  .pie{margin-top:16px;display:flex;justify-content:space-between;font-size:10px;color:#aaa;border-top:1px solid #ddd;padding-top:8px}
  .pagada-badge{background:#e8f5e9;color:#2e7d32;border:1px solid #a5d6a7;border-radius:3px;padding:2px 8px;font-size:10px;font-weight:700;margin-left:8px}
  @media print{body{padding:12px 14px}button,.no-print{display:none!important}@page{margin:10mm}}
  </style></head><body>
  <div class="header">
    <div><div class="taller">\u2699 ${cfg.nombre||'TALLER PRO GT'}</div>
      <div class="sub">NIT: ${cfg.nit||'\u2014'}<br>${cfg.direccion||'Guatemala'}<br>Tel: ${cfg.telefono||'\u2014'} | ${cfg.email||'\u2014'}</div>
    </div>
    <div><div class="doc-tipo">FACTURA${f.pagada?' <span class="pagada-badge">PAGADA</span>':''}</div>
      <div class="doc-info">No. ${f.noFactura||f.id}</div>
      <div class="doc-info">Fecha: ${fechaLegible(f.fecha)}</div>
      <div class="doc-info">Pago: ${(f.formaPago||'Efectivo').charAt(0).toUpperCase()+(f.formaPago||'efectivo').slice(1)}</div>
    </div>
  </div>
  <div class="bloque"><table><tbody>
    <tr><td>Cliente:</td><td><strong>${f.clienteNombre||'\u2014'}</strong></td><td style="width:70px;color:#666;font-weight:600">NIT:</td><td><strong>${f.nit||'CF'}</strong></td></tr>
    ${f.clienteDireccion?`<tr><td>Direcci\u00F3n:</td><td colspan="3">${f.clienteDireccion}</td></tr>`:''}
    ${f.descripcion?`<tr><td>Referencia:</td><td colspan="3">${f.descripcion}</td></tr>`:''}
  </tbody></table></div>
  <div class="wrap">
    <table class="items">
      <thead><tr><th>Descripci\u00F3n del servicio / producto</th><th style="text-align:center;width:60px">Cant.</th><th style="text-align:right;width:100px">P. Unit. Q</th><th style="text-align:center;width:60px">Desc.</th><th style="text-align:right;width:90px">Desc. Q</th><th style="text-align:right;width:100px">Total Q</th></tr></thead>
      <tbody>${filasHTML||'<tr><td colspan="6" style="text-align:center;color:#999;padding:12px">Sin detalle</td></tr>'}</tbody>
    </table>
    <table class="totales">
      ${f.descuentoTotal>0?`<tr class="fila-desc"><td>(-) Descuentos</td><td>-Q&nbsp;${fmtNum(f.descuentoTotal)}</td></tr>`:''}
      <tr><td>Subtotal</td><td>Q&nbsp;${fmtNum(f.subtotal||0)}</td></tr>
      <tr class="fila-iva"><td>IVA (12%)</td><td>Q&nbsp;${fmtNum(f.iva||0)}</td></tr>
      <tr class="fila-total"><td>TOTAL A PAGAR</td><td>Q&nbsp;${fmtNum(f.total||0)}</td></tr>
    </table>
  </div>
  <div class="letras"><strong>SON:</strong> ${numLetras(f.total||0)}</div>
  ${cfg.piePagina?`<div style="margin-top:10px;font-size:10.5px;color:#666;text-align:center">${cfg.piePagina}</div>`:''}
  <div class="firmas">
    <div class="firma">Autorizado por<br><br>${cfg.nombre||'Taller Pro GT'}</div>
    <div class="firma">Recib\u00ED conforme<br><br>${f.clienteNombre||''}</div>
  </div>
  <div class="pie"><span>R\u00E9gimen IVA \u2014 Decreto 27-92 Guatemala</span><span>${new Date().toLocaleString('es-GT')}</span></div>
  <div class="no-print" style="margin-top:18px;text-align:center">
    <button onclick="window.print()" style="padding:9px 22px;background:#111;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px">\u1F5A8 Imprimir / Guardar PDF</button>
  </div>
  
  </body></html>`);
  w.document.close(); setTimeout(function(){w.print();},400);
}

async function marcarPagada(id,actual){
  const f=await dbGet('facturas',id);f.pagada=!actual;
  await dbPut('facturas',f);toast(f.pagada?'Marcada como pagada':'Marcada como pendiente');
  await navTo('facturas');
}
async function eliminarFactura(id){if(!soloAdmin())return;if(!confirm('\u00BFEliminar factura?'))return;await dbDelete('facturas',id);await navTo('facturas');}

/* ---- ALERTAS AMPLIADAS ---- */
async function generarAlertasAutomaticas(){
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
async function renderDashboard(content,actions){
  const [facturas,ordenes,repuestos,insumos,clientes,alertas,costos,empleados]=await Promise.all([
    dbGetAll('facturas'),dbGetAll('ordenes'),dbGetAll('repuestos'),dbGetAll('insumos'),
    dbGetAll('clientes'),dbGetAll('alertas'),dbGetAll('costos'),dbGetAll('empleados')
  ]);
  const mes=today().slice(0,7);
  const fMes=facturas.filter(f=>f.fecha?.startsWith(mes));
  const ingBrutos=fMes.reduce((a,f)=>a+(f.total||0),0);
  const ivaCob=fMes.reduce((a,f)=>a+(f.iva||0),0);
  const ingNetos=fMes.reduce((a,f)=>a+(f.subtotal||0),0);
  const costMes=costos.filter(c=>c.fecha?.startsWith(mes)).reduce((a,c)=>a+(c.monto||0),0);
  const utilidad=ingNetos-costMes;
  const pendAlerts=alertas.filter(a=>!a.vista).length;
  const stockBajo=[...repuestos,...insumos].filter(i=>(i.stock||0)<=(i.stockMin||5)).length;
  const otsAbiertas=ordenes.filter(o=>o.estado!=='completada'&&o.estado!=='entregada').length;
  const margen=ingNetos>0?(utilidad/ingNetos*100).toFixed(1):0;

  content.innerHTML=`
  <div class="section-title">Dashboard General</div>
  <div class="section-sub">${fechaLegible(today())} \u2014 Usuario: <strong>${sesionActual?.nombre}</strong> <span class="badge badge-${sesionActual?.perfil==='admin'?'red':sesionActual?.perfil==='supervisor'?'amber':'blue'}">${PERFILES[sesionActual?.perfil]?.label||''}</span></div>
  <div class="stat-grid">
    <div class="stat-card stat-green"><div class="stat-label">Facturaci\u00F3n bruta mes</div><div class="stat-value">${fmt(ingBrutos)}</div><div class="stat-sub">${fMes.length} facturas</div></div>
    <div class="stat-card stat-blue"><div class="stat-label">Utilidad neta mes</div><div class="stat-value">${fmt(utilidad)}</div><div class="stat-sub">Margen: ${margen}%</div></div>
    <div class="stat-card stat-amber"><div class="stat-label">IVA generado mes</div><div class="stat-value">${fmt(ivaCob)}</div><div class="stat-sub">Por declarar a SAT</div></div>
    <div class="stat-card ${utilidad>=0?'stat-green':'stat-red'}"><div class="stat-label">Resultado mes</div><div class="stat-value" style="font-size:18px">${utilidad>=0?'\u2713 GANANCIA':'\u2717 P\u00C9RDIDA'}</div></div>
  </div>
  <div class="stat-grid">
    <div class="stat-card ${otsAbiertas>0?'stat-amber':''}"><div class="stat-label">OT abiertas</div><div class="stat-value">${otsAbiertas}</div></div>
    <div class="stat-card ${pendAlerts>0?'stat-red':''}"><div class="stat-label">Alertas</div><div class="stat-value">${pendAlerts}</div></div>
    <div class="stat-card ${stockBajo>0?'stat-red':''}"><div class="stat-label">Stock bajo</div><div class="stat-value">${stockBajo} items</div></div>
    <div class="stat-card"><div class="stat-label">Clientes</div><div class="stat-value" style="color:var(--purple)">${clientes.length}</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div class="card">
      <div class="card-header"><span class="card-title">\u00DAltimas \u00F3rdenes</span><button class="btn btn-sm btn-secondary" onclick="navTo('ordenes')">Ver todas</button></div>
      ${ordenes.slice(-6).reverse().map(o=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)">
        <div><div style="font-size:13px;font-weight:500">${o.noOT||'OT'} \u2014 ${o.placa||''}</div><div style="font-size:11px;color:var(--text2)">${o.tecnico||'\u2014'} | ${fechaLegible(o.fecha)}</div></div>
        <span class="badge badge-${o.estado==='entregada'?'green':o.estado==='completada'?'blue':o.estado==='en_proceso'?'amber':'gray'}">${o.estado||'nuevo'}</span>
      </div>`).join('')||'<div class="text-muted text-center" style="padding:12px;font-size:13px">Sin \u00F3rdenes</div>'}
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Stock cr\u00EDtico</span></div>
      ${[...repuestos,...insumos].filter(i=>(i.stock||0)<=(i.stockMin||5)).slice(0,6).map(i=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)">
          <div style="font-size:13px">${i.nombre}</div>
          <span class="badge badge-red">${i.stock||0}/${i.stockMin||5}</span>
        </div>`).join('')||'<div class="text-muted text-center" style="padding:12px;font-size:13px">Stock OK \u2713</div>'}
    </div>
  </div>`;
}

/* ---- DASHBOARD KPI MEC\u00C1NICOS ---- */
async function renderDashboard_mecanicos(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Solo administradores</div>';return;}
  const empleados=await dbGetAll('empleados');
  const kpiData=await dbGetAll('kpi');
  const ordenes=await dbGetAll('ordenes');
  const mes=today().slice(0,7);
  const mec\u00E1nicos=empleados.filter(e=>['Mec\u00E1nico','Mec\u00E1nico senior','Electricista','Auxiliar'].includes(e.cargo)&&e.activo!==false);

  const metricas=mec\u00E1nicos.map(e=>{
    const kpiMes=kpiData.filter(k=>k.empleadoId===e.id&&k.mes===mes);
    const otsMes=ordenes.filter(o=>o.tecnico===e.nombre&&o.fecha?.startsWith(mes));
    const totalFact=kpiMes.reduce((a,k)=>a+(k.totalFacturado||0),0);
    const otsEntregadas=otsMes.filter(o=>o.estado==='entregada').length;
    const otsTotales=otsMes.length;
    const tasaEfect=otsTotales>0?(otsEntregadas/otsTotales*100).toFixed(0):0;
    const horasTrab=otsMes.reduce((a,o)=>(o.manoObra||[]).reduce((b,m)=>b+(m.horas||0),0)+a,0);
    const salario=e.salarioBase||0;
    const metaFact=salario*3;// Meta: 3x el salario
    const pctMeta=metaFact>0?(totalFact/metaFact*100).toFixed(0):0;
    const bonus=totalFact>metaFact?(totalFact-metaFact)*0.05:0;// 5% sobre excedente
    return{...e,kpiMes,otsMes,totalFact,otsEntregadas,otsTotales,tasaEfect,horasTrab,metaFact,pctMeta,bonus};
  });

  content.innerHTML=`
  <div class="section-title">Dashboard KPI \u2014 Mec\u00E1nicos</div>
  <div class="section-sub">Mes: ${mes} \u2014 Evaluaci\u00F3n de desempe\u00F1o y bonificaciones</div>
  <div class="stat-grid">
    <div class="stat-card"><div class="stat-label">Mec\u00E1nicos activos</div><div class="stat-value" style="color:var(--purple)">${mec\u00E1nicos.length}</div></div>
    <div class="stat-card stat-green"><div class="stat-label">Total facturado (equipo)</div><div class="stat-value">${fmt(metricas.reduce((a,m)=>a+m.totalFact,0))}</div></div>
    <div class="stat-card stat-amber"><div class="stat-label">Bonificaciones a pagar</div><div class="stat-value">${fmt(metricas.reduce((a,m)=>a+m.bonus,0))}</div></div>
    <div class="stat-card"><div class="stat-label">OTs completadas</div><div class="stat-value">${metricas.reduce((a,m)=>a+m.otsEntregadas,0)}</div></div>
  </div>

  ${metricas.map(m=>`
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
      <div>
        <div style="font-size:15px;font-weight:700">${m.nombre}</div>
        <div style="font-size:12px;color:var(--text2)">${m.cargo} \u2014 Salario: ${fmt(m.salarioBase)}/mes</div>
      </div>
      ${m.bonus>0?`<div style="text-align:right"><div style="font-size:11px;color:var(--text3)">Bono desempe\u00F1o</div><div style="font-size:18px;font-weight:700;color:var(--green)">${fmt(m.bonus)}</div></div>`:'<span class="badge badge-gray">Sin bono este mes</span>'}
    </div>
    <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card"><div class="stat-label">Facturado</div><div class="stat-value" style="font-size:16px;color:var(--green)">${fmt(m.totalFact)}</div><div class="stat-sub">Meta: ${fmt(m.metaFact)}</div></div>
      <div class="stat-card"><div class="stat-label">OTs totales</div><div class="stat-value" style="font-size:16px">${m.otsTotales}</div><div class="stat-sub">${m.otsEntregadas} entregadas</div></div>
      <div class="stat-card"><div class="stat-label">Tasa efectividad</div><div class="stat-value" style="font-size:16px;color:var(--${parseInt(m.tasaEfect)>=80?'green':parseInt(m.tasaEfect)>=60?'accent':'red'})">${m.tasaEfect}%</div></div>
      <div class="stat-card"><div class="stat-label">Horas trabajadas</div><div class="stat-value" style="font-size:16px">${m.horasTrab.toFixed(1)}</div><div class="stat-sub">hrs en OTs</div></div>
    </div>
    <div style="margin-top:10px">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span>Progreso meta de facturaci\u00F3n</span><span class="td-mono">${m.pctMeta}%</span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(parseInt(m.pctMeta),100)}%;background:var(--${parseInt(m.pctMeta)>=100?'green':parseInt(m.pctMeta)>=70?'accent':'red'})"></div></div>
    </div>
    ${m.otsMes.slice(-3).length?`<div style="margin-top:10px;font-size:12px;color:var(--text2)">\u00DAltimas OT: ${m.otsMes.slice(-3).map(o=>`<span class="badge badge-gray">${o.noOT}</span>`).join(' ')}</div>`:''}
  </div>`).join('')||'<div class="card text-center text-muted">No hay mec\u00E1nicos registrados</div>'}

  <div class="card">
    <div class="card-title" style="margin-bottom:10px">Criterios de bonificaci\u00F3n</div>
    <div style="font-size:13px;color:var(--text2);line-height:2">
      \u2022 Meta mensual por t\u00E9cnico: <strong>3x el salario base</strong><br>
      \u2022 Bono por excedente: <strong>5% sobre la facturaci\u00F3n que supere la meta</strong><br>
      \u2022 Efectividad m\u00EDnima requerida: <strong>80% de OTs entregadas</strong><br>
      \u2022 Las bonificaciones se incluyen autom\u00E1ticamente en la n\u00F3mina del mes
    </div>
  </div>`;
}

/* ---- DASHBOARD FINANCIERO ---- */
async function renderDashboard_financiero(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Solo administradores</div>';return;}
  const [facturas,costos,activos,empleados,nomina]=await Promise.all([
    dbGetAll('facturas'),dbGetAll('costos'),dbGetAll('activos'),dbGetAll('empleados'),dbGetAll('nomina')
  ]);
  const meses=[];
  for(let i=5;i>=0;i--){const d=new Date();d.setMonth(d.getMonth()-i);meses.push(d.toISOString().slice(0,7));}
  const depMen=activos.reduce((a,ac)=>a+(ac.valorOriginal-(ac.valorResidual||0))/(ac.vidaUtil||5)/12,0);
  const nominaMen=nomina.filter(n=>n.mes===today().slice(0,7)).reduce((a,n)=>a+n.netoPagar,0);

  const datos=meses.map(mes=>{
    const ing=facturas.filter(f=>f.fecha?.startsWith(mes)).reduce((a,f)=>a+(f.subtotal||0),0);
    const ivaCob=facturas.filter(f=>f.fecha?.startsWith(mes)).reduce((a,f)=>a+(f.iva||0),0);
    const costOp=costos.filter(c=>c.fecha?.startsWith(mes)).reduce((a,c)=>a+(c.monto||0),0);
    const nomM=nomina.filter(n=>n.mes===mes).reduce((a,n)=>a+(n.netoPagar||0),0);
    const util=ing-costOp-nomM-depMen;
    const isr=Math.max(util*ISR,0);
    return{mes,ing,ivaCob,costOp,nomM,depMen,util,isr,utilNeta:util-isr};
  });

  const curr=datos[datos.length-1];
  const acumulado=datos.reduce((a,d)=>({ing:a.ing+d.ing,costOp:a.costOp+d.costOp,util:a.util+d.util,utilNeta:a.utilNeta+d.utilNeta}),{ing:0,costOp:0,util:0,utilNeta:0});

  content.innerHTML=`
  <div class="section-title">Dashboard Financiero</div>
  <div class="section-sub">Estado financiero integral \u2014 \u00FAltimos 6 meses</div>

  <div class="stat-grid">
    <div class="stat-card stat-green"><div class="stat-label">Ingresos netos mes</div><div class="stat-value">${fmt(curr.ing)}</div></div>
    <div class="stat-card stat-red"><div class="stat-label">Costos operativos</div><div class="stat-value">${fmt(curr.costOp+curr.nomM+curr.depMen)}</div><div class="stat-sub">Op + N\u00F3mina + Dep.</div></div>
    <div class="stat-card ${curr.util>=0?'stat-green':'stat-red'}"><div class="stat-label">Utilidad antes ISR</div><div class="stat-value">${fmt(curr.util)}</div></div>
    <div class="stat-card stat-amber"><div class="stat-label">ISR estimado mes</div><div class="stat-value">${fmt(curr.isr)}</div><div class="stat-sub">25% s/utilidad</div></div>
  </div>

  <div class="card">
    <div class="card-title" style="margin-bottom:12px">Estado de Resultados \u2014 6 meses</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Mes</th><th class="td-right">Ingresos netos</th><th class="td-right">Costos op.</th><th class="td-right">N\u00F3mina</th><th class="td-right">Depreciaci\u00F3n</th><th class="td-right">Util. bruta</th><th class="td-right">ISR 25%</th><th class="td-right">Util. neta</th><th class="td-right">Margen</th></tr></thead>
      <tbody>
        ${datos.map(d=>`<tr>
          <td class="td-mono">${d.mes}</td>
          <td class="td-mono td-right text-green">${fmt(d.ing)}</td>
          <td class="td-mono td-right text-red">${fmt(d.costOp)}</td>
          <td class="td-mono td-right text-red">${fmt(d.nomM)}</td>
          <td class="td-mono td-right text-amber">${fmt(d.depMen)}</td>
          <td class="td-mono td-right">${fmt(d.util)}</td>
          <td class="td-mono td-right">${fmt(d.isr)}</td>
          <td class="td-mono td-right" style="font-weight:700;color:var(--${d.utilNeta>=0?'green':'red'})">${fmt(d.utilNeta)}</td>
          <td class="td-mono td-right">${d.ing>0?((d.utilNeta/d.ing)*100).toFixed(1):0}%</td>
        </tr>`).join('')}
        <tr style="background:var(--bg3);font-weight:700">
          <td>ACUMULADO</td>
          <td class="td-mono td-right text-green">${fmt(acumulado.ing)}</td>
          <td class="td-mono td-right" colspan="3"></td>
          <td class="td-mono td-right">${fmt(acumulado.util)}</td>
          <td class="td-mono td-right"></td>
          <td class="td-mono td-right" style="color:var(--${acumulado.utilNeta>=0?'green':'red'})">${fmt(acumulado.utilNeta)}</td>
          <td class="td-mono td-right">${acumulado.ing>0?((acumulado.utilNeta/acumulado.ing)*100).toFixed(1):0}%</td>
        </tr>
      </tbody>
    </table></div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div class="card">
      <div class="card-title" style="margin-bottom:12px">Estructura de costos (mes actual)</div>
      ${[['Costos operativos',curr.costOp],['N\u00F3mina',curr.nomM],['Depreciaci\u00F3n activos',curr.depMen],['ISR estimado',curr.isr]].map(([k,v])=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);font-size:13px">
          <span>${k}</span><span class="td-mono text-red">${fmt(v)}</span>
        </div>`).join('')}
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-weight:700;font-size:14px">
        <span>Total costos:</span><span class="td-mono text-red">${fmt(curr.costOp+curr.nomM+curr.depMen+curr.isr)}</span>
      </div>
    </div>
    <div class="card">
      <div class="card-title" style="margin-bottom:12px">ISR Trimestral proyectado</div>
      ${[0,1,2,3].map(t=>{
        const tDatos=datos.slice(Math.max(0,t*1),Math.max(0,t*1)+3);
        const utilTrim=tDatos.reduce((a,d)=>a+d.util,0);
        const isrTrim=Math.max(utilTrim*ISR,0);
        return`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:13px">Trimestre ${t+1}</span>
          <div style="text-align:right"><div class="td-mono text-amber">${fmt(isrTrim)}</div><div style="font-size:11px;color:var(--text3)">Base: ${fmt(utilTrim)}</div></div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

/* ---- M\u00D3DULOS FINANCIEROS RESTANTES ---- */

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
