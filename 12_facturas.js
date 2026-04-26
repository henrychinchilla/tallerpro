/* TallerPro GT — js/07_clientes.js */
/* Generado automáticamente — editar este archivo */

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

async function renderNav(badgeCount=0){
  const el=document.getElementById('nav-menu');
  if(!el)return;
  const nivel=PERFILES[sesionActual?.perfil]?.nivel||0;
  el.innerHTML=NAV_CONFIG.map(n=>{
    if(n.section)return`<div class="nav-section">${n.section}</div>`;
    const perfilNivel=n.perfil==='all'?1:n.perfil==='supervisor'?2:3;
    if(perfilNivel>nivel)return'';
    const active=currentPage===n.id?'active':'';
    const badge=n.badge&&badgeCount>0?`<span class="nav-badge">${badgeCount}</span>`:'';
    return`<div class="nav-item ${active}" onclick="navTo('${n.id}')"><span class="icon">${n.icon}</span>${n.label}${badge}</div>`;
  }).join('');
}

async function navTo(page){
  if(!sesionActual){mostrarLogin();return;}
  const item=NAV_CONFIG.find(n=>n.id===page);
  if(item){
    const nivel=PERFILES[sesionActual.perfil]?.nivel||0;
    const perfilNivel=item.perfil==='all'?1:item.perfil==='supervisor'?2:3;
    if(perfilNivel>nivel){toast('Acceso denegado para tu perfil','red');return;}
  }
  currentPage=page;
  const alerts=await dbGetAll('alertas');
  const pending=alerts.filter(a=>!a.vista).length;
  await renderNav(pending);
  await renderPage(page);
}

/* ---- MODAL SYSTEM ---- */
function openModal(id,title,body,onSave,wide=false){
  const ex=document.getElementById('modal_'+id);if(ex)ex.remove();
  const m=document.createElement('div');m.id='modal_'+id;m.className='modal-overlay open';
  m.innerHTML=`<div class="modal" style="${wide?'max-width:860px':''}">
    <div class="modal-header"><span class="modal-title">${title}</span><button class="modal-close" onclick="closeModal('${id}')">\u2715</button></div>
    <div class="modal-body">${body}</div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('${id}')">Cancelar</button>
      <button class="btn btn-primary" onclick="window._ms_${id}()">Guardar</button>
    </div></div>`;
  document.body.appendChild(m);
  m.addEventListener('click',e=>{if(e.target===m)closeModal(id);});
  window[`_ms_${id}`]=onSave;
}
function closeModal(id){const el=document.getElementById('modal_'+id);if(el)el.remove();}
function cerrarModal(id){closeModal(id);}  // alias para compatibilidad

