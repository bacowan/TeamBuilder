# Team Builder

A React-based team builder application with Tailwind CSS styling.

## Features

- Add and manage students
- Tag students with attributes
- Define relations between students
- Generate balanced teams
- Data persists in localStorage

## Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:5173/TeamBuilder/`)

### Build for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deploying to GitHub Pages

This project is configured for easy deployment to GitHub Pages.

### Initial Setup

1. Make sure your repository name matches the `base` setting in [vite.config.js](vite.config.js#L7). Currently set to `/TeamBuilder/`.

2. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Under "Build and deployment", select "GitHub Actions" as the source

### Deploy Using GitHub Actions (Recommended)

Create a file `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

After committing this file, every push to the `main` branch will automatically build and deploy your site.

### Manual Deploy Using gh-pages

Alternatively, you can deploy manually:

```bash
npm run deploy
```

This will:
1. Build the project
2. Deploy the `dist` folder to the `gh-pages` branch
3. Your site will be available at `https://<username>.github.io/TeamBuilder/`

## Technology Stack

- React 18
- Vite 6
- Tailwind CSS 3
- LocalStorage for data persistence

## Project Structure

```
TeamBuilder/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind directives
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies and scripts
```
