/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, userChatsError, updateCurrentChat } =
    useContext(ChatContext);

  /**In the provided code snippet, the slice() method
   * is used to create a shallow copy of the userChats array.
   *  This is done to avoid modifying the original array
   * directly and ensure that the sorting operation does
   *  not affect the original order of userChats.
   * In the provided code snippet, the slice() method is
   * used to create a shallow copy of the userChats array.
   *  This is done to avoid modifying the original array
   *  directly and ensure that the sorting operation does
   * not affect the original order of userChats. */
  const sortedChats = userChats
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <Container>
      <PotentialChats />
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatsLoading && <p>Loading chats...</p>}
            {userChats?.map((chat, index) => {
              return (
                <div key={index} onClick={() => updateCurrentChat(chat)}>
                  <UserChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <ChatBox />
        </Stack>
      )}
    </Container>
  );
};

export default Chat;
