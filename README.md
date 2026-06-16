# 🎁 GiveawayHub - Internet Giveaway Aggregator

A modern web app that searches across the internet for giveaways, allowing you to find, filter, and track amazing prizes in one place.

![GiveawayHub](https://via.placeholder.com/800x400?text=GiveawayHub+Preview)

## Features

✨ **Core Features:**
- 🔍 **Smart Search** - Find giveaways by title, prize, or source
- 🎯 **Advanced Filters** - Filter by category, difficulty, and expiration time
- ⏰ **Live Countdowns** - See exactly how much time is left for each giveaway
- ❤️ **Favorites** - Save your favorite giveaways (stored locally)
- 📊 **Real-time Stats** - See how many giveaways are expiring soon
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🚀 **Multi-source** - Aggregates from Reddit, Twitter, Gleam, and more

## Tech Stack

**Frontend:**
- React 18
- CSS3 with CSS Variables
- Local Storage for favorites

**Backend:**
- Node.js + Express
- Axios for HTTP requests
- Cheerio for web scraping

## Local Setup

### Prerequisites
- Node.js 14+ installed
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env

# Add environment variables
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env

# Start the backend
npm run dev
# Server runs at http://localhost:5000
```

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
touch .env

# Add environment variables
echo "REACT_APP_API_URL=http://localhost:5000" >> .env

# Start the development server
npm start
# App opens at http://localhost:3000
```

## Deployment

### Deploy Backend (Option 1: Railway)

Railway is perfect for Node.js apps and offers free tier.

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Connect Your Repository**
   - Create new project → Deploy from GitHub
   - Select your giveaway-aggregator repo
   - Add the following variables in Railway:
     ```
     NODE_ENV=production
     PORT=5000
     ```

3. **Deploy**
   - Railway automatically deploys on git push
   - Copy your Railway URL (e.g., `https://your-app.railway.app`)

### Deploy Backend (Option 2: Render)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up

2. **Create New Web Service**
   - Connect your GitHub repo
   - Select Node as the environment
   - Build command: `npm install`
   - Start command: `npm start`
   - Add Environment Variable:
     ```
     NODE_ENV=production
     ```

3. **Deploy**
   - Render auto-deploys on git push
   - Copy your Render URL

### Deploy Frontend (GitHub Pages)

1. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/giveaway-aggregator"
   }
   ```

2. **Update Frontend .env**
   Replace `http://localhost:5000` with your deployed backend URL:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```

3. **Install GitHub Pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

4. **Add deploy scripts to package.json**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build",
     "start": "react-scripts start",
     "build": "react-scripts build"
   }
   ```

5. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

6. **Enable GitHub Pages in Settings**
   - Go to repo Settings → Pages
   - Select `gh-pages` branch
   - Save

Your app is now live at: `https://yourusername.github.io/giveaway-aggregator`

### Full Deployment Steps (Complete Guide)

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Deploy backend to Railway/Render
# (Follow steps above)

# 3. Update frontend .env with backend URL

# 4. Deploy frontend
cd frontend
npm run deploy

# 5. Share your URL!
```

## Project Structure

```
giveaway-aggregator/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── App.css       # Styling
│   │   ├── index.js      # Entry point
│   │   └── index.css     # Global styles
│   └── package.json      # Frontend dependencies
└── README.md
```

## API Endpoints

The backend provides these endpoints:

```
GET /api/giveaways
  Query params:
  - search: string (optional)
  - category: string (optional)
  - difficulty: string (optional)
  - sortBy: 'expiring' | 'popular' | 'newest'
  - expiringIn: number (hours)

GET /api/giveaways/:id
  Returns single giveaway details

GET /api/categories
  Returns list of available categories

GET /api/stats
  Returns global statistics
```

## Features & Roadmap

### ✅ Implemented
- [x] Search and filter giveaways
- [x] Save favorites to localStorage
- [x] Live countdown timers
- [x] Responsive design
- [x] Multi-source aggregation
- [x] Stats dashboard

### 🚀 Coming Soon
- [ ] User accounts & cloud favorites
- [ ] Email notifications for expiring giveaways
- [ ] Advanced RSS feed integration
- [ ] Gleam.io API integration
- [ ] Twitter API integration for real-time tweets
- [ ] Custom giveaway submission
- [ ] Community reviews & ratings
- [ ] Mobile app (React Native)

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Adding Real Data Sources

### To add Reddit scraping:

```javascript
// In server.js, add this function:
const scrapeReddit = async () => {
  const res = await axios.get('https://www.reddit.com/r/giveaways/new.json');
  const posts = res.data.data.children;
  
  return posts.map(post => ({
    id: post.data.id,
    title: post.data.title,
    url: post.data.url,
    source: 'Reddit',
    // ... more fields
  }));
};
```

### To add Gleam.io API (requires API key):

```javascript
const gleamRes = await axios.get(
  'https://api.gleam.io/contests',
  { headers: { Authorization: `Bearer ${process.env.GLEAM_API_KEY}` } }
);
```

## Troubleshooting

### "Cannot find module" error
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### CORS errors when connecting frontend to backend
- Make sure backend is running on `http://localhost:5000`
- Check `REACT_APP_API_URL` in frontend .env
- Verify server.js has `cors()` middleware enabled

### Giveaways not loading
- Check browser console for errors (F12)
- Verify backend is running: `curl http://localhost:5000/api/giveaways`
- Check Network tab in DevTools

### Favorites not saving
- Ensure localStorage is enabled in browser
- Check browser console for errors
- Try clearing browser cache and reloading

## Contributing

Got ideas? Found a bug?
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source under the MIT License.

## Support

Need help? Create an issue on GitHub or check the FAQ below.

### FAQ

**Q: Is this legal?**
A: Yes! We aggregate from sources that allow it. We don't scrape Instagram or proprietary platforms.

**Q: Can I use this commercially?**
A: Yes, the MIT license allows commercial use.

**Q: How often is the data updated?**
A: Currently cached hourly. You can adjust `CACHE_TIME` in server.js.

**Q: Why are some giveaways missing?**
A: We're still building real data sources. Right now showing mock data as examples.

---

**Made with ❤️ for giveaway hunters everywhere** 🎁
