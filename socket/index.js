const {
  Server,
} = require("socket.io"); /**We import Server class to create io's object */

/**We pass cors as option to io's object because the client
 and the socket's server are different 
 domains so the socket's server will 
 communicate only with the specified domains */
/**Create io's object with the Server's class so we use new Server({}) */
const io = new Server({ /* options */ cors: "http://127.0.0.1:5173/" });

let onlineUsers = [];

/**on is an event listener listening to the "connection" event,
 this event will be fired 
automatically whenever a new user connected from the browser*/
io.on("connection", (socket) => {
  /**A socket ID is a unique identifier assigned 
    to each socket connection in a network, 
    particularly in the context of socket 
    programming and web sockets.

In the context of web sockets, 
a socket ID is typically assigned by 
the server to each connected client. 
When a client establishes a connection 
to the server using web sockets, 
the server generates a unique ID 
for that connection, which is 
known as the socket ID. This ID helps
the server to keep track of individual
connections and enables targeted
communication with specific clients. */
  console.log("new connection", socket.id);

  // listen to a connection (the event listener
  //on listen on the event "äddNewUser"), we must be keep
  //track the socket id because it changes when an user is online
  // So each user online will be track with his id
  socket.on("addNewUser", (userId) => {
    //Verify if an user already exist in the online users's array
    // By negating this code below when it is true because the some method
    // returns a boolean so false will be returned and will not add user with
    // the push method otherwise if some method returns false we will
    // negate it to true and then the next code will be executed to add the user
    // to the array
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

    console.log("onlineUsers", onlineUsers);

    // We trigger this event to get online users
    //whenever a user is connected
    io.emit("getOnlineUsers", onlineUsers);
  });

  // Add Message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  // Add Delete Message Event
  socket.on("deleteMessage", (messageId, messages) => {
    // Your code to delete the message from the server's storage
    // For example, if messages are stored in an array, you can remove the message with the provided messageId.
    messages = messages.filter((message) => message.id !== messageId);

    // After deleting the message, broadcast the delete action to all connected clients
    io.emit("messageDeleted", (messages));
  });

  // Disconnect the user whenever he is logout or disconnect
  // By removing him from the online users's array
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

// The port provided here must different to the client and the server ports
io.listen(3000);
