import React, { useState, useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";

import Vote from "./contracts/Vote.json";
import { useEagerConnect, useInactiveListener } from "./hooks";

// if (!process.env.REACT_APP_GRAPHQL_ENDPOINT)
//   throw new Error(
//     "REACT_APP_GRAPHQL_ENDPOINT environment variable not defined"
//   );

// const VOTES_QUERY = gql`
//   query votes() {
//     votes() {
//       id
//       voter
//       votedFor
//     }
//   }
// `;

const App = () => {
  const injected = new InjectedConnector({
    supportedChainIds: [42],
  });
  const context = useWeb3React();
  const {
    account,
    active,
    activate,
    connector,
    deactivate,
    library,
    error,
  } = context;

  const [voteContract, setVoteContract] = useState<ethers.Contract>();
  const [totalTrumpVotes, setTotalTrumpVotes] = useState<number>(0);
  const [totalBidenVotes, setTotalBidenVotes] = useState<number>(0);
  const VOTE_ADDRESS = "0x0784993764DcA695B5Eae7cADD5e564b27ddBC79";

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);
  const currentConnector = injected;
  const connected = currentConnector === connector;
  const disabled = !triedEager || connected || !!error;

  useEffect(() => {
    (async () => {
      if (active) {
        try {
          await (window as any).ethereum.enable();
          const provider = new ethers.providers.Web3Provider(
            (window as any).web3.currentProvider
          );
          const wallet = provider.getSigner();

          const instance = new ethers.Contract(VOTE_ADDRESS, Vote.abi, wallet);
          setVoteContract(instance);
          getVoteTotals(instance);
        } catch {
          console.error("Error");
        }
      }
    })();
  }, [active]);

  const getVoteTotals = async (instance: any) => {
    const totalTrumpVotes = await instance.TotalTrumpVotes();
    setTotalTrumpVotes(totalTrumpVotes.toNumber());
    const totalBidenVotes = await instance.TotalBidenVotes();
    setTotalBidenVotes(totalBidenVotes.toNumber());
  };

  if (voteContract) voteContract.on("Voted", () => getVoteTotals(voteContract));

  return (
    <>
      <h3>
        <u>Active Address</u>
      </h3>
      <p>{account}</p>
      <h3>
        <u>Trump Votes</u>
      </h3>
      <p>{totalTrumpVotes}</p>
      <h3>
        <u>Biden Votes</u>
      </h3>
      <p>{totalBidenVotes}</p>
      {!!(library && account) && (
        <>
          <button onClick={() => voteContract!.vote(0)}>Vote Trump</button>
          <button onClick={() => voteContract!.vote(1)}>Vote Biden</button>
        </>
      )}
      {active ? (
        <button onClick={() => deactivate()}>Sign Out</button>
      ) : (
        <button
          disabled={disabled || active}
          onClick={() => activate(injected)}
        >
          Connect to MetaMask
        </button>
      )}
      {/* <Query query={VOTES_QUERY} variables={{}}>
        {({ data, error, loading }: any) => {
          return loading ? (
            <h1>Loading</h1>
          ) : error ? (
            <h1>error {JSON.stringify(error, undefined, 2)}</h1>
          ) : (
            <h1>{data.votes}</h1>
          );
        }}
      </Query> */}
    </>
  );
};

export default App;
