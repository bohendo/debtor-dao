var Avatar = artifacts.require("@daostack/arc/Avatar.sol");
var Controller = artifacts.require("@daostack/arc/Controller.sol");
var DaoCreator = artifacts.require("@daostack/arc/DaoCreator.sol");
var ControllerCreator = artifacts.require("@daostack/arc/ControllerCreator.sol");
var AbsoluteVote = artifacts.require("@daostack/arc/AbsoluteVote.sol");
var CrowdLendScheme = artifacts.require("./dao/CrowdLendScheme.sol");
var ContractRegistry = artifacts.require("ContractRegistry");
var CrowdfundingTokenRegistry = artifacts.require("CrowdfundingTokenRegistry");

const GAS_LIMIT = 5900000;

// Organization parameters:
// The DAO name
const orgName = "Debtor DAO";
// The DAO's token name
const tokenName = "Debtor DAO Token";
// Token symbol
const tokenSymbol = "DDT";
// TODO: list founder accounts to givve initial reputation to
var founders;
// TODO: list the token amount per founder account
var foundersTokens;
// TODO: list the reputation amount per founder account
var foundersRep;

const votePrec = 50; // The quorum (percentage) needed to pass a vote in the voting machine

var CrowdLendSchemeInstance;

module.exports = async function(deployer) {

    founders = [web3.eth.accounts[0]];
    foundersTokens = [web3.toWei(0)];
    foundersRep = [web3.toWei(10)];

    deployer
    .deploy(ControllerCreator, { gas: GAS_LIMIT })
    .then(async function() {
        var controllerCreator = await ControllerCreator.deployed();
        await deployer.deploy(DaoCreator, controllerCreator.address);
        var daoCreatorInst = await DaoCreator.deployed(controllerCreator.address);
        // Create DAO:
        var returnedParams = await daoCreatorInst.forgeOrg(
            orgName,
            tokenName,
            tokenSymbol,
            founders,
            foundersTokens, // Founders token amounts
            foundersRep, // FFounders initial reputation
            0, // 0 because we don't use a UController
            0, // no token cap
            { gas: GAS_LIMIT }
        );

        AvatarInst = await Avatar.at(returnedParams.logs[0].args._avatar); // Gets the Avatar address
        var ControllerInst = await Controller.at(await AvatarInst.owner()); // Gets the controller address
        var reputationAddress = await ControllerInst.nativeReputation(); // Gets the reputation contract address

        // Deploy AbsoluteVote Voting Machine:
        await deployer.deploy(AbsoluteVote);

        AbsoluteVoteInst = await AbsoluteVote.deployed();

        // Set the voting parameters for the Absolute Vote Voting Machine
        await AbsoluteVoteInst.setParameters(reputationAddress, votePrec, true);

        // Voting parameters and schemes params:
        var voteParametersHash = await AbsoluteVoteInst.getParametersHash(
            reputationAddress,
            votePrec,
            true
        );

        contractRegistry = await ContractRegistry.deployed();

        await deployer.deploy(CrowdfundingTokenRegistry, contractRegistry.address);

        await deployer.deploy(CrowdLendScheme, contractRegistry.address, CrowdfundingTokenRegistry.address);

    })
    .then(async function() {
        console.log("Your Debtor DAO was deployed successfuly!");
        console.log(`Avatar Address: ${AvatarInst.address}`);
        console.log(`VotingMachine Address: ${AbsoluteVoteInst.address}`);
    });
};
