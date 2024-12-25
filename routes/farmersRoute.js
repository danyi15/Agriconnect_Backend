const express = require("express");
const { getAllFarmers, getFarmerById, createFarmer, deleteFarmer } = require("../controllers/farmersController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllFarmers);
router.get("/:id", authMiddleware, getFarmerById);
router.post("/", authMiddleware, createFarmer);
router.delete("/:id", authMiddleware, deleteFarmer);

module.exports = router;
