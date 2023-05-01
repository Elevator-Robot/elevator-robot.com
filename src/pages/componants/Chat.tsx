import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const Chat = () => {
  const [userMessage, setUserMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Integrate your ChatGPT API to send 'userMessage' and receive a 'response'
    // setResponse(responseFromApi);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-indigo-800 min-h-screen font-sans">
      <header className="container mx-auto px-4 py-4">
        <div className="text-white text-3xl font-bold">Elevator Robot</div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="bg-white shadow-2xl rounded-lg p-10">
          <h2 className="text-2xl font-bold mb-6 text-indigo-600">Start a Conversation</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="user-message" className="block text-gray-700 font-semibold mb-2">Your Message:</label>
              <textarea
                id="user-message"
                name="user-message"
                rows={4}
                className="w-full px-3 py-2 text-gray-700 border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:shadow-outline"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-800 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-md">Send</button>
          </form>
          {response && (
            <div id="response-box" className="mt-8 p-6 border border-indigo-200 rounded-lg bg-indigo-50 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-indigo-600">Elevator Robot\'s Reply:</h3>
              <p id="response-text" className="text-gray-700">{response}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Chat;
