/* TallerPro GT — js/clientes.js
   Módulo independiente — cada archivo tiene funciones específicas
   Para editar: modificar solo este archivo y recargar
*/

const FABRICANTES_DB={
  Toyota:{
    modelos:['Hilux','Corolla','RAV4','Fortuner','Land Cruiser','Yaris','Camry','Prius'],
    intervalos:{aceite:5000,filtroAire:20000,filtroCombustible:40000,bujias:40000,correa:90000,frenos:30000,refrigerante:40000},
    aceiteRecomendado:'5W-30 o 10W-30 sint\u00E9tico (API SN/SP)',
    filtroAceite:'Toyota Part 90915-YZZD1 o equivalente',
    observaciones:'Revisar nivel de fluido de transmisi\u00F3n cada 40,000 km. Calibrar v\u00E1lvulas cada 60,000 km en motores 2TR.'
  },
  Nissan:{
    modelos:['Frontier','Pathfinder','Sentra','Versa','Altima','NP300','Urvan'],
    intervalos:{aceite:5000,filtroAire:15000,filtroCombustible:30000,bujias:30000,correa:80000,frenos:25000,refrigerante:40000},
    aceiteRecomendado:'5W-30 o 5W-40 (API SN)',
    filtroAceite:'Nissan 15208-65F0E o equivalente Fram PH6607',
    observaciones:'Verificar sensor MAF cada 30,000 km. Aceite CVT Nissan NS-3 solo en transmisiones autom\u00E1ticas.'
  },
  Chevrolet:{
    modelos:['Silverado','Colorado','Suburban','Traverse','Cruze','Spark','Captiva','D-MAX'],
    intervalos:{aceite:5000,filtroAire:20000,filtroCombustible:40000,bujias:40000,correa:100000,frenos:30000,refrigerante:50000},
    aceiteRecomendado:'Dexos 1 Gen2 5W-30 (obligatorio en motores Ecotec)',
    filtroAceite:'AC Delco PF48E o equivalente',
    observaciones:'No mezclar refrigerante Dex-Cool con refrigerante verde. Revisar m\u00F3dulo de admisi\u00F3n de aire cada 40,000 km.'
  },
  Ford:{
    modelos:['F-150','F-350','Explorer','Ranger','Escape','EcoSport','Fusion','Transit'],
    intervalos:{aceite:8000,filtroAire:20000,filtroCombustible:50000,bujias:60000,correa:150000,frenos:30000,refrigerante:80000},
    aceiteRecomendado:'5W-20 o 5W-30 Motorcraft (API SP)',
    filtroAceite:'Motorcraft FL-500S o equivalente',
    observaciones:'Motor EcoBoost requiere atenci\u00F3n especial a refrigeraci\u00F3n. Revisar turbocargador cada 60,000 km.'
  },
  Honda:{
    modelos:['CRV','Civic','Pilot','Accord','Fit','HRV','Odyssey','Ridgeline'],
    intervalos:{aceite:5000,filtroAire:30000,filtroCombustible:45000,bujias:45000,correa:105000,frenos:30000,refrigerante:50000},
    aceiteRecomendado:'0W-20 o 5W-20 (Honda Genuine o API SN PLUS)',
    filtroAceite:'Honda 15400-PLM-A02 o equivalente Fram CH9018',
    observaciones:'El aceite 0W-20 es mandatorio en modelos i-VTEC recientes. No usar aceite mineral en motores de alta compresi\u00F3n Honda.'
  },
  Hyundai:{
    modelos:['Tucson','Santa Fe','Accent','Elantra','Creta','H350','Porter','Sonata'],
    intervalos:{aceite:5000,filtroAire:30000,filtroCombustible:40000,bujias:40000,correa:90000,frenos:30000,refrigerante:40000},
    aceiteRecomendado:'5W-30 o 5W-40 (API SN/SP)',
    filtroAceite:'Hyundai 26300-35503 o equivalente',
    observaciones:'Revisar tensador de cadena de distribuci\u00F3n en motores Theta II. Inspecci\u00F3n de frenos de mano electr\u00F3nico cada 20,000 km.'
  },
  Kia:{
    modelos:['Sportage','Sorento','Rio','Cerato','Picanto','Carnival','Stinger','Seltos'],
    intervalos:{aceite:5000,filtroAire:30000,filtroCombustible:40000,bujias:40000,correa:90000,frenos:30000,refrigerante:40000},
    aceiteRecomendado:'5W-30 sint\u00E9tico (API SN)',
    filtroAceite:'Kia 26300-3X300 o equivalente',
    observaciones:'Compartir plataforma con Hyundai. Inspecci\u00F3n de sistema GDI (inyecci\u00F3n directa) cada 50,000 km para dep\u00F3sitos de carb\u00F3n.'
  },
  Mitsubishi:{
    modelos:['L200','Montero','Outlander','ASX','Lancer','Eclipse Cross','Galant'],
    intervalos:{aceite:5000,filtroAire:25000,filtroCombustible:40000,bujias:30000,correa:90000,frenos:30000,refrigerante:40000},
    aceiteRecomendado:'5W-30 o 10W-40 (API SN)',
    filtroAceite:'Mitsubishi MD069782 o equivalente Purolator PL14610',
    observaciones:'Sistema 4WD Super Select requiere aceite diferencial especial cada 30,000 km. Verificar embrague de transferencia.'
  },
  Isuzu:{
    modelos:['D-Max','MU-X','Trooper','Elf','NHR','NPR','FRR','FVR'],
    intervalos:{aceite:5000,filtroAire:20000,filtroCombustible:30000,bujias:40000,correa:100000,frenos:25000,refrigerante:40000},
    aceiteRecomendado:'15W-40 diesel (API CI-4) o 5W-30 en motores gasolina',
    filtroAceite:'Isuzu 8972381880 o equivalente Baldwin B7188',
    observaciones:'Motor diesel 4JJ1 requiere revisi\u00F3n de inyectores cada 80,000 km. DPF (filtro de part\u00EDculas) en modelos Euro V.'
  },
  Kenworth:{
    modelos:['T680','T880','W900','T370','T470','C500'],
    intervalos:{aceite:10000,filtroAire:50000,filtroCombustible:20000,bujias:null,correa:250000,frenos:20000,refrigerante:100000},
    aceiteRecomendado:'15W-40 o 10W-30 heavy duty (API CK-4/FA-4)',
    filtroAceite:'Fleetguard LF3000 o equivalente Wix 51515',
    observaciones:'Motores PACCAR MX requieren aceite API CK-4. Revisar sistema de frenos de aire cada 20,000 km. Lubricaci\u00F3n de quinta rueda mensual.'
  },
  Freightliner:{
    modelos:['Cascadia','Columbia','M2','FL50','FL60','FL80'],
    intervalos:{aceite:10000,filtroAire:50000,filtroCombustible:20000,bujias:null,correa:250000,frenos:20000,refrigerante:100000},
    aceiteRecomendado:'15W-40 Shell Rotella T6 o equivalente (API CK-4)',
    filtroAceite:'Fleetguard LF9009 o equivalente',
    observaciones:'Motor Detroit DD13/DD15 requiere aceite de viscosidad alta. Verificar sistema EGR y DPF cada 50,000 km. Revisi\u00F3n de suspensi\u00F3n neum\u00E1tica.'
  },
  Mack:{
    modelos:['Pinnacle','Granite','Anthem','LR Electric','TerraPro'],
    intervalos:{aceite:10000,filtroAire:50000,filtroCombustible:20000,bujias:null,correa:250000,frenos:20000,refrigerante:100000},
    aceiteRecomendado:'15W-40 heavy duty (API CK-4) Mack EO-O PP',
    filtroAceite:'Fleetguard LF14000NN o equivalente',
    observaciones:'Usar solo aceites aprobados Mack EO-O PP para garant\u00EDa. Revisi\u00F3n de caja Mack T318 cada 120,000 km.'
  },
  Volvo:{
    modelos:['FH','FM','FMX','FE','FL','VNL','VNR'],
    intervalos:{aceite:10000,filtroAire:50000,filtroCombustible:15000,bujias:null,correa:300000,frenos:20000,refrigerante:100000},
    aceiteRecomendado:'Volvo VDS-4 15W-40 o equivalente aprobado',
    filtroAceite:'Volvo 466634 o equivalente Fleetguard LF3000',
    observaciones:'Sistema I-Shift requiere aceite Volvo 97307. Revisi\u00F3n de AdBlue/DEF cada llenado. Diagn\u00F3stico con herramienta VCADS Pro.'
  },
  'Mercedes-Benz':{
    modelos:['Sprinter','Actros','Atego','Axor','Vito','GLE','GLC','C-Class'],
    intervalos:{aceite:10000,filtroAire:40000,filtroCombustible:20000,bujias:40000,correa:200000,frenos:30000,refrigerante:60000},
    aceiteRecomendado:'5W-30 MB 229.52 o 229.51 (solo aprobados Mercedes)',
    filtroAceite:'Mercedes A0001801209 o equivalente Mann W71280',
    observaciones:'Los motores OM651 y OM642 solo admiten aceites con aprobaci\u00F3n MB 229.51/52. Revisar actuador de swirl cada 60,000 km.'
  },
  Hino:{
    modelos:['300','500','700','Ranger','Dutro','FC','FG','FM','GH'],
    intervalos:{aceite:5000,filtroAire:25000,filtroCombustible:20000,bujias:null,correa:120000,frenos:20000,refrigerante:50000},
    aceiteRecomendado:'15W-40 diesel (API CH-4/CI-4) Hino Genuine',
    filtroAceite:'Hino 15600-E0010 o equivalente',
    observaciones:'Motor J05D/J08E requiere revisi\u00F3n de inyectores cada 80,000 km. Sistema DPD (diesel particulate diffuser) en modelos recientes.'
  },
  Otro:{
    modelos:['Otro modelo'],
    intervalos:{aceite:5000,filtroAire:20000,filtroCombustible:30000,bujias:30000,correa:90000,frenos:30000,refrigerante:40000},
    aceiteRecomendado:'Consultar manual del fabricante',
    filtroAceite:'Consultar manual del fabricante',
    observaciones:'Seguir especificaciones del fabricante para este modelo.'
  }
};

