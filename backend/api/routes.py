from fastapi import APIRouter, UploadFile, File, Body, Form
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import tempfile
import os
from datetime import datetime

# Services
from services.interviewer import generate_questions, generate_questions_from_resume_text
from services.evaluator import evaluate_answer
from services.ats import evaluate_resume
from services.report_generator import generate_report
from utils.audio import transcribe_audio
from utils.tts import generate_tts
from utils.cloudinary import cloudinary
from firebase import save_report_metadata 
from utils.resume_reader import read_resume_file  

# Schemas
from api.schemas import CandidateProfile, QAInput, ReportRequest,EvaluateRequest

# Firebase
from firebase_admin import firestore

router = APIRouter()

# ----------------------------------------
# 1. Generate Interview Questions
# ----------------------------------------
@router.post("/generate-questions/")
def get_questions(profile: CandidateProfile):
    questions = generate_questions(**profile.dict())
    return {"questions": questions.split("\n")}

# ----------------------------------------
# 2. Evaluate Interview Answer
# ----------------------------------------
@router.post("/evaluate/")
def get_evaluation(data: EvaluateRequest):
    feedback = evaluate_answer(data.question, data.answer)
    return {"feedback": feedback}

# ----------------------------------------
# 3. Transcribe Audio
# ----------------------------------------
@router.post("/transcribe-audio")
async def transcribe_audio_route(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    print("✅ Received audio file:", tmp_path)
    print("✅ Size (bytes):", os.path.getsize(tmp_path))
    text = transcribe_audio(tmp_path)
    return {"transcription": text}

# ----------------------------------------
# 4. Text-to-Speech
# ----------------------------------------
class TTSInput(BaseModel):
    text: str

@router.post("/text-to-speech")
def text_to_speech_endpoint(input: TTSInput):
    audio_path = generate_tts(input.text)
    return FileResponse(audio_path, media_type="audio/mpeg", filename="output.mp3")

# ----------------------------------------
# 5. Generate Interview Report & Upload
# ----------------------------------------
@router.post("/generate-report")
def generate_report_endpoint(data: ReportRequest):
    report = generate_report(
        data.name,
        data.email,
        data.role,
        data.skills,
        data.experience,
        data.achievements,
        data.notes,
        [q.dict() for q in data.qa_feedback]
    )

    save_report_metadata(report)

    return {
        "message": "Report generated and stored",
        "cloudinary_url": report["url"],
        "file_name": report["file_name"],
        "timestamp": report["timestamp"]
    }
import re  # ⬅️ at the top if not already imported

def clean_output(text):
    return re.sub(r"\*\*\d+", "", text)

@router.post("/ats-evaluate/")
async def ats_evaluate_endpoint(
    job_description: str = Form(...),
    resume_file: UploadFile = File(...)
):
    content = await resume_file.read()
    resume_text = read_resume_file(resume_file.filename, content)

    evaluation_result = evaluate_resume(job_description, resume_text)

    # ✅ Clean unwanted **2, **3 etc.
    evaluation_result = clean_output(evaluation_result)

    return {
        "evaluation": evaluation_result
    }

# ----------------------------------------
# 7. Upload Profile Image to Cloudinary
# ----------------------------------------
@router.post("/upload-profile")
async def upload_profile_image(file: UploadFile = File(...)):
    try:
        result = cloudinary.uploader.upload(file.file, folder="profile_images")
        return {"url": result["secure_url"]}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ----------------------------------------
# 8. Fetch Past Interview Reports by Email
# ----------------------------------------
@router.get("/past-interviews/{email}")
def get_past_reports(email: str):
    db = firestore.client()
    docs = db.collection_group("interview_reports")\
             .where("email", "==", email)\
             .order_by("timestamp", direction=firestore.Query.DESCENDING)\
             .stream()

    seen = set()
    results = []

    for doc in docs:
        data = doc.to_dict()
        file_name = data.get("file_name")

        if file_name and file_name not in seen:
            seen.add(file_name)
            ts = data.get("timestamp")
            ts_str = ts.isoformat() if ts and hasattr(ts, "isoformat") else None
            results.append({
                "file_name": file_name,
                "url": data.get("url"),
                "role": data.get("role"),
                "timestamp": ts_str
            })

    return results

@router.post("/generate-questions-from-resume")
async def generate_questions_from_resume(
    email: str = Form(...),
    role: str = Form(...),
    resume: UploadFile = File(...)
):
    try:
        content = await resume.read()
        resume_text = read_resume_file(resume.filename, content)
        resume_text = resume_text[:5000]  # optional truncate if resume is very long

        questions = generate_questions_from_resume_text(
            resume_text=resume_text,
            role=role,
            email=email
        )

        return {"questions": questions.strip().split("\n")}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

