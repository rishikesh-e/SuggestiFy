from sqlite3 import IntegrityError
from flask import request, jsonify, Blueprint
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import login_user, logout_user, login_required

from backend.models import User, db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    if not email or not password:
        return jsonify({"message": "Email password are required"}), 401

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "User not found"}), 401
    if not check_password_hash(user.password, password):
        return jsonify({"message": "Password is incorrect"}), 401

    login_user(user, remember=True)
    return jsonify({"message": "Login successful"}), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not all([username, password, email]):
        return jsonify({"message": "All fields are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User with this email already registered"}), 400

    try:
        user = User(
            name=username,
            email=email,
            password=generate_password_hash(password),
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered"}), 200
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"message": "Integrity error: " + str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error: " + str(e)}), 500

'''@auth_bp.route("/logout", methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200'''