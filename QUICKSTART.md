# ⚡ Quick Start Guide

Get GiveawayHub running in 5 minutes!

## Prerequisites
- Node.js 14+ installed ([Download](https://nodejs.org))
- npm (comes with Node.js)
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/giveaway-aggregator.git
cd giveaway-aggregator
```

## Step 2: Backend Setup (Terminal 1)

```bash
# Install dependencies
npm install

# Start the server
npm run dev
```

You should see:
```
Server running on http://localhost:5000
```

## Step 3: Frontend Setup (Terminal 2)

```bash
# Install dependencies
npm install

# Start the app
npm start
```

The app will automatically open at `http://localhost:3000` 🎉

## Step 4: Start Using!

1. **Search** - Type a giveaway name or prize
2. **Filter** - Use the dropdowns to narrow down results
3. **Save** - Click the heart icon to save favorites
4. **Enter** - Click "Enter Giveaway" to visit the actual giveaway page

## Troubleshooting

### Issue: "Port 5000 already in use"
```bash
# Change the port in your .env file
echo "PORT=5001" >> .env
```

### Issue: Blank page with no content
1. Open Developer Tools (F12)
2. Check the Console tab for errors
3. Verify backend is running on http://localhost:5000

### Issue: "Cannot find module 'express'"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- 📖 Read the full [README.md](./README.md) for detailed docs
- 🚀 Deploy to production using the [deployment guide](./README.md#deployment)
- 💡 Add new features or data sources
- 🐛 Report bugs on GitHub Issues

## Need Help?

- Check the FAQ section in README.md
- Look at the API endpoints documentation
- Open an issue on GitHub

Happy giveaway hunting! 🎁
