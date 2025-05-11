from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.notes import router

app = FastAPI()

# Enable CORS for Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routes
app.include_router(router)

# Add this route to handle root requests
@app.get("/")
def root():
    return {"message": "✅ Notes service is running"}
