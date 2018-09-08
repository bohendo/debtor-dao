import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

import {
  InitializeArcJs,
  LoggingService,
  LogLevel,
  DAO,
  ConfigService,
  AccountService,
  WrapperService,
  BinaryVoteResult
} from "@daostack/arc.js";

ReactDOM.render(
    <DebtorDao />,
    document.getElementById('root')
);

class DebtorDao extends React.Component {
    render() {
        console.log('Rendering')
        return (
            <div>
                <h1>Welcome to the Peep DAO Demo!</h1>
                <h3>The first ever DAO on social media</h3>
                <p id="daoAddress"></p>
                <p id="userRep"></p>
                <h4 style="margin-top: 20px; text-decoration: underline;">Propose a new Peep:</h4>
                <input type="text" id="newPeepContent" placeholder="Please enter Peep text" style="width: 600px; height: 50px;"></input>
                <br/>
                <input type="submit" id="proposePeepButton" value="Propose Peep"></input>
                <h4 style="margin-top: 20px; text-decoration: underline;">Peep Proposals</h4>
                <ul id="peepProposalList" style="list-style: none;">
                    <li>
                        <span class="peepProposalText" style="margin-right:25px;">No active proposal found...</span>
                    </li>
                </ul>
            </div>
        );  
    }   
}

// Import the JSON file of our CrowdLendScheme
const crowdLendSchemeArtifacts = require("../build/contracts/CrowdLendScheme.json");
// Import truffle-contract, which we use to interact with non-ArcJS contracts
const contract = require("truffle-contract");

// Initializes the CrowdLendScheme as a contract
// This is not a specific instance but the contract object which can be later initialized
let CrowdLendScheme = contract(crowdLendSchemeArtifacts);

// Default Avatar and Voting Machine addresses when using Ganache cli.
// TODO: Paste here your own instances addresses which can be found in the logs at the end of the migration script.
const avatarAddress = "0xf81588ecd485cba1e7d27ae149f56767f8a07e30";
const votingMachineAddress = "0x9de9beb3518afe870e6585f7890751bbabc3c02c";

var debtorDaoDAO;
var debtorDaoScheme;
var votingMachine;
var userRep;
var totalRep;

async function initialize() {
  // Initialize the ArcJS library
  ConfigService.set("estimateGas", true);
  ConfigService.set("txDepthRequiredForConfirmation.ropsten", 0);
  ConfigService.set("network", "ropsten");

  await InitializeArcJs({
    watchForAccountChanges: true,
    filter: {
      // If you want to use only specific Arc contracts list them here
      AbsoluteVote: true,
      DaoCreator: true,
      ControllerCreator: true,
      Avatar: true,
      Controller: true
    }
  });

  console.log("BinaryVoteResult " + BinaryVoteResult.No);

  LoggingService.logLevel = LogLevel.all; // Remove or modify to change ArcJS logging

  AccountService.subscribeToAccountChanges(() => {
    window.location.reload();
  });

  debtorDaoDAO = await DAO.at(avatarAddress);

  const daoSchemes = await debtorDaoDAO.getSchemes(); // Returns all the schemes your DAO is registered to
  const debtorDaoSchemeAddress = daoSchemes[0].address; // Since our DAO has only 1 scheme it will be the first one

  CrowdLendScheme.setProvider(web3.currentProvider); // Sets the Web3 Provider for a non-ArcJS contract
  debtorDaoScheme = await CrowdLendScheme.at(debtorDaoSchemeAddress); // Initializes a CrowdLendScheme instance with our deployed scheme address

  // Using ArcJS to initializes our Absolute Vote contract instance with the deployed contract address
  votingMachine = await WrapperService.factories.AbsoluteVote.at(
    votingMachineAddress
  );

  $("#daoAddress").text("The DAO address is: " + avatarAddress);

  $("#proposeCrowdLendButton").click(proposeNewCrowdLend);

  // Gets the user reputation and the total reputation supply
  var userAccount = web3.eth.accounts[0];
  userRep = await getUserReputation(userAccount);
  totalRep = web3.fromWei(await debtorDaoDAO.reputation.getTotalSupply());

  $("#userRep").text(
    "Your Reputation: " + userRep + " rep (" + (userRep / totalRep) * 100 + "%)"
  );

  // Loads the debtorDao proposals list
  getCrowdLendProposalsList();
}

