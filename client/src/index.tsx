import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <App />
      </Web3ReactProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
