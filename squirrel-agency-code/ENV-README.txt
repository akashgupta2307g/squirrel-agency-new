THE SQUIRREL AGENCY — required environment variables
(Values are secret and intentionally NOT included in this zip.)

backend/.env
  MONGO_URL=          MongoDB connection string
  DB_NAME=            database name
  CORS_ORIGINS=       allowed origins (e.g. *)
  EMERGENT_LLM_KEY=   powers object storage for image uploads
  ADMIN_KEY=          Studio Editor admin password
  RESEND_API_KEY=     Resend key for enquiry + newsletter emails
  SENDER_EMAIL=       verified sender address
  OWNER_EMAIL=        inbox that receives enquiry notifications

frontend/.env
  REACT_APP_BACKEND_URL=  public URL of the backend

Run: backend -> pip install -r requirements.txt && uvicorn server:app --port 8001
     frontend -> yarn install && yarn start
