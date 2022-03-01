const express = require("express");
const uniqid = require("uniqid");
const bcrypt = require("bcrypt");
const multer = require("multer");
const jsonwebtoken = require("jsonwebtoken");
const checkAuth = require("../../middleware/check-auth");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

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

// All routes here start with '/users' already

// get all the users data
router.get("/", (req, res) => {
  res.send(usersInfo);
});

// register a new user
router.post("/signup", upload.single("profilePicture"), (req, res) => {
  const check = usersInfo.find((user) => user.email == req.body.email);
  if (check) {
    return res
      .status(409)
      .json({ success: false, message: "Email already exists" });
  } else {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      } else {
        req.body.password = hash;

        const profilePicture = req.file.path;

        const newUser = req.body;

        const userId = uniqid();

        const userWithId = {
          id: userId,
          ...newUser,
          profilePicture: profilePicture,
        };

        usersInfo.push(userWithId);

        return res.status(200).json({
          success: true,
          message: `User with name ${newUser.name} is created`,
        });
      }
    });
  }
});

// Login user
router.post("/login", (req, res) => {
  const check = usersInfo.find((user) => user.email == req.body.email);

  if (check == null) {
    return res.status(401).json({ success: false, message: "Auth failed" });
  }

  bcrypt.compare(req.body.password, check.password, (err, result) => {
    if (err) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    if (result) {
      const token = jsonwebtoken.sign(
        {
          email: check.email,
          id: check.id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({
        message: "Auth successful",
        token: token,
      });
    }
  });
});

// get a specific users data
router.get("/:id", checkAuth, (req, res) => {
  const { id } = req.params;

  const foundUser = usersInfo.find((user) => user.id == id);

  res.send(foundUser);
});

// delete a users data
router.delete("/:id", checkAuth, (req, res) => {
  const { id } = req.params;

  usersInfo = usersInfo.filter((user) => user.id !== id);

  res.send(usersInfo);
});

// update a users data
router.patch("/update/:id", checkAuth, (req, res) => {
  const { id } = req.params;
  const currentUser = usersInfo.find((user) => user.id === id);

  currentUser.name = req.body.name;
  currentUser.mobile = req.body.mobile;

  res.send(usersInfo);
});

module.exports = router;
