import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LayoutDashboard, Package, ShoppingCart, RotateCcw } from 'lucide-react'
import Dashboard    from './pages/Dashboard'
import Productos    from './pages/Productos'    
import Pedidos      from './pages/Pedidos'
import Devoluciones from './pages/Devoluciones'
import './App.css'

const navItems = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/productos',     icon: Package,         label: 'Productos'    },
  { to: '/pedidos',       icon: ShoppingCart,    label: 'Pedidos'      },
  { to: '/devoluciones',  icon: RotateCcw,       label: 'Devoluciones' },
]

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <Package size={24} />
            <span>Inventario</span>
          </div>
          <nav>
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="content">
          <Routes>
            <Route path="/"             element={<Dashboard />}    />
            <Route path="/productos"    element={<Productos />}    />
            <Route path="/pedidos"      element={<Pedidos />}      />
            <Route path="/devoluciones" element={<Devoluciones />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}