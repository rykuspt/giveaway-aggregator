const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
let giveaways = [];
let lastFetch = 0;
const CACHE_TIME = 3600000; // 1 hour

// Mock giveaway data (replace with real scrapers)
const mockGiveaways = [
  {
    id: '1',
    title: 'Gaming Laptop Giveaway - Enter to Win!',
    description: 'Win a brand new gaming laptop worth $1500. Open to all countries.',
    source: 'Reddit',
    url: 'https://reddit.com/r/giveaways/gaming-laptop',
    prize: 'Gaming Laptop ($1500)',
    category: 'Tech',
    entryDifficulty: 'Easy',
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 2450,
    image: 'https://via.placeholder.com/300x200?text=Gaming+Laptop'
  },
  {
    id: '2',
    title: 'Amazon Gift Card Bundle ($500)',
    description: 'Follow, retweet, and tag 2 friends. $500 Amazon gift card prize.',
    source: 'Twitter',
    url: 'https://twitter.com/giveaway/amazon',
    prize: 'Amazon Gift Card ($500)',
    category: 'Shopping',
    entryDifficulty: 'Easy',
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 8920,
    image: 'https://via.placeholder.com/300x200?text=Amazon+GiftCard'
  },
  {
    id: '3',
    title: 'Photography Course Bundle - Free!',
    description: 'Complete professional photography course. Limited spots available.',
    source: 'Gleam',
    url: 'https://gleam.io/photography-course',
    prize: 'Photography Course Bundle',
    category: 'Education',
    entryDifficulty: 'Medium',
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 1230,
    image: 'https://via.placeholder.com/300x200?text=Photography+Course'
  },
  {
    id: '4',
    title: 'Airpods Pro - Apple Official Giveaway',
    description: 'Win Apple Airpods Pro. Must follow and join our newsletter.',
    source: 'Official',
    url: 'https://apple.com/giveaway',
    prize: 'Apple Airpods Pro',
    category: 'Tech',
    entryDifficulty: 'Easy',
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 45000,
    image: 'https://via.placeholder.com/300x200?text=Airpods+Pro'
  },
  {
    id: '5',
    title: 'PlayStation 5 Console Bundle',
    description: 'Win PS5 with 3 games. Must comment and subscribe.',
    source: 'YouTube',
    url: 'https://youtube.com/giveaway/ps5',
    prize: 'PlayStation 5 + Games',
    category: 'Gaming',
    entryDifficulty: 'Easy',
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 15600,
    image: 'https://via.placeholder.com/300x200?text=PS5+Bundle'
  },
  {
    id: '6',
    title: 'MacBook Air M2 - Tech Bloggers',
    description: 'Share the post and follow. Winner announced in 2 days.',
    source: 'Instagram',
    url: 'https://instagram.com/giveaway/macbook',
    prize: 'MacBook Air M2',
    category: 'Tech',
    entryDifficulty: 'Medium',
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 32000,
    image: 'https://via.placeholder.com/300x200?text=MacBook+Air'
  }
];

// Fetch and cache giveaways
const fetchGiveaways = async () => {
  const now = Date.now();
  
  // Use cache if available
  if (giveaways.length > 0 && now - lastFetch < CACHE_TIME) {
    return giveaways;
  }

  try {
    // In production, implement real scrapers here
    // For now, use mock data with some randomization
    giveaways = mockGiveaways.map(g => ({
      ...g,
      participants: Math.floor(Math.random() * 50000) + 1000
    }));
    
    lastFetch = now;
    return giveaways;
  } catch (error) {
    console.error('Error fetching giveaways:', error);
    return giveaways;
  }
};

// Routes
app.get('/api/giveaways', async (req, res) => {
  try {
    const all = await fetchGiveaways();
    const { search, category, difficulty, sortBy, expiringIn } = req.query;

    let filtered = [...all];

    // Search filter
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(g => 
        g.title.toLowerCase().includes(query) || 
        g.description.toLowerCase().includes(query) ||
        g.prize.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (category && category !== 'All') {
      filtered = filtered.filter(g => g.category === category);
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'All') {
      filtered = filtered.filter(g => g.entryDifficulty === difficulty);
    }

    // Expiring soon filter
    if (expiringIn) {
      const now = Date.now();
      const hours = parseInt(expiringIn);
      filtered = filtered.filter(g => {
        const expiresMs = new Date(g.expiresAt).getTime();
        return expiresMs - now <= hours * 60 * 60 * 1000;
      });
    }

    // Sorting
    if (sortBy === 'expiring') {
      filtered.sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt));
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.participants - a.participants);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.id) - new Date(a.id));
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/giveaways/:id', async (req, res) => {
  try {
    const all = await fetchGiveaways();
    const giveaway = all.find(g => g.id === req.params.id);
    
    if (!giveaway) {
      return res.status(404).json({ error: 'Giveaway not found' });
    }

    res.json(giveaway);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categories', (req, res) => {
  const categories = ['Tech', 'Gaming', 'Shopping', 'Education', 'Travel', 'Lifestyle'];
  res.json(categories);
});

app.get('/api/stats', async (req, res) => {
  try {
    const all = await fetchGiveaways();
    res.json({
      totalGiveaways: all.length,
      totalPrizeValue: all.length * 1000, // Mock calculation
      expiringIn24h: all.filter(g => {
        const hours = (new Date(g.expiresAt) - Date.now()) / (1000 * 60 * 60);
        return hours > 0 && hours <= 24;
      }).length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
