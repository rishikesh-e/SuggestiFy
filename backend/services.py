from urllib import request
import re

from flask import Blueprint, request, jsonify
from flask_login import login_required
from generator import *
services_bp = Blueprint('services', __name__, url_prefix='/api')

@login_required
@services_bp.route('/generate-quiz/<skill>', methods=['GET'])
def generate_quiz_route(skill):
    raw_content = generate_quiz(skill)
    cleaned = re.sub(r"^```json\s*|\s*```$", "", raw_content.strip())
    try:
        import json
        content = json.loads(cleaned)
    except Exception:
        content = {"quiz": cleaned}

    return jsonify(content)
