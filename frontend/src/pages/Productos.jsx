import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/api'

const empty = { nombre: '', descripcion: '', precio: '', stock: '', categoria: '' }

export default function Productos() {
  const [productos, setProductos]   = useState([])
  const [showModal, setShowModal]   = useState(false)
  const [editando, setEditando]     = useState(null)
  const [form, setForm]             = useState(empty)

  const cargar = async () => {
    const res = await getProductos()
    setProductos(res.data)
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setEditando(null); setForm(empty); setShowModal(true) }
  const abrirEditar = (p) => {
    setEditando(p.id)
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, categoria: p.categoria })
    setShowModal(true)
  }

  const guardar = async () => {
    try {
      if (editando) {
        await updateProducto(editando, form)
        toast.success('Producto actualizado')
      } else {
        await createProducto(form)
        toast.success('Producto creado')
      }
      setShowModal(false)
      cargar()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Error al guardar')
    }
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteProducto(id)
    toast.success('Producto eliminado')
    cargar()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Productos</h1>
        <button className="btn btn-primary" onClick={abrirCrear}>
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Categoría</th>
              <th>Precio</th><th>Stock</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>Q{parseFloat(p.precio).toFixed(2)}</td>
                <td style={{ color: p.stock < 5 ? 'var(--danger)' : 'var(--success)' }}>{p.stock}</td>
                <td style={{ display: 'flex', gap: '.5rem' }}>
                  <button className="btn btn-outline" onClick={() => abrirEditar(p)}><Pencil size={14} /></button>
                  <button className="btn btn-danger"  onClick={() => eliminar(p.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editando ? 'Editar producto' : 'Nuevo producto'}</h2>

            {['nombre', 'descripcion', 'categoria'].map(campo => (
              <div className="form-group" key={campo}>
                <label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
                <input
                  value={form[campo]}
                  onChange={e => setForm({ ...form, [campo]: e.target.value })}
                />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Precio (Q)</label>
                <input type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardar}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}