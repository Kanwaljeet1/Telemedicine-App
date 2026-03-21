# Telemedicine App

A complete telemedicine platform with Auth, Appointments, and Video Calling.

## Project Structure
- `/frontend`: React + Vite + Vanilla CSS
- `/backend`: Node.js + Express + PostgreSQL

## Deployment Instructions

### Option 1: Render.com (Recommended)
This project includes a `render.yaml` blueprint. 
1. Push this code to a GitHub repository.
2. Go to [Render Blueprints](https://dashboard.render.com/blueprints).
3. Connect your repository.
4. Render will automatically set up:
   - PostgreSQL Database
   - Node.js Backend
   - Static Site Frontend
5. Add your Twilio credentials (`TWILIO_SID`, `TWILIO_API_KEY`, `TWILIO_API_SECRET`) in the Render Dashboard under the backend service environment variables.

### Option 2: Manual Deployment

#### Backend
- Host on Render, Railway, or Heroku.
- Set `DATABASE_URL` and `JWT_SECRET`.
- Set `TWILIO_*` variables.

#### Frontend
- Host on Vercel or Netlify.
- Set `VITE_API_URL` to your backend URL (e.g., `https://your-api.com/api`).

#### Database
- Use [schema.sql](./backend/schema.sql) to initialize your tables on any PostgreSQL instance.
