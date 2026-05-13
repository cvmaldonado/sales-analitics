from flask import Flask, jsonify
from extensions import db

import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Importar rutas
from routes.products    import productos_bp
from routes.orders      import pedidos_bp
from routes.returns import devoluciones_bp

app.register_blueprint(productos_bp,    url_prefix='/api/productos')
app.register_blueprint(pedidos_bp,      url_prefix='/api/pedidos')
app.register_blueprint(devoluciones_bp, url_prefix='/api/devoluciones')

@app.route('/health')
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)