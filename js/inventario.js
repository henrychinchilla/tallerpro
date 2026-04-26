/* TallerPro GT — js/inventario.js
   Módulo independiente — cada archivo tiene funciones específicas
   Para editar: modificar solo este archivo y recargar
*/

function renderProveedores(content,actions){
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

function modalRepuesto(id=null){
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

async function modalInsumo(id) {
  var ins = id ? await dbGet('insumos',id) : {};
  var provs = await dbGetAll('proveedores');
  var cats=['Aceites','Refrigerantes','Quimicos','Consumibles','Limpieza','Lubricantes','Filtros','Otro'];
  var provOpts='<option value="">Sin proveedor</option>'
    +provs.map(function(p){return '<option value="'+p.id+'"'+(ins.proveedorId===p.id?' selected':'')+'>'+p.empresa+'</option>';}).join('');

  openModal('ins_m', id?'Editar Insumo':'Nuevo Insumo',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Nombre *</label><input id="in_n" value="'+(ins.nombre||'')+'" placeholder="Aceite 20W-50 Sintetico"></div>'
    +'<div class="form-group"><label>Categoria</label><select id="in_ca">'+cats.map(function(c){return '<option value="'+c+'"'+(ins.categoria===c?' selected':'')+'>'+c+'</option>';}).join('')+'</select></div>'
    +'</div>'
    +'<div class="form-row form-row-3">'
    +'<div class="form-group"><label>Stock actual</label><input id="in_st" type="number" value="'+(ins.stock||0)+'" min="0"></div>'
    +'<div class="form-group"><label>Stock minimo</label><input id="in_sm" type="number" value="'+(ins.stockMin||5)+'" min="0"></div>'
    +'<div class="form-group"><label>Unidad</label><input id="in_u" value="'+(ins.unidad||'litro')+'" placeholder="litro, galon..."></div>'
    +'</div>'
    +'<div class="form-row form-row-3">'
    +'<div class="form-group"><label>Precio compra (Q)</label><input id="in_co" type="number" value="'+(ins.costo||0)+'" step="0.01" oninput="calcMargIns2()"></div>'
    +'<div class="form-group"><label>Precio venta (Q)</label><input id="in_pr" type="number" value="'+(ins.precio||0)+'" step="0.01" oninput="calcMargIns2()"></div>'
    +'<div class="form-group"><label>Margen</label><input id="in_ma" readonly style="background:var(--bg4)"></div>'
    +'</div>'
    +'<div class="form-group"><label>Proveedor</label>'
    +'<select id="in_pv">'+provOpts+'</select></div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Tiene caducidad</label><select id="in_tc" onchange="togCadI2()"><option value="no"'+(ins.fechaCaducidad?'':' selected')+'>No caduca</option><option value="si"'+(ins.fechaCaducidad?' selected':'')+'>Si</option></select></div>'
    +'<div id="in_cw2" style="display:'+(ins.fechaCaducidad?'block':'none')+'"><div class="form-group"><label>Fecha caducidad</label><input id="in_ca2" type="date" value="'+(ins.fechaCaducidad||'')+'"></div></div>'
    +'</div>',
    async function(){
      var nom=document.getElementById('in_n').value.trim();
      if(!nom){toast('Nombre requerido','red');return;}
      var cos=$n('in_co'),pre=$n('in_pr');
      var mar=pre>0&&cos>0?(pre-cos)/pre:0;
      var pId=parseInt(document.getElementById('in_pv').value)||null;
      var provE=provs.find(function(p){return p.id===pId;});
      var obj={nombre:nom,categoria:$v('in_ca'),stock:parseInt($v('in_st'))||0,stockMin:parseInt($v('in_sm'))||5,
        unidad:$v('in_u'),costo:cos,precio:pre,margen:mar,
        proveedorId:pId,proveedor:provE?provE.empresa:'',
        fechaCaducidad:$v('in_tc')==='si'?$v('in_ca2'):null,tipo:'insumo',updatedAt:nowTs()};
      if(id){obj.id=id;await dbPut('insumos',obj);}else{obj.createdAt=nowTs();await dbAdd('insumos',obj);}
      cerrarModal('ins_m');toast(id?'Actualizado':'Registrado');await navTo('insumos');
    },true);
  setTimeout(function(){
    calcMargIns2();
    var sel=document.getElementById('in_pv');
    if(sel) selectConBotonNuevo(sel,'proveedor');
  },100);
}

function calcMargIns2(){var c=$n('in_co'),p=$n('in_pr'),el=document.getElementById('in_ma');if(!el)return;if(p>0&&c>0){var m=((p-c)/p)*100;el.value=m.toFixed(1)+'%';el.style.color=m<20?'var(--red)':m<35?'var(--accent)':'var(--green)';}else el.value='---';}
function togCadI2(){var v=$v('in_tc'),w=document.getElementById('in_cw2');if(w)w.style.display=v==='si'?'block':'none';}

// ---- MODULO: ENVIOS ----

function toggleMensajeroEnvio() {
  var tipo = (document.getElementById('ev_tip_mens')||{}).value;
  var propio = document.getElementById('env_propio_wrap');
  var externo = document.getElementById('env_externo_wrap');
  if (propio) propio.style.display = tipo === 'propio' ? 'block' : 'none';
  if (externo) externo.style.display = tipo === 'externo' ? 'block' : 'none';
}

async function renderEnvios(content, actions) {
  var envios = await dbGetAll('envios');
  envios.sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;});
  actions.innerHTML='<button class="btn btn-primary" onclick="modalEnvio()">+ Nuevo envio</button>';

  var transportistas=[{k:'guatex',l:'Guatex'},{k:'cargo_expreso',l:'Cargo Expreso'},{k:'a_forza',l:'A Forza'},{k:'interrapidisimo',l:'Interrapidisimo'},{k:'propio',l:'Mensajero propio'},{k:'otro',l:'Otro'}];
  var colores={pendiente:'amber',en_transito:'blue',entregado:'green',devuelto:'red'};

  var resumen={pendiente:0,en_transito:0,entregado:0,devuelto:0};
  envios.forEach(function(e){if(resumen[e.estado]!==undefined)resumen[e.estado]++;});

  var rows=envios.map(function(e){
    var tc=transportistas.find(function(t){return t.k===e.transportista;})||{l:e.transportista||'---'};
    return '<tr>'
      +'<td class="td-mono" style="font-size:10px">'+(e.noGuia||'---')+'</td>'
      +'<td>'+fechaLegible(e.fecha)+'</td>'
      +'<td><span class="badge badge-gray">'+tc.l+'</span></td>'
      +'<td>'+(e.tipoEnvio==='domicilio'?'<span class="badge badge-blue">Domicilio</span>':'<span class="badge badge-gray">Bodega</span>')+'</td>'
      +'<td style="font-size:11px">'+(e.destinatario||'---')+'</td>'
      +'<td style="font-size:11px">'+(e.clienteNombre||'---')+'</td>'
      +'<td class="td-mono">Q '+(e.costoEnvio||0).toFixed(2)+'</td>'
      +'<td><span class="badge badge-'+(colores[e.estado]||'gray')+'">'+(e.estado||'pendiente')+'</span></td>'
      +'<td><div class="flex gap-1">'
      +'<button class="btn btn-sm btn-secondary" onclick="modalEnvio('+e.id+')">Ver/Editar</button>'
      +'</div></td></tr>';
  }).join('');

  content.innerHTML='<div class="section-title">Modulo de Envios</div>'
    +'<div class="section-sub">Traslados entre bodegas y envios a domicilio de clientes</div>'
    +'<div class="stat-grid">'
    +'<div class="stat-card stat-amber"><div class="stat-label">Pendientes</div><div class="stat-value">'+resumen.pendiente+'</div></div>'
    +'<div class="stat-card stat-blue"><div class="stat-label">En transito</div><div class="stat-value">'+resumen.en_transito+'</div></div>'
    +'<div class="stat-card stat-green"><div class="stat-label">Entregados</div><div class="stat-value">'+resumen.entregado+'</div></div>'
    +'<div class="stat-card stat-red"><div class="stat-label">Devueltos</div><div class="stat-value">'+resumen.devuelto+'</div></div>'
    +'</div>'
    +'<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    +'<thead><tr><th>No. Guia</th><th>Fecha</th><th>Transportista</th><th>Tipo</th><th>Destinatario</th><th>Cliente</th><th>Costo</th><th>Estado</th><th>Acciones</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="9" class="text-center text-muted" style="padding:16px">Sin envios registrados</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

async function modalEnvio(id) {
  var e = id ? await dbGet('envios',id) : {};
  var clientes = await dbGetAll('clientes');
  var repuestos = await dbGetAll('repuestos');
  var insumos   = await dbGetAll('insumos');
  var productos = repuestos.concat(insumos);
  var cliOpts='<option value="">Sin cliente</option>'+clientes.map(function(c){return '<option value="'+c.id+'"'+(e.clienteId===c.id?' selected':'')+'>'+c.nombre+'</option>';}).join('');
  var transportistas=['guatex','cargo_expreso','a_forza','interrapidisimo','propio','otro'];
  var transportLabels={guatex:'Guatex',cargo_expreso:'Cargo Expreso',a_forza:'A Forza',interrapidisimo:'Interrapidisimo',propio:'Mensajero propio',otro:'Otro'};
  var transOpts=transportistas.map(function(t){return '<option value="'+t+'"'+(e.transportista===t?' selected':'')+'>'+transportLabels[t]+'</option>';}).join('');
  var items=e.items||[{productoId:'',cantidad:1,descripcion:''}];

  openModal('env_m',id?'Editar Envio':'Nuevo Envio',
    '<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Tipo de envio *</label>'
    +'<select id="ev_tipo"><option value="domicilio"'+(e.tipoEnvio==='domicilio'||!e.tipoEnvio?' selected':'')+'>Envio a domicilio (cliente)</option>'
    +'<option value="bodega"'+(e.tipoEnvio==='bodega'?' selected':'')+'>Traslado entre bodegas</option></select></div>'
    +'<div class="form-group"><label>Transportista *</label><select id="ev_trans">'+transOpts+'</select></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>No. de guia</label><input id="ev_guia" value="'+(e.noGuia||'')+'" placeholder="Numero de guia del transportista"></div>'
    +'<div class="form-group"><label>Estado</label>'
    +'<select id="ev_est"><option value="pendiente"'+(e.estado==='pendiente'||!e.estado?' selected':'')+'>Pendiente</option>'
    +'<option value="en_transito"'+(e.estado==='en_transito'?' selected':'')+'>En transito</option>'
    +'<option value="entregado"'+(e.estado==='entregado'?' selected':'')+'>Entregado</option>'
    +'<option value="devuelto"'+(e.estado==='devuelto'?' selected':'')+'>Devuelto</option></select></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Fecha de envio *</label><input id="ev_fec" type="date" value="'+(e.fecha||today())+'"></div>'
    +'<div class="form-group"><label>Fecha/hora estimada de entrega</label><input id="ev_fent" type="datetime-local" value="'+(e.fechaEntrega||'')+'"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Quien envia</label><input id="ev_env" value="'+(e.quienEnvia||'')+'" placeholder="Nombre del remitente"></div>'
    +'<div class="form-group"><label>Destinatario *</label><input id="ev_dest" value="'+(e.destinatario||'')+'" placeholder="Nombre completo"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Direccion de entrega</label><input id="ev_dir" value="'+(e.direccionEntrega||'')+'" placeholder="Direccion completa"></div>'
    +'<div class="form-group"><label>Telefono destinatario</label><input id="ev_tel" value="'+(e.telefonoDestinatario||'')+'" placeholder="+502 5555-0000" onblur="onTelBlur(this)"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Cliente (si aplica)</label><select id="ev_cli">'+cliOpts+'</select></div>'
    +'<div class="form-group"><label>No. Factura relacionada</label><input id="ev_fac" value="'+(e.noFactura||'')+'" placeholder="FAC-001"></div>'
    +'</div>'
    +'<div class="form-row form-row-2">'
    +'<div class="form-group"><label>Costo del envio (Q)</label><input id="ev_cost" type="number" value="'+(e.costoEnvio||'')+'" step="0.01" placeholder="0.00"></div>'
    +'<div class="form-group"><label>Tipo de servicio contratado</label>'
    +'<select id="ev_srv"><option value="estandar"'+(e.tipoServicioEnvio==='estandar'?' selected':'')+'>Estandar</option>'
    +'<option value="express"'+(e.tipoServicioEnvio==='express'?' selected':'')+'>Express / Urgente</option>'
    +'<option value="programado"'+(e.tipoServicioEnvio==='programado'?' selected':'')+'>Programado</option>'
    +'<option value="puerta_a_puerta"'+(e.tipoServicioEnvio==='puerta_a_puerta'?' selected':'')+'>Puerta a puerta</option></select></div>'
    +'</div>'
    +'<div class="form-group"><label>Descripcion del contenido</label><textarea id="ev_desc" style="min-height:60px" placeholder="Repuestos, insumos, documentos...">'+(e.descripcion||'')+'</textarea></div>'
    +'<div class="form-group"><label>Observaciones</label><input id="ev_obs" value="'+(e.observaciones||'')+'" placeholder="Instrucciones especiales, fragil, etc."></div>',
    async function(){
      var dest=document.getElementById('ev_dest').value.trim();
      if(!dest){toast('Destinatario requerido','red');return;}
      var cliId=parseInt(document.getElementById('ev_cli').value)||null;
      var cli=clientes.find(function(c){return c.id===cliId;});
      var tipoMens = $v('ev_tip_mens') || 'propio';
      var costoExt = parseFloat((document.getElementById('ev_costo_ext')||{}).value)||0;
      if (tipoMens === 'externo' && costoExt > 0) {
        await dbAdd('costos', {
          fecha: today(), tipo: 'Mensajería externa',
          descripcion: 'Servicio de mensajería: ' + ($v('ev_trans')||'externo'),
          monto: costoExt, categoria: 'Logística', pagado: true,
          createdAt: nowTs(), updatedAt: nowTs()
        });
      }
      var obj={tipoMensajero:tipoMens,
        mensajeroNombre:$v('ev_mens_nom'),mensajeroTel:$v('ev_mens_tel'),
        costoExterno:costoExt,
        tipoEnvio:$v('ev_tipo'),transportista:$v('ev_trans'),noGuia:$v('ev_guia').trim(),
        estado:$v('ev_est'),fecha:$v('ev_fec'),fechaEntrega:$v('ev_fent'),
        quienEnvia:$v('ev_env').trim(),destinatario:dest,direccionEntrega:$v('ev_dir').trim(),
        telefonoDestinatario:$v('ev_tel').trim(),clienteId:cliId,clienteNombre:cli?cli.nombre:'',
        noFactura:$v('ev_fac').trim(),costoEnvio:parseFloat($v('ev_cost'))||0,
        tipoServicioEnvio:$v('ev_srv'),descripcion:$v('ev_desc').trim(),
        observaciones:$v('ev_obs').trim(),updatedAt:nowTs()};
      if(id){obj.id=id;await dbPut('envios',obj);}else{obj.createdAt=nowTs();await dbAdd('envios',obj);}
      cerrarModal('env_m');toast(id?'Envio actualizado':'Envio registrado');await navTo('envios');
    },true);
  agregarBotonesInline([{selectId:'ev_cli',tipo:'cliente'}]);
}

// ---- MODULO: COTIZADOR ----
var SERVICIOS_EXTRA=[
  {id:'alarma',label:'Instalacion de alarma',precioBase:350,horas:3},
  {id:'gps',label:'Instalacion GPS',precioBase:280,horas:2},
  {id:'camaras',label:'Camaras de reversa / 360',precioBase:450,horas:4},
  {id:'central_lock',label:'Central lock',precioBase:200,horas:2},
  {id:'pantalla',label:'Pantalla inteligente / multimedia',precioBase:600,horas:4},
  {id:'neblineras',label:'Neblineras',precioBase:300,horas:2},
  {id:'luces_led',label:'Luces LED (faros, interior)',precioBase:250,horas:2},
  {id:'scaneo',label:'Scaneo / diagnostico electronico',precioBase:150,horas:1},
  {id:'lavado',label:'Lavado y encerado',precioBase:120,horas:2},
  {id:'limpieza',label:'Limpieza general interior',precioBase:180,horas:2},
  {id:'pulido',label:'Pulido de pintura',precioBase:400,horas:4},
  {id:'otro',label:'Servicio personalizado',precioBase:0,horas:1},
];

async function renderCotizador(content, actions) {
  var cotizaciones=await dbGetAll('cotizaciones');
  cotizaciones.sort(function(a,b){return (a.fecha||'')<(b.fecha||'')?1:-1;});
  actions.innerHTML='<button class="btn btn-primary" onclick="modalCotizacion()">+ Nueva cotizacion</button>';

  var rows=cotizaciones.map(function(c){
    return '<tr>'
      +'<td class="td-mono">'+(c.noCotizacion||'#'+c.id)+'</td>'
      +'<td>'+fechaLegible(c.fecha)+'</td>'
      +'<td>'+(c.clienteNombre||'---')+'</td>'
      +'<td style="font-size:11px">'+(c.placa||'---')+'</td>'
      +'<td style="font-size:11px">'+(c.servicios||[]).length+' servicios</td>'
      +'<td class="td-mono text-green">Q '+(c.totalConIVA||0).toFixed(2)+'</td>'
      +'<td><span class="badge badge-'+(c.estado==='aprobada'?'green':c.estado==='rechazada'?'red':'amber')+'">'+(c.estado||'pendiente')+'</span></td>'
      +'<td><div class="flex gap-1">'
      +'<button class="btn btn-sm btn-secondary" onclick="imprimirCotizacion('+c.id+')">Imprimir</button>'
      +'<button class="btn btn-sm btn-blue" onclick="cotizacionAOrden('+c.id+')">-> OT</button>'
      +'<button class="btn btn-sm btn-secondary" onclick="modalCotizacion('+c.id+')">Editar</button>'
      +'</div></td></tr>';
  }).join('');

  content.innerHTML='<div class="section-title">Cotizador de Servicios</div>'
    +'<div class="section-sub">Genera cotizaciones para servicios extras y accesorios</div>'
    +'<div class="card" style="padding:10px"><div class="table-wrap"><table>'
    +'<thead><tr><th>No.</th><th>Fecha</th><th>Cliente</th><th>Placa</th><th>Servicios</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>'
    +'<tbody>'+(rows||'<tr><td colspan="8" class="text-center text-muted" style="padding:16px">Sin cotizaciones</td></tr>')+'</tbody>'
    +'</table></div></div>';
}

async
