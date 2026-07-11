import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Message from '../components/Message';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: '',
    imagen: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get('/categorias');
        setCategorias(res.data);
      } catch (err) {
        setError('Error al cargar categorías');
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchProducto = async () => {
        try {
          const res = await api.get(`/productos/${id}`);
          const p = res.data;
          setForm({
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            categoria: p.categoria?._id || '',
            stock: p.stock,
            imagen: p.imagen || ''
          });
        } catch (err) {
          setError('Error al cargar el producto');
        }
      };
      fetchProducto();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nombre || !form.descripcion || !form.precio || !form.categoria || form.stock === '') {
      setError('Todos los campos obligatorios deben estar llenos');
      return;
    }

    try {
      setLoading(true);
      const data = {
        ...form,
        precio: Number(form.precio),
        stock: Number(form.stock)
      };

      if (isEditing) {
        await api.put(`/productos/${id}`, data);
      } else {
        await api.post('/productos', data);
      }

      navigate('/admin/productos');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h1>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h1>
      <Message tipo="error" mensaje={error} />
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción *</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción del producto"
            required
            rows="4"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Precio *</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Stock *</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Categoría *</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>URL de Imagen (opcional)</label>
          <input
            type="text"
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/productos')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
