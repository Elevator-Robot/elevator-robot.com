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
            handleAuthentication();  // Calling the prop function to set isAuthenticated to true
        } catch (error) {
            console.log('error signing in', error);
        }
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center ${showModal ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 rounded-lg">
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        className='rounded-lg p-4 mb-4'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        className='rounded-lg p-4 mb-4'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleSignIn} className='rounded-lg p-4 mb-4 bg-white'>Sign In</button>
            </div>
        </div>
    );
};

export default LoginModal;
