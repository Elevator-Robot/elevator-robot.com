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
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [verifyPassword, setVerifyPassword] = useState<string>('');


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
        if(password !== verifyPassword) {
            console.error("Passwords do not match!");
            return;
        }

        try {
            await Auth.signUp({
                username,
                password,
                attributes: {
                    email: username,
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

                {/* Tabs for Login and Signup */}
                <div className="flex justify-center space-x-4 mb-4">
                    <button 
                        onClick={() => setIsSignUp(false)} 
                        className={`px-4 py-2 ${!isSignUp ? 'font-bold text-lg border-b-4 border-blue-500' : ''}`}>
                        Login
                    </button>
                    <button 
                        onClick={() => setIsSignUp(true)} 
                        className={`px-4 py-2 ${isSignUp ? 'font-bold text-lg border-b-4 border-blue-500' : ''}`}>
                        Signup
                    </button>
                </div>

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
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Verify Password</label>
                            <input
                                type="password"
                                placeholder="Verify Password"
                                className="mt-1 p-2 w-full rounded-md border"
                                value={verifyPassword}
                                onChange={(e) => setVerifyPassword(e.target.value)}
                            />
                        </div>
                    </>
                )}

        <div className="flex justify-between items-center mb-4">
            <button
                onClick={isSignUp ? () => handleSignUp(username, password) : () => handleSignIn(username, password)}
                className="w-full p-2 rounded-md bg-blue-500 text-white font-semibold"
                disabled={username.length === 0 || password.length === 0}
            >
            {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
        </div>

        </div>
    </div>
    );
};


export default LoginModal;
