const mongoose = require("mongoose");

/**Here userSchema is an object and using new mongoose.Schema
 which is a class to create an object' s model for our userSchema */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 30 },
    email: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 200,
      unique: true,
    },
    password: { type: String, required: true, minLength: 3, maxLength: 1024 },
  },
  {
    timestamps: true,
  }
);

/**Creating user's model to perform CRUD's operations
 with our express's apis's endpoints in mongoDB's database  */
const userModel = mongoose.model(
  "User",
  userSchema
); /**This takes two parameters the user's model's name used as 
  the table or collection's name in the database and userSchema 
  as second parameter used as schema for User's table data */

module.exports = userModel;
