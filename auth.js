/* TallerPro GT — js/configuracion.js
   Módulo independiente — cada archivo tiene funciones específicas
   Para editar: modificar solo este archivo y recargar
*/

function renderUsuarios(content,actions){
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
async function renderConfiguracion(content, actions) {
  if (!soloAdmin()) { content.innerHTML='<div class="alert alert-red">Solo administradores</div>'; return; }
  var cfg   = await dbGet('config','taller') || {};
  var notif = await dbGet('config','notificaciones') || {};
  var logoData = localStorage.getItem('tpgt_logo') || '';
  actions.innerHTML = '<button class="btn btn-primary" onclick="guardarConfigCompleta()">Guardar todo</button> <button class="btn btn-secondary" onclick="resetearBaseDatos()" style="background:var(--red-dim);color:var(--red);border-color:var(--red)">🗑 Reiniciar DB</button>';

  content.innerHTML =
    '<div class="section-title">Configuracion</div>'

    // DATOS EMPRESA
    + '<div class="card"><div class="card-title" style="margin-bottom:14px">Datos de la empresa</div>'
    + '<div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:14px">'
    // Logo
    + '<div style="text-align:center;flex-shrink:0">'
    +   '<div style="width:90px;height:90px;border-radius:10px;border:2px dashed var(--border2);background:var(--bg3);display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:8px">'
    +     '<img id="logo_preview" src="'+(logoData||'')+'" style="max-width:100%;max-height:100%;object-fit:contain;display:'+(logoData?'block':'none')+'">'
    +     '<span id="logo_placeholder" style="font-size:11px;color:var(--text3);'+(logoData?'display:none':'')+'">'
    +       'Sin logo</span>'
    +   '</div>'
    +   '<button class="btn btn-sm btn-secondary" onclick="cargarLogoEmpresa()" style="display:block;width:90px;margin-bottom:4px">Subir logo</button>'
    +   '<button class="btn btn-sm btn-danger" onclick="borrarLogo()" style="display:block;width:90px">Quitar</button>'
    +   '<div class="form-hint" style="width:90px;margin-top:4px">Max 500KB</div>'
    + '</div>'
    // Campos
    + '<div style="flex:1">'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Nombre del taller / empresa *</label><input id="cfg_nombre" value="'+(cfg.nombre||'')+'" placeholder="Nombre completo"></div>'
    + '<div class="form-group"><label>NIT *</label><input id="cfg_nit" value="'+(cfg.nit||'')+'" placeholder="NIT sin guion"></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Telefono</label><input id="cfg_tel" value="'+(cfg.telefono||'')+'" placeholder="+502 2222-3333" onblur="onTelBlur(this)"></div>'
    + '<div class="form-group"><label>Email</label><input id="cfg_email" value="'+(cfg.email||'')+'" placeholder="info@taller.com"></div>'
    + '</div>'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Direccion</label><input id="cfg_dir" value="'+(cfg.direccion||'')+'" placeholder="Direccion completa, Guatemala"></div>'
    + '<div class="form-group"><label>Pie de pagina en facturas</label><input id="cfg_pie" value="'+(cfg.piePagina||'')+'" placeholder="Gracias por su preferencia"></div>'
    + '</div>'
    + '</div></div>'
    + '</div>'

    // PARAMETROS OPERATIVOS
    + '<div class="card"><div class="card-title" style="margin-bottom:12px">Parametros operativos</div>'
    + '<div class="form-row form-row-3">'
    + '<div class="form-group"><label>Tarifa hora mano de obra (Q)</label><input id="cfg_tarifa" type="number" value="'+(cfg.tarifaHora||150)+'" min="0"></div>'
    + '<div class="form-group"><label>Margen minimo inventario (%)</label><input id="cfg_margen" type="number" value="'+(cfg.margenMin||20)+'" min="0"></div>'
    + '<div class="form-group"><label>Timeout sesion (minutos)</label><input id="cfg_timeout" type="number" value="'+(cfg.timeoutMinutos||15)+'" min="1" max="480"></div>'
    + '</div></div>'

    // NOTIFICACIONES WA
    + '<div class="card"><div class="card-title" style="margin-bottom:12px">Notificaciones WhatsApp &mdash; Numeros de la empresa</div>'
    + '<div class="alert alert-blue" style="font-size:11px">Las alertas urgentes se enviaran a estos numeros. Todos deben tener CallMeBot activado (+34 644 44 00 05).</div>'
    + '<div class="form-row form-row-3">'
    + '<div class="form-group"><label>Gerente / Propietario</label><input id="cfg_gerente" value="'+(notif.numGerente||'')+'" placeholder="+502 5555-0001"></div>'
    + '<div class="form-group"><label>Administrador</label><input id="cfg_admin" value="'+(notif.numAdmin||'')+'" placeholder="+502 5555-0002"></div>'
    + '<div class="form-group"><label>Jefe de Taller</label><input id="cfg_jefe" value="'+(notif.numJefeTaller||'')+'" placeholder="+502 5555-0003"></div>'
    + '</div>'
    + '<div class="form-group"><label><input type="checkbox" id="cfg_envwa" '+(notif.enviarWA?'checked':'')+' style="width:auto;margin-right:6px"> Enviar alertas automaticas por WhatsApp</label></div>'
    + '</div>'

    // TEMA
    + '<div id="tema_wrap_cfg"></div>';

  // Cargar selector de tema
  var tw = document.getElementById('tema_wrap_cfg');
  if (tw) tw.innerHTML = renderSelectorTema();
  // Mostrar placeholder si no hay logo
  var lph = document.getElementById('logo_placeholder');
  if (lph && logoData) lph.style.display = 'none';
  // Agregar sección zona de peligro
  var cfgContent = document.getElementById('main-content') || document.querySelector('.main-content');
  var dangerCard = document.createElement('div');
  dangerCard.className = 'card';
  dangerCard.style.cssText = 'margin-top:12px;border:1px solid rgba(224,90,78,.35)';
  dangerCard.innerHTML = '<div class="card-title" style="color:var(--red)">⚠ Zona de peligro</div>'
    + '<div style="font-size:12px;color:var(--text2);margin-bottom:12px;line-height:1.7">Reinicia la base de datos eliminando todos los datos del taller. La licencia NO se borra.</div>'
    + '<button onclick="mostrarZonaPeligroCfg()" style="background:var(--red);color:#fff;border:none;border-radius:6px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer">🗑 Reiniciar base de datos</button>';
  if (cfgContent) cfgContent.appendChild(dangerCard);
}




function guardarConfigCompleta() {
  var nombre = (document.getElementById("cfg_nombre")||{}).value||"";
  if (!nombre.trim()) { toast("El nombre del taller es requerido","red"); return; }
  var cfg = {
    key: "taller",
    nombre:        nombre.trim(),
    nit:           ((document.getElementById("cfg_nit")||{}).value||"").trim(),
    telefono:      ((document.getElementById("cfg_tel")||{}).value||"").trim(),
    email:         ((document.getElementById("cfg_email")||{}).value||"").trim(),
    direccion:     ((document.getElementById("cfg_dir")||{}).value||"").trim(),
    piePagina:     ((document.getElementById("cfg_pie")||{}).value||"").trim(),
    tarifaHora:    parseFloat((document.getElementById("cfg_tarifa")||{}).value||150),
    margenMin:     parseFloat((document.getElementById("cfg_margen")||{}).value||20),
    timeoutMinutos:parseInt((document.getElementById("cfg_timeout")||{}).value||15),
    updatedAt:     nowTs()
  };
  var notif = {
    key:        "notificaciones",
    numGerente: ((document.getElementById("cfg_gerente")||{}).value||"").trim(),
    numAdmin:   ((document.getElementById("cfg_admin")||{}).value||"").trim(),
    numJefeTaller: ((document.getElementById("cfg_jefe")||{}).value||"").trim(),
    enviarWA:   !!(document.getElementById("cfg_envwa")||{}).checked
  };
  await dbPut("config", cfg);
  await dbPut("config", notif);
  // Actualizar nombre en sidebar
  var el = document.getElementById("sidebar-empresa-nombre");
  if (el) el.textContent = cfg.nombre;
  toast("Configuracion guardada correctamente");
}

// ================================================================

/* ================================================================
   MÓDULO POS - PAGOS CON TARJETA
   Visanet GT / Credomatic BAC / PayWay Banrural
   ================================================================ */

// Config de procesadores (se guardan en IndexedDB config/pos)
var POS_PROCESADORES = {
  visanet: {
    nombre: 'Visanet Guatemala',
    logo: '💳',
    color: '#1a1f71',
    instrucciones: 'Requiere afiliación con Visanet GT. Contacta al 1801-VISANET.',
    campos: ['merchantId','terminalId','apiKey'],
    labels: ['Merchant ID','Terminal ID','API Key (sandbox/producción)'],
    sandbox_url: 'https://api-sandbox.visanet.com.gt/v1/payment',
    prod_url: 'https://api.visanet.com.gt/v1/payment'
  },
  credomatic: {
    nombre: 'Credomatic / BAC',
    logo: '🏦',
    color: '#e31837',
    instrucciones: 'Requiere cuenta empresarial BAC Credomatic. Tel: 1550.',
    campos: ['merchantId','apiKey','secretKey'],
    labels: ['Merchant ID','API Key','Secret Key'],
    sandbox_url: 'https://epayment-uat.baccredomatic.com/api/payment',
    prod_url: 'https://epayment.baccredomatic.com/api/payment'
  },
  payway: {
    nombre: 'PayWay Banrural',
    logo: '🌾',
    color: '#006633',
    instrucciones: 'Requiere cuenta empresarial Banrural. Tel: 1500-RURAL.',
    campos: ['commerceCode','terminalId','apiKey'],
    labels: ['Código de Comercio','Terminal ID','API Key'],
    sandbox_url: 'https://sandbox.payway.com.gt/api/v1/charge',
    prod_url: 'https://api.payway.com.gt/v1/charge'
  }
};

async function getPosConfig() {
  return await dbGet('config','pos') || { procesador: 'visanet', ambiente: 'sandbox' };
}

async function guardarConfigPos() {
  var proc = (document.getElementById('pos_procesador')||{}).value || 'visanet';
  var obj = {
    key: 'pos',
    procesador: proc,
    ambiente: (document.getElementById('pos_ambiente')||{}).value || 'sandbox',
    paypalUser: (document.getElementById('pos_paypalUser')||{value:''}).value.trim(),
    merchantId: (document.getElementById('pos_merchantId')||{value:''}).value.trim(),
    terminalId: (document.getElementById('pos_terminalId')||{value:''}).value.trim(),
    apiKey: (document.getElementById('pos_apiKey')||{value:''}).value.trim(),
    secretKey: (document.getElementById('pos_secretKey')||{value:''}).value.trim(),
    commerceCode: (document.getElementById('pos_commerceCode')||{value:''}).value.trim(),
    updatedAt: nowTs()
  };
  await dbPut('config', obj);
  toast('Configuración POS guardada');
}

// ── Procesar pago con tarjeta ────────────────────────────────────
async function procesarPagoTarjeta(monto, descripcion, onExito, onError) {
  var cfg = await getPosConfig();
  var proc = POS_PROCESADORES[cfg.procesador];
  if (!proc) { onError('Procesador no configurado'); return; }
  if (!cfg.apiKey) { 
    toast('Configura el POS en Configuración → POS / Tarjetas', 'red'); 
    return; 
  }

  var url = cfg.ambiente === 'produccion' ? proc.prod_url : proc.sandbox_url;
  var ref = 'TP-' + Date.now();

  // Mostrar modal de procesando
  var overlay = document.createElement('div');
  overlay.id = 'pos_overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;display:flex;align-items:center;justify-content:center';
  overlay.innerHTML = '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:32px;text-align:center;max-width:340px;width:90%">'
    + '<div style="font-size:40px;margin-bottom:12px">' + proc.logo + '</div>'
    + '<div style="font-size:16px;font-weight:700;margin-bottom:6px">' + proc.nombre + '</div>'
    + '<div style="font-size:24px;font-weight:700;color:var(--green);margin-bottom:16px">Q ' + Number(monto).toFixed(2) + '</div>'
    + '<div id="pos_status" style="font-size:13px;color:var(--text2);margin-bottom:20px">Conectando con terminal...</div>'
    + '<div style="display:flex;gap:10px;justify-content:center">'
    + '<button onclick="cancelarPagoTarjeta()" style="background:var(--red-dim);color:var(--red);border:1px solid rgba(224,90,78,.3);border-radius:6px;padding:8px 20px;cursor:pointer;font-size:13px">Cancelar</button>'
    + '</div></div>';
  document.body.appendChild(overlay);

  try {
    // Construir payload según procesador
    var payload = {};
    if (cfg.procesador === 'visanet') {
      payload = {
        merchantId: cfg.merchantId, terminalId: cfg.terminalId,
        amount: Number(monto).toFixed(2), currency: 'GTQ',
        reference: ref, description: descripcion,
        transactionType: 'SALE'
      };
    } else if (cfg.procesador === 'credomatic') {
      payload = {
        merchant_id: cfg.merchantId, amount: Number(monto).toFixed(2),
        currency: 'GTQ', order_id: ref, description: descripcion,
        transaction_type: 'sale'
      };
    } else if (cfg.procesador === 'payway') {
      payload = {
        commerce_code: cfg.commerceCode, terminal_id: cfg.terminalId,
        amount: Number(monto).toFixed(2), currency: 'GTQ',
        reference: ref, description: descripcion
      };
    }

    var upd = document.getElementById('pos_status');
    if (upd) upd.textContent = 'Enviando a terminal POS...';

    // En sandbox: simular respuesta exitosa (los bancos GT requieren integración presencial)
    if (cfg.ambiente === 'sandbox') {
      await new Promise(r => setTimeout(r, 2000)); // simular latencia
      document.body.removeChild(document.getElementById('pos_overlay'));
      onExito({ ref: ref, autorizacion: 'AUTH-' + Math.floor(Math.random()*999999), procesador: proc.nombre, monto: monto });
      return;
    }

    // Producción: llamada real al API
    var headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.apiKey };
    if (cfg.secretKey) headers['X-Secret-Key'] = cfg.secretKey;

    var resp = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(payload) });
    var data = await resp.json();
    document.body.removeChild(document.getElementById('pos_overlay'));

    if (resp.ok && (data.status === 'approved' || data.approved || data.success)) {
      onExito({ ref: ref, autorizacion: data.authorization_code || data.authCode || data.reference, procesador: proc.nombre, monto: monto });
    } else {
      onError(data.message || data.error || 'Pago rechazado. Intenta de nuevo.');
    }
  } catch(e) {
    if (document.getElementById('pos_overlay')) document.body.removeChild(document.getElementById('pos_overlay'));
    onError('Error de conexión con el procesador: ' + e.message);
  }
}

