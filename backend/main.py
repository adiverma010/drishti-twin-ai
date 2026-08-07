from fastapi import FastAPI

app = FastAPI(title="Drishti TwinAI API")

@app.get("/")
def home():
    return {
        "project": "Drishti TwinAI",
        "status": "Backend Running",
        "version": "1.0.0"
    }