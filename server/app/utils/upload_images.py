import os
from datetime import datetime
from fastapi import UploadFile
from fastapi.exceptions import HTTPException

UPLOAD_DIR = os.path.join("app", "uploads")


async def upload(files: list[UploadFile]) -> list:
    accepted_extensions = {"jpg", "png", "gif"}

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    uploaded_files = []

    for file in files:
        if "." not in str(file.filename):
            raise HTTPException(400, "File must have an extension")
        ext = str(file.filename).rsplit(".", 1)[-1].lower()

        if ext not in accepted_extensions:
            raise HTTPException(400, "Unsupported file type uploaded")

        safe_name = os.path.basename(str(file.filename))
        timestamp = datetime.now().strftime("%Y_%m_%d_%H%M%S")

        unique_name = f"{timestamp}_{safe_name}"

        file_path = os.path.join(UPLOAD_DIR, unique_name)

        try:
            content = await file.read()
            with open(file_path, "wb") as f:
                f.write(content)
        except Exception:
            raise HTTPException(500, "Could not save file")

        uploaded_files.append(f"uploads/{unique_name}")

    return uploaded_files
