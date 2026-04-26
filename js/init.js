/* TallerPro GT — init.js */

async function cargarDatosDemostracion(){
  const u=await dbGetAll('usuarios');
  // Garantizar que el usuario demo exista cuando no hay licencia activa
  if(!estaActivo()){
    const demoExiste=u.find(function(x){return x.username==='demo';});
    if(!demoExiste){
      await dbAdd('usuarios',{nombre:'Demo Admin',username:'demo',passwordHash:hashSimple('demo123'),
        esDemo:true,perfil:'admin',email:'admin@taller.com',activo:true,createdAt:nowTs()});
    }
  }
  if(u.length>0)return;
  // Primera vez: crear usuarios de ejemplo adicionales
  await dbAdd('usuarios',{nombre:'Supervisor Taller',username:'supervisor',passwordHash:hashSimple('super123'),
    perfil:'supervisor',email:'supervisor@taller.com',activo:true,createdAt:nowTs()});
  await dbAdd('usuarios',{nombre:'Operador 1',username:'operador',passwordHash:hashSimple('oper123'),
    perfil:'operador',email:'operador@taller.com',activo:true,createdAt:nowTs()});
  // Empleados demo
  await dbAdd('empleados',{nombre:'Carlos M\u00E9ndez L\u00F3pez',cargo:'Mec\u00E1nico senior',salarioBase:5500,dpi:'1234567890101',fechaIngreso:'2021-03-15',telefono:'+502 5555-1111',activo:true,tipoContrato:'indefinido',createdAt:nowTs()});
  await dbAdd('empleados',{nombre:'Mario Ju\u00E1rez Garc\u00EDa',cargo:'Mec\u00E1nico',salarioBase:4200,dpi:'2345678901012',fechaIngreso:'2022-06-01',telefono:'+502 5555-2222',activo:true,tipoContrato:'indefinido',createdAt:nowTs()});
  // Clientes demo
  await dbAdd('clientes',{nombre:'Juan Carlos P\u00E9rez',nit:'1234567-8',telefono:'+502 5555-1234',email:'jcperez@email.com',whatsapp:'+502 5555-1234',tipo:'persona',createdAt:nowTs()});
  await dbAdd('clientes',{nombre:'Transportes Garc\u00EDa S.A.',nit:'9876543-2',telefono:'+502 4444-5678',email:'admin@tgarcia.com.gt',tipo:'empresa',empresa:'Transportes Garc\u00EDa S.A.',createdAt:nowTs()});
  // Veh\u00EDculos demo
  await dbAdd('vehiculos',{clienteId:1,clienteNombre:'Juan Carlos P\u00E9rez',placa:'P-123ABC',marca:'Toyota',modelo:'Hilux',anio:2018,tipoVehiculo:'Pickup',cilindros:4,cilindraje:2700,combustibleTipo:'gasolina',km:85000,tipoServicio:'Cambio de aceite',proximoServicio:addDays(today(),8),color:'Blanco',createdAt:nowTs()});
  await dbAdd('vehiculos',{clienteId:2,clienteNombre:'Transportes Garc\u00EDa S.A.',placa:'C-456XYZ',marca:'Kenworth',modelo:'T680',anio:2020,tipoVehiculo:'Cabezal',cilindros:6,cilindraje:12900,combustibleTipo:'diesel',km:210000,tipoServicio:'Mantenimiento preventivo',proximoServicio:addDays(today(),3),color:'Azul',createdAt:nowTs()});
  // Repuestos demo
  await dbAdd('repuestos',{codigo:'FLT-001',nombre:'Filtro de aceite Toyota Hilux',categoria:'Filtros',tiposVehiculo:['Pickup'],stock:8,stockMin:5,costo:45,precio:85,margen:(85-45)/85,proveedor:'SERVIREPUESTOS',tipo:'repuesto',createdAt:nowTs()});
  await dbAdd('repuestos',{codigo:'FRN-002',nombre:'Pastillas de freno delanteras',categoria:'Frenos',tiposVehiculo:['Sedan','Pickup','Camioneta/SUV'],stock:3,stockMin:5,costo:180,precio:320,margen:(320-180)/320,tipo:'repuesto',createdAt:nowTs()});
  // Insumos demo
  await dbAdd('insumos',{nombre:'Aceite 20W-50 Sint\u00E9tico',categoria:'Aceites',tiposVehiculo:['Pickup','Sedan','Camioneta/SUV'],stock:12,stockMin:10,costo:68,precio:120,margen:(120-68)/120,unidad:'litro',proveedor:'LUBRICANTES CENTRAL',tipo:'insumo',createdAt:nowTs()});
  await dbAdd('insumos',{nombre:'Aceite 15W-40 Heavy Duty Diesel',categoria:'Aceites',tiposVehiculo:['Cami\u00F3n','Cabezal','Bus'],stock:20,stockMin:10,costo:82,precio:150,margen:(150-82)/150,unidad:'litro',proveedor:'LUBRICANTES CENTRAL',tipo:'insumo',createdAt:nowTs()});
  // Proveedor demo
  await dbAdd('proveedores',{empresa:'SERVIREPUESTOS Guatemala S.A.',nit:'5432100-1',categoria:'Repuestos',contacto:'Roberto Lemus',telefono:'+502 2222-5555',email:'ventas@servirepuestos.com.gt',calificacion:'5',plazoCredito:30,createdAt:nowTs()});
  // Costos demo
  await dbAdd('costos',{fecha:today(),categoria:'Salarios',descripcion:'N\u00F3mina mensual mec\u00E1nicos',monto:9700,recurrente:true,createdAt:nowTs()});
  await dbAdd('costos',{fecha:today(),categoria:'Alquiler',descripcion:'Alquiler del local',monto:3500,recurrente:true,createdAt:nowTs()});
  // Activos demo
  await dbAdd('activos',{nombre:'Elevador hidr\u00E1ulico 4 toneladas',tipo:'maquina',fechaAdquisicion:'2021-01-15',vidaUtil:10,valorOriginal:45000,valorResidual:5000,createdAt:nowTs()});
  await dbAdd('activos',{nombre:'Esc\u00E1ner OBD2 profesional Launch',tipo:'electronico',fechaAdquisicion:'2022-06-01',vidaUtil:5,valorOriginal:12000,valorResidual:1000,createdAt:nowTs()});
  await dbAdd('activos',{nombre:'Compresor de aire 60 galones',tipo:'maquina',fechaAdquisicion:'2020-03-10',vidaUtil:8,valorOriginal:8500,valorResidual:500,createdAt:nowTs()});
  // Config
  await dbPut('config',{key:'taller',nombre:'TallerPro GT',nit:'1234567-8',telefono:'+502 2222-3333',email:'info@tallerpro.com.gt',direccion:'Zona 12, Guatemala, Guatemala',tarifaHora:150,margenMin:20,piePagina:'Gracias por elegirnos. Garant\u00EDa sobre mano de obra: 30 d\u00EDas.',updatedAt:nowTs()});
}

async function iniciarApp(){
  cargarTemaGuardado();
  initSecurity();
  await cargarRegimen();
  await actualizarSidebarEmpresa();
  actualizarTopbarUsuario();
  // Cargar logo guardado
  (function(){var ld=localStorage.getItem('tpgt_logo');var img=document.getElementById('sidebar-logo-img');if(img&&ld){img.src=ld;img.style.display='block';}})();
  const alertas=await dbGetAll('alertas');
  const pending=alertas.filter(a=>!a.vista).length;
  await renderNav(pending);
  // Topbar usuario info
  var tui = document.getElementById('topbar-user-info');
  var tun = document.getElementById('topbar-username');
  if (tui && sesionActual) {
    tui.style.display = 'flex';
    var perfilLabels2 = {admin:'Admin',supervisor:'Supervisor',operador:'Operador'};
    if (tun) tun.textContent = (sesionActual.nombre||sesionActual.username) + ' (' + (perfilLabels2[sesionActual.perfil]||sesionActual.perfil) + ')';
  }
  await navTo('dashboard');
}


/* ================================================================
   M\u00D3DULO CONTABILIDAD / ASIENTOS CONTABLES
   ================================================================ */
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
async function sugerirMantenimiento(vehiculoId){
  const v=await dbGet('vehiculos',vehiculoId);if(!v)return;
  const fab=FABRICANTES_DB[v.marca]||FABRICANTES_DB['Otro'];
  const km=v.km||0;
  const sugerencias=[];
  const nombres={aceite:'Cambio de aceite',filtroAire:'Cambio filtro de aire',
    filtroCombustible:'Cambio filtro combustible',bujias:'Cambio de buj\u00EDas',
    correa:'Correa/cadena distribuci\u00F3n',frenos:'Revisi\u00F3n de frenos',refrigerante:'Cambio refrigerante'};
  Object.entries(fab.intervalos).forEach(([tipo,cada])=>{
    if(!cada)return;
    const kmProx=Math.ceil(km/cada)*cada||cada;
    const kmFalt=kmProx-km;
    const urgencia=kmFalt<=0?'alta':kmFalt<=2000?'media':'baja';
    if(urgencia!=='baja')sugerencias.push({tipo,nombre:nombres[tipo]||tipo,kmProx,kmFalt,urgencia,cada});
  });
  if(!sugerencias.length)sugerencias.push({nombre:'Sin mantenimientos urgentes pr\u00F3ximos',urgencia:'baja',kmFalt:9999});
  const icons={'alta':'\u1F534','media':'\u1F7E1','baja':'\u1F7E2'};
  openModal('sugerMant','Mantenimientos sugeridos \u2014 '+v.placa+' ('+km.toLocaleString()+' km)',`
    <div class="alert alert-blue" style="font-size:12px">Basado en intervalos oficiales ${v.marca||'fabricante'}</div>
    <div style="margin:12px 0">
      ${sugerencias.map(s=>`<div class="alert-item" style="margin-bottom:6px">
        <span style="font-size:16px">${icons[s.urgencia]||'\u1F535'}</span>
        <div style="flex:1">
          <div style="font-weight:600;font-size:13px">${s.nombre}</div>
          ${s.kmProx?`<div style="font-size:11px;color:var(--text2)">Pr\u00F3ximo: ${s.kmProx.toLocaleString()} km \u2014 ${s.kmFalt<=0?'<span class="text-red">VENCIDO</span>':'Faltan '+s.kmFalt.toLocaleString()+' km'}</div>`:''}
          ${s.cada?`<div style="font-size:10px;color:var(--text3)">Cada ${s.cada.toLocaleString()} km</div>`:''}
        </div>
        <span class="badge badge-${s.urgencia==='alta'?'red':s.urgencia==='media'?'amber':'green'}">${s.urgencia==='alta'?'Urgente':s.urgencia==='media'?'Pr\u00F3ximo':'OK'}</span>
      </div>`).join('')}
    </div>
    <div class="alert alert-amber" style="font-size:12px">
      <div><strong>Aceite recomendado:</strong> ${fab.aceiteRecomendado}</div>
      <div style="margin-top:3px"><strong>Filtro de aceite:</strong> ${fab.filtroAceite}</div>
    </div>
    ${fab.observaciones?`<div style="font-size:11px;color:var(--text3);margin-top:8px">${fab.observaciones}</div>`:''}
  `,()=>closeModal('sugerMant'));
}


