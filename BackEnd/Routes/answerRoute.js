const express = require("express");
const router = express.Router();

// Import answer controller functions
const {
  getAnswersByQuestionId,
  postAnswer,
  upvoteDownvote,
  updateAnswer,
  deleteAnswer
} = require("../Controller/answerController");

const authMiddleware = require("../MiddleWare/authMiddleWare");

// protected route to post an answer
router.post("/", authMiddleware, postAnswer);

// protected route to get answer for a question
router.get("/:questionid", getAnswersByQuestionId);

// route to upvote/downvote
router.post('/vote', authMiddleware, upvoteDownvote);

// route to edit answer
router.put("/:answerid", authMiddleware, updateAnswer);

// route to delete answer
router.delete("/:answerid", authMiddleware, deleteAnswer);

module.exports = router;
