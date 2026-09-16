from fastapi import Depends, FastAPI, APIRouter, UploadFile, File, HTTPException, Security
from fastapi.responses import Response
from fastapi.security import APIKeyHeader
from starlette.concurrency import run_in_threadpool
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import secrets
import requests
import resend
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Object storage (Emergent integration proxy)
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "squirrel-agency"
storage_key = None

def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key

def put_object(path: str, data: bytes, content_type: str) -> dict:
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": init_storage(), "Content-Type": content_type},
        data=data, timeout=120,
    )
    resp.raise_for_status()
    return resp.json()

def get_object(path: str):
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": init_storage()}, timeout=60)
    if resp.status_code == 404:
        init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": storage_key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

# Admin key protection for studio mutations
ADMIN_KEY = os.environ.get("ADMIN_KEY", "")
admin_header = APIKeyHeader(name="X-Admin-Key", auto_error=False)

async def require_admin_key(supplied: str = Security(admin_header)):
    if not ADMIN_KEY or not supplied or not secrets.compare_digest(supplied, ADMIN_KEY):
        raise HTTPException(status_code=401, detail="Invalid admin key")
    return supplied

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class EnquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=180)
    phone: str = Field(min_length=7, max_length=30)
    company: Optional[str] = Field(default="", max_length=120)
    service: str = Field(min_length=2, max_length=120)
    budget: Optional[str] = Field(default="", max_length=80)
    message: str = Field(min_length=10, max_length=3000)

class EnquiryResponse(EnquiryCreate):
    id: str
    created_at: datetime

class ProjectCreate(BaseModel):
    title: str = Field(min_length=2, max_length=160)
    category: str = Field(min_length=2, max_length=80)
    year: str = Field(min_length=4, max_length=4)
    summary: str = Field(min_length=10, max_length=500)
    cover_image: str = Field(min_length=10, max_length=500)
    services: str = Field(min_length=2, max_length=300)
    challenge: str = Field(min_length=10, max_length=1200)
    strategy: str = Field(min_length=10, max_length=1200)
    outcome: str = Field(min_length=10, max_length=1200)
    status_label: str = Field(default="CONCEPT PROJECT", max_length=40)

class ProjectResponse(ProjectCreate):
    id: str
    created_at: datetime

# Routes
@api_router.get("/")
async def root():
    return {"message": "The Squirrel Agency API"}

@api_router.get("/admin/verify")
async def verify_admin(_: str = Depends(require_admin_key)):
    return {"ok": True}

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "info.thesquirrelagency@gmail.com")
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

@api_router.post("/enquiries", response_model=EnquiryResponse)
async def create_enquiry(input: EnquiryCreate):
    enquiry = EnquiryResponse(
        id=str(uuid.uuid4()),
        created_at=datetime.now(timezone.utc),
        **input.model_dump(),
    )
    doc = enquiry.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.enquiries.insert_one(doc)
    if RESEND_API_KEY:
        resend.api_key = RESEND_API_KEY
        row = lambda label, value: f'<tr><td style="padding:10px 16px;font:600 11px Arial;letter-spacing:1px;color:#8a8a85;text-transform:uppercase;border-bottom:1px solid #eee;vertical-align:top">{label}</td><td style="padding:10px 16px;font:15px Arial;color:#111;border-bottom:1px solid #eee">{value}</td></tr>'
        html = f'<table style="width:100%;max-width:560px;border-collapse:collapse;font-family:Arial"><tr><td colspan="2" style="padding:22px 16px;background:#0a0a0c;color:#fff;font:700 18px Arial">THE SQUIRREL AGENCY<span style="display:block;font:400 11px Arial;color:#2e4bff;letter-spacing:2px;margin-top:6px">NEW WEBSITE ENQUIRY</span></td></tr>{row("Name", enquiry.name)}{row("Email", enquiry.email)}{row("Phone", enquiry.phone)}{row("Company", enquiry.company or "—")}{row("Service", enquiry.service)}{row("Budget", enquiry.budget or "—")}{row("Message", enquiry.message)}</table>'
        try:
            await asyncio.to_thread(resend.Emails.send, {"from": SENDER_EMAIL, "to": [OWNER_EMAIL], "subject": f"New enquiry — {enquiry.name} ({enquiry.service})", "html": html})
            logger.info(f"Enquiry email sent for {enquiry.id}")
        except Exception as e:
            logger.error(f"Enquiry email failed: {e}")
        reply_html = f'<div style="font-family:Arial;max-width:540px"><div style="padding:22px 18px;background:#0a0a0c"><span style="color:#fff;font:700 18px Arial">THE SQUIRREL AGENCY</span><span style="display:block;color:#2e4bff;font:400 11px Arial;letter-spacing:2px;margin-top:6px">TECHNOLOGY · CREATIVITY · PERFORMANCE</span></div><div style="padding:26px 18px;border:1px solid #eee;border-top:0"><p style="font:16px Arial;color:#111;margin:0 0 14px">Hi {input.name},</p><p style="font:14px Arial;color:#555;line-height:1.7;margin:0 0 14px">Thank you for reaching out about <b>{input.service}</b>. Your enquiry has landed on our desk — Akash or someone from the team will get back to you within 24 hours.</p><p style="font:14px Arial;color:#555;line-height:1.7;margin:0 0 14px">If you would rather talk right now, call or WhatsApp us at <b>+91 92774 77048</b>.</p><p style="font:14px Arial;color:#555;margin:0">Warm regards,<br><b>The Squirrel Agency</b><br>M Block, Kidwai Nagar, Kanpur Nagar</p></div></div>'
        try:
            await asyncio.to_thread(resend.Emails.send, {"from": SENDER_EMAIL, "to": [input.email], "subject": "We received your enquiry — The Squirrel Agency", "html": reply_html})
            logger.info(f"Auto-reply sent for {enquiry.id}")
        except Exception as e:
            logger.error(f"Auto-reply failed (domain verification may be required): {e}")
    else:
        logger.info("RESEND_API_KEY not set — enquiry saved without email notification")
    return enquiry

