module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 4800000,
      gasPrice: 1
    }
  },
  test_directory: "transpiled/test",
  migrations_directory: "migrations",
};
