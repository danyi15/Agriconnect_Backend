const express = require("express");
const { getAllQuestions, createQuestion, deleteQuestion } = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllQuestions);
router.post("/", authMiddleware, createQuestion);
router.delete("/:id", authMiddleware, deleteQuestion);

module.exports = router;
