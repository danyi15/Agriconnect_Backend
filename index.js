require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 

const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const farmerRoutes = require("./routes/farmersRoute");
const jobSeekerRoutes = require("./routes/jobSeekerRoute");
const articlesRoutes = require("./routes/articlesRoute");
const questionRoutes = require("./routes/questionRoute");
const categoryRoutes = require("./routes/categoryRoute");
const reviewRoutes = require("./routes/reviewRoute");
const connectionRoutes = require("./routes/connectionRoute");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.options("*", cors(corsOptions));

// Routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/job-seekers", jobSeekerRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/connections", connectionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
