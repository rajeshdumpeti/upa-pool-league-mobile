UPA Pool League – Deployment Guide (P0)

Goal: run the backend on an internet URL and open the mobile app on any phone (no USB) pointing to that URL.

0. Prereqs

Accounts: GitHub, Expo (expo.dev). Apple Dev + Google Play accounts are optional (only needed for installable builds/TestFlight/Play Internal).

Local tools: Node 18+, npm, npx, Python 3.11, uvicorn, pip, git.

Repos:

Backend: upa-pool-league-backend (FastAPI)

Mobile: upa-pool-league-mobile (Expo)

1. Backend: choose one of these
   Option A — Quick share via ngrok (fastest)

Use if you want to keep running the API on your laptop but make it reachable by phones.

Start API locally:

cd upa-pool-league-backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

In a second terminal, expose with ngrok:

ngrok http 8000

Copy the HTTPS URL it prints (looks like https://xxxx.ngrok-free.app).
This will be your API base: https://xxxx.ngrok-free.app/api/v1.

Your CORS regex already allows \*.ngrok-free.app, so you’re good.

Option B — Deploy to Render (free tier, persistent URL)

Use if you want a URL that stays up without your laptop.

Push latest to GitHub (main or a release branch).

In Render: New → Web Service → connect repo.

Set:

Build: pip install -r requirements.txt

Start: uvicorn app.main:app --host 0.0.0.0 --port 8000

Environment variables:

UPA_APP_ENV=test
UPA_JWT_SECRET=<long random string>
UPA_JWT_ISSUER=upa-api
UPA_JWT_AUDIENCE=upa-mobile

(DB URL not needed in P0.)

Health check path: /api/v1/health

After deploy completes, note your base URL, e.g.
https://upa-api-xxxxx.onrender.com/api/v1

Sanity check (Postman or curl):

curl https://<your-base>/health
curl -X POST https://<your-base>/matches -H 'content-type: application/json' \
 -d '{"format":"8-ball","home_team":{"id":1},"away_team":{"id":2}}'

2. Mobile: point the app at your backend

You already read ENV.apiBase from process.env.EXPO_PUBLIC_API_BASE in src/config/env.ts.

Pick one of these flows:

Flow A — Expo Go + Tunnel (no dev accounts needed)

On the phone(s): install Expo Go from the App Store/Play Store.

In the mobile repo:

cd upa-pool-league-mobile
EXPO_PUBLIC_API_BASE="https://<your-api-host>/api/v1" npx expo start --tunnel

(Tunnel is important if devices are on different networks.)

Scan the QR code with the other phone’s camera → open in Expo Go.

Any JS change hot-reloads. This is the fastest way to share a build.

Flow B — Installable builds with EAS (TestFlight/APK)

Requires Apple Developer and (optionally) Google Play accounts.

One-time setup:

npm i -g eas-cli
cd upa-pool-league-mobile
eas login
eas init

Configure builds (managed credentials):

eas build:configure

Build iOS preview (TestFlight-like, for your devices):

EXPO_PUBLIC_API_BASE="https://<your-api-host>/api/v1" \
eas build -p ios --profile preview

First time on iOS it will ask to register devices (eas device:create) or use internal distribution via TestFlight.

Build Android preview (universal APK/AAB):

EXPO_PUBLIC_API_BASE="https://<your-api-host>/api/v1" \
eas build -p android --profile preview

Share the build links from expo.dev/builds to your test phone(s).
Install, open, and sign in.

Later you can ship JS-only fixes with eas update (no rebuild) once you add update channels.

3. Environment matrix (dev / test / prod)

You already have channel-aware ENV logic. Suggested mapping:

dev: local or ngrok (used by expo start)

test: Render “staging” URL

prod: Render (or another host) “production” URL

Set per-run env:

# dev (ngrok)

EXPO_PUBLIC_API_BASE="https://xxxx.ngrok-free.app/api/v1" npx expo start --tunnel

# test

EXPO_PUBLIC_API_BASE="https://upa-api-stg.onrender.com/api/v1" npx expo start --tunnel

# prod (only for release builds)

EXPO_PUBLIC_API_BASE="https://api.upa-pool-league.com/api/v1" eas build -p ios --profile production

4. Smoke test checklist (end-to-end)

On the phone:

Open the app → Login screen shows.
Use dev@example.com / password123 (P0 stub).

After sign-in, tabs render.

Start a match (Pre-Match) → go to Live Score:

Start rack → record a few shots → end rack.

Watch device logs (Expo dev menu) for:

createMatchGame OK <id>

flushing score_events batch → batch OK

patch OK

Go to Post-Match → Submit:

Expect 200 OK from /matches/{id}/submit.

Kill the app, reopen → AuthGate rehydrates and keeps you signed in.

5. Common pitfalls & fixes

Can’t reach backend from phone (local dev): use --tunnel or ngrok. Direct http://localhost only works on simulators.

Wrong API base: confirm the app’s logs show ENV.apiBase you expect. If not, you didn’t pass EXPO_PUBLIC_API_BASE into the build/run command.

iOS install blocked: for EAS preview/dev builds you must register the device (or use TestFlight).

CORS: not an issue for native; only matters for web previews. Your regex already allows Render/ngrok.

JWT failures: ensure both mobile and backend use matching UPA_JWT_SECRET, UPA_JWT_ISSUER, UPA_JWT_AUDIENCE expectations.

6. Version control (recommended)

Create a feature branch for this deployment round:

# Backend

git checkout -b deploy/backend-p0
git commit -am "deploy: Render/ngrok-ready config; docs for P0"
git push -u origin deploy/backend-p0

# Mobile

git checkout -b deploy/mobile-p0
git commit -am "deploy: ENV.EXPO_PUBLIC_API_BASE wiring; EAS preview profiles"
git push -u origin deploy/mobile-p0

Tag when you have a stable pair:

git tag -a p0.1 -m "P0 mobile+backend stable for field testing"
git push --tags

7. Where to keep this guide

Create docs/deploy.md in both repos and paste this guide (keep the two URLs handy).
Anytime you switch environments, just update the EXPO_PUBLIC_API_BASE and re-run.
