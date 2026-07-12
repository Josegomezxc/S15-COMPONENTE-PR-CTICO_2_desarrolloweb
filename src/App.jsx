import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import AdminProducts from './pages/AdminProducts';
import ProductForm from './pages/ProductForm';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Contacto from './pages/Contacto';
import About from './pages/About';
import Carreras from './pages/Carreras';
import Privacidad from './pages/Privacidad';
import Terminos from './pages/Terminos';
import ForgotPassword from './pages/ForgotPassword';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminActividad from './pages/AdminActividad';
import AdminMensajes from './pages/AdminMensajes';
import MisMensajes from './pages/MisMensajes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/productos" element={<ProductList />} />
                <Route path="/productos/:id" element={<ProductDetail />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/ofertas" element={<Ofertas />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/about" element={<About />} />
                <Route path="/carreras" element={<Carreras />} />
                <Route path="/privacidad" element={<Privacidad />} />
                <Route path="/terminos" element={<Terminos />} />
                <Route path="/olvide-contrasena" element={<ForgotPassword />} />
                <Route
                  path="/carrito"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ordenes"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ordenes/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mis-mensajes"
                  element={
                    <ProtectedRoute>
                      <MisMensajes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/productos"
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <AdminProducts />
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/productos/nuevo"
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <ProductForm />
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/productos/editar/:id"
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <ProductForm />
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/usuarios"
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <AdminUsuarios />
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/actividad"
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <AdminActividad />
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/mensajes"
                  element={
                    <ProtectedRoute>
                      <AdminRoute>
                        <AdminMensajes />
                      </AdminRoute>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
