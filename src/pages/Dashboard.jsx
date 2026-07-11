import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#f59e0b', '#64748b'];

export default function Dashboard() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario?.rol === 'admin') {
      setLoading(true);
      api.get('/dashboard/stats')
        .then((res) => setStats(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [usuario]);

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <h1>Bienvenido a Tienda Virtual</h1>
        <p>Encuentra los mejores productos al mejor precio</p>
        <Link to="/productos" className="btn btn-primary btn-lg">
          Ver Productos
        </Link>
      </div>

      {usuario && usuario.rol === 'admin' && (
        <div className="dashboard-admin">
          <h2>Panel de Administración</h2>

          {loading ? <LoadingSpinner /> : stats ? (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>{stats.totalProductos}</h3>
                  <p>Productos</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.totalCategorias}</h3>
                  <p>Categorías</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.totalOrdenes}</h3>
                  <p>Órdenes</p>
                </div>
                <div className="stat-card">
                  <h3>{stats.totalUsuarios}</h3>
                  <p>Usuarios</p>
                </div>
                <div className="stat-card stat-card-primary">
                  <h3>${stats.ventasTotales.toFixed(2)}</h3>
                  <p>Ventas Totales</p>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Ventas por Mes</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stats.ventasPorMes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h3>Productos por Categoría</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={stats.productosPorCategoria}
                        dataKey="cantidad"
                        nameKey="categoria"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ categoria, cantidad }) => `${categoria}: ${cantidad}`}
                      >
                        {stats.productosPorCategoria.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h3>Órdenes por Estado</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stats.ordenesPorEstado}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="estado" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <p className="empty-message">No hay datos estadísticos disponibles</p>
          )}

          <div className="admin-links">
            <Link to="/admin/productos" className="btn btn-primary">
              Administrar Productos
            </Link>
            <Link to="/ordenes" className="btn btn-secondary">
              Ver Todas las Órdenes
            </Link>
          </div>
        </div>
      )}

      {usuario && usuario.rol === 'cliente' && (
        <div className="dashboard-info">
          <h2>Panel de Cliente</h2>
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Perfil</h3>
              <p><strong>Nombre:</strong> {usuario.nombre}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
            </div>
            <div className="dashboard-card">
              <h3>Acciones rápidas</h3>
              <Link to="/productos" className="btn btn-secondary">Ver catálogo</Link>
              <Link to="/ordenes" className="btn btn-secondary">Mis órdenes</Link>
              <Link to="/perfil" className="btn btn-secondary">Mi perfil</Link>
            </div>
          </div>
        </div>
      )}

      {!usuario && (
        <div className="dashboard-cta">
          <h2>¿Listo para empezar?</h2>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Registrarse</Link>
            <Link to="/login" className="btn btn-secondary">Iniciar Sesión</Link>
          </div>
        </div>
      )}
    </div>
  );
}
