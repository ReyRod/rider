import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";

// Create an HTTP link for regular GraphQL operations
const httpLink = createHttpLink({
  uri: "https://optimal-racer-32.hasura.app/v1/graphql",
});

// Create a WebSocket link for subscriptions
const wsLink = new WebSocketLink({
  uri: "wss://optimal-racer-32.hasura.app/v1/graphql",
  options: {
    reconnect: true,
    connectionParams: async () => {
      const idToken = await SecureStore.getItemAsync("idToken");
      return {
        headers: {
          authorization: idToken ? `Bearer ${idToken}` : "",
        },
      };
    },
  },
});

// Create an auth link to add the idToken to the request headers
const authLink = setContext(async (_, { headers }) => {
  const idToken = await SecureStore.getItemAsync("idToken");
  return {
    headers: {
      ...headers,
      authorization: idToken ? `Bearer ${idToken}` : "",
    },
  };
});

// Split the link based on the operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Create the Apollo client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
