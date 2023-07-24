const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verify if user already exist
    let user = await userModel.findOne({ email });

    // Return immediately an error's message if the user already exist
    if (user)
      // This logic means that returns immediately
      return res.status(400).json("User with the given email already exist...");

    // Do some validations
    if (!name || !email || !password)
      // This logic means that returns immediately
      return res.status(400).json("All fields are required...");

    if (!validator.isEmail(email))
      return res.status(400).json("Email must be a valid email...");

    if (!validator.isStrongPassword(password))
      return res
        .status(400)
        .json(
          "Password must be strong password (It must contain at least 8 characters: uppercase and lowercase letters, numeric and special characters)..."
        );

    user = new userModel({ name, email, password });

    /**This is just a random's string of characters that makes 
        hard for people to decode the password and genSalt() takes 
        as parameter a number of these characters */
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    // Create a token to allow user to access to our app's services
    const token = createToken(user._id);

    // Send specific data as response to the client
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Verify if the user exists with this email
    let user = await userModel.findOne({ email });
    if (!user) return res.status(400).json("Invalid email or password...");

    //Compare the given password with the one in the database
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json("Invalid email or password...");

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Find a single user
const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Find all users
const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
module.exports = { registerUser, loginUser, findUser, getUsers };
