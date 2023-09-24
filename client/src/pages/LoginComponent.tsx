import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import amplifyConfig from '../../amplify-config';

Auth.configure(amplifyConfig);

const LoginComponent: React.FC = () => {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [user, setUser] = useState<any>(null);

	const handleSignIn = async () => {
    try {
		const userData = await Auth.signIn(username, password);
		setUser(userData);
		console.log('Successfully signed in:', userData);
    } catch (error) {
    console.error('Error signing in:', error);
    }};

	const handleSignOut = async () => {
    try {
		await Auth.signOut();
		setUser(null);
		console.log('Successfully signed out');
    } catch (error) {
    console.error('Error signing out:', error);
    }};

	return (
    <div>
    {user ? (
        <button onClick={handleSignOut}>Sign Out</button>
    ) : (
        <div>
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignIn}>Sign In</button>
        </div>
    )}
    </div>
	);
};

export default LoginComponent;
