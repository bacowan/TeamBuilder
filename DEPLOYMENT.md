# Deployment Guide

## Quick Start

Your React + Tailwind CSS app is ready to deploy to GitHub Pages!

## Option 1: Automatic Deployment (Recommended)

The project includes a GitHub Actions workflow that automatically deploys on every push to `main`.

### Setup Steps:

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Build and deployment", select **Source: GitHub Actions**

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Convert to React with Tailwind CSS"
   git push origin main
   ```

3. **Wait for deployment:**
   - Go to the "Actions" tab in your repository
   - Watch the workflow run
   - Once complete, your site will be live at: `https://<your-username>.github.io/TeamBuilder/`

## Option 2: Manual Deployment

If you prefer to deploy manually using the gh-pages package:

```bash
npm run deploy
```

This will build and push to the `gh-pages` branch.

**Note:** For manual deployment, in repository Settings > Pages, set:
- Source: Deploy from a branch
- Branch: gh-pages / (root)

## Verification

After deployment, visit your site at:
```
https://<your-username>.github.io/TeamBuilder/
```

## Important Configuration Notes

### Base URL
The app is configured with `base: '/TeamBuilder/'` in [vite.config.js](vite.config.js).

If your repository name is different, update line 6 in `vite.config.js`:
```js
base: '/YourRepoName/',
```

### Testing the Production Build Locally

To preview the production build locally:

```bash
npm run build
npm run preview
```

Then open the URL shown in the terminal.

## Troubleshooting

### Blank Page After Deployment
- Verify the `base` path in `vite.config.js` matches your repository name
- Check browser console for errors
- Ensure GitHub Pages is enabled in repository settings

### 404 Errors
- Make sure you're using the correct URL with the repository name
- Verify the GitHub Actions workflow completed successfully

### Build Failures
- Run `npm run build` locally to check for errors
- Ensure all dependencies are installed: `npm install`
- Check Node version (v18+ recommended)

## Local Development

Remember, for local development, always use:
```bash
npm run dev
```

This runs the development server with hot reload at `http://localhost:5173/TeamBuilder/`
