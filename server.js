const express = require("express");
const cors = require("cors")
const controlers = require("./controler.js")
const middleware = require("./midlleware.js")
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors())




// Routes
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.post("/upload",
    middleware.upload.single("image"),
    middleware.file_midlleware,
    middleware.upload_validate,
    controlers.upload_controler)


app.get("/get_posts", controlers.get_posts_controler)

app.get("/search_posts",
  middleware.validateSearch,
  controlers.search_post_controler)

app.get("/get_post/:id", controlers.get_post_controler)
// Start server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});