function cancelarPagoTarjeta() {
  var overlay = document.getElementById('pos_overlay');
  if (overlay) document.body.removeChild(overlay);
  toast('Pago con tarjeta cancelado', 'red');
}

// ── Modal de pago en facturación ─────────────────────────────────
async function abrirModalPago(total, facId, onPagado) {
  var cfg = await getPosConfig();
  var proc = POS_PROCESADORES[cfg.procesador] || POS_PROCESADORES.visanet;
  var montoFmt = 'Q ' + Number(total).toFixed(2);
  var cuerpo = '<div style="text-align:center;margin-bottom:20px">'
    + '<div style="font-size:13px;color:var(--text2);margin-bottom:4px">Total a cobrar</div>'
    + '<div style="font-size:32px;font-weight:700;color:var(--green)">' + montoFmt + '</div>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">'
    + '<button onclick="window._doPago(\'efectivo\')" style="background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:16px;cursor:pointer;font-size:13px;color:var(--text)">'
    + '<div style="font-size:28px;margin-bottom:6px">💵</div><div style="font-weight:600">Efectivo</div></button>'
    + '<button onclick="window._doPago(\'tarjeta\')" style="background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:16px;cursor:pointer;font-size:13px;color:var(--text)">'
    + '<div style="font-size:28px;margin-bottom:6px">' + proc.logo + '</div>'
    + '<div style="font-weight:600">Tarjeta</div>'
    + '<div style="font-size:10px;color:var(--text3);margin-top:2px">' + proc.nombre + '</div></button>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'
    + '<button onclick="window._doPago(\'transferencia\')" style="background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:16px;cursor:pointer;font-size:13px;color:var(--text)">'
    + '<div style="font-size:28px;margin-bottom:6px">🏦</div><div style="font-weight:600">Transferencia</div></button>'
    + '<button onclick="window._doPago(\'cheque\')" style="background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:16px;cursor:pointer;font-size:13px;color:var(--text)">'
    + '<div style="font-size:28px;margin-bottom:6px">📄</div><div style="font-weight:600">Cheque</div></button>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + '<button onclick="window._doPago(\'paypal\')" style="background:#003087;border:1px solid #0070ba;border-radius:10px;padding:16px;cursor:pointer;font-size:13px;color:#fff">'
    + '<div style="font-size:22px;font-weight:700;margin-bottom:4px;font-style:italic">PayPal</div><div style="font-size:11px;opacity:.8">Pago en línea</div></button>'
    + '<button onclick="window._doPago(\'googlepay\')" style="background:#1a1a1a;border:1px solid #333;border-radius:10px;padding:16px;cursor:pointer;font-size:13px;color:#fff">'
    + '<div style="font-size:20px;font-weight:700;margin-bottom:4px"><span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC04">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span> Pay</div><div style="font-size:11px;opacity:.6">Tap to pay</div></button>'
    + '</div>';
  window._doPago = async function(forma) {
    cerrarModal('modal_pago');
    if (forma === 'tarjeta') await pagarTarjeta(total, facId);
    else if (forma === 'paypal') await pagarPayPal(total, facId);
    else if (forma === 'googlepay') await pagarGooglePay(total, facId);
    else await registrarPagoFac(facId, total, forma, null);
  };
  window._facPagoCallback = onPagado;
  openModal('modal_pago', 'Registrar pago', cuerpo, function(){}, false);
}


