import express from "express";
import bodyParser from "body-parser";
import usersRoutes from "./routes/v1/users.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/users", usersRoutes);