function getCrowdLendProposalsList() {
  // clear the existing list
  $("#CrowdLendProposalList li").remove();

  // Get all new proposal events filtered by our Avatar
  const eventFetcher = debtorDaoScheme.NewCrowdLendProposal(
    { _avatar: avatarAddress },
    { fromBlock: 0, toBlock: "latest" }
  );

  eventFetcher.get(function(error, events) {
    events.reverse().forEach(event => {
      // Get the id of the created proposal
      var proposalId = event.args._proposalId;

      // If the proposal is still voteable (wasn't approved or declined yet)
      votingMachine
        .isVotable({ proposalId: proposalId })
        .then(function(isVotable) {
          if (isVotable) {
            // Gets the current votes for the proposals
            votingMachine
              .getCurrentVoteStatus(proposalId)
              .then(function(votes) {
                // Get the hash of the CrowdLend content saved on IPFS
                var debtorDaoHash = event.args._debtorDaoHash;
                // Get the content of the debtorDao from IPFS
                getCrowdLendContentFromHash(debtorDaoHash).then(function(debtorDaoContent) {
                  // Add the debtorDao to the proposals list
                  addCrowdLendToList(proposalId, debtorDaoContent, votes);
                });
              });
          }
        });
    });
  });
}

function addCrowdLendToList(proposalId, debtorDaoContent, votes) {
  // The votes on a CrowdLend should be:
  // 0 - Abstain
  // 1 - Yes
  // 2 - No
  var crowdLendUpvotes = web3.fromWei(votes[1]);
  var crowdLendDownvotes = web3.fromWei(votes[2]);

  // Displays the CrowdLend data in an HTML list item
  var listItem =
    '<li id="' +
    proposalId +
    '">' +
    '<span class="crowdLendProposalText" style="margin-right:25px;">' +
    crowdLendContent +
    "</span>" +
    "<input " +
    (userRep > 0 ? "" : "disabled ") +
    'type="button" value="+" class="upvoteCrowdLend" style="font-size : 30px; text-align: center;" />' +
    '<span class="upvotesCount" style="margin-right:5px;">' +
    (crowdLendUpvotes / totalRep) * 100 +
    "%</span>" +
    "<input " +
    (userRep > 0 ? "" : "disabled ") +
    'type="button" value="-" class="downvoteCrowdLend" style="font-size : 30px; text-align: center;" />' +
    '<span class="downvotesCount" style="margin-right:5px;">' +
    (crowdLendDownvotes / totalRep) * 100 +
    "%</span>" +
    "</li>";
  $("#crowdLendProposalList").append(listItem);

  $("#" + proposalId + " .upvoteCrowdLend").click(function() {
    upvoteCrowdLend(proposalId);
  });
  $("#" + proposalId + " .downvoteCrowdLend").click(function() {
    downvoteCrowdLend(proposalId);
  });
}

function upvoteCrowdLend(proposalId) {
  // Votes in favor of a proposal using the Absolute Voting Machine
  votingMachine
    .vote({ proposalId: proposalId, vote: BinaryVoteResult.Yes })
    .then(getCrowdLendProposalsList);
}

function downvoteCrowdLend(proposalId) {
  // Votes against a proposal using the Absolute Voting Machine
  votingMachine
    .vote({ proposalId: proposalId, vote: BinaryVoteResult.No })
    .then(getCrowdLendProposalsList());
}

async function getUserReputation(account) {
  // Gets a list of the DAO participants with their reputation
  // Here we filter the list to get only the user account
  var participants = await debtorDaoDAO.getParticipants({
    participantAddress: account,
    returnReputations: true
  });

  // If the user is part of the DAO return its reputation
  if (participants.length > 0) {
    return web3.fromWei(participants[0].reputation);
  }

  // If the user has no reputation in the DAO return 0
  return 0;
}

function proposeNewCrowdLend() {
  // Get the proposal content and clears the text from the UI
  var crowdLendContent = $("#newCrowdLendContent").val();
  $("#newCrowdLendContent").val("");

  // Upload the proposal as a CrowdLend to IPFS
  ipfs.addJSON(
    {
      type: "crowdLend",
      content: crowdLendContent,
      pic: "",
      untrustedAddress: avatarAddress,
      untrustedTimestamp: Math.trunc(new Date().getTime() / 1000),
      shareID: "",
      parentID: ""
    },
    (err, crowdLendHash) => {
      if (err) {
        alert(err);
      } else {
        // Sends the new proposal to the CrowdLend Scheme
        var newProposalTx = crowdLendScheme
          .proposeCrowdLend(debtorDao.avatar.address, crowdLendHash, 0, {
            gas: 300000 // Gas used by the transaction (including some safe margin)
          })
          .then(function(result) {
            // Reload the proposals list
            // Please note that on non-local networks this would be updated faster than the transaction will be included in a block
            // To see changes there you'll need to add logic to wait for confirmation or manually refresh the page when the transaction is included
            getCrowdLendProposalsList();
          })
          .catch(console.log);
      }
    }
  );
}

// Returns a JS promise of the content of a crowdLend by its IPFS hash
function getCrowdLendContentFromHash(hash) {
  return new Promise(function(resolve, reject) {
    ipfs.catJSON(hash, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.content);
      }
    });
  });
}

// Call our initialize method when the window is loaded
$(window).on("load", function() {
  initialize();
});