async function pagarEfectivo(total, facId) {
  cerrarModal('modal_pago');
  await registrarPagoFac(facId, total, 'efectivo', null);
}

async function pagarTransferencia(total, facId) {
  cerrarModal('modal_pago');
  await registrarPagoFac(facId, total, 'transferencia', null);
}

async function pagarCheque(total, facId) {
  cerrarModal('modal_pago');
  await registrarPagoFac(facId, total, 'cheque', null);
}

async function pagarTarjeta(total, facId) {
  cerrarModal('modal_pago');
  await procesarPagoTarjeta(total, 'Pago factura TallerPro',
    async function(resultado) {
      toast('✓ Pago aprobado — Auth: ' + resultado.autorizacion + ' vía ' + resultado.procesador);
      await registrarPagoFac(facId, total, 'tarjeta', resultado);
    },
    function(error) {
      toast(error, 'red');
    }
  );
}


async function pagarPayPal(total, facId) {
  // Abrir PayPal.me o link de pago configurado
  var cfg = await getPosConfig();
  var paypalUser = cfg.paypalUser || '';
  if (!paypalUser) {
    toast('Configura tu usuario de PayPal en POS / Tarjetas', 'amber');
    return;
  }
  var url = 'https://www.paypal.me/' + paypalUser + '/' + Number(total).toFixed(2) + 'GTQ';
  window.open(url, '_blank');
  // Marcar como pendiente de confirmación
  openModal('confirm_paypal', 'Confirmar pago PayPal',
    '<div class="alert alert-blue">Se abrió PayPal. ¿Ya se completó el pago?</div>',
    null, false);
  setTimeout(function() {
    var f = document.querySelector('#confirm_paypal .modal-footer');
    if (f) f.innerHTML = '<button class="btn btn-secondary" onclick="cerrarModal(\'confirm_paypal\')">No, cancelar</button>'
      + '<button class="btn btn-primary" onclick="cerrarModal(\'confirm_paypal\');registrarPagoFac(\''+facId+'\','+total+',\'paypal\',null)">Sí, pago recibido</button>';
  }, 50);
}

