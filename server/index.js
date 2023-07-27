const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); /**We use mongoose to be connected
 to mongodb database */

const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const notificationRoute = require("./Routes/notificationRoute");

/**Creates an Express application. The express() 
function is a top-level function exported by
 the express module. */
const app = express(); /**This an object with methods 
which add extra-capabilities to our express app */

require("dotenv").config();

// Middleware and others configurations

//Middleware
/**This middleware will helpful for 
sending and receiving data in JSON. */
app.use(express.json());
/**This one is helpful for allowing the frontend to 
communicate with the server such as creating, 
saving... data */
app.use(cors());
/**We call our routes as middleware*/
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/notifications", notificationRoute);

/**APIs and routes for CRUD */
app.get("/", (req, res) => {
  res.send("Welcome our chat app APIs...");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.log("MongoDB connection failed: ", error?.message));
