CREATE DATABASE IF NOT EXISTS DBINVENTORY;
USE DBINVENTORY;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    estado ENUM('pendiente', 'procesado', 'cancelado') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE devoluciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    motivo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- Datos de prueba
INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES
('Laptop Dell', '15 pulgadas, 16GB RAM', 5500.00, 10, 'Electronica'),
('Mouse Logitech', 'Inalámbrico, ergonómico', 150.00, 50, 'Periféricos'),
('Teclado Mecánico', 'RGB, switches blue', 350.00, 30, 'Periféricos'),
('Monitor 24"', 'Full HD, 144Hz', 2200.00, 15, 'Electronica'),
('Silla Gamer', 'Reclinable, con soporte lumbar', 1800.00, 8, 'Mobiliario');