async function pagarGooglePay(total, facId) {
  // Google Pay requiere integración con un PSP (Stripe, etc.)
  // Por ahora mostrar instrucciones
  openModal('info_gpay', 'Google Pay', 
    '<div class="alert alert-blue" style="margin-bottom:12px">Google Pay requiere integración con un procesador de pagos (Stripe o PaymentRequest API).</div>'
    + '<div style="font-size:12px;color:var(--text2);line-height:1.8">'
    + '<strong>Para activarlo necesitas:</strong><br>'
    + '1. Cuenta en Stripe (stripe.com) — disponible en GT<br>'
    + '2. API keys de Stripe en configuración POS<br>'
    + '3. Activar Google Pay en tu cuenta Stripe<br><br>'
    + 'Mientras tanto puedes usar Tarjeta o Transferencia.</div>',
    null, false);
}

async function registrarPagoFac(facId, total, forma, posData) {
  if (!facId) return;
  var fac = await dbGet('facturas', parseInt(facId));
  if (!fac) return;
  fac.pagada = true;
  fac.formaPago = forma;
  fac.fechaPago = today();
  if (posData) {
    fac.posAutorizacion = posData.autorizacion;
    fac.posProcesador = posData.procesador;
    fac.posRef = posData.ref;
  }
  await dbPut('facturas', fac);
  toast('Factura marcada como pagada ✓');
  if (window._facPagoCallback) window._facPagoCallback();
  await navTo('facturacion');
}

// ── Render configuración POS ─────────────────────────────────────
async function renderConfigPos(content, actions) {
  var cfg = await getPosConfig();
  actions.innerHTML = '<button class="btn btn-primary" onclick="guardarConfigPos()">Guardar configuración</button>';
  var proc = cfg.procesador || 'visanet';

  content.innerHTML = '<div class="section-title">POS / Pagos con tarjeta</div>'
    + '<div class="section-sub">Configura tu procesador de pagos para cobrar con tarjeta de crédito o débito</div>'
    + '<div class="card">'
    + '<div class="form-row form-row-2">'
    + '<div class="form-group"><label>Procesador de pagos</label>'
    + '<select id="pos_procesador" onchange="recargarFormPos()">'
    + Object.entries(POS_PROCESADORES).map(function(e){ return '<option value="'+e[0]+'"'+(proc===e[0]?' selected':'')+'>'+e[1].logo+' '+e[1].nombre+'</option>'; }).join('')
    + '</select></div>'
    + '<div class="form-group"><label>Ambiente</label>'
    + '<select id="pos_ambiente">'
    + '<option value="sandbox"'+(cfg.ambiente==='sandbox'?' selected':'')+'>🧪 Sandbox (pruebas)</option>'
    + '<option value="produccion"'+(cfg.ambiente==='produccion'?' selected':'')+'>🚀 Producción (real)</option>'
    + '</select></div>'
    + '</div>'
    + '<div class="alert alert-blue" style="font-size:11px">' + (POS_PROCESADORES[proc]||POS_PROCESADORES.visanet).instrucciones + '</div>'
    + '<div id="pos_campos_wrap">' + renderCamposPos(proc, cfg) + '</div>'
    + '</div>'
    + '<div class="card"><div class="card-title" style="margin-bottom:10px">¿Cómo funciona?</div>'
    + '<div style="font-size:12px;color:var(--text2);line-height:1.8">'
    + '1. En <strong>Sandbox</strong> los pagos son simulados — úsalo para probar.<br>'
    + '2. En <strong>Producción</strong> se conecta al API real del banco — requiere afiliación activa.<br>'
    + '3. Al registrar una factura aparece el botón <strong>Cobrar</strong> con opción de tarjeta.<br>'
    + '4. El sistema guarda el código de autorización en la factura automáticamente.</div>'
    + '</div>';
}

function renderCamposPos(proc, cfg) {
  var p = POS_PROCESADORES[proc] || POS_PROCESADORES.visanet;
  return p.campos.map(function(campo, i) {
    return '<div class="form-group"><label>'+p.labels[i]+'</label>'
      + '<input id="pos_'+campo+'" value="'+(cfg[campo]||'')+'" placeholder="'+p.labels[i]+'" type="'+(campo.toLowerCase().includes('key')||campo.toLowerCase().includes('secret')?'password':'text')+'">'
      + '</div>';
  }).join('');
}

function recargarFormPos() {
  var proc = (document.getElementById('pos_procesador')||{}).value || 'visanet';
  var wrap = document.getElementById('pos_campos_wrap');
  if (wrap) wrap.innerHTML = renderCamposPos(proc, {});
}

