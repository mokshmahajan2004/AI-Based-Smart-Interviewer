from models.openrouter_client import client

def generate_questions(name, email, role, skills, experience, achievements, notes):
    prompt = f"""You are an expert interviewer. Generate 10-12 questions for:
    Name: {name}
    Email: {email}
    Role: {role}
    Skills: {skills}
    Experience: {experience}
    Achievements: {achievements}
    Notes: {notes}"""
    
    response = client.chat.completions.create(
        model="mistralai/mixtral-8x7b-instruct",
        messages=[
            {"role": "system", "content": "Generate only the questions in numbered list."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )
    return response.choices[0].message.content


def generate_questions_from_resume_text(resume_text: str, role: str, email: str = ""):
    prompt = f"""You are an expert interviewer.
Generate 12 technical and behavioral interview questions based on the candidate's resume and the job role.

Role: {role}
Email: {email}

Candidate Resume:
\"\"\"
{resume_text}
\"\"\"

Respond only with a clean numbered list of questions (no explanation).
"""

    response = client.chat.completions.create(
        model="mistralai/mixtral-8x7b-instruct",
        messages=[
            {"role": "system", "content": "You are an expert mock interview question generator."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    return response.choices[0].message.content
