import React, { FC, useState, FormEvent, useEffect } from 'react';
import { Auth } from 'aws-amplify';

interface LoginModalProps {
    showModal: boolean;
    toggleModal: () => void;
    handleAuthentication: () => void;
}

const LoginModal: FC<LoginModalProps> = ({ showModal, toggleModal, handleAuthentication }) => {
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [verifyPassword, setVerifyPassword] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [showVerificationInput, setShowVerificationInput] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);



    const confirmSignUp = async (email: string, code: string) => {
        setErrorMessage(null);
        try {
            await Auth.confirmSignUp(email, code);
            setShowVerificationInput(false); // Hide the verification input once completed
            console.log('Code accepted.');
        } catch (error : any) {
            if (error.code === 'UserNotConfirmedException') {
                setShowVerificationInput(true);
            } else {
                setErrorMessage(error.message || "An unexpected error occurred.");
                console.error("Authentication error:", error);
            }
        }
    }
    

    const keyPressHandler = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            await handleSignIn(email, password);
        }
    };

    const handleSignIn = async (email: string, password: string) => {
        setErrorMessage(null);
        try {
            await Auth.signIn({
                username: email, // Use email for signing in.
                password
            });
            handleAuthentication(); // This should update isAuthenticated to true
        } catch (error : any) {
            if (error.code === 'UserNotConfirmedException') {
                setShowVerificationInput(true);
            } else {
                setErrorMessage(error.message || "An unexpected error occurred.");
                console.error("Authentication error:", error);
            }
        }
    };
    

    const handleSignUp = async (email: string, password: string) => {
        if(password !== verifyPassword) {
            setErrorMessage("Passwords do not match!"); // Set the error message for mismatched passwords
            return;
        }
    
        setErrorMessage(null);
        try {
            await Auth.signUp({
                username: email,
                password,
                attributes: { email },
            });
            setShowVerificationInput(true);
        } catch (error : any) {
            if (error.code === 'UserNotConfirmedException') {
                setShowVerificationInput(true);
            } else {
                setErrorMessage(error.message || "An unexpected error occurred.");
                console.error("Authentication error:", error);
            }
        }
    }
    

    return (
        <div className={`bg-blue-200 fixed inset-0 flex items-center justify-center ${showModal ? 'block' : 'hidden'}`}>
            <div className={`bg-white p-6 rounded-3xl shadow-2xl w-96 ${isSignUp ? 'w-128' : 'w-96'} shadow-black right-4`}>

                {/* Tabs for Login and Signup */}
                <div className="flex justify-center space-x-4 mb-4">
                    <button 
                        onClick={() => {
                            setIsSignUp(false);
                            setErrorMessage(null); // Clear the error message when switching to Login
                        }}
                        className={`px-4 py-2 ${!isSignUp ? 'font-bold text-lg border-b-4 border-blue-500' : ''}`}>
                        Login
                    </button>
                    <button 
                        onClick={() => {
                            setIsSignUp(true);
                            setErrorMessage(null); // Clear the error message when switching to Signup
                        }}
                        className={`px-4 py-2 ${isSignUp ? 'font-bold text-lg border-b-4 border-blue-500' : ''}`}>
                        Signup
                    </button>
                </div>


                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <input
                        type="text"
                        placeholder="Email"
                        className="mt-1 p-2 w-full rounded-md border"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                {showVerificationInput && (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Verification Code</label>
                            <input
                                type="text"
                                placeholder="Enter Verification Code"
                                className="mt-1 p-2 w-full rounded-md border"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <button
                                onClick={() => confirmSignUp(email, verificationCode)}
                                className="w-full p-2 rounded-md bg-blue-500 text-white font-semibold"
                                disabled={verificationCode.length === 0}
                            >
                                Confirm Code
                            </button>
                        </div>
                    </>
                )}

                {/* Error Message Display */}
                {errorMessage && (
                    <div className="mb-4 text-red-500 bg-red-100 p-2 rounded-md">
                        {errorMessage}
                    </div>
                )}


        <div className="flex justify-between items-center mb-4">
            <button
                onClick={isSignUp ? () => handleSignUp(email, password) : () => handleSignIn(email, password)}
                className="w-full p-2 rounded-md bg-blue-500 text-white font-semibold"
                disabled={email.length === 0 || password.length === 0}
            >
            {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
        </div>


        </div>
    </div>
    );
};


export default LoginModal;