// MODULO A: Creacion inline, Envios, Cotizador, Budget, Flota Dashboard
// ================================================================

// ---- HELPER: MODAL RAPIDO PARA CREAR REGISTRO SIN SALIR ----
// Usado en formularios que necesitan cliente/proveedor/empleado no existente

async function crearClienteInline(onCreado) {
  openModal('cli_inline','Nuevo Cliente (rapido)',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Nombre *</label><input id="ci_nom" placeholder="Nombre completo"></div>'
    +'<div class="form-group"><label>NIT</label><input id="ci_nit" placeholder="CF"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Telefono</label><input id="ci_tel" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>'
    +'<div class="form-group"><label>WhatsApp</label><input id="ci_wa" placeholder="+502 5555-0000"></div>'
    +'</div>'
    +'<div class="form-group"><label>Email</label><input id="ci_email" type="email"></div>',
    async function(){
      var nom=document.getElementById('ci_nom').value.trim();
      if(!nom){toast('Nombre requerido','red');return;}
      var id=await dbAdd('clientes',{nombre:nom,nit:document.getElementById('ci_nit').value.trim()||'CF',
        telefono:document.getElementById('ci_tel').value.trim(),
        whatsapp:document.getElementById('ci_wa').value.trim(),
        email:document.getElementById('ci_email').value.trim(),
        tipo:'persona',createdAt:nowTs()});
      cerrarModal('cli_inline');
      toast('Cliente creado');
      if(onCreado) onCreado({id:id,nombre:nom});
    },true);
}

async function crearProveedorInline(onCreado) {
  openModal('prov_inline','Nuevo Proveedor (rapido)',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Empresa *</label><input id="pi_emp" placeholder="Nombre de la empresa"></div>'
    +'<div class="form-group"><label>NIT</label><input id="pi_nit" placeholder="NIT"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Contacto</label><input id="pi_con" placeholder="Vendedor"></div>'
    +'<div class="form-group"><label>Telefono</label><input id="pi_tel" placeholder="+502 2222-3333" onblur="onTelBlur(this)"></div>'
    +'</div>',
    async function(){
      var emp=document.getElementById('pi_emp').value.trim();
      if(!emp){toast('Nombre requerido','red');return;}
      var id=await dbAdd('proveedores',{empresa:emp,nit:document.getElementById('pi_nit').value.trim(),
        contacto:document.getElementById('pi_con').value.trim(),
        telefono:document.getElementById('pi_tel').value.trim(),
        categoria:'General',calificacion:'0',createdAt:nowTs()});
      cerrarModal('prov_inline');
      toast('Proveedor creado');
      if(onCreado) onCreado({id:id,empresa:emp});
    },true);
}

async function renderAuditoria(content, actions) {
  if (!soloAdmin()) { content.innerHTML='<div class="alert alert-red">Solo administradores</div>'; return; }
  var logs = await dbGetAll('auditoria');
  logs.sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;});
  actions.innerHTML =
    '<button class="btn btn-secondary" onclick="exportarCSV(\'auditoria\')">Exportar CSV</button>'
    + ' <button class="btn btn-danger btn-sm" onclick="limpiarAuditoria()">Limpiar log</button>';

  var filtroMod = window._audFiltroMod || '';
  var filtroAcc = window._audFiltroAcc || '';

  var modulos = [...new Set(logs.map(function(l){return l.modulo||'';}).filter(Boolean))];
  var acciones = [...new Set(logs.map(function(l){return l.accion||'';}).filter(Boolean))];

  var filtrados = logs.filter(function(l){
    return (!filtroMod || l.modulo===filtroMod) && (!filtroAcc || l.accion===filtroAcc);
  });

  var coloresAcc = {crear:'green', editar:'blue', eliminar:'red', login:'amber', logout:'gray', exportar:'purple', ver:'gray'};

  var rows = filtrados.slice(0,200).map(function(l){
    return '<tr>'
      +'<td style="font-size:10px;font-family:var(--font-mono)">'+fechaLegible(l.fecha)+'</td>'
      +'<td><span class="badge badge-'+(coloresAcc[l.accion]||'gray')+'">'+( l.accion||'---')+'</span></td>'
      +'<td><span class="badge badge-gray">'+(l.modulo||'---')+'</span></td>'
      +'<td>'+(l.usuario||'---')+'</td>'
      +'<td style="font-size:11px">'+(l.descripcion||'---')+'</td>'
      +'<td style="font-size:10px;color:var(--text3);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(l.datos||'')+'</td>'
      +'</tr>';
  }).join('');

  content.innerHTML = '<div class="section-title">Log de Auditoria</div>'
    +'<div class="section-sub">Registro de todos los cambios del sistema. Solo visible para administradores.</div>'
    +'<div class="card">'
    +'<div style="display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap">'
    +'<select onchange="window._audFiltroMod=this.value;navTo(\'auditoria\')" style="width:auto;font-size:12px">'
    +'<option value="">Todos los modulos</option>'
    +modulos.map(function(m){return '<option value="'+m+'"'+(filtroMod===m?' selected':'')+'>'+m+'</option>';}).join('')
    +'</select>'
    +'<select onchange="window._audFiltroAcc=this.value;navTo(\'auditoria\')" style="width:auto;font-size:12px">'
    +'<option value="">Todas las acciones</option>'
    +acciones.map(function(a){return '<option value="'+a+'"'+(filtroAcc===a?' selected':'')+'>'+a+'</option>';}).join('')
    +'</select>'
    +'<span style="font-size:12px;color:var(--text2);align-self:center">'+filtrados.length+' registros</span>'
    +'</div>'
    +'<div class="table-wrap"><table>'
    +'<thead><tr><th>Fecha/Hora</th><th>Accion</th><th>Modulo</th><th>Usuario</th><th>Descripcion</th><th>Datos</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="6" class="text-center text-muted" style="padding:16px">Sin registros</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

async function limpiarAuditoria() {
  if (!confirm('Eliminar TODOS los registros de auditoria? Esta accion no se puede deshacer.')) return;
  var all = await dbGetAll('auditoria');
  for (var i=0;i<all.length;i++) await dbDelete('auditoria',all[i].id);
  toast('Log de auditoria limpiado');
  await navTo('auditoria');
}

