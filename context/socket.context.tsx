import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/chat/default";
import EVENTS from "../config/chat/events";

interface Context {
  socket: Socket;
  username?: string;
  setUsername: (username: string) => void; // setUsername 타입 수정
  messages?: { message: string; time: string; username: string }[];
  setMessages: React.Dispatch<
    React.SetStateAction<{ message: string; time: string; username: string }[]>
  >; // setMessages 타입 수정
  roomId?: string;
  rooms: object;
}

const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
  socket,
  setUsername: () => {}, // setUsername 초기값 변경
  setMessages: () => {}, // setMessages 초기값 변경
  rooms: {},
  messages: [],
});

const SocketsProvider: React.FC = ({ children }) => {
  const [username, setUsername] = useState<string>(""); // 사용자 닉네임 상태 추가
  const [roomId, setRoomId] = useState<string>("");
  const [rooms, setRooms] = useState<object>({});
  const [messages, setMessages] = useState<
    { message: string; time: string; username: string }[]
  >([]);

  useEffect(() => {
    window.onfocus = function () {
      document.title = "ChatCrypto🔐";
    };
  }, []);

  socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setRooms(value);
  });

  socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
    setRoomId(value);
    setMessages([]); // 메시지 초기화
  });

  useEffect(() => {
    socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
      if (!document.hasFocus()) {
        document.title = "New message...";
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        { message, username, time },
      ]);
    });
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        username,
        setUsername, // setUsername 함수 추가
        rooms,
        roomId,
        messages,
        setMessages, // setMessages 함수 추가
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSockets = (): Context => useContext(SocketContext);

export default SocketsProvider;
