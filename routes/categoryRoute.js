const express = require("express");
const { getAllCategories, createCategory, deleteCategory } = require("../controllers/categoriesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllCategories);
router.post("/", authMiddleware, createCategory);
router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;