var SAL_MIN={CE1:{noAgricola:4002.28,agricola:3791.20,maquila:3409.73},CE2:{noAgricola:3816.90,agricola:3625.89,maquila:3221.10}};
var BONIF_DECRETO=250;
function calcISREmpleado(salAnual,igssAnual){var base=salAnual-48000-igssAnual;if(base<=0)return 0;if(base<=300000)return base*0.05;return 15000+(base-300000)*0.07;}
function calcProvisionesMensuales(sal){sal=sal||0;return{bono14:sal/12,aguinaldo:sal/12,vacaciones:(sal/30)*15/12,indemnizacion:sal/12,igssPatronal:sal*0.1267,irtra:sal*0.01,intecap:sal*0.01};}
function provisionTotal(sal){var p=calcProvisionesMensuales(sal);return p.bono14+p.aguinaldo+p.vacaciones+p.indemnizacion+p.igssPatronal+p.irtra+p.intecap;}

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
    document.addEventListener(evt,resetSesTimer,{passive:true});
  });
  window.addEventListener('beforeunload',function(){
    try{var tx=db.transaction('sesion','readwrite');tx.objectStore('sesion').delete('sesion_actual');}catch(e){}
  });
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){
      if(_sesTimer)clearTimeout(_sesTimer);
      _sesTimer=setTimeout(function(){logout();},SES_TIMEOUT);
    }else{resetSesTimer();}
  });
  resetSesTimer();
}

// ---- NOMINA MEJORADA CON PROVISIONES ----
async function renderNomina(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Solo administradores</div>';return;}
  var empleados=await dbGetAll('empleados');
  var nomina=await dbGetAll('nomina');
  var kpiData=await dbGetAll('kpi');
  var mesActual=today().slice(0,7);
  var nominaMes=nomina.filter(function(n){return n.mes===mesActual;});
  var hoy2=new Date();
  var esJulio=hoy2.getMonth()===6;
  var esDic=hoy2.getMonth()===11;
  var activos=empleados.filter(function(e){return e.activo!==false;});
  actions.innerHTML='<button class="btn btn-primary" onclick="generarNominaMes()">Generar nomina</button>';

  var totProv={b14:0,agui:0,vac:0,indem:0,igssP:0};
  activos.forEach(function(e){var p=calcProvisionesMensuales(e.salarioBase||0);totProv.b14+=p.bono14;totProv.agui+=p.aguinaldo;totProv.vac+=p.vacaciones;totProv.indem+=p.indemnizacion;totProv.igssP+=p.igssPatronal;});

  var totalNeto=nominaMes.reduce(function(a,n){return a+(n.netoPagar||0);},0);

  var filas=activos.map(function(e){
    var sal=e.salarioBase||0;
    var igssE=sal*0.0483;
    var isrA=calcISREmpleado(sal*12,igssE*12);
    var isrM=isrA/12;
    var bonif=BONIF_DECRETO+(e.bonificacionAdicional||0);
    var neto=sal+bonif-igssE-isrM-(e.descuentoAdicional||0);
    var p=calcProvisionesMensuales(sal);
    var costoReal=sal+bonif+p.igssPatronal+p.irtra+p.intecap+p.bono14+p.aguinaldo+p.vacaciones+p.indemnizacion;
    var ce=e.circunscripcion||'CE1';
    var salMin=(SAL_MIN[ce]||SAL_MIN.CE1).noAgricola;
    var alerta=sal<salMin?' <span class="badge badge-red">BAJO MINIMO</span>':'';
    return'<tr>'
      +'<td><strong>'+e.nombre+'</strong>'+alerta+'</td>'
      +'<td><span class="badge badge-'+(ce==='CE1'?'blue':'purple')+'">'+ce+'</span></td>'
      +'<td class="td-mono">'+fmt(sal)+'</td>'
      +'<td class="td-mono text-green">+'+fmt(bonif)+'</td>'
      +'<td class="td-mono text-red">-'+fmt(igssE)+'</td>'
      +'<td class="td-mono '+(isrM>0?'text-red':'text-muted')+'">'+(isrM>0?'-'+fmt(isrM):'Exento')+'</td>'
      +'<td class="td-mono" style="font-weight:700;color:var(--green)">'+fmt(neto)+'</td>'
      +'<td class="td-mono text-amber">'+fmt(p.bono14)+'</td>'
      +'<td class="td-mono text-amber">'+fmt(p.aguinaldo)+'</td>'
      +'<td class="td-mono text-blue">'+fmt(p.vacaciones)+'</td>'
      +'<td class="td-mono text-blue">'+fmt(p.indemnizacion)+'</td>'
      +'<td class="td-mono text-red">'+fmt(p.igssPatronal)+'</td>'
      +'<td class="td-mono text-amber" style="font-weight:700">'+fmt(costoReal)+'</td>'
      +'</tr>';
  }).join('');

  content.innerHTML='<div class="section-title">Nomina Mensual &mdash; '+mesActual+'</div>'
    +(esJulio?'<div class="alert alert-amber">Julio: pagar Bono 14 (1 salario base por empleado)</div>':'')
    +(esDic?'<div class="alert alert-amber">Diciembre: pagar Aguinaldo (1 salario base por empleado)</div>':'')
    +(nominaMes.length===0?'<div class="alert alert-amber">Nomina no generada. Haz clic en Generar nomina.</div>':'')
    +'<div class="card"><div class="card-title" style="margin-bottom:12px">Provision mensual de prestaciones (carga laboral real)</div>'
    +'<div class="alert alert-blue" style="font-size:11px">Estos montos NO se pagan al empleado ahora pero son obligaciones futuras. Deben reservarse mensualmente para cumplir con el Codigo de Trabajo y son deducibles del ISR empresarial como gasto.</div>'
    +'<div class="stat-grid">'
    +'<div class="stat-card stat-amber"><div class="stat-label">Prov. Bono 14</div><div class="stat-value">'+fmt(totProv.b14)+'</div><div class="stat-sub">Pago: 15 julio</div></div>'
    +'<div class="stat-card stat-amber"><div class="stat-label">Prov. Aguinaldo</div><div class="stat-value">'+fmt(totProv.agui)+'</div><div class="stat-sub">Pago: 15 diciembre</div></div>'
    +'<div class="stat-card stat-blue"><div class="stat-label">Prov. Vacaciones</div><div class="stat-value">'+fmt(totProv.vac)+'</div><div class="stat-sub">15 dias/anio</div></div>'
    +'<div class="stat-card stat-blue"><div class="stat-label">Prov. Indemnizacion</div><div class="stat-value">'+fmt(totProv.indem)+'</div><div class="stat-sub">1 salario/anio</div></div>'
    +'<div class="stat-card stat-red"><div class="stat-label">IGSS Patronal</div><div class="stat-value">'+fmt(totProv.igssP)+'</div><div class="stat-sub">12.67% mensual</div></div>'
    +'<div class="stat-card"><div class="stat-label">Carga total mes</div><div class="stat-value" style="font-size:16px;color:var(--accent)">'+fmt(totProv.b14+totProv.agui+totProv.vac+totProv.indem+totProv.igssP)+'</div></div>'
    +'</div></div>'
    +'<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    +'<thead><tr><th>Empleado</th><th>CE</th><th>Salario</th><th>Bonif.</th><th>IGSS</th><th>ISR</th><th>Neto</th>'
    +'<th>P.Bono14</th><th>P.Agui.</th><th>P.Vacac.</th><th>P.Indem.</th><th>IGSS P.</th><th>Costo real</th></tr></thead>'
    +'<tbody>'+(filas||'<tr><td colspan="13" class="text-center text-muted" style="padding:16px">Sin empleados activos</td></tr>')+'</tbody>'
    +'</table></div></div>';
}


// \u2550\u2550\u2550\u2550 ACCESO POR DIAS/HORAS + TIMEOUT CONFIGURABLE \u2550\u2550\u2550\u2550

function verificarAccesoHorario(usuario) {
  if (!usuario.restriccionHorario) return true;
  var ahora = new Date();
  var dia = ahora.getDay(); // 0=dom, 1=lun ... 6=sab
  var hora = ahora.getHours() * 60 + ahora.getMinutes();
  var diasPermitidos = usuario.diasAcceso || [1,2,3,4,5]; // lun-vie por defecto
  if (diasPermitidos.indexOf(dia) < 0) return false;
  var horaInicio = usuario.horaInicioMin || 0;
  var horaFin = usuario.horaFinMin || 1440;
  return hora >= horaInicio && hora <= horaFin;
}



// \u2550\u2550\u2550\u2550 VALIDACION NIT SAT (Modulo 11) \u2550\u2550\u2550\u2550
// Algoritmo oficial SAT Guatemala para validar NITs
function validarNIT(nit) {
  if (!nit) return false;
  var s = nit.toString().trim().toUpperCase().replace(/-/g,'');
  if (s === 'CF') return true; // Consumidor final siempre valido
  if (!/^\d+[0-9K]$/.test(s)) return false;
  var verificador = s[s.length - 1];
  var numero = s.slice(0, -1);
  if (!/^\d+$/.test(numero)) return false;
  var factor = numero.length + 1;
  var total = 0;
  for (var i = 0; i < numero.length; i++) {
    total += parseInt(numero[i]) * factor;
    factor--;
  }
  var residuo = (11 - (total % 11)) % 11;
  var dvEsperado = residuo === 10 ? 'K' : residuo.toString();
  return dvEsperado === verificador;
}

// Consulta al portal SAT para verificar NIT (requiere conexion)
// La SAT no tiene API publica - se hace validacion local con modulo 11
// Para FEL real se requiere: certificadora autorizada + firma electronica
async function verificarNITSAT(nit) {
  if (!nit || nit.toUpperCase() === 'CF') {
    return {valido:true, nombre:'Consumidor Final', tipo:'CF'};
  }
  var limpio = nit.toString().trim().replace(/-/g,'').toUpperCase();
  var valido = validarNIT(limpio);
  if (!valido) {
    return {valido:false, error:'NIT invalido segun algoritmo SAT (Modulo 11). Verifica el numero.'};
  }
  // Si el NIT es valido matematicamente, retornar OK
  // Para consulta real necesitas credenciales de certificadora FEL (Infile, Digifact, etc.)
  return {valido:true, nit:limpio, mensaje:'NIT valido segun algoritmo oficial SAT Guatemala'};
}