// Auditoria: se registra directamente en cada operacion critica (sin hook)

// ================================================================
// 2. CREACION INLINE MEJORADA (cliente+vehiculo en OT/Recepcion)
// ================================================================

// Modal rapido cliente+vehiculo juntos (para OT y Recepciones)
async function crearClienteVehiculoInline(onCreado) {
  openModal('cliveh_inline','Nuevo Cliente y Vehiculo',
    '<div class="alert alert-blue" style="font-size:11px">Registra los datos minimos para continuar. Podras completar el resto despues.</div>'
    +'<div class="card-title" style="margin-bottom:8px">Datos del cliente</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Nombre *</label><input id="cv_cnom" placeholder="Nombre completo"></div>'
    +'<div class="form-group"><label>NIT</label><input id="cv_cnit" placeholder="CF" value="CF"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Telefono</label><input id="cv_ctel" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>'
    +'<div class="form-group"><label>WhatsApp</label><input id="cv_cwa" placeholder="+502 5555-0000"></div>'
    +'</div>'
    +'<div class="divider"></div>'
    +'<div class="card-title" style="margin-bottom:8px">Datos del vehiculo</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Placa *</label><input id="cv_vpl" placeholder="P-123ABC"></div>'
    +'<div class="form-group"><label>Marca</label><input id="cv_vmar" placeholder="Toyota, Nissan..."></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Modelo</label><input id="cv_vmod" placeholder="Hilux, Frontier..."></div>'
    +'<div class="form-group"><label>Anio</label><input id="cv_vani" type="number" placeholder="2020" min="1960" max="2035"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Color</label><input id="cv_vcol" placeholder="Blanco"></div>'
    +'<div class="form-group"><label>Km actual</label><input id="cv_vkm" type="number" placeholder="45000" min="0"></div>'
    +'</div>',
    async function(){
      var cnom = document.getElementById('cv_cnom').value.trim();
      var vpl  = document.getElementById('cv_vpl').value.trim();
      if (!cnom||!vpl){toast('Nombre del cliente y placa son requeridos','red');return;}
      var cliId = await dbAdd('clientes',{nombre:cnom,nit:document.getElementById('cv_cnit').value.trim()||'CF',
        telefono:document.getElementById('cv_ctel').value.trim(),
        whatsapp:document.getElementById('cv_cwa').value.trim(),
        tipo:'persona',createdAt:nowTs()});
      var mar = document.getElementById('cv_vmar').value.trim();
      var mod = document.getElementById('cv_vmod').value.trim();
      var vehId = await dbAdd('vehiculos',{clienteId:cliId,clienteNombre:cnom,
        placa:vpl,marca:mar,modelo:mod,
        anio:parseInt(document.getElementById('cv_vani').value)||null,
        color:document.getElementById('cv_vcol').value.trim(),
        km:parseInt(document.getElementById('cv_vkm').value)||0,
        createdAt:nowTs()});
      cerrarModal('cliveh_inline');
      toast('Cliente y vehiculo creados');
      if (onCreado) onCreado({clienteId:cliId,clienteNombre:cnom,vehiculoId:vehId,placa:vpl,vehiculoDesc:(mar+' '+mod).trim()});
    },true);
}

// ================================================================
// 3. DASHBOARDS
// ================================================================

// --- Dashboard Facturas ---
async function renderDashFacturas(content, actions) {
  var facturas = await dbGetAll('facturas');
  var hoy2 = new Date(); hoy2.setHours(0,0,0,0);
  var mesActual = today().slice(0,7);
  var anioActual = today().slice(0,4);

  // Agrupar por mes (ultimos 6 meses)
  var meses = [];
  for (var i=5;i>=0;i--) {
    var d = new Date(hoy2); d.setMonth(d.getMonth()-i);
    var m = d.toISOString().slice(0,7);
    var fMes = facturas.filter(function(f){return f.fecha&&f.fecha.startsWith(m);});
    meses.push({
      mes:m,
      total:fMes.reduce(function(a,f){return a+(f.total||0);},0),
      iva:fMes.reduce(function(a,f){return a+(f.iva||0);},0),
      count:fMes.length,
      pagadas:fMes.filter(function(f){return f.pagada;}).length
    });
  }

  var fMesAct = facturas.filter(function(f){return f.fecha&&f.fecha.startsWith(mesActual);});
  var totMes = fMesAct.reduce(function(a,f){return a+(f.total||0);},0);
  var ivaMes = fMesAct.reduce(function(a,f){return a+(f.iva||0);},0);
  var pagadas = fMesAct.filter(function(f){return f.pagada;}).length;
  var pendientes = fMesAct.filter(function(f){return !f.pagada;});
  var totPend = pendientes.reduce(function(a,f){return a+(f.total||0);},0);
  var fAnio = facturas.filter(function(f){return f.fecha&&f.fecha.startsWith(anioActual);});
  var totAnio = fAnio.reduce(function(a,f){return a+(f.total||0);},0);

  // Top clientes
  var porCliente = {};
  fAnio.forEach(function(f){
    if(!porCliente[f.clienteNombre]) porCliente[f.clienteNombre]=0;
    porCliente[f.clienteNombre]+=(f.total||0);
  });
  var topCli = Object.entries(porCliente).sort(function(a,b){return b[1]-a[1];}).slice(0,5);

  // Barras SVG simples
  var maxVal = Math.max.apply(null, meses.map(function(m){return m.total||1;}));
  var barras = meses.map(function(m,i){
    var h = Math.max(4, Math.round((m.total/maxVal)*80));
    var col = m.mes===mesActual?'var(--accent)':'var(--blue)';
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1">'
      +'<div style="font-size:9px;color:var(--text3)">Q'+(m.total/1000).toFixed(0)+'k</div>'
      +'<div style="height:'+h+'px;background:'+col+';border-radius:3px 3px 0 0;width:100%;min-height:4px"></div>'
      +'<div style="font-size:9px;color:var(--text2)">'+m.mes.slice(5)+'</div>'
      +'</div>';
  }).join('');

  content.innerHTML = '<div class="section-title">Dashboard de Facturacion</div>'
    +'<div class="stat-grid">'
    +'<div class="stat-card stat-green"><div class="stat-label">Facturado este mes</div><div class="stat-value">'+fmt(totMes)+'</div><div class="stat-sub">'+fMesAct.length+' facturas</div></div>'
    +'<div class="stat-card stat-amber"><div class="stat-label">IVA generado mes</div><div class="stat-value">'+fmt(ivaMes)+'</div><div class="stat-sub">Por declarar SAT</div></div>'
    +'<div class="stat-card stat-red"><div class="stat-label">Por cobrar</div><div class="stat-value">'+fmt(totPend)+'</div><div class="stat-sub">'+pendientes.length+' facturas</div></div>'
    +'<div class="stat-card"><div class="stat-label">Facturado '+anioActual+'</div><div class="stat-value" style="font-size:16px">'+fmt(totAnio)+'</div></div>'
    +'</div>'
    +'<div style="display:grid;grid-template-columns:2fr 1fr;gap:14px">'
    +'<div class="card"><div class="card-title" style="margin-bottom:12px">Facturacion ultimos 6 meses</div>'
    +'<div style="display:flex;align-items:flex-end;gap:6px;height:100px;padding-bottom:4px">'+barras+'</div></div>'
    +'<div class="card"><div class="card-title" style="margin-bottom:10px">Top 5 clientes ('+anioActual+')</div>'
    +topCli.map(function(c){
      return '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);font-size:12px">'
        +'<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">'+c[0]+'</span>'
        +'<span class="td-mono text-green" style="flex-shrink:0;margin-left:8px">'+fmt(c[1])+'</span></div>';
    }).join('')
    +'</div></div>'
    +'<div class="card"><div class="card-title" style="margin-bottom:8px">Facturas pendientes de pago</div>'
    +'<div class="table-wrap"><table><thead><tr><th>No. Factura</th><th>Fecha</th><th>Cliente</th><th class="td-right">Total</th><th>Dias pendiente</th></tr></thead><tbody>'
    +pendientes.slice(0,10).map(function(f){
      var dias=Math.floor((hoy2-new Date(f.fecha+'T00:00:00'))/86400000);
      return '<tr><td class="td-mono">'+(f.noFactura||f.id)+'</td><td>'+fechaLegible(f.fecha)+'</td>'
        +'<td>'+f.clienteNombre+'</td><td class="td-mono td-right">'+fmt(f.total||0)+'</td>'
        +'<td><span class="badge badge-'+(dias>30?'red':dias>15?'amber':'green')+'">'+dias+' dias</span></td></tr>';
    }).join('')
    +(pendientes.length===0?'<tr><td colspan="5" class="text-center text-muted" style="padding:12px">Sin pendientes</td></tr>':'')
    +'</tbody></table></div></div>';
}