const TIPOS_VEHICULO=['Sedan','Pickup','Camioneta/SUV','Bus','Cami\u00F3n','Cabezal','Microbus','Furgoneta'];
const CATEGORIAS_REPUESTO=['Filtros','Aceites y Lubricantes','Frenos','Motor','Suspensi\u00F3n','Transmisi\u00F3n','El\u00E9ctrico','Refrigeraci\u00F3n','Direcci\u00F3n','Neum\u00E1ticos','Carrocer\u00EDa','General'];

/* ---- NAVIGATION ---- */
const NAV_CONFIG=[
  {section:'Dashboard'},
  {id:'dashboard',label:'Dashboard',icon:'',perfil:'all'},
  {id:'dashboard_mecanicos',label:'KPI Mec\u00E1nicos',icon:'',perfil:'admin'},
  {id:'dashboard_financiero',label:'Financiero',icon:'',perfil:'admin'},
  {id:'dash_facturas',label:'Dashboard Facturas',icon:'',perfil:'supervisor'},
  {id:'dash_cotizaciones',label:'Dashboard Cotizaciones',icon:'',perfil:'supervisor'},
  {id:'dash_budget',label:'Dashboard Budget',icon:'',perfil:'supervisor'},
  {section:'Taller'},
  {id:'alertas',label:'Alertas',icon:'',badge:true,perfil:'all'},
  {id:'recepciones',label:'Recepci\u00F3n',icon:'',perfil:'all'},
  {id:'ordenes',label:'\u00D3rdenes de Trabajo',icon:'',perfil:'all'},
  {id:'facturas',label:'Facturaci\u00F3n',icon:'',perfil:'supervisor'},
  {id:'cotizador',label:'Cotizador',icon:'',perfil:'supervisor'},
  {id:'budget',label:'Budget / Presupuesto',icon:'',perfil:'supervisor'},
  {section:'Inventario'},
  {id:'repuestos',label:'Repuestos',icon:'🔩',perfil:'all'},
  {id:'insumos',label:'Insumos',icon:'🧴',perfil:'all'},
  {id:'proveedores',label:'Proveedores',icon:'🚚',perfil:'supervisor'},
  {id:'bodegas',label:'Bodegas',icon:'🏭',perfil:'admin'},
  {id:'envios',label:'Envios',icon:'📦',perfil:'supervisor'},
  {id:'servicios_externos',label:'Servicios Externos',icon:'',perfil:'supervisor'},
  {section:'Clientes'},
  {id:'clientes',label:'Clientes',icon:'👤',perfil:'all'},
  {id:'vehiculos',label:'Veh\u00EDculos',icon:'',perfil:'all'},
  {id:'flota',label:'Flota Empresarial',icon:'',perfil:'supervisor'},
  {section:'RRHH'},
  {id:'historial_pagos',label:'Historial de Pagos',icon:'',perfil:'admin'},
  {id:'gestion_rrhh',label:'Gestion RRHH',icon:'',perfil:'admin'},
  {id:'liquidacion',label:'Liquidacion',icon:'📝',perfil:'admin'},
  {id:'reporte_general',label:'Reporte General',icon:'',perfil:'admin'},
  {id:'empleados',label:'Empleados',icon:'👥',perfil:'admin'},
  {id:'nomina',label:'N\u00F3mina',icon:'',perfil:'admin'},
  {id:'capacitacion',label:'Capacitacion',icon:'',perfil:'admin'},
  {id:'aumentos',label:'Aumentos Salariales',icon:'',perfil:'admin'},
  {section:'Finanzas'},
  {id:'bancos',label:'Bancos',icon:'🏦',perfil:'admin'},
  {id:'servicios',label:'Servicios Fijos',icon:'📌',perfil:'admin'},
  {id:'viaticos',label:'Viaticos y Gastos',icon:'🧾',perfil:'supervisor'},
  {id:'importar_sat',label:'Facturas SAT',icon:'📥',perfil:'admin'},
  {id:'costos',label:'Costos Operativos',icon:'💰',perfil:'supervisor'},
  {id:'activos',label:'Activos/Depreciaci\u00F3n',icon:'',perfil:'admin'},
  {id:'rentabilidad',label:'Rentabilidad',icon:'📈',perfil:'admin'},
  {id:'impuestos',label:'IVA / ISR',icon:'',perfil:'admin'},
  {id:'contabilidad',label:'Contabilidad',icon:'📒',perfil:'admin'},
  {section:'Sistema'},
  {id:'licencia',label:'\uD83D\uDD11 Mi Licencia',icon:'\uD83D\uDD11',perfil:'admin'},
  {id:'whatsapp',label:'WhatsApp Bot',icon:'💬',perfil:'admin'},
  {id:'fel',label:'Facturacion FEL',icon:'',perfil:'admin'},
  {id:'auditoria',label:'Log de Auditoria',icon:'🔎',perfil:'admin'},

  {id:'import_export',label:'Importar/Exportar',icon:'',perfil:'admin'},
  {id:'usuarios',label:'Usuarios',icon:'👤',perfil:'admin'},
  {id:'pos',label:'POS / Tarjetas',icon:'💳',perfil:'admin'},
  {id:'configuracion',label:'Configuraci\u00F3n',icon:'',perfil:'admin'},
];

