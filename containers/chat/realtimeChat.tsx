import { useSockets } from "../../context/socket.context";
import { useEffect, useRef, useState } from "react";
import EVENTS from "../../config/chat/events";

export default function RealtimeChat() {
  const { socket, username, setUsername, roomId, rooms } = useSockets();
  const usernameRef = useRef<any>(null);
  const newRoomRef = useRef<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [setUsername]);

  function handleSetUsername() {
    const value = usernameRef.current.value;
    if (!value) {
      console.log("failed");
      return;
    }

    setUsername(value);
    console.log("success");
    localStorage.setItem("username", value);
    setIsEditingUsername(false); // 닉네임 설정이 완료되면 닉네임 변경 화면 닫기
  }

  function handleCreateRoom() {
    const roomName = newRoomRef.current.value || "";
    if (!String(roomName).trim()) return;
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });
    newRoomRef.current.value = "";
  }

  function handleLeaveRoom() {
    setSelectedRoom(null); // 선택된 방 초기화
    // setShowForm(false); // 방 생성 폼을 숨김
  }

  useEffect(() => {
    if (roomId && newRoomRef.current) {
      newRoomRef.current.value = "";
    }
  }, [roomId]);

  function handleJoinRoom(key: any) {
    if (key === roomId) return;
    setSelectedRoom(key);
    socket.emit(EVENTS.CLIENT.JOIN_ROOM, key);
  }

  function handleEditUsername() {
    setIsEditingUsername(true); // 닉네임 변경 화면으로 전환
  }

  return (
    <div className="absolute inset-y-0 right-2">
      {!username && !isEditingUsername && (
        <div className="w-96 bg-white rounded-xl">
          <div className="flex flex-col p-5 items-center justify-center">
            <h3 className="font-bold text-4xl mb-24 mt-10">ChatCrypto🔐</h3>
            <h3 className="font-bold text-xl mt-10">닉네임을 작성해주세요😊</h3>
            <input
              maxLength={15}
              placeholder="15자 이내로 작성해주세요!"
              ref={usernameRef}
              className="shadow appearance-none border rounded-xl w-[60px] py-2 px-3 text-white font-bold leading-tight focus:outline-none focus:shadow-outline bg-blue-500 text-center placeholder-gray-100 my-7"
            />
            <button
              onClick={handleSetUsername}
              className="mt-52 text-white bg-blue-500 w-56 h-14 rounded-xl font-bold text-lg"
            >
              시작
            </button>
          </div>
        </div>
      )}

      {username && !isEditingUsername && !selectedRoom && (
        <div
          className="w-96 bg-white rounded-xl"
          style={{
            // width: 300,
            height: 642.42,
          }}
        >
          <div className="flex flex-col p-5 items-center justify-center">
            <h3 className="font-bold text-4xl mt-10">방 목록</h3>
            <RoomsContainer rooms={rooms} handleJoinRoom={handleJoinRoom} />
            <input
              maxLength={15}
              ref={newRoomRef}
              placeholder="채팅방 이름을 입력해주세요!"
              className="absolute mt-40 -mb-80 shadow appearance-none border rounded-xl py-2 px-3 text-white font-bold leading-tight focus:outline-none focus:shadow-outline bg-blue-500 text-center placeholder-gray-100"
            />
            <button
              onClick={handleCreateRoom}
              className="absolute text-white bg-blue-500 w-56 h-14 rounded-xl font-bold text-lg mt-80 -mb-64"
            >
              방 생성🚪
            </button>
            {username && (
              <button
                onClick={handleEditUsername}
                className="absolute text-white bg-blue-500 w-56 h-14 rounded-xl font-bold text-lg mt-96 -mb-80"
              >
                닉네임 변경
              </button>
            )}
          </div>{" "}
        </div>
      )}

      {username && !isEditingUsername && selectedRoom && (
        <MessagesContainer
          roomId={selectedRoom}
          handleLeaveRoom={handleLeaveRoom} // 방을 나가는 기능 전달
        />
      )}

      {isEditingUsername && (
        <div className="w-96 bg-white rounded-xl">
          <div className="flex flex-col p-5 items-center justify-center">
            <h3 className="font-bold text-4xl mb-24 mt-10">ChatCrypto🔐</h3>
            <h3 className="font-bold text-xl mt-10">
              새로운 닉네임을 입력해주세요😊
            </h3>
            <input
              maxLength={15}
              placeholder="15자 이내로 작성해주세요!"
              ref={usernameRef}
              className="shadow appearance-none border rounded-xl w-[60px] py-2 px-3 text-white font-bold leading-tight focus:outline-none focus:shadow-outline bg-blue-500 text-center placeholder-gray-100 my-7"
            />
            <button
              onClick={handleSetUsername}
              className="mt-52 text-white bg-blue-500 w-56 h-14 rounded-xl font-bold text-lg"
            >
              변경
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatMessage({
  username,
  message,
  time,
}: {
  username: string;
  message: string;
  time: string;
}) {
  const isCurrentUser = username === "You"; // 현재 사용자의 채팅인지 확인

  // 시간 포맷을 조정하여 두 자리로 표시
  const formattedTime = time
    .split(":")
    .map((part) => part.padStart(2, "0"))
    .join(":");

  return (
    <div
      className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}
    >
      <div className="flex items-center mb-1">
        {!isCurrentUser && (
          <span className="text-base font-bold text-black">{username}</span>
        )}
      </div>
      <div
        className={`rounded-md ${
          isCurrentUser ? "bg-blue-200" : "bg-gray-200"
        } px-3 py-2 inline-block mb-3`}
      >
        <span className="font-bold text-black">{message}</span>
        <span className="text-xs text-gray-500 ml-2">{formattedTime}</span>
      </div>
    </div>
  );
}

function MessagesContainer({
  roomId,
  handleLeaveRoom,
}: {
  roomId: string;
  handleLeaveRoom: Function;
}) {
  const { socket, messages, username, setMessages } = useSockets();
  const newMessageRef = useRef<any>(null);
  const messageEndRef = useRef<any>(null);

  function handleSendMessage() {
    const message = newMessageRef.current.value;

    if (!String(message).trim()) {
      return;
    }

    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, username });

    const date = new Date();

    setMessages((messages: any) => [
      ...messages,
      {
        username: "You",
        message,
        time: `${date.getHours()}:${date.getMinutes()}`,
      },
    ]);

    newMessageRef.current.value = "";
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-96 bg-white rounded-xl">
      <div className="flex flex-col p-5 items-center justify-center">
        <div
          className="bg-blue-500 text-black m-5 p-5 overflow-y-scroll h-96 w-72 rounded-xl"
          style={{ height: 354.5 }}
        >
          <div className="text-white">
            {messages?.map(({ message, username, time }, index) => (
              <ChatMessage
                key={index}
                username={username}
                message={message}
                time={time}
              />
            ))}
            <div ref={messageEndRef} />
          </div>
        </div>
        <div className="text-black flex flex-col justify-center items-center">
          <textarea
            rows={1}
            placeholder="나누고 싶은 대화를 입력해주세요!"
            ref={newMessageRef}
            className="h-24 w-72 bg-blue-400 text-white p-3 rounded-xl placeholder-gray-100"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-400 text-white rounded-xl w-56 h-10 mt-5"
          >
            전송
          </button>
          <button
            onClick={() => handleLeaveRoom()}
            className="text-white bg-red-500 rounded-xl w-56 h-10 mt-3"
          >
            방 나가기❌
          </button>
        </div>
      </div>
    </div>
  );
}

function RoomsContainer({
  rooms,
  handleJoinRoom,
}: {
  rooms: any;
  handleJoinRoom: Function;
}) {
  return (
    <nav>
      <div className="flex flex-col p-5 items-center justify-center">
        <ul className="bg-blue-500 font-bold text-lg p-7 pt-0 overflow-y-scroll h-80 rounded-xl w-56">
          {Object.keys(rooms).map((key) => {
            return (
              <li className="bg-blue-200 my-2 rounded-xl" key={key}>
                <button
                  title={`Join ${rooms[key]}`}
                  onClick={() => handleJoinRoom(key)}
                  className="w-full text-left p-2 font-bold text-lg"
                >
                  {rooms[key].name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
