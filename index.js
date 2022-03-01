const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/v1/users.js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/users", usersRoutes);
