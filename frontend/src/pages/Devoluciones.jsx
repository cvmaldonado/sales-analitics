import { useEffect, useState } from 'react'
import { Plus, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { getPedidos, createDevolucion, atenderDevolucion, getPilaDevoluciones } from '../services/api'

export default function Devoluciones() {
  const [pedidos, setPedidos]   = useState([])
  const [pila, setPila]         = useState({ tamanio: 0, tope: null, devoluciones: [] })
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]         = useState({ pedido_id: '', motivo: '' })

  const cargar = async () => {
    const [pRes, pilaRes] = await Promise.all([getPedidos(), getPilaDevoluciones()])
    // Solo pedidos procesados pueden devolverse
    setPedidos(pRes.data.filter(p => p.estado === 'procesado'))
    setPila(pilaRes.data)
  }

  useEffect(() => { cargar() }, [])

  const registrar = async () => {
    try {
      await createDevolucion({ pedido_id: parseInt(form.pedido_id), motivo: form.motivo })
      toast.success('Devolución registrada y apilada')
      setShowModal(false)
      cargar()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Error al registrar')
    }
  }

  const atender = async () => {
    try {
      const res = await atenderDevolucion()
      if (res.data.atendida) {
        toast.success(`Devolución #${res.data.atendida.id} atendida`)
      } else {
        toast('No hay devoluciones pendientes', { icon: 'ℹ️' })
      }
      cargar()
    } catch {
      toast.error('Error al atender')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Devoluciones</h1>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button className="btn btn-success" onClick={atender}>
            <ChevronUp size={16} /> Atender tope
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Nueva devolución
          </button>
        </div>
      </div>

      {/* Estado de la pila */}
      <div className="card" style={{ marginBottom: '1rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div>
          <div className="stat-label">Devoluciones en pila</div>
          <div className="stat-value" style={{ color: 'var(--danger)', fontSize: '1.4rem' }}>{pila.tamanio}</div>
        </div>
        {pila.tope && (
          <div>
            <div className="stat-label">Tope de la pila (próxima a atender)</div>
            <div style={{ fontWeight: 600 }}>Devolución #{pila.tope.id} — Pedido #{pila.tope.pedido_id}</div>
            <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>{pila.tope.motivo}</div>
          </div>
        )}
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>ID</th><th>Pedido #</th><th>Motivo</th><th>Fecha</th></tr>
          </thead>
          <tbody>
            {pila.devoluciones.map(d => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.pedido_id}</td>
                <td>{d.motivo}</td>
                <td>{new Date(d.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nueva devolución</h2>
            <div className="form-group">
              <label>Pedido procesado</label>
              <select value={form.pedido_id} onChange={e => setForm({ ...form, pedido_id: e.target.value })}>
                <option value="">Seleccionar...</option>
                {pedidos.map(p => (
                  <option key={p.id} value={p.id}>#{p.id} — {p.producto} (x{p.cantidad})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Motivo</label>
              <textarea
                rows={3}
                value={form.motivo}
                onChange={e => setForm({ ...form, motivo: e.target.value })}
                style={{ resize: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={registrar}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}