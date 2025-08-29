import os
from flask import Flask, jsonify
from backend.auth import auth_bp
from backend.learning_path import path_bp
from backend.models import db
from flask_login import LoginManager
from backend.models import User
from backend.quiz import quiz_bp

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'dev_secret_key')


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "auth.login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

db.init_app(app)

with app.app_context():
    #db.drop_all()
    db.create_all()

@app.errorhandler(404)
def not_found(e):
    return {"error": "Not Found"}, 404

@app.route("/health")
def health():
    return {"status": "ok"}

@login_manager.unauthorized_handler
def unauthorized_callback():
    return jsonify({"error": "Please log in first"}), 401

app.register_blueprint(auth_bp)
app.register_blueprint(quiz_bp)
app.register_blueprint(path_bp)

if __name__ == "__main__":
    app.run(debug=True)
