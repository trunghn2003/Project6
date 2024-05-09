// app.js or index.js
const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const AdminRouter = require("./routes/AdminRouter");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentsRouter = require("./routes/CommentsRouter");
const path = require('path');
dbConnect();

app.use(cors({
  origin: "*",
}));

app.use(express.json());

// Add the necessary routers
app.use("/admin", AdminRouter); // Routes related to admin (login, logout)
app.use("/api/user", UserRouter); // User-related routes
app.use("/api/photo", PhotoRouter); // Photo-related routes
app.use("/api/photo/commentsOfPhoto", CommentsRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Default route
app.get("/", (req, res) => {
  res.send({ message: "Hello from photo-sharing app API!" });
});

// Start the server
app.listen(8081, () => {
  console.log("Server listening on port 8081");
});