let currentPage='dashboard';

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
function modalRecepcion(id) {
  var clientes  = await dbGetAll('clientes');
  var vehiculos = await dbGetAll('vehiculos');
  var empleados = await dbGetAll('empleados');
  var r = id ? await dbGet('recepciones',id) : {};
  var nuevoNoREC = id ? (r.noRecepcion||'') : await generarNumeroREC();

  var cliOpts = '<option value="">Seleccionar cliente...</option>'
    + clientes.map(function(c){
      return '<option value="'+c.id+'"'+(r.clienteId===c.id?' selected':'')+'>'+c.nombre+'</option>';
    }).join('');

  var vehOpts = '<option value="">Seleccionar vehiculo...</option>'
    + vehiculos.map(function(v){
      return '<option value="'+v.id+'"'+(r.vehiculoId===v.id?' selected':'')+'>'+v.placa+' - '+v.marca+' '+v.modelo+'</option>';
    }).join('');

  var tecOpts = '<option value="">Seleccionar...</option>'
    + empleados.filter(function(e){return e.activo!==false;}).map(function(e){
      return '<option value="'+e.nombre+'"'+(r.tecnico===e.nombre?' selected':'')+'>'+e.nombre+'</option>';
    }).join('');

  var horaActual = new Date().toTimeString().slice(0,5);

  openModal('rec', id ? 'Editar Recepcion' : 'Recepcion de Vehiculo',
    '<div class="alert alert-amber" style="font-size:11px">FORMATO DE INGRESO AL TALLER</div>'
    +'<div class="form-row form-row-3">'
    +'<div class="form-group"><label>No. Recepcion</label><input id="r_no" value="'+(r.noRecepcion||('REC-'+Date.now().toString(36).toUpperCase()))+'"></div>'
    +'<div class="form-group"><label>Fecha *</label><input id="r_fec" type="date" value="'+(r.fecha||today())+'"></div>'
    +'<div class="form-group"><label>Hora</label><input id="r_hor" type="time" value="'+(r.hora||horaActual)+'"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Cliente *</label>'
    +'<select id="r_cli" onchange="filtrarVehPorCli()">'+cliOpts+'</select>'
    +'</div>'
    +'<div class="form-group"><label>Vehiculo *</label>'
    +'<select id="r_veh">'+vehOpts+'</select>'
    +'</div>'
    +'</div>'
    +'<div class="form-row form-row-3">'
    +'<div class="form-group"><label>Km entrada</label><input id="r_km" type="number" value="'+(r.kmEntrada||'')+'" placeholder="45000"></div>'
    +'<div class="form-group"><label>Combustible</label>'
    +'<select id="r_com">'
    +'<option value="E">E - Vacio</option><option value="1/4">1/4</option>'
    +'<option value="1/2"'+((!r.combustible||r.combustible==='1/2')?' selected':'')+'>1/2</option>'
    +'<option value="3/4">3/4</option><option value="F">F - Lleno</option>'
    +'</select></div>'
    +'<div class="form-group"><label>Tipo servicio</label>'
    +'<select id="r_tip">'
    +'<option value="preventivo"'+(r.tipoServicio==='preventivo'?' selected':'')+'>Preventivo</option>'
    +'<option value="correctivo"'+(r.tipoServicio==='correctivo'?' selected':'')+'>Correctivo</option>'
    +'<option value="diagnostico"'+(r.tipoServicio==='diagnostico'?' selected':'')+'>Diagnostico</option>'
    +'<option value="garantia"'+(r.tipoServicio==='garantia'?' selected':'')+'>Garantia</option>'
    +'</select></div>'
    +'</div>'
    +'<div class="form-group"><label>Motivo / Sintomas</label>'
    +'<textarea id="r_mot" placeholder="Describir el problema o servicio solicitado...">'+(r.motivo||'')+'</textarea></div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Danos preexistentes</label>'
    +'<textarea id="r_dan" style="min-height:55px" placeholder="Rayones, abolladuras...">'+(r.danosPreexistentes||'')+'</textarea></div>'
    +'<div class="form-group"><label>Accesorios entregados</label>'
    +'<textarea id="r_acc" style="min-height:55px">'+(r.accesorios||'')+'</textarea></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Quien entrega el vehiculo</label>'
    +'<input id="r_ent" value="'+(r.nombreEntrega||'')+'" placeholder="Nombre del propietario o representante"></div>'
    +'<div class="form-group"><label>Tecnico asignado</label>'
    +'<select id="r_tec">'+tecOpts+'</select></div>'
    +'</div>',
    async function(){
      var cliId = parseInt($v('r_cli'));
      var vehId = parseInt($v('r_veh'));
      if (!cliId || !vehId) { toast('Cliente y vehiculo requeridos','red'); return; }
      var cli = clientes.find(function(c){return c.id===cliId;});
      var veh = vehiculos.find(function(v){return v.id===vehId;});
      var obj = {
        noRecepcion:$v('r_no').trim(),
        fecha:$v('r_fec'), hora:$v('r_hor'),
        clienteId:cliId, clienteNombre:cli?cli.nombre:'',
        vehiculoId:vehId, placa:veh?veh.placa:'',
        vehiculoDesc:veh?(veh.marca+' '+veh.modelo+' '+(veh.anio||'')).trim():'',
        kmEntrada:parseInt($v('r_km'))||0,
        combustible:$v('r_com'),
        tipoServicio:$v('r_tip'),
        motivo:$v('r_mot').trim(),
        danosPreexistentes:$v('r_dan').trim(),
        accesorios:$v('r_acc').trim(),
        nombreEntrega:$v('r_ent').trim(),
        tecnico:$v('r_tec'),
        estado:r.estado||'recibido',
        updatedAt:nowTs()
      };
      if (id) { obj.id=id; await dbPut('recepciones',obj); }
      else { obj.createdAt=nowTs(); await dbAdd('recepciones',obj); }
      cerrarModal('rec');
      toast(id?'Recepcion actualizada':'Vehiculo recibido');
      await navTo('recepciones');
    }, true);

  // Agregar botones inline + filtrar vehiculos por cliente
  setTimeout(function(){
    agregarBotonesInline([{selectId:'r_cli',tipo:'cliente'}]);
    // Boton para crear cliente+vehiculo juntos
    var cliSel = document.getElementById('r_cli');
    if (cliSel) {
      var btn = document.createElement('button');
      btn.type='button';
      btn.className='btn btn-sm btn-primary';
      btn.style.cssText='margin-top:4px;font-size:11px';
      btn.textContent='+ Nuevo cliente + vehiculo juntos';
      btn.onclick = function(){
        crearClienteVehiculoInline(function(nuevo){
          // Agregar cliente al select
          var optC = document.createElement('option');
          optC.value=nuevo.clienteId; optC.textContent=nuevo.clienteNombre; optC.selected=true;
          cliSel.appendChild(optC);
          // Agregar vehiculo al select de vehiculos
          var vehSel = document.getElementById('r_veh');
          if (vehSel) {
            var optV = document.createElement('option');
            optV.value=nuevo.vehiculoId;
            optV.textContent=nuevo.placa+(nuevo.vehiculoDesc?' - '+nuevo.vehiculoDesc:'');
            optV.selected=true;
            vehSel.appendChild(optV);
          }
        });
      };
      cliSel.parentNode.appendChild(btn);
    }
    if (r.clienteId) filtrarVehPorCli();
  }, 150);
}

function filtrarVehPorCli() {
  var cliId = parseInt($v('r_cli'));
  if (!cliId) return;
  dbGetAll('vehiculos').then(function(vehs){
    var sel = document.getElementById('r_veh');
    if (!sel) return;
    var filtrados = vehs.filter(function(v){return v.clienteId===cliId;});
    var opts = '<option value="">Seleccionar vehiculo...</option>'
      + filtrados.map(function(v){
          return '<option value="'+v.id+'">'+v.placa+' - '+v.marca+' '+v.modelo+'</option>';
        }).join('');
    sel.innerHTML = opts;
  });
}

// ================================================================
// 4. COTIZACIONES -> OT DIRECTO
// ================================================================

async