// --- Dashboard Cotizaciones ---
async function renderDashCotizaciones(content, actions) {
  var cots = await dbGetAll('cotizaciones');
  var mesActual = today().slice(0,7);
  actions.innerHTML = '<button class="btn btn-primary" onclick="navTo(\'cotizador\')">+ Nueva cotizacion</button>';

  var aprobadas = cots.filter(function(c){return c.estado==='aprobada';});
  var pendientes = cots.filter(function(c){return c.estado==='pendiente';});
  var rechazadas = cots.filter(function(c){return c.estado==='rechazada';});
  var totAprobado = aprobadas.reduce(function(a,c){return a+(c.totalConIVA||0);},0);
  var totPendiente = pendientes.reduce(function(a,c){return a+(c.totalConIVA||0);},0);
  var tasaConv = cots.length>0?((aprobadas.length/cots.length)*100).toFixed(1):0;

  var topServicios = {};
  cots.forEach(function(c){(c.servicios||[]).forEach(function(s){if(!topServicios[s.label])topServicios[s.label]=0;topServicios[s.label]++;});});
  var rankServ = Object.entries(topServicios).sort(function(a,b){return b[1]-a[1];}).slice(0,6);

  content.innerHTML = '<div class="section-title">Dashboard de Cotizaciones</div>'
    +'<div class="stat-grid">'
    +'<div class="stat-card stat-green"><div class="stat-label">Aprobadas</div><div class="stat-value">'+aprobadas.length+'</div><div class="stat-sub">'+fmt(totAprobado)+'</div></div>'
    +'<div class="stat-card stat-amber"><div class="stat-label">Pendientes</div><div class="stat-value">'+pendientes.length+'</div><div class="stat-sub">'+fmt(totPendiente)+'</div></div>'
    +'<div class="stat-card stat-red"><div class="stat-label">Rechazadas</div><div class="stat-value">'+rechazadas.length+'</div></div>'
    +'<div class="stat-card stat-blue"><div class="stat-label">Tasa de conversion</div><div class="stat-value">'+tasaConv+'%</div></div>'
    +'</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">'
    +'<div class="card"><div class="card-title" style="margin-bottom:10px">Servicios mas cotizados</div>'
    +rankServ.map(function(s){
      var max=rankServ[0][1];
      var pct=Math.round((s[1]/max)*100);
      return '<div style="margin-bottom:8px">'
        +'<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px">'
        +'<span>'+s[0]+'</span><span class="td-mono">'+s[1]+'x</span></div>'
        +'<div class="progress-bar"><div class="progress-fill" style="width:'+pct+'%;background:var(--blue)"></div></div>'
        +'</div>';
    }).join('')
    +'</div>'
    +'<div class="card"><div class="card-title" style="margin-bottom:10px">Ultimas cotizaciones</div>'
    +cots.slice().sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;}).slice(0,8).map(function(c){
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">'
        +'<div><div>'+c.clienteNombre+'</div><div style="font-size:10px;color:var(--text3)">'+fechaLegible(c.fecha)+'</div></div>'
        +'<div style="display:flex;align-items:center;gap:6px">'
        +'<span class="td-mono">'+fmt(c.totalConIVA||0)+'</span>'
        +'<span class="badge badge-'+(c.estado==='aprobada'?'green':c.estado==='rechazada'?'red':'amber')+'">'+c.estado+'</span>'
        +'</div></div>';
    }).join('')
    +'</div></div>';
}

