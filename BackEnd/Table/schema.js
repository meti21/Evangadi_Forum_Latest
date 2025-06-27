const dbConnection = require('../Db/dbConfig');

const users = `CREATE TABLE IF NOT EXISTS users (
  userid SERIAL PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE,
  firstname VARCHAR(20) NOT NULL,
  lastname VARCHAR(20) NOT NULL,
  email VARCHAR(40) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  profile_pic TEXT DEFAULT NULL
);`;

const questions = `CREATE TABLE IF NOT EXISTS questions (
  questionid SERIAL PRIMARY KEY,
  userid INTEGER REFERENCES users(userid) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description VARCHAR(400) NOT NULL,
  tag VARCHAR(50),
  createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  views INTEGER DEFAULT 0
);`;

const answers = `CREATE TABLE IF NOT EXISTS answers (
  answerid SERIAL PRIMARY KEY,
  userid INTEGER REFERENCES users(userid) ON DELETE SET NULL,
  questionid INTEGER REFERENCES questions(questionid) ON DELETE CASCADE,
  answer VARCHAR(400) NOT NULL,
  createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  views INTEGER DEFAULT 0,
  edited BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP NULL DEFAULT NULL
);`;

const createAnswerVotes = `CREATE TABLE IF NOT EXISTS answer_votes (
  voteid SERIAL PRIMARY KEY,
  answerid INTEGER NOT NULL REFERENCES answers(answerid) ON DELETE CASCADE,
  userid INTEGER REFERENCES users(userid) ON DELETE SET NULL,
  vote SMALLINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_vote UNIQUE (answerid, userid)
);`;

const createAnswerComments = `CREATE TABLE IF NOT EXISTS answer_comments (
  commentid SERIAL PRIMARY KEY,
  answerid INTEGER NOT NULL REFERENCES answers(answerid) ON DELETE CASCADE,
  userid INTEGER REFERENCES users(userid) ON DELETE SET NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

// Export all at once
module.exports = {
  users,
  questions,
  answers,
  createAnswerVotes,
  createAnswerComments,
}; 