import React, { useState, useEffect } from "react";
import { PageProps } from "gatsby";
import { Amplify } from "aws-amplify";
import amplifyConfig from "../../amplify-config";
import AvatarButton from "./AvatarButton";
import LoginModal from "./LoginModal";

Amplify.configure(amplifyConfig);

const containerStyles = "flex flex-col items-center justify-center h-screen p-16 bg-blue-200";
const chatContainerStyles = "bg-white rounded-lg p-7 w-full max-w-xl overflow-y-auto mb-8 shadow-lg";
const messageContainerStyles = "flex justify-start";
const messageStyles = "bg-blue-500 text-white p-4 rounded-lg mb-4 self-start transition-transform duration-300 transform hover:scale-105";
const botMessageStyles = "bg-gray-200 text-black p-4 rounded-lg mb-4 self-start";
const formStyles = "flex flex-col w-full max-w-xl";
const inputStyles = "rounded-lg p-4 mb-4";
const sendButtonStyles = "rounded-lg px-4 py-2 bg-blue-500 text-white font-bold transition-transform duration-200 transform";


const IndexPage: React.FC<PageProps> = () => {
  const [messages, setMessages] = useState<{ message: string; user: string; id: string }[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

    // Assume handleAuthentication is a function that gets called when the user is authenticated successfully
    const handleAuthentication = () => {
      setIsAuthenticated(true);
      toggleModal();
    };
  


  useEffect(() => {
    const wsInstance = new WebSocket("wss://67dlawkul8.execute-api.us-east-1.amazonaws.com/dev");
    setWs(wsInstance);  // Store WebSocket instance in state

    wsInstance.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    wsInstance.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message) {
          setMessages((oldMessages) => [...oldMessages, { message: data.message, user: "assistant", id: Date.now().toString() }]);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setMessages((oldMessages) => [...oldMessages, { message: "An error occurred", user: "system", id: Date.now().toString() }]);
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
  
    if (chatInput && ws) {  // Check if WebSocket instance exists
      const messageData = {
        message: chatInput,
        user: "user",
      };
      ws.send(JSON.stringify(messageData));
      setMessages((oldMessages) => [...oldMessages, { message: chatInput, user: "user", id: Date.now().toString() }]);  // Added unique id
      setChatInput("");
    }
  }

  return (
    <>
      {isAuthenticated ? (
        <main className={containerStyles}>
          <div className={`border border-gray-300 p-2 rounded-lg mb-4 ${chatContainerStyles}`} id="chatContainer">
            {messages.map((messageObj) => (
              <div key={messageObj.id} className={messageObj.user === "user" ? `${messageContainerStyles} ${messageStyles}` : botMessageStyles}>
                {messageObj.message}
              </div>
            ))}
          </div>
          <form onSubmit={handleChatInputSubmit} className={formStyles}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className={inputStyles}
            />
            <button
              type="submit"
              className={sendButtonStyles}
            >
              Enter
            </button>
          </form>
        </main>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <LoginModal showModal={showModal} toggleModal={toggleModal} handleAuthentication={handleAuthentication} />
        </div>
      )}
    </>
  );
}

export default IndexPage;