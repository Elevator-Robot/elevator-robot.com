

export default function LoginWindow() {
    return (
        <>
      <div className="flex items-center justify-center h-screen">
        <div className="w-96 bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-3xl font-semibold text-gray-700 text-center">
            Login
          </h2>
          <form className="mt-6">
            <label htmlFor="email" className="block text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email address"
              autoComplete="email"
              required
              className="block w-full mt-2 text-gray-700 border-gray-300 rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <label htmlFor="password" className="block mt-2 text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="block w-full mt-2 text-gray-700 border-gray-300 rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <button
              type="submit"
              className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
    );
}