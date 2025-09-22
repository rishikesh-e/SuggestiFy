import os

from flask import Blueprint, Response, request
from google import genai
from google.genai import types

service_bp = Blueprint("service", __name__, url_prefix="/service")

# Initialize Gemini client
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not set in environment")
client = genai.Client(api_key=API_KEY)
MODEL = "gemini-2.0-flash"


@service_bp.route("/chat-gemini-stream", methods=["GET"])
def chat_gemini_stream():
    """
    Streams Gemini response via SSE.
    Accepts user message as query parameter: ?message=Hello
    """
    user_message = request.args.get("message", "").strip()
    if not user_message:
        return {"error": "Message cannot be empty"}, 400

    def generate():
        # Build Gemini request using same template logic
        prompt_text = user_message  # Simply pass user input
        contents = [
            types.Content(role="user", parts=[types.Part.from_text(text=prompt_text)])
        ]
        config = types.GenerateContentConfig()

        try:
            for chunk in client.models.generate_content_stream(
                model=MODEL, contents=contents, config=config
            ):
                # Send each chunk as SSE
                text = chunk.text
                if text.strip():
                    yield f"data: {text}\n\n"
        except Exception as e:
            yield f"data: [Error]: {str(e)}\n\n"

    return Response(generate(), mimetype="text/event-stream")

