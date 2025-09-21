from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from backend.models import db, QuizResult, LearningPath, Skill, Quiz, LearningStepProgress
from backend.generator import *

quiz_bp = Blueprint('services', __name__, url_prefix='/api')

@quiz_bp.route('/generate-quiz/<skill_name>', methods=['GET'])
@login_required
def generate_quiz_route(skill_name):
    import re, json

    # Normalize skill name
    normalized_skill = skill_name.strip().lower().replace(" ", "")

    # Check if the skill exists in DB; if not, create it
    skill_obj = Skill.query.filter_by(name=normalized_skill).first()
    if not skill_obj:
        skill_obj = Skill(name=normalized_skill, description=f"Auto-generated skill for {normalized_skill}")
        db.session.add(skill_obj)
        db.session.commit()

    # Check if quizzes for this skill already exist
    existing_quizzes = Quiz.query.filter_by(skill_id=skill_obj.id).all()
    if existing_quizzes:
        return jsonify([q.to_dict() for q in existing_quizzes])

    # Generate new quizzes using the original skill_name
    raw_content = generate_quiz(normalized_skill)
    cleaned = re.sub(r"^```json\s*|\s*```$", "", raw_content.strip())

    try:
        content = json.loads(cleaned)
        if isinstance(content, dict) and "quiz" in content:
            content = content["quiz"]
    except Exception:
        content = [{
            "question": cleaned,
            "option1": "", "option2": "", "option3": "", "option4": "", "answer": ""
        }]

    # Save new quizzes
    for item in content[:10]:
        quiz = Quiz(
            skill_id=skill_obj.id,
            question=item.get("question"),
            option1=item.get("option1"),
            option2=item.get("option2"),
            option3=item.get("option3"),
            option4=item.get("option4"),
            answer=item.get("answer"),
        )
        db.session.add(quiz)
    db.session.commit()

    return jsonify(content[:10])


@quiz_bp.route("/submit", methods=["POST"])
@login_required
def submit_quiz():
    import json
    from backend.generator import generate_learning_path

    data = request.get_json()
    score = data.get("score")
    skill_name = data.get("skill")

    if score is None or not skill_name:
        return jsonify({"error": "score and skill are required"}), 400

    normalized_skill = skill_name.strip().lower().replace(" ", "")
    skill = Skill.query.filter_by(name=normalized_skill).first()
    if not skill:
        skill = Skill(name=normalized_skill, description=f"Auto-created skill: {skill_name}")
        db.session.add(skill)
        db.session.commit()

    # Check existing learning path
    '''existing_path = LearningPath.query.filter_by(user_id=current_user.id, skill_id=skill.id).first()
    if existing_path:
        return jsonify({
            "message": "You already have a learning path for this skill",
            "skill": skill.name,
            "level": existing_path.level,
            "learning_path": json.loads(existing_path.path_data),
            "steps": [step.to_dict() for step in existing_path.steps]
        }), 200'''

    # Normal quiz result creation
    passed = score >= 6
    if score < 6:
        level = "Beginner"
    elif 6 <= score <= 8:
        level = "Intermediate"
    else:
        level = "Advanced"

    quiz_result = QuizResult(
        user_id=current_user.id,
        skill_id=skill.id,
        score=score,
        passed=passed,
        level=level
    )
    db.session.add(quiz_result)
    db.session.commit()

    # Generate new learning path
    path_data = generate_learning_path(skill.name, level)
    if isinstance(path_data, str):
        try:
            path_data = json.loads(path_data)
        except:
            path_data = {"topics": []}

    learning_path = LearningPath(
        user_id=current_user.id,
        skill_id=skill.id,
        level=level,
        path_data=json.dumps(path_data)
    )
    db.session.add(learning_path)
    db.session.commit()

    for topic in path_data.get("topics", []):
        step = LearningStepProgress(path_id=learning_path.id, step_name=topic.get("name"))
        db.session.add(step)
    db.session.commit()

    return jsonify({
        "message": "Quiz submitted and new learning path generated",
        "skill": skill.name,
        "level": level,
        "learning_path": path_data
    })



@quiz_bp.route("/results-of-quiz", methods=["GET"])
@login_required
def get_user_results():
    try:
        results = QuizResult.query.filter_by(user_id=current_user.id).all()

        # Skip every other record - avoiding duplicate
        skipped_results = results[::2]

        results_data = []
        for r in skipped_results:
            results_data.append({
                "id": r.id,
                "user_id": r.user_id,
                "username": current_user.name,
                "skill_id": r.skill_id,
                "skill_name": r.skill.name if r.skill else None,
                "level": r.level,
                "score": r.score,
                "passed": r.passed,
                "taken_at": r.taken_at.isoformat(),
            })

        return jsonify({
            "user_id": current_user.id,
            "username": current_user.name,
            "total_results": len(results_data),
            "results": results_data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@quiz_bp.route("/complete-step/<int:step_id>", methods=["POST"])
@login_required
def complete_step(step_id):
    step = LearningStepProgress.query.get(step_id)
    if not step:
        return jsonify({"error": "Step not found"}), 404

    step.completed = True
    db.session.commit()

    return jsonify({"message": f"Step '{step.step_name}' marked as completed"})

@quiz_bp.route("/complete-skill/<int:skill_id>", methods=["POST"])
@login_required
def complete_skill(skill_id):
    path = LearningPath.query.filter_by(user_id=current_user.id, skill_id=skill_id).first()
    if not path:
        return jsonify({"error": "No active learning path found"}), 404

    steps = LearningStepProgress.query.filter_by(path_id=path.id).all()
    if not all(step.completed for step in steps):
        return jsonify({"error": "Not all steps are completed yet"}), 400

    # Delete learning path + steps
    for step in steps:
        db.session.delete(step)
    db.session.delete(path)
    db.session.commit()

    return jsonify({
        "message": f" Congratulations {current_user.name}! You have completed the skill.",
        "next": "Would you like to learn a new skill?"
    })


@quiz_bp.route("/get-skill", methods=["GET"])
@login_required
def get_skill():
    path = LearningPath.query.filter_by(user_id=current_user.id).first()
    if not path:
        return jsonify({'message': "No active learning path found"}), 404

    skill = Skill.query.get(path.skill_id)
    print(skill)
    return jsonify({
        "message": "You already have a learning path for this skill",
        "skill": skill.name if skill else None,
        "level": path.level,
        "learning_path": json.loads(path.path_data),
        "steps": [step.to_dict() for step in path.steps]
    }), 200