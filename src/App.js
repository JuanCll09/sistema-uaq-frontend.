import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
// Importamos 'useNavigate' para la redirección después del login
import { BrowserRouter, Routes, Route, Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
// --- ¡NUEVO! ---
// Importamos la variable de configuración
import API_BASE_URL from './config.js';

// --- (INICIO) CONTEXTO DE AUTENTICACIÓN ---
// (Sin cambios)
const AuthContext = createContext(null);
function useAuth() {
  return useContext(AuthContext);
}
// --- (FIN) CONTEXTO DE AUTENTICACIÓN ---


// --- (INICIO) ESTILOS CSS ---
// (Sin cambios)
const styles = {
  // ... (estilos de layout, sidebar, etc.)
  layout: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f7f6',
  },
  sidebar: {
    width: '240px',
    background: '#ffffff',
    borderRight: '1px solid #e0e0e0',
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  sidebarHeader: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#005a9c',
    marginBottom: '30px',
  },
  navLink: {
    display: 'block',
    textDecoration: 'none',
    color: '#333',
    padding: '12px 15px',
    borderRadius: '6px',
    margin: '8px 0',
    transition: 'background-color 0.2s, color 0.2s',
  },
  content: {
    flex: 1,
    padding: '30px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  pageHeader: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111',
    marginBottom: '20px',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },
  
  // ... (Estilos de Aulas)
  aulaList: { listStyleType: 'none', paddingLeft: '0' },
  aulaItem: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '15px',
    margin: '10px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminBotonesContainer: {
    display: 'flex',
    gap: '10px',
  },
  aulaNombre: { color: '#005a9c', fontWeight: 'bold', fontSize: '1.1em' },
  aulaDetalle: { fontSize: '0.9em', color: '#555', marginTop: '5px' },
  
  // ... (Estilos de Mensajes)
  mensajeBox: {
    backgroundColor: '#fff0f0',
    border: '1px solid #ffb0b0',
    color: '#d00000',
    padding: '15px',
    borderRadius: '5px',
    marginTop: '20px',
  },
  mensajeBoxSuccess: {
    backgroundColor: '#e8f5e9',
    border: '1px solid #a5d6a7',
    color: '#1b5e20',
    padding: '15px',
    borderRadius: '5px',
    marginTop: '20px',
  },
  
  // ... (estilos de Login)
  loginContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
  },
  loginBox: {
    width: '400px',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  loginTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#005a9c',
    marginBottom: '25px',
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  loginInput: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    fontSize: '16px',
  },
  loginButton: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#005a9c',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loginError: {
    backgroundColor: '#ffebee',
    border: '1px solid #e57373',
    color: '#c62828',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '10px',
    textAlign: 'center',
  },
  // ... (estilos de Logout)
  userInfo: {
    borderTop: '1px solid #eee',
    paddingTop: '15px',
    marginTop: '20px',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: '0.9em',
    color: '#333',
    textAlign: 'center',
  },
  userRol: {
    fontSize: '0.8em',
    color: '#666',
    textAlign: 'center',
    marginBottom: '10px',
  },
  logoutButton: {
    display: 'block',
    width: '100%',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#e53935',
    color: 'white',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    fontSize: '0.9em',
  },
  
  // ... (estilos de "FormularioAula")
  headerConBoton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #eee',
    marginBottom: '20px',
  },
  botonNuevaAula: { 
    padding: '10px 18px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#005a9c',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  formCrearAula: { 
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '25px',
    margin: '20px 0',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  formInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    fontSize: '14px',
    marginBottom: '15px',
  },
  formInputDate: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    fontSize: '14px',
    marginBottom: '15px',
  },
  formInputArea: { // (NUEVO) Estilo para textareas
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    fontSize: '14px',
    marginBottom: '15px',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100px',
  },
  formSelect: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    fontSize: '14px',
    marginBottom: '15px',
    background: 'white',
  },
  formLabel: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#333',
  },
  formRow: {
    display: 'flex',
    gap: '20px',
  },
  formCol: {
    flex: 1,
  },
  formBotones: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  formBotonGuardar: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
  },
  formBotonCancelar: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#f44336',
    color: 'white',
    cursor: 'pointer',
  },
  
  // ... (estilos de botones Admin de Aulas)
  botonEliminarAula: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#e53935',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  botonEditarAula: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  
  // ... (estilos de "Recursos Académicos")
  recursoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  recursoCard: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    padding: '20px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  recursoEstado: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'capitalize',
  },
  recursoNombre: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#005a9c',
    marginRight: '80px',
  },
  recursoCategoria: {
    fontSize: '0.9em',
    color: '#666',
    marginBottom: '15px',
  },
  recursoHr: {
    border: 'none',
    borderTop: '1px solid #eee',
    margin: '15px 0',
  },
  recursoDetalle: {
    fontSize: '0.9em',
    color: '#333',
    marginBottom: '5px',
  },
  recursoAdminBotones: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    borderTop: '1px solid #eee',
    paddingTop: '15px',
  },
  
  // ... (estilos de "Gestión de Horarios")
  diaTabsContainer: {
    display: 'flex',
    gap: '5px',
    borderBottom: '2px solid #ccc',
    marginBottom: '20px',
  },
  diaTab: {
    padding: '10px 18px',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    color: '#555',
    background: 'transparent',
  },
  diaTabActivo: {
    color: '#005a9c',
    borderBottom: '3px solid #005a9c',
  },
  horarioTable: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  horarioTh: {
    background: '#f9fafb',
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#444',
    borderBottom: '2px solid #eee',
  },
  horarioTr: {
    borderBottom: '1px solid #f0f0f0',
  },
  horarioTd: {
    padding: '15px',
    fontSize: '15px',
    color: '#333',
  },
  
  // ... (estilos de "Dashboard")
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },
  kpiCard: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  kpiValor: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#005a9c',
  },
  kpiTitulo: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
  },
  kpiSubtitulo: {
    fontSize: '13px',
    color: '#777',
  },
  widgetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
    marginTop: '25px',
  },
  widgetCard: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  widgetTitulo: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#111',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  proximaClaseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f5f5ff',
  },
  proximaClaseHora: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#005a9c',
    flexBasis: '100px', // Ancho fijo
  },
  proximaClaseInfo: {
    fontSize: '15px',
    color: '#333',
    flex: 1,
  },
  proximaClaseAula: {
    fontSize: '14px',
    color: '#777',
    textAlign: 'right',
    flexBasis: '120px', // Ancho fijo
  },
  conflictoItem: {
    background: '#fff8e1',
    border: '1px solid #ffecb3',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '10px',
  },
  conflictoTitulo: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#c08a00',
  },
  conflictoDetalle: {
    fontSize: '14px',
    color: '#555',
    marginTop: '5px',
    paddingLeft: '10px',
    borderLeft: '3px solid #ffc107',
  },
  
  // ... (estilos de "Inscribir Materias")
  inscribirBoton: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4CAF50', // Verde
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  
  // ... (estilos de "Gestión de Usuarios")
  usuarioTable: { 
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  usuarioTh: { 
    background: '#f9fafb',
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#444',
    borderBottom: '2px solid #eee',
  },
  usuarioTr: { 
    borderBottom: '1px solid #f0f0f0',
  },
  usuarioTd: { 
    padding: '15px',
    fontSize: '15px',
    color: '#333',
  },

  // ... (estilos de "Seguimiento Académico")
  calificacionInput: {
    width: '70px',
    padding: '5px 8px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    textAlign: 'center',
    marginRight: '10px',
  },
  calificacionComentario: {
    width: '100%',
    minWidth: '150px',
    padding: '5px 8px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  calificacionBotonGuardar: {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4CAF50', // Verde
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  
  // ... (estilos de "Notificaciones")
  notificacionLista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  notificacionCard: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
  },
  notificacionIcono: {
    flex: '0 0 60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px 0 0 8px',
  },
  notificacionContenido: {
    padding: '15px 20px',
    flex: 1,
  },
  notificacionTitulo: {
    fontSize: '1.1em',
    fontWeight: 'bold',
    color: '#111',
    marginBottom: '5px',
  },
  notificacionMensaje: {
    fontSize: '0.95em',
    color: '#444',
    lineHeight: '1.5',
    marginBottom: '10px',
  },
  notificacionMeta: {
    fontSize: '0.8em',
    color: '#777',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '10px',
    marginTop: '10px',
  },
  botonEliminarNotificacion: {
    background: 'transparent',
    border: 'none',
    color: '#e53935', // Rojo
    cursor: 'pointer',
    fontSize: '1.2em',
    fontWeight: 'bold',
    padding: '0 5px',
    marginLeft: '10px',
  },
  notificacionHeader: { // Ayuda a alinear título y botón
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
};
// --- (FIN) ESTILOS CSS ---


// --- 1. PROVEEDOR DE AUTENTICACIÓN ---
// (Sin cambios)
function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const login = (datosUsuario) => { setUsuario(datosUsuario); };
  const logout = () => { setUsuario(null); };
  const value = { usuario, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- 2. COMPONENTE DE RUTA PROTEGIDA ---
// (Sin cambios)
function ProtectedRoute({ children }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}

// --- 3. COMPONENTE PRINCIPAL (App) ---
// (¡ACTUALIZADO! con nueva ruta de materias)
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            
            {/* Rutas de Admin */}
            <Route path="aulas" element={<GestionAulas />} />
            <Route path="horarios" element={<GestionHorarios />} />
            <Route path="recursos" element={<RecursosAcademicos />} />
            <Route path="usuarios" element={<GestionUsuarios />} />
            <Route path="seguimiento" element={<SeguimientoAcademicoPage />} /> 
            <Route path="materias" element={<GestionMateriasPage />} />
            
            {/* Rutas de Alumno/Docente */}
            <Route path="mi-horario" element={<MiHorarioPage />} />
            <Route path="inscribir" element={<InscripcionPage />} />
            <Route path="notificaciones" element={<NotificacionesPage />} />
            <Route path="calificaciones" element={<MisCalificacionesPage />} />

            <Route path="*" element={<NoEncontrado />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// --- 4. PÁGINA DE LOGIN ---
// (¡ACTUALIZADO!)
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email y contraseña son obligatorios.");
      return;
    }
    
    // --- ¡CAMBIO AQUÍ! ---
    fetch(`${API_BASE_URL}/api_login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        login(body.usuario); 
        navigate('/'); 
      } else {
        setError(body.message || "Error al conectar.");
      }
    })
    .catch(error => {
      console.error('Error de red al hacer login:', error);
      setError("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <h1 style={styles.loginTitle}>Sistema de Gestión UAQ</h1>
        <form style={styles.loginForm} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email (ej. admin@uaq.mx)"
            style={styles.loginInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña (ej. 123)"
            style={styles.loginInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={styles.loginButton}>
            Entrar
          </button>
        </form>
        {error && <div style={styles.loginError}>{error}</div>}
      </div>
    </div>
  );
}

// --- 5. COMPONENTE "ESQUELETO" (Layout) ---
// (¡ACTUALIZADO! con nuevo enlace de materias y Emojis)
function Layout() {
  const { usuario, logout } = useAuth();
  return (
    <div style={styles.layout}>
      <nav style={styles.sidebar}>
        <div>
          <div style={styles.sidebarHeader}>Sistema Académico</div>
          
          {/* Vínculo Común */}
          <Link to="/" style={styles.navLink} 
                onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            📊 Dashboard
          </Link>
          <Link to="/notificaciones" style={styles.navLink} 
                onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            🔔 Notificaciones
          </Link>

          {/* Vínculos de ADMIN */}
          {usuario.rol === 'admin' && (
            <>
              <Link to="/aulas" style={styles.navLink}
                    onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                🏫 Gestión de Aulas
              </Link>
              <Link to="/horarios" style={styles.navLink}
                    onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                🗓️ Gestión de Horarios
              </Link>
              <Link to="/materias" style={styles.navLink}
                    onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                📚 Gestión de Materias
              </Link>
              <Link to="/recursos" style={styles.navLink}
                    onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                🖥️ Recursos Académicos
              </Link>
              <Link to="/usuarios" style={styles.navLink}
                    onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                👥 Gestión de Usuarios
              </Link>
              <Link to="/seguimiento" style={styles.navLink}
                    onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                📝 Seguimiento Académico
              </Link>
            </>
          )}
          
          {/* Vínculos de ALUMNO */}
          {usuario.rol === 'alumno' && (
            <>
              <Link to="/mi-horario" style={styles.navLink}
                    onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                🕒 Mi Horario
              </Link>
              <Link to="/inscribir" style={styles.navLink}
                    onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                ✅ Inscribir Materias
              </Link>
              <Link to="/calificaciones" style={styles.navLink}
                    onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                🎓 Mis Calificaciones
              </Link>
            </>
          )}
          
          {/* Vínculos de DOCENTE */}
          {usuario.rol === 'docente' && (
            <>
              <Link to="/mi-horario" style={styles.navLink}
                    onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                🕒 Mi Horario
              </Link>
              <Link to="/seguimiento" style={styles.navLink}
                    onMouseEnter={e => e.currentTarget.style.background = '#eee'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                📝 Seguimiento Académico
              </Link>
            </>
          )}

        </div>
        <div style={styles.userInfo}>
          {usuario && (
            <>
              <div style={styles.userName}>{usuario.nombre}</div>
              <div style={styles.userRol}>Rol: {usuario.rol}</div>
            </>
          )}
          <button onClick={logout} style={styles.logoutButton}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </nav>
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

// --- 6. PÁGINAS INDIVIDUALES ---

// (Página Dashboard - ¡ACTUALIZADO!)
function Dashboard() {
  const { usuario } = useAuth();
  const [data, setData] = useState(null); 
  const [mensaje, setMensaje] = useState("Cargando datos del dashboard...");

  const formatarHora = (hora) => {
    if (!hora) return '';
    return hora.substring(0, 5); 
  };

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        // --- ¡CAMBIO AQUÍ! ---
        const response = await fetch(`${API_BASE_URL}/api_dashboard.php`);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const dashboardData = await response.json();
        
        if (dashboardData && dashboardData.kpi && dashboardData.proximas_clases && dashboardData.conflictos) {
          setData(dashboardData);
          setMensaje(""); 
        } else {
          throw new Error("La API no devolvió los datos esperados.");
        }
        
      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
        setMensaje(`Error de Conexión: ${err.message}.`);
      }
    };

    cargarDashboard();
  }, []); 

  if (!data) {
    return (
      <div>
        <h1 style={styles.pageHeader}>📊 Dashboard</h1>
        {mensaje && (
          <div style={styles.mensajeBox}>
            <strong>Diagnóstico:</strong> {mensaje}
          </div>
        )}
        {!mensaje && <p>Cargando...</p>}
      </div>
    );
  }

  return (
    <div>
      <h1 style={styles.pageHeader}>📊 Dashboard</h1>
      <p style={{marginTop: '-20px', marginBottom: '20px', fontSize: '1.1em', color: '#444'}}>
        Bienvenido, <strong>{usuario.nombre}</strong>.
      </p>
      
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <div>
            <div style={styles.kpiTitulo}>Clases Programadas Hoy</div>
            <div style={styles.kpiSubtitulo}>({data.kpi.clases_hoy > 0 ? data.kpi.clases_hoy : 'Ninguna'} hoy)</div>
          </div>
          <div style={styles.kpiValor}>{data.kpi.clases_hoy}</div>
        </div>
        <div style={styles.kpiCard}>
          <div>
            <div style={styles.kpiTitulo}>Estudiantes Activos</div>
            <div style={styles.kpiSubtitulo}>Registrados</div>
          </div>
          <div style={styles.kpiValor}>{data.kpi.estudiantes_activos}</div>
        </div>
        <div style={styles.kpiCard}>
          <div>
            <div style={styles.kpiTitulo}>Aulas Totales</div>
            <div style={styles.kpiSubtitulo}>Registradas</div>
          </div>
          <div style={styles.kpiValor}>{data.kpi.aulas_totales}</div>
        </div>
        <div style={styles.kpiCard}>
          <div>
            <div style={styles.kpiTitulo}>Recursos en Uso</div>
            <div style={styles.kpiSubtitulo}>Actualmente</div>
          </div>
          <div style={styles.kpiValor}>{data.kpi.recursos_en_uso}</div>
        </div>
      </div>
      
      <div style={styles.widgetGrid}>
        
        {usuario.rol === 'admin' && (
          <div style={styles.widgetCard}>
            <h2 style={styles.widgetTitulo}>⚠️ Conflictos Detectados</h2>
            {data.conflictos.length === 0 ? (
              <p style={{color: '#4CAF50', fontWeight: 'bold'}}>¡Felicidades! No hay conflictos de horarios en el sistema.</p>
            ) : (
              <div>
                {data.conflictos.map((conflicto, index) => (
                  <div key={index} style={styles.conflictoItem}>
                    <div style={styles.conflictoTitulo}>Conflicto de {conflicto.tipo} en: {conflicto.recurso}</div>
                    <div style={styles.conflictoDetalle}>
                      <strong>Clase 1:</strong> {conflicto.clase1_desc} ({formatarHora(conflicto.clase1_horario.split(' ')[1].split('-')[0])} - {formatarHora(conflicto.clase1_horario.split(' ')[1].split('-')[1])})
                      <br />
                      <strong>Clase 2:</strong> {conflicto.clase2_desc} ({formatarHora(conflicto.clase2_horario.split(' ')[1].split('-')[0])} - {formatarHora(conflicto.clase2_horario.split(' ')[1].split('-')[1])})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div style={styles.widgetCard}>
          <h2 style={styles.widgetTitulo}>🕒 Próximas Clases (Hoy)</h2>
          {data.proximas_clases.length === 0 ? (
            <p style={{color: '#555'}}>No hay más clases programadas para hoy.</p>
          ) : (
            <div>
              {data.proximas_clases.map((clase, index) => (
                <div key={index} style={styles.proximaClaseItem}>
                  <div style={styles.proximaClaseHora}>{formatarHora(clase.hora_inicio)}</div>
                  <div style={styles.proximaClaseInfo}>{clase.materia_nombre}</div>
                  <div style={styles.proximaClaseAula}>{clase.aula_nombre}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// (Componente FormularioAula - ¡ACTUALIZADO!)
function FormularioAula({ onAulaGuardada, onCancelar, aulaAEditar }) {
  const [nombre, setNombre] = useState('');
  const [edificio, setEdificio] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [tipo, setTipo] = useState('aula');
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const modoEditar = aulaAEditar !== null;
  const tituloFormulario = modoEditar ? "✏️ Editar Aula" : "✨ Crear Nueva Aula";

  useEffect(() => {
    if (modoEditar) {
      setNombre(aulaAEditar.nombre);
      setEdificio(aulaAEditar.edificio);
      setCapacidad(aulaAEditar.capacidad);
      setTipo(aulaAEditar.tipo);
    } else {
      setNombre('');
      setEdificio('');
      setCapacidad('');
      setTipo('aula');
    }
  }, [aulaAEditar, modoEditar]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);

    if (!nombre || !edificio || !capacidad || !tipo) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (isNaN(capacidad) || capacidad <= 0) {
      setError("La capacidad debe ser un número positivo.");
      return;
    }

    const datosAula = {
      nombre, 
      edificio, 
      capacidad: parseInt(capacidad), 
      tipo
    };

    let apiUrl = '';
    
    if (modoEditar) {
      // --- ¡CAMBIO AQUÍ! ---
      apiUrl = `${API_BASE_URL}/api_editar_aula.php`;
      datosAula.aula_id = aulaAEditar.aula_id;
    } else {
      // --- ¡CAMBIO AQUÍ! ---
      apiUrl = `${API_BASE_URL}/api_crear_aula.php`;
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosAula)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if ((status === 200 || status === 201) && body.success) {
        setMensaje(body.message + " Refrescando lista...");
        if (!modoEditar) {
          setNombre('');
          setEdificio('');
          setCapacidad('');
          setTipo('aula');
        }
        setTimeout(() => {
          onAulaGuardada(); 
        }, 1500);
      } else {
        setError(body.message || "Error al guardar el aula.");
      }
    })
    .catch(error => {
      console.error('Error de red al guardar aula:', error);
      setError("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };

  return (
    <div style={styles.formCrearAula}>
      <h2 style={{marginTop: 0, marginBottom: '20px', color: '#333'}}>{tituloFormulario}</h2>
      {error && <div style={{...styles.mensajeBox, marginBottom: '15px'}}>{error}</div>}
      {mensaje && <div style={{...styles.mensajeBoxSuccess, marginBottom: '15px'}}>{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Nombre del Aula</label>
            <input type="text" placeholder="Ej. Aula 102" style={styles.formInput} value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Edificio / Ubicación</label>
            <input type="text" placeholder="Ej. Edificio A" style={styles.formInput} value={edificio} onChange={(e) => setEdificio(e.target.value)} />
          </div>
        </div>
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Capacidad</label>
            <input type="number" placeholder="Ej. 30" style={styles.formInput} value={capacidad} onChange={(e) => setCapacidad(e.target.value)} />
          </div>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Tipo de Aula</label>
            <select style={styles.formSelect} value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="aula">Aula</option>
              <option value="laboratorio">Laboratorio</option>
              <option value="auditorio">Auditorio</option>
            </select>
          </div>
        </div>
        <div style={styles.formBotones}>
          <button type="submit" style={styles.formBotonGuardar}>✔️ Guardar Cambios</button>
          <button type="button" onClick={onCancelar} style={styles.formBotonCancelar}>❌ Cancelar</button>
        </div>
      </form>
    </div>
  );
}


// (Página "GestionAulas" - ¡ACTUALIZADO!)
function GestionAulas() {
  const { usuario } = useAuth();
  const [aulas, setAulas] = useState([]);
  const [mensaje, setMensaje] = useState("Cargando aulas...");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [aulaEnEdicion, setAulaEnEdicion] = useState(null);

  const cargarAulas = () => {
    setMensaje("Actualizando lista...");
    // --- ¡CAMBIO AQUÍ! ---
    const apiUrl = `${API_BASE_URL}/api_aulas.php`;
    fetch(apiUrl)
      .then(response => response.text())
      .then(text => {
        try { return JSON.parse(text); } 
        catch (e) { throw new Error("Error de JSON: " + text); }
      })
      .then(data => {
        if (Array.isArray(data)) {
          setAulas(data);
          setMensaje(data.length === 0 ? "No hay aulas registradas." : "");
        } else {
          setMensaje("Error: La API no devolvió un array.");
        }
      })
      .catch(error => {
        console.error('Error al conectar con la API de PHP:', error);
        setMensaje(`Error de Conexión: ${error.message}.`);
      });
  };

  useEffect(() => {
    cargarAulas();
  }, []);

  const handleAulaGuardada = () => {
    setMostrarForm(false);
    setAulaEnEdicion(null);
    cargarAulas();
  };

  const handleCancelarForm = () => {
    setMostrarForm(false);
    setAulaEnEdicion(null);
  };
  
  const handleIniciarEdicion = (aula) => {
    setAulaEnEdicion(aula);
    setMostrarForm(true);
  };

  const handleEliminarAula = (aulaId, aulaNombre) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el aula "${aulaNombre}"?`)) {
      return;
    }
    // --- ¡CAMBIO AQUÍ! ---
    fetch(`${API_BASE_URL}/api_eliminar_aula.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aula_id: aulaId })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        setMensaje(body.message);
        cargarAulas(); 
      } else {
        setMensaje(body.message || "Error al eliminar el aula.");
      }
    })
    .catch(error => {
      console.error('Error de red al eliminar:', error);
      setMensaje("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };

  return (
    <div>
      <div style={styles.headerConBoton}>
        <h1 style={{...styles.pageHeader, margin: 0, border: 'none'}}>🏫 Gestión de Aulas</h1>
        {usuario && usuario.rol === 'admin' && !mostrarForm && (
          <button 
            style={styles.botonNuevaAula}
            onClick={() => {
              setAulaEnEdicion(null);
              setMostrarForm(true);
            }}
          >
            ✨ Nueva Aula
          </button>
        )}
      </div>

      {mostrarForm && (
        <FormularioAula 
          onAulaGuardada={handleAulaGuardada}
          onCancelar={handleCancelarForm}
          aulaAEditar={aulaEnEdicion}
        />
      )}

      {mensaje && (
        <div style={mensaje.startsWith("Error") || mensaje.startsWith("No hay") ? styles.mensajeBox : styles.mensajeBoxSuccess}>
          <strong>Diagnóstico:</strong> {mensaje}
        </div>
      )}
      
      <ul style={styles.aulaList}>
        {aulas.map((aula) => (
          <li key={aula.aula_id} style={styles.aulaItem}>
            <div>
              <div style={styles.aulaNombre}>{aula.nombre} ({aula.tipo})</div>
              <div style={styles.aulaDetalle}>{aula.edificio} - Capacidad: {aula.capacidad}</div>
            </div>
            
            {usuario && usuario.rol === 'admin' && (
              <div style={styles.adminBotonesContainer}>
                <button 
                  style={styles.botonEditarAula}
                  onClick={() => handleIniciarEdicion(aula)}
                >
                  ✏️ Editar
                </button>
                <button 
                  style={styles.botonEliminarAula}
                  onClick={() => handleEliminarAula(aula.aula_id, aula.nombre)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


// --- (INICIO) NUEVO COMPONENTE: FormularioMateria (¡ACTUALIZADO!) ---
function FormularioMateria({ onMateriaGuardada, onCancelar, materiaAEditar }) {
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const modoEditar = materiaAEditar !== null;
  const tituloFormulario = modoEditar ? "✏️ Editar Materia" : "✨ Crear Nueva Materia";

  useEffect(() => {
    if (modoEditar) {
      setNombre(materiaAEditar.nombre);
      setClave(materiaAEditar.clave);
    } else {
      setNombre('');
      setClave('');
    }
  }, [materiaAEditar, modoEditar]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);

    if (!nombre || !clave) {
      setError("Todos los campos (nombre, clave) son obligatorios.");
      return;
    }

    const datosMateria = {
      nombre, 
      clave, 
    };

    let apiUrl = '';
    
    if (modoEditar) {
      // --- ¡CAMBIO AQUÍ! ---
      apiUrl = `${API_BASE_URL}/api_editar_materia.php`;
      datosMateria.materia_id = materiaAEditar.materia_id;
    } else {
      // --- ¡CAMBIO AQUÍ! ---
      apiUrl = `${API_BASE_URL}/api_crear_materia.php`;
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosMateria)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if ((status === 200 || status === 201) && body.success) {
        setMensaje(body.message + " Refrescando lista...");
        if (!modoEditar) {
          setNombre('');
          setClave('');
        }
        setTimeout(() => {
          onMateriaGuardada(); 
        }, 1500);
      } else {
        setError(body.message || "Error al guardar la materia.");
      }
    })
    .catch(error => {
      console.error('Error de red al guardar materia:', error);
      setError("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };

  return (
    <div style={styles.formCrearAula}>
      <h2 style={{marginTop: 0, marginBottom: '20px', color: '#333'}}>{tituloFormulario}</h2>
      {error && <div style={{...styles.mensajeBox, marginBottom: '15px'}}>{error}</div>}
      {mensaje && <div style={{...styles.mensajeBoxSuccess, marginBottom: '15px'}}>{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Nombre de la Materia</label>
            <input type="text" placeholder="Ej. Cálculo Diferencial" style={styles.formInput} value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Clave</label>
            <input type="text" placeholder="Ej. FCI123" style={styles.formInput} value={clave} onChange={(e) => setClave(e.target.value)} />
          </div>
        </div>
        
        <div style={styles.formBotones}>
          <button type="submit" style={styles.formBotonGuardar}>✔️ Guardar Cambios</button>
          <button type="button" onClick={onCancelar} style={styles.formBotonCancelar}>❌ Cancelar</button>
        </div>
      </form>
    </div>
  );
}
// --- (FIN) NUEVO COMPONENTE: FormularioMateria ---


// --- (INICIO) NUEVO COMPONENTE: GestionMateriasPage (¡ACTUALIZADO!) ---
function GestionMateriasPage() {
  const { usuario } = useAuth();
  const [materias, setMaterias] = useState([]);
  const [mensaje, setMensaje] = useState("Cargando materias...");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [materiaEnEdicion, setMateriaEnEdicion] = useState(null);

  const cargarMaterias = () => {
    setMensaje("Actualizando lista...");
    // --- ¡CAMBIO AQUÍ! ---
    const apiUrl = `${API_BASE_URL}/api_materias.php`;
    fetch(apiUrl)
      .then(response => response.text())
      .then(text => {
        try { return JSON.parse(text); } 
        catch (e) { throw new Error("Error de JSON: " + text); }
      })
      .then(data => {
        if (Array.isArray(data)) {
          setMaterias(data);
          setMensaje(data.length === 0 ? "No hay materias registradas." : "");
        } else {
          setMensaje("Error: La API no devolvió un array.");
        }
      })
      .catch(error => {
        console.error('Error al conectar con la API de PHP:', error);
        setMensaje(`Error de Conexión: ${error.message}.`);
      });
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  const handleMateriaGuardada = () => {
    setMostrarForm(false);
    setMateriaEnEdicion(null);
    cargarMaterias();
  };

  const handleCancelarForm = () => {
    setMostrarForm(false);
    setMateriaEnEdicion(null);
  };
  
  const handleIniciarEdicion = (materia) => {
    setMateriaEnEdicion(materia);
    setMostrarForm(true);
  };

  const handleEliminarMateria = (materiaId, materiaNombre) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la materia "${materiaNombre}"?`)) {
      return;
    }
    // --- ¡CAMBIO AQUÍ! ---
    fetch(`${API_BASE_URL}/api_eliminar_materia.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materia_id: materiaId })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        setMensaje(body.message);
        cargarMaterias(); 
      } else {
        alert(body.message || "Error al eliminar la materia.");
        setMensaje(body.message || "Error al eliminar la materia.");
      }
    })
    .catch(error => {
      console.error('Error de red al eliminar:', error);
      setMensaje("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };

  return (
    <div>
      <div style={styles.headerConBoton}>
        <h1 style={{...styles.pageHeader, margin: 0, border: 'none'}}>📚 Gestión de Materias</h1>
        {usuario && usuario.rol === 'admin' && !mostrarForm && (
          <button 
            style={styles.botonNuevaAula}
            onClick={() => {
              setMateriaEnEdicion(null);
              setMostrarForm(true);
            }}
          >
            ✨ Nueva Materia
          </button>
        )}
      </div>

      {mostrarForm && (
        <FormularioMateria 
          onMateriaGuardada={handleMateriaGuardada}
          onCancelar={handleCancelarForm}
          materiaAEditar={materiaEnEdicion}
        />
      )}

      {mensaje && (
        <div style={mensaje.startsWith("Error") || mensaje.startsWith("No hay") ? styles.mensajeBox : styles.mensajeBoxSuccess}>
          <strong>Diagnóstico:</strong> {mensaje}
        </div>
      )}
      
      <ul style={styles.aulaList}>
        {materias.map((materia) => (
          <li key={materia.materia_id} style={styles.aulaItem}>
            <div>
              <div style={styles.aulaNombre}>{materia.nombre} ({materia.clave})</div>
            </div>
            
            {usuario && usuario.rol === 'admin' && (
              <div style={styles.adminBotonesContainer}>
                <button 
                  style={styles.botonEditarAula}
                  onClick={() => handleIniciarEdicion(materia)}
                >
                  ✏️ Editar
                </button>
                <button 
                  style={styles.botonEliminarAula}
                  onClick={() => handleEliminarMateria(materia.materia_id, materia.nombre)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
// --- (FIN) NUEVO COMPONENTE: GestionMateriasPage ---


// (Página "GestionHorarios" - ¡ACTUALIZADO!)
function GestionHorarios() {
  const { usuario } = useAuth();
  const [clases, setClases] = useState([]); 
  const [mensaje, setMensaje] = useState("Cargando horario...");
  const [diaSeleccionado, setDiaSeleccionado] = useState('Lunes');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [claseEnEdicion, setClaseEnEdicion] = useState(null);

  const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];

  const cargarHorario = () => {
    setMensaje("Actualizando horario...");
    // --- ¡CAMBIO AQUÍ! ---
    const apiUrl = `${API_BASE_URL}/api_horarios.php`;
    fetch(apiUrl)
      .then(response => response.text())
      .then(text => {
        try { return JSON.parse(text); } 
        catch (e) { throw new Error("Error de JSON: " + text); }
      })
      .then(data => {
        if (Array.isArray(data)) {
          setClases(data); 
          setMensaje(data.length === 0 ? "No hay clases registradas en el sistema." : "");
        } else {
          setMensaje("Error: La API no devolvió un array de horarios.");
        }
      })
      .catch(error => {
        console.error('Error al conectar con la API de PHP:', error);
        setMensaje(`Error de Conexión: ${error.message}.`);
      });
  };

  useEffect(() => {
    cargarHorario();
  }, []);

  const handleClaseGuardada = () => {
    setMostrarForm(false); 
    setClaseEnEdicion(null);
    cargarHorario(); 
  };
  
  const handleCancelarForm = () => {
    setMostrarForm(false);
    setClaseEnEdicion(null);
  };
  
  const handleIniciarEdicion = (clase) => {
    setClaseEnEdicion(clase); 
    setMostrarForm(true);
  };

  const handleEliminarClase = (claseId, claseNombre) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la clase "${claseNombre}"?`)) {
      return;
    }
    // --- ¡CAMBIO AQUÍ! ---
    fetch(`${API_BASE_URL}/api_eliminar_clase.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clase_id: claseId }) 
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        setMensaje(body.message); 
        cargarHorario(); 
      } else {
        setMensaje(body.message || "Error al eliminar la clase.");
      }
    })
    .catch(error => {
      console.error('Error de red al eliminar:', error);
      setMensaje("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };

  const formatarHora = (hora) => {
    if (!hora) return '';
    return hora.substring(0, 5); 
  };
  
  const clasesFiltradas = clases.filter(clase => clase.dia === diaSeleccionado);

  return (
    <div>
      <div style={styles.headerConBoton}>
        <h1 style={{...styles.pageHeader, margin: 0, border: 'none'}}>🗓️ Gestión de Horarios</h1>
        {usuario && usuario.rol === 'admin' && !mostrarForm && (
          <button 
            style={styles.botonNuevaAula} 
            onClick={() => {
              setClaseEnEdicion(null); 
              setMostrarForm(true);
            }}
          >
            ✨ Nueva Clase
          </button>
        )}
      </div>
      
      {mostrarForm && (
        <FormularioClase
          onClaseGuardada={handleClaseGuardada}
          onCancelar={handleCancelarForm}
          claseAEditar={claseEnEdicion}
        />
      )}
      
      <div style={styles.diaTabsContainer}>
        {DIAS.map(dia => (
          <button
            key={dia}
            style={{
              ...styles.diaTab,
              ...(dia === diaSeleccionado ? styles.diaTabActivo : {})
            }}
            onClick={() => setDiaSeleccionado(dia)}
          >
            {dia}
          </button>
        ))}
      </div>

      {mensaje && (
        <div style={mensaje.startsWith("Error") || mensaje.startsWith("No hay") ? styles.mensajeBox : styles.mensajeBoxSuccess}>
          <strong>Diagnóstico:</strong> {mensaje}
        </div>
      )}
      
      <table style={styles.horarioTable}>
        <thead>
          <tr>
            <th style={styles.horarioTh}>Horario</th>
            <th style={styles.horarioTh}>Materia</th>
            <th style={styles.horarioTh}>Docente</th>
            <th style={styles.horarioTh}>Aula</th>
            {usuario && usuario.rol === 'admin' && (
              <th style={styles.horarioTh}>Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {clasesFiltradas.length > 0 ? (
            clasesFiltradas.map((clase) => (
              <tr key={clase.clase_id} style={styles.horarioTr}>
                <td style={styles.horarioTd}>
                  {formatarHora(clase.hora_inicio)} - {formatarHora(clase.hora_fin)}
                </td>
                <td style={styles.horarioTd}>{clase.materia_nombre}</td>
                <td style={styles.horarioTd}>{clase.docente_nombre}</td>
                <td style={styles.horarioTd}>{clase.aula_nombre}</td>
                {usuario && usuario.rol === 'admin' && (
                  <td style={styles.horarioTd}>
                    <div style={styles.adminBotonesContainer}>
                      <button 
                        style={styles.botonEditarAula}
                        onClick={() => handleIniciarEdicion(clase)}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        style={styles.botonEliminarAula}
                        onClick={() => handleEliminarClase(clase.clase_id, clase.materia_nombre)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr style={styles.horarioTr}>
              <td colSpan={usuario.rol === 'admin' ? 5 : 4} style={{...styles.horarioTd, textAlign: 'center', color: '#777'}}>
                {mensaje ? '' : 'No hay clases programadas para este día.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


// (Página "RecursosAcademicos" - ¡ACTUALIZADO!)
function RecursosAcademicos() {
  const { usuario } = useAuth(); 
  const [recursos, setRecursos] = useState([]);
  const [mensaje, setMensaje] = useState("Cargando recursos...");
  const [mostrarForm, setMostrarForm] = useState(false); 
  const [recursoEnEdicion, setRecursoEnEdicion] = useState(null);

  const cargarRecursos = () => {
    setMensaje("Actualizando lista...");
    // --- ¡CAMBIO AQUÍ! ---
    const apiUrl = `${API_BASE_URL}/api_recursos.php`;
    fetch(apiUrl)
      .then(response => response.text())
      .then(text => {
        try { return JSON.parse(text); } 
        catch (e) { throw new Error("Error de JSON: " + text); }
      })
      .then(data => {
        if (Array.isArray(data)) {
          setRecursos(data);
          setMensaje(data.length === 0 ? "No hay recursos registrados." : "");
        } else {
          setMensaje("Error: La API no devolvió un array.");
        }
      })
      .catch(error => {
        console.error('Error al conectar con la API de PHP:', error);
        setMensaje(`Error de Conexión: ${error.message}.`);
      });
  };

  useEffect(() => {
    cargarRecursos();
  }, []);

  const handleRecursoGuardado = () => {
    setMostrarForm(false); 
    setRecursoEnEdicion(null);
    cargarRecursos(); 
  };
  
  const handleCancelarForm = () => {
    setMostrarForm(false);
    setRecursoEnEdicion(null);
  };
  
  const handleIniciarEdicion = (recurso) => {
    setRecursoEnEdicion(recurso); 
    setMostrarForm(true);
  };

  const handleEliminarRecurso = (recursoId, recursoNombre) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el recurso "${recursoNombre}"?`)) {
      return;
    }
    // --- ¡CAMBIO AQUÍ! ---
    fetch(`${API_BASE_URL}/api_eliminar_recurso.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recurso_id: recursoId }) 
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        setMensaje(body.message); 
        cargarRecursos(); 
      } else {
        setMensaje(body.message || "Error al eliminar el recurso.");
      }
    })
    .catch(error => {
      console.error('Error de red al eliminar:', error);
      setMensaje("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };

  const formatarFecha = (fecha) => {
    if (!fecha) return 'N/A';
    try {
      const dateObj = new Date(fecha + 'T00:00:00'); 
      return dateObj.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) { return fecha; }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible': return '#4CAF50'; // Verde
      case 'en_uso': return '#FFC107'; // Ámbar
      case 'mantenimiento': return '#F44336'; // Rojo
      default: return '#9E9E9E'; // Gris
    }
  };

  return (
    <div>
      <div style={styles.headerConBoton}>
        <h1 style={{...styles.pageHeader, margin: 0, border: 'none'}}>🖥️ Recursos Académicos</h1>
        {usuario && usuario.rol === 'admin' && !mostrarForm && (
          <button 
            style={styles.botonNuevaAula} 
            onClick={() => {
              setRecursoEnEdicion(null);
              setMostrarForm(true);
            }}
          >
            ✨ Nuevo Recurso
          </button>
        )}
      </div>

      {mostrarForm && (
        <FormularioRecurso
          onRecursoGuardado={handleRecursoGuardado}
          onCancelar={handleCancelarForm}
          recursoAEditar={recursoEnEdicion}
        />
      )}

      {mensaje && (
        <div style={mensaje.startsWith("Error") || mensaje.startsWith("No hay") ? styles.mensajeBox : styles.mensajeBoxSuccess}>
          <strong>Diagnóstico:</strong> {mensaje}
        </div>
      )}
      
      <div style={styles.recursoGrid}>
        {recursos.map((recurso) => (
          <div key={recurso.recurso_id} style={styles.recursoCard}>
            <div>
              <div style={{
                  ...styles.recursoEstado, 
                  backgroundColor: getEstadoColor(recurso.estado)
                }}>
                {recurso.estado.charAt(0).toUpperCase() + recurso.estado.slice(1)}
              </div>
              <div style={styles.recursoNombre}>{recurso.nombre}</div>
              <div style={styles.recursoCategoria}>{recurso.categoria}</div>
              <hr style={styles.recursoHr} />
              <div style={styles.recursoDetalle}>
                <strong>Responsable:</strong> {recurso.responsable || 'N/A'}
              </div>
              <div style={styles.recursoDetalle}>
                <strong>Adquisición:</strong> {formatarFecha(recurso.fecha_adquisicion)}
              </div>
            </div>
            
            {usuario && usuario.rol === 'admin' && (
              <div style={styles.recursoAdminBotones}>
                <button 
                  style={styles.botonEditarAula}
                  onClick={() => handleIniciarEdicion(recurso)}
                >
                  ✏️ Editar
                </button>
                <button 
                  style={styles.botonEliminarAula}
                  onClick={() => handleEliminarRecurso(recurso.recurso_id, recurso.nombre)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


// (Componente FormularioRecurso - ¡ACTUALIZADO!)
function FormularioRecurso({ onRecursoGuardado, onCancelar, recursoAEditar }) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('disponible');
  const [responsable, setResponsable] = useState('');
  const [fecha_adquisicion, setFechaAdquisicion] = useState('');
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  
  const modoEditar = recursoAEditar !== null;
  const tituloFormulario = modoEditar ? "✏️ Editar Recurso" : "✨ Crear Nuevo Recurso";

  useEffect(() => {
    if (modoEditar) {
      setNombre(recursoAEditar.nombre);
      setCategoria(recursoAEditar.categoria);
      setEstado(recursoAEditar.estado);
      setResponsable(recursoAEditar.responsable || ''); 
      setFechaAdquisicion(recursoAEditar.fecha_adquisicion || '');
    } else {
      setNombre('');
      setCategoria('');
      setEstado('disponible');
      setResponsable('');
      setFechaAdquisicion('');
    }
  }, [recursoAEditar, modoEditar]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);

    if (!nombre || !categoria || !estado) {
      setError("Los campos 'nombre', 'categoria' y 'estado' son obligatorios.");
      return;
    }

    const datosRecurso = {
      nombre, 
      categoria, 
      estado,
      responsable: responsable || null,
      fecha_adquisicion: fecha_adquisicion || null
    };

    let apiUrl = '';
    
    if (modoEditar) {
      // --- ¡CAMBIO AQUÍ! ---
      apiUrl = `${API_BASE_URL}/api_editar_recurso.php`;
      datosRecurso.recurso_id = recursoAEditar.recurso_id;
    } else {
      // --- ¡CAMBIO AQUÍ! ---
      apiUrl = `${API_BASE_URL}/api_crear_recurso.php`;
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosRecurso)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if ((status === 200 || status === 201) && body.success) {
        setMensaje(body.message + " Refrescando lista...");
        if (!modoEditar) {
          setNombre('');
          setCategoria('');
          setEstado('disponible');
          setResponsable('');
          setFechaAdquisicion('');
        }
        setTimeout(() => {
          onRecursoGuardado(); 
        }, 1500);
      } else {
        setError(body.message || "Error al guardar el recurso.");
      }
    })
    .catch(error => {
      console.error('Error de red al guardar recurso:', error);
      setError("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };

  return (
    <div style={styles.formCrearAula}> 
      <h2 style={{marginTop: 0, marginBottom: '20px', color: '#333'}}>{tituloFormulario}</h2>
      {error && <div style={{...styles.mensajeBox, marginBottom: '15px'}}>{error}</div>}
      {mensaje && <div style={{...styles.mensajeBoxSuccess, marginBottom: '15px'}}>{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        {/* Fila 1 */}
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Nombre del Recurso</label>
            <input type="text" placeholder="Ej. Proyector Epson" style={styles.formInput} value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Categoría</label>
            <input type="text" placeholder="Ej. Tecnologia" style={styles.formInput} value={categoria} onChange={(e) => setCategoria(e.target.value)} />
          </div>
        </div>
        {/* Fila 2 */}
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Estado</label>
            <select style={styles.formSelect} value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="disponible">Disponible</option>
              <option value="en_uso">En Uso</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>
           <div style={styles.formCol}>
            <label style={styles.formLabel}>Responsable (Opcional)</label>
            <input type="text" placeholder="Ej. Ing. Sistemas" style={styles.formInput} value={responsable} onChange={(e) => setResponsable(e.target.value)} />
          </div>
        </div>
        {/* Fila 3 */}
         <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Fecha Adquisición (Opcional)</label>
            <input type="date" style={styles.formInputDate} value={fecha_adquisicion} onChange={(e) => setFechaAdquisicion(e.target.value)} />
          </div>
          <div style={styles.formCol}>
            {/* Espacio vacío para alinear */}
          </div>
        </div>
        {/* Botones */}
        <div style={styles.formBotones}>
          <button type="submit" style={styles.formBotonGuardar}>✔️ Guardar Cambios</button>
          <button type="button" onClick={onCancelar} style={styles.formBotonCancelar}>❌ Cancelar</button>
        </div>
      </form>
    </div>
  );
}
// --- (FIN) COMPONENTE "FormularioRecurso" ---


// --- (INICIO) COMPONENTE "FormularioClase" (¡ACTUALIZADO!) ---
function FormularioClase({ onClaseGuardada, onCancelar, claseAEditar }) {
  // Estados para los datos de las APIs
  const [materias, setMaterias] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [aulas, setAulas] = useState([]);
  
  // Estados para los campos del formulario
  const [materiaId, setMateriaId] = useState('');
  const [docenteId, setDocenteId] = useState('');
  const [aulaId, setAulaId] = useState('');
  const [dia, setDia] = useState('Lunes');
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('11:00');

  // Estados de comunicación
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  
  const modoEditar = claseAEditar !== null;
  const tituloFormulario = modoEditar ? "✏️ Editar Clase" : "✨ Crear Nueva Clase";

  // --- Cargar datos para los menús desplegables ---
  useEffect(() => {
    const cargarDatosDropdowns = async () => {
      try {
        // --- ¡CAMBIO AQUÍ! ---
        const [resMaterias, resDocentes, resAulas] = await Promise.all([
          fetch(`${API_BASE_URL}/api_materias.php`),
          fetch(`${API_BASE_URL}/api_docentes.php`),
          fetch(`${API_BASE_URL}/api_aulas.php`)
        ]);
        
        const dataMaterias = await resMaterias.json();
        const dataDocentes = await resDocentes.json();
        const dataAulas = await resAulas.json();

        if (Array.isArray(dataMaterias)) setMaterias(dataMaterias);
        if (Array.isArray(dataDocentes)) setDocentes(dataDocentes);
        if (Array.isArray(dataAulas)) setAulas(dataAulas);
        
        if (modoEditar) {
          setMateriaId(String(claseAEditar.materia_id));
          setDocenteId(String(claseAEditar.docente_id));
          setAulaId(String(claseAEditar.aula_id));
          setDia(claseAEditar.dia);
          setHoraInicio(claseAEditar.hora_inicio.substring(0, 5));
          setHoraFin(claseAEditar.hora_fin.substring(0, 5));
        } else {
          setMateriaId('');
          setDocenteId('');
          setAulaId('');
          setDia('Lunes');
          setHoraInicio('09:00');
          setHoraFin('11:00');
        }

      } catch (err) {
        console.error("Error cargando datos para formulario:", err);
        setError("Error al cargar las listas de materias, docentes o aulas.");
      }
    };

    cargarDatosDropdowns();
  }, [claseAEditar, modoEditar]); 

  // --- Manejador del formulario ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);

    if (!materiaId || !docenteId || !aulaId || !dia || !horaInicio || !horaFin) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const datosClase = {
      materia_id: parseInt(materiaId),
      docente_id: parseInt(docenteId),
      aula_id: parseInt(aulaId),
      dia,
      hora_inicio: horaInicio,
      hora_fin: horaFin
    };

    let apiUrl = '';
    
    if (modoEditar) {
      // --- ¡CAMBIO AQUÍ! ---
      apiUrl = `${API_BASE_URL}/api_editar_clase.php`;
      datosClase.clase_id = claseAEditar.clase_id;
    } else {
      // --- ¡CAMBIO AQUÍ! ---
      apiUrl = `${API_BASE_URL}/api_crear_clase.php`;
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosClase)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if ((status === 200 || status === 201) && body.success) {
        setMensaje(body.message + " Refrescando horario...");
        
        if (!modoEditar) {
          setMateriaId('');
          setDocenteId('');
          setAulaId('');
        }
        
        setTimeout(() => {
          onClaseGuardada(); 
        }, 1500);
      } else {
        setError(body.message || "Error al crear la clase.");
      }
    })
    .catch(error => {
      console.error('Error de red al crear clase:', error);
      setError("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };

  return (
    <div style={styles.formCrearAula}> 
      <h2 style={{marginTop: 0, marginBottom: '20px', color: '#333'}}>{tituloFormulario}</h2>
      {error && <div style={{...styles.mensajeBox, marginBottom: '15px'}}>{error}</div>}
      {mensaje && <div style={{...styles.mensajeBoxSuccess, marginBottom: '15px'}}>{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        {/* Fila 1: Materia y Docente */}
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Materia</label>
            <select style={styles.formSelect} value={materiaId} onChange={(e) => setMateriaId(e.target.value)}>
              <option value="">-- Selecciona una materia --</option>
              {materias.map(m => (
                <option key={m.materia_id} value={m.materia_id}>
                  {m.clave} - {m.nombre}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Docente</label>
            <select style={styles.formSelect} value={docenteId} onChange={(e) => setDocenteId(e.target.value)}>
              <option value="">-- Selecciona un docente --</option>
              {docentes.map(d => (
                <option key={d.usuario_id} value={d.usuario_id}>
                  {d.nombre_completo}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Fila 2: Aula y Día */}
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Aula</label>
            <select style={styles.formSelect} value={aulaId} onChange={(e) => setAulaId(e.target.value)}>
              <option value="">-- Selecciona un aula --</option>
              {aulas.map(a => (
                <option key={a.aula_id} value={a.aula_id}>
                  {a.nombre} (Cap: {a.capacidad})
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Día de la Semana</label>
            <select style={styles.formSelect} value={dia} onChange={(e) => setDia(e.target.value)}>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sabado">Sábado</option>
            </select>
          </div>
        </div>
        {/* Fila 3: Horas */}
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Hora Inicio</label>
            <input type="time" step="1800" /* 30 min */ style={styles.formInputDate} value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
          </div>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Hora Fin</label>
            <input type="time" step="1800" /* 30 min */ style={styles.formInputDate} value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
          </div>
        </div>
        {/* Botones */}
        <div style={styles.formBotones}>
          <button type="submit" style={styles.formBotonGuardar}>✔️ Guardar Cambios</button>
          <button type="button" onClick={onCancelar} style={styles.formBotonCancelar}>❌ Cancelar</button>
        </div>
      </form>
    </div>
  );
}
// --- (FIN) COMPONENTE "FormularioClase" ---


// (Página "MiHorarioPage" - ¡ACTUALIZADO!)
function MiHorarioPage() {
  const { usuario } = useAuth(); 
  const [clases, setClases] = useState([]);
  const [mensaje, setMensaje] = useState("Cargando tu horario...");
  const [diaSeleccionado, setDiaSeleccionado] = useState('Lunes');

  const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];

  const cargarHorario = useCallback(() => {
    if (!usuario) return; 

    setMensaje("Cargando tu horario...");
    // --- ¡CAMBIO AQUÍ! ---
    const apiUrl = `${API_BASE_URL}/api_mi_horario.php?usuario_id=${usuario.id}&rol=${usuario.rol}`;
    
    fetch(apiUrl)
      .then(response => response.text())
      .then(text => {
        try { return JSON.parse(text); } 
        catch (e) { throw new Error("Error de JSON: " + text); }
      })
      .then(data => {
        if (Array.isArray(data)) {
          setClases(data);
          setMensaje(data.length === 0 ? "No tienes clases registradas." : "");
        } else {
          setMensaje("Error: La API no devolvió un array de horarios.");
        }
      })
      .catch(error => {
        console.error('Error al conectar con la API de PHP:', error);
        setMensaje(`Error de Conexión: ${error.message}.`);
      });
  }, [usuario]); 

  useEffect(() => {
    cargarHorario();
  }, [cargarHorario]); 

  const formatarHora = (hora) => {
    if (!hora) return '';
    return hora.substring(0, 5); 
  };
  
  const clasesFiltradas = clases.filter(clase => clase.dia === diaSeleccionado);

  return (
    <div>
      <h1 style={styles.pageHeader}>🕒 Mi Horario</h1>
      
      {/* Pestañas de Días */}
      <div style={styles.diaTabsContainer}>
        {DIAS.map(dia => (
          <button
            key={dia}
            style={{
              ...styles.diaTab,
              ...(dia === diaSeleccionado ? styles.diaTabActivo : {})
            }}
            onClick={() => setDiaSeleccionado(dia)}
          >
            {dia}
          </button>
        ))}
      </div>

      {/* Mensaje de diagnóstico */}
      {mensaje && (
        <div style={mensaje.startsWith("Error") || mensaje.startsWith("No tienes") ? styles.mensajeBox : styles.mensajeBoxSuccess}>
          <strong>Diagnóstico:</strong> {mensaje}
        </div>
      )}
      
      {/* Tabla de Horarios */}
      <table style={styles.horarioTable}>
        <thead>
          <tr>
            <th style={styles.horarioTh}>Horario</th>
            <th style={styles.horarioTh}>Materia</th>
            {usuario.rol === 'alumno' && <th style={styles.horarioTh}>Docente</th>}
            <th style={styles.horarioTh}>Aula</th>
          </tr>
        </thead>
        <tbody>
          {clasesFiltradas.length > 0 ? (
            clasesFiltradas.map((clase) => (
              <tr key={clase.clase_id} style={styles.horarioTr}>
                <td style={styles.horarioTd}>
                  {formatarHora(clase.hora_inicio)} - {formatarHora(clase.hora_fin)}
                </td>
                <td style={styles.horarioTd}>{clase.materia_nombre}</td>
                {usuario.rol === 'alumno' && <td style={styles.horarioTd}>{clase.docente_nombre}</td>}
                <td style={styles.horarioTd}>{clase.aula_nombre}</td>
              </tr>
            ))
          ) : (
            <tr style={styles.horarioTr}>
              <td colSpan={4} style={{...styles.horarioTd, textAlign: 'center', color: '#777'}}>
                {mensaje ? '' : 'No hay clases programadas para este día.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


// (Página "InscripcionPage" - ¡ACTUALIZADO!)
function InscripcionPage() {
  const { usuario } = useAuth(); 
  const [clases, setClases] = useState([]);
  const [mensaje, setMensaje] = useState("Cargando clases disponibles...");
  const [diaSeleccionado, setDiaSeleccionado] = useState('Lunes');

  const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];

  const cargarClasesDisponibles = useCallback(() => {
    if (!usuario || usuario.rol !== 'alumno') return; 

    setMensaje("Actualizando lista de clases...");
    // --- ¡CAMBIO AQUÍ! ---
    const apiUrl = `${API_BASE_URL}/api_clases_disponibles.php?alumno_id=${usuario.id}`;
    
    fetch(apiUrl)
      .then(response => response.text())
      .then(text => {
        try { return JSON.parse(text); } 
        catch (e) { throw new Error("Error de JSON: " + text); }
      })
      .then(data => {
        if (Array.isArray(data)) {
          setClases(data);
          setMensaje(data.length === 0 ? "¡Felicidades! Ya estás inscrito en todas las clases disponibles." : "");
        } else {
          setMensaje("Error: La API no devolvió un array de clases.");
        }
      })
      .catch(error => {
        console.error('Error al conectar con la API de PHP:', error);
        setMensaje(`Error de Conexión: ${error.message}.`);
      });
  }, [usuario]); 

  useEffect(() => {
    if (usuario) {
      cargarClasesDisponibles();
    }
  }, [usuario, cargarClasesDisponibles]);


  const handleInscribir = (claseId, claseNombre) => {
    if (!window.confirm(`¿Confirmas tu inscripción a la clase "${claseNombre}"?`)) {
      return;
    }
    // --- ¡CAMBIO AQUÍ! ---
    fetch(`${API_BASE_URL}/api_inscribir_clase.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        alumno_id: usuario.id, 
        clase_id: claseId 
      })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 201 && body.success) {
        setMensaje(body.message); 
        cargarClasesDisponibles(); 
      } else {
        setMensaje(body.message || "Error al inscribir la clase.");
      }
    })
    .catch(error => {
      console.error('Error de red al inscribir:', error);
      setMensaje("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };

  const formatarHora = (hora) => {
    if (!hora) return '';
    return hora.substring(0, 5); 
  };
  
  const clasesFiltradas = clases.filter(clase => clase.dia === diaSeleccionado);

  return (
    <div>
      <h1 style={styles.pageHeader}>✅ Inscribir Materias</h1>
      
      {/* Pestañas de Días */}
      <div style={styles.diaTabsContainer}>
        {DIAS.map(dia => (
          <button
            key={dia}
            style={{
              ...styles.diaTab,
              ...(dia === diaSeleccionado ? styles.diaTabActivo : {})
            }}
            onClick={() => setDiaSeleccionado(dia)}
          >
            {dia}
          </button>
        ))}
      </div>

      {/* Mensaje de diagnóstico */}
      {mensaje && (
        <div style={mensaje.startsWith("Error") ? styles.mensajeBox : styles.mensajeBoxSuccess}>
          <strong>Diagnóstico:</strong> {mensaje}
        </div>
      )}
      
      {/* Tabla de Horarios */}
      <table style={styles.horarioTable}>
        <thead>
          <tr>
            <th style={styles.horarioTh}>Horario</th>
            <th style={styles.horarioTh}>Materia</th>
            <th style={styles.horarioTh}>Docente</th>
            <th style={styles.horarioTh}>Aula</th>
            <th style={styles.horarioTh}>Inscribir</th>
          </tr>
        </thead>
        <tbody>
          {clasesFiltradas.length > 0 ? (
            clasesFiltradas.map((clase) => (
              <tr key={clase.clase_id} style={styles.horarioTr}>
                <td style={styles.horarioTd}>
                  {formatarHora(clase.hora_inicio)} - {formatarHora(clase.hora_fin)}
                </td>
                <td style={styles.horarioTd}>{clase.materia_nombre}</td>
                <td style={styles.horarioTd}>{clase.docente_nombre}</td>
                <td style={styles.horarioTd}>{clase.aula_nombre}</td>
                <td style={styles.horarioTd}>
                  <button 
                    style={styles.inscribirBoton}
                    onClick={() => handleInscribir(clase.clase_id, clase.materia_nombre)}
                  >
                    ✅ Inscribirme
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr style={styles.horarioTr}>
              <td colSpan={5} style={{...styles.horarioTd, textAlign: 'center', color: '#777'}}>
                {mensaje ? '' : 'No hay clases disponibles para este día.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
// --- (FIN) PÁGINAS "InscripcionPage" y "MiHorarioPage" ---


// (Página "GestionUsuarios" - ¡ACTUALIZADO!)
function GestionUsuarios() {
  const { usuario } = useAuth(); 
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("Cargando usuarios...");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState(null);
  
  const cargarUsuarios = useCallback(() => {
    setMensaje("Actualizando lista de usuarios...");
    // --- ¡CAMBIO AQUÍ! ---
    const apiUrl = `${API_BASE_URL}/api_usuarios.php`;
    
    fetch(apiUrl)
      .then(response => response.text())
      .then(text => {
        try { return JSON.parse(text); } 
        catch (e) { throw new Error("Error de JSON: " + text); }
      })
      .then(data => {
        if (Array.isArray(data)) {
          setUsuarios(data);
          setMensaje(data.length === 0 ? "No hay usuarios registrados." : "");
        } else {
          setMensaje("Error: La API no devolvió un array de usuarios.");
        }
      })
      .catch(error => {
        console.error('Error al conectar con la API de PHP:', error);
        setMensaje(`Error de Conexión: ${error.message}.`);
      });
  }, []); 

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const handleUsuarioGuardado = () => {
    setMostrarForm(false);
    setUsuarioEnEdicion(null);
    cargarUsuarios(); 
  };
  
  const handleCancelarForm = () => {
    setMostrarForm(false);
    setUsuarioEnEdicion(null);
  };
  
  const handleIniciarEdicion = (user) => {
    setUsuarioEnEdicion(user); 
    setMostrarForm(true);
  };
  
  const handleEliminarUsuario = (usuarioId, usuarioNombre) => {
    if (usuarioId === usuario.id) {
      alert("No puedes eliminarte a ti mismo."); 
      return;
    }
    
    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${usuarioNombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    // --- ¡CAMBIO AQUÍ! ---
    fetch(`${API_BASE_URL}/api_eliminar_usuario.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: usuarioId }) 
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        setMensaje(body.message); 
        cargarUsuarios(); 
      } else {
        setMensaje(body.message || "Error al eliminar el usuario.");
      }
    })
    .catch(error => {
      console.error('Error de red al eliminar:', error);
      setMensaje("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };


  return (
    <div>
      {/* Encabezado con el botón "+ Nuevo Usuario" */}
      <div style={styles.headerConBoton}>
        <h1 style={{...styles.pageHeader, margin: 0, border: 'none'}}>👥 Gestión de Usuarios</h1>
        {usuario.rol === 'admin' && !mostrarForm && (
          <button 
            style={styles.botonNuevaAula} // Reutilizamos estilo
            onClick={() => {
              setUsuarioEnEdicion(null); // Limpiamos para modo "Crear"
              setMostrarForm(true);
            }}
          >
            ✨ Nuevo Usuario
          </button>
        )}
      </div>
      
      {/* Formulario (solo se muestra si mostrarForm es true) */}
      {mostrarForm && (
        <FormularioUsuario
          onUsuarioGuardado={handleUsuarioGuardado}
          onCancelar={handleCancelarForm}
          usuarioAEditar={usuarioEnEdicion}
        />
      )}

      {/* Mensaje de diagnóstico */}
      {mensaje && (
        <div style={mensaje.startsWith("Error") || mensaje.startsWith("No hay") ? styles.mensajeBox : styles.mensajeBoxSuccess}>
          <strong>Diagnóstico:</strong> {mensaje}
        </div>
      )}
      
      {/* Tabla de Usuarios */}
      <table style={styles.usuarioTable}>
        <thead>
          <tr>
            <th style={styles.usuarioTh}>Nombre Completo</th>
            <th style={styles.usuarioTh}>Email</th>
            <th style={styles.usuarioTh}>Rol</th>
            <th style={styles.usuarioTh}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((user) => (
              <tr key={user.usuario_id} style={styles.usuarioTr}>
                <td style={styles.usuarioTd}>{user.nombre_completo}</td>
                <td style={styles.usuarioTd}>{user.email}</td>
                <td style={styles.usuarioTd}>{user.rol}</td>
                <td style={styles.usuarioTd}>
                  {/* No permitimos que un admin se edite o elimine a sí mismo */}
                  {usuario.id !== user.usuario_id && (
                    <div style={styles.adminBotonesContainer}>
                      <button 
                        style={styles.botonEditarAula}
                        onClick={() => handleIniciarEdicion(user)}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        style={styles.botonEliminarAula}
                        onClick={() => handleEliminarUsuario(user.usuario_id, user.nombre_completo)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr style={styles.usuarioTr}>
              <td colSpan={4} style={{...styles.usuarioTd, textAlign: 'center', color: '#777'}}>
                {mensaje ? '' : 'No hay usuarios en el sistema.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


// (Componente "FormularioUsuario" - ¡ACTUALIZADO!)
function FormularioUsuario({ onUsuarioGuardado, onCancelar, usuarioAEditar }) {
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('alumno');
  
  // Estados de comunicación
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  
  // Lógica de Modo Editar
  const modoEditar = usuarioAEditar !== null;
  const tituloFormulario = modoEditar ? "✏️ Editar Usuario" : "✨ Crear Nuevo Usuario";

  // Efecto para pre-llenar el formulario
  useEffect(() => {
    if (modoEditar) {
      setNombre(usuarioAEditar.nombre_completo);
      setEmail(usuarioAEditar.email);
      setRol(usuarioAEditar.rol);
      setPassword(''); // La contraseña no se edita aquí
    } else {
      setNombre('');
      setEmail('');
      setPassword('');
      setRol('alumno');
    }
  }, [usuarioAEditar, modoEditar]); 

  // Lógica de 'handleSubmit'
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);

    // Validación
    if (!nombre || !email || !rol) {
      setError("Los campos 'nombre', 'email' y 'rol' son obligatorios.");
      return;
    }
    if (!modoEditar && !password) {
        setError("La contraseña es obligatoria al crear un nuevo usuario.");
        return;
    }
    if (!modoEditar && password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    let apiUrl = '';
    let datosUsuario = {};
    
    if (modoEditar) {
      // --- ¡CAMBIO AQUÍ! ---
      apiUrl = `${API_BASE_URL}/api_editar_usuario.php`;
      datosUsuario = {
        usuario_id: usuarioAEditar.usuario_id,
        nombre_completo: nombre,
        email: email,
        rol: rol
      };
    } else {
      // --- ¡CAMBIO AQUÍ! ---
      apiUrl = `${API_BASE_URL}/api_crear_usuario.php`;
      datosUsuario = {
        nombre_completo: nombre, 
        email: email, 
        password: password, 
        rol: rol
      };
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosUsuario)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if ((status === 200 || status === 201) && body.success) {
        setMensaje(body.message + " Refrescando lista...");
        if (!modoEditar) {
          setNombre('');
          setEmail('');
          setPassword('');
          setRol('alumno');
        }
        setTimeout(() => {
          onUsuarioGuardado(); 
        }, 1500);
      } else {
        setError(body.message || "Error al guardar el usuario.");
      }
    })
    .catch(error => {
      console.error('Error de red al guardar usuario:', error);
      setError("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };

  return (
    <div style={styles.formCrearAula}> {/* Reutilizamos estilo */}
      <h2 style={{marginTop: 0, marginBottom: '20px', color: '#333'}}>{tituloFormulario}</h2>
      {error && <div style={{...styles.mensajeBox, marginBottom: '15px'}}>{error}</div>}
      {mensaje && <div style={{...styles.mensajeBoxSuccess, marginBottom: '15px'}}>{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        {/* Fila 1 */}
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Nombre Completo</label>
            <input type="text" placeholder="Ej. Juan Pérez" style={styles.formInput} value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Email</label>
            <input type="email" placeholder="Ej. juan.perez@uaq.mx" style={styles.formInput} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        {/* Fila 2 */}
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Contraseña</label>
            <input 
              type="password" 
              placeholder={modoEditar ? "(No se puede cambiar aquí)" : "Mínimo 6 caracteres"}
              style={styles.formInput} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={modoEditar} // ¡NUEVO!
            />
          </div>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Rol</label>
            <select style={styles.formSelect} value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="alumno">Alumno</option>
              <option value="docente">Docente</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        {/* Botones */}
        <div style={styles.formBotones}>
          <button type="submit" style={styles.formBotonGuardar}>✔️ Guardar Cambios</button>
          <button type="button" onClick={onCancelar} style={styles.formBotonCancelar}>❌ Cancelar</button>
        </div>
      </form>
    </div>
  );
}
// --- (FIN) PÁGINAS "Gestión de Usuarios" ---


// (Página "SeguimientoAcademicoPage" - ¡ACTUALIZADO!)
function SeguimientoAcademicoPage() {
  const { usuario } = useAuth();
  const [clases, setClases] = useState([]); 
  const [alumnos, setAlumnos] = useState([]); 
  const [claseSeleccionadaId, setClaseSeleccionadaId] = useState('');
  const [mensaje, setMensaje] = useState('Selecciona una clase para empezar...');
  
  // 1. Cargar las clases que este usuario (docente/admin) puede calificar
  useEffect(() => {
    const cargarClases = async () => {
      let apiUrl = '';
      if (usuario.rol === 'docente') {
        // --- ¡CAMBIO AQUÍ! ---
        apiUrl = `${API_BASE_URL}/api_mi_horario.php?usuario_id=${usuario.id}&rol=${usuario.rol}`;
      } else if (usuario.rol === 'admin') {
        // --- ¡CAMBIO AQUÍ! ---
        apiUrl = `${API_BASE_URL}/api_horarios.php`; // Admin ve todas
      } else {
        return; 
      }
      
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (Array.isArray(data)) {
          setClases(data);
        } else {
          setMensaje("Error: No se pudieron cargar tus clases.");
        }
      } catch (err) {
        console.error("Error cargando clases para seguimiento:", err);
        setMensaje("Error al cargar la lista de clases.");
      }
    };
    
    cargarClases();
  }, [usuario]);

  // 2. Cargar los alumnos cuando se selecciona una clase
  useEffect(() => {
    if (!claseSeleccionadaId) {
      setAlumnos([]); 
      setMensaje("Selecciona una clase para empezar...");
      return;
    }

    const cargarAlumnos = async () => {
      setMensaje("Cargando alumnos...");
      // --- ¡CAMBIO AQUÍ! ---
      const apiUrl = `${API_BASE_URL}/api_alumnos_por_clase.php?clase_id=${claseSeleccionadaId}`;
      
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (Array.isArray(data)) {
          setAlumnos(data.map(a => ({
            ...a,
            calificacionInput: a.calificacion || '',
            comentariosInput: a.comentarios || ''
          })));
          setMensaje(data.length === 0 ? "No hay alumnos inscritos en esta clase." : "");
        } else {
          setMensaje("Error: La API no devolvió una lista de alumnos.");
        }
      } catch (err) {
        console.error("Error cargando alumnos:", err);
        setMensaje(`Error de Conexión: ${err.message}.`);
      }
    };

    cargarAlumnos();
  }, [claseSeleccionadaId]); 
  
  return (
    <div>
      <h1 style={styles.pageHeader}>📝 Seguimiento Académico</h1>
      
      {/* Selector de Clase */}
      <div style={{ ...styles.formCrearAula, padding: '20px', background: '#f9fafb' }}>
        <label style={styles.formLabel}>Selecciona una clase para calificar:</label>
        <select 
          style={styles.formSelect} 
          value={claseSeleccionadaId}
          onChange={(e) => setClaseSeleccionadaId(e.target.value)}
        >
          <option value="">-- Mis Clases --</option>
          {clases.map(c => (
            <option key={c.clase_id} value={c.clase_id}>
              {c.materia_nombre} ({c.dia} {c.hora_inicio.substring(0,5)})
            </option>
          ))}
        </select>
      </div>

      {/* Mensaje de diagnóstico */}
      {mensaje && (
        <div style={mensaje.startsWith("Error") || mensaje.startsWith("No hay") ? styles.mensajeBox : styles.mensajeBoxSuccess}>
          <strong>Diagnóstico:</strong> {mensaje}
        </div>
      )}

      {/* Tabla de Alumnos para Calificar */}
      <table style={styles.usuarioTable}>
        <thead>
          <tr>
            <th style={styles.usuarioTh}>Alumno</th>
            <th style={styles.usuarioTh}>Calificación (0-10)</th>
            <th style={styles.usuarioTh}>Comentarios</th>
            <th style={styles.usuarioTh}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.length > 0 ? (
            alumnos.map((alumno) => (
              <AlumnoCalificacionRow 
                key={alumno.inscripcion_id} 
                alumno={alumno} 
                onCalificacionGuardada={() => setMensaje("¡Calificación guardada!")}
              />
            ))
          ) : (
            <tr style={styles.usuarioTr}>
              <td colSpan={4} style={{...styles.usuarioTd, textAlign: 'center', color: '#777'}}>
                {claseSeleccionadaId ? (mensaje ? '' : 'No hay alumnos inscritos.') : 'Selecciona una clase.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
    </div>
  );
}

// (Componente "AlumnoCalificacionRow" - ¡ACTUALIZADO!)
function AlumnoCalificacionRow({ alumno, onCalificacionGuardada }) {
  // Estado local para los inputs
  const [calificacion, setCalificacion] = useState(alumno.calificacion || '');
  const [comentarios, setComentarios] = useState(alumno.comentarios || '');
  const [error, setError] = useState(null);

  // Sincronizar estado si la prop (alumno) cambia
  useEffect(() => {
    setCalificacion(alumno.calificacion || '');
    setComentarios(alumno.comentarios || '');
  }, [alumno]);

  const handleGuardar = () => {
    setError(null);
    const califNum = parseFloat(calificacion);

    if (isNaN(califNum) || califNum < 0 || califNum > 10) {
      setError("Calificación debe ser un número entre 0 y 10.");
      return;
    }
    // --- ¡CAMBIO AQUÍ! ---
    fetch(`${API_BASE_URL}/api_guardar_calificacion.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        inscripcion_id: alumno.inscripcion_id, 
        calificacion: califNum,
        comentarios: comentarios
      })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200 && body.success) {
        onCalificacionGuardada(); 
      } else {
        setError(body.message || "Error al guardar.");
      }
    })
    .catch(error => {
      console.error('Error de red al guardar calif:', error);
      setError("Error de red.");
    });
  };
  
  return (
    <tr style={styles.usuarioTr}>
      <td style={styles.usuarioTd}>{alumno.nombre_completo}</td>
      <td style={styles.usuarioTd}>
        <input 
          type="number" 
          step="0.1" 
          min="0" 
          max="10"
          style={styles.calificacionInput}
          value={calificacion}
          onChange={(e) => setCalificacion(e.target.value)}
        />
      </td>
      <td style={styles.usuarioTd}>
        <input
          type="text"
          placeholder="Comentarios (opcional)"
          style={styles.calificacionComentario}
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
        />
      </td>
      <td style={styles.usuarioTd}>
        <button 
          style={styles.calificacionBotonGuardar}
          onClick={handleGuardar}
        >
          ✔️ Guardar
        </button>
        {error && <div style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>{error}</div>}
      </td>
    </tr>
  );
}
// --- (FIN) PÁGINAS "Seguimiento Académico" ---


// (Página "NotificacionesPage" - ¡ACTUALIZADO!)
function NotificacionesPage() {
  const { usuario } = useAuth(); 
  const [notificaciones, setNotificaciones] = useState([]);
  const [mensaje, setMensaje] = useState("Cargando notificaciones...");
  const [mostrarForm, setMostrarForm] = useState(false);

  const cargarNotificaciones = useCallback(() => {
    setMensaje("Actualizando notificaciones...");
    // --- ¡CAMBIO AQUÍ! ---
    const apiUrl = `${API_BASE_URL}/api_notificaciones.php`;
    
    fetch(apiUrl)
      .then(response => response.text())
      .then(text => {
        try { return JSON.parse(text); } 
        catch (e) { throw new Error("Error de JSON: " + text); }
      })
      .then(data => {
        if (Array.isArray(data)) {
          setNotificaciones(data);
          setMensaje(data.length === 0 ? "No hay notificaciones." : "");
        } else {
          throw new Error("La API no devolvió un array.");
        }
      })
      .catch(err => {
        console.error("Error cargando notificaciones:", err);
        setMensaje(`Error de Conexión: ${err.message}.`);
      });
  }, []);
  
  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  const handleEliminarNotificacion = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta notificación permanentemente?")) {
        return;
    }
    // --- ¡CAMBIO AQUÍ! ---
    fetch(`${API_BASE_URL}/api_eliminar_notificacion.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificacion_id: id }) 
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 200 && body.success) {
            setNotificaciones(prevNotificaciones => 
                prevNotificaciones.filter(n => n.notificacion_id !== id)
            );
            setMensaje("Notificación eliminada.");
            setTimeout(() => setMensaje(""), 2000); 
        } else {
            alert("Error: " + (body.message || "No se pudo eliminar la notificación."));
        }
    })
    .catch(error => {
      console.error('Error de red al eliminar:', error);
      alert("Error de conexión. No se pudo conectar con el servidor para eliminar.");
    });
  };
  
  const handleNotificacionCreada = () => {
    setMostrarForm(false); 
    cargarNotificaciones(); 
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'Advertencia': return { bg: '#fff8e1', color: '#f57f17' }; // Ámbar
      case 'Informacion': return { bg: '#e3f2fd', color: '#0d47a1' }; // Azul
      case 'Exito': return { bg: '#e8f5e9', color: '#1b5e20' }; // Verde
      default: return { bg: '#f5f5f5', color: '#424242' }; // Gris
    }
  };

  const formatarFechaHora = (fechaISO) => {
    try {
      const dateObj = new Date(fechaISO);
      return dateObj.toLocaleString('es-MX', { 
        day: 'numeric', month: 'long', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      });
    } catch(e) {
      return fechaISO;
    }
  };

  return (
    <div>
      <div style={styles.headerConBoton}>
        <h1 style={{...styles.pageHeader, margin: 0, border: 'none'}}>🔔 Centro de Notificaciones</h1>
        {usuario.rol === 'admin' && !mostrarForm && (
          <button 
            style={styles.botonNuevaAula} 
            onClick={() => setMostrarForm(true)}
          >
            ✨ Nueva Notificación
          </button>
        )}
      </div>

      {mostrarForm && (
        <FormularioNotificacion
          onNotificacionCreada={handleNotificacionCreada}
          onCancelar={() => setMostrarForm(false)}
        />
      )}

      {mensaje && (
        <div style={mensaje.startsWith("Error") || mensaje.startsWith("No hay") ? styles.mensajeBox : styles.mensajeBoxSuccess}>
          <strong>Diagnóstico:</strong> {mensaje}
        </div>
      )}
      
      <div style={styles.notificacionLista}>
        {notificaciones.map(notif => {
          const colores = getTipoColor(notif.tipo);
          return (
            <div key={notif.notificacion_id} style={styles.notificacionCard}>
              <div style={{...styles.notificacionIcono, backgroundColor: colores.bg, color: colores.color}}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"/></svg>
              </div>
              <div style={styles.notificacionContenido}>
                
                <div style={styles.notificacionHeader}>
                  <div style={styles.notificacionTitulo}>{notif.titulo}</div>
                  
                  {usuario.rol === 'admin' && (
                    <button 
                      style={styles.botonEliminarNotificacion}
                      onClick={() => handleEliminarNotificacion(notif.notificacion_id)}
                      title="Eliminar notificación"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                <p style={styles.notificacionMensaje}>{notif.mensaje}</p>
                <div style={styles.notificacionMeta}>
                  <strong>Por:</strong> {notif.creador_nombre} | <strong>Fecha:</strong> {formatarFechaHora(notif.fecha_creacion)}
                  <br/>
                  <strong>Destinatarios:</strong> {notif.destinatarios_desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// (Componente "FormularioNotificacion" - ¡ACTUALIZADO!)
function FormularioNotificacion({ onNotificacionCreada, onCancelar }) {
  const { usuario } = useAuth(); 
  
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState('Informacion');
  const [destinatarios, setDestinatarios] = useState('');
  
  const [error, setError] = useState(null);
  const [msgExito, setMsgExito] = useState(null); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setMsgExito(null);

    if (!titulo || !mensaje || !tipo || !destinatarios) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const nuevaNotificacion = {
      creador_id: usuario.id,
      titulo, 
      mensaje, 
      tipo,
      destinatarios_desc: destinatarios
    };
    // --- ¡CAMBIO AQUÍ! ---
    let apiUrl = `${API_BASE_URL}/api_crear_notificacion.php`;

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaNotificacion)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      if (status === 201 && body.success) {
        setMsgExito(body.message + " Refrescando lista...");
        setTitulo('');
        setMensaje('');
        setTipo('Informacion');
        setDestinatarios('');
        
        setTimeout(() => {
          onNotificacionCreada(); 
        }, 1500);
      } else {
        setError(body.message || "Error al guardar la notificación.");
      }
    })
    .catch(error => {
      console.error('Error de red al crear notificación:', error);
      setError("Error de red. ¿Está XAMPP (Apache) corriendo?");
    });
  };

  return (
    <div style={styles.formCrearAula}> {/* Reutilizamos estilo */}
      <h2 style={{marginTop: 0, marginBottom: '20px', color: '#333'}}>✨ Crear Nueva Notificación</h2>
      {error && <div style={{...styles.mensajeBox, marginBottom: '15px'}}>{error}</div>}
      {msgExito && <div style={{...styles.mensajeBoxSuccess, marginBottom: '15px'}}>{msgExito}</div>}
      <form onSubmit={handleSubmit}>
        {/* Fila 1 */}
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Título</label>
            <input type="text" placeholder="Ej. Cambio de Aula" style={styles.formInput} value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Tipo</label>
            <select style={styles.formSelect} value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="Informacion">Información</option>
              <option value="Advertencia">Advertencia</option>
              <option value="Exito">Éxito</option>
            </select>
          </div>
        </div>
        {/* Fila 2 */}
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Mensaje</label>
            <textarea 
              placeholder="Escribe el contenido de la notificación..." 
              style={styles.formInputArea} 
              value={mensaje} 
              onChange={(e) => setMensaje(e.target.value)}
            />
          </div>
        </div>
        {/* Fila 3 */}
        <div style={styles.formRow}>
          <div style={styles.formCol}>
            <label style={styles.formLabel}>Destinatarios</label>
            <input type="text" placeholder="Ej. Todos los alumnos, Docentes de 5to" style={styles.formInput} value={destinatarios} onChange={(e) => setDestinatarios(e.target.value)} />
          </div>
        </div>
        {/* Botones */}
        <div style={styles.formBotones}>
          <button type="submit" style={styles.formBotonGuardar}>✔️ Enviar Notificación</button>
          <button type="button" onClick={onCancelar} style={styles.formBotonCancelar}>❌ Cancelar</button>
        </div>
      </form>
    </div>
  );
}
// --- (FIN) PÁGINAS "Notificaciones" ---


// (Página "MisCalificacionesPage" - ¡ACTUALIZADO!)
function MisCalificacionesPage() {
  const { usuario } = useAuth(); // Necesitamos el ID del alumno
  const [calificaciones, setCalificaciones] = useState([]);
  const [mensaje, setMensaje] = useState("Cargando tus calificaciones...");

  // Cargar las calificaciones del alumno
  useEffect(() => {
    if (!usuario) return; // No hacer nada si el usuario no se ha cargado

    setMensaje("Cargando...");
    // --- ¡CAMBIO AQUÍ! ---
    const apiUrl = `${API_BASE_URL}/api_mis_calificaciones.php?alumno_id=${usuario.id}`;
    
    fetch(apiUrl)
      .then(response => response.text())
      .then(text => {
        try { return JSON.parse(text); } 
        catch (e) { throw new Error("Error de JSON: " + text); }
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCalificaciones(data);
          setMensaje(data.length === 0 ? "Aún no tienes calificaciones registradas." : "");
        } else {
          setMensaje("Error: La API no devolvió un array de calificaciones.");
        }
      })
      .catch(error => {
        console.error('Error al conectar con la API de PHP:', error);
        setMensaje(`Error de Conexión: ${error.message}.`);
      });
  }, [usuario]); // Se ejecuta cuando 'usuario' está disponible

  // Función para dar estilo a la calificación
  const getEstiloCalificacion = (calif) => {
    if (calif === null || calif === undefined) {
      return { color: '#777', fontWeight: 'normal' };
    }
    const califNum = parseFloat(calif);
    if (califNum < 6) {
      return { color: '#d32f2f', fontWeight: 'bold' }; // Rojo
    }
    if (califNum >= 9) {
      return { color: '#2e7d32', fontWeight: 'bold' }; // Verde
    }
    return { color: '#111', fontWeight: 'normal' }; // Normal
  };

  return (
    <div>
      <h1 style={styles.pageHeader}>🎓 Mis Calificaciones</h1>
      
      {/* Mensaje de diagnóstico */}
      {mensaje && (
        <div style={mensaje.startsWith("Error") || mensaje.startsWith("Aún no") ? styles.mensajeBox : styles.mensajeBoxSuccess}>
          <strong>Diagnóstico:</strong> {mensaje}
        </div>
      )}
      
      {/* Tabla de Calificaciones (reutilizamos estilos de usuario) */}
      <table style={styles.usuarioTable}>
        <thead>
          <tr>
            <th style={styles.usuarioTh}>Clave</th>
            <th style={styles.usuarioTh}>Materia</th>
            <th style={styles.usuarioTh}>Docente</th>
            <th style={styles.usuarioTh}>Calificación</th>
            <th style={styles.usuarioTh}>Comentarios</th>
          </tr>
        </thead>
        <tbody>
          {calificaciones.length > 0 ? (
            calificaciones.map((calif, index) => (
              <tr key={index} style={styles.usuarioTr}>
                <td style={styles.usuarioTd}>{calif.materia_clave}</td>
                <td style={styles.usuarioTd}>{calif.materia_nombre}</td>
                <td style={styles.usuarioTd}>{calif.docente_nombre}</td>
                <td style={{...styles.usuarioTd, ...getEstiloCalificacion(calif.calificacion), textAlign: 'center'}}>
                  {/* Mostramos "N/A" si la calificación es null */}
                  {calif.calificacion !== null ? calif.calificacion : 'N/A'}
                </td>
                <td style={{...styles.usuarioTd, fontSize: '0.9em', fontStyle: 'italic', color: '#555'}}>
                  {calif.comentarios || ''}
                </td>
              </tr>
            ))
          ) : (
            <tr style={styles.usuarioTr}>
              <td colSpan={5} style={{...styles.usuarioTd, textAlign: 'center', color: '#777'}}>
                {/* No mostramos nada si el mensaje ya está visible */}
                {mensaje ? '' : '...'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
// --- (FIN) PÁGINA "Mis Calificaciones" ---


// (Página 404 No Encontrado)
function NoEncontrado() {
  return (
    <div>
      <h1 style={styles.pageHeader}>Error 404</h1>
      <p>La página que buscas no existe.</p>
    </div>
  );
}

export default App;