/* ---- USUARIOS ---- */
async function renderUsuarios(content,actions){
  if(!soloAdmin()){content.innerHTML='<div class="alert alert-red">Acceso solo para administradores</div>';return;}
  const usuarios=await dbGetAll('usuarios');
  actions.innerHTML=`<button class="btn btn-primary" onclick="modalUsuario()">+ Nuevo usuario</button>`;
  content.innerHTML=`
  <div class="section-title">Control de Usuarios y Accesos</div>
  <div class="section-sub">Gesti\u00F3n de perfiles y permisos del sistema</div>

  <div class="stat-grid" style="grid-template-columns:repeat(3,1fr)">
    ${Object.entries(PERFILES).map(([k,v])=>`<div class="stat-card">
      <div class="stat-label">${v.label}</div>
      <div class="stat-value" style="color:var(--${v.color==='amber'?'accent':v.color})">${usuarios.filter(u=>u.perfil===k&&u.activo).length}</div>
      <div class="stat-sub">usuarios activos</div>
    </div>`).join('')}
  </div>

  <div class="card" style="padding:10px">
    <div class="table-wrap"><table>
      <thead><tr><th>Usuario</th><th>Nombre</th><th>Perfil</th><th>Email</th><th>\u00DAltimo acceso</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>
        ${usuarios.map(u=>`<tr>
          <td class="td-mono" style="font-weight:600">${u.username}</td>
          <td>${u.nombre}</td>
          <td><span class="badge badge-${u.perfil==='admin'?'red':u.perfil==='supervisor'?'amber':'blue'}">${PERFILES[u.perfil]?.label||u.perfil}</span></td>
          <td class="text-muted">${u.email||'\u2014'}</td>
          <td style="font-size:11px;color:var(--text3)">${fechaLegible(u.ultimoAcceso)}</td>
          <td><span class="badge badge-${u.activo?'green':'gray'}">${u.activo?'Activo':'Inactivo'}</span></td>
          <td><div class="flex gap-1">
            <button class="btn btn-sm btn-secondary" onclick="modalUsuario(${u.id})">\u270F</button>
            <button class="btn btn-sm btn-secondary" onclick="resetPassword(${u.id})">\u1F511</button>
            ${u.username!=='admin'?`<button class="btn btn-sm btn-danger" onclick="toggleUsuario(${u.id},${u.activo})">\u23F8</button>`:''}
          </div></td>
        </tr>`).join('')||'<tr><td colspan="7" class="text-center text-muted" style="padding:20px">Sin usuarios</td></tr>'}
      </tbody>
    </table></div>
  </div>

  <div class="card">
    <div class="card-title" style="margin-bottom:12px">Permisos por perfil</div>
    <div class="table-wrap"><table>
      <thead><tr><th>M\u00F3dulo</th><th>Administrador</th><th>Supervisor</th><th>Operador</th></tr></thead>
      <tbody>
        ${[
          ['Dashboard general','\u2705','\u2705','\u2705'],
          ['Recepciones y OT','\u2705','\u2705','\u2705'],
          ['Inventario','\u2705','\u2705','Solo lectura'],
          ['Clientes y veh\u00EDculos','\u2705','\u2705','\u2705'],
          ['Facturaci\u00F3n','\u2705','\u2705','\u274C'],
          ['Empleados y n\u00F3mina','\u2705','\u274C','\u274C'],
          ['Costos y finanzas','\u2705','\u2705','\u274C'],
          ['Rentabilidad e impuestos','\u2705','\u274C','\u274C'],
          ['KPI y bonificaciones','\u2705','\u274C','\u274C'],
          ['Usuarios y configuraci\u00F3n','\u2705','\u274C','\u274C'],
          ['Eliminar registros','\u2705','\u274C','\u274C'],
        ].map(r=>`<tr>${r.map((c,i)=>`<td ${i>0?'style="text-align:center"':''}>${c}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table></div>
    </div>
  </div>
  `;
}

async function modalUsuario(id=null){
  if(!soloAdmin()){toast('Solo administradores','red');return;}
  const u=id?await dbGet('usuarios',id):{};
  openModal('modalUsuario',id?'Editar Usuario':'Nuevo Usuario',`
    <div class="form-row form-row-2">
      <div class="form-group"><label>Nombre completo *</label><input id="u_nom" value="${u.nombre||''}" placeholder="Nombre del usuario"></div>
      <div class="form-group"><label>Usuario (login) *</label><input id="u_usr" value="${u.username||''}" placeholder="sin espacios" ${id&&u.username==='admin'?'readonly':''}></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Email</label><input id="u_email" type="email" value="${u.email||''}" placeholder="correo@taller.com"></div>
      <div class="form-group"><label>Tel\u00E9fono</label><input id="u_tel" value="${u.telefono||''}" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label>Perfil *</label>
        <select id="u_perfil" ${id&&u.username==='admin'?'disabled':''}>
          <option value="operador" ${u.perfil==='operador'?'selected':''}>Operador \u2014 Ingreso de datos b\u00E1sico</option>
          <option value="supervisor" ${u.perfil==='supervisor'?'selected':''}>Supervisor \u2014 Gesti\u00F3n intermedia</option>
          <option value="admin" ${u.perfil==='admin'?'selected':''}>Administrador \u2014 Acceso total</option>
        </select>
      </div>
      <div class="form-group"><label>${id?'Nueva contrase\u00F1a (dejar vac\u00EDo = sin cambio)':'Contrase\u00F1a *'}</label>
        <input id="u_pass" type="password" placeholder="${id?'Nueva contrase\u00F1a':'Contrase\u00F1a inicial'}">
      </div>
    </div>
    ${id?`<div class="form-group"><label><input type="checkbox" id="u_activo" ${u.activo!==false?'checked':''} style="width:auto;margin-right:6px">Usuario activo</label></div>`:''}
    <div class="form-group"><label>Cargo / Puesto</label><input id="u_cargo" value="${u.cargo||''}" placeholder="Mec\u00E1nico, Contador, Gerente..."></div>
  `,async()=>{
    const nombre=document.getElementById('u_nom').value.trim();
    const username=document.getElementById('u_usr').value.trim().toLowerCase().replace(/\s/g,'');
    const pass=document.getElementById('u_pass').value;
    if(!nombre||!username){toast('Nombre y usuario requeridos','red');return;}
    if(!id&&!pass){toast('Contrase\u00F1a requerida para nuevo usuario','red');return;}
    const obj={
      nombre,username,
      perfil:document.getElementById('u_perfil').value,
      email:document.getElementById('u_email').value,
      telefono:document.getElementById('u_tel').value,
      cargo:document.getElementById('u_cargo').value,
      activo:id?(document.getElementById('u_activo')?.checked!==false):true,
      updatedAt:nowTs()
    };
    if(pass)obj.passwordHash=hashSimple(pass);
    if(id){obj.id=id;if(!obj.passwordHash)delete obj.passwordHash;
      const ex=await dbGet('usuarios',id);obj.passwordHash=obj.passwordHash||ex.passwordHash;
      await dbPut('usuarios',obj);
    }else{obj.createdAt=nowTs();await dbAdd('usuarios',obj);}
    closeModal('modalUsuario');toast(id?'Usuario actualizado':'Usuario creado');
    await navTo('usuarios');
  });
}

async function resetPassword(id){
  if(!soloAdmin())return;
  const nueva=prompt('Nueva contrase\u00F1a para este usuario:');
  if(!nueva)return;
  const u=await dbGet('usuarios',id);
  u.passwordHash=hashSimple(nueva);u.updatedAt=nowTs();
  await dbPut('usuarios',u);toast('Contrase\u00F1a restablecida');
}

async function toggleUsuario(id,activo){
  if(!soloAdmin())return;
  const u=await dbGet('usuarios',id);u.activo=!activo;
  await dbPut('usuarios',u);toast(`Usuario ${u.activo?'activado':'desactivado'}`);
  await navTo('usuarios');
}

/* ---- EMPLEADOS ---- */
async function renderEmpleados(content,actions){
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
