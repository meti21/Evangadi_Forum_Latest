const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Test CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'http://localhost:5173',
      'https://evangadi-forum-frontend-git-main-metis-projects-cc5af67c.vercel.app'
    ];
    
    if (origin.includes('vercel.app') || origin.includes('vercel.com')) {
      console.log('✅ Allowing Vercel domain:', origin);
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Allowing specific domain:', origin);
      return callback(null, true);
    }
    
    console.log('❌ CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.get('/test', (req, res) => {
  res.json({ message: 'CORS test successful', origin: req.headers.origin });
});

app.listen(PORT, () => {
  console.log(`CORS test server running on port ${PORT}`);
  console.log('Test with: curl -H "Origin: https://evangadi-forum-frontend-git-main-metis-projects-cc5af67c.vercel.app" http://localhost:3001/test');
}); 