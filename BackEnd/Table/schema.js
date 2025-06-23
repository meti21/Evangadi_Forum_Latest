const users = `CREATE TABLE IF NOT EXISTS users(
  userid INT(20) NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  firstname VARCHAR(20) NOT NULL,
  lastname VARCHAR(20) NOT NULL,
  email VARCHAR(40) NOT NULL,
  password VARCHAR(100) NOT NULL,
  PRIMARY KEY (userid)
)`;


const questions = `CREATE TABLE IF NOT EXISTS questions(
  questionid INT NOT NULL AUTO_INCREMENT,
  userid INT(20),
  title VARCHAR(200) NOT NULL,
  description VARCHAR(400) NOT NULL,
  tag VARCHAR(50),
  createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  views INT DEFAULT 0,
  PRIMARY KEY (questionid),
  FOREIGN KEY(userid) REFERENCES users(userid) ON DELETE SET NULL
)`;


const answers = `CREATE TABLE IF NOT EXISTS answers(
  answerid INT(20) NOT NULL AUTO_INCREMENT,
  userid INT(20),
  questionid INT NOT NULL,
  answer VARCHAR(400) NOT NULL,
  createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  views INT DEFAULT 0,
  edited BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (answerid),
  FOREIGN KEY(userid) REFERENCES users(userid) ON DELETE SET NULL,
  FOREIGN KEY(questionid) REFERENCES questions(questionid) ON DELETE CASCADE
)`;


// New upgrade queries
const alterAnswers = `
  ALTER TABLE answers
    ADD COLUMN views INT DEFAULT 0,
    ADD COLUMN edited BOOLEAN DEFAULT FALSE,
    ADD COLUMN updated_at TIMESTAMP NULL DEFAULT NULL;
`;

const alterQuestions = `
  ALTER TABLE questions
    ADD COLUMN views INT DEFAULT 0;
`;

const createAnswerVotes = `CREATE TABLE IF NOT EXISTS answer_votes (
  voteid INT AUTO_INCREMENT PRIMARY KEY,
  answerid INT NOT NULL,
  userid INT,
  vote TINYINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_vote (answerid, userid),
  FOREIGN KEY (answerid) REFERENCES answers(answerid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE SET NULL
)`;


const createAnswerComments = `CREATE TABLE IF NOT EXISTS answer_comments (
  commentid INT AUTO_INCREMENT PRIMARY KEY,
  answerid INT NOT NULL,
  userid INT,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (answerid) REFERENCES answers(answerid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE SET NULL
)`;

// Export all at once
module.exports = {
  users,
  questions,
  answers,
  alterAnswers,
  alterQuestions,
  createAnswerVotes,
  createAnswerComments,
};
