const path = require("path");
require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const INFURA_ID = process.env.INFURA_KEY;
const MNEMONIC = process.env.MNEMONIC;

module.exports = {
  contracts_build_directory: path.join(__dirname, "build"),
  networks: {
    kovan: {
      provider: () => {
        return new HDWalletProvider(
          MNEMONIC,
          `https://kovan.infura.io/v3/${INFURA_ID}`
        );
      },
      network_id: 42,
    },
  },
  compilers: {
    solc: {
      version: "0.6.8",
    },
  },
};
