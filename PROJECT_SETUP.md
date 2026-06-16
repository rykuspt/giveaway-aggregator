# 📋 GiveawayHub - Complete Project Setup

This guide walks you through setting up the complete GiveawayHub project from scratch.

## File Structure

Here's what you need to create:

```
giveaway-aggregator/
│
├── Backend Files:
│   ├── server.js                    # Express backend server
│   ├── package.json                 # Backend dependencies
│   └── .env                         # Backend configuration (create this)
│
├── Frontend Files:
│   ├── public/
│   │   └── index.html              # HTML entry point
│   ├── src/
│   │   ├── App.jsx                 # Main React component
│   │   ├── App.css                 # App styling
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   └── package.json                # Frontend dependencies
│
├── Configuration:
│   ├── .env.example                # Environment variables template
│   ├── .gitignore                  # Git ignore rules
│   └── .github/workflows/
│       └── deploy.yml              # Auto-deployment configuration
│
└── Documentation:
    ├── README.md                   # Main documentation
    ├── QUICKSTART.md               # Quick start guide
    └── PROJECT_SETUP.md            # This file
```

## Setup Instructions

### Step 1: Create Project Structure

```bash
# Create main directory
mkdir giveaway-aggregator
cd giveaway-aggregator

# Create subdirectories
mkdir frontend backend
mkdir -p frontend/src frontend/public
mkdir -p .github/workflows

# Create empty backend files
touch server.js package.json .env .env.example .gitignore

# Create frontend files structure
touch frontend/package.json
touch frontend/public/index.html
touch frontend/src/App.jsx frontend/src/App.css
touch frontend/src/index.js frontend/src/index.css
```

### Step 2: Copy Files

Copy the content from these files into your project:

**Backend:**
- Copy `server.js` content into `/server.js`
- Copy `package.json` (backend version) into `/package.json`
- Copy `.env.example` content into `/.env.example` and `/.env`

**Frontend:**
- Copy `frontend-package.json` content into `/frontend/package.json`
- Copy `public-index.html` content into `/frontend/public/index.html`
- Copy `App.jsx` into `/frontend/src/App.jsx`
- Copy `App.css` into `/frontend/src/App.css`
- Copy `index.js` into `/frontend/src/index.js`
- Copy `index.css` into `/frontend/src/index.css`

**Documentation & Config:**
- Copy `README.md` into `/README.md`
- Copy `QUICKSTART.md` into `/QUICKSTART.md`
- Copy `.gitignore` into `/.gitignore`
- Copy `.github-workflows-deploy.yml` into `/.github/workflows/deploy.yml`

### Step 3: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 4: Configure Environment Variables

```bash
# Backend .env (root directory)
echo "PORT=5000" > .env
echo "NODE_ENV=development" >> .env

# Frontend .env
echo "REACT_APP_API_URL=http://localhost:5000" > frontend/.env
```

### Step 5: Start Development

```bash
# Terminal 1: Start Backend
npm run dev
# Output: Server running on http://localhost:5000

# Terminal 2: Start Frontend
cd frontend
npm start
# Your browser opens at http://localhost:3000
```

## File Descriptions

### Backend Files

#### `server.js`
- Express.js API server
- Aggregates giveaway data
- Provides REST endpoints for searching, filtering, and sorting
- Includes caching mechanism
- Currently uses mock data (ready for real scrapers)

**Key Endpoints:**
- `GET /api/giveaways` - Fetch filtered giveaways
- `GET /api/categories` - Get available categories
- `GET /api/stats` - Global statistics

#### `package.json` (Backend)
- Defines dependencies: express, cors, axios, cheerio
- Scripts: `start` and `dev`
- Handles nodemon for auto-reload in development

### Frontend Files

#### `App.jsx`
- Main React component
- Handles state: giveaways, search, filters, favorites
- Components:
  - Search bar with real-time filtering
  - Filter dropdowns (category, difficulty, timeframe, sort)
  - Giveaway grid with card display
  - Countdown timer display
  - Favorite button (heart icon)
  - Loading and empty states

#### `App.css`
- Modern gradient design (indigo + pink theme)
- Responsive grid layout
- Card hover animations
- Mobile-first responsive design
- CSS variables for theming

#### `index.js` & `index.css`
- React app entry point
- Global styling

#### `public/index.html`
- HTML template for React
- Meta tags for SEO
- Loading animation while app initializes

#### `package.json` (Frontend)
- React 18 dependencies
- react-scripts for build tools
- gh-pages for GitHub Pages deployment

