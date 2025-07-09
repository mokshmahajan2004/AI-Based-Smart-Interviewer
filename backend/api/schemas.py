from pydantic import BaseModel

class QAInput(BaseModel):
    idx: int
    question: str
    answer: str
    feedback: str

class CandidateProfile(BaseModel):
    name: str
    email: str
    role: str
    skills: str
    experience: str
    achievements: str
    notes: str

# This is only for the report endpoint
class ReportRequest(CandidateProfile):
    qa_feedback: list[QAInput]

class EvaluateRequest(BaseModel):
    question: str
    answer: str
