/* TallerPro GT — 03_fabricantes_emp.js | 403 líneas */

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
