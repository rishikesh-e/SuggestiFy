import datetime

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from backend.models import Skill, LearningPath, db, LearningStepProgress, QuizResult

from generator import *

path_bp = Blueprint('path_bp', __name__, url_prefix='/path')

@path_bp.before_request
def debug_auth():
    print("Current user:", current_user)
    print("Is authenticated:", current_user.is_authenticated)


@path_bp.route("/learning-paths/generate/<int:skill_id>", methods=["POST"])
@login_required
def generate_path(skill_id):
    """Generate a new learning path for a user at a given level (after quiz pass)."""
    # Get the latest quiz result for this skill
    quiz_result = (
        QuizResult.query
        .filter_by(user_id=current_user.id, skill_id=skill_id, passed=True)
        .order_by(QuizResult.taken_at.desc())
        .first()
    )
    if not quiz_result:
        return jsonify({"error": "No passed quiz found for this skill"}), 400

    level = quiz_result.level   # beginner / intermediate / advanced
    skill = Skill.query.get_or_404(skill_id)

    # Generate the path
    path_data = generate_learning_path(skill.name, level)

    # If user already has a path, replace it
    existing_path = LearningPath.query.filter_by(user_id=current_user.id).first()
    if existing_path:
        db.session.delete(existing_path)
        db.session.commit()

    # Create new path
    path = LearningPath(
        user_id=current_user.id,
        skill_id=skill_id,
        level=level,
        path_data=path_data,
    )
    db.session.add(path)
    db.session.commit()

    # Create steps
    for topic in path_data["topics"]:
        step = LearningStepProgress(
            path_id=path.id,
            step_name=topic["name"],
        )
        db.session.add(step)

    db.session.commit()

    return jsonify({"message": "Learning path generated", "path_id": path.id})


@path_bp.route("/learning-paths", methods=["GET"])
@login_required
def get_path():
    """Fetch the current user's learning path with steps + progress."""
    path = LearningPath.query.filter_by(user_id=current_user.id).first()
    if not path:
        return jsonify({"error": "No learning path found"}), 404

    steps = LearningStepProgress.query.filter_by(path_id=path.id).all()

    return jsonify({
        "skill": path.skill.name,
        "level": path.level,
        "path_data": path.path_data,
        "steps": [{"id": s.id, "name": s.step_name, "completed": s.completed} for s in steps]
    })



@path_bp.route("/learning-paths/<int:path_id>/progress", methods=["GET"])
@login_required
def get_progress(path_id):
    """Calculate percentage completion of a learning path."""
    steps = LearningStepProgress.query.filter_by(path_id=path_id).all()
    if not steps:
        return jsonify({"progress": 0})

    total = len(steps)
    done = sum(1 for s in steps if s.completed)
    progress = int((done / total) * 100)

    return jsonify({"progress": progress})


@path_bp.route("/learning-steps/<int:step_id>/complete", methods=["PATCH"])
@login_required
def complete_step(step_id):
    """Generate a quiz for the step and complete based on score."""
    step = LearningStepProgress.query.get_or_404(step_id)
    data = request.get_json()
    score = data.get("score")

    # Generate quiz for this step (you will implement this function)
    quiz = generate_step_quiz(step.step_name)

    if score is not None:
        if score >= 7:
            step.completed = True
            step.completed_at = datetime.datetime.utcnow()
            db.session.commit()
            return jsonify({
                "message": f"Step '{step.step_name}' completed",
                "quiz": quiz
            })
        else:
            return jsonify({
                "message": f"Step '{step.step_name}' not completed, score too low",
                "quiz": quiz
            }), 400

    return jsonify({
        "message": "Score not provided",
        "quiz": quiz
    }), 400


@path_bp.route("/skills/<int:skill_id>", methods=["DELETE"])
@login_required
def delete_skill(skill_id):
    """Delete a skill and all its related learning paths and steps."""
    skill = Skill.query.get_or_404(skill_id)

    # Delete related progress first
    for path in skill.learning_paths:
        for step in path.steps:
            LearningStepProgress.query.filter_by(step_id=step.id).delete()

    # Delete learning paths (steps will be deleted because of cascade)
    for path in skill.learning_paths:
        db.session.delete(path)

    # Finally delete the skill
    db.session.delete(skill)
    db.session.commit()

    return jsonify({"message": f"Skill '{skill.name}' and related data deleted successfully"})
