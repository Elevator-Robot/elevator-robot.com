import React, { useState } from "react";
import { Auth } from "aws-amplify";
// import amplify config
import amplifyConfig from "../../amplify-config";

// configure amplify
Auth.configure(amplifyConfig);

type LoginProps = {
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
	setUserProfile: React.Dispatch<React.SetStateAction<any>>;
	setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginComponent: React.FC<LoginProps> = ({ setIsLoggedIn, setUserProfile, setShowLoginModal }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLoginSubmit = async () => {
    try {
		const user = await Auth.signIn(username, password);
		setIsLoggedIn(true);
		setUserProfile(user);
		setShowLoginModal(false);
    } catch (error) {
		console.error("Login failed:", error);
    }};

	return (
		<div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 flex justify-center items-center">
		<div className="bg-white p-4 rounded text-black">
			<h3>Login</h3>
			{/* text color should be black */}
			<input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
			<input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
			<button onClick={handleLoginSubmit}>Submit</button>
			<button onClick={() => setShowLoginModal(false)}>Cancel</button>
		</div>
    </div>
	);
};

export default LoginComponent;