### Configuration Files

#### `.env.example`
- Template showing required environment variables
- Copy this and create `.env` with actual values

#### `.env`
- DO NOT COMMIT THIS FILE (in .gitignore)
- Contains sensitive configuration
- Create one in both root and frontend directories

#### `.gitignore`
- Ignores: node_modules, .env, build, logs, etc.
- Prevents committing sensitive data

#### `.github/workflows/deploy.yml`
- Automated deployment to GitHub Pages
- Triggers on push to main branch
- Builds and deploys frontend automatically

### Documentation Files

#### `README.md`
- Complete project documentation
- Features overview
- Local setup instructions
- Deployment guide (Railway, Render, GitHub Pages)
- API documentation
- Troubleshooting guide
- FAQ section

#### `QUICKSTART.md`
- Fast 5-minute setup guide
- Perfect for new developers
- Troubleshooting tips

## Deployment Workflow

### Deploy Backend

**Option 1: Railway (Recommended)**
```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to railway.app and connect your repo
# 3. Add environment variables
# 4. Deploy automatically
```

**Option 2: Render**
```bash
# Same process as Railway
# Visit render.com instead
```

**Option 3: Heroku (Free tier removed)**
- Use Railway or Render instead

### Deploy Frontend to GitHub Pages

```bash
# 1. Update frontend/package.json homepage
# "homepage": "https://yourusername.github.io/giveaway-aggregator"

# 2. Update frontend/.env
# REACT_APP_API_URL=https://your-backend-url.railway.app

# 3. Deploy
cd frontend
npm run deploy

# 4. Enable GitHub Pages in repo Settings
```

## Adding New Features

### To Add a New Giveaway Source

Edit `server.js` and add a new scraper function:

```javascript
const scrapeNewSource = async () => {
  // Fetch data from new source
  const response = await axios.get('https://example.com/giveaways');
  
  // Parse and map to standard format
  return response.data.map(item => ({
    id: item.id,
    title: item.name,
    description: item.desc,
    source: 'NewSource',
    url: item.link,
    prize: item.prizeAmount,
    category: 'Tech',
    entryDifficulty: 'Easy',
    expiresAt: item.expiryDate,
    participants: item.entries,
    image: item.imageUrl
  }));
};

// Add to fetchGiveaways():
const newData = await scrapeNewSource();
giveaways.push(...newData);
```

### To Add a New Filter

1. **Backend:** Add filter logic in `server.js` `/api/giveaways` endpoint
2. **Frontend:** Add new `<select>` element in `App.jsx` controls-section
3. **Pass state:** Connect to existing filtering system

### To Customize the Design

Edit `App.css` to modify:
- Colors: Change CSS variables in `:root`
- Layout: Modify grid template columns
- Fonts: Update font-family values
- Spacing: Adjust padding/margin values

## Environment Variables Reference

### Backend Variables
```
PORT=5000                          # Server port
NODE_ENV=development|production    # Environment mode
REDDIT_CLIENT_ID=xxx               # (Future) Reddit API
TWITTER_BEARER_TOKEN=xxx           # (Future) Twitter API
GLEAM_API_KEY=xxx                  # (Future) Gleam integration
```

### Frontend Variables
```
REACT_APP_API_URL=http://localhost:5000  # Backend URL
```

## Troubleshooting Common Issues

### Dependencies Won't Install
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

### CORS Errors
- Ensure backend is running
- Check REACT_APP_API_URL matches backend URL
- Verify cors() middleware is in server.js

### Build Fails
```bash
# Check Node version
node --version  # Should be 14+

# Clear build cache
rm -rf build node_modules
npm install
npm run build
```

## Success Checklist

- [ ] Cloned/created repository
- [ ] Copied all files to correct locations
- [ ] Installed backend dependencies (`npm install`)
- [ ] Installed frontend dependencies (`cd frontend && npm install`)
- [ ] Created `.env` files with configuration
- [ ] Backend runs on http://localhost:5000
- [ ] Frontend runs on http://localhost:3000
- [ ] Can search and filter giveaways
- [ ] Favorite button works
- [ ] Ready to deploy!

## Next Steps

1. **Run locally** - Follow QUICKSTART.md
2. **Customize** - Modify colors, add features
3. **Add real data** - Implement scrapers for Gleam, Reddit, Twitter
4. **Deploy** - Follow deployment guide in README.md
5. **Share** - Tell friends about your awesome giveaway finder!

---

**Need help?** Check README.md FAQ or create an issue on GitHub! 🚀
