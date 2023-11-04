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
  // make a ref to the input field for the user id
  // make a ref to the input field for the todo id
  const userIdRef = useRef();
  const todoIdRef = useRef();

  // we will make 4 functions
  // 1. get all users
  // 2. get a single user
  // 3. get all todos
  // 4. get a single todo

  // there will be 2 buttons for { get all users } and { get all todos }
  // there willl be two input fields for { get a single user } and { get a single todo } with a button for each name fetch

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
  /*
  here is the apollo graphql client interface query
  query ExampleQuery($getUserId: ID!) {
  getUser(id: $getUserId) {
    id
    name
  }
}
  */
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
    const { data } = await client.query({
      query: GET_USER,
      variables: { id: userIdRef.current.value },
    });
    setOutput(data);
  };

  const getTodo = async () => {
    const { data } = await client.query({
      query: GET_TODO,
      variables: { id: todoIdRef.current.value },
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
      <div className="p-6 max-w-lg mx-auto">
        {/* Input section */}
        <div className="space-y-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={getAllTodos}
          >
            Get all todos
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={getAllUsers}
          >
            Get all users
          </button>

          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter user id"
              ref={userIdRef}
              className="border border-gray-300 rounded-md px-3 py-2 w-40"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={getUser}
            >
              Get user
            </button>
          </div>

          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter todo id"
              ref={todoIdRef}
              className="border border-gray-300 rounded-md px-3 py-2 w-40"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={getTodo}
            >
              Get todo
            </button>
          </div>

          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            onClick={clearOutput}
          >
            Clear
          </button>
        </div>

        {/* Output section */}
        <div className="mt-8">
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
