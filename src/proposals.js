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

class Proposals extends React.Component {

    async componentDidMount() {
        console.log(`proposal list did mount`)
    }

    render() {
        return (
            <div>
                <h4 style={{ 'marginTop': '20px' , 'textDecoration': 'underline' }}>All Proposals:</h4>
                <p>{this.props.crowdlendProposals}</p>
            </div>
        );  
    }   
}

export default Proposals;
