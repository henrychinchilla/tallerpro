/* TallerPro GT — js/facturas.js
   Módulo independiente — cada archivo tiene funciones específicas
   Para editar: modificar solo este archivo y recargar
*/

function renderFacturas(content,actions){
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
const CUENTAS_TALLER={
  '1101':'Caja y bancos','1102':'Cuentas por cobrar clientes','1103':'Inventario repuestos',
  '1201':'Equipo y maquinaria','1202':'Depreciaci\u00F3n acumulada',
  '2101':'Cuentas por pagar proveedores','2102':'IVA por pagar SAT',
  '2103':'ISR por pagar','2104':'IGSS por pagar',
  '3101':'Capital social','3102':'Utilidades retenidas',
  '4101':'Ingresos mano de obra','4102':'Ingresos repuestos/insumos',
  '5101':'Costo de ventas repuestos','5102':'Salarios y prestaciones',
  '5103':'Alquiler local','5104':'Depreciaci\u00F3n del per\u00EDodo',
  '5105':'Servicios p\u00FAblicos','5106':'Combustible y transporte','5107':'Otros gastos'
};

async function renderAsientos(content, actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Solo administradores</div>';return;}
  const asientos=await dbGetAll('asientos');
  asientos.sort((a,b)=>(a.fecha||'')<(b.fecha||'')?1:-1);
  actions.innerHTML=`
    <button class="btn btn-secondary" onclick="generarAsientosDesdeFacturas()">\u26A1 Auto-generar</button>
    <button class="btn btn-primary" onclick="modalAsiento()">+ Nuevo asiento</button>`;
  const mes=today().slice(0,7);
  const asMes=asientos.filter(a=>a.fecha&&a.fecha.startsWith(mes));
  const totDebe=asMes.reduce((s,a)=>s+(a.debe||0),0);
  const totHaber=asMes.reduce((s,a)=>s+(a.haber||0),0);
  const cuadrado=Math.abs(totDebe-totHaber)<0.01;

  // Balance simple
  const saldos={};
  for(const a of asMes){
    if(a.cuentaDebe){if(!saldos[a.cuentaDebe])saldos[a.cuentaDebe]={debe:0,haber:0};saldos[a.cuentaDebe].debe+=(a.debe||0);}
    if(a.cuentaHaber){if(!saldos[a.cuentaHaber])saldos[a.cuentaHaber]={debe:0,haber:0};saldos[a.cuentaHaber].haber+=(a.haber||0);}
  }

  content.innerHTML=`
  <div class="section-title">Contabilidad \u2014 Libro Diario</div>
  <div class="section-sub">Asientos contables del per\u00EDodo \u2014 ${mes}</div>
  <div class="stat-grid">
    <div class="stat-card stat-green"><div class="stat-label">Total DEBE mes</div><div class="stat-value">${fmt(totDebe)}</div></div>
    <div class="stat-card stat-blue"><div class="stat-label">Total HABER mes</div><div class="stat-value">${fmt(totHaber)}</div></div>
    <div class="stat-card ${cuadrado?'stat-green':'stat-red'}"><div class="stat-label">Balance</div><div class="stat-value" style="font-size:16px">${cuadrado?'\u2713 Cuadrado':'\u26A0 Diferencia'}</div><div class="stat-sub">${cuadrado?'0.00':fmt(Math.abs(totDebe-totHaber))}</div></div>
    <div class="stat-card"><div class="stat-label">Asientos mes</div><div class="stat-value">${asMes.length}</div></div>
  </div>

  <div style="display:grid;grid-template-columns:2fr 1fr;gap:14px">
    <div class="card" style="padding:10px">
      <div class="card-header"><span class="card-title">Libro Diario</span></div>
      <div class="table-wrap"><table>
        <thead><tr><th>No.</th><th>Fecha</th><th>Descripci\u00F3n</th><th>Cta D\u00E9bito</th><th>Cta Cr\u00E9dito</th><th class="td-right">Debe Q</th><th class="td-right">Haber Q</th><th>Ref.</th><th></th></tr></thead>
        <tbody>
          ${asientos.map(a=>`<tr>
            <td class="td-mono" style="font-size:10px">${a.noAsiento||a.id}</td>
            <td style="font-size:11px;white-space:nowrap">${fechaLegible(a.fecha)}</td>
            <td style="font-size:11px;max-width:160px">${a.descripcion||'\u2014'}</td>
            <td style="font-size:10px;color:var(--green)">${a.cuentaDebe?'('+a.cuentaDebe+') '+(CUENTAS_TALLER[a.cuentaDebe]||a.cuentaDebe):'\u2014'}</td>
            <td style="font-size:10px;color:var(--blue)">${a.cuentaHaber?'('+a.cuentaHaber+') '+(CUENTAS_TALLER[a.cuentaHaber]||a.cuentaHaber):'\u2014'}</td>
            <td class="td-mono td-right text-green">${fmt(a.debe||0)}</td>
            <td class="td-mono td-right text-blue">${fmt(a.haber||0)}</td>
            <td style="font-size:10px;color:var(--text3)">${a.referencia||'\u2014'}</td>
            <td><div class="flex gap-1">
              <button class="btn btn-sm btn-secondary" onclick="modalAsiento(${a.id})">\u270F</button>
              <button class="btn btn-sm btn-danger" onclick="eliminarAsiento(${a.id})">\u2715</button>
            </div></td>
          </tr>`).join('')||'<tr><td colspan="9" class="text-center text-muted" style="padding:16px;font-size:12px">Sin asientos. Usa "Auto-generar" para crear desde facturas.</td></tr>'}
          ${asientos.length>0?`<tr style="background:var(--bg3);font-weight:700"><td colspan="5">TOTALES</td><td class="td-mono td-right text-green">${fmt(asientos.reduce((s,a)=>s+(a.debe||0),0))}</td><td class="td-mono td-right text-blue">${fmt(asientos.reduce((s,a)=>s+(a.haber||0),0))}</td><td colspan="2"></td></tr>`:''}
        </tbody>
      </table></div>
    </div>
    <div>
      <div class="card">
        <div class="card-title" style="margin-bottom:10px">Balance de Comprobaci\u00F3n</div>
        ${Object.keys(saldos).length===0?'<div class="text-muted text-center" style="font-size:12px;padding:10px">Sin movimientos este mes</div>':
          `<div class="table-wrap"><table>
            <thead><tr><th>Cuenta</th><th class="td-right">Debe</th><th class="td-right">Haber</th><th class="td-right">Saldo</th></tr></thead>
            <tbody>${Object.entries(saldos).map(([cod,{debe,haber}])=>{
              const s=debe-haber;
              return`<tr><td style="font-size:10px">(${cod}) ${CUENTAS_TALLER[cod]||cod}</td>
                <td class="td-mono td-right text-green" style="font-size:10px">${fmt(debe)}</td>
                <td class="td-mono td-right text-blue" style="font-size:10px">${fmt(haber)}</td>
                <td class="td-mono td-right ${s>=0?'text-green':'text-red'}" style="font-size:10px">${fmt(Math.abs(s))}</td></tr>`;
            }).join('')}</tbody>
          </table></div>`}
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom:10px">Plan de Cuentas</div>
        <div style="font-size:11px;line-height:2">
          ${Object.entries(CUENTAS_TALLER).map(([c,n])=>{
            const tipo=c[0]==='1'?'<span class="badge badge-green">Activo</span>':c[0]==='2'?'<span class="badge badge-red">Pasivo</span>':c[0]==='3'?'<span class="badge badge-blue">Capital</span>':c[0]==='4'?'<span class="badge badge-green">Ingreso</span>':'<span class="badge badge-amber">Egreso</span>';
            return`<div style="display:flex;align-items:center;gap:6px;padding:1px 0"><span class="td-mono" style="font-size:10px;color:var(--text3)">${c}</span><span style="flex:1">${n}</span>${tipo}</div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

async function modalAsiento(id=null){
  if(!soloAdmin())return;
  const a=id?await dbGet('asientos',id):{};
  const cuentasOpts=Object.entries(CUENTAS_TALLER).map(([c,n])=>`<option value="${c}" ${(a.cuentaDebe===c||a.cuentaHaber===c)?'':''}>( ${c} ) ${n}</option>`).join('');
  const optsDebe=Object.entries(CUENTAS_TALLER).map(([c,n])=>`<option value="${c}" ${a.cuentaDebe===c?'selected':''}>(${c}) ${n}</option>`).join('');
  const optsHaber=Object.entries(CUENTAS_TALLER).map(([c,n])=>`<option value="${c}" ${a.cuentaHaber===c?'selected':''}>(${c}) ${n}</option>`).join('');
  openModal('modalAsiento',id?'Editar Asiento':'Nuevo Asiento Contable',`
    <div class="form-row form-row-3">
      <div class="form-group"><label>No. Asiento</label><input id="as_no" value="${a.noAsiento||genId('AS-')}"></div>
      <div class="form-group"><label>Fecha *</label><input id="as_fecha" type="date" value="${a.fecha||today()}"></div>
      <div class="form-group"><label>Referencia</label><input id="as_ref" value="${a.referencia||''}" placeholder="FAC-001, OT-002..."></div>
    </div>
    <div class="form-group"><label>Descripci\u00F3n del asiento *</label>
      <input id="as_desc" value="${a.descripcion||''}" placeholder="Ej: Venta servicios del d\u00EDa, cobro factura...">
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Cuenta D\u00C9BITO (cargo) *</label>
        <select id="as_cdebe"><option value="">\u2014 Seleccionar cuenta \u2014</option>${optsDebe}</select>
      </div>
      <div class="form-group"><label>Monto DEBE (Q) *</label>
        <input id="as_debe" type="number" value="${a.debe||0}" step="0.01" min="0" oninput="previewAsiento()">
      </div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Cuenta CR\u00C9DITO (abono) *</label>
        <select id="as_chaber"><option value="">\u2014 Seleccionar cuenta \u2014</option>${optsHaber}</select>
      </div>
      <div class="form-group"><label>Monto HABER (Q) *</label>
        <input id="as_haber" type="number" value="${a.haber||0}" step="0.01" min="0" oninput="previewAsiento()">
      </div>
    </div>
    <div id="as_preview" style="background:var(--bg3);border-radius:6px;padding:10px;font-size:13px;margin-top:4px"></div>
    
  `,async()=>{
    const desc=document.getElementById('as_desc').value.trim();
    const debe=parseFloat(document.getElementById('as_debe').value)||0;
    const haber=parseFloat(document.getElementById('as_haber').value)||0;
    if(!desc||!debe||!haber){toast('Todos los campos son requeridos','red');return;}
    if(Math.abs(debe-haber)>0.01){if(!confirm('\u26A0 Debe \u2260 Haber. El asiento no cuadra. \u00BFGuardar?'))return;}
    const obj={noAsiento:document.getElementById('as_no').value,fecha:document.getElementById('as_fecha').value,
      referencia:document.getElementById('as_ref').value,descripcion:desc,
      cuentaDebe:document.getElementById('as_cdebe').value,debe,
      cuentaHaber:document.getElementById('as_chaber').value,haber,updatedAt:nowTs()};
    if(id){obj.id=id;await dbPut('asientos',obj);}else{obj.createdAt=nowTs();await dbAdd('asientos',obj);}
    closeModal('modalAsiento');toast(id?'Asiento actualizado':'Asiento registrado');
    await navTo('contabilidad');
  });
  setTimeout(previewAsiento,80);
}

function sincronizarAsiento(){previewAsiento();}
function previewAsiento(){
  const debe=parseFloat(document.getElementById('as_debe')?.value)||0;
  const haber=parseFloat(document.getElementById('as_haber')?.value)||0;
  const diff=Math.abs(debe-haber);
  const el=document.getElementById('as_preview');if(!el)return;
  el.innerHTML=`<div style="display:flex;gap:20px;align-items:center">
    <span>Debe: <strong class="text-green">Q ${fmtNum(debe)}</strong></span>
    <span>Haber: <strong class="text-blue">Q ${fmtNum(haber)}</strong></span>
    <span style="color:var(--${diff<0.01?'green':'red'})">${diff<0.01?'\u2713 Cuadrado':'\u26A0 Diferencia: Q '+fmtNum(diff)}</span>
  </div>`;
}

async function generarAsientosDesdeFacturas(){
  if(!soloAdmin())return;
  if(!confirm('\u00BFGenerar asientos autom\u00E1ticos desde las facturas del mes actual?'))return;
  const facturas=await dbGetAll('facturas');
  const asientos=await dbGetAll('asientos');
  const mes=today().slice(0,7);
  let count=0;
  for(const f of facturas.filter(x=>x.fecha&&x.fecha.startsWith(mes))){
    const ref='fac_'+f.id;
    if(asientos.find(a=>a.referencia===ref))continue;
    // Ingreso total a caja
    await dbAdd('asientos',{noAsiento:genId('AS-'),fecha:f.fecha,referencia:ref,
      descripcion:'Venta servicios \u2014 '+f.noFactura+' \u2014 '+f.clienteNombre,
      cuentaDebe:'1101',debe:parseFloat((f.total||0).toFixed(2)),
      cuentaHaber:'4101',haber:parseFloat((f.subtotal||0).toFixed(2)),createdAt:nowTs()});
    // IVA por pagar
    if((f.iva||0)>0){
      await dbAdd('asientos',{noAsiento:genId('AS-'),fecha:f.fecha,referencia:ref+'_iva',
        descripcion:'IVA generado \u2014 '+f.noFactura,
        cuentaDebe:'4101',debe:parseFloat((f.iva||0).toFixed(2)),
        cuentaHaber:'2102',haber:parseFloat((f.iva||0).toFixed(2)),createdAt:nowTs()});
    }
    count++;
  }
  toast(count+' asientos generados');await navTo('contabilidad');
}

async function eliminarAsiento(id){
  if(!soloAdmin())return;
  if(!confirm('\u00BFEliminar este asiento?'))return;
  await dbDelete('asientos',id);await navTo('contabilidad');
}

async function generarBalanceHTML(){return'';}// compatibilidad

/* ================================================================
   SUGERIDOR DE MANTENIMIENTO POR KM Y FABRICANTE
   ================================================================ */
async function _lRowGlobal(l, i) {
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

async
