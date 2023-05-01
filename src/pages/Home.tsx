import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const Home = () => {
  const [userMessage, setUserMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Integrate your ChatGPT API to send 'userMessage' and receive a 'response'
    // setResponse(responseFromApi);
  };
  

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-indigo-600">
        <div className="container mx-auto px-4 py-4">
          <div className="text-white text-2xl font-bold">Elevator Robot</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Start a Conversation</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="user-message" className="block text-gray-700 font-semibold mb-2">Your Message:</label>
              <textarea
                id="user-message"
                name="user-message"
                rows={3}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Send</button>
          </form>
          {response && (
            <div id="response-box" className="mt-4 p-4 border rounded-lg border-gray-200 bg-gray-100">
              <h3 className="text-xl font-bold mb-2">Elevator Robots Reply:</h3>
              <p id="response-text" className="text-gray-700">{response}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
