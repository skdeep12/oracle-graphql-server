import { ApolloServer } from '@apollo/server';

import { startStandaloneServer } from '@apollo/server/standalone';
import neo4j  from 'neo4j-driver';
import { Neo4jGraphQL } from '@neo4j/graphql';

import 'dotenv/config'

// A schema is a collection of type definitions (hence "typeDefs")

// that together define the "shape" of queries that are executed against

// your data.

const typeDefs = `#graphql

  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.


  # This "Book" type defines the queryable fields for every book in our data source.

  type Company {

    name: String

  }
  type Query {
    companies: [Company]
  }

`;

console.log(process.env.NEO4J_URI)

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(
        process.env.NEO4J_USER,
        process.env.NEO4J_PASSWORD,
    ),
);
const neo4j_graphql = new Neo4jGraphQL({
    typeDefs,
    driver,
})
const schema = await neo4j_graphql.getSchema();


// const companies = [
//     {
//       name: 'The Awakening',
//     },
//     {
//       name: 'Paul Auster',
//     },
//   ];

// const resolvers = {

//     Query: {
  
//       companies: () => companies,
  
//     },
  
//   };

  const server = new ApolloServer({
    schema,
  });
  
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  
  //  1. creates an Express app
  
  //  2. installs your ApolloServer instance as middleware
  
  //  3. prepares your app to handle incoming requests
  
  const { url } = await startStandaloneServer(server, {
  
    listen: { port: 4000 },
  
  });
  
  
  console.log(`🚀  Server ready at: ${url}`);