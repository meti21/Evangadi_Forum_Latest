//require dependencies
const dbConnection = require("../Db/dbConfig");
const { StatusCodes } = require("http-status-codes");

const getAnswersByQuestionId = async (req, res) => {
  const { questionid } = req.params;

  try {
    // Increment views for answers of this question (optional)
    await dbConnection.query(
      `UPDATE questions SET views = views + 1 WHERE questionid = ?`,
      [questionid]
    );

    // Fetch answers along with total votes per answer
    const [answers] = await dbConnection.query(
      `SELECT
         a.answerid,
         a.userid,
         a.questionid,
         a.answer,
         ANY_VALUE(a.createdate) as createdate,
         ANY_VALUE(a.views) as views,
         ANY_VALUE(a.edited) as edited,
         ANY_VALUE(u.username) as username,
         COALESCE(SUM(av.vote), 0) AS totalVotes
       FROM answers a
       LEFT JOIN users u ON a.userid = u.userid
       LEFT JOIN answer_votes av ON a.answerid = av.answerid
       WHERE a.questionid = ?
       GROUP BY a.answerid
       ORDER BY createdate DESC`,
      [questionid]
    );

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
  console.log("Authenticated User ID:", req.user?.userid);


  if (![1, -1].includes(vote)) {
    return res.status(400).json({ msg: "Invalid vote value" });
  }

  try {
    // Check if user has already voted
    const [existingVotes] = await dbConnection.query(
      `SELECT * FROM answer_votes WHERE answerid = ? AND userid = ?`,
      [answerid, userid]
    );

    if (existingVotes.length > 0) {
      // Update vote
      await dbConnection.query(
        `UPDATE answer_votes SET vote = ?, created_at = CURRENT_TIMESTAMP WHERE answerid = ? AND userid = ?`,
        [vote, answerid, userid]
      );
    } else {
      // Insert new vote
      await dbConnection.query(
        `INSERT INTO answer_votes (answerid, userid, vote) VALUES (?, ?, ?)`,
        [answerid, userid, vote]
      );
    }

    // Optionally return total vote count
    const [[{ totalVotes }]] = await dbConnection.query(
      `SELECT COALESCE(SUM(vote), 0) as totalVotes FROM answer_votes WHERE answerid = ?`,
      [answerid]
    );

    res.status(200).json({ msg: "Vote recorded", totalVotes });
  } catch (err) {
    res.status(500).json({ msg: "Vote failed", error: err.message });
  }
}
async function deleteAnswer(req, res) {
  const { answerid } = req.params;
  const { userid } = req.user;

  const [result] = await dbConnection.query(
    "DELETE FROM answers WHERE answerid = ? AND userid = ?",
    [answerid, userid]
  );

  if (result.affectedRows === 0) {
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
      "INSERT INTO answers(userid, questionid, answer) VALUES (?,?,?)",
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
    const [existing] = await dbConnection.query(
      `SELECT * FROM answers WHERE answerid = ? AND userid = ?`,
      [answerid, userid]
    );

    if (existing.length === 0) {
      return res.status(403).json({ msg: "Unauthorized or answer not found" });
    }

    await dbConnection.query(
      `UPDATE answers SET answer = ?, edited = true, updated_at = CURRENT_TIMESTAMP WHERE answerid = ?`,
      [answer, answerid]
    );

    res.status(200).json({ msg: "Answer updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update answer", error: err.message });
  }
}

module.exports = { postAnswer, getAnswersByQuestionId, upvoteDownvote,updateAnswer,deleteAnswer };
