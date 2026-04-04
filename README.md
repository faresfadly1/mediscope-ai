<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7cb463d0-136e-4a65-a473-00df6d064c86

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create `.env.local` and set `GEMINI_API_KEY=your_key_here`
3. Start the API server:
   `npm run dev:api`
4. In a second terminal, start the frontend:
   `npm run dev`

The frontend proxies `/api` to `http://localhost:3001`, so real Gemini analysis works locally without exposing your API key in the browser bundle.

## Deploy to GitHub Pages

1. Install dependencies (if not already):
   `npm install`
2. Deploy:
   `npm run deploy`

Note: GitHub Pages is static hosting only. The public Pages site runs in demo mode unless you connect the frontend to a separate backend API using `VITE_API_BASE_URL`.
