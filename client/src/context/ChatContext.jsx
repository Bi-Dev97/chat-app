/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useCallback, useEffect, useState } from "react";
import {
  baseUrl,
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../utils/service";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  console.log("notifications", notifications);

  // Initial socket
  useEffect(() => {
    // Initialize the connection to the socket's server
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // We need to return a cleanup function if we
    //are no longer use the socket's server
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Add and remove online users
  useEffect(() => {
    // If the socket is null it means that the user is disconnected
    // will we return nothing
    if (socket === null) return;

    // Else we trigger the "addNewUser"
    //event follow by the "getOnlineUsers" event.
    // We use socket.emit() to trigger an event on the socket's server
    // and that event's response is received by the client
    socket.emit("addNewUser", user?._id);

    //We use socket.on() to receive or resend
    // an event coming from the client
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    // This cleanup's function Removes the listener function
    // as an event listener
    // Because the user is disconnected
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  useEffect(() => {
    // Check if the socket is null
    //if true we will be not able to trigger the event
    // So we return nothing then the event will not be triggered
    if (socket === null) return;

    // We will trigger the "addNewUser" event on our socket from client's side
    // With the emit method we trigger the event by passing the event name and the user's id
    socket.emit("addNewUser", user?._id);

    //Get online users
    //We use socket.on() to receive an event coming from the client
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    // So we pass socket in the dependency array
    //whenever socket changes it means there is a new connection
    //we run it again
  }, [socket]);

  /**Notifications apis */

  // Create user's notifications
  const createNotifications = useCallback(
    async (data) => {
      const response = await postRequest(
        `${baseUrl}/notifications`,
        JSON.stringify(data)
      );
      console.log(data, response);
    },
    [messages]
  );

  console.log(notifications);

  // Mark notification as read
  const markUserNotificationAsRead = useCallback(async (notificationId) => {
    const response = await putRequest(
      `${baseUrl}/notifications/${notificationId}`
    );
  }, []);

  //Mark all notifications as read
  const markUserAllNotificationsAsRead = useCallback(async (userId) => {
    console.log(userId);
    await putRequest(`${baseUrl}/notifications/mark-read/${userId}`);
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    await deleteRequest(`${baseUrl}/notifications/${notificationId}`);
  }, []);

  // Delete all notifications
  const deleteNotifications = useCallback(async (userId) => {
    await deleteRequest(`${baseUrl}/notifications/many/${userId}`);
  }, []);

  // Get user's notifications
  const getUserNotifications = async () => {
    const response = await getRequest(`${baseUrl}/notifications/${user?._id}`);
    setNotifications(response);
  };

  // Mark sender's notifications as read
  const markSenderAllNotificationsAsRead = async (senderId) => {
    console.log(senderId);
    const response = await putRequest(
      `${baseUrl}/notifications/sender-notifications/${senderId}`
    );
  };

  //Send message in real time
  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // Receive message and notification
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      // Save notification
      //  createNotifications({ ...res, userId: user?._id });

      // Check if the message is opened
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        createNotifications({ ...res, isRead: true, userId: user?._id });
        setTimeout(() => {
          return getUserNotifications();
        }, 100);
        //setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        createNotifications({ ...res, userId: user?._id });
        setTimeout(() => {
          return getUserNotifications();
        }, 100);
        //setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    getUserNotifications();
  }, [messages]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return console.log("Error fetching users", response);
      }

      const pChats = response.filter((u) => {
        let isChatCreated = false;

        /**This checks if the user object has a
         * truthy value and if it has an _id
         * property that matches the _id property
         *  of the current element u. If it does,
         *  the function immediately returns false.
         * This ensures that the current user is not
         *  included in the filtered result. */
        if (user?._id === u._id) return false;

        /**This checks if the variable userChats
         *  has a truthy value (it is not null or undefined). */
        if (userChats) {
          /**If userChats exists, it uses the some method
           *  on userChats to check if there is any chat
           * that involves the current element u.
           * The some method returns true if at least
           * one element in the array passes the test
           * defined by the provided callback function. */
          isChatCreated = userChats?.some((chat) => {
            /**This checks if the current element u (user)
             * matches either the first or second member
             * of the chat object. It's a way to determine
             * if the current user is involved in the chat
             * represented by chat. */
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        /**If a chat is created we don't need to return that,
         * we want to return when a chat is not created
         *  so we negate isChatCreated*. Finally, the outer
         * arrow function returns the negation of isChatCreated.
         *  Since the purpose is to filter out users for whom a
         * chat is already created, this means that if
         * isChatCreated is true, the current element u will
         *  be filtered out from the result (false will be returned),
         *  and if isChatCreated is false, the current element u will
         *  be included in the result (true will be returned).*/
        return !isChatCreated;
      });
      setPotentialChats(pChats);
      setAllUsers(response);
    };

    getUsers();
  }, [userChats]);

  const getUserChats = useCallback(async () => {
    if (user?._id) {
      setIsUserChatsLoading(true);
      setUserChatsError(null);

      const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

      setIsUserChatsLoading(false);

      if (response.error) {
        return setUserChatsError(response);
      }

      setUserChats(response);
    }
  }, [user, notifications]);

  useEffect(() => {
    getUserChats();
  }, [user, notifications]);

  const getMessages = useCallback(async () => {
    setIsMessagesLoading(true);
    setMessagesError(null);

    const response = await getRequest(
      `${baseUrl}/messages/${currentChat?._id}`
    );

    setIsMessagesLoading(false);

    if (response.error) {
      return setMessagesError(response);
    }

    setMessages(response);
  }, [currentChat]);

  useEffect(() => {
    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("You must type something...");

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );

      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);

      // Update the messages array by adding the new message
      setMessages((prev) => [...prev, response]);

      // Clear the input after created a new message
      setTextMessage("");
    },
    []
  );

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );

    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  /**  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(mNotifications);
  }, []);*/

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      // find chat to open
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });
        return isDesiredChat;
      });

      // mark notification as read
      const mNotifications = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          markUserNotificationAsRead(el?._id);
        } else {
          return el;
        }
      });

      updateCurrentChat(desiredChat);
      getUserNotifications();
    },
    []
  );

  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      // mark notifications as read
      const mNotifications = notifications.map((el) => {
        let notification;
        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            markSenderAllNotificationsAsRead(n?.senderId);
          } else {
            notification = el;
          }
        });
        return notification;
      });
      getUserNotifications();
    },
    []
  );

  // Delete a chat
  const deleteUserChat = useCallback(async (userId) => {
    const response = await deleteRequest(`${baseUrl}/chats/delete/${userId}`);
  }, []);

  /**Messages apis */
  const deleteMessage = useCallback(async (messageId) => {
    
    const response = await deleteRequest(
      `${baseUrl}/messages/delete/${messageId}`
    );
  }, []);

  const deleteAllMessages = useCallback(async (chatId) => {
    const response = await deleteRequest(
      `${baseUrl}/messages/delete/many/${chatId}`
    );
  }, []);
  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        currentChat,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markUserAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,
        getUserNotifications,
        deleteNotification,
        deleteNotifications,
        deleteUserChat,
        getUserChats,
        deleteMessage,
        deleteAllMessages,
        getMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
