const express = require("express");
const { getAllConnections, createConnection, deleteConnection } = require("../controllers/connectionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAllConnections);
router.post("/", authMiddleware, createConnection);
router.delete("/:id", authMiddleware, deleteConnection);

module.exports = router;
