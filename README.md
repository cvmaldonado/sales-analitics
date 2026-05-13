# Inventory Management System

Sistema web de gestión de inventarios desarrollado como proyecto final del curso de Programación III (Python) — Universidad Mariano Gálvez de Guatemala.

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.11 + Flask |
| Base de datos | MySQL 8.0 |
| Frontend | React + Vite |
| Contenedores | Docker + Docker Compose |
| ORM | SQLAlchemy |
| HTTP Client | Axios |


---

## Arquitectura

El proyecto sigue una arquitectura **MVC** adaptada a Flask, con separación clara de responsabilidades:

- **Model** → `models.py` define las tablas y su representación en Python via SQLAlchemy.
- **Controller** → `routes/*.py` contiene la lógica de negocio y manejo de peticiones HTTP.
- **View** → El frontend en React consume la API REST y renderiza la interfaz.

### Flujo de una petición

```
Navegador (localhost:5173)
    │
    ▼
React + Vite  ──proxy /api──►  Flask (interno: flask:5000)
                                    │
                                    ▼
                               SQLAlchemy
                                    │
                                    ▼
                               MySQL (interno: mysql:3306)
```

---

## Estructuras de datos implementadas

### Cola (FIFO) — Pedidos

Implementada con nodos enlazados. Se utiliza para gestionar los pedidos en orden de llegada: el primero en ingresar es el primero en procesarse.

```python
cola_pedidos.encolar(pedido)   # nuevo pedido entra al final
cola_pedidos.desencolar()      # se procesa el más antiguo
```

### Pila (LIFO) — Devoluciones

Implementada con nodos enlazados. Se utiliza para gestionar devoluciones: la más reciente es la primera en atenderse (útil para garantías o cambios inmediatos).

```python
pila_devoluciones.apilar(devolucion)   # nueva devolución va al tope
pila_devoluciones.desapilar()          # se atiende la más reciente
```

---

## Cómo correr el proyecto

### Requisitos

- Docker Desktop instalado y corriendo
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd inventory-management

# 2. Levantar todos los contenedores
docker-compose up --build

# 3. Acceder a la aplicación
#    Frontend:  http://localhost:5173
#    API REST:  http://localhost:5001/api
```

> La base de datos se inicializa automáticamente con tablas y datos de prueba al primer arranque.

---

## API REST — Endpoints

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos/` | Listar todos los productos |
| GET | `/api/productos/<id>` | Obtener un producto |
| POST | `/api/productos/` | Crear producto |
| PUT | `/api/productos/<id>` | Actualizar producto |
| DELETE | `/api/productos/<id>` | Eliminar producto |

### Pedidos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pedidos/` | Listar todos los pedidos |
| POST | `/api/pedidos/` | Crear pedido (se encola automáticamente) |
| GET | `/api/pedidos/cola` | Ver estado actual de la cola en memoria |
| POST | `/api/pedidos/procesar` | Procesar el pedido al frente de la cola |

### Devoluciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/devoluciones/` | Registrar devolución (se apila automáticamente) |
| GET | `/api/devoluciones/pila` | Ver estado actual de la pila en memoria |
| POST | `/api/devoluciones/atender` | Atender la devolución en el tope de la pila |

---

## Base de datos

### Tablas

**`productos`** — catálogo de productos disponibles  
**`pedidos`** — órdenes realizadas sobre productos  
**`devoluciones`** — devoluciones asociadas a pedidos procesados  

### Conexión externa (DBeaver, TablePlus, etc.)

| Campo | Valor |
|-------|-------|
| Host | `localhost` |
| Puerto | `3306` |
| Base de datos | `inventario_db` |
| Usuario | `admin` |

---
