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

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local development
    'http://localhost:3000', // Alternative local port
    'https://evangadi-forum-frontend.vercel.app', // Vercel deployment
    'https://evangadi-forum-frontend.netlify.app', // Netlify deployment
    process.env.FRONTEND_URL 
  ].filter(Boolean), 
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Global middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
app.use("/api/answer/:answerid", answersRoute);

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
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  // Set server timeout
  server.timeout = 30000; // 30 seconds
  
  return server;
}

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
    await dbConnection.query("SELECT 'test'"); // Test DB connection
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