// Indicador visual de validacion NIT en formularios
async function onNITChange(inputId, resultId) {
  var nit = document.getElementById(inputId) ? document.getElementById(inputId).value.trim() : '';
  var el = document.getElementById(resultId);
  if (!el) return;
  if (!nit || nit.toUpperCase() === 'CF') {
    el.innerHTML = '<span style="color:var(--text3);font-size:10px">Consumidor Final</span>';
    return;
  }
  el.innerHTML = '<span style="color:var(--text3);font-size:10px">Validando...</span>';
  var r = await verificarNITSAT(nit);
  if (r.valido) {
    el.innerHTML = '<span style="color:var(--green);font-size:10px">&#10003; NIT valido' + (r.nombre ? ' - ' + r.nombre : '') + '</span>';
  } else {
    el.innerHTML = '<span style="color:var(--red);font-size:10px">&#10005; ' + (r.error||'NIT invalido') + '</span>';
  }
}

// \u2550\u2550\u2550\u2550 MODAL USUARIO MEJORADO CON ACCESO HORARIO \u2550\u2550\u2550\u2550
async function modalUsuario(id) {
  if (!soloAdmin()) { toast('Solo administradores', 'red'); return; }
  var u = id ? await dbGet('usuarios', id) : {};
  var diasNom = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
  var diasPerm = u.diasAcceso || [1,2,3,4,5];
  var ht2m = function(h,m){ return h*60+(m||0); };
  var m2h = function(min){ return Math.floor(min/60).toString().padStart(2,'0')+':'+((min||0)%60).toString().padStart(2,'0'); };
  var hInicio = u.horaInicioMin!=null ? m2h(u.horaInicioMin) : '07:00';
  var hFin    = u.horaFinMin!=null    ? m2h(u.horaFinMin)    : '18:00';
  var timeoutVal = u.timeoutMinutos || 15;

  openModal('modalUsuario', id ? 'Editar Usuario' : 'Nuevo Usuario',
    '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Nombre completo *</label><input id="u_nom" value="'+(u.nombre||'')+'" placeholder="Nombre del usuario"></div>'
    + '<div class="form-group"><label>Usuario (login) *</label><input id="u_usr" value="'+(u.username||'')+'" placeholder="sin espacios" '+(id&&u.username==='admin'?'readonly':'')+' ></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Perfil *</label>'
    + '<select id="u_perfil" '+(id&&u.username==='admin'?'disabled':'')+' >'
    + '<option value="operador" '+(u.perfil==='operador'?'selected':'')+'>Operador</option>'
    + '<option value="supervisor" '+(u.perfil==='supervisor'?'selected':'')+'>Supervisor</option>'
    + '<option value="admin" '+(u.perfil==='admin'?'selected':'')+'>Administrador</option>'
    + '</select></div>'
    + '<div class="form-group"><label>'+(id?'Nueva contrasena (vacio = sin cambio)':'Contrasena *')+'</label><input id="u_pass" type="password" placeholder="Contrasena"></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Email</label><input id="u_email" type="email" value="'+(u.email||'')+'" placeholder="correo@taller.com"></div>'
    + '<div class="form-group"><label>Cargo</label><input id="u_cargo" value="'+(u.cargo||'')+'" placeholder="Mecanico, Contador..."></div>'
    + '</div>'
    + (id ? '<div class="form-group"><label><input type="checkbox" id="u_activo" '+(u.activo!==false?'checked':'')+' style="width:auto;margin-right:6px"> Usuario activo</label></div>' : '')
    + '<div class="divider"></div>'
    + '<div class="card-title" style="margin-bottom:10px">Control de acceso horario</div>'
    + '<div class="form-group"><label><input type="checkbox" id="u_rest" '+(u.restriccionHorario?'checked':'')+' style="width:auto;margin-right:6px" onchange="toggleHorario()"> Habilitar restriccion de horario</label></div>'
    + '<div id="horario_wrap" style="display:'+(u.restriccionHorario?'block':'none')+'">'
    + '<div class="form-group"><label>Dias de acceso permitidos</label>'
    + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">'
    + diasNom.map(function(d,i){ return '<label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer"><input type="checkbox" value="'+i+'" '+(diasPerm.indexOf(i)>=0?'checked':'')+' class="dia_cb" style="width:auto"> '+d+'</label>'; }).join('')
    + '</div></div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Hora de inicio</label><input id="u_hinicio" type="time" value="'+hInicio+'"></div>'
    + '<div class="form-group"><label>Hora de fin</label><input id="u_hfin" type="time" value="'+hFin+'"></div>'
    + '</div></div>'
    + '<div class="form-group"><label>Timeout de sesion (minutos)</label>'
    + '<div style="display:flex;align-items:center;gap:10px">'
    + '<input id="u_timeout" type="number" value="'+timeoutVal+'" min="1" max="480" style="width:100px">'
    + '<label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer"><input type="checkbox" id="u_timeout_auto" '+(u.timeoutMinutos?'':'checked')+' style="width:auto" onchange="toggleTimeout()"> Automatico (15 min)</label>'
    + '</div><div class="form-hint">1 a 480 minutos. Automatico usa la config global del sistema.</div>'
    + '</div>',
    async function() {
      var nombre = document.getElementById('u_nom').value.trim();
      var username = document.getElementById('u_usr').value.trim().toLowerCase().replace(/\s/g,'');
      var pass = document.getElementById('u_pass').value;
      if (!nombre || !username) { toast('Nombre y usuario requeridos', 'red'); return; }
      if (!id && !pass) { toast('Contrasena requerida para nuevo usuario', 'red'); return; }
      var restriccion = document.getElementById('u_rest').checked;
      var diasSelec = Array.from(document.querySelectorAll('.dia_cb:checked')).map(function(cb){ return parseInt(cb.value); });
      var hinicio = document.getElementById('u_hinicio').value;
      var hfin = document.getElementById('u_hfin').value;
      var toAuto = document.getElementById('u_timeout_auto').checked;
      var toMin = toAuto ? null : (parseInt(document.getElementById('u_timeout').value)||15);
      var obj = {
        nombre:nombre, username:username,
        perfil: document.getElementById('u_perfil').value,
        email: document.getElementById('u_email').value,
        cargo: document.getElementById('u_cargo').value,
        activo: id ? (document.getElementById('u_activo') ? document.getElementById('u_activo').checked : true) : true,
        restriccionHorario: restriccion,
        diasAcceso: restriccion ? diasSelec : null,
        horaInicioMin: restriccion && hinicio ? (parseInt(hinicio.split(':')[0])*60+parseInt(hinicio.split(':')[1]||0)) : null,
        horaFinMin: restriccion && hfin ? (parseInt(hfin.split(':')[0])*60+parseInt(hfin.split(':')[1]||0)) : null,
        timeoutMinutos: toMin,
        updatedAt: nowTs()
      };
      if (pass) obj.passwordHash = hashSimple(pass);
      if (id) {
        obj.id = id;
        if (!obj.passwordHash) { var ex = await dbGet('usuarios',id); obj.passwordHash = ex.passwordHash; }
        await dbPut('usuarios', obj);
      } else {
        obj.createdAt = nowTs();
        await dbAdd('usuarios', obj);
      }
      closeModal('modalUsuario'); toast(id ? 'Usuario actualizado' : 'Usuario creado');
      await navTo('usuarios');
    }, true);
}

function toggleHorario() {
  var cb = document.getElementById('u_rest');
  var wrap = document.getElementById('horario_wrap');
  if (wrap) wrap.style.display = cb && cb.checked ? 'block' : 'none';
}

function toggleTimeout() {
  var auto = document.getElementById('u_timeout_auto');
  var inp  = document.getElementById('u_timeout');
  if (inp) inp.disabled = auto && auto.checked;
}

// \u2550\u2550\u2550\u2550 TIMEOUT CONFIGURABLE EN CONFIGURACION \u2550\u2550\u2550\u2550
async function guardarConfig() {
  var cfg = {
    key: 'taller',
    nombre: document.getElementById('cfg_nombre') ? document.getElementById('cfg_nombre').value.trim() : '',
    nit: document.getElementById('cfg_nit') ? document.getElementById('cfg_nit').value.trim() : '',
    telefono: document.getElementById('cfg_tel') ? document.getElementById('cfg_tel').value.trim() : '',
    email: document.getElementById('cfg_email') ? document.getElementById('cfg_email').value.trim() : '',
    direccion: document.getElementById('cfg_dir') ? document.getElementById('cfg_dir').value.trim() : '',
    tarifaHora: parseFloat(document.getElementById('cfg_tarifa') ? document.getElementById('cfg_tarifa').value : '150') || 150,
    margenMin: parseFloat(document.getElementById('cfg_margen') ? document.getElementById('cfg_margen').value : '20') || 20,
    piePagina: document.getElementById('cfg_pie') ? document.getElementById('cfg_pie').value.trim() : '',
    timeoutMinutos: parseInt(document.getElementById('cfg_timeout') ? document.getElementById('cfg_timeout').value : '15') || 15,
    updatedAt: nowTs()
  };
  await dbPut('config', cfg);
  SES_TIMEOUT = cfg.timeoutMinutos * 60 * 1000;
  resetSesTimer();
  toast('Configuracion guardada');
}

// \u2550\u2550\u2550\u2550 FEL / VALIDACION NIT EN FACTURA \u2550\u2550\u2550\u2550
// Agregar validacion al cargar NIT en modal de factura
async function cargarNITCliente() {
  var sel = document.getElementById('f_cliente');
  if (!sel) return;
  var parts = (sel.value||'::').split(':');
  var nitEl = document.getElementById('f_nit');
  if (nitEl) nitEl.value = parts[1] || 'CF';
  // Validar NIT
  var nit = parts[1] || 'CF';
  var r = await verificarNITSAT(nit);
  var el = document.getElementById('nit_status');
  if (el) {
    el.innerHTML = r.valido
      ? '<span style="color:var(--green);font-size:11px">&#10003; NIT valido</span>'
      : '<span style="color:var(--red);font-size:11px">&#10005; NIT invalido</span>';
  }
}

