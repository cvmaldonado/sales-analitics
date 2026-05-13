import { useEffect, useState } from 'react'
import { Plus, Play } from 'lucide-react'
import toast from 'react-hot-toast'
import { getPedidos, getProductos, createPedido, procesarPedido, getColaPedidos } from '../services/api'

export default function Pedidos() {
  const [pedidos, setPedidos]     = useState([])
  const [productos, setProductos] = useState([])
  const [cola, setCola]           = useState({ tamanio: 0, frente: null })
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState({ producto_id: '', cantidad: 1 })

  const cargar = async () => {
    const [pRes, cRes, colRes] = await Promise.all([
      getPedidos(), getProductos(), getColaPedidos()
    ])
    setPedidos(pRes.data)
    setProductos(cRes.data)
    setCola(colRes.data)
  }

  useEffect(() => { cargar() }, [])

  const crear = async () => {
    try {
      await createPedido({ producto_id: parseInt(form.producto_id), cantidad: parseInt(form.cantidad) })
      toast.success('Pedido creado y encolado')
      setShowModal(false)
      cargar()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Error al crear pedido')
    }
  }

  const procesar = async () => {
    try {
      const res = await procesarPedido()
      if (res.data.procesado) {
        toast.success(`Pedido #${res.data.procesado.id} procesado`)
      } else {
        toast('No hay pedidos en cola', { icon: 'ℹ️' })
      }
      cargar()
    } catch {
      toast.error('Error al procesar')
    }
  }

  const badgeEstado = (estado) => {
    const map = { pendiente: 'badge-pending', procesado: 'badge-done', cancelado: 'badge-cancel' }
    return <span className={`badge ${map[estado]}`}>{estado}</span>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Pedidos</h1>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button className="btn btn-success" onClick={procesar}>
            <Play size={16} /> Procesar siguiente
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Nuevo pedido
          </button>
        </div>
      </div>

      {/* Estado de la cola */}
      <div className="card" style={{ marginBottom: '1rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div>
          <div className="stat-label">Pedidos en cola</div>
          <div className="stat-value" style={{ color: 'var(--primary)', fontSize: '1.4rem' }}>{cola.tamanio}</div>
        </div>
        {cola.frente && (
          <div>
            <div className="stat-label">Próximo a procesar</div>
            <div style={{ fontWeight: 600 }}>#{cola.frente.id} — {cola.frente.producto}</div>
          </div>
        )}
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>ID</th><th>Producto</th><th>Cantidad</th><th>Estado</th><th>Fecha</th></tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.producto}</td>
                <td>{p.cantidad}</td>
                <td>{badgeEstado(p.estado)}</td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nuevo pedido</h2>
            <div className="form-group">
              <label>Producto</label>
              <select value={form.producto_id} onChange={e => setForm({ ...form, producto_id: e.target.value })}>
                <option value="">Seleccionar...</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} (stock: {p.stock})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Cantidad</label>
              <input type="number" min="1" value={form.cantidad} onChange={e => setForm({ ...form, cantidad: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={crear}>Crear pedido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}