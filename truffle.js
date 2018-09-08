var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "name leader inject era mother cotton violin baby disorder hip century earn";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 4800000,
      gasPrice: 1
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/ddb039b0754f4645a34ba26c71a1fdde")
      },
      gas: 4465030,
      network_id: 3
    }
  },
  test_directory: "transpiled/test",
  migrations_directory: "migrations",
};
