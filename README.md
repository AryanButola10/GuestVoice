# GuestVoice 🏡

AI-powered guest review analysis platform for homestay businesses. Classifies sentiment, detects themes, and generates suggested management responses.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Python + FastAPI |
| Styling | Tailwind CSS v3 |
| State | React Context API |

---

## How to Run Frontend Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## How to Run Backend Locally

### 1. Navigate to the backend folder
```bash
cd backend
```

### 2. Create a Python virtual environment
```bash
python3 -m venv venv
```

### 3. Activate the virtual environment
```bash
# macOS / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 4. Install dependencies
```bash
pip install -r requirements.txt
```

### 5. Set up environment variables
```bash
cp .env.example .env
```

### 6. Start the backend server
```bash
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**

Interactive API docs: **http://localhost:8000/docs**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews` | List all reviews |
| GET | `/api/reviews/{id}` | Get single review |
| POST | `/api/reviews` | Submit new review |
| PUT | `/api/reviews/{id}` | Update a review |
| DELETE | `/api/reviews/{id}` | Delete a review |
| GET | `/api/reviews/search?q=keyword` | Search reviews |
| GET | `/api/stats` | Get review statistics |

---

## Project Structure

```
GuestVoice/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variable template
│   ├── data/
│   │   └── store.py         # In-memory data store
│   ├── models/
│   │   └── review.py        # Pydantic schemas
│   └── routes/
│       └── reviews.py       # API route handlers
├── src/
│   ├── components/
│   │   └── ui/              # Reusable component library
│   ├── context/             # React Context (ThemeContext)
│   └── pages/               # App pages
└── README.md
```

---

## Intern Details

- **Name:** Aryan Butola
- **Intern ID:** TBI-26101147
- **Program:** The Bridge Internship — GEU
