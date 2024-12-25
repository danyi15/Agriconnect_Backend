const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByAuthor,
} = require("../controllers/articlesController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getAllArticles);
router.get("/:id", getArticleById);
router.get("/author/:authorId", getArticlesByAuthor);
router.post("/", authMiddleware, createArticle);
router.put("/:id", authMiddleware, updateArticle);
router.delete("/:id", authMiddleware, deleteArticle);

module.exports = router;
