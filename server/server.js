const express = require("express");
const mongoose = require("mongoose");
const app = express();
const UserRouter = require("./routes/UsersRoutes");

// Middleware
app.use(express.json());

// MongoDB Connection
const mongoUri = "mongodb://127.0.0.1:27017/ChatsMern";
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB");
    console.error(err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Hello home page");
});

app.use("/users", UserRouter);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
