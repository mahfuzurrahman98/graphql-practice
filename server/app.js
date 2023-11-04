const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;

const database = require('./fakeDatabase');

// console.log(database.users[0].name);

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
          const user = database.users.find((user) => user.id === parent.userId);
          return user;
        },
      },
      User: {
        todos: async (parent) => {
          const todos = database.todos.filter(
            (todo) => todo.userId === parent.id
          );
          return todos;
        },
      },
      Query: {
        getTodos: () => database.todos,
        getUsers: () => database.users,
        getUser: (_, { id }) => database.users.find((user) => user.id == id),
        getTodo: (_, { id }) => database.todos.find((todo) => todo.id == id),
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
