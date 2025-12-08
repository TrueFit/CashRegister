from flask import Flask, send_from_directory
from db.database import init_db, db_session, engine
from db.models import Product
from api.routes import api_bp
import os
import csv

app = Flask(__name__, static_folder='static', static_url_path='')

# Register Blueprint
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

def seed_db():
    from sqlalchemy.orm import Session
    session = Session(bind=engine)
    try:
        if session.query(Product).count() == 0:
            print("Seeding database...")
            csv_path = os.path.join(os.path.dirname(__file__), 'fixtures', 'products.csv')
            with open(csv_path, 'r') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    product = Product(
                        name=row['name'],
                        price_cents=int(float(row['price']) * 100),
                        stock=int(row['stock'])
                    )
                    session.add(product)
            session.commit()
            print("Database seeded.")
    except Exception as e:
        print(f"Error seeding DB: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == '__main__':
    init_db()
    seed_db()
    app.run(host='0.0.0.0', port=5001, debug=True)
