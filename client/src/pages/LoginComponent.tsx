import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

interface Props {
	onAuthChange: (isAuthenticated: boolean, username: string | null) => void;
}

const LoginComponent: React.FC<Props> = ({ onAuthChange }) => {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const handleSignIn = async () => {
    try {
      // Assuming Auth.signIn is available via a parent component or context
		const userData = await Auth.signIn(username, password);
		onAuthChange(true, userData.username);
		console.log('Successfully signed in:', userData);
    } catch (error) {
		console.error('Error signing in:', error);
    }
};

	const handleSignOut = async () => {
		try {
		// Assuming Auth.signOut is available via a parent component or context
		await Auth.signOut();
		onAuthChange(false, null);
		console.log('Successfully signed out');
		} catch (error) {
		console.error('Error signing out:', error);
		}
	};

	return (
		<div>
			<div>
				<input
					type="text"
					placeholder="Username"
					className='rounded-lg p-4 mb-4'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					className='rounded-lg p-4 mb-4'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button onClick={handleSignIn} className='rounded-lg p-4 mb-4 bg-white'>Sign In</button>
			</div>
		</div>
	);
};

export default LoginComponent;
