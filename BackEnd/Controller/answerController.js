//require dependencies
const dbConnection = require("../Db/dbConfig");
const { StatusCodes } = require("http-status-codes");

const getAnswersByQuestionId = async (req, res) => {
  const { questionid } = req.params;

  try {
    // Increment views for answers of this question (optional)
    await dbConnection.query(
      `UPDATE questions SET views = views + 1 WHERE questionid = $1`,
      [questionid]
    );

    // Fetch answers along with total votes per answer
    const result = await dbConnection.query(
      `SELECT
         a.answerid,
         a.userid,
         a.questionid,
         a.answer,
         a.createdate,
         a.views,
         a.edited,
         u.username,
         u.profile_pic,
         COALESCE(SUM(av.vote), 0) AS totalVotes
       FROM answers a
       LEFT JOIN users u ON a.userid = u.userid
       LEFT JOIN answer_votes av ON a.answerid = av.answerid
       WHERE a.questionid = $1
       GROUP BY a.answerid, a.userid, a.questionid, a.answer, a.createdate, a.views, a.edited, u.username, u.profile_pic
       ORDER BY a.createdate DESC`,
      [questionid]
    );
    const answers = result.rows;

    res.status(200).json({ answers });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch answers", error: err.message });
  }
};

async function upvoteDownvote(req, res) {
  const { answerid, vote } = req.body; // vote = 1 or -1
  const userid = req.user.userid;

  if (![1, -1].includes(vote)) {
    return res.status(400).json({ msg: "Invalid vote value" });
  }

  try {
    // Check if user has already voted
    const result = await dbConnection.query(
      `SELECT * FROM answer_votes WHERE answerid = $1 AND userid = $2`,
      [answerid, userid]
    );
    const existingVotes = result.rows;

    if (existingVotes.length > 0) {
      // Update vote
      await dbConnection.query(
        `UPDATE answer_votes SET vote = $1, created_at = CURRENT_TIMESTAMP WHERE answerid = $2 AND userid = $3`,
        [vote, answerid, userid]
      );
    } else {
      // Insert new vote
      await dbConnection.query(
        `INSERT INTO answer_votes (answerid, userid, vote) VALUES ($1, $2, $3)`,
        [answerid, userid, vote]
      );
    }

    // Optionally return total vote count
    const voteResult = await dbConnection.query(
      `SELECT COALESCE(SUM(vote), 0) as totalVotes FROM answer_votes WHERE answerid = $1`,
      [answerid]
    );
    const totalVotes = voteResult.rows[0].totalvotes;

    res.status(200).json({ msg: "Vote recorded", totalVotes });
  } catch (err) {
    res.status(500).json({ msg: "Vote failed", error: err.message });
  }
}

async function deleteAnswer(req, res) {
  const { answerid } = req.params;
  const { userid } = req.user;

  const result = await dbConnection.query(
    "DELETE FROM answers WHERE answerid = $1 AND userid = $2",
    [answerid, userid]
  );

  if (result.rowCount === 0) {
    return res.status(403).json({ msg: "Not authorized to delete this answer" });
  }

  res.json({ msg: "Answer deleted successfully" });
}

//This file contains the logic for handling the incoming answer data, validating it, and storing it in the database.
async function postAnswer(req, res) {
  //1. get data from request body
  const { answer, questionid } = req.body;
  const userid = req.user.userid;

  //2.input validation
  if (!answer || !questionid || !userid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide answer!" });
  }
  try {
    //3.database insertion
    await dbConnection.query(
      "INSERT INTO answers(userid, questionid, answer) VALUES ($1,$2,$3)",
      [userid, questionid, answer]
    );
    //4. send success response
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Answer posted successfully!" });
  } catch (error) {
    //5.handle errors
    console.error("Error posting answer:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}

// to edit an answer
async function updateAnswer(req, res) {
  const { answerid } = req.params;
  const { answer } = req.body;
  const userid = req.user.userid;

  if (!answer) {
    return res.status(400).json({ msg: "Answer text is required" });
  }

  try {
    const result = await dbConnection.query(
      `SELECT * FROM answers WHERE answerid = $1 AND userid = $2`,
      [answerid, userid]
    );
    const existing = result.rows;

    if (existing.length === 0) {
      return res.status(403).json({ msg: "Unauthorized or answer not found" });
    }

    await dbConnection.query(
      `UPDATE answers SET answer = $1, edited = true, updated_at = CURRENT_TIMESTAMP WHERE answerid = $2`,
      [answer, answerid]
    );

    res.status(200).json({ msg: "Answer updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update answer", error: err.message });
  }
}

module.exports = { postAnswer, getAnswersByQuestionId, upvoteDownvote, updateAnswer, deleteAnswer };
