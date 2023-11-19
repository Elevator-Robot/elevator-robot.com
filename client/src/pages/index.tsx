import React, { useState, useEffect } from "react";
import { PageProps } from "gatsby";
import { Amplify } from "aws-amplify";
import amplifyConfig from "../../amplify-config";
// import AvatarButton from "./AvatarButton";
import LoginModal from "./LoginModal";
import { Auth } from "aws-amplify";

Amplify.configure(amplifyConfig);


const messageStyles = "bg-blue-500 text-white p-4 rounded-lg mb-4 self-start transition-transform duration-300 transform hover:scale-105";
const botMessageStyles = "bg-gray-200 text-black p-4 rounded-lg mb-4 self-start";


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
		const wsInstance = new WebSocket(process.env.GATSBY_APP_WEBSOCKET_URL || "wss://q6qgb63p56.execute-api.us-east-1.amazonaws.com/dev");
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
    }}

	const handleLogout = async () => {
		try {
			await Auth.signOut();
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Error signing out: ", error);
		}
	};

	return (
		<>
		{isAuthenticated ? (
		<body id="main" className="bg-blue-200 h-screen flex flex-col">
			<div className="p-14 text-right text-ellipsis">
			<button id="menuButton"
					className="font-bold
						text-lg border-b-4
						border-blue-500
						hover:shadow-glow
						active:scale-125
						transition-all
						ease-in-out
						duration-200"
					onClick={handleLogout}>Logout</button>
        </div>
		<div id="chatContainer" className="flex flex-col items-center justify-center flex-grow p-16">
			<div className="bg-white rounded-lg p-7 w-full max-w-xl overflow-y-auto mb-8 shadow-lg">
			{messages.map((message) => (
				<div key={message.id} className={message.user === "assistant" ? messageStyles : botMessageStyles}>
					{message.message}
				</div>
			))}
			</div>
			<form className="flex flex-col w-full max-w-xl" onSubmit={handleChatInputSubmit}>
				<input
					type="text"
					placeholder="Type a message..."
					className="rounded-lg p-4 mb-4"
					value={chatInput}
					onChange={(event) => setChatInput(event.target.value)}
				/>
				<button type="submit" className="rounded-lg px-4 py-2 bg-blue-500 text-white font-bold transition-transform duration-200 transform">
					Send
				</button>
			</form>
		</div>
    </body>
    ) : (
    <LoginModal showModal={showModal} toggleModal={toggleModal} handleAuthentication={handleAuthentication} />
    )}
    </>
	);
}

export default IndexPage;