import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// PRODUCTOS
export const getProductos    = ()       => api.get('/productos/')
export const getProducto     = (id)     => api.get(`/productos/${id}`)
export const createProducto  = (data)   => api.post('/productos/', data)
export const updateProducto  = (id, data) => api.put(`/productos/${id}`, data)
export const deleteProducto  = (id)     => api.delete(`/productos/${id}`)

// PEDIDOS
export const getPedidos      = ()       => api.get('/pedidos/')
export const createPedido    = (data)   => api.post('/pedidos/', data)
export const getColaPedidos  = ()       => api.get('/pedidos/cola')
export const procesarPedido  = ()       => api.post('/pedidos/procesar')

// DEVOLUCIONES
export const createDevolucion    = (data) => api.post('/devoluciones/', data)
export const getPilaDevoluciones = ()     => api.get('/devoluciones/pila')
export const atenderDevolucion   = ()     => api.post('/devoluciones/atender')