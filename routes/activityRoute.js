const express = require("express");
const { getAllActivities, createActivity, deleteActivity } = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllActivities);
router.post("/", authMiddleware, createActivity);
router.delete("/:id", authMiddleware, deleteActivity);

module.exports = router;