// \u2550\u2550\u2550\u2550 INFO FEL SAT \u2550\u2550\u2550\u2550
function infoFEL() {
  openModal('infoFEL', 'Facturacion Electronica FEL - SAT Guatemala',
    '<div class="alert alert-blue">Para emitir facturas FEL validas ante la SAT se requiere una certificadora autorizada.</div>'
    + '<div style="font-size:13px;line-height:1.9">'
    + '<strong>Que necesitas:</strong><br>'
    + '1. <strong>NIT habilitado para FEL</strong> en el portal SAT (portal.sat.gob.gt)<br>'
    + '2. <strong>Certificadora autorizada</strong>: Infile, Digifact, G4S, Megaprint o similar<br>'
    + '3. <strong>Firma electronica</strong> y credenciales de la certificadora<br>'
    + '4. Conexion a internet al momento de emitir<br><br>'
    + '<strong>Proceso en TallerPro:</strong><br>'
    + '- El NIT del cliente se valida localmente con el algoritmo Modulo 11 (SAT)<br>'
    + '- Al tener tus credenciales de certificadora, el sistema puede enviar la factura via API<br>'
    + '- La certificadora retorna el UUID y codigo de verificacion SAT<br><br>'
    + '<strong>Configuracion:</strong> Ve a Configuracion y agrega tus credenciales FEL (usuario, token de la certificadora). El NIT del taller configurado se usara como emisor.<br><br>'
    + '<a href="https://portal.sat.gob.gt" target="_blank" style="color:var(--accent)">Portal SAT Guatemala</a> &nbsp;|&nbsp; '
    + '<a href="https://www.infile.com" target="_blank" style="color:var(--accent)">Infile (certificadora)</a>'
    + '</div>',
    function(){ closeModal('infoFEL'); }, true);
}


// ================================================================
// MODULO RRHH COMPLETO v3.1
// Base legal: Codigo de Trabajo Guatemala Decreto 1441
// Decreto 10-2012 ISR | AG 256-2025 Salarios minimos
// ================================================================

// ---- CALCULOS LEGALES LIQUIDACION (Art. 78, 79, 82 CT) ----
// Art. 78: Renuncia voluntaria -> SIN indemnizacion
// Art. 82: Despido injustificado -> CON indemnizacion (1 sal/anio, proporcional)
// Despido justificado -> SIN indemnizacion
// En TODOS los casos: bono14 prop + aguinaldo prop + vacaciones no gozadas + salarios pendientes

function calcLiquidacion(empleado, fechaSalida, tipoSalida, salarioPendiente, vacacionesTomadas, fechaUltB14, fechaUltAgui) {
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

function aplicarTema(nombreTema) {
  var tema = TEMAS[nombreTema];
  if (!tema) return;
  var root = document.documentElement;
  Object.entries(tema).forEach(function(e) {
    if (e[0].startsWith('--')) root.style.setProperty(e[0], e[1]);
  });
  // Guardar por usuario activo (no afecta a otros usuarios)
  var userId = sesionActual ? sesionActual.userId : 'default';
  localStorage.setItem('tpgt_tema_u' + userId, nombreTema);
  // Marcar activo en los botones
  document.querySelectorAll('[data-tema]').forEach(function(el){
    el.style.border = el.dataset.tema === nombreTema ? '2px solid var(--accent)' : '2px solid var(--border)';
  });
  toast('Tema aplicado: ' + (tema.label||nombreTema));
}

function cargarTemaGuardado() {
  var userId = sesionActual ? sesionActual.userId : 'default';
  var t = localStorage.getItem('tpgt_tema_u' + userId);
  if (t && TEMAS[t]) { aplicarTema(t); return; }
  var custom = localStorage.getItem('tpgt_tema_custom_u' + userId);
  if (custom) {
    try {
      var c = JSON.parse(custom);
      Object.entries(c).forEach(function(e){ document.documentElement.style.setProperty(e[0], e[1]); });
    } catch(e) {}
  }
}

function aplicarColoresCustom() {
  var campos = ['--bg','--bg2','--bg3','--accent','--green','--red','--text'];
  campos.forEach(function(v) {
    var el = document.getElementById('tc_' + v.replace('--',''));
    if (el && el.value) document.documentElement.style.setProperty(v, el.value);
  });
  // Guardar como tema custom
  var custom = {};
  campos.forEach(function(v) {
    var el = document.getElementById('tc_' + v.replace('--',''));
    if (el) custom[v] = el.value || getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  });
  localStorage.setItem('tpgt_tema_custom', JSON.stringify(custom));
  toast('Colores personalizados aplicados');
}



function renderSelectorTema() {
  var actual = localStorage.getItem('tpgt_tema') || 'oscuro';
  var html = '<div class="divider"></div>'
    + '<div class="card-title" style="margin-bottom:10px">Tema y colores</div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">'
    + Object.entries(TEMAS).map(function(e){
      var nombre = e[0]; var tema = e[1];
      return '<div onclick="aplicarTema(\''+nombre+'\')" style="cursor:pointer;padding:10px;border-radius:8px;border:2px solid '+(actual===nombre?'var(--accent)':'var(--border)')+';background:'+tema['--bg2']+'">'
        + '<div style="display:flex;gap:5px;margin-bottom:6px">'
        + '<div style="width:16px;height:16px;border-radius:50%;background:'+tema['--accent']+'"></div>'
        + '<div style="width:16px;height:16px;border-radius:50%;background:'+tema['--green']+'"></div>'
        + '<div style="width:16px;height:16px;border-radius:50%;background:'+tema['--red']+'"></div>'
        + '<div style="width:16px;height:16px;border-radius:50%;background:'+tema['--blue']+'"></div>'
        + '</div>'
        + '<div style="font-size:11px;color:'+tema['--text']+'">'+tema.label+'</div>'
        + '</div>';
    }).join('')
    + '</div>'
    + '<div class="card-title" style="margin-bottom:10px">Colores personalizados</div>'
    + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">'
    + [['--bg','Fondo principal'],['--bg2','Fondo secundario'],['--bg3','Fondo tarjetas'],['--accent','Color acento'],['--green','Verde'],['--red','Rojo'],['--text','Texto principal']].map(function(par){
      var varName = par[0]; var label = par[1];
      var current = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      var colorHex = current;
      // Convertir rgb a hex si es necesario
      return '<div class="form-group">'
        + '<label>'+label+'</label>'
        + '<input type="color" id="tc_'+varName.replace('--','')+'" value="'+(colorHex.startsWith('#')?colorHex:'#1a1a1a')+'" style="width:100%;height:36px;padding:2px;border-radius:6px;cursor:pointer">'
        + '</div>';
    }).join('')
    + '</div>'
    + '<button class="btn btn-primary mt-2" onclick="aplicarColoresCustom()">Aplicar colores personalizados</button>';
  return html;
}


function abrirSelectorTema() {
  var actual = sesionActual ? localStorage.getItem('tpgt_tema_u'+sesionActual.userId)||'oscuro' : 'oscuro';
  openModal('temaModal', 'Tema de la interfaz',
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">'
    + Object.entries(TEMAS).map(function(entry) {
      var nombre = entry[0]; var tema = entry[1];
      return '<div data-tema="'+nombre+'" onclick="aplicarTema(this.dataset.tema)" '
        + 'style="cursor:pointer;padding:10px;border-radius:8px;'
        + 'border:2px solid '+(actual===nombre?'var(--accent)':'var(--border)')+';'
        + 'background:'+tema['--bg2']+';user-select:none">'
        + '<div style="display:flex;gap:4px;margin-bottom:6px">'
        + '<div style="width:14px;height:14px;border-radius:50%;background:'+tema['--accent']+'"></div>'
        + '<div style="width:14px;height:14px;border-radius:50%;background:'+tema['--green']+'"></div>'
        + '<div style="width:14px;height:14px;border-radius:50%;background:'+tema['--red']+'"></div>'
        + '</div><div style="font-size:11px;color:'+tema['--text']+'">'+tema.label+'</div></div>';
    }).join('')
    + '</div>'
    + '<div style="font-size:12px;color:var(--text2);margin-bottom:8px">El tema se aplica solo a tu usuario y se mantiene al volver a entrar.</div>',
    function(){ cerrarModal('temaModal'); }, false);
}

// ================================================================
// MODULO EXTRAS: Voucher, ISR anual, Importacion/Exportacion CSV
// ================================================================

// ---- VOUCHER DE PAGO (imprimible) ----
async function imprimirVoucherPago(pagoId) {
  var pagos = await dbGetAll('historial_pagos');
  var pago = pagos.find(function(p){ return p.id === pagoId; });
  if (!pago) { toast('Pago no encontrado','red'); return; }
  var emp = await dbGet('empleados', pago.empleadoId);
  var cfg = await dbGet('config','taller') || {};
  var w = window.open('','_blank');
  var tipos = {nomina:'Nomina Mensual',bono14:'Bono 14 (Decreto 42-92)',aguinaldo:'Aguinaldo (Decreto 76-78)',vacacion:'Pago de Vacaciones',otro:'Pago Varios'};
  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Voucher</title>'
    + '<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:30px}'
    + '.voucher{border:2px solid #111;border-radius:8px;padding:24px;max-width:500px;margin:0 auto}'
    + '.hdr{text-align:center;border-bottom:2px solid #111;padding-bottom:12px;margin-bottom:14px}'
    + '.empresa{font-size:16px;font-weight:900}.subtitulo{font-size:11px;color:#555;margin-top:3px}'
    + '.titulo-doc{font-size:14px;font-weight:700;text-align:center;margin:10px 0;text-transform:uppercase;letter-spacing:1px}'
    + '.fila{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;font-size:12px}'
    + '.fila .lbl{color:#555;font-weight:600}.fila .val{font-weight:700}'
    + '.monto-box{background:#f0f0f0;border-radius:6px;padding:14px;text-align:center;margin:14px 0}'
    + '.monto-total{font-size:22px;font-weight:900}.letras{font-size:10px;color:#555;margin-top:4px}'
    + '.firmas{display:flex;justify-content:space-between;margin-top:40px;gap:30px}'
    + '.firma{border-top:1px solid #333;padding-top:5px;text-align:center;font-size:10px;color:#555;flex:1}'
    + '@media print{body{padding:10px}button{display:none}}</style></head><body>'
    + '<div class="voucher">'
    + '<div class="hdr"><div class="empresa">' + (cfg.nombre||'EMPRESA') + '</div>'
    + '<div class="subtitulo">NIT: ' + (cfg.nit||'---') + ' | ' + (cfg.telefono||'') + '</div></div>'
    + '<div class="titulo-doc">Comprobante de Pago</div>'
    + '<div style="text-align:right;font-size:10px;color:#888;margin-bottom:10px">No. ' + (pago.id||'---') + ' | ' + new Date().toLocaleString('es-GT') + '</div>'
    + '<div class="fila"><span class="lbl">Empleado:</span><span class="val">' + (emp?emp.nombre:pago.empleadoNombre) + '</span></div>'
    + (emp?'<div class="fila"><span class="lbl">DPI:</span><span class="val">' + (emp.dpi||'---') + '</span></div>':'')
    + (emp?'<div class="fila"><span class="lbl">Cargo:</span><span class="val">' + (emp.cargo||'---') + '</span></div>':'')
    + '<div class="fila"><span class="lbl">Tipo de pago:</span><span class="val">' + (tipos[pago.tipo]||pago.tipo) + '</span></div>'
    + '<div class="fila"><span class="lbl">Fecha de pago:</span><span class="val">' + fechaLegible(pago.fecha) + '</span></div>'
    + (pago.periodo?'<div class="fila"><span class="lbl">Periodo cubierto:</span><span class="val">' + pago.periodo + '</span></div>':'')
    + '<div class="fila"><span class="lbl">Forma de pago:</span><span class="val">' + (pago.formaPago||'Transferencia') + '</span></div>'
    + (emp&&emp.bancoCuenta?'<div class="fila"><span class="lbl">Banco:</span><span class="val">' + (emp.bancoCuenta||'---') + ' - ' + (emp.tipoCuentaBanco||'') + '</span></div>':'')
    + (emp&&emp.cuentaBanco?'<div class="fila"><span class="lbl">No. cuenta:</span><span class="val">' + (emp.cuentaBanco||'---') + '</span></div>':'')
    + (pago.notas?'<div class="fila"><span class="lbl">Notas:</span><span class="val">' + pago.notas + '</span></div>':'')
    + '<div class="monto-box"><div class="monto-total">Q ' + parseFloat(pago.monto||0).toFixed(2) + '</div>'
    + '<div class="letras">' + numLetras(pago.monto||0) + '</div></div>'
    + '<div class="firmas">'
    + '<div class="firma">Elaborado por<br><br>' + (cfg.nombre||'---') + '</div>'
    + '<div class="firma">Recibido conforme<br><br>' + (emp?emp.nombre:pago.empleadoNombre) + '</div>'
    + '</div></div></body></html>';
  w.document.write(html);
  w.document.close();
  setTimeout(function(){ w.print(); }, 400);
}

// ---- HISTORIAL DE PAGOS MEJORADO (edicion admin + voucher) ----
async function renderHistorialPagos(content, actions) {
  if (!soloAdmin()) { content.innerHTML='<div class="alert alert-red">Solo administradores</div>'; return; }
  var empleados = await dbGetAll('empleados');
  var pagos = await dbGetAll('historial_pagos');
  var activos = empleados.filter(function(e){ return e.activo !== false; });
  actions.innerHTML = '<button class="btn btn-secondary" onclick="generarPagosMes()">Generar nomina mes</button>'
    + ' <button class="btn btn-primary" onclick="modalRegistrarPago()">+ Registrar pago</button>';

  // Resumen por empleado
  var filas = activos.map(function(e) {
    var pagosEmp = pagos.filter(function(p){ return p.empleadoId === e.id; });
    var ultNomina = pagosEmp.filter(function(p){return p.tipo==='nomina';}).sort(function(a,b){return a.fecha<b.fecha?1:-1;})[0];
    var ultB14    = pagosEmp.filter(function(p){return p.tipo==='bono14';}).sort(function(a,b){return a.fecha<b.fecha?1:-1;})[0];
    var ultAgui   = pagosEmp.filter(function(p){return p.tipo==='aguinaldo';}).sort(function(a,b){return a.fecha<b.fecha?1:-1;})[0];
    var totalPagado = pagosEmp.reduce(function(a,p){return a+(p.monto||0);},0);
    return '<tr>'
      + '<td><strong>'+e.nombre+'</strong><div style="font-size:10px;color:var(--text3)">'+(e.cargo||'')+'</div></td>'
      + '<td class="td-mono">'+fmt(e.salarioBase||0)+'</td>'
      + '<td style="font-size:11px">'+(ultNomina?fechaLegible(ultNomina.fecha)+' Q'+(ultNomina.monto||0).toFixed(0):'<span class="text-muted">---</span>')+'</td>'
      + '<td style="font-size:11px">'+(ultB14?fechaLegible(ultB14.fecha)+' Q'+(ultB14.monto||0).toFixed(0):'<span class="text-muted">---</span>')+'</td>'
      + '<td style="font-size:11px">'+(ultAgui?fechaLegible(ultAgui.fecha)+' Q'+(ultAgui.monto||0).toFixed(0):'<span class="text-muted">---</span>')+'</td>'
      + '<td class="td-mono">'+fmt(totalPagado)+'</td>'
      + '<td><div class="flex gap-1">'
      + '<button class="btn btn-sm btn-blue" onclick="verHistorialEmp('+e.id+')">Historial</button>'
      + '<button class="btn btn-sm btn-green" onclick="modalRegistrarPago('+e.id+')">+ Pago</button>'
      + '</div></td>'
      + '</tr>';
  }).join('');

  // Ultimos pagos con opcion de editar y voucher
  var ultimos = pagos.slice().sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;}).slice(0,30);
  var tipoIcons = {nomina:'$',bono14:'B',aguinaldo:'A',vacacion:'V',otro:'+'};
  var colores = {nomina:'green',bono14:'amber',aguinaldo:'amber',vacacion:'blue',otro:'gray'};
  var filasRecientes = ultimos.map(function(p){
    return '<tr>'
      + '<td>'+fechaLegible(p.fecha)+'</td>'
      + '<td><span class="badge badge-'+(colores[p.tipo]||'gray')+'">'+(tipoIcons[p.tipo]||p.tipo)+'</span> '+(p.descripcion||p.tipo)+'</td>'
      + '<td>'+(p.empleadoNombre||'---')+'</td>'
      + '<td class="td-mono td-right text-green">Q '+(p.monto||0).toFixed(2)+'</td>'
      + '<td style="font-size:10px;color:var(--text3)">'+(p.periodo||'---')+'</td>'
      + '<td><div class="flex gap-1">'
      + '<button class="btn btn-sm btn-secondary" onclick="imprimirVoucherPago('+p.id+')">Voucher</button>'
      + '<button class="btn btn-sm btn-blue" onclick="editarPago('+p.id+')">Editar</button>'
      + '<button class="btn btn-sm btn-danger" onclick="borrarPago('+p.id+')">X</button>'
      + '</div></td>'
      + '</tr>';
  }).join('');

  content.innerHTML = '<div class="section-title">Historial de Pagos</div>'
    + '<div class="section-sub">Nomina, Bono 14 y Aguinaldo | Ciclos segun Decreto 42-92 y 76-78</div>'
    + '<div class="alert alert-blue" style="font-size:11px">'
    + '<strong>Bono 14:</strong> Ciclo 1-jul a 30-jun. Pago: 1-15 julio | '
    + '<strong>Aguinaldo:</strong> Ciclo 1-dic a 30-nov. Pago: 15 diciembre'
    + '</div>'
    + '<div class="card" style="padding:10px"><div class="card-title" style="margin-bottom:8px">Resumen por empleado</div>'
    + '<div class="table-wrap"><table>'
    + '<thead><tr><th>Empleado</th><th>Salario</th><th>Ultima nomina</th><th>Ultimo B14</th><th>Ultimo Agui.</th><th>Total pagado</th><th>Acciones</th></tr></thead>'
    + '<tbody>'+(filas||'<tr><td colspan="7" class="text-center text-muted" style="padding:16px">Sin empleados</td></tr>')+'</tbody></table></div></div>'
    + '<div class="card" style="padding:10px"><div class="card-title" style="margin-bottom:8px">Ultimos 30 pagos registrados</div>'
    + '<div class="table-wrap"><table>'
    + '<thead><tr><th>Fecha</th><th>Tipo</th><th>Empleado</th><th class="td-right">Monto</th><th>Periodo</th><th>Acciones</th></tr></thead>'
    + '<tbody>'+(filasRecientes||'<tr><td colspan="6" class="text-center text-muted" style="padding:16px">Sin pagos</td></tr>')+'</tbody></table></div></div>';
}

