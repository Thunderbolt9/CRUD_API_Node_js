import express from "express";
import uniqid from "uniqid";

let usersInfo = [
  {
    id: "lmok1gr0l07m33on",
    name: "Bhavesh Yadav",
    email: "yadavyash0904@gmail.com",
    mobile: 7869546321,
    password: 1234,
  },
  {
    id: "lmok1grol07m3y6q",
    name: "Nevil Rego",
    email: "nevirego123@gmail.com",
    mobile: 8976835421,
    password: 1234,
  },
];

const router = express.Router();

// All routes here start with '/users' already
router.get("/", (req, res) => {
  res.send(usersInfo);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const foundUser = usersInfo.find((user) => user.id == id);

  res.send(foundUser);
});

router.post("/", (req, res) => {
  const newUser = req.body;

  const userId = uniqid();

  const userWithId = { id: userId, ...newUser };

  usersInfo.push(userWithId);

  res.send(`User with name ${newUser.name} added to the database`);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  usersInfo = usersInfo.filter((user) => user.id !== id);

  res.send(usersInfo);
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const currentUser = usersInfo.find((user) => user.id === id);

  currentUser.name = req.body.name;
  currentUser.mobile = req.body.mobile;

  res.send(usersInfo);
});

export default router;
