const express = require("express");
const {
  getAllArticles,
  getArticleById,
  createArticle,
  deleteArticle,
} = require("../controllers/articlesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllArticles);
router.get("/:id", authMiddleware, getArticleById);
router.post("/", authMiddleware, createArticle);
router.delete("/:id", authMiddleware, deleteArticle);

module.exports = router;