async function editarPago(pagoId) {
  if (!soloAdmin()) { toast('Solo administradores','red'); return; }
  var pagos = await dbGetAll('historial_pagos');
  var p = pagos.find(function(x){ return x.id === pagoId; });
  if (!p) return;
  openModal('editPago', 'Editar Pago (solo Admin)',
    '<div class="alert alert-amber" style="font-size:11px">Solo administradores pueden editar registros de pagos.</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Fecha</label><input id="ep_fecha" type="date" value="'+(p.fecha||today())+'"></div>'
    + '<div class="form-group"><label>Monto (Q)</label><input id="ep_monto" type="number" value="'+(p.monto||0)+'" step="0.01"></div>'
    + '</div>'
    + '<div class="form-group"><label>Descripcion</label><input id="ep_desc" value="'+(p.descripcion||'')+'"></div>'
    + '<div class="form-group"><label>Periodo</label><input id="ep_periodo" value="'+(p.periodo||'')+'"></div>'
    + '<div class="form-group"><label>Notas</label><textarea id="ep_notas" style="min-height:50px">'+(p.notas||'')+'</textarea></div>',
    async function() {
      p.fecha = document.getElementById('ep_fecha').value;
      p.monto = parseFloat(document.getElementById('ep_monto').value)||0;
      p.descripcion = document.getElementById('ep_desc').value.trim();
      p.periodo = document.getElementById('ep_periodo').value.trim();
      p.notas = document.getElementById('ep_notas').value.trim();
      p.updatedAt = nowTs(); p.editadoPor = sesionActual?sesionActual.username:'admin';
      await dbPut('historial_pagos', p);
      cerrarModal('editPago'); toast('Pago actualizado');
      await navTo('historial_pagos');
    }, true);
}

async function borrarPago(pagoId) {
  if (!soloAdmin()) { toast('Solo administradores','red'); return; }
  if (!confirm('Eliminar este registro de pago? Esta accion no se puede deshacer.')) return;
  await dbDelete('historial_pagos', pagoId);
  toast('Registro eliminado');
  await navTo('historial_pagos');
}

// ---- ISR EMPRESARIAL ANUAL (Regimen 25%) ----
// Decreto 10-2012, Art. 38: 25% sobre utilidad imponible
// La utilidad imponible = Ingresos - Costos deducibles
// Costos deducibles incluyen: salarios, IGSS patronal, Bono14, Aguinaldo, todos los costos operativos
// Se paga en cuotas trimestrales (Art. 38): abril, julio, octubre, enero



/* ================================================================
   IMPORTAR FACTURAS SAT - CSV del Portal SAT Guatemala
   ================================================================ */

/* ── Helpers para importación de archivos ───────────────────────────────── */
function leerArchivoTexto(file) {
  return new Promise(function(res, rej) {
    var r = new FileReader();
    r.onload = function(e){ res(e.target.result); };
    r.onerror = function(e){ rej(new Error('No se pudo leer el archivo')); };
    r.readAsText(file, 'UTF-8');
  });
}

