from extensions import db

from datetime import datetime

class Producto(db.Model):
    __tablename__ = 'productos'

    id          = db.Column(db.Integer, primary_key=True)
    nombre      = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    precio      = db.Column(db.Numeric(10, 2), nullable=False)
    stock       = db.Column(db.Integer, default=0)
    categoria   = db.Column(db.String(50))
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id":          self.id,
            "nombre":      self.nombre,
            "descripcion": self.descripcion,
            "precio":      float(self.precio),
            "stock":       self.stock,
            "categoria":   self.categoria,
            "created_at":  self.created_at.isoformat()
        }

class Pedido(db.Model):
    __tablename__ = 'pedidos'

    id          = db.Column(db.Integer, primary_key=True)
    producto_id = db.Column(db.Integer, db.ForeignKey('productos.id'), nullable=False)
    cantidad    = db.Column(db.Integer, nullable=False)
    estado      = db.Column(db.Enum('pendiente', 'procesado', 'cancelado'), default='pendiente')
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    producto = db.relationship('Producto', backref='pedidos')

    def to_dict(self):
        return {
            "id":          self.id,
            "producto_id": self.producto_id,
            "producto":    self.producto.nombre if self.producto else None,
            "cantidad":    self.cantidad,
            "estado":      self.estado,
            "created_at":  self.created_at.isoformat()
        }

class Devolucion(db.Model):
    __tablename__ = 'devoluciones'

    id         = db.Column(db.Integer, primary_key=True)
    pedido_id  = db.Column(db.Integer, db.ForeignKey('pedidos.id'), nullable=False)
    motivo     = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    pedido = db.relationship('Pedido', backref='devoluciones')

    def to_dict(self):
        return {
            "id":        self.id,
            "pedido_id": self.pedido_id,
            "motivo":    self.motivo,
            "created_at": self.created_at.isoformat()
        }