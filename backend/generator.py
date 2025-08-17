import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
import json

# Load environment variables from .env file
load_dotenv()

def generate_learning_path(skill, skill_level):
    """
    Generates a structured JSON learning path for the given skill and skill level.
    skill_level should be one of: "Beginner", "Intermediate", "Advanced"
    """

    # Validate skill level
    if skill_level not in ["Beginner", "Intermediate", "Advanced"]:
        raise ValueError("skill_level must be 'Beginner', 'Intermediate', or 'Advanced'")

    # Initialize Gemini client
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    model = "gemini-2.0-flash-lite"

    # Prompt for a specific skill level
    prompt_text = f"""
    Generate a structured JSON object representing a complete learning path for {skill}.
    Only include topics for the '{skill_level}' level.
    The JSON must follow this format:
    {{
      "skill": "{skill}",
      "level": "{skill_level}",
      "topics": [
        {{ "name": "Topic Name", "description": "Brief description", "resources": ["Resource 1 URL", "Resource 2 URL"] }}
      ]
    }}
    Include at least 5 topics.
    Ensure resources are free, reputable, and up to date.
    Keep descriptions concise and clear.
    Output only valid JSON without extra commentary.
    """

    # Build request content
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt_text.strip())],
        )
    ]

    config = types.GenerateContentConfig()

    # Accumulate streamed chunks
    output = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=config,
    ):
        output += chunk.text

    output = output.strip()
    if output.startswith("```") and output.endswith("```"):
        output = "\n".join(output.splitlines()[1:-1])

    # Parse and return JSON
    try:
        data = json.loads(output)
        return data
    except json.JSONDecodeError:
        print("Error: Invalid JSON received from API")
        return output

#result = generate_learning_path("Cybersecurity", "Beginner")


def generate_quiz(skill):
    """Generates a basic-level Cybersecurity quiz with 10 questions in JSON format."""

    # Initialize Gemini client
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    # Model to use
    model = "gemini-2.0-flash-lite"

    # User prompt content
    prompt_text = f"""
        Generate a structured JSON array containing 10 basic-level multiple-choice questions about {skill}.
        Each JSON object must follow this exact format:
        {{
          "question": "Question text here",
          "option1": "Option text here",
          "option2": "Option text here",
          "option3": "Option text here",
          "option4": "Option text here",
          "answer": "The correct option number (e.g., option2)"
        }}
        Requirements:
        - Exactly 10 objects in the array.
        - Ensure questions are beginner-friendly.
        - Options must be concise and plausible.
        - "answer" should exactly match one of the option keys (e.g., "option1", "option2", etc.).
        - Output only valid JSON without any additional commentary.
        """

    # Build request content
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt_text.strip())],
        )
    ]

    # Generate content configuration
    config = types.GenerateContentConfig()

    # Stream and print generated content
    full_text =""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=config,
    ):
        full_text += chunk.text

    return full_text




