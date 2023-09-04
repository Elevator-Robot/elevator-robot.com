import React, { useState, useEffect } from "react";
import { PageProps } from "gatsby";

const containerStyles =
  "flex flex-col items-center justify-center h-screen p-4 sm:p-16 bg-blue-200";
const chatContainerStyles =
  "bg-white rounded-lg p-7 w-full max-w-xl overflow-y-auto mb-8 shadow-lg";
const messageContainerStyles = "flex justify-start";
const messageStyles =
  "bg-blue-500 text-white p-4 rounded-lg mb-4 self-start transition-transform duration-300 transform hover:scale-105";
const botMessageStyles =
  "bg-gray-200 text-black p-4 rounded-lg mb-4 self-start";
const formStyles = "flex flex-col w-full max-w-xl";
const inputStyles = "rounded-lg p-4 mb-4";
const sendButtonStyles =
  "rounded-lg px-4 py-2 bg-blue-500 text-white font-bold transition-transform duration-200 transform";
const sendButtonPressedStyles = "transform scale-95";

const IndexPage: React.FC<PageProps> = () => {
  const [messages, setMessages] = useState<
    { message: string; user: string; id: string }[]
  >([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ws, setWs] = useState<WebSocket | null>(null); // WebSocket instance in state

  useEffect(() => {
    const wsInstance = new WebSocket(
      "wss://67dlawkul8.execute-api.us-east-1.amazonaws.com/dev"
    );
    setWs(wsInstance); // Store WebSocket instance in state

    wsInstance.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    wsInstance.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message) {
          setMessages((oldMessages) => [
            ...oldMessages,
            {
              message: data.message,
              user: "assistant",
              id: Date.now().toString(),
            },
          ]);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setMessages((oldMessages) => [
          ...oldMessages,
          {
            message: "An error occurred",
            user: "system",
            id: Date.now().toString(),
          },
        ]);
      }
    };

    wsInstance.onerror = (event) => {
      console.error("WebSocket error observed:", event);
    };

    return () => {
      wsInstance.close();
    };
  }, []);

  useEffect(() => {
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  function handleChatInputSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (chatInput && ws) {
      setIsLoading(true);
      // Check if WebSocket instance exists
      const messageData = {
        message: chatInput,
        user: "user",
      };
      ws.send(JSON.stringify(messageData));
      setMessages((oldMessages) => [
        ...oldMessages,
        { message: chatInput, user: "user", id: Date.now().toString() },
      ]); // Added unique id
      setChatInput("");
      setIsLoading(false);
    }
  }

  return (
    <main className={containerStyles}>
      <div
        className={`mb-4 rounded-lg border border-gray-300 p-2 ${chatContainerStyles}`}
        id="chatContainer"
      >
        {messages.map((messageObj) => (
          <div
            key={messageObj.id}
            className={
              messageObj.user === "user"
                ? `${messageContainerStyles} ${messageStyles}`
                : botMessageStyles
            }
          >
            {messageObj.message}
          </div>
        ))}
        {isLoading && (
          <div className="ml-2 flex items-center justify-center">
            <svg
              width="45"
              height="45"
              viewBox="0 0 45 45"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#000"
            >
              <g
                fill="none"
                fill-rule="evenodd"
                transform="translate(1 1)"
                stroke-width="2"
              >
                <circle cx="22" cy="22" r="6" stroke-opacity="0">
                  <animate
                    attributeName="r"
                    begin="1.5s"
                    dur="3s"
                    values="6;22"
                    calcMode="linear"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    begin="1.5s"
                    dur="3s"
                    values="1;0"
                    calcMode="linear"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-width"
                    begin="1.5s"
                    dur="3s"
                    values="2;0"
                    calcMode="linear"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="22" cy="22" r="6" stroke-opacity="0">
                  <animate
                    attributeName="r"
                    begin="3s"
                    dur="3s"
                    values="6;22"
                    calcMode="linear"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    begin="3s"
                    dur="3s"
                    values="1;0"
                    calcMode="linear"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-width"
                    begin="3s"
                    dur="3s"
                    values="2;0"
                    calcMode="linear"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="22" cy="22" r="8">
                  <animate
                    attributeName="r"
                    begin="0s"
                    dur="1.5s"
                    values="6;1;2;3;4;5;6"
                    calcMode="linear"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            </svg>
          </div>
        )}
      </div>
      <form onSubmit={handleChatInputSubmit} className={formStyles}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className={inputStyles}
        />
        <button type="submit" className={sendButtonStyles}>
          Enter
        </button>
      </form>
    </main>
  );
};

export default IndexPage;
