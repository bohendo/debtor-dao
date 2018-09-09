import 'babel-polyfill'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

import ProposeCrowdlend from './proposeCrowdlend'
import Proposals from './proposals'

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

class DebtorDao extends React.Component {

    constructor() {
        super();
        this.state ={
            avatarAddress: "0xf81588ecd485cba1e7d27ae149f56767f8a07e30",
            votingMachineAddress: "0x9de9beb3518afe870e6585f7890751bbabc3c02c",
            userRep: 0,
            totalRep: 1,
            crowdlendProposals: [],
        }
        this.submitCrowdlend = this.submitCrowdlend.bind(this);
    }

    submitCrowdlend(crowdlend) {
        console.log(`Adding crowdlend to list`)
        this.setState(prevState => ({
            crowdlendProposals: prevState.crowdlendProposals.concat(crowdlend.principalAmount),
        }));
    }

    async componentDidMount() {
      ConfigService.set("estimateGas", true);
      ConfigService.set("txDepthRequiredForConfirmation.ropsten", 0);
      ConfigService.set("network", "ropsten");

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

      LoggingService.logLevel = LogLevel.all;
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
                <Proposals crowdlendProposals={this.state.crowdlendProposals} />
            </div>
        );  
    }   
}

ReactDOM.render(
    <DebtorDao />,
    document.getElementById('root')
);
