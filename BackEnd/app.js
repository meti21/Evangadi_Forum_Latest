require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Environment variable validation
const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.warn(`Warning: Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.warn("Server will start but some features may not work properly.");
}

const app = express();
const PORT = process.env.PORT || 2112;

console.log(`Starting server on port: ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'http://localhost:5173', // Local development
      'http://localhost:3000', // Alternative local port
      'https://evangadi-forum-frontend.vercel.app', // Vercel deployment
      'https://evangadi-forum-frontend.netlify.app', // Netlify deployment
      'https://evangadi-forum-frontend-o8f8tg6jc-metis-projects-cc5af67c.vercel.app', // Your actual Vercel domain
      'https://evangadi-forum-frontend-git-main-metis-projects-cc5af67c.vercel.app', // Your git-main branch domain
      process.env.FRONTEND_URL // Environment variable
    ].filter(Boolean);
    
    // Allow all Vercel domains (including branch deployments)
    if (origin.includes('vercel.app') || origin.includes('vercel.com')) {
      console.log('✅ Allowing Vercel domain:', origin);
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Allowing specific domain:', origin);
      return callback(null, true);
    }
    
    console.log('❌ CORS blocked origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  preflightContinue: false,
  maxAge: 86400 // Cache preflight response for 24 hours
};

// Global middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Handle preflight requests
app.options('*', cors(corsOptions));

// CORS debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    database: process.env.DATABASE_URL ? 'configured' : 'not configured'
  });
});

// Simple test endpoint
app.get('/test', (req, res) => {
  res.status(200).json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint
app.get('/cors-test', (req, res) => {
  res.status(200).json({ 
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Database test endpoint
app.get('/db-test', async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ 
        message: 'DATABASE_URL not configured',
        timestamp: new Date().toISOString()
      });
    }
    
    const result = await dbConnection.query("SELECT 'test' as status");
    res.status(200).json({ 
      message: 'Database connection successful',
      result: result.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// DB connection and table schemas
const dbConnection = require("./Db/dbConfig");
const {
  users,
  questions,
  answers,
  createAnswerVotes,
  createAnswerComments,
} = require("./Table/schema");

// Routes
const userRoutes = require("./Routes/userRoute");
const questionRoutes = require("./Routes/questionRoute");
const answersRoute = require("./Routes/answerRoute");
const authMiddleware = require("./MiddleWare/authMiddleWare");

// Route middleware
app.use("/api/users", userRoutes);
app.use("/api/answer", answersRoute);
app.use("/api/question", questionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    msg: "Internal server error", 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Start server immediately and handle database connection in background
function startServer() {
  try {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`✅ Server bound to 0.0.0.0:${PORT}`);
      console.log(`✅ Health check available at: http://0.0.0.0:${PORT}/health`);
    });
    
    // Set server timeout
    server.timeout = 30000; // 30 seconds
    
    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
      process.exit(1);
    });
    
    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle database connection in background
async function initializeDatabase() {
  let dbConnected = false;
  
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log("DATABASE_URL not found in environment variables. Server running without database connection.");
      return false;
    }
    
    console.log("Attempting to connect to database...");
    await dbConnection.query("SELECT 'test' as status"); // Test DB connection
    dbConnected = true;
    console.log("Database connected successfully");
    
    // Create tables
    console.log("Creating/verifying database tables...");
    await dbConnection.query(users);
    await dbConnection.query(questions);
    await dbConnection.query(answers);
    await dbConnection.query(createAnswerVotes);
    await dbConnection.query(createAnswerComments);
    console.log("Database tables created/verified successfully");
    
    return true;
  } catch (error) {
    console.log("Database connection failed:", error.message);
    console.log("Server running without database connection. Some features may not work.");
    return false;
  }
}

// Start server immediately
const server = startServer();

// Initialize database in background
initializeDatabase().then(dbConnected => {
  if (dbConnected) {
    console.log("Server fully initialized with database connection");
  } else {
    console.log("Server running without database connection");
  }
}).catch(error => {
  console.error("Database initialization error:", error);
  console.log("Server running without database connection");
});