// --- Dashboard Budget ---
async function renderDashBudget(content, actions) {
  actions.innerHTML = '<button class="btn btn-primary" onclick="navTo(\'budget\')">Abrir Budget</button>';
  var repuestos = await dbGetAll('repuestos');
  var insumos = await dbGetAll('insumos');
  var cfg = await dbGet('config','taller')||{};
  var tarifa = cfg.tarifaHora||150;

  // Calcular paquetes predefinidos
  var paquetes = [
    {nombre:'Servicio basico sedan',horasMO:1,productos:[{n:'Aceite motor 4L',c:120},{n:'Filtro aceite',c:35}]},
    {nombre:'Servicio completo pickup',horasMO:1.5,productos:[{n:'Aceite motor 6L',c:180},{n:'Filtro aceite',c:45},{n:'Filtro aire',c:55}]},
    {nombre:'Frenos completos',horasMO:3,productos:[{n:'Pastillas delanteras',c:180},{n:'Pastillas traseras',c:160},{n:'Liquido de frenos',c:60}]},
    {nombre:'Cambio de bateria',horasMO:0.5,productos:[{n:'Bateria 70Ah',c:450}]},
  ];

  var margenMO=0.40, margenRep=0.30;
  var tarjetas = paquetes.map(function(p){
    var costoMO=p.horasMO*tarifa;
    var precioMO=costoMO*(1+margenMO);
    var costoRep=p.productos.reduce(function(a,r){return a+r.c;},0);
    var precioRep=costoRep*(1+margenRep);
    var sub=precioMO+precioRep;
    var total=sub*1.12;
    var util=sub-(costoMO+costoRep);
    return '<div class="stat-card">'
      +'<div class="stat-label">'+p.nombre+'</div>'
      +'<div style="font-size:18px;font-weight:700;color:var(--green);margin:6px 0">'+fmt(total)+'</div>'
      +'<div style="font-size:10px;color:var(--text2)">Costo: '+fmt(costoMO+costoRep)+'</div>'
      +'<div style="font-size:10px;color:var(--blue)">Utilidad: '+fmt(util)+' ('+(util/(precioMO+precioRep)*100).toFixed(0)+'%)</div>'
      +'</div>';
  }).join('');

  content.innerHTML = '<div class="section-title">Dashboard Budget</div>'
    +'<div class="section-sub">Precios sugeridos con margen MO '+( margenMO*100).toFixed(0)+'% | Repuestos '+(margenRep*100).toFixed(0)+'% | Tarifa Q'+tarifa+'/hr</div>'
    +'<div class="stat-grid">'+tarjetas+'</div>'
    +'<div class="card"><div class="card-title" style="margin-bottom:10px">Acceso rapido al presupuestador</div>'
    +'<div style="display:flex;gap:10px;flex-wrap:wrap">'
    +'<button class="btn btn-primary" onclick="navTo(\'budget\')">Abrir Budget completo</button>'
    +'<button class="btn btn-secondary" onclick="navTo(\'cotizador\')">Ir al Cotizador</button>'
    +'</div></div>';
}

// ================================================================
// 4. SERVICIOS EXTERNOS (Torno, Rectificadora, etc.)
// ================================================================
async function renderServiciosExternos(content, actions) {
  var srvExt = await dbGetAll('servicios_externos');
  var proveedores = await dbGetAll('proveedores');
  srvExt.sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;});
  actions.innerHTML = '<button class="btn btn-primary" onclick="modalSrvExterno()">+ Nuevo servicio externo</button>';

  var totPend = srvExt.filter(function(s){return s.estado!=='entregado';}).reduce(function(a,s){return a+(s.costoTotal||0);},0);
  var totMes = srvExt.filter(function(s){return s.fecha&&s.fecha.startsWith(today().slice(0,7));}).reduce(function(a,s){return a+(s.costoTotal||0);},0);

  var estados = {pendiente:'amber',enviado:'blue',en_proceso:'amber',listo:'green',entregado:'green',devuelto:'red'};
  var rows = srvExt.map(function(s){
    var prov = proveedores.find(function(p){return p.id===s.proveedorId;});
    return '<tr>'
      +'<td><strong>'+s.tipoServicio+'</strong><div style="font-size:10px;color:var(--text3)">'+(s.descripcion||'')+'</div></td>'
      +'<td>'+(prov?prov.empresa:s.proveedor||'---')+'</td>'
      +'<td style="font-size:11px">'+(s.responsable||'---')+'</td>'
      +'<td style="font-size:11px">'+(s.formaEntrega||'---')+'</td>'
      +'<td style="font-size:11px">'+(s.formaRecogida||'---')+'</td>'
      +'<td class="td-mono">Q '+(s.costo||0).toFixed(2)+'</td>'
      +'<td class="td-mono text-green">Q '+(s.costoTotal||0).toFixed(2)+'</td>'
      +'<td><span class="badge badge-'+(estados[s.estado]||'gray')+'">'+(s.estado||'pendiente')+'</span></td>'
      +'<td style="font-size:11px">'+(s.noOrden||'---')+'</td>'
      +'<td><div class="flex gap-1">'
      +'<button class="btn btn-sm btn-secondary" onclick="modalSrvExterno('+s.id+')">Editar</button>'
      +'</div></td></tr>';
  }).join('');

  content.innerHTML = '<div class="section-title">Servicios Externos</div>'
    +'<div class="section-sub">Torno, rectificadora, soldadura, electronica y otros servicios de terceros</div>'
    +'<div class="stat-grid">'
    +'<div class="stat-card stat-red"><div class="stat-label">En proceso</div><div class="stat-value">'+srvExt.filter(function(s){return s.estado!=='entregado';}).length+'</div><div class="stat-sub">'+fmt(totPend)+' pendiente</div></div>'
    +'<div class="stat-card stat-amber"><div class="stat-label">Costo mes</div><div class="stat-value">'+fmt(totMes)+'</div></div>'
    +'<div class="stat-card"><div class="stat-label">Total registros</div><div class="stat-value">'+srvExt.length+'</div></div>'
    +'</div>'
    +'<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    +'<thead><tr><th>Servicio</th><th>Proveedor</th><th>Responsable</th><th>Como se entrega</th><th>Como se recoge</th><th>Costo</th><th>Total c/ganancia</th><th>Estado</th><th>OT</th><th>Acciones</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="10" class="text-center text-muted" style="padding:16px">Sin servicios externos</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

async
