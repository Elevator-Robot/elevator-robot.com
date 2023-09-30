import React, { useState, useEffect } from "react";
import { PageProps } from "gatsby";
import { Amplify } from "aws-amplify";
import amplifyConfig from "../../amplify-config";
import AvatarButton from "./AvatarButton";
import LoginModal from "./LoginModal";
import { Auth } from "aws-amplify";

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

  // take websocket url from env variable
  useEffect(() => {
    const wsInstance = new WebSocket(process.env.WEBSOCKET_URL || "ws://localhost:3001");
    setWs(wsInstance);

    const checkUserAuthentication = async () => {
      try {
        await Auth.currentAuthenticatedUser();
        setIsAuthenticated(true);
      } catch (error) {
        console.error("No authenticated user", error);
        setIsAuthenticated(false);
      }
    };

    // Call the function to set authentication status
    checkUserAuthentication();

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

  // create a login modal where the user will retain their login state even if they refresh the page
  return (
    <>
      {isAuthenticated ? (
        <main className={containerStyles}>
          <div className={`border border-gray-300 p-2 rounded-lg mb-4 ${chatContainerStyles}`} id="chatContainer">
            {messages.map((message) => (
              <div key={message.id} className={message.user === "assistant" ? messageStyles : botMessageStyles}>
                {message.message}
              </div>
            ))}
          </div>
          <form className={formStyles} onSubmit={handleChatInputSubmit}>
            <input
              type="text"
              placeholder="Type a message..."
              className={inputStyles}
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
            />
            <button type="submit" className={sendButtonStyles}>
              Send
            </button>
          </form>
        </main>
      ) : (
        <LoginModal showModal={showModal} toggleModal={toggleModal} handleAuthentication={handleAuthentication} />
      )}
    </>
  );
}

export default IndexPage;