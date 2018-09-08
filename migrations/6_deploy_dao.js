var Avatar = artifacts.require("@daostack/arc/Avatar.sol");
var Controller = artifacts.require("@daostack/arc/Controller.sol");
var DaoCreator = artifacts.require("@daostack/arc/DaoCreator.sol");
var ControllerCreator = artifacts.require(
  "@daostack/arc/ControllerCreator.sol"
);
var AbsoluteVote = artifacts.require("@daostack/arc/AbsoluteVote.sol");
var CrowdLendScheme = artifacts.require("./dao/CrowdLendScheme.sol");
var DebtorDao = artifacts.require("./dao/DebtorDao.sol");

const GAS_LIMIT = 5900000;

// Organization parameters:
// The DAO name
const orgName = "Peepeth DAO";
// The DAO's token name
const tokenName = "Peepeth DAO Token";
// Token symbol
const tokenSymbol = "PDT";
// The ethereum addresses of the "founders"
// TODO: list your accounts to givve initial reputation to
var founders;
// TODO: list the token amount per founder account
// In this example the tokens aren't relevant
// NOTE: the important thing is to make sure the array length match the number of founders
var foundersTokens;
// TODO: list the reputation amount per founder account
var foundersRep;

const votePrec = 50; // The quorum (percentage) needed to pass a vote in the voting machine

var CrowdLendSchemeInstance;

module.exports = async function(deployer) {

  deployer
    .deploy(ControllerCreator, { gas: GAS_LIMIT })
    .then(async function() {
      var controllerCreator = await ControllerCreator.deployed();
      await deployer.deploy(DaoCreator, controllerCreator.address);
      var daoCreatorInst = await DaoCreator.deployed(controllerCreator.address);
      // Create DAO:

      // Set the debtorDao contract address to use
      var debtorDaoAddress = "0x0000000000000000000000000000000000000000";

      await deployer.deploy(CrowdLendScheme, debtorDaoAddress);
      CrowdLendSchemeInstance = await CrowdLendScheme.deployed();

    })
    .then(async () => {

      // @note: You will need your Avatar and Voting Machine addresses to interact with them from the JS files
      console.log("Your Debtor DAO was deployed successfuly!");
    });
};
