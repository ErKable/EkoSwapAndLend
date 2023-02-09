require("@nomiclabs/hardhat-waffle");
require("@atixlabs/hardhat-time-n-mine");
require("solidity-coverage");
var crypto = require("crypto");
require("dotenv").config();
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: {
    compilers: [ {
      version: "0.8.15",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      }
    },
    {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      }
    },
    {
      version: "0.8.13",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      }
    },
    {
      version: "0.6.12",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      }
    },
    {
      version: "0.5.16",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      }
    },
    {
      version: "0.4.18",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      }
    },
        {
      version: "0.8.3",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        }
      }
    },
  ]
  },
  mocha: {
    timeout: 10000000
  },
  gasReporter: {
    token: 'BNB',
    currency: 'USD',
    gasPrice: 5,
    coinmarketcap: process.env.CMC_API
  },
  etherscan:{
    apiKey: process.env.ETHERSCAN_API
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      forking: {
        url: "https://bsc-dataseed1.defibit.io/"//'https://bsc-dataseed.binance.org/',//"https://bsc-dataseed1.defibit.io/",//"http://localhost:8547", 'https://cronosrpc-1.xstaking.sg'
      },
      accounts: {
        count: 250,
      }
    },
    bsctest: {
      url: "https://data-seed-prebsc-1-s3.binance.org:8545",
      accounts: [
        process.env.TESTNET_PKEY1,
        process.env.TESTNET_PKEY2,
        process.env.TESTNET_PKEY3,
        process.env.TESTNET_PKEY4,
        process.env.TESTNET_PKEY5,
      ],
    },
  }

};
