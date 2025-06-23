require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 2112;

// Global middlewares
app.use(cors());
app.use(express.json());

// DB connection and table schemas
const dbConnection = require("./Db/dbConfig");
const {
  users,
  questions,
  answers,
  alterAnswers,
  alterQuestions,
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
app.use("/api/answer", authMiddleware, answersRoute);

app.use("/api/question", authMiddleware, questionRoutes);
app.use("/api/answer/:answerid", authMiddleware, answersRoute);

// Start server and create tables
async function start() {
  try {
    await dbConnection.query("SELECT 'test'"); // Test DB connection
    console.log("Database connection established");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Create tables
    await dbConnection.query(users);
    await dbConnection.query(questions);
    await dbConnection.query(answers);
    //added tables
    await dbConnection.query(createAnswerVotes);
    await dbConnection.query(createAnswerComments);

    try {
      await dbConnection.query(alterAnswers);
    } catch (err) {
      console.log("ALTER TABLE error (answers):", err.sqlMessage);
    }

    try {
      await dbConnection.query(alterQuestions);
    } catch (err) {
      console.log("ALTER TABLE error (questions):", err.sqlMessage);
    }
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

start();
