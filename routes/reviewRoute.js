const express = require("express");
const { getAllReviews, createReview, deleteReview } = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllReviews);
router.post("/", authMiddleware, createReview);
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
