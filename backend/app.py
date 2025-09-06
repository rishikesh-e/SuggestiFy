import os
from flask import Flask, jsonify
from flask_cors import CORS

from backend.auth import auth_bp
from backend.models import db, Skill, Quiz
from flask_login import LoginManager, login_required, current_user
from backend.models import User
from backend.profile import profile_bp
from backend.quiz import quiz_bp

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'dev_secret_key')

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

login_manager=LoginManager()
login_manager.init_app(app)
@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))
@app.route("/whoami")
@login_required
def whoami():
    return {"id": current_user.id, "email": current_user.email, "authenticated": current_user.is_authenticated}


db.init_app(app)

with app.app_context():
    #db.drop_all()
    db.create_all()

#with app.app_context():
#    python_skill = Skill.query.filter_by(name="python").first()
#    if python_skill:
#        Quiz.query.filter_by(skill_id=python_skill.id).delete()
#        db.session.commit()


@app.errorhandler(404)
def not_found(e):
    return {"error": "Not Found"}, 404

@app.route("/health")
def health():
    return {"status": "ok"}



app.register_blueprint(auth_bp)
app.register_blueprint(quiz_bp)
app.register_blueprint(profile_bp)

if __name__ == "__main__":
    app.run(debug=True)
