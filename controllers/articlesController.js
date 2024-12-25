const db = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: "./public/uploads/articles/",
  filename: (req, file, cb) => {
    cb(null, `article-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new Error("Only .jpeg, .jpg and .png format allowed!"));
  },
}).single("image");

// Helper function untuk handle upload dengan error handling yang lebih baik
const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File too large. Maximum size is 1MB",
        });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// Helper function untuk menghapus file gambar
const deleteImage = (imagePath) => {
  if (imagePath && imagePath !== "default_image.png") {
    const fullPath = path.join(__dirname, "../public", imagePath);
    fs.unlink(fullPath, (err) => {
      if (err) console.error("Error deleting image:", err);
    });
  }
};

// GET all articles with author info
exports.getAllArticles = (req, res) => {
  const sql = `
    SELECT a.*, u.name as author_name 
    FROM articles a
    JOIN users u ON a.author_id = u.user_id
    ORDER BY a.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        message: "Failed to fetch articles",
        error: err.message,
      });
    }
    res.status(200).json(results);
  });
};

// GET article by ID
exports.getArticleById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT a.*, u.name as author_name 
    FROM articles a
    JOIN users u ON a.author_id = u.user_id
    WHERE a.article_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        message: "Failed to fetch article",
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(result[0]);
  });
};

// CREATE article with image
exports.createArticle = [
  handleUpload,
  (req, res) => {
    const { title, description } = req.body;
    const author_id = req.user.id; // from auth middleware

    if (!title || !description) {
      if (req.file) deleteImage(`/uploads/articles/${req.file.filename}`);
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const image = req.file
      ? `/uploads/articles/${req.file.filename}`
      : "default_image.png";

    const sql = `
    INSERT INTO articles 
    (title, description, author_id, image, status) 
    VALUES (?, ?, ?, ?, 'draft')
  `;

    db.query(sql, [title, description, author_id, image], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        if (req.file) deleteImage(`/uploads/articles/${req.file.filename}`);
        return res.status(500).json({
          message: "Failed to create article",
          error: err.message,
        });
      }

      // Fetch the created article
      const getArticleSql = `
      SELECT a.*, u.name as author_name 
      FROM articles a
      JOIN users u ON a.author_id = u.user_id
      WHERE a.article_id = ?
    `;

      db.query(getArticleSql, [result.insertId], (err, article) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({
            message: "Article created but failed to fetch details",
            error: err.message,
          });
        }
        res.status(201).json(article[0]);
      });
    });
  },
];

// UPDATE article
exports.updateArticle = [
  handleUpload,
  (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const author_id = req.user.id;

    if (!title || !description) {
      if (req.file) deleteImage(`/uploads/articles/${req.file.filename}`);
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    // Get old image first
    db.query(
      "SELECT image FROM articles WHERE article_id = ? AND author_id = ?",
      [id, author_id],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          if (req.file) deleteImage(`/uploads/articles/${req.file.filename}`);
          return res.status(500).json({
            message: "Failed to fetch article",
            error: err.message,
          });
        }

        if (results.length === 0) {
          if (req.file) deleteImage(`/uploads/articles/${req.file.filename}`);
          return res.status(404).json({
            message: "Article not found or unauthorized",
          });
        }

        const oldImage = results[0].image;
        const newImage = req.file
          ? `/uploads/articles/${req.file.filename}`
          : req.body.image || oldImage;

        const sql = `
        UPDATE articles 
        SET title = ?, description = ?, image = ?, status = ?
        WHERE article_id = ? AND author_id = ?
      `;

        db.query(
          sql,
          [title, description, newImage, status || "draft", id, author_id],
          (err, result) => {
            if (err) {
              console.error("Database error:", err);
              if (req.file) deleteImage(newImage);
              return res.status(500).json({
                message: "Failed to update article",
                error: err.message,
              });
            }

            // If new image uploaded successfully, delete old image
            if (req.file && oldImage) {
              deleteImage(oldImage);
            }

            // Fetch updated article
            const getArticleSql = `
            SELECT a.*, u.name as author_name 
            FROM articles a
            JOIN users u ON a.author_id = u.user_id
            WHERE a.article_id = ?
          `;

            db.query(getArticleSql, [id], (err, article) => {
              if (err) {
                console.error("Database error:", err);
                return res.status(500).json({
                  message: "Article updated but failed to fetch details",
                  error: err.message,
                });
              }
              res.status(200).json(article[0]);
            });
          }
        );
      }
    );
  },
];

// DELETE article
exports.deleteArticle = (req, res) => {
  const { id } = req.params;
  const author_id = req.user.id;

  // Get image path first
  db.query(
    "SELECT image FROM articles WHERE article_id = ? AND author_id = ?",
    [id, author_id],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          message: "Failed to fetch article",
          error: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Article not found or unauthorized",
        });
      }

      const imagePath = results[0].image;

      // Delete from database
      db.query(
        "DELETE FROM articles WHERE article_id = ? AND author_id = ?",
        [id, author_id],
        (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({
              message: "Failed to delete article",
              error: err.message,
            });
          }

          // Delete image file if exists and not default
          deleteImage(imagePath);

          res.status(200).json({ message: "Article deleted successfully" });
        }
      );
    }
  );
};

// GET articles by author
exports.getArticlesByAuthor = (req, res) => {
  const { authorId } = req.params;
  const sql = `
    SELECT a.*, u.name as author_name 
    FROM articles a
    JOIN users u ON a.author_id = u.user_id
    WHERE a.author_id = ?
    ORDER BY a.created_at DESC
  `;

  db.query(sql, [authorId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        message: "Failed to fetch articles",
        error: err.message,
      });
    }
    res.status(200).json(results);
  });
};
