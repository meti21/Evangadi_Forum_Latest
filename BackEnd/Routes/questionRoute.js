const express = require("express");
const router = express.Router();

// Import question controller functions
const {
  createQuestion,
  getSingleQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
} = require("../Controller/questionController");

const authMiddleware = require("../MiddleWare/authMiddleWare");

router.post("/", authMiddleware, createQuestion);
router.get("/", getAllQuestions);
router.get("/:questionid", getSingleQuestion);
router.put("/:questionid", authMiddleware, updateQuestion); 
router.delete("/:questionid", authMiddleware, deleteQuestion);

module.exports = router;
