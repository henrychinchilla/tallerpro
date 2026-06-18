/* TallerPro GT — doctorpro.js */

// ── Configuración de DoctorPro ──────────────────────────────────
const DOCTORPRO_CONFIG = {
  enabled: true,
  baseURL: localStorage.getItem('doctorpro_url') || '',
  apiKey: localStorage.getItem('doctorpro_key') || '',
  syncEnabled: localStorage.getItem('doctorpro_sync') !== 'false'
};

// ── Validar conexión a DoctorPro ────────────────────────────────
async function validarConexionDoctorPro() {
  if (!DOCTORPRO_CONFIG.baseURL || !DOCTORPRO_CONFIG.apiKey) {
    return { conectado: false, mensaje: 'DoctorPro no configurado' };
  }

  try {
    const response = await fetch(DOCTORPRO_CONFIG.baseURL + '/api/health', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + DOCTORPRO_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    if (response.ok) {
      return { conectado: true, mensaje: 'Conectado a DoctorPro' };
    } else {
      return { conectado: false, mensaje: 'Error de autenticación con DoctorPro' };
    }
  } catch (error) {
    return { conectado: false, mensaje: 'No se puede conectar a DoctorPro: ' + error.message };
  }
}

// ── Sincronizar datos a DoctorPro ───────────────────────────────
async function sincronizarClientesDoctorPro() {
  if (!DOCTORPRO_CONFIG.syncEnabled) return { exito: false, mensaje: 'Sincronización deshabilitada' };

  try {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const payload = {
      accion: 'sync_clientes',
      datos: clientes,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(DOCTORPRO_CONFIG.baseURL + '/api/sync', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + DOCTORPRO_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      return { exito: true, mensaje: 'Clientes sincronizados', data: result };
    } else {
      return { exito: false, mensaje: 'Error en sincronización' };
    }
  } catch (error) {
    return { exito: false, mensaje: 'Error: ' + error.message };
  }
}

// ── Obtener datos desde DoctorPro ───────────────────────────────
async function obtenerDatosDoctorPro(endpoint) {
  if (!DOCTORPRO_CONFIG.baseURL || !DOCTORPRO_CONFIG.apiKey) {
    return { exito: false, mensaje: 'DoctorPro no configurado' };
  }

  try {
    const response = await fetch(DOCTORPRO_CONFIG.baseURL + '/api/' + endpoint, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + DOCTORPRO_CONFIG.apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { exito: true, data: data };
    } else {
      return { exito: false, mensaje: 'Error al obtener datos' };
    }
  } catch (error) {
    return { exito: false, mensaje: 'Error: ' + error.message };
  }
}

// ── Configurar acceso a DoctorPro ───────────────────────────────
function configurarDoctorPro(url, apiKey) {
  localStorage.setItem('doctorpro_url', url);
  localStorage.setItem('doctorpro_key', apiKey);
  DOCTORPRO_CONFIG.baseURL = url;
  DOCTORPRO_CONFIG.apiKey = apiKey;
  return { exito: true, mensaje: 'DoctorPro configurado correctamente' };
}

// ── UI para configurar DoctorPro ────────────────────────────────
function abrirConfigDoctorPro() {
  const html = `
    <div class="card">
      <div class="card-header">
        <div class="card-title">⚕️ Configuración DoctorPro</div>
      </div>
      <div class="form-group">
        <label>URL Base de DoctorPro</label>
        <input type="text" id="doctorpro_url" value="${DOCTORPRO_CONFIG.baseURL}" placeholder="https://api.doctorpro.com">
      </div>
      <div class="form-group">
        <label>API Key</label>
        <input type="password" id="doctorpro_key" value="${DOCTORPRO_CONFIG.apiKey}" placeholder="Ingresa tu API Key">
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" id="doctorpro_sync" ${DOCTORPRO_CONFIG.syncEnabled ? 'checked' : ''}>
          Habilitar sincronización automática
        </label>
      </div>
      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="btn btn-blue" onclick="guardarConfigDoctorPro()">Guardar</button>
        <button class="btn btn-secondary" onclick="testConexionDoctorPro()">Probar Conexión</button>
      </div>
      <div id="doctorpro_status" style="margin-top:12px;display:none" class="alert alert-blue"></div>
    </div>
  `;
  document.getElementById('content').innerHTML = html;
}

function guardarConfigDoctorPro() {
  const url = document.getElementById('doctorpro_url').value;
  const key = document.getElementById('doctorpro_key').value;
  const sync = document.getElementById('doctorpro_sync').checked;

  configurarDoctorPro(url, key);
  localStorage.setItem('doctorpro_sync', sync);

  mostrarStatus('Configuración guardada ✓', 'success');
}

async function testConexionDoctorPro() {
  const status = document.getElementById('doctorpro_status');
  status.style.display = 'block';
  status.textContent = '⏳ Probando conexión...';

  const result = await validarConexionDoctorPro();
  status.textContent = result.mensaje;
  status.className = result.conectado ? 'alert alert-green' : 'alert alert-red';
}

function mostrarStatus(msg, tipo) {
  const status = document.getElementById('doctorpro_status');
  status.style.display = 'block';
  status.textContent = msg;
  status.className = 'alert alert-' + (tipo === 'success' ? 'green' : 'red');
}
