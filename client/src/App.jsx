import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
} from '@apollo/client';
import { useRef, useState } from 'react';

function App() {
  const client = new ApolloClient({
    uri: 'http://127.0.0.1:4000/graphql/',
    cache: new InMemoryCache(),
  });

  const [output, setOutput] = useState({});

  const userIdRef = useRef();
  const todoIdRef = useRef();

  // 1. get all users
  const GET_USERS = gql`
    query {
      getUsers {
        id
        name
        email
        todos {
          id
          title
          completed
        }
      }
    }
  `;

  // 2. get a single user
  const GET_USER = gql`
    query getUser($id: ID!) {
      getUser(id: $id) {
        id
        name
        email
        todos {
          id
          title
          completed
        }
      }
    }
  `;

  // 3. get all todos
  const GET_TODOS = gql`
    query {
      getTodos {
        id
        title
        completed
      }
    }
  `;

  // 4. get a single todo
  const GET_TODO = gql`
    query getTodo($id: ID!) {
      getTodo(id: $id) {
        id
        title
        completed
        user {
          id
          name
          email
        }
      }
    }
  `;

  const getAllTodos = async () => {
    const { data } = await client.query({
      query: GET_TODOS,
    });
    setOutput(data);
  };

  const getAllUsers = async () => {
    const { data } = await client.query({
      query: GET_USERS,
    });
    setOutput(data);
  };

  const getUser = async () => {
    const id = userIdRef.current.value;
    if (!id) {
      alert('Please enter a user id');
      return;
    }
    const { data } = await client.query({
      query: GET_USER,
      variables: { id },
    });
    setOutput(data);
  };

  const getTodo = async () => {
    const id = todoIdRef.current.value;
    if (!id) {
      alert('Please enter a todo id');
      return;
    }
    const { data } = await client.query({
      query: GET_TODO,
      variables: { id },
    });
    setOutput(data);
  };

  const clearOutput = () => {
    setOutput({});
    userIdRef.current.value = '';
    todoIdRef.current.value = '';
  };

  return (
    <ApolloProvider client={client}>
      <div className="grid grid-cols-3 p-4 gap-4">
        {/* Input section */}
        <div className="col-span-3 lg:col-span-1">
          <div className="flex flex-col gap-y-3">
            <div>
              <button
                className="bg-black hover:bg-gray-700 text-white py-2 px-3 rounded w-full"
                onClick={getAllTodos}
              >
                Get all todos
              </button>
            </div>

            <div>
              <button
                className="bg-black hover:bg-gray-700 text-white py-2 px-3 rounded w-full"
                onClick={getAllUsers}
              >
                Get all users
              </button>
            </div>

            <div className="flex gap-x-2">
              <input
                type="text"
                placeholder="Enter the todo id"
                ref={todoIdRef}
                className="border border-gray-600 rounded-md px-2 py-1 w-40 w-full"
              />
              <button
                className="bg-black hover:bg-gray-700 text-white py-1 px-3 rounded w-full"
                onClick={getTodo}
              >
                Get todo
              </button>
            </div>

            <div className="flex gap-x-2">
              <input
                type="text"
                placeholder="Enter the user id"
                ref={userIdRef}
                className="border border-gray-600 rounded-md px-2 py-1 w-40 w-full"
              />
              <button
                className="bg-black hover:bg-gray-700 text-white py-1 px-3 rounded w-full"
                onClick={getUser}
              >
                Get user
              </button>
            </div>

            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded"
              onClick={clearOutput}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Output section */}
        <div className="col-span-3 lg:col-span-2">
          {Object.keys(output).length === 0 ? (
            <div className="text-center text-2xl text-gray-500 mt-10 text-red-600">
              No output
            </div>
          ) : (
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(output, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
