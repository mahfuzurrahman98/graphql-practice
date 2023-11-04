const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: axios } = require('axios');
const PORT = 4000;

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
      type Todo {
        id: ID!
        title: String!
        completed: Boolean!
        user: User!
      }

      type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        todos: [Todo]
      }

      type Query {
        getTodos: [Todo]
        getUsers: [User]
        getUser(id: ID!): User
        getTodo(id: ID!): Todo
      }
    `,
    resolvers: {
      Todo: {
        user: async (parent) => {
          const user = await axios
            .get(`https://jsonplaceholder.typicode.com/users/${parent.userId}`)
            .then((res) => res.data)
            .catch((err) => console.log(err));
          return user;
        },
      },
      User: {
        todos: async (parent) => {
          const todos = await axios
            .get(
              `https://jsonplaceholder.typicode.com/todos?userId=${parent.id}`
            )
            .then((res) => res.data)
            .catch((err) => console.log(err));
          return todos;
        },
      },
      Query: {
        getTodos: () =>
          axios
            .get('https://jsonplaceholder.typicode.com/todos')
            .then((res) => res.data)
            .catch((err) => console.log(err)),
        getUsers: () =>
          axios
            .get('https://jsonplaceholder.typicode.com/users')
            .then((res) => res.data)
            .catch((err) => console.log(err)),
        getUser: (_, { id }) =>
          axios
            .get(`https://jsonplaceholder.typicode.com/users/${id}`)
            .then((res) => res.data)
            .catch((err) => console.log(err)),
        getTodo: (_, { id }) =>
          axios
            .get(`https://jsonplaceholder.typicode.com/todos/${id}`)
            .then((res) => res.data)
            .catch((err) => console.log(err)),
        getUserTodos: (_, { id }) =>
          axios
            .get(`https://jsonplaceholder.typicode.com/todos?userId=${id}`)
            .then((res) => res.data)
            .catch((err) => console.log(err)),
      },
    },
  });

  app.use(cors());
  app.use(bodyParser.json());

  await server.start();

  app.use('/graphql', expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
  });
}

startServer();
