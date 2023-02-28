require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    fantom: {
      url: "https://rpc.ankr.com/fantom_testnet/",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
