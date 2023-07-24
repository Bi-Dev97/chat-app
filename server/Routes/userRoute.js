const express = require("express");
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
} = require("../Controllers/userController");
/**Using express.Router() helps in keeping 
your code organized, separating different 
parts of your application's functionality 
into smaller modules. It also allows you 
to apply middleware specific to those routes,
 handle error handling, and perform other 
 operations on a per-router basis. */
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);

module.exports = router;
