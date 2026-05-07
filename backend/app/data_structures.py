# ==============================================================
# ESTRUCTURAS DE DATOS - Gestión de Inventarios
#
# Cola (Queue) → manejo de pedidos (FIFO)
#   Justificación: los pedidos se procesan en orden de llegada.
#   El primero en llegar es el primero en atenderse.
#
# Pila (Stack) → gestión de devoluciones (LIFO)
#   Justificación: la devolución más reciente es la primera
#   en revisarse (ej. garantías, cambios inmediatos).
# ==============================================================

class NodoCola:
    def __init__(self, dato):
        self.dato = dato
        self.siguiente = None

class ColaPedidos:
    """Cola enlazada — FIFO — para gestionar pedidos pendientes."""

    def __init__(self):
        self.frente = None
        self.final  = None
        self._size  = 0

    def encolar(self, pedido: dict):
        nodo = NodoCola(pedido)
        if self.final:
            self.final.siguiente = nodo
        self.final = nodo
        if self.frente is None:
            self.frente = nodo
        self._size += 1

    def desencolar(self):
        if self.esta_vacia():
            return None
        dato = self.frente.dato
        self.frente = self.frente.siguiente
        if self.frente is None:
            self.final = None
        self._size -= 1
        return dato

    def ver_frente(self):
        return self.frente.dato if self.frente else None

    def esta_vacia(self):
        return self.frente is None

    def tamanio(self):
        return self._size

    def to_list(self):
        resultado = []
        actual = self.frente
        while actual:
            resultado.append(actual.dato)
            actual = actual.siguiente
        return resultado


class NodoPila:
    def __init__(self, dato):
        self.dato = dato
        self.anterior = None

class PilaDevoluciones:
    """Pila enlazada — LIFO — para gestionar devoluciones recientes."""

    def __init__(self):
        self.tope  = None
        self._size = 0

    def apilar(self, devolucion: dict):
        nodo = NodoPila(devolucion)
        nodo.anterior = self.tope
        self.tope = nodo
        self._size += 1

    def desapilar(self):
        if self.esta_vacia():
            return None
        dato = self.tope.dato
        self.tope = self.tope.anterior
        self._size -= 1
        return dato

    def ver_tope(self):
        return self.tope.dato if self.tope else None

    def esta_vacia(self):
        return self.tope is None

    def tamanio(self):
        return self._size

    def to_list(self):
        resultado = []
        actual = self.tope
        while actual:
            resultado.append(actual.dato)
            actual = actual.anterior
        return resultado


# Instancias globales compartidas por toda la app
cola_pedidos      = ColaPedidos()
pila_devoluciones = PilaDevoluciones()