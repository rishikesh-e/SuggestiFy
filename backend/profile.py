from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from backend.models import User, LearningPath,  QuizResult

profile_bp = Blueprint("profile", __name__, url_prefix="/profile")

@profile_bp.route("/")
@login_required
def get_profile():
    user = current_user

    # Fetch learning paths
    learning_paths = LearningPath.query.filter_by(user_id=user.id).all()

    currently_learning = []
    progress_data = []

    for lp in learning_paths:
        steps = lp.steps
        total_steps = len(steps)
        completed_steps = sum(1 for step in steps if step.completed)
        progress = (completed_steps / total_steps) * 100 if total_steps > 0 else 0

        currently_learning.append(lp.skill.name)
        progress_data.append({
            "skill": lp.skill.name,
            "progress": round(progress, 2)
        })

    # Count quizzes taken
    quiz_count = QuizResult.query.filter_by(user_id=user.id).count()

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "created_at": user.created_at.isoformat(),
        "currently_learning": currently_learning,
        "progress": progress_data,
        "quizzes_taken": quiz_count
    })