@api_router.get("/enquiries", response_model=List[EnquiryResponse])
async def get_enquiries():
    docs = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for doc in docs:
        if isinstance(doc.get("created_at"), str):
            doc["created_at"] = datetime.fromisoformat(doc["created_at"])
    return docs

@api_router.get("/projects", response_model=List[ProjectResponse])
async def get_projects():
    docs = await db.projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for doc in docs:
        if isinstance(doc.get("created_at"), str):
            doc["created_at"] = datetime.fromisoformat(doc["created_at"])
    return docs

@api_router.post("/projects", response_model=ProjectResponse)
async def create_project(input: ProjectCreate, _: str = Depends(require_admin_key)):
    project = ProjectResponse(
        id=str(uuid.uuid4()),
        created_at=datetime.now(timezone.utc),
        **input.model_dump(),
    )
    doc = project.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.projects.insert_one(doc)
    return project

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, _: str = Depends(require_admin_key)):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"deleted": True}

class FeedbackCreate(BaseModel):
    article: str = Field(min_length=2, max_length=160)
    vote: str = Field(pattern="^(yes|no)$")

class SubscriberCreate(BaseModel):
    email: str = Field(min_length=5, max_length=180)

@api_router.post("/feedback")
async def create_feedback(input: FeedbackCreate):
    await db.feedback.insert_one({"id": str(uuid.uuid4()), "article": input.article, "vote": input.vote, "created_at": datetime.now(timezone.utc).isoformat()})
    return {"ok": True}

@api_router.post("/newsletter")
async def subscribe(input: SubscriberCreate):
    email = input.email.strip().lower()
    existing = await db.newsletter.find_one({"email": email}, {"_id": 0})
    if existing:
        return {"ok": True, "already": True}
    await db.newsletter.insert_one({"id": str(uuid.uuid4()), "email": email, "created_at": datetime.now(timezone.utc).isoformat()})
    if RESEND_API_KEY:
        try:
            await asyncio.to_thread(resend.Emails.send, {"from": SENDER_EMAIL, "to": [OWNER_EMAIL], "subject": f"New insights subscriber — {email}", "html": f'<p style="font:15px Arial">New subscriber to the insights list: <b>{email}</b></p>'})
        except Exception as e:
            logger.error(f"Subscriber notify failed: {e}")
    return {"ok": True}

@api_router.get("/newsletter")
async def list_subscribers(_: str = Depends(require_admin_key)):
    return await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)

ALLOWED_COVER_TYPES = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif"}
MAX_COVER_BYTES = 8 * 1024 * 1024

@api_router.post("/uploads")
async def upload_cover(file: UploadFile = File(...), _: str = Depends(require_admin_key)):
    ext = ALLOWED_COVER_TYPES.get(file.content_type or "")
    if not ext:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP or GIF images are allowed.")
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file.")
    if len(data) > MAX_COVER_BYTES:
        raise HTTPException(status_code=413, detail="Image must be under 8 MB.")
    path = f"{APP_NAME}/uploads/covers/{uuid.uuid4()}.{ext}"
    result = await run_in_threadpool(put_object, path, data, file.content_type)
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"path": result["path"], "url": f"/api/files/{result['path']}"}

@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = await run_in_threadpool(get_object, path)
    return Response(content=data, media_type=record.get("content_type") or content_type)

# Include the router in the main app
app.include_router(api_router)

@app.on_event("startup")
async def startup_storage():
    try:
        await run_in_threadpool(init_storage)
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
