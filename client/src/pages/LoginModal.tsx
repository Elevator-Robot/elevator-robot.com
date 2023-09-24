import React, { FC, useState } from 'react';
import { Auth } from 'aws-amplify';

interface LoginModalProps {
    showModal: boolean;
    toggleModal: () => void;
    handleAuthentication: () => void;
}

const LoginModal: FC<LoginModalProps> = ({ showModal, toggleModal, handleAuthentication }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSignIn = async () => {
        try {
            const user = await Auth.signIn(username, password);
            console.log(user);
            handleAuthentication();
        } catch (error) {
            console.log('error signing in', error);
        }
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-opacity-60 bg-black ${showModal ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-semibold mb-4 text-center">Sign In</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        className="mt-1 p-2 w-full rounded-md border"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    />
                </div>
                <button
                    onClick={handleSignIn}
                    className="w-full p-2 rounded-md bg-blue-500 text-white font-semibold"
                >
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default LoginModal;
