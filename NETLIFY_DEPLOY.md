# Deploying to Netlify

Follow these simple steps to deploy your Arch-Connect application to Netlify:

## 1. Import from GitHub (Recommended)
1. Log in to [Netlify](https://app.netlify.com/) using your GitHub account.
2. Click **Add new site** -> **Import an existing project**.
3. Choose **GitHub** and authorize access.
4. Select your **`arch-connect`** repository.

## 2. Configuration Settings
Make sure your build settings are configured exactly like this:
* **Build Command**: `npm run build`
* **Publish Directory**: `dist`

## 3. Environment Variables (Required for Supabase)
Scroll down to the **Environment variables** section and add these two variables:
1. **Key**: `VITE_SUPABASE_URL`
   **Value**: `https://uvdaqjfmvxzgrnqwhfdy.supabase.co`
2. **Key**: `VITE_SUPABASE_ANON_KEY`
   **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2ZGFxamZtdnh6Z3JucXdoZmR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTg5OTksImV4cCI6MjEwMDQ5NDk5OX0.p5628EQLlcVaMg_sU6f2jUlkmjw0tIQ4UnITDz-yuzk`

## 4. Click Deploy
Click **Deploy site** and wait 1 minute. Your site is now live!
Every time you run `git push`, Netlify will automatically rebuild and deploy the updates.
