from urllib import request
import re
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from backend.models import db, QuizResult, LearningPath
from generator import *

quiz_bp = Blueprint('services', __name__, url_prefix='/api')

@login_required
@quiz_bp.route('/generate-quiz/<skill>', methods=['GET'])
def generate_quiz_route(skill):
    raw_content = generate_quiz(skill)
    cleaned = re.sub(r"^```json\s*|\s*```$", "", raw_content.strip())
    try:
        import json
        content = json.loads(cleaned)
    except Exception:
        content = {"quiz": cleaned}

    return jsonify(content)

@quiz_bp.route("/submit", methods=["POST"])
@login_required
def submit_quiz():
    data = request.get_json()
    score = data["score"]
    skill_id = data["skill_id"]

    # Decide pass/fail
    passed = score >= 6

    # Decide level
    if score < 6:
        level = "Beginner"
    elif 6 <= score <= 8:
        level = "Intermediate"
    else:
        level = "Advanced"

    # 1. Save quiz attempt history
    quiz_result = QuizResult(
        user_id=current_user.id,
        skill_id=skill_id,
        score=score,
        passed=passed
    )
    db.session.add(quiz_result)

    # 2. Update or create learning path
    learning_path = LearningPath.query.filter_by(
        user_id=current_user.id, skill_id=skill_id
    ).first()

    if learning_path:
        # update existing
        learning_path.level = level
    else:
        # create new record
        learning_path = LearningPath(
            user_id=current_user.id,
            skill_id=skill_id,
            level=level
        )
        db.session.add(learning_path)

    db.session.commit()

    return jsonify({
        "message": "Quiz submitted successfully",
        "score": score,
        "passed": passed,
        "level": level
    })
