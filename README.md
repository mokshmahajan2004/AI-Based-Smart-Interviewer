# 🚀 Hireonix – AI-Based Smart Interviewer

Hireonix is an AI-powered platform that helps job seekers identify skill gaps, prepare for interviews, and enhance their resumes with personalized feedback and practice sessions. It combines smart mock interviews, resume screening, and voice-based evaluations into a single powerful tool.

<img src="/frontend/src/assets/hireonix-banner.jpg" alt="Hireonix Banner" width="350" height="350">

---

## 🌟 Features

- 🎤 **Mock Interviews with AI Evaluation**
- 📄 **Resume Screening with ATS Compatibility Scoring**
- 🎯 **Skill, Role & Resume-Based Question Generation**
- 🧠 **Smart Feedback on Fluency, Clarity, and Confidence**
- 📊 **Post-Interview Performance Reports with Strengths & Weaknesses**
- 📝 **Resume Bullet Suggestions & AI-Powered Rewrites**
- 🧾 **Pre-Interview Form with Role, Skills, and Achievements**
- 📑 **Personalized Question Sets Using Mixtral-8x7B LLM**
- ☁️ **Audio Transcription using Whisper & TTS using pyttsx3 (offline)**

---

## 🔧 Tech Stack

| Frontend               | Backend          | AI/ML Services            | Database            | Storage                |
|------------------------|------------------|---------------------------|---------------------|------------------------|
| React.js (Tailwind CSS)| FastAPI (Python) | Mixtral-8x7B, OpenAI Whisper, pyttsx3 (TTS) | Firebase Firestore  | Firebase / Cloudinary  |

---

## 🧪 How It Works

1. **User logs in** and fills a pre-interview form with name, role, skills, experience, and achievements.
2. **Mixtral-8x7B LLM** generates personalized interview questions based on:
   - Role
   - Skills
   - Resume content (if uploaded)
3. **User answers via voice**, which is transcribed using **Whisper**.
4. **AI evaluates** answers on:
   - Fluency
   - Clarity
   - Confidence
   - Relevance
5. **Detailed report** is generated with:
   - Score summary (per question and overall)
   - Unanswered/skipped questions
   - Strengths and weaknesses
6. **Resume screening** matches resume against job description and rewrites weak bullet points.

---

## 🚀 Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hireonix.git
cd hireonix


```
### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev


```

### 3. Backend Setup

```bash
cd ../backend
pip install -r requirements.txt
uvicorn main:app --reload

```
> ✅ Make sure to add a `.env` file in the `backend/` directory with the following:


---

### 4. Connect Frontend to Backend

If your frontend uses an API config file (like `config.js` or `api.js`), make sure to update the base URL:

```js
export const API_BASE_URL = "http://127.0.0.1:8000";
