/* ============================================================
   TallerPro GT — 05_clientes.js
   Módulo independiente — no modificar estructura de archivos
============================================================ */

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
