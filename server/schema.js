const typeDefs = `#graphql
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
`;

exports.typeDefs = typeDefs;
