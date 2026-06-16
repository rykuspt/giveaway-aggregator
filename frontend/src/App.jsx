import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [giveaways, setGiveaways] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('expiring');
  const [expiringIn, setExpiringIn] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch giveaways
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category !== 'All') params.append('category', category);
        if (difficulty !== 'All') params.append('difficulty', difficulty);
        if (expiringIn) params.append('expiringIn', expiringIn);
        params.append('sortBy', sortBy);

        const res = await fetch(`${API_URL}/api/giveaways?${params}`);
        const data = await res.json();
        setGiveaways(data);
      } catch (error) {
        console.error('Error fetching giveaways:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, category, difficulty, sortBy, expiringIn]);

  // Fetch categories and stats
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catsRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/categories`),
          fetch(`${API_URL}/api/stats`)
        ]);
        const cats = await catsRes.json();
        const statsData = await statsRes.json();
        setCategories(cats);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMeta();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const TimeRemaining = ({ expiresAt }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
      const updateTime = () => {
        const ms = new Date(expiresAt) - Date.now();
        if (ms <= 0) {
          setTime('Expired');
          return;
        }

        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((ms / 1000 / 60) % 60);

        if (days > 0) {
          setTime(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTime(`${hours}h ${mins}m`);
        } else {
          setTime(`${mins}m`);
        }
      };

      updateTime();
      const interval = setInterval(updateTime, 60000); // Update every minute
      return () => clearInterval(interval);
    }, [expiresAt]);

    return <span className="time-remaining">{time}</span>;
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">🎁 GiveawayHub</h1>
            <p className="tagline">Find & win incredible prizes online</p>
          </div>

          {stats && (
            <div className="stats-bar">
              <div className="stat">
                <span className="stat-number">{stats.totalGiveaways}</span>
                <span className="stat-label">Active Giveaways</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.expiringIn24h}</span>
                <span className="stat-label">Expiring in 24h</span>
              </div>
              <div className="stat">
                <span className="stat-number">{favorites.length}</span>
                <span className="stat-label">Saved</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Search & Filters */}
        <div className="controls-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search giveaways, prizes, sources..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filters">
            <select value={category} onChange={e => setCategory(e.target.value)} className="filter-select">
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="filter-select">
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select value={expiringIn} onChange={e => setExpiringIn(e.target.value)} className="filter-select">
              <option value="">All Timeframes</option>
              <option value="1">Expiring in 1h</option>
              <option value="6">Expiring in 6h</option>
              <option value="24">Expiring in 24h</option>
              <option value="168">Expiring in 7 days</option>
            </select>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
              <option value="expiring">Expiring Soon</option>
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Giveaways Grid */}
        <div className="giveaways-container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading amazing giveaways...</p>
            </div>
          ) : giveaways.length === 0 ? (
            <div className="empty-state">
              <p className="empty-emoji">😕</p>
              <h3>No giveaways found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="giveaways-grid">
              {giveaways.map(giveaway => (
                <div key={giveaway.id} className="giveaway-card">
                  <div className="card-image-wrapper">
                    <img src={giveaway.image} alt={giveaway.title} className="card-image" />
                    <button
                      className={`favorite-btn ${favorites.includes(giveaway.id) ? 'active' : ''}`}
                      onClick={() => toggleFavorite(giveaway.id)}
                      title={favorites.includes(giveaway.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {favorites.includes(giveaway.id) ? '❤️' : '🤍'}
                    </button>
                    <div className="urgency-badge">
                      <TimeRemaining expiresAt={giveaway.expiresAt} />
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="badge-group">
                      <span className="badge source">{giveaway.source}</span>
                      <span className="badge category">{giveaway.category}</span>
                      <span className={`badge difficulty difficulty-${giveaway.entryDifficulty.toLowerCase()}`}>
                        {giveaway.entryDifficulty}
                      </span>
                    </div>

                    <h3 className="card-title">{giveaway.title}</h3>
                    <p className="card-description">{giveaway.description}</p>

                    <div className="prize-section">
                      <span className="prize-label">Prize:</span>
                      <span className="prize-text">{giveaway.prize}</span>
                    </div>

                    <div className="participants-info">
                      👥 {giveaway.participants.toLocaleString()} participants
                    </div>

                    <a href={giveaway.url} target="_blank" rel="noopener noreferrer" className="enter-btn">
                      Enter Giveaway →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>GiveawayHub • Aggregating the best giveaways from across the internet</p>
      </footer>
    </div>
  );
}

export default App;
