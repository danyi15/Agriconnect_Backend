const express = require("express");
const { getAllJobSeekers, getJobSeekerById, createJobSeeker, deleteJobSeeker } = require("../controllers/jobSeekerController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllJobSeekers);
router.get("/:id", authMiddleware, getJobSeekerById);
router.post("/", authMiddleware, createJobSeeker);
router.delete("/:id", authMiddleware, deleteJobSeeker);

module.exports = router;
