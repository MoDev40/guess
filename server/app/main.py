from fastapi import FastAPI, UploadFile
from fastapi.staticfiles import StaticFiles
from google import genai
from google.genai import types
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()
# app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")

app.add_middleware(
  CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def index():
  return {'message':"Can i guess your images."}

async def guess(image_bytes: bytes, mime_type: str):
    def _generate():
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type,
                ),
                "Guess and Identify the (place,area,person,object,etc..) shown in this image. Keep it short."
            ]
        )
        return response.text

    return await run_in_threadpool(_generate)


@app.post("/guess")
async def guess_images(files: list[UploadFile]):
    responses = []
    for file in files:
        image_bytes = await file.read()
        result = await guess(image_bytes, str(file.content_type))
        responses.append(result)
    return responses