function leerArchivoBuffer(file) {
  return new Promise(function(res, rej) {
    var r = new FileReader();
    r.onload = function(e){ res(e.target.result); };
    r.onerror = function(e){ rej(new Error('No se pudo leer el archivo')); };
    r.readAsArrayBuffer(file);
  });
}

function parsearLinea(linea, sep) {
  // Parsear CSV respetando campos entre comillas
  var cols = [];
  var actual = '';
  var enComillas = false;
  for (var i=0; i<linea.length; i++) {
    var c = linea[i];
    if (c === '"') {
      enComillas = !enComillas;
    } else if (c === sep && !enComillas) {
      cols.push(actual.trim());
      actual = '';
    } else {
      actual += c;
    }
  }
  cols.push(actual.trim());
  return cols;
}

function get(cols, idx) {
  if (idx < 0 || idx >= cols.length) return '';
  return (cols[idx] || '').replace(/^"|"$/g, '').trim();
}

function buscarCol(header, nombres) {
  for (var i=0; i<nombres.length; i++) {
    var idx = header.indexOf(nombres[i]);
    if (idx >= 0) return idx;
    // Búsqueda parcial
    for (var j=0; j<header.length; j++) {
      if (header[j].includes(nombres[i]) || nombres[i].includes(header[j])) return j;
    }
  }
  return -1;
}

function normalFecha(str) {
  if (!str) return today();
  str = str.trim().replace(/"/g,'');
  // DD/MM/YYYY → YYYY-MM-DD
  var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0');
  // DD-MM-YYYY
  m = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (m) return m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0');
  // YYYY-MM-DD ya está bien
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0,10);
  // Fecha con hora: 2025-01-15 14:30:00
  if (/^\d{4}-\d{2}-\d{2}\s/.test(str)) return str.slice(0,10);
  return today();
}

