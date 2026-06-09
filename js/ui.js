/* TallerPro GT — ui.js */

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


async function resetPassword(id){
  if(!soloAdmin())return;
  const nueva=prompt('Nueva contrase\u00F1a para este usuario:');
  if(!nueva)return;
  const u=await dbGet('usuarios',id);
  u.passwordHash=await hashPassword(nueva);u.updatedAt=nowTs();
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

