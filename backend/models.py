from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Each user can have ONLY ONE active skill/learning path
    skill_id = db.Column(db.Integer, db.ForeignKey("skills.id"), nullable=True)
    current_level = db.Column(db.String(20), nullable=True)  # beginner / intermediate / advanced

    # Relationships
    skill = db.relationship("Skill", back_populates="users", uselist=False)
    learning_path = db.relationship("LearningPath", back_populates="user", uselist=False)
    quiz_results = db.relationship("QuizResult", back_populates="user", lazy=True)


class Skill(db.Model):
    __tablename__ = "skills"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)

    # Relationships
    users = db.relationship("User", back_populates="skill")
    learning_paths = db.relationship("LearningPath", back_populates="skill", lazy=True)
    quiz_results = db.relationship("QuizResult", back_populates="skill", lazy=True)


class LearningPath(db.Model):
    __tablename__ = "learning_paths"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)  # One path per user
    skill_id = db.Column(db.Integer, db.ForeignKey("skills.id"), nullable=False)
    level = db.Column(db.String(20), nullable=False)
    path_data = db.Column(db.JSON, nullable=False)
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", back_populates="learning_path")
    skill = db.relationship("Skill", back_populates="learning_paths")
    steps = db.relationship("LearningStepProgress", backref="learning_path", lazy=True)


class LearningStepProgress(db.Model):
    __tablename__ = "learning_step_progress"

    id = db.Column(db.Integer, primary_key=True)
    path_id = db.Column(db.Integer, db.ForeignKey("learning_paths.id"), nullable=False)
    step_name = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)


class QuizResult(db.Model):
    __tablename__ = "quiz_results"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey("skills.id"), nullable=False)
    level = db.Column(db.String(20), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    passed = db.Column(db.Boolean, nullable=False)
    taken_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", back_populates="quiz_results")
    skill = db.relationship("Skill", back_populates="quiz_results")
