import 'babel-polyfill'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import contract from 'truffle-contract'
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

import ProposeCrowdlend from './proposeCrowdlend'
import Proposals from './proposals'

import avatarArtifacts from '../build/contracts/Avatar.json'
import votingMachineArtifacts from '../build/contracts/AbsoluteVote.json'
import crowdlendSchemeArtifacts from '../build/contracts/CrowdLendScheme.json'

class DebtorDao extends React.Component {

    constructor() {
        super();
        this.state ={
            avatarAddress: "0x31770f01ce3c7de4b91e0b83f1002bb4020941ac",
            votingMachineAddress: "0x09c10a9811b1018a08efd01cf5f3ef27e9e4e18a",
            userRep: 0,
            totalRep: 1,
            crowdlendProposals: [],
        }
        this.submitCrowdlend = this.submitCrowdlend.bind(this);
        this.voteYes = this.voteYes.bind(this);
        this.voteNo = this.voteNo.bind(this);
    }

    voteYes(proposal) {
        console.log(`Voted yes for proposal: ${JSON.stringify(proposal)}`);
    }

    voteNo(proposal) {
        console.log(`Voted no for proposal: ${JSON.stringify(proposal)}`);
    }

    submitCrowdlend(crowdlend) {
        console.log(`Adding crowdlend to list`)
        this.setState(prevState => ({
            crowdlendProposals: prevState.crowdlendProposals.concat(crowdlend),
        }));

        console.log(`still contract? ${window.crowdlendContract}`)

        const termsParameters = '0x0'
        const termsContract = '0x0'
        const principalToken = '0x0'
        const principalAmount = '0x0'
        
        const networkId = Object.keys(crowdlendSchemeArtifacts.networks)[0];
        const crowdlendAddress = crowdlendSchemeArtifacts.networks[networkId].address;

        const crowdlendContract = web3.eth.contract(crowdlendSchemeArtifacts.abi).at(crowdlendAddress);

        console.log(Object.keys(crowdlendContract.proposeDebt))

        const data = crowdlendContract.proposeDebt(
            this.state.avatarAddress,
            termsParameters,
            termsContract,
            principalToken,
            principalAmount,
            1,
            (err, res) => { console.log(`err: ${err}, res: ${res}`) }
        )

    }

    async componentDidMount() {
      LoggingService.logLevel = LogLevel.all;
      ConfigService.set("estimateGas", true);
      //ConfigService.set("txDepthRequiredForConfirmation.ropsten", 0);
      //ConfigService.set("network", "ropsten");

      console.log('tick')
      await InitializeArcJs({
        watchForAccountChanges: true,
        filter: {
          AbsoluteVote: true,
          DaoCreator: true,
          ControllerCreator: true,
          Avatar: true,
          Controller: true
        }
      });
      console.log('tock')

      var CrowdlendScheme = contract(crowdlendSchemeArtifacts);
      var AvatarScheme = contract(avatarArtifacts);
      var VotingMachine = contract(votingMachineArtifacts);


      const networkId = Object.keys(crowdlendSchemeArtifacts.networks)[0]
      window.crowdlendContract = CrowdlendScheme.at(crowdlendSchemeArtifacts.networks[networkId].address);

      this.setState(async prevState => ({
          userRep: await this.getUserReputation(web3.eth.accounts[0]),
          totalRep: 2,
          crowdlendContract: crowdlendContract
      }));

      console.log(`State Initialized`);
    }

    async getUserReputation(account) {
      return 1;
    }

    render() {
        const repMessage = `Your Reputation: ${this.state.userRep} rep (${(this.state.userRep / this.state.totalRep) * 100}%)`;

        return (
            <div>
                <h1>Welcome to the Debtor DAO!</h1>
                <h3>Dharma + DAO Stack = new possibilities</h3>
                <p id="daoAddress">DAO Stack avatar: {this.state.avatarAddress}</p>
                <p id="votingAddress">DAO Stack voter: {this.state.votingMachineAddress}</p>
                <p id="userRep">{repMessage}</p>
                <ProposeCrowdlend submitCrowdlend={this.submitCrowdlend} />
                <Proposals
                    crowdlendProposals={this.state.crowdlendProposals}
                    voteYes={this.voteYes}
                    voteNo={this.voteNo}
                />
            </div>
        );  
    }   
}

ReactDOM.render(
    <DebtorDao />,
    document.getElementById('root')
);
