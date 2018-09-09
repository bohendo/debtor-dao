import React from 'react'
import ReactDOM from 'react-dom'

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

class ProposeCrowdlend extends React.Component {
    constructor() {
        super();
        this.state = {
            principalAmount: 0,
            principalToken: 'NUL',
            interestRate: 0,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        if (target.name == 'amount') {
            this.setState({ principalAmount: event.target.value });
        } else if (target.name == 'token') {
            this.setState({ principalToken: event.target.value });
        } else if (target.name == 'interest') {
            this.setState({ interest: event.target.value });
        }
    }

    async componentDidMount() {
        console.log(`crowdlend proposal did mount`)
    }

    render() {
        return (
            <div>
                <h4 style={{ 'marginTop': '20px' , 'textDecoration': 'underline' }}>Propose a new loan:</h4>
                <label htmlFor="amount">Loan Amount: &nbsp; </label>
                <input name="amount" type='text' onChange={this.handleChange} value={this.state.principalAmount} />
                <br/>
                <label htmlFor="token">Loan Token: &nbsp; </label>
                <input name="token" type='text' onChange={this.handleChange} value={this.state.principalToken} />
                <br/>
                <label htmlFor="interest">Interest Rate: &nbsp; </label>
                <input name="interest" type='text' onChange={this.handleChange} value={this.state.interestRate} />
                <br/>
                <button onClick={() => {this.props.submitCrowdlend(this.state)}} >Submit</button>
            </div>
        );  
    }   
}

export default ProposeCrowdlend;
