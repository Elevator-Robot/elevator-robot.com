import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import { fetchUserAttributes } from "aws-amplify/auth";

const client = generateClient<Schema>();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userAttributes, setUserAttributes] = useState<Record<string, string | undefined> | undefined>();


  const { signOut } = useAuthenticator();

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    async function getUserAttributes() {
      const attributes = await fetchUserAttributes();
      setUserAttributes(attributes);

      const nickname = attributes?.nickname;
      if (nickname) {
        document.title = `${nickname}'s todos`;
      }
      setIsLoading(false);
    }
    getUserAttributes();
  }, []);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  if (isLoading) {
    return null;
  }

  return (
    <main className="flex flex-col items-stretch">
      <h1 className="text-2xl font-bold mb-4">{userAttributes?.nickname}'s todos</h1>
      <button 
        onClick={createTodo}
        className="rounded-lg border border-transparent px-4 py-2 text-base font-medium bg-gray-900 text-white hover:border-indigo-500 transition-colors"
      >
        + new
      </button>
      <ul className="my-2 flex flex-col gap-px bg-black border border-black rounded-lg overflow-auto">
        {todos.map((todo) => (
          <li
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}
            className="bg-white p-2 hover:bg-indigo-50 cursor-pointer"
          >
            {todo.content}
          </li>
        ))}
      </ul>
      <div className="text-center my-4">
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a 
          href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates"
          className="font-bold text-indigo-600 hover:text-indigo-800"
        >
          Review next step of this tutorial.
        </a>
      </div>
      <button 
        onClick={signOut}
        className="rounded-lg border border-transparent px-4 py-2 text-base font-medium bg-gray-900 text-white hover:border-indigo-500 transition-colors"
      >
        Sign out
      </button>
    </main>
  );
}

export default App;