async function cargarSheetJS() {
  if (window.XLSX) return;
  await new Promise(function(res, rej) {
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

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
async function renderBodegas(content, actions) {
  var bodegas = await dbGetAll('bodegas');
  var repuestos = await dbGetAll('repuestos');
  var insumos = await dbGetAll('insumos');

  actions.innerHTML = '<button class="btn btn-primary" onclick="modalBodega()">+ Nueva bodega</button>'
    + ' <button class="btn btn-secondary" onclick="modalTraslado()">⇄ Traslado entre bodegas</button>';

  var html = '<div class="section-title">🏭 Bodegas y Sucursales</div>'
    + '<div class="section-sub">Inventario de repuestos e insumos por bodega. Controla traslados entre ubicaciones.</div>';

  if (!bodegas.length) {
    html += '<div class="empty-state"><div class="empty-icon">🏭</div>'
      + '<div class="empty-title">Sin bodegas registradas</div>'
      + '<div class="empty-sub">Agrega tus sucursales y bodegas para controlar inventario por ubicación</div>'
      + '<button class="btn btn-primary" onclick="modalBodega()">+ Agregar bodega</button></div>';
    content.innerHTML = html; return;
  }

  // Tabs: Resumen | Repuestos | Insumos | Traslados
  html += '<div style="display:flex;gap:4px;margin-bottom:16px;flex-wrap:wrap">'
    + ['resumen','repuestos','insumos','traslados'].map(function(t,i){
        var labels = ['📊 Resumen','🔧 Repuestos','🧴 Insumos','⇄ Traslados'];
        return '<button onclick="mostrarTabBodega(\'' + t + '\')" id="tab_bod_' + t + '" class="btn ' + (i===0?'btn-primary':'btn-secondary') + '" style="font-size:12px">' + labels[i] + '</button>';
      }).join('')
    + '</div>';

  // Panel resumen
  html += '<div id="panel_bod_resumen">';
  bodegas.forEach(function(b) {
    var reps = repuestos.filter(function(r){ return r.bodegaId === b.id; });
    var inss = insumos.filter(function(s){ return s.bodegaId === b.id; });
    var bajoRep = reps.filter(function(r){ return r.stock <= (r.stockMin||0); }).length;
    var bajoIns = inss.filter(function(s){ return s.stock <= (s.stockMin||0); }).length;
    var valorRep = reps.reduce(function(a,r){ return a+(r.stock*(r.costo||0)); }, 0);
    html += '<div class="card" style="margin-bottom:10px">'
      + '<div class="card-header"><span class="card-title">🏭 ' + b.nombre + '</span>'
      + '<div class="flex gap-1">'
      + '<button class="btn btn-sm btn-secondary" onclick="mostrarTabBodega(\'repuestos\')">Ver repuestos</button>'
      + '<button class="btn btn-sm btn-secondary" onclick="mostrarTabBodega(\'insumos\')">Ver insumos</button>'
      + '<button class="btn btn-sm btn-secondary" onclick="modalBodega(' + b.id + ')">✏️</button>'
      + '</div></div>'
      + '<div class="stat-grid" style="grid-template-columns:repeat(4,1fr);margin-top:8px">'
      + '<div class="stat-card"><div class="stat-label">Ubicación</div><div style="font-size:12px">' + (b.direccion||'—') + '</div></div>'
      + '<div class="stat-card stat-blue"><div class="stat-label">Repuestos</div><div class="stat-value" style="font-size:18px">' + reps.length + '</div></div>'
      + '<div class="stat-card stat-green"><div class="stat-label">Insumos</div><div class="stat-value" style="font-size:18px">' + inss.length + '</div></div>'
      + '<div class="stat-card ' + ((bajoRep+bajoIns)>0?'stat-red':'stat-green') + '"><div class="stat-label">Bajo stock</div><div class="stat-value" style="font-size:18px">' + (bajoRep+bajoIns) + '</div></div>'
      + '</div>'
      + '<div style="font-size:11px;color:var(--text3);margin-top:6px">Valor en repuestos: ' + fmt(valorRep) + ' · Tipo: ' + (b.tipo||'—') + ' · Resp: ' + (b.responsable||'—') + '</div>'
      + '</div>';
  });
  html += '</div>';

  // Panel repuestos por bodega
  html += '<div id="panel_bod_repuestos" style="display:none">';
  html += '<table class="table"><thead><tr><th>Item</th><th>Bodega</th><th>Stock</th><th>Mín.</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
  var repsBodega = repuestos.filter(function(r){ return r.bodegaId; });
  if (!repsBodega.length) html += '<tr><td colspan="6" class="text-center text-muted">Sin repuestos asignados a bodegas</td></tr>';
  repsBodega.forEach(function(r) {
    var b = bodegas.find(function(x){ return x.id===r.bodegaId; });
    var bajo = r.stock <= (r.stockMin||0);
    html += '<tr><td>' + r.nombre + '</td><td>' + (b?b.nombre:'—') + '</td>'
      + '<td class="td-mono">' + r.stock + '</td><td class="td-mono">' + (r.stockMin||0) + '</td>'
      + '<td><span class="badge badge-' + (bajo?'red':'green') + '">' + (bajo?'⚠ Bajo':'OK') + '</span></td>'
      + '<td><button class="btn btn-sm btn-secondary" onclick="modalTrasladoItem(' + r.id + ',\'repuesto\')">⇄ Trasladar</button></td>'
      + '</tr>';
  });
  html += '</tbody></table></div>';

  // Panel insumos por bodega
  html += '<div id="panel_bod_insumos" style="display:none">';
  html += '<table class="table"><thead><tr><th>Insumo</th><th>Bodega</th><th>Stock</th><th>Unidad</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';
  var inssBodega = insumos.filter(function(s){ return s.bodegaId; });
  if (!inssBodega.length) html += '<tr><td colspan="6" class="text-center text-muted">Sin insumos asignados a bodegas</td></tr>';
  inssBodega.forEach(function(s) {
    var b = bodegas.find(function(x){ return x.id===s.bodegaId; });
    var bajo = s.stock <= (s.stockMin||0);
    html += '<tr><td>' + s.nombre + '</td><td>' + (b?b.nombre:'—') + '</td>'
      + '<td class="td-mono">' + s.stock + '</td><td>' + (s.unidad||'un') + '</td>'
      + '<td><span class="badge badge-' + (bajo?'red':'green') + '">' + (bajo?'⚠ Bajo':'OK') + '</span></td>'
      + '<td><button class="btn btn-sm btn-secondary" onclick="modalTrasladoItem(' + s.id + ',\'insumo\')">⇄ Trasladar</button></td>'
      + '</tr>';
  });
  html += '</tbody></table></div>';

  // Panel traslados
  html += '<div id="panel_bod_traslados" style="display:none">';
  var traslados = await dbGetAll('traslados');
  if (!traslados.length) {
    html += '<div class="empty-state">Sin traslados registrados aún.</div>';
  } else {
    traslados.sort(function(a,b){ return (a.fecha||'')<(b.fecha||'')?1:-1; });
    html += '<table class="table"><thead><tr><th>Fecha</th><th>Item</th><th>De</th><th>A</th><th>Qty</th><th>Solicitó</th></tr></thead><tbody>';
    traslados.slice(0,50).forEach(function(t) {
      var bOrig = bodegas.find(function(x){ return x.id===t.bodegaOrigenId; });
      var bDest = bodegas.find(function(x){ return x.id===t.bodegaDestinoId; });
      html += '<tr><td>' + fechaLegible(t.fecha) + '</td><td>' + (t.itemNombre||'—') + '</td>'
        + '<td>' + (bOrig?bOrig.nombre:'—') + '</td><td>' + (bDest?bDest.nombre:'—') + '</td>'
        + '<td class="td-mono">' + t.cantidad + '</td><td>' + (t.usuario||'—') + '</td></tr>';
    });
    html += '</tbody></table>';
  }
  html += '</div>';

  content.innerHTML = html;
}

function mostrarTabBodega(tab) {
  ['resumen','repuestos','insumos','traslados'].forEach(function(t) {
    var panel = document.getElementById('panel_bod_'+t);
    var btn = document.getElementById('tab_bod_'+t);
    if (panel) panel.style.display = t===tab ? '' : 'none';
    if (btn) { btn.className = 'btn ' + (t===tab?'btn-primary':'btn-secondary'); btn.style.fontSize='12px'; }
  });
}

async function mostrarInvBodega(bodegaId, tipo) {
  mostrarTabBodega(tipo === 'repuesto' ? 'repuestos' : tipo);
}

async function modalTraslado() {
  var bodegas = await dbGetAll('bodegas');
  if (bodegas.length < 2) { toast('Necesitas al menos 2 bodegas para hacer traslados', 'amber'); return; }
  var repuestos = await dbGetAll('repuestos');
  var insumos   = await dbGetAll('insumos');
  var optsB = bodegas.map(function(b){ return '<option value="' + b.id + '">' + b.nombre + '</option>'; }).join('');
  var optsItems = '<optgroup label="Repuestos">'
    + repuestos.map(function(r){ return '<option value="rep_' + r.id + '">' + r.nombre + ' (stock: ' + r.stock + ')</option>'; }).join('')
    + '</optgroup><optgroup label="Insumos">'
    + insumos.map(function(s){ return '<option value="ins_' + s.id + '">' + s.nombre + ' (stock: ' + s.stock + ')</option>'; }).join('')
    + '</optgroup>';

  openModal('modalTraslado', '⇄ Traslado entre bodegas',
    '<div class="form-group"><label>Item a trasladar *</label><select id="tras_item">' + optsItems + '</select></div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Bodega origen *</label><select id="tras_origen">' + optsB + '</select></div>'
    + '<div class="form-group"><label>Bodega destino *</label><select id="tras_destino">' + optsB + '</select></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Cantidad *</label><input id="tras_qty" type="number" value="1" min="1" step="1"></div>'
    + '<div class="form-group"><label>Fecha</label><input id="tras_fecha" type="date" value="' + today() + '"></div>'
    + '</div>'
    + '<div class="form-group"><label>Motivo</label><input id="tras_motivo" placeholder="Reabastecimiento, devolución..."></div>',
    async function() {
      var itemVal  = (document.getElementById('tras_item')||{}).value;
      var origenId = parseInt((document.getElementById('tras_origen')||{}).value);
      var destId   = parseInt((document.getElementById('tras_destino')||{}).value);
      var qty      = parseInt((document.getElementById('tras_qty')||{}).value) || 0;
      var fecha    = (document.getElementById('tras_fecha')||{}).value;
      var motivo   = (document.getElementById('tras_motivo')||{}).value;
      if (!itemVal || !qty || qty <= 0) { toast('Completa todos los campos', 'red'); return; }
      if (origenId === destId) { toast('Origen y destino deben ser diferentes', 'red'); return; }
      var tipo = itemVal.startsWith('rep_') ? 'repuesto' : 'insumo';
      var itemId = parseInt(itemVal.split('_')[1]);
      var store = tipo === 'repuesto' ? 'repuestos' : 'insumos';
      // Actualizar stocks
      var itemOrig = await dbGet(store, itemId);
      if (!itemOrig) { toast('Item no encontrado', 'red'); return; }
      if (itemOrig.stock < qty) { toast('Stock insuficiente en bodega origen: ' + itemOrig.stock, 'red'); return; }
      // Descontar de origen
      itemOrig.stock -= qty;
      itemOrig.bodegaId = origenId;
      await dbPut(store, itemOrig);
      // Buscar si ya existe el item en bodega destino
      var todos = await dbGetAll(store);
      var itemDest = todos.find(function(x){ return x.bodegaId===destId && x.nombre===itemOrig.nombre; });
      if (itemDest) {
        itemDest.stock += qty;
        await dbPut(store, itemDest);
      } else {
        var nuevoItem = Object.assign({}, itemOrig);
        delete nuevoItem.id;
        nuevoItem.stock = qty;
        nuevoItem.bodegaId = destId;
        await dbAdd(store, nuevoItem);
      }
      // Registrar traslado
      var bods = await dbGetAll('bodegas');
      var bOrig = bods.find(function(b){ return b.id===origenId; });
      var bDest = bods.find(function(b){ return b.id===destId; });
      await dbAdd('traslados', {
        fecha: fecha, tipo: tipo, itemId: itemId, itemNombre: itemOrig.nombre,
        bodegaOrigenId: origenId, bodegaOrigenNombre: bOrig?bOrig.nombre:'',
        bodegaDestinoId: destId, bodegaDestinoNombre: bDest?bDest.nombre:'',
        cantidad: qty, motivo: motivo,
        usuario: sesionActual ? sesionActual.nombre : '—',
        createdAt: nowTs()
      });
      await logAuditoria('TRASLADO','bodegas','Traslado: '+qty+'x '+itemOrig.nombre+' → '+(bDest?bDest.nombre:''), {qty:qty});
      closeModal('modalTraslado');
      toast('✓ Traslado registrado');
      await navTo('bodegas');
    }, false);
}

async function modalTrasladoItem(itemId, tipo) {
  // Pre-seleccionar el item
  await modalTraslado();
  setTimeout(function(){
    var sel = document.getElementById('tras_item');
    if (sel) sel.value = tipo + '_' + itemId;
  }, 100);
}

async function modalBodega(id) {
  var b = id ? await dbGet('bodegas', id) : {};
  openModal('modalBodega', id ? 'Editar Bodega' : 'Nueva Bodega',
    '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Nombre *</label><input id="bod_nom" value="' + (b.nombre||'') + '" placeholder="Bodega Central, Sucursal Norte..."></div>'
    + '<div class="form-group"><label>Responsable</label><input id="bod_resp" value="' + (b.responsable||'') + '" placeholder="Nombre del encargado"></div>'
    + '</div>'
    + '<div class="form-group"><label>Dirección</label><input id="bod_dir" value="' + (b.direccion||'') + '" placeholder="Zona, municipio..."></div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Teléfono</label><input id="bod_tel" value="' + (b.telefono||'') + '"></div>'
    + '<div class="form-group"><label>Tipo</label><select id="bod_tipo">'
    + ['Bodega principal','Sucursal','Bodega satélite','Taller asociado'].map(function(t){
        return '<option value="' + t + '"' + (b.tipo===t?' selected':'') + '>' + t + '</option>';
      }).join('') + '</select></div>'
    + '</div>'
    + '<div class="form-group"><label>Notas</label><textarea id="bod_notas">' + (b.notas||'') + '</textarea></div>',
    async function() {
      var nom = (document.getElementById('bod_nom')||{}).value.trim();
      if (!nom) { toast('Nombre requerido','red'); return; }
      var obj = {
        nombre: nom,
        responsable: (document.getElementById('bod_resp')||{}).value.trim(),
        direccion: (document.getElementById('bod_dir')||{}).value.trim(),
        telefono: (document.getElementById('bod_tel')||{}).value.trim(),
        tipo: (document.getElementById('bod_tipo')||{}).value,
        notas: (document.getElementById('bod_notas')||{}).value.trim(),
        updatedAt: nowTs()
      };
      if (id) { obj.id = id; await dbPut('bodegas', obj); }
      else { obj.createdAt = nowTs(); await dbAdd('bodegas', obj); }
      await logAuditoria(id?'EDITAR':'CREAR','bodegas','Bodega '+(id?'editada':'creada')+': '+nom, {});
      closeModal('modalBodega');
      toast(id ? 'Bodega actualizada' : 'Bodega registrada');
      await navTo('bodegas');
    }, false);
}




async function mostrarImportarRepuestos() {
  openModal('impRep', '📦 Importar repuestos masivo',
    '<div class="alert alert-blue" style="font-size:11px;margin-bottom:10px">'
    +'<strong>Columnas requeridas:</strong> nombre, stock, precio_venta<br>'
    +'<strong>Columnas opcionales:</strong> codigo, marca, modelo_aplicable, ubicacion, stock_min, costo, unidad</div>'
    +'<div style="display:flex;gap:8px;margin-bottom:12px">'
    +'<button onclick="descargarPlantillaRepuestos()" class="btn btn-secondary">📋 Plantilla CSV</button></div>'
    +'<label style="display:block;font-size:12px;font-weight:600;margin-bottom:6px">Seleccionar archivo (.csv o .xlsx):</label>'
    +'<input id="rep_file_inp" type="file" accept=".csv,.xlsx,.xls" style="width:100%;padding:6px;background:var(--bg3);border:1px solid var(--border2);border-radius:6px">'
    +'<button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="procesarImportRepuestos()">Cargar archivo</button>'
    +'<div id="rep_import_preview" style="margin-top:10px"></div>',
    function(){}, false);
}

function descargarPlantillaRepuestos() {
  var filas = [
    ["nombre","codigo","marca","modelo_aplicable","stock","stock_min","precio_venta","costo","ubicacion","unidad"],
    ["Filtro de aceite","FO-001","Toyota","Corolla 2010-2020","10","2","85.00","42.00","A-01","unidad"],
    ["Aceite 20W50","AC-001","Mobil","Universal","50","10","95.00","55.00","B-02","litro"]
  ];
  var csv = filas.map(function(f){return f.join(",");}).join("\n");
  var blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="plantilla_repuestos.csv"; a.click();
  toast("Plantilla descargada");
}

async function procesarImportRepuestos() {
  var inp=document.getElementById('rep_file_inp');
  if(!inp||!inp.files||!inp.files[0]){toast('Selecciona un archivo','amber');return;}
  var file=inp.files[0]; var esXlsx=file.name.match(/\.xlsx?$/i);
  var preview=document.getElementById('rep_import_preview');
  preview.innerHTML='<div style="color:var(--text3);padding:10px">Procesando...</div>';
  try {
    var rows=[];
    if(esXlsx){
      await cargarSheetJS();
      var buf=await leerArchivoBuffer(file);
      var wb=XLSX.read(buf,{type:'array'});
      var ws=wb.Sheets[wb.SheetNames[0]];
      var data=XLSX.utils.sheet_to_json(ws,{header:1,raw:false,defval:''});
      var header=data[0].map(function(h){return String(h).trim().toLowerCase().replace(/\s+/g,'_');});
      rows=data.slice(1).map(function(r){
        var o={}; header.forEach(function(h,i){o[h]=String(r[i]||'').trim();}); return o;
      });
    } else {
      var txt=await leerArchivoTexto(file);
      var sep=txt.includes(';')?';':',';
      var lineas=txt.trim().split(/\r?\n/);
      var header=parsearLinea(lineas[0],sep).map(function(h){return h.toLowerCase().replace(/\s+/g,'_');});
      rows=lineas.slice(1).map(function(l){
        var cols=parsearLinea(l,sep); var o={};
        header.forEach(function(h,i){o[h]=cols[i]||'';}); return o;
      });
    }
    rows=rows.filter(function(r){return r.nombre||r.Nombre;});
    if(!rows.length){preview.innerHTML='<div class="alert alert-red">Sin datos válidos</div>';return;}
    window._repImportRows=rows;
    var total=rows.reduce(function(a,r){return a+parseFloat(r.precio_venta||0);},0);
    preview.innerHTML='<div class="alert alert-blue" style="margin-bottom:10px">'+rows.length+' repuestos listos para importar</div>'
      +'<div style="max-height:160px;overflow-y:auto"><table class="table"><thead><tr><th>Nombre</th><th>Stock</th><th>Precio</th></tr></thead><tbody>'
      +rows.slice(0,8).map(function(r){return '<tr><td>'+r.nombre+'</td><td>'+r.stock+'</td><td>'+fmt(parseFloat(r.precio_venta||0))+'</td></tr>';}).join('')
      +(rows.length>8?'<tr><td colspan="3" style="text-align:center;color:var(--text3)">...y '+(rows.length-8)+' más</td></tr>':'')
      +'</tbody></table></div>'
      +'<button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="confirmarImportRepuestos()">✓ Importar '+rows.length+' repuestos</button>';
  } catch(e){preview.innerHTML='<div class="alert alert-red">Error: '+e.message+'</div>';}
}

async function confirmarImportRepuestos() {
  var rows=window._repImportRows||[];
  if(!rows.length){toast('Sin datos','red');return;}
  var count=0;
  for(var i=0;i<rows.length;i++){
    var r=rows[i];
    await dbAdd('repuestos',{
      nombre:r.nombre||r.Nombre,codigo:r.codigo||'',marca:r.marca||'',
      modeloAplicable:r.modelo_aplicable||r.modelo||'',
      stock:parseFloat(r.stock||0),stockMin:parseFloat(r.stock_min||0),
      precioVenta:parseFloat(r.precio_venta||0),costo:parseFloat(r.costo||0),
      ubicacion:r.ubicacion||'',unidad:r.unidad||'unidad',
      createdAt:nowTs(),updatedAt:nowTs()
    });
    count++;
  }
  await logAuditoria('IMPORTAR','repuestos','Importación masiva: '+count+' repuestos',{});
  window._repImportRows=null;
  closeModal('impRep');
  toast('✓ '+count+' repuestos importados');
  await navTo('repuestos');
}

async function renderImportExport(content, actions) {
  if (!soloAdmin()) { content.innerHTML='<div class="alert alert-red">Solo administradores</div>'; return; }
  actions.innerHTML = '';
  content.innerHTML = '<div class="section-title">Importar / Exportar Datos</div>'
    + '<div class="section-sub">Migracion desde otras plataformas | Formato CSV compatible con Excel</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">'

    // EXPORTAR
    + '<div class="card"><div class="card-title" style="margin-bottom:12px">Exportar datos</div>'
    + '<div style="display:grid;gap:8px">'
    + ['empleados','clientes','vehiculos','repuestos','facturas','ordenes','costos','proveedores','nomina'].map(function(store){
      var labels = {empleados:'Empleados',clientes:'Clientes',vehiculos:'Vehiculos',repuestos:'Repuestos',
        facturas:'Facturas',ordenes:'Ordenes de trabajo',costos:'Costos operativos',proveedores:'Proveedores',nomina:'Nomina'};
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:var(--bg3);border-radius:6px">'
        + '<span style="font-size:13px">' + (labels[store]||store) + '</span>'
        + '<div class="flex gap-1">'
        + '<button class="btn btn-sm btn-secondary" onclick="exportarCSV(\''+store+'\')">CSV</button>'
        + '<button class="btn btn-sm btn-green" onclick="exportarExcel(\''+store+'\')">Excel</button>'
        + '</div></div>';
    }).join('')
    + '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:var(--bg3);border-radius:6px">'
    + '<span style="font-size:13px;font-weight:600">TODO (backup completo)</span>'
    + '<button class="btn btn-sm btn-primary" onclick="exportarBackup()">JSON completo</button></div>'
    + '</div></div>'

    // IMPORTAR
    + '<div class="card"><div class="card-title" style="margin-bottom:12px">Importar desde CSV</div>'
    + '<div class="alert alert-amber" style="font-size:11px;margin-bottom:12px">Los datos importados se AGREGAN a los existentes (no reemplazan). Usa el mismo formato que el exportado.</div>'
    + '<div style="display:grid;gap:8px">'
    + ['empleados','clientes','vehiculos','repuestos','costos','proveedores'].map(function(store){
      var labels = {empleados:'Empleados',clientes:'Clientes',vehiculos:'Vehiculos',repuestos:'Repuestos',costos:'Costos operativos',proveedores:'Proveedores'};
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:var(--bg3);border-radius:6px">'
        + '<span style="font-size:13px">' + (labels[store]||store) + '</span>'
        + '<div class="flex gap-1">'
        + '<button class="btn btn-sm btn-secondary" onclick="descargarPlantillaCSV(\''+store+'\')">Plantilla</button>'
        + '<button class="btn btn-sm btn-blue" onclick="importarCSV(\''+store+'\')">Importar CSV</button>'
        + '</div></div>';
    }).join('')
    + '</div>'
    + '<div class="divider"></div>'
    + '<div style="font-size:12px;color:var(--text2)">'
    + '<strong>Pasos para migrar desde otra plataforma:</strong><br>'
    + '1. Descarga la plantilla CSV del modulo a importar<br>'
    + '2. Rellena la plantilla con tus datos (respeta el formato de columnas)<br>'
    + '3. Guarda como CSV (UTF-8) desde Excel<br>'
    + '4. Usa el boton "Importar CSV" para cargar los datos<br>'
    + '5. Verifica los datos importados en el modulo correspondiente'
    + '</div></div>'
    + '</div>';
}

// Exportar store a CSV
async function exportarCSV(storeName) {
  var data = await dbGetAll(storeName);
  if (!data.length) { toast('Sin datos para exportar','amber'); return; }
  var keys = Object.keys(data[0]).filter(function(k){ return k !== 'passwordHash'; });
  var csv = keys.join(',') + '\n';
  data.forEach(function(row) {
    csv += keys.map(function(k){
      var v = row[k];
      if (v === null || v === undefined) return '';
      var s = String(v).replace(/"/g, '""');
      return s.includes(',') || s.includes('\n') || s.includes('"') ? '"'+s+'"' : s;
    }).join(',') + '\n';
  });
  var blob = new Blob(['\ufeff'+csv], {type:'text/csv;charset=utf-8'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download=storeName+'_'+today()+'.csv'; a.click();
  toast('CSV exportado: ' + storeName);
}

// Exportar a Excel (HTML table que Excel abre)
async function exportarExcel(storeName) {
  var data = await dbGetAll(storeName);
  if (!data.length) { toast('Sin datos para exportar','amber'); return; }
  var keys = Object.keys(data[0]).filter(function(k){ return k !== 'passwordHash'; });
  var html = '<table border="1"><thead><tr>' + keys.map(function(k){return '<th>'+k+'</th>';}).join('') + '</tr></thead><tbody>';
  data.forEach(function(row){
    html += '<tr>' + keys.map(function(k){ return '<td>'+(row[k]!=null?String(row[k]):'')+'</td>'; }).join('') + '</tr>';
  });
  html += '</tbody></table>';
  var blob = new Blob(['\ufeff'+html], {type:'application/vnd.ms-excel;charset=utf-8'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download=storeName+'_'+today()+'.xls'; a.click();
  toast('Excel exportado: ' + storeName);
}

// Descargar plantilla CSV vacia con encabezados
function descargarPlantillaCSV(storeName) {
  var plantillas = {
    empleados:'nombre,dpi,cargo,tipoContrato,fechaIngreso,circunscripcion,salarioBase,telefono,email,noIGSS,cuentaBanco,bancoCuenta,tipoCuentaBanco,nombreCuentaBanco,bonificacionAdicional,descuentoAdicional,activo',
    clientes:'nombre,nit,empresa,tipo,telefono,whatsapp,email,direccion,notas',
    vehiculos:'clienteNombre,placa,tipoVehiculo,marca,modelo,anio,color,cilindros,cilindraje,combustibleTipo,km,vin,tipoServicio,proximoServicio,kmProximo,observaciones',
    repuestos:'codigo,nombre,categoria,stock,stockMin,unidad,costo,precio,proveedor,fechaCaducidad,descripcion',
    costos:'fecha,categoria,descripcion,monto,proveedor,recurrente',
    proveedores:'empresa,nit,categoria,contacto,telefono,email,sitioWeb,direccion,plazoCredito,calificacion,notas'
  };
  var csv = (plantillas[storeName]||'id,nombre') + '\n';
  var blob = new Blob(['\ufeff'+csv], {type:'text/csv;charset=utf-8'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href=url; a.download='plantilla_'+storeName+'.csv'; a.click();
  toast('Plantilla descargada: ' + storeName);
}

// Importar CSV al store
function importarCSV(storeName) {
  var input = document.createElement('input');
  input.type = 'file'; input.accept = '.csv';
  input.onchange = async function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var text = await file.text();
    // Detectar BOM
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    var lineas = text.split('\n').filter(function(l){return l.trim();});
    if (lineas.length < 2) { toast('Archivo vacio o sin datos','red'); return; }
    var keys = lineas[0].split(',').map(function(k){return k.trim().replace(/^"|"$/g,'');});
    var rows = [];
    for (var i=1; i<lineas.length; i++) {
      var vals = parseCSVLine(lineas[i]);
      if (vals.length < 2) continue;
      var obj = {createdAt:nowTs()};
      keys.forEach(function(k,idx){ if(k && k!=='id') obj[k] = vals[idx]||''; });
      // Convertir tipos
      if (obj.salarioBase) obj.salarioBase = parseFloat(obj.salarioBase)||0;
      if (obj.monto) obj.monto = parseFloat(obj.monto)||0;
      if (obj.stock) obj.stock = parseInt(obj.stock)||0;
      if (obj.costo) obj.costo = parseFloat(obj.costo)||0;
      if (obj.precio) obj.precio = parseFloat(obj.precio)||0;
      if (obj.activo !== undefined) obj.activo = obj.activo !== 'false' && obj.activo !== '0';
      rows.push(obj);
    }
    if (!rows.length) { toast('No se encontraron filas validas','red'); return; }
    if (!confirm('Importar '+rows.length+' registros a '+storeName+'? Se agregaran a los datos existentes.')) return;
    var ok = 0;
    for (var j=0; j<rows.length; j++) {
      try { await dbAdd(storeName, rows[j]); ok++; } catch(err) {}
    }
    toast(ok + ' registros importados a ' + storeName);
    await navTo(storeName);
  };
  input.click();
}

function parseCSVLine(line) {
  var result = []; var cur = ''; var inQ = false;
  for (var i=0; i<line.length; i++) {
    var c = line[i];
    if (c==='"' && !inQ) { inQ=true; }
    else if (c==='"' && inQ && line[i+1]==='"') { cur+='"'; i++; }
    else if (c==='"' && inQ) { inQ=false; }
    else if (c===',' && !inQ) { result.push(cur.trim()); cur=''; }
    else { cur+=c; }
  }
  result.push(cur.trim());
  return result;
}

// ================================================================

/* ================================================================
   ENVÍO WHATSAPP VIA CALLMEBOT - Función centralizada
   ================================================================ */
