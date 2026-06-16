import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, category, difficulty, sortBy, expiringIn]);

  // Fetch categories + stats
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catsRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/categories`),
          fetch(`${API_URL}/api/stats`)
        ]);

        setCategories(await catsRes.json());
        setStats(await statsRes.json());
      } catch (err) {
        console.error(err);
      }
    };

    fetchMeta();
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const TimeRemaining = ({ expiresAt }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
      const update = () => {
        const ms = new Date(expiresAt) - Date.now();

        if (ms <= 0) return setTime('Expired');

        const days = Math.floor(ms / 86400000);
        const hours = Math.floor((ms % 86400000) / 3600000);
        const mins = Math.floor((ms % 3600000) / 60000);

        if (days > 0) setTime(`${days}d ${hours}h`);
        else if (hours > 0) setTime(`${hours}h ${mins}m`);
        else setTime(`${mins}m`);
      };

      update();
      const interval = setInterval(update, 60000);
      return () => clearInterval(interval);
    }, [expiresAt]);

    return <span className="time-remaining">{time}</span>;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎁 GiveawayHub</h1>

        {stats && (
          <div>
            <span>{stats.totalGiveaways}</span>
            <span>{stats.expiringIn24h}</span>
            <span>{favorites.length}</span>
          </div>
        )}
      </header>

      <main>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />

        {loading ? (
          <p>Loading...</p>
        ) : giveaways.length === 0 ? (
          <p>No giveaways found</p>
        ) : (
          giveaways.map((g) => (
            <div key={g.id}>
              <img src={g.image} alt={g.title} />

              <button onClick={() => toggleFavorite(g.id)}>
                {favorites.includes(g.id) ? '❤️' : '🤍'}
              </button>

              <h3>{g.title}</h3>
              <p>{g.description}</p>

              <TimeRemaining expiresAt={g.expiresAt} />

              <a href={g.url} target="_blank" rel="noreferrer">
                Enter
              </a>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default App;