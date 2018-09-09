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
import crowdlendSchemeArtifacts from '../build/contracts/CrowdLendScheme.json'

class DebtorDao extends React.Component {

    constructor() {
        super();
        this.state ={
            avatarAddress: "0x028c9ceed1b38cfebf7b6a8dd772a727d43c65ff",
            votingMachineAddress: "0x9b17714d4bca0cb6505b1b358ebef998326b6e56",
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
    }

    async componentDidMount() {
      LoggingService.logLevel = LogLevel.all;
      ConfigService.set("estimateGas", true);
      //ConfigService.set("txDepthRequiredForConfirmation.ropsten", 0);
      //ConfigService.set("network", "ropsten");

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

      /*
      const debtorDao = await DAO.at(this.state.avatarAddress)

      const debtorDaoSchemes = await debtorDao.getSchemes()

      const crowdlendSchemeAddress = debtorDaoSchemes[0].address

      const CrowdlendScheme = contract(crowdlendSchemeArtifacts)
      CrowdlendScheme.setProvider(web3.currentProvider)

      const crowdlendScheme = await debtorDaoSchemes.at(crowdlendSchemeAddress)

      console.log(typeof crowdlendScheme)
      */
      votingMachine = await WrapperService.factories.AbsoluteVote.at(
          votingMachineAddress
      );

      this.setState({
          userRep: await this.getUserReputation(web3.eth.accounts[0]),
          totalRep: 2,
      });
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
