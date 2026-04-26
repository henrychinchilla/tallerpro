/* TallerPro GT — facturas.js */

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

