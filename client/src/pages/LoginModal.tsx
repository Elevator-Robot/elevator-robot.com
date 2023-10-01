import React, { FC, useState, FormEvent, useEffect } from 'react';
import { Auth } from 'aws-amplify';

interface LoginModalProps {
    showModal: boolean;
    toggleModal: () => void;
    handleAuthentication: () => void;
}

const LoginModal: FC<LoginModalProps> = ({ showModal, toggleModal, handleAuthentication }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isSignUp, setIsSignUp] = useState<boolean>(false);  // New state
    const [extraField, setExtraField] = useState<string>('');   // New state for extra field

    const keyPressHandler = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            await handleSignIn(username, password);
        }
    };

    const handleSignIn = async (username: string, password: string) => {
        try {
            await Auth.signIn(username, password);
            handleAuthentication(); // This should update isAuthenticated to true
        } catch (error) {
            console.error("Authentication error:", error);
        }
    };

    const handleSignUp = async (username: string, password: string) => {
        try {
            await Auth.signUp({
                username,
                password,
                attributes: {
                    email: username,
                    // trim the trailing @ from the user
                    name: username.substring(0, username.indexOf('@')),
                },
            });
            await handleSignIn(username, password);
        } catch (error) {
            console.error("Authentication error:", error);
        }
    }

    return (
        <div className={`bg-blue-200 fixed inset-0 flex items-center justify-center ${showModal ? 'block' : 'hidden'}`}>
            <div className={`bg-white p-6 rounded-3xl shadow-2xl w-96 ${isSignUp ? 'w-128' : 'w-96'} shadow-black right-4`}>
                <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        className="mt-1 p-2 w-full rounded-md border"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={keyPressHandler} // respond to Enter key
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        className="mt-1 p-2 w-full rounded-md border"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={keyPressHandler}  // respond to Enter key
                    />
                </div>
                {isSignUp && (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Extra Field</label>
                <input
                type="text"
                placeholder="Extra Field"
                className="mt-1 p-2 w-full rounded-md border"
                value={extraField}
                onChange={(e) => setExtraField(e.target.value)}
                />
            </div>
        )}

        <div className="flex justify-between items-center mb-4">
            <button
                onClick={() => handleSignIn(username, password)}
                className="w-full p-2 rounded-md bg-blue-500 text-white font-semibold"
                disabled={username.length === 0 || password.length === 0}
            >
            Sign In
            </button>
        </div>

        <div className="flex justify-between items-center mb-4">
            <button
                onClick={() => { setIsSignUp(!isSignUp); }} // Toggle Sign Up mode
                className="w-full p-2 rounded-md bg-blue-500 text-white font-semibold"
            >
            {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
            </button>
        </div>

        {isSignUp && (
            <div className="flex justify-between items-center mb-4">
            <button
                onClick={() => handleSignUp(username, password)}
                className="w-full p-2 rounded-md bg-blue-500 text-white font-semibold"
                disabled={username.length === 0 || password.length === 0}
            >
                Sign Up
            </button>
            </div>
        )}
        </div>
    </div>
  );
};


export default LoginModal;
